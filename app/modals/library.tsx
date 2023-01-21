'use client';

import { CSSProperties, useEffect, useRef, useState } from "react";

import Sheet, { SheetRef } from 'react-modal-sheet';

// elements
import Tapable from "../elements/tapable";
import Card    from "../elements/card";

// componnets
import   darkenTheme   from "../components/darkenTheme";
import { displayFont } from "../components/fonts";
import { textFont }    from "../components/fonts";

// modals
import SkriboDetails from "./detail";

// icons
import backIcon from '../../assets/icons/back.svg';
import fireIcon from '../../assets/icons/fire.svg';

type LibraryModalProps = { 
  isOpen: boolean, 
  onClose: () => any, 
  skribos: Record<string, Record<string, any>> | null
}

export default function LibraryModal({ isOpen, onClose, skribos }: LibraryModalProps) {
  // declare refs
  const ref = useRef<SheetRef>();
  const [modal, setModal] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    // darken when opened
    darkenTheme(isOpen)
  }, [isOpen])

  return <Sheet ref={ref} detent='content-height' rootId='__next' isOpen={isOpen} onClose={onClose}>
  <Sheet.Container style={{ background: '#EBEBF0' }}>
    <Sheet.Header />
    <Sheet.Content disableDrag={true} style={{ padding: '0 24px 24px 24px', flexDirection: 'column', gap: 16, minHeight: 256 }}>
      <div style={{ alignItems: 'center', justifyContent: 'space-between', height: 48, width: '100%' }}>
        <Tapable onTap={onClose} icon={backIcon.src} style={{ borderRadius: 12, justifyContent: 'center', height: 48, width: 56 }}/>
        <p style={{ fontSize: 24, margin: 'revert', fontFamily: displayFont }}>Your Skribos</p>
        <div style={{ width: 48 }}/>
      </div>

      { skribos ? (Object.keys(skribos).length ? Object.keys(skribos).map(id => {
        // retrieve current skribo
        let skribo = skribos[id];
        let image = skribo.image ? URL.createObjectURL(new Blob([skribo.image])) : null;

        return <Card key={id}>
          <Tapable onTap={() => setModal(skribo)} style={{ flexDirection: 'row', padding: 12, gap: 16 }}>
            <img style={{ minWidth: 56, maxWidth: 56, height: 72, borderRadius: 4, objectFit: image ? 'cover' : 'contain', padding: image ? 0 : 16, boxSizing: 'border-box', background: 'var(--textDisabled)', opacity: image ? 1 : .25 }} src={image ?? fireIcon.src} alt="Fire Icon"/> 
            <div style={{ flexDirection: 'column', justifyContent: 'center', gap: 4, width: '100%' }}>
              <p style={{ fontFamily: displayFont, fontSize: 20, color: 'var(--text)' }}>{skribos[id].label ?? 'No label'}</p>
              <p style={{ fontFamily: textFont, fontSize: 14, color: 'var(--secondary)' }}>{ skribos[id].replies.length } replies</p>
            </div>
            <p style={{ fontFamily: textFont, fontSize: 12, color: 'var(--secondary)', marginBottom: 'auto', marginTop: 8 }}>{new Date(skribos[id].timeCreated).toLocaleString()}</p>
          </Tapable>
        </Card>
      }) : <p style={{ fontFamily: textFont, margin: 'auto', fontSize: 14, color: 'var(--secondary)' }}>No skribos yet</p>
    ) : <p style={{ fontFamily: textFont, margin: 'auto', fontSize: 14, color: 'var(--secondary)' }}>Loading</p>}

    <SkriboDetails skribo={modal} onClose={() => setModal(null)}/>
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
