import { CSSProperties, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import styles from './markdown.module.css';

import Sheet, { SheetRef } from 'react-modal-sheet';
import { displayFont, textFont } from "../../pages/_app";

import Card from "../elements/card";
import Tapable from "../elements/tapable";

export default function MarkdownModal({ data, onClose }: any) {
  return <Sheet rootId='__next' isOpen={data != null} onClose={onClose}>
  <Sheet.Container style={{ background: '#EBEBF0' }}>
    <Sheet.Header />
    <Sheet.Content style={{ padding: '0 24px 24px 24px', flexDirection: 'column', gap: '20px' }}>
      <div style={{ alignItems: 'center', justifyContent: 'center', height: '48px', width: '100%' }}>
        <p style={{ fontSize: '24px' }} className={ displayFont.className }>{data && data[0]}</p>
      </div>
      <ReactMarkdown className={[textFont.className, styles.container].join(' ')}> 
        {data && data[1].slice(data[1].indexOf('\n')+1)}
      </ReactMarkdown>
      <div style={copyrightContainer}>
        <img style={{ height: '16px' }} src='/copyrightIcon.svg'/>
        <p style={{ margin: 0 }} className={textFont.className}>2022 Oleksii Besida</p>
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
  color: 'var(--textOpacity)',
  lineHeight: '16px'
}
