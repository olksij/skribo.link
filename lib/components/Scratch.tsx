import React, { useEffect, useRef, useState }  from 'react';

import styles from '/styles/Home.module.css'

import IMG from '../../pages/scratch.webp';

type PointerEvent = { mouse?: MouseEvent, touch?: TouchEvent }

export default function ScratchCard({ children }: any) {
  // HTMLElement references
  let canvasRef = useRef<HTMLCanvasElement>(null);
  let coverRef = useRef<HTMLImageElement>(null);

  // stores records for mouse and touch pointers
  let position  = useRef<Record<string, { x: number, y: number }>>({})

  useEffect(() =>  {
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
    context.drawImage(coverRef.current!, 0, 0, innerWidth, innerHeight)
    coverRef.current!.remove()

    // setup scratch brush
    context.lineWidth = 60;
    context.lineJoin = "round";
  }, [canvasRef, coverRef]);

  // fired when a new pointer is touched the scratch surface
  const scratchStart = (event: PointerEvent) => array(event).forEach(point => {
    position.current[point.identifier] = { x: point.clientX, y: point.clientY }});

  // fired when pointer scratches the surfafce
  const scratchMove = (event: PointerEvent) => {
    const context = canvasRef.current!.getContext("2d")!;

    array(event).forEach(point => {
      // if [position] doesn't incluse the identifier -> do not draw
      if (!position.current[point.identifier]) return;

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

  const scratchEnd = (event: PointerEvent) => {
    array(event).forEach(({ identifier }) => delete position.current[identifier])}


  return (
    <div>
      {children}
      <canvas className={styles.canvas} ref={canvasRef}/>
      <img ref={coverRef} className={styles.img} src={IMG.src}/>
    </div>
  );
}

const array = ({ mouse, touch }: PointerEvent) => (touch ? Array.from(touch?.changedTouches) 
  : [{ clientX: mouse!.clientX, clientY: mouse!.clientY, identifier: '#' }]);