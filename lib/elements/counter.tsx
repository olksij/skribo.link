import { CSSProperties, useEffect, useRef, useState } from "react";

export default function Counter({ value, style }: { value: number, style: CSSProperties }) {
  const [current, setCurrent] = useState<number>(0),
        lastTime = useRef<number>(performance.now());

  const transition = async (value: number, current: number) => {
    await new Promise(resolve => requestAnimationFrame(resolve));

    const newCurrent = current + (value-current) / 24;
    setCurrent(newCurrent)
  }

  useEffect(() => { if (Math.round(current + .5) != value) transition(value, current) }, [value, current])

  return <p style={style}>{ Math.round(current + .5) }s</p>
}