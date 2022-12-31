import { useEffect, useRef, useState } from "react";
import styles from "../../styles/selectable.module.css";

export default function Selectable({ id, selected, setSelected, borderRadius, children }: { id: number, selected: number, setSelected: any, borderRadius?: number, children: any }) {
  const ref = useRef<HTMLDivElement>(null);

  const [pressed, setPressed] = useState<boolean>(false);
  const [hovered, setHovered] = useState<boolean>(false);

  let isSelected = selected == id;

  const get = () => ref.current!.classList;

  const press   = () => setPressed(true);
  const release = () => setTimeout(() => setPressed(false), 200);

  let scale = (1 + (hovered ? 0 : 0)) * (pressed ? .9 : 1);

  return <div ref={ ref } className={ [styles.container, isSelected && styles.selected].join(' ') }
      onMouseDown={ press } onMouseUp={ release } onTouchStart={ press } onTouchEnd={ release }
      onClick={ () => setSelected(id) } style={{ borderRadius: ((borderRadius ?? 0) + 2) + 'px', transform: `scale(${scale})` }} 
      onMouseEnter={ () => setHovered(true) } onMouseLeave={ () => setHovered(false) }>
    { children }
  </div>
}
