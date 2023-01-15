
import { CSSProperties, useEffect, useRef, useState } from 'react'
import backgrounds from '../backgrounds/import'
import Card from './card'
import Selectable from './selectable'
import patterns from '../patterns/import'

const scaleK = [1, 1.2, 0.9, 1];

import { LottieOptions, useLottie } from "lottie-react";

import animations from "../animations/import";

export default function ThemesWidget({ id, theme, setTheme }: { id: number, theme: number, setTheme: any }) {
  const [scale, setScale] = useState<number>(1);
  const [isPlaying, setPlaying] = useState<boolean>(false);

  /*const options: LottieOptions = { animationData: animations[id], loop: false, autoplay: false, onComplete: () => setPlaying(false) };
  const animation = useLottie(options), { View, animationItem: item } = animation;

  useEffect(() => {
    if (isPlaying && id == theme) { 
      if (179 == item?.currentFrame) animation.stop()
      animation.play();
      item?.addEventListener('enterFrame', event => event.currentTime > event.totalTime - 60 * 0.75 && setPlaying(false))
    }
  }, [animation, id, isPlaying, item, theme]);

  useEffect(() => {
    if (theme == id) setPlaying(true)
  }, [theme, id, scale]);*/

  return <Selectable id={id} selected={theme} setSelected={setTheme} borderRadius={6} scaleCallback={setScale}>
    <div style={{ background: `url(${backgrounds[id]})`, ...styles.card }}>
      <div style={{ background: `url(${patterns[id]})`, ...styles.pattern }}/>
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
