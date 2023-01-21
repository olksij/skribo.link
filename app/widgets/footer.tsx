'use client';

import { useState } from 'react';
import styles from './footer.module.css'

// components
import { textFont } from '../components/fonts';

// modals
import MarkdownModal from '../modals/markdown';

//@ts-ignore
import privacy from '../../PRIVACY.md'; 
//@ts-ignore
import terms from '../../TERMS.md'; 
//@ts-ignore
import about from '../../ABOUT.md';

export default function Footer() {
  // declare state
  const [data, setData] = useState<[string, string] | null>(null);

  // define button functions
  const buttons: Record<string, () => any> = {
    About: () => setData(['About Skribo', about]),
    Terms: () => setData(['Terms & Conditions', terms]),
    Privacy: () => setData(['Privacy Policy', privacy]),
  }

  return <div className={styles.container}>
    { Object.keys(buttons).map(name =>
      <button key={name} style={{ fontFamily: textFont }} className={styles.button} onClick={() => setTimeout(buttons[name], 100)}>{name}</button>)}

    <MarkdownModal data={data} onClose={() => setData(null)} />
  </div>;
}
