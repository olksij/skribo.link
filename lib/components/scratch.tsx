import React, { useEffect, useRef, forwardRef, ForwardedRef }  from 'react';

import styles from '/styles/scratch.module.css'

type PointerEvent = { mouse?: MouseEvent, touch?: TouchEvent }

export default function ScratchCard({ setScratched, image }: { setScratched: any, image: Blob | null }) {
  // HTMLElement references
  let canvasRef = useRef<HTMLCanvasElement>(null);
  let imgRef = useRef<HTMLImageElement>(null);
  let defined = useRef<boolean>(false);

  // stores records for mouse and touch pointers
  let position  = useRef<Record<string, { x: number, y: number }>>({})

  const defineCanvas = async () => {
    defined.current = true;
    let bitmapImage = await createImageBitmap(image!);

    // define
    const canvas  = canvasRef.current!;
    const context = canvas.getContext("2d")!;

    // update width of canvas so it fills the screen
    canvas.width = innerWidth;
    canvas.height = innerHeight;

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
    ).forEach(listener => canvas.addEventListener(...listener));
    
    // fill the canvas with a 🖼️ cover
    context.fillStyle = '#888888'
    context.fillRect(0, 0, innerWidth, innerHeight)
    context.filter = `blur(${innerWidth/4}px)`;
    context.drawImage(bitmapImage, 0, 0, innerWidth, innerHeight)
    context.filter = "blur(0px)";

    imgRef.current!.setAttribute('style', 'display: flex; opacity: 0');

    [canvas, imgRef.current!].forEach((el, i) => el.animate(
      [{ opacity: 0 }, { opacity: 1 }],
      { duration: (i+1) * 600, delay: i * 600, easing: 'cubic-bezier(0.5, 0, 0, 1)' }
    ));

    setTimeout(() => imgRef.current!.setAttribute('style', 'display: flex'), 1600)

    // setup scratch brush
    context.lineWidth = innerWidth/15;
    context.lineJoin = "round";    
  }

  // fired when a new pointer is touched the scratch surface
  const scratchStart = (event: PointerEvent) => array(event).forEach(point =>
    position.current[point.identifier] = { x: point.clientX, y: point.clientY });

  // fired when pointer scratches the surfafce
  const scratchMove = (event: PointerEvent) => {
    const context = canvasRef.current!.getContext("2d")!;

    array(event).forEach(point => {
      // if [position] doesn't incluse the identifier -> do not draw
      if (!position.current[point.identifier]) return;
      setScratched(true);

      let refPosition = position.current[point.identifier];
  
      context.globalCompositeOperation = "destination-out";
      context.beginPath();
      context.moveTo(refPosition.x, refPosition.y);
      context.lineTo(point.clientX, point.clientY);
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
      const canvas  = canvasRef.current!;
      const context = canvas.getContext("2d")!;
      context.clearRect(0, 0, innerWidth, innerHeight); 
      imgRef.current?.remove(); 
    }
  }, [image])

  const scratchEnd = (event: PointerEvent) => {
    array(event).forEach(({ identifier }) => delete position.current[identifier])}

  return <div>
    <img style={{ display: 'none' }} src={image ? URL.createObjectURL(image) : ''} ref={imgRef} className={styles.img} />
    <canvas className={styles.canvas} ref={canvasRef}/>
  </div>;
};

const array = ({ mouse, touch }: PointerEvent) => (touch ? Array.from(touch?.changedTouches) 
  : [{ clientX: mouse!.clientX, clientY: mouse!.clientY, identifier: '#' }]);