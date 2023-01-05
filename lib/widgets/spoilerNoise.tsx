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
    if (ratio.current != null) return;

    ratio.current = devicePixelRatio;
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
    console.log(passed)

    var now = performance.now();
    
    dotData.current = dotData.current.map(({ vx, vy, x, y, for: forN, since }: DotData, i) => {
      vx /= 1.25, vy /= 1.25, x += vx * passed, y += vy * passed, forN -= passed, since += passed;
      if (forN <= 0) { newDot(); return null }
      return { vx, vy, x, y, for: forN, since } as DotData;
    }).filter(value => value != null && (value.x > 0 && value.y > 0 && value.x < width.current! && value.y < height.current!)) as DotData[];

    //console.log(performance.now()-now)
    var now = performance.now();

    for (let multY = 0; (multY-1) * 800 < height.current; multY++ ) {
      for (let multX = 0; (multX-1) * 800 < width.current; multX++ ) {
        dotData.current.forEach(({ x, y, for: forN, since }) => { //   Total time assigned
          //                                                           _________|__________
          context!.fillStyle = '#FFF' + (15 - Math.round(Math.abs(forN - since) / (forN + since) * 15)).toString(16);
          context!.fillRect(x + multX*800, y + multY*800, 3, 3);
        })  
      }
    }

    //console.log(performance.now()-now)
    var now = performance.now();

    lastTime.current = time;

    for (let i = 0; i < 200 * 200 / 100 - dotData.current.length; i++) newDot();

    //console.log(performance.now()-now)
    var now = performance.now();

    requestAnimationFrame(render);
  }

  const newDot = () => dotData.current.push({ vx: random(.25, true, true), vy: random(.25, true, true), 
    x: random(800), y: random(800), for: Math.abs(random(500)), since: 0 })

  return <canvas style={{ position: 'absolute', width: '100%', height: '100%', mixBlendMode: 'overlay' }} ref={canvasRef}/>
};

function random(max: number = 0, expo: boolean = false, signed: boolean = false) {
  let random = Math.random() * 2 - 1;
  let result = (expo ? dotPrb(dotPrb(random)) : Math.abs(random)) * (signed ? random / Math.abs(random) : 1) * max;
  return result;
}

const dotPrb = (x: number) => (Math.cos(x * Math.PI + Math.PI) + 1) / 2;