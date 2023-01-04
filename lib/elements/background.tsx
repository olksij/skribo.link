import backgrounds from '../backgrounds/import'
import patterns    from '../patterns/import'

export default function Background({ id }: { id: number }) {
  return <div style={{ width: '100%', height: '100%', position: 'absolute', backgroundSize: 'cover', backgroundImage: `url(${backgrounds[id]})` }}>
    <div style={{ background: `url(${patterns[id]})`, width: '100%', mixBlendMode: 'overlay', opacity: '.3', backgroundSize: 'cover' }}/>
  </div>
}