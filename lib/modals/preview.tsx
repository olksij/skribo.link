import { CSSProperties, useEffect, useRef, useState } from "react";

import Sheet from 'react-modal-sheet';
import { displayFont, textFont } from "../../pages/_app";
import Background from "../elements/background";
import Tapable from "../elements/tapable";
import Scratch from "../widgets/scratch";

import styles from '/styles/card.module.css'


export default function PreviewModal({ isOpen, onClose, image, theme, text, title }: any) {
  let [isScratched, setScratched] = useState<boolean>(false);
  let [foreground, setForeground] = useState<boolean>(false);

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

  let note;
  if (!isScratched) note = "Scratch to unveil";
  if (!(image || text) && isScratched) note = "Time is out";

  useEffect(() => {
    setScratched(false)
  }, [isOpen])

  return <Sheet detent="full-height" disableDrag={true} rootId='__next' isOpen={isOpen} onClose={onClose}>
  <Sheet.Container style={{ overflow: 'hidden' }}>
    <Sheet.Header style={{ height: 24 }}/>
    <Sheet.Content style={{ padding: '0 24px 24px 24px', flexDirection: 'column', gap: '20px', position: 'relative', overflow: 'visible' }}>
      <Background id={theme} style={{ left: 0, top: -24, height: '100vh' }}/>
      
      <div style={{ position: 'absolute', left: 24, right: 24, top: 64, bottom: 24, flexDirection: 'column', ...(isScratched ? { left: 0, right: 0, top: -58, bottom: 0 } : {}) }}>
        <p style={{ lineHeight: title && !isScratched ? '24px' : '0px', margin: 'auto', ...textFont.style, opacity: .5, paddingBottom: title && !isScratched ? 16 : 0 }}>{title ?? ''}</p>
        <div className={styles.content + ' ' + (isScratched && styles.fullscreen)}>
          { isOpen && <Scratch text={text} theme={theme} image={image} setScratched={setScratched} setForeground={setForeground} reply={false}/> }
          { note && <div className={ styles.scratchNote }>
            <p className={displayFont.className}>{note}</p>
          </div> }
        </div>
      </div>

      <div style={{ alignItems: 'center', zIndex: 1, justifyContent: 'space-between', height: '48px', width: '100%' }}>
        <Tapable onTap={onClose} icon={foreground && isScratched ? '/backIconLight.svg' : '/backIconDark.svg'} justify="center" height="48px" style={{ borderRadius: 12 }}/>
        <p style={{ fontSize: '24px', margin: 'revert', color: foreground && isScratched ? '#FFF' : 'var(--text)' }} className={ displayFont.className }>Preview</p>
        <div style={{ width: "48px" }}/>
      </div>
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
