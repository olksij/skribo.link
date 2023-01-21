'use client';

import { CSSProperties, useEffect } from "react";

import Sheet from 'react-modal-sheet';

// elements
import Tapable from "../elements/tapable";
import Card    from "../elements/card";

// components
import   darkenTheme   from "../components/darkenTheme";
import { displayFont } from "../components/fonts";

type DeleteModalProps = {
  isOpen: boolean,
  onClose: (arg0?: boolean) => any,
}

export default function DeleteModal({ isOpen, onClose }: DeleteModalProps) {
  useEffect(() => {
    // darken thee when open
    darkenTheme(isOpen);
  }, [isOpen])

  return <Sheet detent="content-height" snapPoints={[448, 0]} initialSnap={0} rootId='__next' isOpen={isOpen} onClose={onClose}>
  <Sheet.Container style={{ background: '#EBEBF0' }}>
    <Sheet.Header />
    <Sheet.Content style={{ padding: '0 24px 24px 24px', flexDirection: 'column', gap: '20px' }}>

      <div style={{ alignItems: 'center', justifyContent: 'center', height: '48px', width: '100%' }}>
        <p style={{ fontSize: '24px', margin: 'revert', fontFamily: displayFont }}>You sure?</p>
      </div>

      <Card>
        <Tapable style={{ justifyContent: 'center' }} onTap={ () => { onClose(false) }}>
          <p style={{ ...buttonStyle, color: 'var(--text)' }}>Cancel</p>
        </Tapable>        
      </Card>

      <Card innerStyle={{ background: '#BF5656' }}>
        <Tapable style={{ justifyContent: 'center' }} onTap={ () => { onClose(true) }}>
          <p style={buttonStyle}>Delete</p>
        </Tapable>        
      </Card>

    </Sheet.Content>
  </Sheet.Container>

  <Sheet.Backdrop />
</Sheet>
}

let buttonStyle: CSSProperties = {
  margin: 0,
  color: '#FFF',
  fontSize: '18px',
  fontFamily: displayFont
}
