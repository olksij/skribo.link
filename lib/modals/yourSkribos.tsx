import { CSSProperties, useEffect, useRef, useState } from "react";

import Sheet from 'react-modal-sheet';
import { displayFont, textFont } from "../../pages/_app";
import Card from "../elements/card";
import Tapable from "../elements/tapable";

export default function YourSkribosModal({ isOpen, text, setText, onClose }: any) {
  return <Sheet snapPoints={[384]} initialSnap={0} rootId='__next' isOpen={isOpen} onClose={onClose}>
  <Sheet.Container style={{ background: '#EBEBF0' }}>
    <Sheet.Header />
    <Sheet.Content style={{ padding: '0 24px 24px 24px', flexDirection: 'column', gap: '20px' }}>
      <div style={{ alignItems: 'center', justifyContent: 'space-between', height: '48px', width: '100%' }}>
        <Tapable onTap={onClose} icon='/backIcon.svg' justify="center" height="48px" background="#0000"/>
        <p style={{ fontSize: '24px' }} className={ displayFont.className }>Your Skribos</p>
        <div style={{ width: "48px" }}/>
      </div>
      <Card>
        <p className={displayFont.className} style={buttonStyle}>skribo name</p>
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
}

let buttonStyle: CSSProperties = {
  margin: 0,
  fontSize: '18px'
}
