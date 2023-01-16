import { Analytics } from '@vercel/analytics/react';
import Background from './widgets/background';
import '../styles/globals.css'
import { InitAppCheck } from './components/firebase';
import { AnalyticsWrapper } from './components/analytics';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Skribo</title>
        <meta name="description" content="Share a link to your image or caption and make your friends scratch it off to see." />
        <meta name="viewport"    content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        <meta name="theme-color" content="#FFF" id='metaThemeColor' />
        <meta name="theme-color" content="#191919" id='metaModalColor' />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <Background id={0}/>
        <InitAppCheck/>
        <AnalyticsWrapper/>
        { children }
      </body>
    </html>
  );
}