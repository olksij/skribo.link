import styles from '../styles/home.module.css'

import { displayFont } from './_app';
import { textFont } from './_app';

import Copyright from '../lib/components/copyright';
import Card from '../lib/components/card';
import Tapable from '../lib/components/tapable';
import { CSSProperties, useState } from 'react';
import NewSkriboModal from '../lib/modals/newSkribo';
import TextModal from '../lib/modals/text';

export default function Home() {
  const [image, setImage] = useState<File | null>(null);
  const [text, setText] = useState<string | null>(null);

  const [textModalOpen, setTextModalOpen] = useState<boolean>(false);
  
  const fileDialog = () => {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = (e: any) => {
      var file = e!.target!.files[0]; 
      if (file) setImage(file);
    }
    
    input.value = '';
    input.click();
  }

  return (
    <>
      <main className={styles.container}>
      <div style={pattern}/>
        <img src="/logo.svg"/>
        <Card className={styles.card}>
          <Tapable onTap={fileDialog} icon='/imageIcon.svg' gap='8px' height="56px" justifyContent="center">
            <p style={ buttonCapton } className={ displayFont.className }>Upload image</p>
          </Tapable>
          <Tapable onTap={() => setTextModalOpen(true)} icon='/textIcon.svg' gap='8px' height="56px" justifyContent="center">
            <p style={ buttonCapton } className={ displayFont.className }>Write caption</p>
          </Tapable>
        </Card>

        <NewSkriboModal image={image} setImage={setImage} text={text} setText={setText} />
        <TextModal isOpen={textModalOpen} onClose={() => setTextModalOpen(false)} text={text} setText={setText} />

        <Copyright/>
      </main>
    </>
  )
}

let buttonCapton: CSSProperties = {
  color: `var(--text)`,
  fontSize: `16px`,
}

let pattern: CSSProperties = {
  background: `url('/pattern.svg')`,
  content: '',
  position: `absolute`,
  backgroundSize: `384px`,
  mixBlendMode: `overlay`,
  opacity: `.2`,
  width: `100%`,
  height: `100%`,
}
