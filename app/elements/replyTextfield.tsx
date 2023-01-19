'use client';

import { CSSProperties, useEffect, useRef, useState } from 'react';

import { textFont } from '../components/fonts';
import styles from './replyTextfield.module.css';

export default function ReplyTextfield({ onReply }: { onReply: any }) {
  // retreive refs && states
  const [content, setContent] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // fix placeholder
  useEffect(() => {
    document.querySelector(':placeholder')?.setAttribute('color', '#FFF8')
  }, [])

  // on icon tapped
  const sendReply = () => {
    onReply(inputRef.current!.value);
    inputRef.current!.value = '';
    inputRef.current!.blur();
    setContent(null);
  }

  return <div className={styles.container} style={{ position: 'fixed', bottom: 24, left: 24, right: 24 }}>
    <input ref={inputRef} onInput={(e) => setContent(e.currentTarget.value)} type='text' placeholder='Reply to sender' style={ replyArea }/>
    <img onClick={sendReply} style={{ position: 'absolute', padding: 12, right: 0, opacity: content ? 1 : .3 }} src='/sendIcon.svg' alt="Reply Icon"/>
  </div>
}

let replyArea: CSSProperties = {
  boxSizing: 'border-box',
  border: 'none',
  padding: '12px 48px 12px 20px',
  resize: 'none', 
  width: '100%', 
  height: 48,
  borderRadius: 28,
  color: '#FFF',
  backdropFilter: 'blur(48px)',
  WebkitBackdropFilter: 'blur(48px)',
  background: '#0004',
  fontSize: 16,
  lineHeight: 24,
  fontFamily: textFont,
}