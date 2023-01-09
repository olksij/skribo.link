import { database } from 'firebase-admin';
import { ref as documentRef } from 'firebase/database';
import { CSSProperties, useRef, useState } from 'react';
import { textFont } from '../../pages/_app';
import { encryptData } from '../crypto';
import styles from './replyTextfield.module.css';

export default function ReplyTextfield({ onReply }: { onReply: any }) {
  const [content, setContent] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const sendReply = () => {
    onReply(inputRef.current!.value);
    inputRef.current!.value = '';
    inputRef.current!.blur();
    setContent(null);
  }

  return <div className={styles.container} style={{ position: 'fixed', bottom: 24, left: 24, right: 24 }}>
    <input ref={inputRef} onInput={(e) => setContent(e.currentTarget.value)} type='text' placeholder='Reply to sender' style={{ ...replyArea, ...textFont.style }}/>
    <img onClick={sendReply} style={{ position: 'absolute', padding: 16, right: 0, opacity: content ? 1 : .3 }} src='/sendIcon.svg'/>
  </div>
}

let replyArea: CSSProperties = {
  boxSizing: 'border-box',
  border: 'none',
  padding: '16px 48px 16px 24px',
  resize: 'none', 
  width: '100%', 
  height: 56,
  borderRadius: 28,
  color: '#FFF',
  backdropFilter: 'blur(4px)',
  WebkitBackdropFilter: 'blur(4px)',
  background: '#0004',
  fontSize: 16,
  lineHeight: 24,
}