'use client';

import { CSSProperties, useEffect, useState } from "react";

import Sheet from 'react-modal-sheet';
import styles from '../[link]/card.module.css'

// elements
import Tapable from "../elements/tapable";

// components
import   darkenTheme   from "../components/darkenTheme";
import { displayFont } from "../components/fonts";
import    { textFont } from "../components/fonts";

// widgets
import Background from "../widgets/background";
import Scratch    from "../widgets/scratch";

// icons
import backLightIcon from '../../assets/icons/backLight.svg'
import  backDarkIcon from '../../assets/icons/backDark.svg'

type PreviewModalProps = {
  isOpen: boolean, 
  onClose: () => any, 
  title: string | null,
  image: File | Blob | null, 
  text: string | null, 
  theme: number, 
}

export default function PreviewModal({ isOpen, onClose, image, theme, text, title }: PreviewModalProps) {
  // declare states
  let [isScratched, setScratched] = useState<boolean>(false);
  let [foreground, setForeground] = useState<boolean>(false);

  useEffect(() => {
    // darken when shows
    darkenTheme(isOpen)
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
        <p style={{ lineHeight: title && !isScratched ? '24px' : '0px', margin: 'auto', fontFamily: textFont, opacity: .5, paddingBottom: title && !isScratched ? 16 : 0 }}>{title ?? ''}</p>
        <div className={styles.content + ' ' + (isScratched && styles.fullscreen)}>
          { isOpen && <Scratch text={text} theme={theme} image={image} setScratched={setScratched} setForeground={setForeground} reply={false}/> }
          { note && <div className={ styles.scratchNote } style={{ fontFamily: displayFont }}>
            <p>{note}</p>
          </div> }
        </div>
      </div>

      <div style={{ alignItems: 'center', zIndex: 1, justifyContent: 'space-between', height: '48px', width: '100%' }}>
        <Tapable onTap={onClose} icon={foreground && isScratched ? backLightIcon.src : backDarkIcon.src} style={{ borderRadius: 12, justifyItems: 'center', height: 48, width: 48 }}/>
        <p style={{ fontSize: '24px', margin: 'revert', color: foreground && isScratched ? '#FFF' : 'var(--text)', fontFamily: displayFont }}>Preview</p>
        <div style={{ width: "48px" }}/>
      </div>
    </Sheet.Content>
  </Sheet.Container>

  <Sheet.Backdrop />
</Sheet>
}
