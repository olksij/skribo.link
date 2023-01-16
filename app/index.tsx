'use client';

import { displayFont } from './components/fonts';

import Footer from '../lib/widgets/footer';
import Card from '../lib/elements/card';
import Tapable from '../lib/elements/tapable';
import { CSSProperties, Suspense, useEffect, useRef, useState } from 'react';
import NewSkriboModal from '../lib/modals/newSkribo';
import TextModal from '../lib/modals/text';
import ShareSkriboModal from '../lib/modals/shareSkribo';
import YourSkribosWidget from '../lib/widgets/yourSkribosWidget';
import Logo from './widgets/logo';


export default function Home() {
  const [image, setImage] = useState<File | null>(null);
  const [text, setText] = useState<string | null>(null);

  const [shareLink, setShareLink] = useState<{ link: string, theme: number } | null>(null);
  const [textModalOpen, setTextModalOpen] = useState<boolean>(false);

  const filePicker = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    filePicker.current = document.createElement('input');
    filePicker.current.onchange = (e: any) => {
      var file = e!.target!.files[0]; 
      if (file) setImage(file);
    }
    filePicker.current.type   = 'file';
    filePicker.current.accept = 'image/*';
    filePicker.current.value  = '';
  }, [])

  return (
    <>
      <main style={styles.container}>
        <Logo/>
        <Card effects={ styles.buttonEffects } innerStyle={ styles.buttonInnerStyle } separators>
          <Tapable style={styles.tapableStyle} onTap={() => filePicker.current?.click()} icon='/imageIcon.svg'>
            <p style={ styles.buttonCapton }>Upload image</p>
          </Tapable>
          <Tapable style={styles.tapableStyle} onTap={() => setTextModalOpen(true)} icon='/textIcon.svg'>
            <p style={ styles.buttonCapton }>Write caption</p>
          </Tapable>
        </Card>

        <YourSkribosWidget/>

        <NewSkriboModal image={image} setImage={setImage} text={text} setText={setText} setShareLink={setShareLink}/>
        <TextModal title="Write caption" caption="The caption will be under your image and has to be scratched as well." isOpen={textModalOpen} onClose={() => setTextModalOpen(false)} text={text} setText={setText} />

        <ShareSkriboModal link={shareLink?.link} theme={shareLink?.theme} isOpen={shareLink != null} onClose={() => setShareLink(null)}/>

        <Footer/>
      </main>
    </>
  )
}

let styles: Record<string, CSSProperties> = {
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    gap: '24px',
    margin: 'auto',
    maxWidth: 360,
    padding: '0 32px',
  },
  buttonEffects: { 
    boxShadow: '0 0 0 1px #0008, 0 8px 24px #0006', 
    mixBlendMode: 'overlay', 
    borderRadius: 16 
  },
  buttonInnerStyle: { 
    borderRadius: 16, 
    boxShadow: 'none' 
  },
  tapableStyle: {
    gap: 8,
    height: 56,
    justifyContent: 'center',
  },
  buttonCapton: {
    color: `var(--text)`,
    fontSize: `16px`,
    fontFamily: displayFont,
  }
}
