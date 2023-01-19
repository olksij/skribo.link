'use client';

import { CSSProperties, ReactNode, useEffect, useRef, useState } from "react";

type SelectableProps = { 
  id: number, 
  selected: number, 
  setSelected: (arg0: number) => any, 
  borderRadius?: number, 
  children: ReactNode, 
  scaleCallback?: (arg0: number) => any, 
}

export default function Selectable({ id, selected, setSelected, borderRadius, children, scaleCallback }: SelectableProps) {
  // parent reference
  const ref = useRef<HTMLDivElement>(null);

  // current animation values
  const [scale, setScale] = useState<number>(1);
  const [hovered, setHovered] = useState<boolean>(false);

  // when selected
  let isSelected = selected == id;

  // on intercation
  const press   = () => { setScale(.9);  }
  const release = () => { setTimeout(() => setScale(1), 200);  }

  // on value change fire child
  useEffect(() => {
    if (scaleCallback) scaleCallback(scale);
  }, [scale, scaleCallback])

  return <div ref={ ref } style={{ ...styles.container, ...(isSelected ? styles.selected : {}), borderRadius: ((borderRadius ?? 0) + 2) + 'px', transform: `scale(${scale})` }}
      onPointerDown={ press } onPointerUp={ release } onPointerCancel={ release } onClick={ () => setSelected(id) } 
      onMouseEnter={ () => setHovered(true) } onMouseLeave={ () => setHovered(false) }>
    { children }
  </div>
}

let styles: Record<string, CSSProperties> = {
  container: {
    transition: '.3s cubic-bezier(.5, 0, 0, 1)',
    padding: 2,
    margin: 2,
    boxShadow: '0 0 0 0px #0000',
  },
  
  selected: {
    boxShadow: '0 0 0 2px #000F',
  }
}