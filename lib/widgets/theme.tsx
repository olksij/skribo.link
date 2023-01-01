
import { CSSProperties, useState } from 'react'
import backgrounds from '../backgrounds/import'
import Card, { CardType } from '../elements/card'
import Selectable from '../elements/selectable'
import patterns from '../patterns/import'

let emojis = ['🏠', '🍋', '🍓', '🐠']

export default function ThemesWidget({ id, theme, setTheme }: { id: number, theme: number, setTheme: any }) {
  const [scale, setScale] = useState<number>(1);

  return <Selectable id={id} selected={theme} setSelected={setTheme} borderRadius={6} scaleCallback={setScale}>
      <div style={{ background: `url(${backgrounds[id]})`, ...styles.card }}>
        <div style={{ background: `url(${patterns[id]})`, ...styles.pattern }}/>
        <p style={{ ...styles.emoji, transform: `scale(${scale*scale})` }}>{emojis[id]}</p>
      </div>
    </Selectable>
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
    textShadow: '0 2px 16px #0003',
    transition: '.3s cubic-bezier(.5, 0, 0, 1)',
  }
}
