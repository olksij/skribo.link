import styles from '../../styles/uploadButton.module.css'

import { displayFont } from '../../pages/_app';
import { textFont } from '../../pages/_app';

// import firestore & utils
import { database, storage } from '../../lib/firebase';

import { ref as databaseRef, set } from "firebase/database";
import { ref as storageRef, uploadBytes } from "firebase/storage";

import { useRef, useState } from 'react';
import Loading from './loading';
import { encryptData, genKeys, obtainAccessToken } from '../crypto';

export default function UploadButton() {
  let [state, setState] = useState<number>(0)
  
  let textRef = useRef<HTMLInputElement>(null)
  let stateRef = useRef<HTMLParagraphElement>(null)

  const pickedFile = (e: any) => {
    setState(1);
   
    encrypt(e.target.files[0]).then(data => {
      const imageRef = storageRef (storage,  `cards/${data.id}`);
      const docRef   = databaseRef(database, `cards/${data.id}`);

      uploadBytes(imageRef, data.blob).then((snapshot) => {
        set(docRef, { 
          accessToken: data.accessToken,
          importAlgorithm: data.importAlgorithm,
          encryptAlgorithm: data.encryptAlgorithm,
          iv: data.iv,
          salt: data.salt,
          timeLeft: 24,
        });
        textRef.current!.value = window.origin + '/' + data.id + data.secret;
        
        setState(2)
      });  
    })
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

async function encrypt(file: File) {
  let reader = new FileReader();
  reader.readAsArrayBuffer(file); 

  // resolve the [ArrayBuffer] form [file]
  var data = await new Promise<ProgressEvent<FileReader>>(resolve => 
    reader.onload = resolve).then(e => e.target!.result) as ArrayBuffer;
  
  let keys = await genKeys();
  let accessToken = await obtainAccessToken(keys.secret);
  let { data: encrypted, iv } = await encryptData(keys.encryptKey, data);

  return { ...keys, blob: new Blob([encrypted]), iv, accessToken };
}
