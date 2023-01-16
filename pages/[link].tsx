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
  let [text, setText] = useState<string | null>(null);
  let [foreground, setForeground] = useState<boolean>(false);

  useEffect(() => {
    if (counter === null || !isScratched) return;

    if (counter == 0) {
      remove(databaseRef(database, `cards/${id}/encryptedText`));
  
      if (image) deleteObject(storageRef(storage, `cards/${id}`))
      
      setImage(null), setText(null);  
    }
    else setTimeout(() => setCounter(counter! - 1), 1000);

    const docRef = databaseRef(database, `cards/${id}`);
    set(docRef, { ...dataRef.current, timeLeft: counter });
  }, [counter, id, image, isScratched])

  let note;
  if (!isScratched)     note = "Scratch to unveil";
  if (!(image || text)) note = "Loading";
  if (counter == 0)     note = "Time is out";
  
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

      let newImage = null, newText = null;
      
      await getBytes(storageRef(storage, `cards/${id}`)).then(async encrypted => {
        // decrypt the image
        let image = await decryptData(keysRef.current!.encryptKey, new Uint8Array(data.iv), encrypted);
        // set the image to rerender scratch
        newImage = new Blob([image]);
      }).catch(() => {});

      if (dataRef.current!.encryptedText) {
        let text  = await decryptData(keysRef.current!.encryptKey, new Uint8Array(data.iv), new Uint8Array(dataRef.current!.encryptedText).buffer);
        newText = new TextDecoder().decode(text);
      }

      setImage(newImage), setText(newText);

      set(docRef, { ...dataRef.current, lastTimeOpened: Date.now(), firstTimeOpened: dataRef.current?.firstTimeOpened ?? Date.now() })
    });
  }, []);

  useEffect(() => {
    if (isScratched && image) {
      document.getElementById('metaModalColor')?.setAttribute('name', 'theme-color');
      document.getElementById('metaThemeColor')?.setAttribute('name', '');
    }
    else {
      document.getElementById('metaThemeColor')?.setAttribute('name', 'theme-color');
      document.getElementById('metaModalColor')?.setAttribute('name', '');
    }
  }, [isScratched, image])

  let fullScreen = (image || text) && isScratched ? true : false;

  return <div className={styles.container}>
    <Background id={0}/>
    <Background id={dataRef.current?.theme}/>
    <div style={{ position: 'fixed', left: 24, right: 24, top: 80, bottom: 96, flexDirection: 'column', ...(isScratched ? { left: 0, right: 0, top: 0, bottom: 0 } : {}) }}>
      <p style={{ lineHeight: dataRef.current?.title && !isScratched ? '24px' : '0px', margin: 'auto', ...textFont.style, opacity: !isScratched ? .5 : 0, paddingBottom: dataRef.current?.title && !isScratched ? 16 : 0 }}>{dataRef.current?.title ?? ''}</p>
      <div className={styles.content + ' ' + (isScratched && styles.fullscreen)}>
        <Scratch theme={dataRef.current?.theme} image={image} text={text} setScratched={setScratched} setForeground={setForeground} reply={true}/>
        { note && <div className={ (image || text) && counter ? styles.scratchNote : styles.loadingNote }>
          <p className={displayFont.className}>{note}</p>
        </div> }
      </div>
    </div>
    <div className={styles.topBar}>
      <Link href='/'><img src={foreground && fullScreen  ? '/logoLight.svg' : '/logo.svg'}/></Link>
      <div style={{  alignItems: 'center', gap: 16 }}>
        <Counter value={ counter ?? 0 } style={{ ...textFont.style, opacity: counter ? 1 : 0, transition: '.3s cubic-bezier(0, 0, 0, 1)', color: foreground && fullScreen ? '#FFF' : '#000', margin: 0 }} />
        <Indicator style={{ opacity: counter != 0 ? 1 : 0 }} value={counter && dataRef.current ? counter / dataRef.current.timeAssigned : null} foreground={fullScreen && foreground}>
          <img style={{ position: 'absolute', padding: 9, opacity: counter ? 1 : 0, height: 14, transition: '1s cubic-bezier(.5, 0, 0, 1)' }} src={foreground && fullScreen ? '/fireFilledLight.svg' : '/fireFilled.svg'}/>
        </Indicator>
      </div>
    </div>
    <ReplyTextfield onReply={async (reply: string) => {
      const encrypted = await encryptData(keysRef.current!.encryptKey, new TextEncoder().encode(reply).buffer, new Uint8Array(dataRef.current!.iv))

      const docRef = databaseRef(database, `cards/${id}`);
      dataRef.current = { ...dataRef.current, replies: [...(dataRef.current!.replies ?? []), { text: new Uint8Array(encrypted.data), time: Date.now() }]}
      set(docRef, dataRef.current)
    }}/>
  </div>
}

// import firestore & utils
import { auth, database, storage } from '../lib/firebase';

import { ref as databaseRef, get, set, remove } from "firebase/database";
import { ref as storageRef, deleteObject, getBytes } from "firebase/storage";
import { decryptData, deriveKeys, encryptData, obtainAccessToken } from '../lib/crypto';
import { signInAnonymously } from 'firebase/auth';
import Background from '../app/widgets/background';
import Indicator from '../lib/elements/indicator';
import Counter from '../lib/elements/counter';
import ReplyTextfield from '../lib/elements/replyTextfield';
import Link from 'next/link';

// obtain cloud data on server during the request of the page
export async function getServerSideProps(context: any) {
  // obtain context parameters
  let { link } = context.params;

  let [id, secret] = [link.substring(0, 8), link.substring(8, 16)]

  return { props: { id, secret } } 
}
