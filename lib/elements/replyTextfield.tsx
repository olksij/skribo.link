import { CSSProperties, useState } from 'react';
import { textFont } from '../../pages/_app';
import styles from './replyTextfield.module.css';

export default function ReplyTextfield() {
  const [content, setContent] = useState<string | null>(null);

  return <div className={styles.container} style={{ position: 'fixed', bottom: 24, left: 24, right: 24 }}>
    <input onInput={(e) => setContent(e.currentTarget.value)} type='text' placeholder='Reply to sender' style={{ ...replyArea, ...textFont.style }}/>
    <img style={{ position: 'absolute', padding: 16, right: 0, opacity: content ? 1 : .3 }} src='/sendIcon.svg'/>
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
