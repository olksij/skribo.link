import styles from './footer.module.css'
import { displayFont, textFont } from '../../pages/_app';
import MarkdownModal from '../modals/markdown';
import { useEffect, useRef, useState } from 'react';
import { signInAnonymously } from 'firebase/auth';
import { get, ref as databaseRef } from 'firebase/database';
import { auth, database, storage } from '../firebase';
import Card from '../elements/card';
import YourSkribosModal from '../modals/yourSkribos';
import Tapable from '../elements/tapable';
import { deriveKeys, decryptData } from '../crypto';
import Indicator from '../elements/indicator';
import { getBytes, ref as storageRef } from 'firebase/storage';

export default function YourSkribosWidget() {
  const [modal, setModal] = useState(false);
  const [skribos, setSkribos] = useState<Record<string, any> | null>(null);
  const [counter, setCounter] = useState<number | null>(null);
  
  useEffect(() => {
    signInAnonymously(auth).then(async ({ user }) => {
      const owned = localStorage.getItem('owned')?.split('/') ?? []
      let currSkribos: Record<string, string[]> = {};
      let currCount:   number = 0;

      for (let id of owned) {
        if (!localStorage.getItem(id)) return;
        const docRef = databaseRef(database, `cards/${id}`);
        let data = await get(docRef).then(snap => snap.val()); 
  
        let keys = await deriveKeys(localStorage.getItem(id)!, data.importAlgorithm, data.encryptAlgorithm, new Uint8Array(data.salt))
        
        let decryptedReplies: string[] = [];
        if (data.replies) for (let reply of data.replies) {
          await decryptData(keys.encryptKey, new Uint8Array(data.iv), new Uint8Array(reply.text).buffer)
          .then(buffer => decryptedReplies.push({ ...reply, text: new TextDecoder().decode(buffer) }));
        }
        data.replies = decryptedReplies;

        await getBytes(storageRef(storage, `cards/${id}`)).then(async encrypted => {
          data.image = await decryptData(keys.encryptKey, new Uint8Array(data.iv), encrypted);
        }).catch(() => {});  
        
        currCount += data.replies.length;
        currSkribos[id] = data;
      }

      setCounter(currCount);
      setSkribos(currSkribos)
    })
  }, [])

  return <>
    <Card innerStyle={{ background: '#0001', boxShadow: 'none', borderRadius: 16 }} effects={[{ background: '#333', mixBlendMode: 'overlay', borderRadius: 16 }, { backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)', boxShadow: 'inset 0 0 0 1px #0001', borderRadius: 16 }]}>
      <div onClick={() => setModal(true)} style={{ flexDirection: 'row' }}>
        <div style={{ flexDirection: 'column', width: '100%', gap: 4, padding: '20px 24px', color: 'white'}}>
          <p style={{ ...displayFont.style, fontSize: 22, margin: 0 }}>Your Skribos</p>
          <p style={{ ...textFont.style, fontSize: 12, margin: 0, opacity: .75 }}>{ skribos != null ? `${counter} new replies` : 'Loading' }</p>
        </div>
        <div style={{ alignItems: 'center', justifyContent: 'center', width: 128, height: '100%' }}>
          { skribos ? "hh" : <Indicator foreground={true} value={null}/> }
        </div>
      </div>
    </Card>
    <YourSkribosModal skribos={skribos} isOpen={modal} onClose={() => setModal(false)} />
  </>
}
