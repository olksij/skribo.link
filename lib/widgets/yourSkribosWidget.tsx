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
    const owned = localStorage.getItem('owned')?.split('/');

    if (!owned) setSkribos({})

    signInAnonymously(auth).then(async ({ user }) => {
      if (!owned) return;

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

  let previews = !skribos ? [] : Object.keys(skribos).map(id => skribos[id].image ? 
    URL.createObjectURL(new Blob([skribos[id].image])) : null).filter(v => v != null) as string[]

  const loading = skribos == null;
  const empty = !(skribos && Object.keys(skribos).length);

  return <>
    <Card innerStyle={{ background: 'linear-gradient(0.25turn, #0001, #0000);', boxShadow: 'none', borderRadius: 16 }} effects={[{ background: '#333', mixBlendMode: 'overlay', borderRadius: 16 }, { backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)', boxShadow: 'inset 0 0 0 1px #0001', borderRadius: 16 }]}>
      <Tapable onTap={() => setModal(true)} style={{ flexDirection: 'row', padding: 0 }}>
        <div style={{ flexDirection: 'column', width: '100%', gap: 4, padding: '24px', color: 'white'}}>
          <p style={{ ...displayFont.style, fontSize: 22, margin: 0 }}>Your Skribos</p>
          <p style={{ ...textFont.style, fontSize: 12, margin: 0, opacity: .75 }}>{ skribos != null ? (Object.keys(skribos).length ? `${counter} new replies` : 'No skribos yet') : 'Loading' }</p>
        </div>
        <div style={{ alignItems: 'center', justifyContent: 'center', width: 144, height: '100%' }}>
          { [0, 1, 2].map(i => <img style={{ width: 38, height: 64, objectFit: 'cover', borderRadius: 4, boxShadow: 'var(--shadowNormal)', position: 'absolute', transform: `rotate(${previews[i] ? (previews.length == 1 && i == 0 ? 0 : -5+i*20) : -30}deg) scale(${previews[i] ? 1 : .7})`, zIndex: 3-i, opacity: previews[i] ? 1.3 - i * .30 : 0, transition: '.5s cubic-bezier(.75, 0, 0, 1)' }} key={i} src={previews[i]}/>) }
          <img style={{ height: 36, opacity: !loading && empty ? .25 : 0, transform: `scale(${!loading && empty ? 1 : .8})`, transitionDelay: '.15s', position: 'absolute' }} src='/cactusIcon.svg'/>
          <Indicator foreground={true} value={null} style={{ opacity: loading ? 1 : 0, transform: `scale(${loading ? 1 : .8})`, position: 'absolute' }}/>
        </div>
      </Tapable>
    </Card>
    <YourSkribosModal skribos={skribos} isOpen={modal} onClose={() => setModal(false)} />
  </>
}
