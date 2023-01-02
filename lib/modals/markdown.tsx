import { CSSProperties, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import styles from './markdown.module.css';

import Sheet from 'react-modal-sheet';
import { displayFont, textFont } from "../../pages/_app";

import Card from "../elements/card";
import Tapable from "../elements/tapable";

export default function MarkdownModal({ data, onClose }: any) {
  const ref = useRef<HTMLTextAreaElement>(null);

  return <Sheet rootId='__next' isOpen={data != null} onClose={onClose}>
  <Sheet.Container style={{ background: '#EBEBF0' }}>
    <Sheet.Header />
    <Sheet.Content style={{ padding: '0 24px 24px 24px', flexDirection: 'column', gap: '20px' }}>
      <div style={{ alignItems: 'center', justifyContent: 'space-between', height: '48px', width: '100%' }}>
        <Tapable onTap={onClose} icon='/backIcon.svg' justify="center" height="48px" background="#0000"/>
        <p style={{ fontSize: '24px' }} className={ displayFont.className }>{data && data[0]}</p>
        <div style={{ width: "48px" }}/>
      </div>
      <ReactMarkdown className={[textFont.className, styles.container].join(' ')}> 
        {data && data[1].slice(data[1].indexOf('\n')+1)}
      </ReactMarkdown>
    </Sheet.Content>
  </Sheet.Container>

  <Sheet.Backdrop />
</Sheet>
}
