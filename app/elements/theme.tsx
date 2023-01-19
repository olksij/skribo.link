'use client';

import { CSSProperties, useEffect, useRef, useState } from 'react'
import backgrounds from '../../assets/backgrounds/import'
import Selectable from './selectable'
import patterns from '../../assets/patterns/import'

const scaleK = [1, 1.2, 0.9, 1];

import { LottieOptions, useLottie } from "lottie-react";

import animations from "../../assets/animations/import";

type ThemesProps = { 
  id: number, 
  theme: number, 
  setTheme: (arg0: number) => any, 
}

export default function ThemesWidget({ id, theme, setTheme }: ThemesProps) {
  // define states
  const [scale, setScale] = useState<number>(1);
  const [isPlaying, setPlaying] = useState<boolean>(false);

  // animation initialization
  const options: LottieOptions = { animationData: animations[id], loop: false, autoplay: false, onComplete: () => setPlaying(false) };
  const animation = useLottie(options), { View, animationItem: item } = animation;

  // on initialization play/pause
  useEffect(() => {
    if (isPlaying && id == theme) { 
      if (179 == item?.currentFrame) animation.stop()
      animation.play();
      item?.addEventListener('enterFrame', event => event.currentTime > event.totalTime - 60 * 0.75 && setPlaying(false))
    }
  }, [animation, id, isPlaying, item, theme]);

  // on selected play animation
  useEffect(() => {
    if (theme == id) setPlaying(true)
  }, [theme, id, scale]);

  return <Selectable id={id} selected={theme} setSelected={setTheme} borderRadius={6} scaleCallback={setScale}>
    <div style={{ background: `url(${backgrounds[id]})`, ...styles.card }}>
      <div style={{ background: `url(${patterns[id]})`, ...styles.pattern }}/>
      <p style={{ ...styles.emoji, transform: `scale(${scale*scale*scaleK[id]})`, height: isPlaying && id == theme ? '42px' : '32px' }}>{View}</p>
    </div>
  </Selectable>
}

let styles: Record<string, CSSProperties> = {
  card: { 
    width: 64, 
    height: 88, 
    borderRadius: 6, 
    justifyContent: 'center', 
    backgroundSize: 88, 
    overflow: 'hidden', 
    boxShadow: 'inset 0 0 0 1px #0001'
  },

  pattern: { 
    width: 64, 
    height: 88, 
    mixBlendMode: 'overlay', 
    backgroundSize: 88, 
    position: 'absolute' 
  },

  emoji: { 
    placeSelf: 'center', 
    height: 48, 
    textShadow: '0 2px 16px #0003',
    transition: '.5s cubic-bezier(.5, 0, 0, 1)',
  }
}
