import styles from '../styles/home.module.css'

import { displayFont } from './_app';
import { textFont } from './_app';

import UploadButton from '../lib/components/uploadButton';
import Copyright from '../lib/components/copyright';
import Card from '../lib/components/card';
import Tapable from '../lib/components/tapable';
import { CSSProperties } from 'react';

export default function Home() {
  const fileDialog = () => {
    var input = document.createElement('input');
    input.type = 'file';

    input.onchange = (e: any) => {
      var file = e!.target!.files[0]; 

    }

    input.click();
  }
  return (
    <>
      <main className={styles.container}>
        <img src="/logo.svg"/>
        <Card className={styles.card}>
          <Tapable onTap={fileDialog} icon='/imageIcon.svg' gap='8px' height="56px" justify="center">
            <p style={ buttonCapton } className={ displayFont.className }>Upload image</p>
          </Tapable>
          <Tapable icon='/textIcon.svg' gap='8px' height="56px" justify="center">
            <p style={ buttonCapton } className={ displayFont.className }>Write caption</p>
          </Tapable>
        </Card>
        <Copyright/>
      </main>
    </>
  )
}

let buttonCapton: CSSProperties = {
  fill: `var(--text)`,
  fontSize: `16px`,
}
