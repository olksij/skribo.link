import { useRef } from "react";
import styles from "../../styles/tapable.module.css";

export default function Tapable({ icon, children, width, height, gap, justify, onTap }: any) {
  const ref = useRef<HTMLDivElement>(null);

  const get = () => ref.current!.classList;

  const press   = () => get().add   (styles.active);
  const release = () => get().remove(styles.active);

  return <div ref={ref} className={styles.container} style={{ width, height, gap, justifyContent: justify }} 
      onMouseDown={press} onMouseUp={release} onTouchStart={press} onTouchEnd={release}
      onClick={onTap}
      onMouseEnter={() => get().add(styles.hover)} onMouseLeave={() => get().remove(styles.hover)}>
    { icon && <img src={icon} width='24px' height='24px'/> }
    { children }
  </div>
}
