import React, { useEffect, useRef, forwardRef, ForwardedRef, useState }  from 'react';

type DotData = { vx: number, vy: number, x: number, y: number, for: number, since: number }

export default function SpoilerNoise() {
  let canvasRef = useRef<HTMLCanvasElement>(null);
  let dotData   = useRef<DotData[]>([]);
  let lastTime  = useRef<number>();

  let width  = useRef<number>();
  let height = useRef<number>();
  let ratio  = useRef<number>();

  useEffect(() => {
    ratio.current = devicePixelRatio * 4;
    lastTime.current = performance.now();

    width .current = innerWidth  * ratio.current, canvasRef.current?.setAttribute('width',  width .current + 'px');
    height.current = innerHeight * ratio.current, canvasRef.current?.setAttribute('height', height.current + 'px');

    requestAnimationFrame(render);
  }, [])

  const render = (time: number) => {
    let context = canvasRef.current?.getContext('2d');
    if (!context || !width.current || !height.current) return console.error(canvasRef)

    context.clearRect(0, 0, width.current, height.current);
    const passed = time - (lastTime.current ?? time);
    
    dotData.current = dotData.current.map(({ vx, vy, x, y, for: forN, since }: DotData, i) => {
      //                                                           Total time assigned
      //                                                           _________|__________
      context!.fillStyle = '#FFF' + (15 - Math.round(Math.abs(forN - since) / (forN + since) * 15)).toString(16);
      context!.fillRect(x, y, 10, 10);

      vx /= 1.01, vy /= 1.01, x += vx * passed, y += vy * passed, forN -= passed, since += passed;

      if (forN <= 0) { newDot(); return null }

      return { vx, vy, x, y, for: forN, since } as DotData;
    }).filter(value => value != null 
      && (value.x > 0 && value.y > 0 && value.x < width.current! && value.y < height.current!)) as DotData[];

    lastTime.current = time;

    for (let i = 0; i < innerWidth * innerHeight / 100 - dotData.current.length; i++) newDot();

    requestAnimationFrame(render);
  }

  const newDot = () => dotData.current.push({ vx: random(0.5, true), vy: random(0.5, true), 
    x: random(width.current), y: random(height.current), for: random(1000), since: 0 })

  return <canvas style={{ position: 'absolute', width: '100%', height: '100%' }} ref={canvasRef}/>
};

function random(max: number = 0, signed: boolean = false) {
  let min = signed ? -max : 0;
  return Math.random() * (max - min) + min;
}