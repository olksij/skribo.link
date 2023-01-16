'use client';

import { CSSProperties, useEffect } from 'react';
import backgrounds, { themeColors } from '../../lib/backgrounds/import'
import patterns    from '../../lib/patterns/import'

type Props = { 
  id: number | null, 
  style?: CSSProperties 
}

export default function Background({ id, style }: Props) {
  useEffect(() => {
    document.getElementById('metaThemeColor')?.setAttribute('content', themeColors[id ?? 0].topBar)
  })

  return <div style={{ opacity: id == null ? 0 : 1, width: '100%', height: '100%', position: 'absolute', backgroundSize: 'cover', backgroundImage: `url(${backgrounds[id ?? 0]})`, ...style }}>
    <div style={{ background: `url(${patterns[id ?? 0]})`, width: '100%', mixBlendMode: 'overlay', opacity: '.2', backgroundSize: '512px' }}/>
  </div>
}