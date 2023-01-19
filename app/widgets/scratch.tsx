'use client';

import React, { useEffect, useRef, forwardRef, ForwardedRef, useState }  from 'react';

import styles from '/styles/scratch.module.css'
import SpoilerNoise from './spoilerNoise';

import backgrounds from '../../assets/backgrounds/import';
import patterns    from '../../assets/patterns/import';

type PointerEvent = { mouse?: MouseEvent, touch?: TouchEvent }

export default function ScratchCard({ setScratched, image, setForeground, theme, text, reply }: { setScratched: any, image?: Blob | null, setForeground: any, theme: number, text?: string | null, reply: boolean }) {
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
    let imgElement:    HTMLImageElement | null = null,
        imgBackground: HTMLImageElement | null = null,
        imgPattern:    HTMLImageElement | null = null;

    defined.current = true;

    if (image) {
      imgElement = document.createElement('img'),
      imgElement.src = URL.createObjectURL(image);
      await new Promise(resolve => imgElement!.onload = resolve);
    }
    else {
      imgBackground = document.createElement('img'), imgPattern = document.createElement('img');
      imgBackground.src = backgrounds[theme],        imgPattern.src = patterns[theme];
      await new Promise(resolve => imgBackground!.onload = resolve);
      await new Promise(resolve => imgPattern!.onload = resolve);
    }

    // define
    const background  = backgroundRef.current!;
    const foreground  = foregroundRef.current!;
    const bgContext = background.getContext("2d")!;
    const fgContext = foreground.getContext("2d")!;

    const rt = devicePixelRatio;

    const cWidth  = innerWidth  * rt,
          cHeight = innerHeight * rt;

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

    bgContext.fillStyle = '#000';
    bgContext.fillRect(0, 0, cWidth, cHeight)

    const toCanvas = ({ image, canvas: source }: { image?: ImageData, canvas?: HTMLCanvasElement }) => {
      const canvas = document.createElement('canvas');
      canvas.width = (image ?? source!).width, canvas.height = (image ?? source!).height;

      image && canvas.getContext('2d')!.putImageData(image, 0, 0);
      source && canvas.getContext('2d')!.drawImage(source, 0, 0);

      return canvas;
    }

    const resizeImage = (image: HTMLCanvasElement, factor: number) => {
      const width = image.width * factor, height = image.height * factor;
      const canvas = document.createElement('canvas');

      canvas.width = width, canvas.height = height;
      canvas.getContext('2d')!.drawImage(image, 0, 0, width, height);
      return canvas;
    }

    const blurCanvas = async () => {
      const factor = 360 / Math.min(cWidth, cHeight);

      const resized = resizeImage(background, factor);
      let image = resized.getContext('2d')!.getImageData(0, 0, resized.width, resized.height)
      resized.remove();

      blurWorker.current!.postMessage(image)
      return await new Promise<MessageEvent>(r => blurWorker.current!.onmessage = r)
        .then(e => bgContext.drawImage(resizeImage(toCanvas({ image: e.data }), 1/factor), 0, 0))
    }

    const drawPattern = () => {
      bgContext.drawImage(imgBackground!, 0, 0, cWidth, cHeight)
      bgContext.globalCompositeOperation = 'overlay';
      bgContext.globalAlpha = .3;
      bgContext.drawImage(imgPattern!, 0, 0, cWidth, cHeight)
      bgContext.globalCompositeOperation = 'source-over';
      bgContext.globalAlpha = 1;
    }

    // draw blurred background
    
    if (imgElement) {
      bgContext.drawImage(imgElement, 0, 0, cWidth, cHeight); 
      bgContext.fillStyle = '#FFF1';
      bgContext.fillRect(0, 0, cWidth, cHeight)
    }
    else drawPattern();
    
    await blurCanvas();

    const blurredCanvas = toCanvas({ canvas: background });
    const blurredCanvasContext = blurredCanvas.getContext('2d')!
    blurredCanvasContext.globalCompositeOperation = 'luminosity';
    blurredCanvasContext.fillStyle = '#EEE';
    blurredCanvasContext.fillRect(0, 0, cWidth, cHeight)
    blurredCanvasContext.globalCompositeOperation = 'source-over';

    // draw a potential unscratched image

    if (imgElement) {
      let aspectRatio = imgElement.naturalWidth / imgElement.naturalHeight,
          screenRatio = innerWidth / cHeight, imageWidth, imageHeight;

      aspectRatio > screenRatio // image is wider
        ? (imageWidth  = cWidth,  imageHeight = imageWidth  / aspectRatio)
        : (imageHeight = cHeight, imageWidth  = imageHeight * aspectRatio);

      bgContext.drawImage(imgElement, cWidth / 2 - imageWidth / 2, cHeight / 2 - imageHeight / 2, imageWidth, imageHeight)
    }

    else drawPattern();

    // fill text

    
    if (text) {
      let lines: { text: string[], width: number }[] = [{ text: [], width: 0 }],
          words = text?.split(' ') ?? [];

      const whitespace = bgContext.measureText(' ').width,
            maxWidth   = (innerWidth - 96) * rt;

      bgContext.textAlign = 'center';
      bgContext.font = (16 * rt) + 'px text'

      words.forEach(word => {
        let width = bgContext.measureText(word).width,
            line = lines.length - 1, spaced = whitespace + width;
              
        if (lines[line].width + spaced <= maxWidth)
          lines[line].text.push(word), lines[line].width += lines[line].text.length > 1 ? spaced : width;

        else lines.push({ text: [word], width })
      });

      bgContext.fillStyle = bgContext.createPattern(blurredCanvas, 'no-repeat')!;

      const padding = imgElement ? (reply ? 72 * rt : 0) : cHeight / 2 - (40 + lines.length * 24) * rt

      bgContext.strokeStyle = '#0008';
      bgContext.lineWidth = rt;      

      bgContext.shadowBlur = 32 * rt;
      bgContext.shadowColor = '#0002';
      bgContext.shadowOffsetY = 12 * rt;
      
      bgContext.beginPath()
      bgContext.roundRect(24 * rt, cHeight - 24 * rt - padding, cWidth - 48 * rt, (40 + lines.length * 24) * rt * -1, 12 * rt)
      bgContext.globalCompositeOperation = 'overlay';
      bgContext.stroke()
      bgContext.fill()
      bgContext.globalCompositeOperation = 'source-over';
      
      bgContext.beginPath()
      bgContext.roundRect(24 * rt, cHeight - 24 * rt - padding, cWidth - 48 * rt, (40 + lines.length * 24) * rt * -1, 12 * rt)
      bgContext.fill()

      bgContext.fillStyle = 'black'
      bgContext.textBaseline = 'bottom'
      lines.forEach((line, i) => bgContext.fillText(line.text.join(' '), cWidth/2, (innerHeight - 24 - (lines.length - i) * 24) * rt - padding))
    }

    // save the canvas and blur it
    fgContext.strokeStyle = fgContext.createPattern(background, 'no-repeat')!
    await blurCanvas();

    bgContext.globalCompositeOperation = 'overlay';
    bgContext.fillStyle = '#0002';
    bgContext.fillRect(0, 0, cWidth, cHeight)
    bgContext.globalCompositeOperation = 'source-over';
    
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
    if ((image || text) && !defined.current) defineCanvas()
    if (!(image || text) && defined.current) {
      backgroundRef.current!.remove()
      foregroundRef.current!.remove()
    }
  }, [image, text])

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