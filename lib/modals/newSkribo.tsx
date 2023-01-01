import { CSSProperties, useEffect, useRef, useState } from "react";

import Sheet from 'react-modal-sheet';
import { displayFont, textFont } from "../../pages/_app";
import Card, { CardType } from "../elements/card";
import Loading from "../elements/loading";
import Selectable from "../elements/selectable";
import Tapable from "../elements/tapable";
import TextModal from "./text";

// import firestore & utils
import { database, storage } from '../../lib/firebase';

import { ref as databaseRef, set } from "firebase/database";
import { ref as storageRef, uploadBytes } from "firebase/storage";
import { encryptData, genKeys, obtainAccessToken } from "../crypto";
import ThemeCard from "../widgets/theme";
import ThemesWidget from "../widgets/theme";
import loadImage from "../components/loadImage";

export default function NewSkriboModal({ image, setImage, text, setText, setShareLink }: any) {
  const [timer, setTimer] = useState<number>(30);
  const [theme, setTheme] = useState<number>(0);

  const [loading, setLoading] = useState<boolean>(false);
  const [textModalOpen, setTextModalOpen] = useState<boolean>(false);

  let isOpen = image || text;

  useEffect(() => {
    !isOpen && (setTextModalOpen(false), setLoading(false));
  }, [isOpen])

  const fileDialog = () => {
    var input = document.createElement('input');
    input.onchange = (e: any) => {
      var file = e!.target!.files[0]; 
      if (file) setImage(file);
    }

    input.type = 'file';
    input.accept = 'image/*';
    input.click();
  }

  const imageButton = image
    ? <Tapable onTap={fileDialog} onRemove={() => { setImage(null) }} gap='8px' height="56px">
      <img src={URL.createObjectURL(new Blob([image]))} height="32px" width="32px" style={{ borderRadius: '4px', objectFit: "cover" }}/>
      <p style={ selectedImageButton } className={ textFont.className }>Tap to reselect</p>
    </Tapable>
    : <Tapable onTap={fileDialog} icon='/imageIcon.svg' gap='8px' height="56px">
      <p style={ buttonCapton } className={ displayFont.className }>Upload image</p>
    </Tapable>

  const textButton = <Tapable onTap={ () => setTextModalOpen(true) } onRemove={ text && (() => setText(null)) } icon='/textIcon.svg' gap='8px' height="56px">
    <p style={ text ? selectedImageButton : buttonCapton } className={ text ? textFont.className : displayFont.className }>{ text ?? "Write caption" }</p>
  </Tapable>

  const selfDestructButton = <Tapable icon='/fireIcon.svg' gap='8px' height="56px" onTap={() => setTimer(timers[(timers.indexOf(timer) + 1) % timers.length])}>
    <p style={{ ...buttonCapton, width: '100%' }} className={ displayFont.className }>Self-destruct timer</p>
    <p style={ cardProperty } className={ textFont.className }>{timer + 's'}</p>
  </Tapable>

  const onClose = () => (setImage(null), setText(null));

  return <Sheet rootId='__next' isOpen={isOpen} onClose={onClose}>
    <Sheet.Container style={{ background: '#EBEBF0' }}>
      <Sheet.Header />
      <Sheet.Content style={{ padding: '0 24px', flexDirection: 'column', gap: '20px' }}>
        <div style={{ alignItems: 'center', justifyContent: 'space-between', height: '48px', width: '100%' }}>
          <Tapable onTap={onClose} icon='/backIcon.svg' justify="center" height="48px" background="#0000"/>
          <p style={{ fontSize: '24px' }} className={ displayFont.className }>New skribo</p>
          <div style={{ width: "48px" }}/>
        </div>
        <Card>{[ imageButton, textButton ]}</Card>
        <Card>{ selfDestructButton }</Card>
        <Card type={ CardType.Select } header={{ icon: '/themeIcon.svg', title: 'Color theme' }} padding="12px" gap="8px">
          { themes.map(id => <ThemesWidget key={id} id={id} theme={theme} setTheme={setTheme}/> )}
        </Card>

        <TextModal isOpen={textModalOpen} onClose={() => setTextModalOpen(false)} text={text} setText={setText} />

        <Card outerStyle={{ position: 'fixed', bottom: '0px', left: '24px', right: '24px', marginBottom: '24px' }}>
          <Tapable height="56px" background='#2C2A33' justifyContent='center' onTap={ async () => {
            setLoading(true);
            
            const canvas = document.createElement('canvas');
            const imageElem = await loadImage(URL.createObjectURL(image));
            
            let aspectRatio = imageElem.naturalWidth / imageElem.naturalHeight;
            const size = Math.min(Math.max(imageElem.naturalWidth, imageElem.naturalHeight), 2048)

            if (aspectRatio > 1)
              canvas.width = size, canvas.height = size / aspectRatio;
            else 
              canvas.width = size * aspectRatio, canvas.height = size;
            
            console.log(canvas.width, canvas.height)
            
            canvas.getContext('2d')!.drawImage(imageElem, 0, 0, canvas.width, canvas.height);
            const imageWebp = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.5));

            let data = await encrypt(imageWebp, text);

            const imageRef = storageRef (storage,  `cards/${data.id}`);
            const docRef   = databaseRef(database, `cards/${data.id}`);
      
            if (data.blob) await uploadBytes(imageRef, data.blob)

            set(docRef, { 
              accessToken: data.accessToken,
              importAlgorithm: data.importAlgorithm,
              encryptAlgorithm: data.encryptAlgorithm,
              encryptedText: data.encryptedText ? new Uint8Array(data.encryptedText) : null,
              iv: data.iv,
              salt: data.salt,
              timeLeft: timer,
              theme,
            });
            onClose();
            setShareLink({ link: window.origin + '/' + data.id + data.secret, theme })
           }}>
            { loading ? <Loading/> : <p className={displayFont.className} style={buttonStyle}>Finish</p> }
          </Tapable>
        </Card>

      </Sheet.Content>
    </Sheet.Container>
    <Sheet.Backdrop />
  </Sheet>
}

let timers = [5, 15, 30, 45, 60]
let themes = [0, 1, 2, 3]

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

let buttonStyle: CSSProperties = {
  margin: 0,
  color: '#FFF',
  fontSize: '18px'
}


async function encrypt(file: Blob | null, text: string | null) {
  let textData = text ? new TextEncoder().encode(text) : null;
  
  let keys = await genKeys();
  let accessToken = await obtainAccessToken(keys.secret);

  if (file) {
    let reader = new FileReader();
    reader.readAsArrayBuffer(file); 
    
    // resolve the [ArrayBuffer] form [file]
    let imageData = await new Promise<ProgressEvent<FileReader>>(resolve => 
      reader.onload = resolve).then(e => e.target!.result) as ArrayBuffer;
    
    let { data: encryptedFile, iv } = await encryptData(keys.encryptKey, imageData);
    let { data: encryptedText } = textData ? await encryptData(keys.encryptKey, textData, iv) : { data: null };

    return { ...keys, blob: new Blob([encryptedFile]), encryptedText, iv, accessToken };
  }

  let { data: encryptedText, iv } = await encryptData(keys.encryptKey, textData!);
  return { ...keys, encryptedText, iv, accessToken, blob: null };
}