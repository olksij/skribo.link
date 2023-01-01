import { CSSProperties, ReactNode, useRef } from "react";
import { displayFont } from "../../pages/_app";

export enum CardType { 
  List = 'column',
  Select = 'row'
}

export default function Card({ children, className, type, header, padding, gap, height, outerStyle, innerStyle, inset }: { children: ReactNode[] | ReactNode, className?: string; type?: CardType; header?: { icon: string, title: string }, padding?: string, gap?: string, height?: string, outerStyle?: CSSProperties, innerStyle?: CSSProperties, inset?: boolean },) {
  const separator = <div style={separatorStyle}/>;
  type ??= CardType.List;
  inset ??= false;

  return <div style={{ width: 'inherit', flexDirection: 'column', gap: '12px', height, ...outerStyle }}>
    { header && <div style={{ justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
      <img src={ header.icon }/>
      <p style={{ fontSize: '14px', color: '#585466', margin: '0' }} className={displayFont.className}>{ header.title }</p>
    </div> }
    <div style={{ ...container, flexDirection: type, padding, justifyContent: type == CardType.List ? 'center' : 'start', overflowX: type == CardType.Select ? 'scroll' : 'hidden', gap, height, ...innerStyle, boxShadow: inset ? 'inset ' + container.boxShadow : container.boxShadow }} className={className}> { 
      Array.isArray(children) && type == CardType.List 
        ? children.map((element, i) => [i == 0 ? <></> : separator, element]) 
        : children 
    } </div>
  </div>
}

let container: CSSProperties = {
  borderRadius: '12px',
  background: '#FFF',
  boxShadow: '0 0 0 1px #0000000B',
  flexDirection: 'column',
  overflow: 'hidden',
}

let separatorStyle: CSSProperties = {
  width: '100%',
  height: '1px',
  background: '#A9A6B255',
}
