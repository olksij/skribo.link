import styles from '../styles/home.module.css'

import Sheet from 'react-modal-sheet';

import { displayFont } from './_app';
import { textFont } from './_app';

import UploadButton from '../lib/components/uploadButton';
import Copyright from '../lib/components/copyright';
import Card, { CardType } from '../lib/components/card';
import Tapable from '../lib/components/tapable';
import { CSSProperties, useState } from 'react';
import Selectable from '../lib/components/selectable';

export default function Home() {
  const [data, setData] = useState<any>({});

  const [layout, setLayout] = useState<number>(0);
  
  const fileDialog = () => {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = (e: any) => {
      var file = e!.target!.files[0]; 
      if (file) setData({ ...data, file });
    }

    input.click();
  }

  const imageButton = data.file
    ? <Tapable onTap={fileDialog} onRemove={() => { /*delete data.file;*/ setData({}); }} gap='8px' height="56px">
      <img src={URL.createObjectURL(new Blob([data.file]))} height="32px" width="32px" style={{ borderRadius: '4px', objectFit: "cover" }}/>
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
          <Tapable onTap={fileDialog} icon='/imageIcon.svg' gap='8px' height="56px" justifyContent="center">
            <p style={ buttonCapton } className={ displayFont.className }>Upload image</p>
          </Tapable>
          <Tapable icon='/textIcon.svg' gap='8px' height="56px" justifyContent="center">
            <p style={ buttonCapton } className={ displayFont.className }>Write caption</p>
          </Tapable>
        </Card>
        <Sheet isOpen={ Object.keys(data).length ? true : false } onClose={() => setData({})}>
          <Sheet.Container style={{ background: '#EBEBF0' }}>
            <Sheet.Header />
            <Sheet.Content style={{ padding: '0 24px', flexDirection: 'column', gap: '20px' }}>
              <div style={{ alignItems: 'center', justifyContent: 'space-between', height: '48px', width: '100%' }}>
                <Tapable onTap={() => setData({})} icon='/backIcon.svg' justify="center" height="48px" background="#0000"/>
                <p style={{ fontSize: '24px' }} className={ displayFont.className }>New skribo</p>
                <div style={{ width: "48px" }}/>
              </div>
              <Card className={styles.card}>
                { imageButton }
                <Tapable icon='/textIcon.svg' gap='16px' height="56px">
                  <p style={ buttonCapton } className={ displayFont.className }>Write caption</p>
                </Tapable>
              </Card>
              <Card className={styles.card}>
                <Tapable icon='/fireIcon.svg' gap='8px' height="56px">
                  <p style={{ ...buttonCapton, width: '100%' }} className={ displayFont.className }>Self-destruct timer</p>
                  <p style={ cardProperty } className={ textFont.className }>30s</p>
                </Tapable>
              </Card>
              <Card  className={styles.card} type={ CardType.Select } header={{ icon: '/layoutIcon.svg', title: 'Letter layout' }} padding="12px" gap="8px">
                { themes.map((theme, id) => <Selectable key={theme} id={id} selected={layout} setSelected={setLayout} borderRadius={6}>
                  <div style={{ width: '64px', height: '88px', borderRadius: '6px', justifyContent: 'center', background: '#CDE6EE' }}>
                    <p style={{ placeSelf: 'center' }}>{theme}</p>
                  </div>
                </Selectable> )}
              </Card>
              <Card className={styles.card} type={ CardType.Select } header={{ icon: '/themeIcon.svg', title: 'Color theme' }}>
                <Tapable icon='/fireIcon.svg' gap='8px' height="56px">
                  <p style={{ ...buttonCapton, width: '100%' }} className={ displayFont.className }>Self-destruct timer</p>
                  <p style={ cardProperty } className={ textFont.className }>30s</p>
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

let themes = ['🏠', '🍋', '🍓', '🐠']

let buttonCapton: CSSProperties = {
  color: `var(--text)`,
  fontSize: `16px`,
}

let cardProperty: CSSProperties = {
  color: `#A9A6B2`,
  fontSize: `14px`,
  margin: '0 4px',
}

let selectedImageButton: CSSProperties = {
  color: `#585466`,
  fontSize: `14px`,
}
