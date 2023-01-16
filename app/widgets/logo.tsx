import logoLight from '/assets/logo/logoLight.svg';
import logoDark  from '/assets/logo/logoDark.svg';

type LogoProps = {
  light?: boolean,
}

export default function Logo({ light }: LogoProps) {
  return <img src={ light ? logoLight.src : logoDark.src } alt='Skribo Logo'/>
}