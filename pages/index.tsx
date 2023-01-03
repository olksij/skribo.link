import styles from '../styles/home.module.css'

import { displayFont } from './_app';
import { textFont } from './_app';

import Footer from '../lib/widgets/footer';
import Card, { CardType } from '../lib/elements/card';
import Tapable from '../lib/elements/tapable';
import { CSSProperties, useState } from 'react';
import NewSkriboModal from '../lib/modals/newSkribo';
import TextModal from '../lib/modals/text';
import ShareSkriboModal from '../lib/modals/shareSkribo';
import CardPage from './[link]';
import YourSkribosModal from '../lib/modals/yourSkribos';

export default function Home() {
  const [image, setImage] = useState<File | null>(null);
  const [text, setText] = useState<string | null>(null);

  const [shareLink, setShareLink] = useState<{ link: string, theme: number } | null>(null);
  const [textModalOpen, setTextModalOpen] = useState<boolean>(false);
  const [yourSkribosModal, setYourSkribosModal] = useState<boolean>(false);
  
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
      <main className={styles.container}>
        <img src="/logo.svg"/>
        <Card>
          <Tapable onTap={fileDialog} icon='/imageIcon.svg' gap='8px' height="56px" justifyContent="center">
            <p style={ buttonCapton } className={ displayFont.className }>Upload image</p>
          </Tapable>
          <Tapable onTap={() => setTextModalOpen(true)} icon='/textIcon.svg' gap='8px' height="56px" justifyContent="center">
            <p style={ buttonCapton } className={ displayFont.className }>Write caption</p>
          </Tapable>
        </Card>

        <Card innerStyle={{ background: '#0000000A' }} type={CardType.Select} effect={[{ background: '#222', mixBlendMode: 'overlay' }, { backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)', boxShadow: 'inset 0 0 0 1px #0001' }]} inset>
          <div onClick={() => setYourSkribosModal(true)} style={{ flexDirection: 'column', width: '100%', gap: 4, padding: '20px 24px', color: 'white'}}>
            <p style={{ ...displayFont.style, fontSize: 22, margin: 0 }}>Your Skribos</p>
            <p style={{ ...textFont.style, fontSize: 12, margin: 0, opacity: .75 }}>0 new replies</p>
          </div>
          <div>hh</div>
        </Card>

        <NewSkriboModal image={image} setImage={setImage} text={text} setText={setText} setShareLink={setShareLink}/>
        <TextModal isOpen={textModalOpen} onClose={() => setTextModalOpen(false)} text={text} setText={setText} />
        <YourSkribosModal isOpen={yourSkribosModal} onClose={() => setYourSkribosModal(false)} />

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
