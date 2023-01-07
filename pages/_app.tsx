import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Analytics } from '@vercel/analytics/react';

import localFont from '@next/font/local'
import { useEffect } from 'react';
import { initAppCheck } from '../lib/firebase';

export const displayFont = localFont({ src: '../lib/fonts/displayBold.ttf' })
export const textFont    = localFont({ src: '../lib/fonts/textMedium.ttf' })

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    initAppCheck()
  })
  
  return <>
    <Component {...pageProps} />
    <Analytics debug={false} beforeSend={(event) => {
      const url = new URL(event.url);
      url.pathname = '';
      return { ...event, url: url.toString() };
    }}/>
  </>
}
