'use client';

import { CSSProperties, ReactNode } from "react";
import { displayFont } from "../components/fonts";

interface CardProps { 
  children: ReactNode[] | ReactNode;
  header?: { icon: string, title: string }, 
  outerStyle?: CSSProperties, 
  innerStyle?: CSSProperties, 
  effects?: CSSProperties | CSSProperties[],
  separators?: boolean,
}

export default function Card(props: CardProps) {
  const separator = <div style={styles.separatorStyle}/>;

  return <div style={{ ...styles.group, ...props.outerStyle }}>
    { /* header section */ }
    { props.header && <div style={{ ...styles.header }}>
      <img height={18} src={ props.header.icon } alt='Header Icon'/>
      <p style={{ margin: '0', color: '#585466', fontFamily: displayFont }}>{ props.header.title }</p>
    </div> }

    { /* content section */ }
    <div style={{ width: 'inherit', height: 'inherit' }}>
      <div style={{ ...styles.container, ...props.innerStyle, }}> 

        { Array.isArray(props.effects) 
            ? props.effects.map((effect, i) => 
              <div key={i} style={{ ...styles.effectProps, ...effect }}/>) 
            : <div style={{ ...styles.effectProps, ...props.effects }}/> }

        { Array.isArray(props.children) && props.separators 
            ? props.children.map((element, i) => <div style={{ display: 'contents' }} key={i}>{[i == 0 ? <></> : separator, element]}</div>) 
            : props.children } 

      </div>
    </div>
  </div>
}

let styles: Record<string, CSSProperties> = {
  group: {
    width: 'inherit', 
    flexDirection: 'column', 
    gap: 12,
  },

  header: {
    justifyContent: 'center', 
    alignItems: 'center', 
    gap: 8,
    fontSize: 14, 
  },

  container: {
    borderRadius: 12,
    background: '#FFF',
    boxShadow: '0 0 0 1px #0000000B',
    flexDirection: 'column',
    overflow: 'hidden',
    width: '100%',
    position: 'initial',
  },

  effectProps: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    borderRadius: 12,
  },

  separatorStyle: {
    width: '100%',
    height: 1,
    background: '#A9A6B255',
  }
}
