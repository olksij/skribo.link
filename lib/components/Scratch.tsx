import React, { useEffect, useRef, useState }  from 'react';

import styles from '/styles/Home.module.css'

import IMG from '../../pages/scratch.webp';

export default function ({ children }: any) {
  let canvasRef = useRef<HTMLCanvasElement>(null);
  let coverRef = useRef<HTMLImageElement>(null);

  let isDrawing = useRef<boolean>(false);
  let position  = useRef({ startX: 0, startY: 0 })

  useEffect(() =>  {

    const canvas = canvasRef.current!;
    const context = canvas.getContext("2d")!;

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    canvas.addEventListener("mousedown", scratchStart);
    canvas.addEventListener("mousemove", scratch);
    canvas.addEventListener("mouseup", scratchEnd);

    canvas.addEventListener("touchstart", scratchStart);
    canvas.addEventListener("touchmove", scratch);
    canvas.addEventListener("touchend", scratchEnd);

    context.drawImage(coverRef.current!, 0, 0, innerWidth, innerHeight)
    context.lineWidth = 60;
    context.lineJoin = "round";

    coverRef.current!.remove()
  }, [canvasRef, coverRef]);

  const scratchStart = ({ layerX, layerY }: any) => {
    isDrawing.current = true;
    position.current = {
      startX: layerX,
      startY: layerY
    };
  };

  const scratch = (e: any) => {
    const { layerX, layerY } = e;
    const context = canvasRef.current!.getContext("2d")!;

    if (!isDrawing.current) return;

    context.globalCompositeOperation = "destination-out";
    context.beginPath();
    context.moveTo(position.current.startX, position.current.startY);
    context.lineTo(layerX, layerY);
    context.closePath();
    context.stroke();

    position.current = {
      startX: layerX,
      startY: layerY
    };
  };

  const scratchEnd = () => isDrawing.current = false;


  return (
    <div>
      {children}
      <canvas className={styles.canvas} ref={canvasRef}/>
      <img ref={coverRef} className={styles.img} src={IMG.src}/>
    </div>
  );
}