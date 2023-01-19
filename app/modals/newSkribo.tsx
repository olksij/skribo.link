'use client';

import { CSSProperties, useEffect, useRef, useState } from "react";

import Sheet from 'react-modal-sheet';

// elements
import ThemesWidget from "../elements/theme";
import Card         from "../elements/card";
import Loading      from "../elements/loading";
import Tapable      from "../elements/tapable";

// modals
import TextModal    from "./text";
import PreviewModal from "./preview";

// import firebase instances
import { auth, database, storage } from '../components/firebase';

// import firebase methods
import { ref as databaseRef, set } from "firebase/database";
import { ref as storageRef, uploadBytes } from "firebase/storage";
import { signInAnonymously } from "firebase/auth";

// components
import darkenTheme     from "../components/darkenTheme";
import { displayFont } from "../components/fonts";
import { textFont }    from "../components/fonts";
import loadImage       from "../components/loadImage";

// crypto
import { encryptData, genKeys, obtainAccessToken } from "../components/crypto";

type NewSkriboModalProps = { 
  image: File | null,
  setImage: (arg0: File | null) => any, 
  text: string | null, 
  setText: (arg0: string | null) => any, 
  setShareLink: (arg0: any) => any, 
}

export default function NewSkriboModal({ image, setImage, text, setText, setShareLink }: NewSkriboModalProps) {
  // skribo properties states
  const [timer, setTimer] = useState<number>(30);
  const [theme, setTheme] = useState<number>(0);
  const [title, setTitle] = useState<string | null>(null);
  
  // modal's state
  const [preview, setPreview] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [failed,  setFailed] = useState<boolean>(false);
  const [textModalOpen, setTextModalOpen] = useState<boolean>(false);
  const [titleModalOpen, setTitleModalOpen] = useState<boolean>(false);

  // file picker refrence
  const filePicker = useRef<HTMLInputElement | null>(null);

  let isOpen = image || text ? true : false;

  useEffect(() => {
    if (!isOpen) {
      // reinit values on reopen
      setTimer(30)
      setTheme(0)
      setTitle(null)
      setPreview(false)
      setTitleModalOpen(false)
      setTextModalOpen(false);
      setLoading(false)
    }
  }, [isOpen])

  useEffect(() => {
    // darken theme when opened
    darkenTheme(isOpen)
  }, [isOpen])

  useEffect(() => {
    // setup filePicker element
    filePicker.current = document.createElement('input');
    filePicker.current.onchange = (e: any) => {
      // whe file is choosed update state
      var file = e!.target!.files[0]; 
      if (file) setImage(file);
      if (filePicker.current) filePicker.current.value  = '';
    }
    filePicker.current.type   = 'file';
    filePicker.current.accept = 'image/*';
    filePicker.current.value  = '';
  }, [setImage])

  // upload image button
  const imageButton = image
    // image is present, preview the image
    ? <Tapable onTap={() => filePicker.current?.click()} onRemove={() => { setImage(null) }} style={{ gap: 8, height: 56 }}>
      <img src={URL.createObjectURL(new Blob([image]))} height={32} width={32} style={{ borderRadius: '4px', objectFit: "cover" }} alt='Preview'/>
      <p style={selectedImageButton}>Tap to reselect</p>
    </Tapable>
    // show regular button
    : <Tapable onTap={() => filePicker.current?.click()} icon='/imageIcon.svg' style={{ gap: 8, height: 56 }}>
      <p style={buttonCapton}>Upload image</p>
    </Tapable>

  // write caption button
  const textButton = <Tapable onTap={ () => setTextModalOpen(true) } onRemove={ text ? (() => setText(null)) : null } icon='/textIcon.svg' style={{ gap: 8 }}>
    <p style={ text ? selectedImageButton : buttonCapton }>{ text ?? "Write caption" }</p>
  </Tapable>

  // title skribo button
  const titleButton = <Tapable style={{ gap: 8 }} onTap={ () => setTitleModalOpen(true) } onRemove={ title ? () => setTitle(null) : null } icon='/titleIcon.svg'>
    <p style={ title ? selectedImageButton : buttonCapton }>{ title ?? "Title Skribo" }</p>
  </Tapable>

  // self destruction button
  const selfDestructButton = <Tapable icon='/fireIcon.svg' style={{ gap: 8, height: 56 }} onTap={() => setTimer(timers[(timers.indexOf(timer) + 1) % timers.length])}>
    <p style={{ ...buttonCapton, width: '100%' }}>Self-destruct timer</p>
    { timers.map((value, i) => <p key={i} style={{ ...cardProperty, position: 'absolute', marginTop: i == timers.indexOf(timer) 
      ? 0 : (i < timers.indexOf(timer) ? -24 : 24), right: 4, opacity: value == timer ? 1 : 0 }}>{value}s</p>) }
  </Tapable>

  // when modal is closed remove images and texts
  const onClose = () => (setImage(null), setText(null));

  return <Sheet detent="content-height" rootId='__next' isOpen={isOpen} onClose={onClose}>
    <Sheet.Container style={{ background: '#EBEBF0' }}>
      <Sheet.Header />
      <Sheet.Content disableDrag={true} style={{ padding: '0 24px', flexDirection: 'column', gap: '20px' }}>
        <div style={{ alignItems: 'center', justifyContent: 'space-between', height: '48px', width: '100%' }}>
          <Tapable onTap={onClose} icon='/backIcon.svg' style={{ borderRadius: 12, justifyItems: 'center', height: 48, width: 48 }}/>
          <p style={{ fontSize: '24px', margin: 'revert', fontFamily: displayFont }}>New skribo</p>
          <div style={{ width: "48px" }}/>
        </div>

        <Card>{ titleButton }</Card>
        <Card separators>{[ imageButton, textButton ]}</Card>
        <Card>{ selfDestructButton }</Card>
        <Card header={{ icon: '/themeIcon.svg', title: 'Color theme' }} innerStyle={{ padding: 12, gap: 8, flexDirection: 'row', overflow: 'scroll' }}>
          { themes.map(id => <ThemesWidget key={id} id={id} theme={theme} setTheme={setTheme}/> )}
        </Card>

        <Card>
          <Tapable style={{ justifyContent: 'center', gap: 8, height: 56 }} onTap={ () => setPreview(true) } icon='/lightningIcon.svg'>
            <p style={{ ...buttonStyle, color: 'var(--text)', position: 'relative' }}>Preview</p>
          </Tapable>
        </Card>

        <div style={{ minHeight: 80 }}/>

        <TextModal title="Write caption" caption="The caption will be under your image and has to be scratched as well." isOpen={textModalOpen} onClose={() => setTextModalOpen(false)} text={text} setText={setText}/>
        <TextModal title="Write title" caption="Use title to introduce your Skribo before receiver will scratch it. For example, give them a hint what is in there or tell them to scratch it off in your own way :)" isOpen={titleModalOpen} onClose={() => setTitleModalOpen(false)} text={title} setText={setTitle} />

        <PreviewModal isOpen={preview} onClose={() => setPreview(false)} image={image} text={text} title={title} theme={theme} />

        <Card outerStyle={{ position: 'fixed', top: 'calc(100% - 56px - 24px)', left: '24px', right: '24px' }} innerStyle={{ background: '#2C2A33', boxShadow: '0 24px 48px 24px #EBEBF0AA' }}>
          <Tapable style={{ height: 56, justifyContent: 'center' }} onTap={ async () => {
            setLoading(true);
      
            try {
              let imageWebp: Blob | null = null
              
              if (image) {
                const canvas = document.createElement('canvas');
                const imageElem = await loadImage(URL.createObjectURL(image));
                
                // calculate new size
                let aspectRatio = imageElem.naturalWidth / imageElem.naturalHeight;
                const size = Math.min(Math.max(imageElem.naturalWidth, imageElem.naturalHeight), 2048)
                
                // size the new canvas
                if (aspectRatio > 1) canvas.width = size,  canvas.height = size / aspectRatio;
                else                 canvas.height = size, canvas.width  = size * aspectRatio;
                
                // resize image
                canvas.getContext('2d')!.drawImage(imageElem, 0, 0, canvas.width, canvas.height);
                imageWebp = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.5));
              }
              
              // encrypt && sign in
              let data = await encrypt(imageWebp, text);  
              const { user } = await signInAnonymously(auth);
  
              // get database referenses
              const imageRef = storageRef (storage,  `cards/${data.id}`);
              const docRef   = databaseRef(database, `cards/${data.id}`);
              const userRef  = databaseRef(database, `users/${user.uid}/${data.id}`);
              
              // set metadata
              await set(docRef, {
                timeCreated: Date.now(),
                accessToken: data.accessToken,
                importAlgorithm: data.importAlgorithm,
                encryptAlgorithm: data.encryptAlgorithm,
                encryptedText: data.encryptedText ? new Uint8Array(data.encryptedText) : null,
                iv: data.iv,
                salt: data.salt,
                timeLeft: timer,
                timeAssigned: timer,
                theme,
                owner: user.uid,
                title: title,
              })
              
              // upload image
              if (data.blob) await uploadBytes(imageRef, data.blob) 

              // log new owned skribo && save secret locally
              set(userRef, data.accessToken)
              localStorage.setItem(data.id, data.secret);
              localStorage.setItem('owned', (localStorage.getItem('owned') ? localStorage.getItem('owned') + '/' : '') + data.id);            

              // close the modal and open share modal
              onClose();
              setShareLink({ link: window.origin + '/' + data.id + data.secret, theme })
            }
            catch(e) { 
              console.log(e), 
              setFailed(true), 
              setLoading(false), 
              setTimeout(() => setFailed(false), 1000) 
            }
           }}>
            <div style={{ position: 'absolute', marginTop: loading || failed ? 0 : 32, justifyContent: 'center' }}>
              <Loading style={{ position: 'absolute', opacity: loading ? 1 : 0, justifySelf: 'center', alignSelf: 'center' }}/>
              <p style={{ opacity: failed ? 1 : 0, position: 'absolute', ...buttonStyle, width: 'max-content', justifySelf: 'center', alignSelf: 'center' }}>Oops, try again!</p>
            </div>

            <div style={{ opacity: loading || failed ? 0 : 1, marginTop: loading || failed ? -32 : 0, position: 'absolute', gap: 8 }}>
              <img width={24} src='/doneIconWhite.svg' alt="Done Icon"/>
              <p style={{ ...buttonStyle }}>Finish</p>
            </div>
          </Tapable>
        </Card>

      </Sheet.Content>
    </Sheet.Container>
    <Sheet.Backdrop />
  </Sheet>
}

let timers = [5, 15, 30, 45, 60]
let themes = [0, 2, 4, 5, 1, 3]

let buttonCapton: CSSProperties = {
  color: `var(--text)`,
  fontSize: `16px`,
  fontFamily: displayFont,
}

let cardProperty: CSSProperties = {
  color: `#A9A6B2`,
  fontSize: `14px`,
  margin: '0 4px',
  fontFamily: textFont,
}

let selectedImageButton: CSSProperties = {
  color: `#585466`,
  fontSize: `14px`,
  fontFamily: textFont,
}

let buttonStyle: CSSProperties = {
  color: '#FFF',
  fontSize: '18px',
  fontFamily: displayFont,
}

async function encrypt(file: Blob | null, text: string | null) {
  let textData = text ? new TextEncoder().encode(text) : null;
  
  // get keys
  let keys = await genKeys();
  let accessToken = await obtainAccessToken(keys.secret);

  // if file is presented
  if (file) {
    let reader = new FileReader();
    reader.readAsArrayBuffer(file); 
    
    // resolve the [ArrayBuffer] form [file]
    let imageData = await new Promise<ProgressEvent<FileReader>>(resolve => 
      reader.onload = resolve).then(e => e.target!.result) as ArrayBuffer;
    
    // encrypt file and text
    let { data: encryptedFile, iv } = await encryptData(keys.encryptKey, imageData);
    let { data: encryptedText } = textData ? await encryptData(keys.encryptKey, textData, iv) : { data: null };

    return { ...keys, blob: new Blob([encryptedFile]), encryptedText, iv, accessToken };
  }

  // encrypt just text
  let { data: encryptedText, iv } = await encryptData(keys.encryptKey, textData!);
  return { ...keys, encryptedText, iv, accessToken, blob: null };
}