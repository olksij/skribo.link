import styles from './footer.module.css'
import { textFont } from '../../pages/_app';
import MarkdownModal from '../modals/markdown';
import { useState } from 'react';

//@ts-ignore
import privacy from '../../PRIVACY.md'; 
//@ts-ignore
import terms from '../../TERMS.md'; 
//@ts-ignore
import about from '../../LICENSE.md';

export default function Footer() {
  const [data, setData] = useState<[string, string] | null>(null);

  const buttons: Record<string, any> = {
    About: () => setData(['License', about]),
    Terms: () => setData(['Terms & Conditions', terms]),
    Privacy: () => setData(['Privacy Policy', privacy]),
  }

  return <div className={styles.container}>
    { Object.keys(buttons).map(name =>
      <button key={name} style={textFont.style} className={styles.button} onClick={() => setTimeout(buttons[name], 100)}>{name}</button>
    )}
    <MarkdownModal data={data} onClose={() => setData(null)} />
  </div>;
}
