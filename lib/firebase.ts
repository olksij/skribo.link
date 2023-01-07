import { getApps, initializeApp } from "firebase/app";

import { getDatabase } from "firebase/database";
import { getStorage }  from "firebase/storage";
import { getAuth }     from "firebase/auth";
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

const firebaseConfig = JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG!);

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// export utils
export const database = getDatabase(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

export const initAppCheck = () => {
  // @ts-ignore
  self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;

  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(process.env.NEXT_PUBLIC_RECAPTCHA_SITEKEY!),
    isTokenAutoRefreshEnabled: true
  });
}
