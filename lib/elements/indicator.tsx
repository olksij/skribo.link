import { CSSProperties, useEffect, useRef } from 'react';

export default function Indicator({ value, foreground, children }: { value: number | null, foreground: boolean, children?: any }) {
  const renderer = useRef<boolean>(false);
  const infinite = useRef<boolean>(value ? false : true);
  const lastTime = useRef<number>(performance.now());

  const spinner = useRef<SVGCircleElement>(null);

  const render = (time: number) => {
    if (!infinite.current || !spinner.current) {
      renderer.current = false;
      return;
    }
    renderer.current = true;
    const passed = time - lastTime.current;

    spinner.current.style.transform = `rotate(${360 * passed / 1000 % 360}deg)`;

    requestAnimationFrame(render)
  }

  useEffect(() => {
    if (!renderer.current && !value) requestAnimationFrame(render);
    if (value) {
      infinite.current = false;

      if (spinner.current) {
        spinner.current!.style.transform = `rotate(360deg)`;
        spinner.current!.style.strokeDasharray = value*88%89 + ', 88';
      }
    }
  })
  
  return <div>
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