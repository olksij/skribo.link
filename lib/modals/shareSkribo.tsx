'use client';

import { CSSProperties, useEffect, useRef, useState } from "react";

import Sheet from 'react-modal-sheet';
import { displayFont, textFont } from "../../pages/_app";
import Card from "../components/card";
import Tapable from "../components/tapable";

export default function ShareSkriboModal({ link, theme, isOpen, onClose }: { link: string | undefined, theme: number | undefined, isOpen: boolean, onClose: () => void }) {
  const ref = useRef<HTMLCanvasElement>(null);

  const [copyStatus, setCopyStatus] = useState(false)

  useEffect(() => {
    if (link && isOpen) {
      import('qr-code-styling').then(async qrCodeStyling => {
        new qrCodeStyling.default({
          width: 512,
          height: 512,
          type: "svg",
          data: link,
          dotsOptions: {
            color: "#4267b2",
            type: "rounded"
          },
          backgroundOptions: { color: "#00000000" },
          imageOptions: { crossOrigin: "anonymous" }
        }).getRawData('png').then(async blob => {
          let bitmap = await createImageBitmap(blob!),
              canvas = ref.current!,
              context = canvas.getContext("2d");
          
          let { width, height } = canvas,
              size = Math.min(width, height) * 0.5;
          
          let halfWidth = width/2,
              halfHeight = height/2,
              halfSize = size/2;

            context?.drawImage(bitmap, halfWidth-halfSize, halfHeight-halfSize, size, size)
        })  
      })
    }

    if (!ref.current) return;
    let canvas = ref.current!,
        parent = canvas.parentElement;
    
    canvas.width = parent!.clientWidth * devicePixelRatio;
    canvas.height = parent!.clientHeight * devicePixelRatio;
  }, [isOpen, link, ref, theme])

  return <Sheet rootId='__next' isOpen={isOpen} onClose={onClose}>
  <Sheet.Container style={{ background: '#EBEBF0' }}>
    <Sheet.Header />
    <Sheet.Content style={{ padding: '0 24px 24px 24px', flexDirection: 'column', gap: '20px' }}>
      <div style={{ alignItems: 'center', justifyContent: 'space-between', height: '48px', width: '100%' }}>
        <Tapable onTap={onClose} icon='/backIcon.svg' justify="center" height="48px" background="#0000"/>
        <p style={{ fontSize: '24px' }} className={ displayFont.className }>Share skribo</p>
        <div style={{ width: "48px" }}/>
      </div>
      <Card height='100%'>
        <canvas ref={ref}/>
      </Card>
      <Card>
        <Tapable icon='/QRIcon.svg' justifyContent='center' gap='8px' onTap={ () => {}}>
          <p className={displayFont.className} style={buttonStyle}>Save QR-code</p>
        </Tapable>
      </Card>
      <Card>
        <Tapable icon='/linkIcon.svg' background='#2C2A33' justifyContent='center' gap='8px' onTap={ () => {
          navigator.clipboard.writeText(link!).then(function() {
            setCopyStatus(true);
          });       
        }}>
          <p className={displayFont.className} style={{ ...buttonStyle, color: '#FFF' }}>{copyStatus ? 'Copied!' : 'Copy link' }</p>
        </Tapable>
      </Card>
    </Sheet.Content>
  </Sheet.Container>

  <Sheet.Backdrop />
</Sheet>
}

let style: CSSProperties = {
  padding: '16px',
  height: '100%',
  fontSize: '16px',
  border: 'none',
  resize: 'none',
}

let buttonStyle: CSSProperties = {
  margin: 0,
  fontSize: '18px'
}
