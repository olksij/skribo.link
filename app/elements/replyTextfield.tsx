'use client';

import { CSSProperties, useEffect, useRef, useState } from 'react';

// components
import { textFont } from '../components/fonts';

// icons
import sendIcon from '../../assets/icons/send.svg';

type ReplyTextfieldProps = {
  onReply: (arg0: string) => any
}

export default function ReplyTextfield({ onReply }: ReplyTextfieldProps) {
  // retreive refs && states
  const [content, setContent] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // on icon tapped
  const sendReply = () => {
    onReply(inputRef.current!.value);
    inputRef.current!.value = '';
    inputRef.current!.blur();
    setContent(null);
  }

  return <div style={{ position: 'fixed', bottom: 24, left: 24, right: 24 }}>
    <input ref={inputRef} onInput={(e) => setContent(e.currentTarget.value)} type='text' placeholder='Reply to sender' style={ replyArea }/>
    <img onClick={sendReply} style={{ position: 'absolute', padding: 12, right: 0, opacity: content ? 1 : .3 }} src={sendIcon.src} alt="Reply Icon"/>
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
