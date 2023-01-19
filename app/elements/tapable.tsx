'use client';

import { CSSProperties, ReactNode, useRef, useState } from "react";

type TapableProps = { 
  onTap: () => any, 
  onRemove?: () => any, 
  icon?: string, 
  style?: CSSProperties,
  children?: ReactNode | ReactNode[], 
}

export default function Tapable({ icon, children, onTap, onRemove, style }: TapableProps) {
  // reference & interaction state
  const ref = useRef<HTMLDivElement>(null);
  const [hover,   setHover  ] = useState<boolean>(false);
  const [pressed, setPressed] = useState<boolean>(false);

  // calculate current scale
  const scale = ref.current && pressed ? 1 - 512 / (ref.current.clientWidth * ref.current.clientHeight) : 1;

  return <div ref={ref} style={{ borderRadius: style?.borderRadius, background: hover || pressed ? '#00000009' : '#0000', ...styles.container }}
      onPointerDown={ () => setPressed(true) } onPointerUp ={ () => setPressed(false) } onClick={onTap}
      onMouseEnter ={ () => setHover  (true) } onMouseLeave={ () => setHover  (false) }>

    <div style={{ transform: `scale(${scale})`, ...style, opacity: pressed ? .5 : 1 }}>
      { onRemove && <>
        <img onClick={ (e) => { e.stopPropagation(); onRemove(); }} src='removeIcon.svg' width={20} height={20} alt='Remove'/>
        <div style={{ width: 16 - (style?.gap as number ?? 0) + 'px' }} />
      </> }

      { icon && <img src={icon} width={24} height={24} alt='Icon'/> }
      { children }
    </div>
  </div>
}

let styles: Record<string, CSSProperties> = {
  container: {
    minWidth: 48,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'start',
    padding: 16,
    boxSizing: 'border-box',
    width: '100%',
  }
}
