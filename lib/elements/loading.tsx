import { CSSProperties } from 'react';
import styles from '../../styles/loading.module.css';

export default function Loading({ style }: { style: CSSProperties }) {
  return <div style={style} className={styles.container}>
    <div/>
  </div>
}