import React, { CSSProperties, useEffect, useRef, useState } from 'react';

import { textFont } from './_app';
import { displayFont } from './_app';

import Scratch from '../lib/widgets/scratch';
import styles from '/styles/card.module.css'

export default function CardPage({ id, secret }: any) {
  let [counter, setCounter] = useState<number | null>(null);

  let dataRef = useRef<Record<string, any> | null>(null);
  let keysRef = useRef<Record<string, any> | null>(null);

  let [isScratched, setScratched] = useState<boolean>(false);
  let [image, setImage] = useState<Blob | null>(null);
  let [foreground, setForeground] = useState<boolean>(false);

  useEffect(() => {
    if (counter === null || !isScratched) return;

    if (counter == 0)
      deleteObject(storageRef(storage, `cards/${id}`)), 
      setImage(null);
    else setTimeout(() => setCounter(counter! - 1), 1000);

    const docRef = databaseRef(database, `cards/${id}`);
    set(docRef, { ...dataRef.current, timeLeft: counter });
  }, [counter, isScratched])

  let note;
  if (!isScratched) note = "Scratch to unveil";
  if (!image)       note = "Loading";
  if (!image && isScratched) note = "Time is out";
  
  useEffect(() => {
    // get the access token from secret so client can access database
    obtainAccessToken(secret).then(async accessToken => {
      // sign in to firebase so server can allow access to the data
      const { user } = await signInAnonymously(auth);

      // update access
      const userRef = databaseRef(database, `users/${user.uid}/${id}`);
      await set(userRef, accessToken);

      // connect with database
      const docRef = databaseRef(database, `cards/${id}`);
      let data = await get(docRef).then(snap => snap.val());      

      // obtain keys && data
      keysRef.current = await deriveKeys(secret, data.importAlgorithm, data.encryptAlgorithm, new Uint8Array(data.salt))
      dataRef.current = data, setCounter(data.timeLeft)
      
      getBytes(storageRef(storage, `cards/${id}`)).then(async encrypted => {
        // decrypt the image
        let image = await decryptData(keysRef.current!.encryptKey, new Uint8Array(data.iv), encrypted);
        // set the image to rerender scratch
        setImage(new Blob([image]));
      });  
    });
  }, []);

  return <div className={styles.container}>
    <Background id={0}/>
    <Background id={dataRef.current?.theme}/>
    <div className={styles.content + ' ' + (isScratched && styles.fullscreen)}>
      <Scratch theme={dataRef.current?.theme} image={image} setScratched={setScratched} setForeground={setForeground}/>
    </div>
    { note && <div className={ image ? styles.scratchNote : styles.loadingNote }>
      <p className={displayFont.className}>{note}</p>
    </div> }
    <div className={styles.topBar}>
      <img onClick={() => location.href = '/'} src={foreground && isScratched ? '/logoLight.svg' : '/logo.svg'}/>
      <div style={{  alignItems: 'center', gap: 16 }}>
        <Counter value={ counter ?? 0 } style={{ ...textFont.style, opacity: counter ? 1 : 0, transition: '.3s cubic-bezier(0, 0, 0, 1)', color: foreground && isScratched ? '#FFF' : '#000', margin: 0 }} />
        <Indicator value={counter && dataRef.current ? counter / dataRef.current.timeAssigned : null} foreground={isScratched && foreground}>
          <img style={{ position: 'absolute', padding: 9, opacity: counter ? 1 : 0, height: 14, transition: '1s cubic-bezier(.5, 0, 0, 1)' }} src='/fireFilled.svg'/>
        </Indicator>
      </div>
    </div>
    <ReplyTextfield onReply={async (reply: string) => {
      console.log(keysRef.current!.encryptKey, new TextEncoder().encode(reply).buffer, dataRef.current!.iv)
      const encrypted = await encryptData(keysRef.current!.encryptKey, new TextEncoder().encode(reply).buffer, new Uint8Array(dataRef.current!.iv))

      const docRef = databaseRef(database, `cards/${id}`);
      set(docRef, { ...dataRef.current, replies: [...(dataRef.current!.replies ?? []), new Uint8Array(encrypted.data)] })
    }}/>
  </div>
}

// import firestore & utils
import { auth, database, storage } from '../lib/firebase';

import { ref as databaseRef, get, set } from "firebase/database";
import { ref as storageRef, deleteObject, getBytes } from "firebase/storage";
import { decryptData, deriveKeys, encryptData, obtainAccessToken } from '../lib/crypto';
import { signInAnonymously, signInWithCustomToken } from 'firebase/auth';
import Background from '../lib/elements/background';
import Indicator from '../lib/elements/indicator';
import Counter from '../lib/elements/counter';
import ReplyTextfield from '../lib/elements/replyTextfield';

// obtain cloud data on server during the request of the page
export async function getServerSideProps(context: any) {
  // obtain context parameters
  let { link } = context.params;

  let [id, secret] = [link.substring(0, 8), link.substring(8, 16)]

  return { props: { id, secret } } 
}
