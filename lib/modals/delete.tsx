import Head from "next/head";
import { CSSProperties, useEffect, useRef, useState } from "react";

import Sheet from 'react-modal-sheet';
import { displayFont, textFont } from "../../pages/_app";
import Card from "../elements/card";
import Tapable from "../elements/tapable";

export default function DeleteModal({ isOpen, onClose }: any) {
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

  return <Sheet detent="content-height" snapPoints={[448, 0]} initialSnap={0} rootId='__next' isOpen={isOpen} onClose={onClose}>
  <Sheet.Container style={{ background: '#EBEBF0' }}>
    <Sheet.Header />
    <Sheet.Content style={{ padding: '0 24px 24px 24px', flexDirection: 'column', gap: '20px' }}>
      <div style={{ alignItems: 'center', justifyContent: 'center', height: '48px', width: '100%' }}>
        <p style={{ fontSize: '24px', margin: 'revert' }} className={ displayFont.className }>You sure?</p>
      </div>
      <Card>
        <Tapable justifyContent='center' onTap={ () => { onClose(false) }}>
          <p className={displayFont.className} style={{ ...buttonStyle, color: 'var(--text)' }}>Cancel</p>
        </Tapable>        
      </Card>
      <Card innerStyle={{ background: '#BF5656' }}>
        <Tapable justifyContent='center' onTap={ () => { onClose(true) }}>
          <p className={displayFont.className} style={buttonStyle}>Delete</p>
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
