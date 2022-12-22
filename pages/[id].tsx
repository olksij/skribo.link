import React from 'react';

import Scratch from '../lib/components/Scratch';

export default function (props: any) {
  console.log(props)
  return <Scratch/>
}

// import firestore & utils
import { db } from '../lib/firebase';
import { getDoc, doc } from "firebase/firestore";

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
