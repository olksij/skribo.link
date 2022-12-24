import styles from '../../styles/copyright.module.css'
import { textFont } from '../../pages/_app';

export default function Copyright() {
  return <div className={styles.copyright}>
    <img src='/copyrightIcon.svg'/>
    <p className={textFont.className}>2022 Oleksii Besida</p>
  </div>;
}