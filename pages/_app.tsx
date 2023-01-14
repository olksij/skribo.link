import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Analytics } from '@vercel/analytics/react';

import localFont from '@next/font/local'
import { CSSProperties, useEffect } from 'react';
import { initAppCheck } from '../lib/firebase';

export const displayFont = {
  className: 'displayFont',
  style: {
    fontFamily: `display, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif`,
  } as CSSProperties
}
export const textFont = {
  className: 'textFont',
  style: {
    fontFamily: `text, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif`,
  } as CSSProperties
}

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
