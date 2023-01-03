
import { CSSProperties, useEffect, useRef, useState } from 'react'
import backgrounds from '../backgrounds/import'
import Card, { CardType } from '../elements/card'
import Selectable from '../elements/selectable'
import patterns from '../patterns/import'

import { LottieOptions, useLottie } from "lottie-react";

import animations from "../animations/import";

export default function ThemesWidget({ id, theme, setTheme }: { id: number, theme: number, setTheme: any }) {
  const [scale, setScale] = useState<number>(1);
  const [isPlaying, setPlaying] = useState<boolean>(false);

  const options: LottieOptions = { animationData: animations[id], loop: false, autoplay: false, onComplete: () => setPlaying(false) };
  const animation = useLottie(options), { View, animationItem } = animation;

  useEffect(() => {
    if (isPlaying) animation.play();
    else animation.stop();
  }, [animation, isPlaying]);

  useEffect(() => {
    if (theme == id) setPlaying(true)
  }, [theme, id, scale]);

  return <Selectable id={id} selected={theme} setSelected={setTheme} borderRadius={6} scaleCallback={setScale}>
    <div style={{ background: `url(${backgrounds[id]})`, ...styles.card }}>
      <div style={{ background: `url(${patterns[id]})`, ...styles.pattern }}/>
      <p style={{ ...styles.emoji, transform: `scale(${scale*scale})`, height: isPlaying && id == theme ? '48px' : '32px' }}>{View}</p>
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
    height: '48px', 
    textShadow: '0 2px 16px #0003',
    transition: '.5s cubic-bezier(.5, 0, 0, 1)',
  }
}
