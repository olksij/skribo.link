// characters order in order to represent [id] & [secret] in correct way in URL
const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-=';

type Argorithm = {
  name: string;
  hash?: string;
  length?: number;
}

const importAlgorithm: Argorithm = { name: 'HKDF', hash: 'SHA-256' }
const encryptAlgorithm: Argorithm = { name: 'AES-GCM', length: 256 }

function deserialize(data: string) {
  let array = new Uint8Array(data.length);
  Array.from(data).forEach((char, i) => array[i] = characters.indexOf(char))
  return array;
}

function genID() {
  let string = '';
  crypto.getRandomValues(new Uint8Array(8))
    .forEach(num => string += characters[num % 64]);
  return string;
}

export async function genKeys() {
  // generate random strings which both are parts of shareable link
  let id = genID(), secret = genID();

  // convert [id] & [secret] to <string> before sending
  return { id, secret, ... await deriveKeys(secret, importAlgorithm, encryptAlgorithm), importAlgorithm, encryptAlgorithm }
}

export async function encryptData(key: CryptoKey, data: ArrayBuffer) {
  // generate initialization vector
  let iv = crypto.getRandomValues(new Uint8Array(16));
  
  // encrypt the file and return
  return { data: await crypto.subtle.encrypt({ name: encryptAlgorithm.name, iv }, key, data), iv };
}

export async function deriveKeys(secret: string, importAlgorithm: Argorithm, encryptAlgorithm: Argorithm, salt?: Uint8Array) {
  let key = deserialize(secret);
  let subtle = crypto.subtle;

  let algorithm = { ...importAlgorithm, salt: salt ?? crypto.getRandomValues(new Uint8Array(256)), info: new Uint8Array(0) } 

  // generate tokens from the secret used in link
  let accessToken = await subtle.digest('SHA-256', key).then(b => new Uint8Array(b));

  let importedKey = await subtle.importKey('raw', key, algorithm, false, ['deriveKey']);
  console.log(importedKey, algorithm.salt)
  let encryptKey = await subtle.deriveKey(algorithm, importedKey, encryptAlgorithm, false, ['encrypt', 'decrypt']);  

  return { accessToken, encryptKey, salt: algorithm.salt };
}


export const decryptData = async (key: CryptoKey, iv: Uint8Array, data: ArrayBuffer) =>
  await crypto.subtle.decrypt({ name: encryptAlgorithm.name, iv }, key, data)
