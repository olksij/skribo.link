'use client';

import { CSSProperties, ReactNode, useEffect, useRef } from 'react';

type IndicatorProps = { 
  value: number | null, 
  foreground: boolean, 
  children?: ReactNode | ReactNode[], 
  style?: CSSProperties 
}

export default function Indicator({ value, foreground, children, style }: IndicatorProps) {
  // values to preserve between renders
  const renderer = useRef<boolean>(false);
  const infinite = useRef<boolean>(value ? false : true);
  const lastTime = useRef<number>(performance.now());

  // reference to SVG element
  const spinner = useRef<SVGCircleElement>(null);

  // on frame
  const render = (time: number) => {
    // if spinner was unmounted or value was assigned
    if (!infinite.current || !spinner.current) {
      renderer.current = false;
      return;
    }

    // set as active
    renderer.current = true;
    const passed = time - lastTime.current;

    // count new rotation
    spinner.current.style.transform = `rotate(${450 * passed / 1000 % 360}deg)`;

    // request next render on next frame
    requestAnimationFrame(render)
  }

  useEffect(() => {
    // if not fired and no value is assigned
    if (!renderer.current && !value) requestAnimationFrame(render);

    // when new value was assigned
    if (value) {
      // disable loading animation
      infinite.current = false;

      if (spinner.current) {
        // morph to the current value
        spinner.current!.style.transform = `rotate(360deg)`;
        spinner.current!.style.strokeDasharray = value*88%89 + ', 88';
      }
    }
  })
  
  return <div style={style}>
    { children }
    <svg style={styles.loader} viewBox="0 0 32 32">
      <circle style={{ ...styles.placeholder, stroke: foreground ? '#FFF' : '#000' }} cx="16" cy="16" r={value ? 14 : 12} fill="none"></circle>
      <circle style={{ ...styles.spinner,     stroke: foreground ? '#FFF' : '#000', transition: value ? 'all 1s cubic-bezier(.5, .5, 0, 1), stroke 0s' : '' }} cx="16" cy="16" r={value ? 14 : 12} fill="none" ref={spinner}></circle>
    </svg>
  </div>
}

const styles: Record<string, CSSProperties> = {
  loader: {
    height: 32,
    width: 32,
    transform: 'rotate(270deg)',
    overflow: 'visible'
  },

  spinner: {
    boxSizing: 'border-box',
    strokeWidth: 3,
    strokeLinecap: 'round',
    transformOrigin: '50%',
    strokeDasharray: '22, 68',
  },

  placeholder: {
    strokeWidth: 3,
    opacity: .25,
    strokeLinecap: 'round',
    transition: 'all 1s cubic-bezier(.5, .5, 0, 1), stroke 0s'
  }
}