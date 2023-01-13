import Head from "next/head";
import { CSSProperties, useEffect, useRef, useState } from "react";

import Sheet from 'react-modal-sheet';
import { displayFont, textFont } from "../../pages/_app";
import Card from "../elements/card";
import Tapable from "../elements/tapable";

export default function TextModal({ isOpen, text, setText, onClose, title, caption }: any) {
  const ref = useRef<HTMLTextAreaElement>(null);

  isOpen && ref.current?.focus();

  useEffect(() => {
    console.log(text, ref.current)
    if (ref.current && text) ref.current.value = text
  }, [text, isOpen])

  useEffect(() => {
    if (isOpen) {
      document.getElementById('metaModalColor')?.setAttribute('name', 'theme-color');
      document.getElementById('metaThemeColor')?.setAttribute('name', '');
    }
    else {
      document.getElementById('metaThemeColor')?.setAttribute('name', 'theme-color');
      document.getElementById('metaModalColor')?.setAttribute('name', '');
    }
  }, [isOpen])

  return <Sheet snapPoints={[448, 0]} initialSnap={0} rootId='__next' isOpen={isOpen} onClose={onClose}>
  <Sheet.Container style={{ background: '#EBEBF0' }}>
    <Sheet.Header />
    <Sheet.Content style={{ padding: '0 24px 24px 24px', flexDirection: 'column', gap: '20px' }}>
      <div style={{ alignItems: 'center', justifyContent: 'space-between', height: '48px', width: '100%' }}>
        <Tapable onTap={onClose} icon='/backIcon.svg' justify="center" height="48px" style={{ borderRadius: 12 }}/>
        <p style={{ fontSize: '24px', margin: 'revert' }} className={ displayFont.className }>{title}</p>
        <div style={{ width: "48px" }}/>
      </div>
      <p style={{ ...textFont.style, margin: 'auto', padding: '0 24px', fontSize: 14, color: 'var(--secondary)', textAlign: 'center' }}>{caption}</p>
      <Card outerStyle={{ height: '100%' }}>
        <textarea ref={ref} style={style} className={textFont.className}/>
      </Card>
      <Card innerStyle={{ background: 'var(--text)' }}>
        <Tapable justifyContent='center' onTap={ () => { ref.current!.value && setText(ref.current!.value), onClose() }}>
          <p className={displayFont.className} style={buttonStyle}>Save</p>
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
}

let buttonStyle: CSSProperties = {
  margin: 0,
  color: '#FFF',
  fontSize: '18px'
}
