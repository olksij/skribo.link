import styles from './footer.module.css'
import { displayFont, textFont } from '../../pages/_app';
import MarkdownModal from '../modals/markdown';
import { useEffect, useRef, useState } from 'react';
import { signInAnonymously } from 'firebase/auth';
import { get, ref as databaseRef } from 'firebase/database';
import { auth, database } from '../firebase';
import Card from '../elements/card';
import YourSkribosModal from '../modals/yourSkribos';
import Tapable from '../elements/tapable';
import { deriveKeys, decryptData } from '../crypto';

export default function YourSkribosWidget() {
  const [modal, setModal] = useState(false);
  const [replies, setReplies] = useState<Record<string, string[]> | null>(null);
  const [counter, setCounter] = useState<number | null>(null);

  const currKeys = useRef<Record<string, any>>({});
  
  useEffect(() => {
    signInAnonymously(auth).then(async ({ user }) => {
      const owned = localStorage.getItem('owned')?.split('/') ?? []
      let currReplies: Record<string, string[]> = {};
      let currCount:   number = 0;

      for (let id of owned) {
        if (!localStorage.getItem(id)) return;
        const docRef = databaseRef(database, `cards/${id}`);
        let data = await get(docRef).then(snap => snap.val());      
  
        let keys = await deriveKeys(localStorage.getItem(id)!, data.importAlgorithm, data.encryptAlgorithm, new Uint8Array(data.salt))
        
        currReplies[id] = [];
        for (let encrypted of data.replies)
          await decryptData(keys.encryptKey, new Uint8Array(data.iv), new Uint8Array(encrypted).buffer)
          .then(buffer => currReplies[id].push(new TextDecoder().decode(buffer)));
        
        currCount += currReplies[id]?.length ?? 0;
        currKeys.current[id] = keys;
      }

      setCounter(currCount);
      setReplies(currReplies)
      console.log(currReplies)
    })
  }, [])

  return <>
    <Card innerStyle={{ background: '#0001', boxShadow: 'none', borderRadius: 16 }} effects={[{ background: '#333', mixBlendMode: 'overlay', borderRadius: 16 }, { backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)', boxShadow: 'inset 0 0 0 1px #0001', borderRadius: 16 }]}>
      <div onClick={() => setModal(true)} style={{ flexDirection: 'row' }}>
        <div style={{ flexDirection: 'column', width: '100%', gap: 4, padding: '20px 24px', color: 'white'}}>
          <p style={{ ...displayFont.style, fontSize: 22, margin: 0 }}>Your Skribos</p>
          <p style={{ ...textFont.style, fontSize: 12, margin: 0, opacity: .75 }}>{ replies != null ? `${counter} new replies` : 'Loading' }</p>
        </div>
        <div>hh</div>
      </div>
    </Card>
    <YourSkribosModal replies={replies} keys={currKeys.current} isOpen={modal} onClose={() => setModal(false)} />
  </>
}
