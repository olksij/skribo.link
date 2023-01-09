import Head from 'next/head';
import { useEffect } from 'react';
import backgrounds, { themeColors } from '../backgrounds/import'
import patterns    from '../patterns/import'

export default function Background({ id }: { id: number | null }) {
  useEffect(() => {
    document.getElementById('metaThemeColor')?.setAttribute('content', themeColors[id ?? 0].topBar)
  })

  return <div style={{ opacity: id == null ? 0 : 1, width: '100%', height: '100%', position: 'absolute', backgroundSize: 'cover', backgroundImage: `url(${backgrounds[id ?? 0]})` }}>
    <div style={{ background: `url(${patterns[id ?? 0]})`, width: '100%', mixBlendMode: 'overlay', opacity: '.2', backgroundSize: '512px' }}/>
  </div>
}