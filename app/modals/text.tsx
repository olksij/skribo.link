'use client';

import { CSSProperties, useEffect, useRef } from "react";

import Sheet from 'react-modal-sheet';

// elements
import Card    from "../elements/card";
import Tapable from "../elements/tapable";

// components
import darkenTheme     from "../components/darkenTheme";
import { displayFont } from "../components/fonts";
import { textFont }    from "../components/fonts";

type TextModalProps = {
  isOpen: boolean, 
  text: string | null, 
  setText: (arg0: string | null) => any, 
  onClose: () => any, 
  title: string | null, 
  caption: string | null,
}

export default function TextModal({ isOpen, text, setText, onClose, title, caption }: TextModalProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  isOpen && ref.current?.focus();

  useEffect(() => {
    if (ref.current && text) ref.current.value = text
  }, [text, isOpen])

  useEffect(() => {
    darkenTheme(isOpen)
  }, [isOpen])

  return <Sheet snapPoints={[448, 0]} initialSnap={0} rootId='__next' isOpen={isOpen} onClose={onClose}>
  <Sheet.Container style={{ background: '#EBEBF0' }}>
    <Sheet.Header />
    <Sheet.Content style={{ padding: '0 24px 24px 24px', flexDirection: 'column', gap: 20 }}>
      <div style={{ alignItems: 'center', justifyContent: 'space-between', height: 48, width: '100%' }}>
        <Tapable onTap={onClose} icon='/backIcon.svg' style={{ borderRadius: 12, justifyItems: 'center', height: 48 }}/>
        <p style={{ fontSize: 24, margin: 'revert', fontFamily: displayFont }}>{title}</p>
        <div style={{ width: 48 }}/>
      </div>
      <p style={{ fontFamily: textFont, margin: 'auto', padding: '0 24px', fontSize: 14, color: 'var(--secondary)', textAlign: 'center' }}>{caption}</p>
      <Card outerStyle={{ height: '100%' }}>
        <textarea ref={ref} style={style}/>
      </Card>
      <Card innerStyle={{ background: 'var(--text)' }}>
        <Tapable style={{ justifyContent: 'center' }} onTap={ () => { ref.current!.value && setText(ref.current!.value), onClose() }}>
          <p style={buttonStyle}>Save</p>
        </Tapable>
      </Card>
    </Sheet.Content>
  </Sheet.Container>

  <Sheet.Backdrop />
</Sheet>
}

let style: CSSProperties = {
  padding: '16px',
  height: '100%',
  fontSize: '16px',
  border: 'none',
  resize: 'none',
  outline: 'none',
  fontFamily: textFont,
}

let buttonStyle: CSSProperties = {
  margin: 0,
  color: '#FFF',
  fontSize: '18px',
  fontFamily: displayFont,
}
