import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '../styles/Home.module.css'

// import firestore & utils
import { database, storage } from '../lib/firebase';

import { ref as databaseRef, set } from "firebase/database";
import { ref as storageRef, uploadBytes } from "firebase/storage";
import { useState } from 'react';


export default function Home() {
  let [status, setStatus] = useState<string | null>(null)

  const pickedFile = (e: any) => {
    let file = e.target.files[0] as File;
    let id = (Math.random() * Math.pow(10, 16) + Date.now()).toString(26);
    let imageRef = storageRef(storage, `cards/${id}`);

    setStatus('doing magic..')

    uploadBytes(imageRef, e.target.files[0]).then((snapshot) => {
      const docRef = databaseRef(database, `cards/${id}`);
      set(docRef, { left: 24 });
      setStatus(`https://scratch.oleksii.xyz/${id}`);
    });
  }

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <p className={styles.status}>{status ? status : "yo go ahead n upload smthing"}</p>
        <input type="file" onChange={pickedFile} accept="image/*"></input>
      </main>
    </>
  )
}
