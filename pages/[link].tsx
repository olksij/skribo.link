import React, { useEffect, useRef, useState } from 'react';

import { textFont } from './_app';
import { displayFont } from './_app';

import Scratch from '../lib/components/scratch';
import styles from '/styles/card.module.css'

export default function CardPage({ id, secret }: any) {
  let [counter, setCounter] = useState<number | null>(null);

  let dataRef = useRef<Record<string, any> | null>(null);

  let [isScratched, setScratched] = useState<boolean>(false);
  let [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    if (counter === null || !isScratched) return;

    if (counter == 0)
      deleteObject(storageRef(storage, `cards/${id}`)), 
      setImage(null);
    else setTimeout(() => setCounter(counter! - 1), 1000);

    const docRef = databaseRef(database, 'cards/' + id);
    set(docRef, { ...dataRef.current, timeLeft: counter });
  }, [counter, isScratched])

  let note;
  if (!isScratched) note = "Scratch to unveil";
  if (!image)       note = "Loading";
  
  useEffect(() => {
    // get the access token from secret so client can access database
    obtainAccessToken(secret).then(async accessToken => {
      // sign in to firebase so server can allow access to the data
      await fetch('api/jwt', { method: 'POST', body: JSON.stringify({id, accessToken }) })
      .then(async response => signInWithCustomToken(auth, await response.json()));

      // connect with firestore
      const docRef = databaseRef(database, 'cards/' + id);
      let data = await get(docRef).then(snap => snap.val());

      let keys = await deriveKeys(secret, data.importAlgorithm, data.encryptAlgorithm, new Uint8Array(data.salt))
      dataRef.current = data, setCounter(data.timeLeft)
      
      getBytes(storageRef(storage, `cards/${id}`)).then(async encrypted => {
        // decrypt the image
        let image = await decryptData(keys.encryptKey, new Uint8Array(data.iv), encrypted);
        // set the image to rerender scratch
        setImage(URL.createObjectURL(new Blob([image])));
      });  
    });
  }, []);

  return <div className={styles.container}>
    <div className={styles.content + ' ' + (image && styles.fullscreen)}>
      <Scratch image={image} setScratched={setScratched} />
    </div>
    { note && <div className={ image ? styles.scratchNote : styles.loadingNote }>
      <p className={displayFont.className}>{note}</p>
    </div> }
    <div className={styles.topBar}>
      <img src="/logo.svg"/>
      <p className={textFont.className + ' ' + styles.counter}>{counter ? counter + 's' : ''}</p>
    </div>
  </div>
}

// import firestore & utils
import { auth, database, storage } from '../lib/firebase';

import { ref as databaseRef, get, set } from "firebase/database";
import { ref as storageRef, deleteObject, getBytes } from "firebase/storage";
import { decryptData, deriveKeys, obtainAccessToken } from '../lib/crypto';
import { signInWithCustomToken } from 'firebase/auth';

// obtain cloud data on server during the request of the page
export async function getServerSideProps(context: any) {
  // obtain context parameters
  let { link } = context.params;

  let [id, secret] = [link.substring(0, 8), link.substring(8, 16)]

  return { props: { id, secret } } 
}
