import { database, storage } from "../firebase";
import { ref as databaseRef, remove } from "firebase/database";
import { CSSProperties, useEffect, useRef, useState } from "react";

import Sheet from 'react-modal-sheet';
import { displayFont, textFont } from "../../pages/_app";
import Card from "../elements/card";
import Tapable from "../elements/tapable";
import DeleteModal from "./delete";
import ShareSkriboModal from "./shareSkribo";
import PreviewModal from "./preview";
import { deleteObject, ref as storageRef } from "firebase/storage";

export default function SkriboDetails({ skribo, onClose }: any) {
  const [shareModal, setShareModal] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [previewModal, setPreviewModal] = useState<boolean>(false);

  useEffect(() => {
    if (skribo != null) {
      document.getElementById('metaModalColor')?.setAttribute('name', 'theme-color');
      document.getElementById('metaThemeColor')?.setAttribute('name', '');
    }
    else {
      document.getElementById('metaThemeColor')?.setAttribute('name', 'theme-color');
      document.getElementById('metaModalColor')?.setAttribute('name', '');
    }
  }, [skribo])

  const onDelete = () => {
    remove(databaseRef(database, `cards/${skribo.id}`));
    deleteObject(storageRef(storage, `cards/${skribo.id}`)), 
    localStorage.removeItem(skribo.id), onClose();

    // delete the skribo from owned list as well
    let currOwned = localStorage.getItem('owned')?.split('/') ?? [];
    localStorage.setItem('owned', currOwned?.filter(v => v != skribo.id).join('/'))
  }

  const toRender = {
    'timeLeft':        { image: '/fireIcon.svg',        text: 'Time left' },
    'timeCreated':     { image: '/dateCreatedIcon.svg', text: 'Created' },
    'firstTimeOpened': { image: '/openedIcon.svg',      text: 'Opened' },
  }

  return <Sheet detent='content-height' rootId='__next' isOpen={skribo != null} onClose={onClose}>
  <Sheet.Container style={{ background: '#EBEBF0' }}>
    <Sheet.Header />
    <Sheet.Content disableDrag={true} style={{ padding: '0 24px 24px 24px', flexDirection: 'column', gap: '20px' }}>
      <div style={{ alignItems: 'center', justifyContent: 'space-between', height: '48px', width: '100%' }}>
        <Tapable onTap={onClose} icon='/backIcon.svg' justify="center" height="48px" style={{ borderRadius: 12 }}/>
        <p style={{ fontSize: '24px', margin: 'revert', textOverflow: 'ellipsis' }} className={ displayFont.className }>{skribo?.title ?? 'No title'}</p>
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
            <img width={24} src={value.image}/>
            <p style={{ ...displayFont.style, width: '100%' }}>{value.text}</p>
            <p style={{ ...textFont.style, minWidth: 'max-content', color: 'var(--secondary)', fontSize: 14 }}>{data ?? 'No data'}</p>
          </div> 
        }) }
      </Card>
      <Card separators header={{ icon: '/replyIcon.svg', title: 'Replies' }}>
        { skribo?.replies?.length ? Object.entries(skribo?.replies as Record<string, { time: number, text: string }>).map(([key, value]) => {        
          return <div style={{ gap: 8, padding: 16, boxSizing: 'border-box', flexDirection: 'column' }} key={key}>
            <p style={{ ...textFont.style, minWidth: 'max-content', fontSize: 16 }}>{value.text}</p>
            <p style={{ ...textFont.style, minWidth: 'max-content', color: 'var(--secondary)', fontSize: 14 }}>{new Date(value.time).toLocaleString()}</p>
          </div> 
        }) : <div style={{ alignItems: 'center', justifyContent: 'center', height: 56, padding: 16, boxSizing: 'border-box' }}>
          <p style={{ ...textFont.style, color: 'var(--secondary)', fontSize: 16 }}>No replies</p>
        </div>  }
      </Card>
      <Card separators>
        <Tapable style={{ gap: 8 }} justifyContent='center' onTap={ () => setPreviewModal(true)}>
          <img src="/lightningIcon.svg"/>
          <p className={displayFont.className} style={{ ...buttonStyle, color: 'var(--text)' }}>Preview</p>
        </Tapable>
        <Tapable style={{ gap: 8 }} justifyContent='center' onTap={ () => setDeleteModal(true) }>
          <img src="/deleteIcon.svg"/>
          <p className={displayFont.className} style={{ ...buttonStyle, color: '#BF5656' }}>Delete</p>
        </Tapable>
      </Card>
      <Card innerStyle={{ background: 'var(--text)' }}>
        <Tapable style={{ gap: 8 }} justifyContent='center' onTap={ () => setShareModal(true) }>
          <img src="/shareIcon.svg"/>
          <p className={displayFont.className} style={buttonStyle}>Share skribo</p>
        </Tapable>
      </Card>

      <ShareSkriboModal link={window.origin + '/' + skribo?.id + localStorage.getItem(skribo?.id)} theme={skribo?.theme} isOpen={shareModal} onClose={() => setShareModal(false)}/>
      <PreviewModal isOpen={previewModal} onClose={() => setPreviewModal(false)} image={new Blob([skribo?.image])} text={skribo?.text} title={skribo?.title} theme={skribo?.theme}/>
      <DeleteModal isOpen={deleteModal} onClose={(sure: boolean) => (setDeleteModal(false), sure && onDelete())}/>
    </Sheet.Content>
  </Sheet.Container>

  <Sheet.Backdrop />
</Sheet>
}

let buttonStyle: CSSProperties = {
  margin: 0,
  color: '#FFF',
  fontSize: '18px'
}
