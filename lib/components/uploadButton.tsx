import styles from '../../styles/uploadButton.module.css'

import { displayFont } from '../../pages/_app';

// import firestore & utils
import { database, storage } from '../../lib/firebase';

import { ref as databaseRef, set } from "firebase/database";
import { ref as storageRef, uploadBytes } from "firebase/storage";

import { useState } from 'react';
import Loading from './loading';

export default function UploadButton() {
  let [isLoading, setLoading] = useState<boolean>(false)
  let [link, setLink] = useState<string>('')

  const pickedFile = (e: any) => {
    let file = e.target.files[0] as File;
    let id = (Math.random() * Math.pow(10, 16) + Date.now()).toString(26);
    let imageRef = storageRef(storage, `cards/${id}`);

    setLoading(true);

    uploadBytes(imageRef, file).then((snapshot) => {
      const docRef = databaseRef(database, `cards/${id}`);
      set(docRef, { left: 24 });
      setLink(`https://scratch.oleksii.xyz/${id}`);
      setLoading(false)
    });
  }

  return <div className={styles.container + ' ' + displayFont.className}>
    <label className={styles.label} htmlFor="file">
      <div>
        <img src="/imageIcon.svg"/>
        <p>{status ? status : "Choose an image"}</p>
      </div>
    </label>
    <input type="file" id="file" onChange={pickedFile} accept="image/*" style={{ opacity: '0', width: '0', height: '0' }}/>
  </div>
}