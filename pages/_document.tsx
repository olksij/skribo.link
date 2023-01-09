import { Html, Head, Main, NextScript } from 'next/document'
import { CSSProperties } from 'react'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>Skribo</title>
        <meta name="description" content="Share a link to your image or caption and make your friends scratch it off to see." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        <meta name="theme-color" content="#FFF" id='metaThemeColor' />
        <meta name="theme-color" content="#191919" id='metaModalColor' />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
