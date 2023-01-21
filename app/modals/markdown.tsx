'use client';

import { CSSProperties, useEffect } from "react";
import ReactMarkdown from "react-markdown";

import Sheet from 'react-modal-sheet';

// components
import   darkenTheme   from "../components/darkenTheme";
import { displayFont } from "../components/fonts";
import    { textFont } from "../components/fonts";

// icons 
import copyrightIcon from '../../assets/icons/copyright.svg'

type MarkdownModalProps = {
  data?: [string, string] | null,
  onClose: () => any,
}

export default function MarkdownModal({ data, onClose }: MarkdownModalProps) {
  useEffect(() => {
    // darken theme when opened
    darkenTheme(data != null)
  }, [data])

  return <Sheet rootId='__next' isOpen={data != null} onClose={onClose}>
  <Sheet.Container style={{ background: '#EBEBF0' }}>
    <Sheet.Header />
    <Sheet.Content disableDrag={true} style={{ padding: '0 24px 24px 24px', flexDirection: 'column', gap: 20 }}>
      <div style={{ alignItems: 'center', justifyContent: 'center', height: 48, width: '100%' }}>
        <p style={{ fontSize: 24, margin: 'revert', fontFamily: displayFont }}>{data && data[0]}</p>
      </div>

      <ReactMarkdown className='markdown'> 
        { (data && data[1].slice(data[1].indexOf('\n')+1)) ?? ''}
      </ReactMarkdown>
    
      <div style={copyrightContainer}>
        <img style={{ height: 16 }} src={copyrightIcon.src} alt='Copyright'/>
        <p style={{ color: 'var(--textOpacity)', fontFamily: textFont }}>2023 Oleksii Besida</p>
      </div>
    </Sheet.Content>
  </Sheet.Container>

  <Sheet.Backdrop />
</Sheet>
}

let copyrightContainer: CSSProperties = {
  padding: 16,
  background: 'var(--textTint)',
  borderRadius: 8,
  justifyContent: 'center',
  fontSize: 14,
  gap: 4,
  lineHeight: '16px'
}
