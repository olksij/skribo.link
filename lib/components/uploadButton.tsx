import styles from '../../styles/uploadButton.module.css'

import { displayFont } from '../../pages/_app';
import { textFont } from '../../pages/_app';

// import firestore & utils
import { database, storage } from '../../lib/firebase';

import { ref as databaseRef, set } from "firebase/database";
import { ref as storageRef, uploadBytes } from "firebase/storage";

import { useRef, useState } from 'react';
import Loading from './loading';

export default function UploadButton() {
  let [state, setState] = useState<number>(0)
  let [link, setLink] = useState<string | null>()
  
  let textRef = useRef<HTMLInputElement>(null)
  let stateRef = useRef<HTMLParagraphElement>(null)

  const pickedFile = (e: any) => {
    let file = e.target.files[0] as File;
    let id = Math.random().toString(36).substring(6) + Date.now().toString(36);
    let imageRef = storageRef(storage, `cards/${id}`);

    setState(1);

    uploadBytes(imageRef, file).then((snapshot) => {
      const docRef = databaseRef(database, `cards/${id}`);
      set(docRef, { left: 24 });
      textRef.current!.value = `https://scratch.oleksii.xyz/${id}`;
      setState(2)
    });
  }

  let buttonContent = state == 1 ? <Loading/> : <div>
    <img src={state == 0 ? '/imageIcon.svg' : '/linkIcon.svg'}/>
    <p ref={stateRef}>{state == 0 ? "Choose an image" : "Copy link"}</p>
  </div>;

  const click = () => {
    textRef.current?.select();
    document.execCommand("copy");
    if (state == 2) stateRef.current!.innerText = 'Copied!';
  }

  return <div className={styles.container + ' ' + displayFont.className}>
    <label onClick={click} className={styles.label + ' ' + (state == 1 && styles.loading) + ' ' + (state == 2 && styles.copy)} htmlFor={state == 0 ? 'file' : ''}>
      {buttonContent}
    </label>
    <input className={styles.link + ' ' + textFont.className} tabIndex={-1} readOnly ref={textRef} id="input" type="text" />
    <input type="file" id="file" onChange={pickedFile} accept="image/*" style={{ opacity: '0', width: '0', height: '0' }}/>
  </div>
}