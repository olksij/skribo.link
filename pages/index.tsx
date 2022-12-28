import Head from 'next/head'
import styles from '../styles/home.module.css'

import UploadButton from '../lib/components/uploadButton';
import Copyright from '../lib/components/copyright';

export default function Home() {
  return (
    <>
      <main className={styles.container}>
        <img src="/logo.svg"/>
        <UploadButton/>
        <Copyright/>
      </main>
    </>
  )
}
