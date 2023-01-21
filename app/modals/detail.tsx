'use client';

import { CSSProperties, useEffect, useState } from "react";

import Sheet from 'react-modal-sheet';

// firebase instances
import { database, storage } from "../components/firebase";

// firebase methods
import { ref as  storageRef, deleteObject } from "firebase/storage";
import { ref as databaseRef, remove }       from "firebase/database";

// modals
import PreviewModal from "./preview";
import   ShareModal from "./share";
import  DeleteModal from "./delete";

// elements
import Tapable from "../elements/tapable";
import Card    from "../elements/card";

// components
import   darkenTheme   from "../components/darkenTheme";
import { displayFont } from "../components/fonts";
import    { textFont } from "../components/fonts";

// icons
import openedIcon from '../../assets/icons/opened.svg';
import  replyIcon from '../../assets/icons/reply.svg';
import   fireIcon from '../../assets/icons/fire.svg';
import   dateIcon from '../../assets/icons/date.svg';
import   backIcon from '../../assets/icons/back.svg';
import   boltIcon from '../../assets/icons/bolt.svg';
import  shareIcon from '../../assets/icons/share.svg';
import deleteIcon from '../../assets/icons/delete.svg';

type DetailModalProps = {
  skribo: Record<string, any> | null,
  onClose: () => any,
}

export default function SkriboDetails({ skribo, onClose }: DetailModalProps) {
  // define states
  const [shareModal,   setShareModal]   = useState<boolean>(false);
  const [deleteModal,  setDeleteModal]  = useState<boolean>(false);
  const [previewModal, setPreviewModal] = useState<boolean>(false);

  useEffect(() => {
    // darken theme when opened
    darkenTheme(skribo != null)
  }, [skribo])

  // confirmed deletionin delete dialog
  const onDelete = () => {
    // if no skribo, return
    if (!skribo) return;

    // remove data from databases
    remove(databaseRef(database, `cards/${skribo.id}`));
    deleteObject(storageRef(storage, `cards/${skribo.id}`)), 

    // remove from [localStorage]
    localStorage.removeItem(skribo.id), onClose();

    // delete the skribo from owned list as well
    let currOwned = localStorage.getItem('owned')?.split('/') ?? [];
    localStorage.setItem('owned', currOwned?.filter(v => v != skribo.id).join('/'))
  }

  // list of metadata tp show
  const toRender = {
    'timeLeft':        { image: fireIcon.src,   text: 'Time left' },
    'timeCreated':     { image: dateIcon.src,   text: 'Created' },
    'firstTimeOpened': { image: openedIcon.src, text: 'Opened' },
  }

  return <Sheet detent='content-height' rootId='__next' isOpen={skribo != null} onClose={onClose}>
  <Sheet.Container style={{ background: '#EBEBF0' }}>
    <Sheet.Header />
    <Sheet.Content disableDrag={true} style={{ padding: '0 24px 24px 24px', flexDirection: 'column', gap: '20px' }}>

      <div style={{ alignItems: 'center', justifyContent: 'space-between', height: 48, width: '100%' }}>
        <Tapable onTap={onClose} icon={backIcon.src} style={{ borderRadius: 12, justifyContent: 'center', height: 48, width: 48 }}/>
        <p style={{ fontSize: '24px', margin: 'revert', textOverflow: 'ellipsis', fontFamily: displayFont }}>{skribo?.title ?? 'No title'}</p>
        <div style={{ width: "48px" }}/>
      </div>

      <Card separators>
        { Object.entries(toRender).map(([key, value]) => {
          let data = skribo?.[key];

          if (data != null) {
            if (key == 'timeLeft') data = data == 0 ? 'Expired' : data + 's';
            if (['timeCreated', 'firstTimeOpened', 'lastTimeOpened'].includes(key)) data = new Date(data).toLocaleString();
          }
          
          return <div style={{ gap: 8, alignItems: 'center', height: 56, padding: 16, boxSizing: 'border-box' }} key={key}>
            <img width={24} src={value.image} alt='Icon'/>
            <p style={{ fontFamily: displayFont, width: '100%' }}>{value.text}</p>
            <p style={{ fontFamily: textFont, minWidth: 'max-content', color: 'var(--secondary)', fontSize: 14 }}>{data ?? 'No data'}</p>
          </div> 
        }) }
      </Card>

      <Card separators header={{ icon: replyIcon.src, title: 'Replies' }}>
        { skribo?.replies?.length ? Object.entries(skribo?.replies as Record<string, { time: number, text: string }>).map(([key, value]) => {        
          return <div style={{ gap: 8, padding: 16, boxSizing: 'border-box', flexDirection: 'column' }} key={key}>
            <p style={{ fontFamily: textFont, minWidth: 'max-content', fontSize: 16 }}>{value.text}</p>
            <p style={{ fontFamily: textFont, minWidth: 'max-content', color: 'var(--secondary)', fontSize: 14 }}>{new Date(value.time).toLocaleString()}</p>
          </div> 
        }) : <div style={{ alignItems: 'center', justifyContent: 'center', height: 56, padding: 16, boxSizing: 'border-box' }}>
          <p style={{ fontFamily: textFont, color: 'var(--secondary)', fontSize: 16 }}>No replies</p>
        </div>  }
      </Card>

      <Card separators>
        { skribo?.timeLeft != 0 && (skribo?.image || skribo?.text) && <Tapable style={{ gap: 8, justifyContent: 'center' }} onTap={ () => setPreviewModal(true)}>
          <img src={boltIcon.src} alt="Preview Icon"/>
          <p style={{ ...buttonStyle, color: 'var(--text)' }}>Preview</p>
        </Tapable> }
        <Tapable style={{ gap: 8, justifyContent: 'center' }} onTap={ () => setDeleteModal(true) }>
          <img src={deleteIcon.src} alt="Delete Icon"/>
          <p style={{ ...buttonStyle, color: '#BF5656' }}>Delete</p>
        </Tapable>
      </Card>

      <Card innerStyle={{ background: 'var(--text)' }}>
        <Tapable style={{ gap: 8, justifyContent: 'center' }} onTap={ () => setShareModal(true) }>
          <img src={shareIcon.src} alt="Share Icon"/>
          <p style={buttonStyle}>Share skribo</p>
        </Tapable>
      </Card>

      <ShareModal link={window.origin + '/' + skribo?.id + localStorage.getItem(skribo?.id)} theme={skribo?.theme} isOpen={shareModal} onClose={() => setShareModal(false)}/>
      <PreviewModal isOpen={previewModal} onClose={() => setPreviewModal(false)} image={skribo?.image ? new Blob([skribo?.image]) : null} text={skribo?.text} title={skribo?.title} theme={skribo?.theme}/>
      <DeleteModal isOpen={deleteModal} onClose={(sure?: boolean) => (setDeleteModal(false), sure && onDelete())}/>

    </Sheet.Content>
  </Sheet.Container>

  <Sheet.Backdrop />
</Sheet>
}

let buttonStyle: CSSProperties = {
  margin: 0,
  color: '#FFF',
  fontSize: '18px',
  fontFamily: displayFont,
}
