import { Html, Head, Main, NextScript } from 'next/document'
import { CSSProperties } from 'react'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>Skribo</title>
        <meta name="description" content="Share a link to your image or caption and make your friends scratch it off to see." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <div style={style}/>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

let style: CSSProperties = {
  zIndex: `-999`,
  background: `url('/pattern.svg')`,
  content: '',
  position: `absolute`,
  backgroundSize: `384px`,
  mixBlendMode: `overlay`,
  opacity: `.2`,
  width: `100%`,
  height: `100%`,
}
