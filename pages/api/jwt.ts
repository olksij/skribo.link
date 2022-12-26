import type { NextApiRequest, NextApiResponse } from 'next'
import admin from 'firebase-admin';

let certificate = JSON.parse(process.env.firebaseAdmin!);

if (!admin.apps.length) admin.initializeApp({
  credential: admin.credential.cert(certificate),
  databaseURL: "https://slikker-scratch-card-default-rtdb.europe-west1.firebasedatabase.app"
});

type Data = any;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  let { id, accessToken } = JSON.parse(req.body);
  admin.auth().createCustomToken(id, { accessToken })
    .then(token => res.status(200).json(token));
}
