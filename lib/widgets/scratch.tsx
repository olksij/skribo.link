import React, { useEffect, useRef, forwardRef, ForwardedRef, useState }  from 'react';
import * as StackBlur from 'stackblur-canvas';

import styles from '/styles/scratch.module.css'
import SpoilerNoise from './spoilerNoise';

type PointerEvent = { mouse?: MouseEvent, touch?: TouchEvent }

export default function ScratchCard({ setScratched, image, setForeground, theme }: { setScratched: any, image: Blob | null, setForeground: any, theme: number }) {
  // HTMLElement references
  let foregroundRef = useRef<HTMLCanvasElement>(null);
  let backgroundRef = useRef<HTMLCanvasElement>(null);

  let defined = useRef<boolean>(false);

  let [_isScratched, _setScratched] = useState<boolean>(false);

  // stores records for mouse and touch pointers
  let position  = useRef<Record<string, { x: number, y: number }>>({})

  const defineCanvas = async () => {
    defined.current = true;
    let bitmap = await createImageBitmap(image!),
        imgElement  = document.createElement('img');
        imgElement.src = URL.createObjectURL(image!);
    
    await new Promise(resolve => imgElement.onload = resolve);

    // define
    const background  = backgroundRef.current!;
    const foreground  = foregroundRef.current!;
    const bgContext = background.getContext("2d")!;
    const fgContext = foreground.getContext("2d")!;

    // update width of canvas so it fills the screen
    background.width  = innerWidth,  foreground.width  = innerWidth;
    background.height = innerHeight, foreground.height = innerHeight;

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
    
    bgContext.drawImage(bitmap, 0, 0, innerWidth, innerHeight)
    StackBlur.canvasRGB(background, 0, 0, innerWidth, innerHeight, Math.round(Math.min(innerWidth, innerHeight)/4));

    bgContext.fillStyle = '#0002';
    bgContext.fillRect(0, 0, innerWidth, innerHeight)

    // fill the canvas with a 🖼️ cover
    let imageHeight = imgElement.naturalHeight / imgElement.naturalWidth * innerWidth;
    bgContext.drawImage(bitmap, 0, innerHeight / 2 - imageHeight / 2, innerWidth, imageHeight)
    fgContext.strokeStyle = fgContext.createPattern(background, 'no-repeat')!  
    StackBlur.canvasRGB(background, 0, 0, innerWidth, innerHeight, Math.round(Math.min(innerWidth, innerHeight)/5));
    
    // decide UI foreground based on pixel color
    let topPixel = bgContext.getImageData(innerWidth/2, 0, innerWidth/2+1, 1).data;
    setForeground((topPixel[0] + topPixel[1] + topPixel[2]) / 3 < 128);

    background.animate(
      [{ opacity: 0 }, { opacity: 1 }],
      { duration: 600, easing: 'cubic-bezier(0.5, 0, 0, 1)' }
    )

    // setup scratch brush
    fgContext.lineWidth = innerWidth/15;
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

      let refPosition = position.current[point.identifier];
      
      context.beginPath();
      context.moveTo(refPosition.x, refPosition.y);
      context.lineTo(point.clientX + .1, point.clientY + .1);
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
      const canvas  = backgroundRef.current!;
      const context = canvas.getContext("2d")!;
      context.clearRect(0, 0, innerWidth, innerHeight); 
    }
  }, [image])

  const scratchEnd = (event: PointerEvent) => {
    array(event).forEach(({ identifier }) => delete position.current[identifier])}

  return <div style={{ width: '100%' }}>
    <canvas style={{ borderRadius: _isScratched ? 0 : 12 }} className={styles.canvas} ref={backgroundRef}/>
    <SpoilerNoise style={{ opacity: image ? 1 : 0, background: _isScratched ? '#0000' : '#0003', borderRadius: _isScratched ? 0 : 12 }}/>
    <canvas className={styles.canvas} ref={foregroundRef}/>
  </div>;
};

const array = ({ mouse, touch }: PointerEvent) => (touch ? Array.from(touch?.changedTouches) 
  : [{ clientX: mouse!.clientX, clientY: mouse!.clientY, identifier: '#' }]);