import { CSSProperties, useEffect, useRef, useState } from "react";

export default function Counter({ value, style }: { value: number, style: CSSProperties }) {
  const [current, setCurrent] = useState<number>(0),
        lastTime = useRef<number>(performance.now());

  const transition = (time: number) => {
    const passed = time - lastTime.current;

    setCurrent(Math.round((current + (value-current)/24)*10)/10);
    console.log(value)

    lastTime.current = time;
    
    if (Math.abs(current-value) > 1) requestAnimationFrame(transition);
  }

  useEffect(() => { if (Math.abs(current-value) > 1) requestAnimationFrame(transition) })

  return <p style={style}>{ Math.round(current) }s</p>
}