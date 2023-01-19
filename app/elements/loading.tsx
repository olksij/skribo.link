import { CSSProperties } from 'react';

export default function Loading({ style }: { style: CSSProperties }) {
  return <div style={{ ...styles.container, ...style }}><div style={ styles.child }/></div>
}

let styles: Record<string, CSSProperties> = {
  container: {
    display: 'flex',
    gap: 8,
  },

  child: {
    height: 8,
    width: 8,
    content: '',
    background: '#3F3C49',
    borderRadius: 4,  
  }
}