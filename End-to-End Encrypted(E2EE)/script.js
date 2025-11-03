// script.js
const socket = io();
let myKeyPair = null;
let myPublicJwk = null;
let sharedAesKey = null;
let peerPublicJwk = null;
let roomName = null;
let myUsername = null;

const chatEl = document.getElementById('chat');
const connectBtn = document.getElementById('connectBtn');
const usernameInput = document.getElementById('username');
const roomInput = document.getElementById('room');
const chatWrap = document.getElementById('chatWrap');
const sendBtn = document.getElementById('sendBtn');
const msgInput = document.getElementById('message');

function logMsg(text, cls='') {
  const div = document.createElement('div');
  div.innerText = text;
  if (cls) div.className = cls;
  chatEl.appendChild(div);
  chatEl.scrollTop = chatEl.scrollHeight;
}

// --- helpers for encoding ---

function str2ab(s) {
  return new TextEncoder().encode(s);
}
function ab2str(ab) {
  return new TextDecoder().decode(ab);
}
function abToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i=0;i<bytes.byteLength;i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}
function base64ToAb(b64) {
  const binary = atob(b64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i=0;i<len;i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

// --- Crypto functions ---

async function generateECDHKeyPair() {
  const keys = await crypto.subtle.generateKey(
    { name: 'ECDH', namedCurve: 'P-256' },
    true,
    ['deriveKey', 'deriveBits']
  );
  return keys;
}

async function exportPublicJwk(key) {
  return await crypto.subtle.exportKey('jwk', key);
}

async function importPeerPublicJwk(jwk) {
  // jwk should be an EC public key (kty: "EC")
  return await crypto.subtle.importKey(
    'jwk',
    jwk,
    { name: 'ECDH', namedCurve: 'P-256' },
    true,
    []
  );
}

async function deriveAesKey(privateKey, peerPublicKey) {
  // derive a 256-bit AES-GCM key
  const aesKey = await crypto.subtle.deriveKey(
    { name: 'ECDH', public: peerPublicKey },
    privateKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
  return aesKey;
}

async function encryptMessage(aesKey, plaintext) {
  const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV
  const data = str2ab(plaintext);
  const ct = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    aesKey,
    data
  );
  return {
    iv: abToBase64(iv),
    cipher: abToBase64(ct)
  };
}

async function decryptMessage(aesKey, iv_b64, cipher_b64) {
  const iv = base64ToAb(iv_b64);
  const cipher = base64ToAb(cipher_b64);
  try {
    const plain = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: new Uint8Array(iv) },
      aesKey,
      cipher
    );
    return ab2str(plain);
  } catch (e) {
    console.error('decrypt failed', e);
    return null;
  }
}

// --- Socket & UI flow ---

connectBtn.onclick = async () => {
  myUsername = usernameInput.value.trim() || 'Anon';
  roomName = roomInput.value.trim() || 'room1';

  // 1. Generate ephemeral ECDH keys
  myKeyPair = await generateECDHKeyPair();
  myPublicJwk = await exportPublicJwk(myKeyPair.publicKey);

  // Show UI
  chatWrap.style.display = 'block';
  document.getElementById('setup').style.display = 'none';
  logMsg(`Connected as ${myUsername}. Generating keys and joining ${roomName}...`, 'me');

  // 2. Join room on server
  socket.emit('join', roomName);

  // 3. Send our public key (JWK) to peers via server
  socket.emit('public-key', { room: roomName, jwk: myPublicJwk, username: myUsername });

  logMsg('Public key sent to room (via server). Waiting for peer public key...', 'me');
};

// When we receive a peer public key from server
socket.on('public-key', async ({ jwk, from, username }) => {
  // Save peer jwk and derive shared key
  logMsg(`Received public key from ${username || 'peer'} (socket ${from})`, 'peer');
  peerPublicJwk = jwk;

  const imported = await importPeerPublicJwk(peerPublicJwk);
  sharedAesKey = await deriveAesKey(myKeyPair.privateKey, imported);
  logMsg('Shared AES-GCM key derived locally. You can send encrypted messages now.', 'me');
});

// When a peer joins (info message)
socket.on('peer-joined', ({ id }) => {
  logMsg(`A peer joined the room (${id}).`, 'peer');
});

// When receiving encrypted messages (server just forwarded)
socket.on('encrypted-message', async ({ payload, from }) => {
  if (!sharedAesKey) {
    logMsg('Received encrypted message but shared key not established yet — cannot decrypt.', 'peer');
    return;
  }
  const { iv, cipher, fromUsername } = payload;
  const plain = await decryptMessage(sharedAesKey, iv, cipher);
  if (plain === null) {
    logMsg('(decryption failed)', 'peer');
  } else {
    logMsg(`${fromUsername || 'Peer'}: ${plain}`, 'peer');
  }
});

// Send encrypted messages
sendBtn.onclick = async () => {
  const text = msgInput.value.trim();
  if (!text) return;
  if (!sharedAesKey) {
    alert('Shared key not yet established. Wait until both peers exchange public keys.');
    return;
  }
  const enc = await encryptMessage(sharedAesKey, text);
  const payload = { ...enc, fromUsername: myUsername };
  // send to server (server relays to room)
  socket.emit('encrypted-message', { room: roomName, payload });
  logMsg(`You: ${text}`, 'me');
  msgInput.value = '';
};
