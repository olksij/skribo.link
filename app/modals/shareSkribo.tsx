'use client';

import { CSSProperties, useEffect, useRef, useState } from "react";

import backgrounds, { themeColors } from '../../assets/backgrounds/import'
import patterns from '../../assets/patterns/import'

import Sheet from 'react-modal-sheet';
import { displayFont, textFont } from "../../pages/_app";
import Card from "../elements/card";
import Tapable from "../elements/tapable";
import loadImage from "../components/loadImage";
import Head from "next/head";

export default function ShareSkriboModal({ link, theme, isOpen, onClose }: { link: string | undefined, theme: number | undefined, isOpen: boolean, onClose: () => void }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const renderId = useRef<number>(0);

  const [copied, setCopyStatus] = useState(false)

  const renderCanvas = async (theme: number | undefined, link: string | undefined, id: number) => {
    if (theme == null || link == null) return;
    
    let ratio = devicePixelRatio * 2,
        canvas = ref.current!,
        parent = canvas.parentElement;

    canvas.width = parent!.clientWidth * devicePixelRatio * 2;
    canvas.height = parent!.clientHeight * devicePixelRatio * 2;

    const qrCodeStyling = await import('qr-code-styling')

    if (id != renderId.current) return;

    new qrCodeStyling.default({
      width: innerWidth * ratio,
      height: innerWidth * ratio,
      type: "svg",
      data: link,
      dotsOptions: {
        gradient: {
          type: 'linear',
          rotation: Math.PI/4,
          colorStops: themeColors[theme].gradient
        },
        type: "extra-rounded"
      },
      cornersDotOptions: {
        type: "square",
      },
      backgroundOptions: { color: "#00000000" },
      imageOptions: { crossOrigin: "anonymous" }
    }).getRawData('png').then(async blob => {
      let bgImage = await loadImage(backgrounds[theme]);
      let patternImage = await loadImage(patterns[theme]);

      let bitmap = await createImageBitmap(blob!),
          canvas = ref.current!,
          context = canvas.getContext("2d")!;
      
      if (id != renderId.current) return;
      
      let { width, height } = canvas,
        qrSize = Math.round(Math.min(width, height) * 0.5),
        bgSize = Math.round(Math.min(width, height) * 0.7);
      
      context.clearRect(0, 0, width, height)
                
      context.drawImage(bgImage, 0, 0, width, height)

      context.globalAlpha = .3;
      context.globalCompositeOperation = 'overlay';
      context.drawImage(patternImage, 0, 0, width, width*2.15)
                
      let halfWidth = width/2,
          halfHeight = height/2;
      
      context.globalAlpha = 1;

      context.strokeStyle = '#0006';
      context.lineWidth = ratio*3;
      context.roundRect(halfWidth-bgSize/2, halfHeight-bgSize/2, bgSize, bgSize, 16 * ratio);
      context.stroke()
      context.strokeStyle = '#0000';

      context.shadowColor = '#0004';
      context.shadowBlur = 32 * ratio;
      context.shadowOffsetY = 8 * ratio;
      context.fill()
      context.shadowBlur = 64 * ratio;
      context.shadowOffsetY = 16 * ratio;
      context.fill()
      
      context.shadowColor = '#0000';

      context.strokeStyle = '#000A';
      context.beginPath();
      context.roundRect(0, 0, width, height, 12 * ratio);
      context.stroke()

      context.globalCompositeOperation = 'multiply';
      context.fillStyle = '#AAA';
      context.textAlign = 'center';
      context.textBaseline = 'top'
      context.font = ((12 * ratio) + 'px ') + ` text`;
      context.fillText(link, halfWidth, halfHeight + bgSize/2 + 24*ratio);
      
      context.globalCompositeOperation = 'source-over';

      context.fillStyle = themeColors[theme].card;
      context.beginPath();
      context.roundRect(halfWidth-bgSize/2, halfHeight-bgSize/2, bgSize, bgSize, 16 * ratio);
      context.fill()

      context?.drawImage(bitmap, halfWidth-qrSize/2, halfHeight-qrSize/2, qrSize, qrSize)
    })
  }

  useEffect(() => { 
    if (isOpen) {
      renderId.current = Date.now(), renderCanvas(theme, link, renderId.current);
      addEventListener('resize', () => { renderId.current = Date.now(), renderCanvas(theme, link, renderId.current) });
    }
  }, [theme, link, isOpen])

  useEffect(() => {
    if (isOpen) {
      document.getElementById('metaModalColor')?.setAttribute('name', 'theme-color');
      document.getElementById('metaThemeColor')?.setAttribute('name', '');
    }
    else {
      document.getElementById('metaThemeColor')?.setAttribute('name', 'theme-color');
      document.getElementById('metaModalColor')?.setAttribute('name', '');
    }
  }, [isOpen])

  return <Sheet rootId='__next' isOpen={isOpen} onClose={onClose}>
  <Sheet.Container style={{ background: '#EBEBF0' }}>
    <Sheet.Header />
    <Sheet.Content style={{ padding: '0 24px 24px 24px', flexDirection: 'column', gap: '20px' }}>
      <div style={{ alignItems: 'center', justifyContent: 'space-between', height: '48px', width: '100%' }}>
        <Tapable onTap={onClose} icon='/backIcon.svg' justify="center" height="48px" style={{ borderRadius: 12 }}/>
        <p style={{ fontSize: '24px', margin: 'revert' }} className={ displayFont.className }>Share skribo</p>
        <div style={{ width: "48px" }}/>
      </div>
      <Card innerStyle={{ boxShadow: 'none' }} outerStyle={{ height: '100%' }}>
        <canvas ref={ref} style={{ position: 'sticky', borderRadius: '12px' }}/>
      </Card>
      <Card innerStyle={{ height: 56 }}>
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
      <Card innerStyle={{ height: 56, background: copied ? '#71D89C' : 'var(--text)' }}>
        <Tapable height={56} justifyContent='center' onTap={ () => {
          navigator.clipboard.writeText(link!).then(function() {
            setCopyStatus(true); setTimeout(() => setCopyStatus(false), 1500)
          });       
        }}>
          <div style={{ opacity: copied ? 0 : 1, marginTop: copied ? -32 : 0, position: 'absolute', gap: 8 }}>
            <img width={24} src="/linkIcon.svg"/>
            <p className={displayFont.className} style={{ ...buttonStyle, color: '#FFF' }}>Copy link</p>
          </div>
          <div style={{ opacity: copied ? 1 : 0, marginTop: copied ? 0 : 32, position: 'absolute', gap: 8 }}>
            <img width={24} src="/doneIcon.svg"/>
            <p className={displayFont.className} style={{ ...buttonStyle, color: '#141A17' }}>Copied!</p>
          </div>
        </Tapable>
      </Card>
    </Sheet.Content>
  </Sheet.Container>

  <Sheet.Backdrop />
</Sheet>
}

let buttonStyle: CSSProperties = {
  margin: 0,
  fontSize: '18px'
}
