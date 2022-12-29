import { CSSProperties, ReactNode, useRef } from "react";

export default function Card({ children, className }: { children: ReactNode[] | ReactNode, className?: string; }) {
  const separator = <div style={separatorStyle}/>;

  return <div style={container} className={className}>
    { Array.isArray(children) ? children.map((element, i) => 
      [i == 0 ? <></> : separator, element]
    ) : children }
  </div>
}

let container: CSSProperties = {
  borderRadius: '12px',
  background: '#FFF',
  boxShadow: '0 0 0 1px #0000000B',
  flexDirection: 'column',
  overflow: 'hidden',
  width: '100%',
}

let separatorStyle: CSSProperties = {
  width: '100%',
  height: '1px',
  background: '#A9A6B255',
}
