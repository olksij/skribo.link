import { CSSProperties, useEffect, useRef, useState } from "react";

import Sheet from 'react-modal-sheet';
import { displayFont, textFont } from "../../pages/_app";
import Card, { CardType } from "../components/card";
import Selectable from "../components/selectable";
import Tapable from "../components/tapable";
import TextModal from "./text";

export default function NewSkriboModal({ image, setImage, text, setText }: any) {
  const [layout, setLayout] = useState<number>(0);
  const [textModalOpen, setTextModalOpen] = useState<boolean>(false);

  let isOpen = image || text;

  useEffect(() => {
    !isOpen && setTextModalOpen(false);
  }, [isOpen])

  const fileDialog = () => {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = (e: any) => {
      var file = e!.target!.files[0]; 
      if (file) setImage(file);
    }

    input.click();
  }

  const imageButton = image
    ? <Tapable onTap={fileDialog} onRemove={() => { setImage(null) }} gap='8px' height="56px">
      <img src={URL.createObjectURL(new Blob([image]))} height="32px" width="32px" style={{ borderRadius: '4px', objectFit: "cover" }}/>
      <p style={ selectedImageButton } className={ textFont.className }>Tap to preview</p>
    </Tapable>
    : <Tapable onTap={fileDialog} icon='/imageIcon.svg' gap='8px' height="56px">
      <p style={ buttonCapton } className={ displayFont.className }>Upload image</p>
    </Tapable>

  const textButton = <Tapable onTap={ () => setTextModalOpen(true) } onRemove={ text && (() => setText(null)) } icon='/textIcon.svg' gap='8px' height="56px">
    <p style={ text ? selectedImageButton : buttonCapton } className={ text ? textFont.className : displayFont.className }>{ text ?? "Write caption" }</p>
  </Tapable>

  const onClose = () => (setImage(null), setText(null));

  return <Sheet rootId='__next' isOpen={isOpen} onClose={onClose}>
    <Sheet.Container style={{ background: '#EBEBF0' }}>
      <Sheet.Header />
      <Sheet.Content style={{ padding: '0 24px', flexDirection: 'column', gap: '20px' }}>
        <div style={{ alignItems: 'center', justifyContent: 'space-between', height: '48px', width: '100%' }}>
          <Tapable onTap={onClose} icon='/backIcon.svg' justify="center" height="48px" background="#0000"/>
          <p style={{ fontSize: '24px' }} className={ displayFont.className }>New skribo</p>
          <div style={{ width: "48px" }}/>
        </div>
        <Card>
          { imageButton }
          { textButton  }
        </Card>
        <Card>
          <Tapable icon='/fireIcon.svg' gap='8px' height="56px">
            <p style={{ ...buttonCapton, width: '100%' }} className={ displayFont.className }>Self-destruct timer</p>
            <p style={ cardProperty } className={ textFont.className }>30s</p>
          </Tapable>
        </Card>
        <Card type={ CardType.Select } header={{ icon: '/layoutIcon.svg', title: 'Letter layout' }} padding="12px" gap="8px">
          { themes.map((theme, id) => <Selectable key={theme} id={id} selected={layout} setSelected={setLayout} borderRadius={6}>
            <div style={{ width: '64px', height: '88px', borderRadius: '6px', justifyContent: 'center', background: '#CDE6EE' }}>
              <p style={{ placeSelf: 'center' }}>{theme}</p>
            </div>
          </Selectable> )}
        </Card>
        <Card type={ CardType.Select } header={{ icon: '/themeIcon.svg', title: 'Color theme' }}>
          <Tapable icon='/fireIcon.svg' gap='8px' height="56px">
            <p style={{ ...buttonCapton, width: '100%' }} className={ displayFont.className }>Self-destruct timer</p>
            <p style={ cardProperty } className={ textFont.className }>30s</p>
          </Tapable>
        </Card>

        <TextModal isOpen={textModalOpen} onClose={() => setTextModalOpen(false)} text={text} setText={setText} />

      </Sheet.Content>
    </Sheet.Container>
    <Sheet.Backdrop />
  </Sheet>
}

let themes = ['🏠', '🍋', '🍓', '🐠']

let buttonCapton: CSSProperties = {
  color: `var(--text)`,
  fontSize: `16px`,
}

let cardProperty: CSSProperties = {
  color: `#A9A6B2`,
  fontSize: `14px`,
  margin: '0 4px',
}

let selectedImageButton: CSSProperties = {
  color: `#585466`,
  fontSize: `14px`,
}
