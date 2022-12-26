import React, { useEffect, useRef, useState } from 'react';

import { textFont } from './_app';
import { displayFont } from './_app';

import Scratch from '../lib/components/scratch';
import styles from '/styles/card.module.css'

export default function CardPage({ id, secret, data }: any) {
  let scratchRef = useRef<HTMLDivElement>(null);
  let [counter, setCounter] = useState(data?.timeLeft ?? 0);

  let [isScratched, setScratched] = useState<boolean>(false);
  let [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    if (!counter)
      deleteObject(storageRef(storage, `cards/${id}`)), 
      scratchRef.current?.remove();
    else setTimeout(() => setCounter(counter - 1), 1000);

    const docRef = databaseRef(database, 'cards/' + id);
    set(docRef, { ...data, timeLeft: counter });
  });

  let note;
  if (!isScratched) note = <div className={ styles.scratchNote }><p className={displayFont.className}>Scratch to unveil</p></div>;
  if (!image)       note = <div className={ styles.loadingNote }><p className={displayFont.className}>Loading</p></div>;
  
  useEffect(() => {
    getBytes(storageRef(storage, `cards/${id}`)).then(async encrypted => {
      // decrypt the image
      let keys = await deriveKeys(secret, data.importAlgorithm, data.encryptAlgorithm, new Uint8Array(data.salt));
      let image = await decryptData(keys.encryptKey, new Uint8Array(data.iv), encrypted);
      
      // set the image to rerender scratch
      setImage(URL.createObjectURL(new Blob([image])));
    }).catch(console.error);
  }, []);

  return <div style={{ display: 'flex', justifyContent: 'center', height: '100%' }} className={textFont.className}>
    <Scratch image={image} setScratched={setScratched} style={{ position: 'fixed', top: '0', left: '0' }} />
    {note}
    <div className={styles.topBar}>
      <img src="/logo.svg"/>
      <p className={styles.counter}>{counter + 's'}</p>
    </div>
  </div>
}

// import firestore & utils
import { database, storage } from '../lib/firebase';

import { ref as databaseRef, get, set } from "firebase/database";
import { ref as storageRef, deleteObject, getBytes } from "firebase/storage";
import { decryptData, deriveKeys } from '../lib/crypto';

// obtain cloud data on server during the request of the page
export async function getServerSideProps(context: any) {
  // obtain context parameters
  let { link } = context.params;

  let [id, secret] = [link.substring(0, 8), link.substring(8, 16)]

  // connect with firestore
  const docRef = databaseRef(database, 'cards/' + id);
  let data = await get(docRef).then(snap => snap.val());

  // if there is a record && time left, pass it to the page
  return (data && data.timeLeft) 
    ? { props: { id, secret, data } } 
    : { notFound: true };
}
