'use client';

import { CSSProperties, useEffect, useRef, useState } from 'react';

import { displayFont } from './components/fonts';

// elements
import Card    from './elements/card';
import Tapable from './elements/tapable';

// widgets
import Library from './widgets/libraryWidget';
import Footer  from './widgets/footer';
import Logo    from './widgets/logo';

// modals
import   CreateModal from './modals/create';
import        TextModal from './modals/text';
import ShareModal from './modals/share';

// icons
import imageIcon from '../assets/icons/image.svg';
import textIcon  from '../assets/icons/text.svg';

export default function Home() {
  // declare states for content
  const [image, setImage] = useState<File | null>(null);
  const [text, setText] = useState<string | null>(null);

  // states for modals
  const [shareLink, setShareLink] = useState<{ link: string, theme: number } | null>(null);
  const [textModalOpen, setTextModalOpen] = useState<boolean>(false);

  // reference for file picker
  const filePicker = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // when mounted, create a file picker
    filePicker.current = document.createElement('input');
    filePicker.current.onchange = (e: any) => {
      // if new file is selected, update the state
      var file = e!.target!.files[0]; 
      if (file) setImage(file);
    }
    filePicker.current.type   = 'file';
    filePicker.current.accept = 'image/*';
  }, [])

  return <main style={styles.container}>
    <Logo/>
    
    <Card effects={ styles.buttonEffects } innerStyle={ styles.buttonInnerStyle } separators>
      <Tapable style={styles.tapableStyle} onTap={() => filePicker.current?.click()} icon={imageIcon.src}>
        <p style={ styles.buttonCapton }>Upload image</p>
      </Tapable>
      <Tapable style={styles.tapableStyle} onTap={() => setTextModalOpen(true)} icon={textIcon.src}>
        <p style={ styles.buttonCapton }>Write caption</p>
      </Tapable>
    </Card>

    <Library/>

    <CreateModal image={image} setImage={setImage} text={text} setText={setText} setShareLink={setShareLink}/>
    <TextModal title="Write caption" caption="The caption will be under your image and has to be scratched as well." isOpen={textModalOpen} onClose={() => setTextModalOpen(false)} text={text} setText={setText} />

    <ShareModal link={shareLink?.link} theme={shareLink?.theme} isOpen={shareLink != null} onClose={() => setShareLink(null)}/>

    <Footer/>
  </main>
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
