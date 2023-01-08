import { useRef } from "react";
import styles from "../../styles/tapable.module.css";

export default function Tapable(props: any) {
  const ref = useRef<HTMLDivElement>(null);

  let { icon, children, onTap, onRemove, style } = props;

  const get = () => ref.current!.classList;

  const press   = () => get().add(styles.active);
  const release = () => setTimeout(() => get().remove(styles.active), 200);

  return <div ref={ref} className={styles.container} style={{ ...style, ...props }} 
      onMouseDown={press} onMouseUp={release} onTouchStart={press} onTouchEnd={release}
      onClick={onTap}
      onMouseEnter={() => get().add(styles.hover)} onMouseLeave={() => get().remove(styles.hover)}>
    { onRemove && <><img onClick={ (e) => { e.stopPropagation(); onRemove(); }} src='removeIcon.svg' width='20px' height='20px'/>
                  <div style={{ width: 16 - (props.gap ?? 0) + 'px' }} /></> }
    { icon && <img src={icon} width='24px' height='24px'/> }
    { children }
  </div>
}
