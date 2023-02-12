import { CSSProperties } from 'react';

type LoadingProps = { 
  style: CSSProperties 
}

export default function Loading({ style }: LoadingProps) {
  return <div style={{ ...styles.container, ...style }}>
    <div style={{ ...styles.child, animationDelay: '0s' }}/>
    <div style={{ ...styles.child, animationDelay: '.3s' }}/>
    <div style={{ ...styles.child, animationDelay: '.6s' }}/>
  </div>
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
    animationName: 'loading',
    animationDuration: '1.2s',
    animationIterationCount: 'infinite',
  }
}