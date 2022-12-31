'use client';

import { CSSProperties, useEffect, useRef, useState } from "react";

import defaultBackground from '../backgrounds/default.svg'
import defaultPattern from '../patterns/default.svg'

import Sheet from 'react-modal-sheet';
import { displayFont, textFont } from "../../pages/_app";
import Card from "../components/card";
import Tapable from "../components/tapable";
import loadImage from "../components/loadImage";

export default function ShareSkriboModal({ link, theme, isOpen, onClose }: { link: string | undefined, theme: number | undefined, isOpen: boolean, onClose: () => void }) {
  const ref = useRef<HTMLCanvasElement>(null);

  const [copyStatus, setCopyStatus] = useState(false)

  useEffect(() => {
    let ratio = devicePixelRatio * 2;

    if (link && isOpen) {
      import('qr-code-styling').then(async qrCodeStyling => {
        new qrCodeStyling.default({
          width: 512,
          height: 512,
          type: "svg",
          data: link,
          dotsOptions: {
            gradient: {
              type: 'linear',
              rotation: Math.PI/4,
              colorStops: [
                { color: '#BF73E5', offset: 0 },
                { color: '#9973E5', offset: .33 },
                { color: '#7386E5', offset: .66 },
                { color: '#739DE5', offset: 1 },
              ]
            },
            type: "extra-rounded"
          },
          cornersDotOptions: {
            type: "square",
          },
          backgroundOptions: { color: "#00000000" },
          imageOptions: { crossOrigin: "anonymous" }
        }).getRawData('png').then(async blob => {
          let bitmap = await createImageBitmap(blob!),
              canvas = ref.current!,
              context = canvas.getContext("2d")!;

          let { width, height } = canvas,
            qrSize = Math.min(width, height) * 0.56,
            bgSize = Math.min(width, height) * 0.8;

          context.drawImage(await loadImage(defaultBackground.src), 0, 0, width, height)

          context.globalAlpha = .15;
          context.globalCompositeOperation = 'overlay';
          context.drawImage(await loadImage(defaultPattern.src), 0, 0)
                    
          let halfWidth = width/2,
              halfHeight = height/2;
          
          context.globalAlpha = 1;
          context.globalCompositeOperation = 'overlay';
          context.fillStyle = '#DADADA';
          context.beginPath();
          context.roundRect(halfWidth-bgSize/2, halfHeight-bgSize/2, bgSize, bgSize, 16 * ratio);
          context.fill()

          context.globalCompositeOperation = 'multiply';
          context.fillStyle = '#AAA';
          context.textAlign = 'center';
          context.textBaseline = 'top'
          context.font = ((12 * ratio) + 'px ') + textFont.className.replace('className', 'textFont');
          context.fillText(link, halfWidth, halfHeight + bgSize/2 + 24*ratio);

          context.globalCompositeOperation = 'source-over';
          context?.drawImage(bitmap, halfWidth-qrSize/2, halfHeight-qrSize/2, qrSize, qrSize)
        })  
      })
    }

    if (!ref.current) return;
    let canvas = ref.current!,
        parent = canvas.parentElement;
    
    canvas.width = parent!.clientWidth * ratio;
    canvas.height = parent!.clientHeight * ratio;
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
      <Card inset={true} height='100%'>
        <canvas ref={ref} style={{ position: 'sticky', borderRadius: '12px' }}/>
      </Card>
      <Card height="56px">
        <Tapable icon='/QRIcon.svg' justifyContent='center' gap='8px' onTap={ () => {
          ref.current?.toBlob(function (blob) {
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob!);
            link.download = link + '.webp';
            link.click();
          }, "image/webp");
        }}>
          <p className={displayFont.className} style={buttonStyle}>Save QR-code</p>
        </Tapable>
      </Card>
      <Card height="56px">
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
