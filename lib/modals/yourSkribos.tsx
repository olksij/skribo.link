import { CSSProperties, useEffect, useRef, useState } from "react";

import Sheet from 'react-modal-sheet';
import { displayFont, textFont } from "../../pages/_app";
import Card from "../elements/card";
import Tapable from "../elements/tapable";

export default function YourSkribosModal({ isOpen, onClose, skribos }: { isOpen: any, onClose: any, skribos: Record<string, Record<string, any>> | null}) {
  return <Sheet snapPoints={[.5]} initialSnap={0} rootId='__next' isOpen={isOpen} onClose={onClose}>
  <Sheet.Container style={{ background: '#EBEBF0' }}>
    <Sheet.Header />
    <Sheet.Content style={{ padding: '0 24px 24px 24px', flexDirection: 'column', gap: '16px' }}>
      <div style={{ alignItems: 'center', justifyContent: 'space-between', height: '48px', width: '100%' }}>
        <Tapable onTap={onClose} icon='/backIcon.svg' justify="center" height="48px" background="#0000"/>
        <p style={{ fontSize: '24px', margin: 'revert' }} className={ displayFont.className }>Your Skribos</p>
        <div style={{ width: "48px" }}/>
      </div>
      { skribos ? (Object.keys(skribos).length ? Object.keys(skribos).map(id => {
        return <Card key={id}>
          <Tapable onClick={() => {}} style={{ flexDirection: 'row', padding: 12, gap: 16 }}>
            <img style={{ width: 56, height: 72, objectFit: 'cover', borderRadius: 4 }} src={URL.createObjectURL(new Blob([skribos[id].image]))}/>
            <div style={{ flexDirection: 'column', justifyContent: 'center', gap: 4, width: '100%' }}>
              <p style={{ ...displayFont.style, fontSize: 20, color: 'var(--text)' }}>{skribos[id].label ?? 'No label'}</p>
              <p style={{ ...textFont.style, fontSize: 14, color: 'var(--secondary)' }}>{ skribos[id].replies.length } replies</p>
            </div>
            <p style={{ ...textFont.style, fontSize: 12, color: 'var(--secondary)', marginBottom: 'auto', marginTop: 8 }}>{new Date(skribos[id].created).toLocaleString()}</p>
          </Tapable>
        </Card>
      }) : <p style={{ ...textFont.style, margin: 'auto', fontSize: 14, color: 'var(--secondary)' }}>No skribos yet</p>
    ) : <p>Loading</p> }
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
