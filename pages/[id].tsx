import React, { useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/router';

import { textFont } from './_app';
import { displayFont } from './_app';

import Scratch from '../lib/components/scratch';
import styles from '/styles/card.module.css'

export default function CardPage({ data, image }: any) {
  let scratchRef = useRef<HTMLDivElement>(null);
  let [counter, setCounter] = useState(data?.left ?? 0);

  let [isLoading, setLoading] = useState<boolean>(true);
  let [isScratched, setScratched] = useState<boolean>(false);

  // obtain card id from the query
  let { id } = useRouter().query;

  useEffect(() => {
    if (!counter) 
      deleteObject(storageRef(storage, `${id}`)), 
      scratchRef.current?.remove();
    else setTimeout(() => setCounter(counter - 1), 1000);

    const docRef = databaseRef(database, 'cards/' + id);
    set(docRef, { left: counter });
  });

  let note;
  if (!isScratched) note = <div className={ styles.scratchNote }><p className={displayFont.className}>Scratch to unveil</p></div>;
  if (isLoading)    note = <div className={ styles.loadingNote }><p className={displayFont.className}>Loading</p></div>;

  return <div style={{ display: 'flex', justifyContent: 'center', height: '100%' }} className={textFont.className}>
    <Scratch setLoading={setLoading} setScratched={setScratched} src={image} style={{ position: 'fixed', top: '0', left: '0' }} />
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
import { ref as storageRef, getDownloadURL, deleteObject } from "firebase/storage";

// obtain cloud data on server during the request of the page
export async function getServerSideProps(context: any) {
  // obtain context parameters
  let { id } = context.params;

  // connect with firestore
  const docRef = databaseRef(database, 'cards/' + id);
  let data = await get(docRef).then(snap => snap.val());

  // if there is a record && time left, pull the image
  if (data && data.left) {
    // connect with firestore
    const imageRef = storageRef(storage, `cards/${id}`);
    let image = await getDownloadURL(imageRef);
    // && pass it to the page
    return { props: { data, image } } 
  }

  // return 404 instead
  return { notFound: true }
}
