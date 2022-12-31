
import { CSSProperties } from 'react'
import backgrounds from '../backgrounds/import'
import patterns from '../patterns/import'

let emojies = ['🏠', '🍋', '🍓', '🐠']

export default function ThemeCard({ id }: { id: number }) {
  return <div style={{ background: `url(${backgrounds[id]})`, ...styles.card }}>
    <div style={{ background: `url(${patterns[id]})`, ...styles.pattern }}/>
    <p style={styles.emoji}>{emojies[id]}</p>
  </div>
}

let styles: Record<string, CSSProperties> = {
  card: { 
    width: '64px', 
    height: '88px', 
    borderRadius: '6px', 
    justifyContent: 'center', 
    backgroundSize: '88px', 
    overflow: 'hidden', 
    boxShadow: 'inset 0 0 0 1px #0001' 
  },
  pattern: { 
    width: '64px', 
    height: '88px', 
    mixBlendMode: 'overlay', 
    backgroundSize: '88px', 
    position: 'absolute' 
  },
  emoji: { 
    placeSelf: 'center', 
    fontSize: '24px', 
    textShadow: '0 2px 16px #0003' 
  }
}
