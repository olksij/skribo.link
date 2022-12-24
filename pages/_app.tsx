import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Analytics } from '@vercel/analytics/react';

import localFont from '@next/font/local'

export const displayFont = localFont({ src: '../lib/fonts/displayBold.ttf' })
export const textFont    = localFont({ src: '../lib/fonts/textMedium.ttf' })

export default function App({ Component, pageProps }: AppProps) {
  return <><Component {...pageProps} /><Analytics/></>
}
