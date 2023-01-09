import React, { useEffect, useRef, forwardRef, ForwardedRef, useState }  from 'react';

import styles from '/styles/scratch.module.css'
import SpoilerNoise from './spoilerNoise';

type PointerEvent = { mouse?: MouseEvent, touch?: TouchEvent }

export default function ScratchCard({ setScratched, image, setForeground, theme }: { setScratched: any, image: Blob | null, setForeground: any, theme: number }) {
  // HTMLElement references
  let foregroundRef = useRef<HTMLCanvasElement>(null);
  let backgroundRef = useRef<HTMLCanvasElement>(null);

  let blurWorker = useRef<Worker | null>(null);

  let defined = useRef<boolean>(false);

  let [_isScratched, _setScratched] = useState<boolean>(false);

  // stores records for mouse and touch pointers
  let position  = useRef<Record<string, { x: number, y: number }>>({})

  useEffect(() => {
    blurWorker.current = new Worker(new URL('../components/blurImage.ts', import.meta.url))
  }, [])

  const defineCanvas = async () => {
    defined.current = true;
    let imgElement  = document.createElement('img');
        imgElement.src = URL.createObjectURL(image!);
    
    await new Promise(resolve => imgElement.onload = resolve);

    // define
    const background  = backgroundRef.current!;
    const foreground  = foregroundRef.current!;
    const bgContext = background.getContext("2d")!;
    const fgContext = foreground.getContext("2d")!;

    const cWidth  = innerWidth  * devicePixelRatio,
          cHeight = innerHeight * devicePixelRatio;

    // update width of canvas so it fills the screen
    background.width  = cWidth,  foreground.width  = cWidth;
    background.height = cHeight, foreground.height = cHeight;

    // register events for the canvas
    new Array<[string, (e: any) => any]>(
      // 🖱️ mouse events
      ["mousedown",  mouse => scratchStart({ mouse })],
      ["mousemove",  mouse => scratchMove({ mouse })],
      ["mouseup",    mouse => scratchEnd({ mouse })],
      // 👆 touch events
      ["touchstart", touch => scratchStart({ touch })],
      ["touchmove",  touch => scratchMove({ touch })],
      ["touchend",   touch => scratchEnd({ touch })],
    // add listeners
    ).forEach(listener => foreground.addEventListener(...listener));
    
    bgContext.drawImage(imgElement, 0, 0, cWidth, cHeight)
    blurWorker.current!.postMessage(bgContext.getImageData(0, 0, cWidth, cHeight))
    await new Promise<MessageEvent>(r => blurWorker.current!.onmessage = r).then(e => {bgContext.putImageData(e.data, 0, 0), console.log('!!!')}) 

    bgContext.fillStyle = '#0002';
    bgContext.fillRect(0, 0, cWidth, cHeight)

    let aspectRatio = imgElement.naturalWidth / imgElement.naturalHeight,
        screenRatio = innerWidth / cHeight, imageWidth, imageHeight;

    aspectRatio > screenRatio // image is wider
      ? (imageWidth  = cWidth,  imageHeight = imageWidth  / aspectRatio)
      : (imageHeight = cHeight, imageWidth  = imageHeight * aspectRatio);

    // fill the canvas with a 🖼️ cover
    bgContext.drawImage(imgElement, cWidth / 2 - imageWidth / 2, cHeight / 2 - imageHeight / 2, imageWidth, imageHeight)
    fgContext.strokeStyle = fgContext.createPattern(background, 'no-repeat')!  
    blurWorker.current!.postMessage(bgContext.getImageData(0, 0, cWidth, cHeight))
    await new Promise<MessageEvent>(r => blurWorker.current!.onmessage = r).then(e => {bgContext.putImageData(e.data, 0, 0), console.log('!!!')}) 
    
    // decide UI foreground based on pixel color
    let topPixel = bgContext.getImageData(cWidth/2, 0, cWidth/2+1, 1).data;
    setForeground((topPixel[0] + topPixel[1] + topPixel[2]) / 3 < 128);

    background.animate(
      [{ opacity: 0 }, { opacity: 1 }],
      { duration: 600, easing: 'cubic-bezier(0.5, 0, 0, 1)' }
    ), background.style.opacity = '1';

    // setup scratch brush
    fgContext.lineWidth = Math.sqrt(cWidth * cHeight)/10;
    fgContext.lineJoin = "round";  
  }

  // fired when a new pointer is touched the scratch surface
  const scratchStart = (event: PointerEvent) => (array(event).forEach(point =>
    position.current[point.identifier] = { x: point.clientX, y: point.clientY }), scratchMove(event));

  // fired when pointer scratches the surfafce
  const scratchMove = (event: PointerEvent) => {
    const context = foregroundRef.current!.getContext("2d")!;

    array(event).forEach(point => {
      // if [position] doesn't incluse the identifier -> do not draw
      if (!position.current[point.identifier]) return;
      setScratched(true), _setScratched(true);

      let refPosition = position.current[point.identifier],
          rt = devicePixelRatio;
      
      context.beginPath();
      context.moveTo(refPosition.x * rt, refPosition.y * rt);
      context.lineTo(point.clientX * rt + .1, point.clientY * rt + .1);
      context.closePath();
      context.stroke();
  
      position.current[point.identifier] = {
        x: point.clientX,
        y: point.clientY,
      };  
    })  
  };

  useEffect(() => {
    if (image && !defined.current) defineCanvas()
    if (!image && defined.current) {
      backgroundRef.current!.remove()
      foregroundRef.current!.remove()
    }
  }, [image])

  const scratchEnd = (event: PointerEvent) => {
    array(event).forEach(({ identifier }) => delete position.current[identifier])}

  return <div style={{ width: '100%' }}>
    <canvas style={{ borderRadius: _isScratched ? 0 : 16, opacity: 0 }} className={styles.canvas} ref={backgroundRef}/>
    <SpoilerNoise style={{ opacity: image ? 1 : 0, background: _isScratched ? '#0000' : '#0003', borderRadius: _isScratched ? 0 : 16 }}/>
    <canvas className={styles.canvas} ref={foregroundRef}/>
  </div>;
};

const array = ({ mouse, touch }: PointerEvent) => (touch ? Array.from(touch?.changedTouches) 
  : [{ clientX: mouse!.clientX, clientY: mouse!.clientY, identifier: '#' }]);