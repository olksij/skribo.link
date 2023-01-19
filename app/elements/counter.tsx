'use client';

import { CSSProperties, useEffect, useRef, useState } from "react";

type CounterProps = {
  value: number, 
  style: CSSProperties,
}

export default function Counter({ value, style }: CounterProps) {
  const [current, setCurrent] = useState<number>(0);

  const transition = async (value: number, current: number) => {
    // await till the frame will pain on screen
    await new Promise(resolve => requestAnimationFrame(resolve));

    // get new value & update it
    const newCurrent = current + (value-current) / 24;
    setCurrent(newCurrent)
  }

  // after value was updated
  useEffect(() => { if (Math.round(current + .5) != value) transition(value, current) }, [value, current])

  return <p style={style}>{ Math.round(current + .5) }s</p>
}