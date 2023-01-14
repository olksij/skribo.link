import { ReactNode, useEffect, useRef, useState } from "react";
import styles from "../../styles/selectable.module.css";

export default function Selectable({ id, selected, setSelected, borderRadius, children, scaleCallback }: { id: number, selected: number, setSelected: any, borderRadius?: number, children: ReactNode, scaleCallback?: any }) {
  const ref = useRef<HTMLDivElement>(null);

  const [scale, setScale] = useState<number>(1);
  const [hovered, setHovered] = useState<boolean>(false);

  let isSelected = selected == id;

  const press   = () => { setScale(.9);  }
  const release = () => { setTimeout(() => setScale(1), 200);  }

  useEffect(() => {
    if (scaleCallback) scaleCallback(scale);
  }, [scale, scaleCallback])

  return <div ref={ ref } className={ [styles.container, isSelected && styles.selected].join(' ') }
      onPointerDown={ press } onPointerUp={ release } onPointerCancel={ release }
      onClick={ () => setSelected(id) } style={{ borderRadius: ((borderRadius ?? 0) + 2) + 'px', transform: `scale(${scale})` }} 
      onMouseEnter={ () => setHovered(true) } onMouseLeave={ () => setHovered(false) }>
    { children }
  </div>
}
