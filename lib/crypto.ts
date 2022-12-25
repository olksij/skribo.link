// characters order in order to represent [id] & [secret] in correct way in URL
const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-=';

const importAlgorithm = { name: 'HKDF', hash: 'SHA-256' }
const encryptAlgorithm = { name: 'AES-GCM', length: 256 }

const subtle = window.crypto.subtle;

function serialize(data: Uint8Array) {
  let string = '';
  data.forEach(num => string += characters[num])
  return string;
}

function genID() {
  let array = new Uint8Array(8);
  window.crypto.getRandomValues(array);

  return array.map(num => num % 64)
}

export async function genKeys() {
  // generate random strings which both are parts of shareable link
  let id = genID(), secret = genID();

  // generate tokens from the secret used in link
  let accessToken = await subtle.digest('SHA-256', secret).then(b => new Uint8Array(b));

  let importedKey = await subtle.importKey('raw', secret, importAlgorithm, false, ['deriveKey']);
  let encryptKey = await subtle.deriveKey(importAlgorithm, importedKey, encryptAlgorithm, false, ['encrypt', 'decrypt']);

  // convert [id] & [secret] to <string> before sending
  return { id: serialize(id), secret: serialize(secret), accessToken, encryptKey }
}

export async function encryptFile(key: CryptoKey, file: File) {
  // read file
  let reader = new FileReader();
  reader.readAsArrayBuffer(file); 

  // resolve the [ArrayBuffer] form [file]
  var data = await new Promise<ProgressEvent<FileReader>>(resolve => 
    reader.onload = resolve).then(e => e.target!.result) as ArrayBuffer;

  // generate initialization vector
  let iv = crypto.getRandomValues(new Uint8Array(16));
  
  // encrypt the file and convert to [Blob]
  let arrayBuffer = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, data)
  let blob = new Blob([arrayBuffer]);
  
  return { blob, iv };
}
