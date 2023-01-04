import backgrounds from '../backgrounds/import'
import patterns    from '../patterns/import'

export default function Background({ id }: { id: number | null }) {
  id ??= 0;
  return <div style={{ opacity: id == null ? 0 : 1, transition: '.3s cubic-bezier(.5, 0, 0, 1)', width: '100%', height: '100%', position: 'absolute', backgroundSize: 'cover', backgroundImage: `url(${backgrounds[id]})` }}>
    <div style={{ background: `url(${patterns[id]})`, width: '100%', mixBlendMode: 'overlay', opacity: '.2', backgroundSize: '512px' }}/>
  </div>
}