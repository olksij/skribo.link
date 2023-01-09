import styles from '../styles/home.module.css'

import { displayFont } from './_app';
import { textFont } from './_app';

import Footer from '../lib/widgets/footer';
import Card from '../lib/elements/card';
import Tapable from '../lib/elements/tapable';
import { CSSProperties, Suspense, useEffect, useState } from 'react';
import NewSkriboModal from '../lib/modals/newSkribo';
import TextModal from '../lib/modals/text';
import ShareSkriboModal from '../lib/modals/shareSkribo';
import Background from '../lib/elements/background';
import YourSkribosWidget from '../lib/widgets/yourSkribosWidget';


export default function Home() {
  const [image, setImage] = useState<File | null>(null);
  const [text, setText] = useState<string | null>(null);

  const [shareLink, setShareLink] = useState<{ link: string, theme: number } | null>(null);
  const [textModalOpen, setTextModalOpen] = useState<boolean>(false);
  
  const fileDialog = () => {
    var input = document.createElement('input');

    input.onchange = (e: any) => {
      var file = e!.target!.files[0]; 
      if (file) setImage(file);
    }

    input.type   = 'file';
    input.accept = 'image/*';
    input.value  = '';
    input.click();
    
    // due to an interesting bug in browsers, the [input.onchange] can 
    // not fire if i won't pass it to [console.log] function as an argument
    console.log(input.onchange)
  }

  return (
    <>
      <Background id={0}/>
      <main className={styles.container}>
        <img src="/logo.svg"/>
        <Card effects={{ boxShadow: '0 0 0 1px #0008, 0 8px 24px #0006', mixBlendMode: 'overlay', borderRadius: 16 }} innerStyle={{ borderRadius: 16, boxShadow: 'none' }} separators>
          <Tapable onTap={fileDialog} icon='/imageIcon.svg' gap='8px' height="56px" justifyContent="center">
            <p style={ buttonCapton } className={ displayFont.className }>Upload image</p>
          </Tapable>
          <Tapable onTap={() => setTextModalOpen(true)} icon='/textIcon.svg' gap='8px' height="56px" justifyContent="center">
            <p style={ buttonCapton } className={ displayFont.className }>Write caption</p>
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

let buttonCapton: CSSProperties = {
  color: `var(--text)`,
  fontSize: `16px`,
}
