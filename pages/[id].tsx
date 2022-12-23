import React, { useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/router';

import Scratch from '../lib/components/Scratch';
import styles from '/styles/Home.module.css'

export default function CardPage({ data, image }: any) {
  let scratchRef = useRef<HTMLDivElement>(null);
  let [counter, setCounter] = useState(data?.left ?? 0);

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

  return <div>
    <Scratch ref={scratchRef} style={{ position: 'fixed', top: '0px' }}>
      <img className={styles.img} src={image}></img>
    </Scratch>
    <p className={styles.counter}>{counter}</p>
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
