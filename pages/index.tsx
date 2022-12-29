import styles from '../styles/home.module.css'

import Sheet from 'react-modal-sheet';

import { displayFont } from './_app';
import { textFont } from './_app';

import UploadButton from '../lib/components/uploadButton';
import Copyright from '../lib/components/copyright';
import Card from '../lib/components/card';
import Tapable from '../lib/components/tapable';
import { CSSProperties, useState } from 'react';

export default function Home() {
  const [data, setData] = useState<any>({});
  
  const fileDialog = () => {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = (e: any) => {
      var file = e!.target!.files[0]; 
      setData({ ...data, file });
    }

    input.click();
  }

  const imageButton = data.file
    ? <Tapable onTap={fileDialog} gap='8px' height="56px">
      <img src={URL.createObjectURL(new Blob([data.file]))} height="32px" width="32px"/>
      <p style={ selectedImageButton } className={ textFont.className }>Tap to preview</p>
    </Tapable>
    : <Tapable onTap={fileDialog} icon='/imageIcon.svg' gap='8px' height="56px">
      <p style={ buttonCapton } className={ displayFont.className }>Upload image</p>
    </Tapable>

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
        <Sheet isOpen={ Object.keys(data).length ? true : false } onClose={() => setData({})}>
          <Sheet.Container style={{ background: '#EBEBF0' }}>
            <Sheet.Header />
            <Sheet.Content style={{ padding: '0 24px', flexDirection: 'column', gap: '20px' }}>
              <div style={{ alignItems: 'center', justifyContent: 'space-between', height: '48px', width: '100%' }}>
                <Tapable onTap={() => setData({})} icon='/backIcon.svg' justify="center" height="48px"/>
                <p style={{ fontSize: '24px' }} className={ displayFont.className }>New skribo</p>
                <div style={{ width: "48px" }}/>
              </div>
              <Card className={styles.card}>
                { imageButton }
                <Tapable icon='/textIcon.svg' gap='8px' height="56px">
                  <p style={ buttonCapton } className={ displayFont.className }>Write caption</p>
                </Tapable>
              </Card>
              <Card className={styles.card}>
                <Tapable icon='/fireIcon.svg' gap='8px' height="56px">
                  <p style={ buttonCapton } className={ displayFont.className }>Self-destruct timer</p>
                </Tapable>
              </Card>
            </Sheet.Content>
          </Sheet.Container>

          <Sheet.Backdrop />
        </Sheet>
        <Copyright/>
      </main>
    </>
  )
}

let buttonCapton: CSSProperties = {
  color: `var(--text)`,
  fontSize: `16px`,
}

let selectedImageButton: CSSProperties = {
  color: `#585466`,
  fontSize: `14px`,
}
