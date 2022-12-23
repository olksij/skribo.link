import React, { useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/router';

import Scratch from '../lib/components/Scratch';
import styles from '/styles/Home.module.css'

export default function CardPage(props: any) {
  let scratchRef = useRef<HTMLDivElement>(null);
  let [counter, setCounter] = useState(props.left);

  let { id } = useRouter().query;

  useEffect(() => {
    if (!counter) 
      deleteObject(ref(storage, `${id}.webp`)), 
      scratchRef.current?.remove();
    else setTimeout(() => setCounter(counter - 1), 1000);

    const docRef = doc(db, "cards", id as string);
    setDoc(docRef, { left: counter });
  });

  return <div>
    <Scratch ref={scratchRef} style={{ position: 'fixed', top: '0px' }}>
      <img className={styles.img} src={'./3cb5543f33dc5da33a5c778a.webp'}></img>
    </Scratch>
    <p className={styles.counter}>{counter}</p>
  </div>
}

// import firestore & utils
import { db, storage } from '../lib/firebase';

import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";

// obtain cloud data on server during the request of the page
export async function getServerSideProps(context: any) {
  // obtain context parameters
  let { id } = context.params;

  // connect with firestore
  const docRef = doc(db, "cards", id);
  let data = await getDoc(docRef).then(snap => snap.data());

  // return data
  return { props: { ... data } }
}
