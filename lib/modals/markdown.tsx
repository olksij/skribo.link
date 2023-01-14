import { CSSProperties, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import styles from './markdown.module.css';

import Sheet, { SheetRef } from 'react-modal-sheet';
import { displayFont, textFont } from "../../pages/_app";

import Card from "../elements/card";
import Tapable from "../elements/tapable";
import Head from "next/head";

export default function MarkdownModal({ data, onClose }: any) {
  useEffect(() => {
    if (data != null) {
      document.getElementById('metaModalColor')?.setAttribute('name', 'theme-color');
      document.getElementById('metaThemeColor')?.setAttribute('name', '');
    }
    else {
      document.getElementById('metaThemeColor')?.setAttribute('name', 'theme-color');
      document.getElementById('metaModalColor')?.setAttribute('name', '');
    }
  }, [data])

  return <Sheet rootId='__next' isOpen={data != null} onClose={onClose}>
  <Sheet.Container style={{ background: '#EBEBF0' }}>
    <Sheet.Header />
    <Sheet.Content disableDrag={true} style={{ padding: '0 24px 24px 24px', flexDirection: 'column', gap: '20px' }}>
      <div style={{ alignItems: 'center', justifyContent: 'center', height: '48px', width: '100%' }}>
        <p style={{ fontSize: '24px', margin: 'revert' }} className={ displayFont.className }>{data && data[0]}</p>
      </div>
      <ReactMarkdown className={[textFont.className, styles.container].join(' ')}> 
        {data && data[1].slice(data[1].indexOf('\n')+1)}
      </ReactMarkdown>
      <div style={copyrightContainer}>
        <img style={{ height: '16px' }} src='/copyrightIcon.svg'/>
        <p style={{color: 'var(--textOpacity)'}} className={textFont.className}>2023 Oleksii Besida</p>
      </div>
    </Sheet.Content>
  </Sheet.Container>

  <Sheet.Backdrop />
</Sheet>
}

let copyrightContainer: CSSProperties = {
  padding: '16px',
  background: 'var(--textTint)',
  borderRadius: '8px',
  justifyContent: 'center',
  fontSize: '14px',
  gap: '4px',
  lineHeight: '16px'
}
