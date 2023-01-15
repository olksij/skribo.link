import { CSSProperties } from 'react';
import '../styles/globals.css'

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}