// ── Config ────────────────────────────────────────────────────────────────
const ICE_SERVERS = [{ urls: 'stun:stun.l.google.com:19302' }];

// ── State ─────────────────────────────────────────────────────────────────
let pc        = null;
let dc        = null;
let myId      = '';
let messages  = [];
let pendingOfferEncrypted = null;
let localNonce      = null;
let remoteNonce     = null;
let peerTypingTimer = null;
let lastTypingSent  = 0;

// ── Identity ──────────────────────────────────────────────────────────────
const HANDLES = [
  'Wolf','Fox','Bear','Lynx','Crow','Hawk',
  'Viper','Ghost','Storm','Shade','Raven','Pike'
];

function getMyId() {
  let id = sessionStorage.getItem('btw_id');
  if (!id) {
    const name = HANDLES[Math.floor(Math.random() * HANDLES.length)];
    const code = Math.random().toString(36).slice(2, 5).toUpperCase();
    id = name + code;
    sessionStorage.setItem('btw_id', id);
  }
  return id;
}

// ── Passphrase generation ─────────────────────────────────────────────────
const WORDS = [
  'blue','red','swift','storm','fox','wolf','river','stone',
  'fire','moon','dark','cloud','rain','wind','star','snow',
  'oak','iron','gold','ghost','amber','coral','jade','onyx',
  'sage','frost','dusk','ember','ridge','vale'
];

function genPassphrase() {
  const pick = () => WORDS[Math.floor(Math.random() * WORDS.length)];
  const num  = String(crypto.getRandomValues(new Uint16Array(1))[0] % 9000 + 1000);
  return `${pick()}-${pick()}-${pick()}-${num}`;
}

// ── AES-GCM encryption (Web Crypto — no library) ──────────────────────────

async function deriveKey(passphrase, salt) {
  const raw = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(passphrase),
    'PBKDF2', false, ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    raw,
    { name: 'AES-GCM', length: 256 },
    false, ['encrypt', 'decrypt']
  );
}

async function encryptText(text, passphrase) {
  const salt      = crypto.getRandomValues(new Uint8Array(16));
  const iv        = crypto.getRandomValues(new Uint8Array(12));
  const key       = await deriveKey(passphrase, salt);
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv }, key, new TextEncoder().encode(text)
  );
  // Pack: salt(16) + iv(12) + ciphertext
  const out = new Uint8Array(16 + 12 + encrypted.byteLength);
  out.set(salt, 0);
  out.set(iv, 16);
  out.set(new Uint8Array(encrypted), 28);
  return toB64(out);
}

async function decryptText(encoded, passphrase) {
  const buf  = fromB64(encoded);
  const salt = buf.slice(0, 16);
  const iv   = buf.slice(16, 28);
  const data = buf.slice(28);
  const key  = await deriveKey(passphrase, salt);
  const dec  = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data);
  return new TextDecoder().decode(dec);
}

// ── Compression ───────────────────────────────────────────────────────────

async function compress(str) {
  const bytes = new TextEncoder().encode(str);
  if (window.CompressionStream) {
    const cs = new CompressionStream('deflate-raw');
    const w  = cs.writable.getWriter();
    w.write(bytes); w.close();
    const chunks = [];
    const r = cs.readable.getReader();
    while (true) { const { done, value } = await r.read(); if (done) break; chunks.push(value); }
    let len = 0; for (const c of chunks) len += c.length;
    const out = new Uint8Array(len); let off = 0;
    for (const c of chunks) { out.set(c, off); off += c.length; }
    return toB64(out);
  }
  return toB64(bytes);
}

async function decompress(str) {
  const bytes = fromB64(str);
  if (window.DecompressionStream) {
    try {
      const ds = new DecompressionStream('deflate-raw');
      const w  = ds.writable.getWriter();
      w.write(bytes); w.close();
      const chunks = [];
      const r = ds.readable.getReader();
      while (true) { const { done, value } = await r.read(); if (done) break; chunks.push(value); }
      let len = 0; for (const c of chunks) len += c.length;
      const out = new Uint8Array(len); let off = 0;
      for (const c of chunks) { out.set(c, off); off += c.length; }
      return new TextDecoder().decode(out);
    } catch (_) {}
  }
  return new TextDecoder().decode(bytes);
}

function toB64(bytes) {
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g,'-').replace(/\//g,'_').replace(/=/g,'');
}

function fromB64(str) {
  const b64 = str.replace(/-/g,'+').replace(/_/g,'/');
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

// ── UI state machine ──────────────────────────────────────────────────────

function showState(state) {
  ['hs-loading','hs-offering','hs-passphrase','hs-answering',
   'handshake','messages','composer'].forEach(id => {
    document.getElementById(id).classList.add('hidden');
  });

  if (state === 'chat') {
    document.getElementById('messages').classList.remove('hidden');
    document.getElementById('composer').classList.remove('hidden');
    document.getElementById('msg-input').focus();
  } else {
    document.getElementById('handshake').classList.remove('hidden');
    const map = { loading:'hs-loading', offering:'hs-offering',
                  passphrase:'hs-passphrase', answering:'hs-answering' };
    if (map[state]) document.getElementById(map[state]).classList.remove('hidden');
  }
}

function setStatus(text) {
  document.getElementById('status-label').textContent = text;
}

// ── ICE gathering ─────────────────────────────────────────────────────────

function waitForICE(conn) {
  return new Promise(resolve => {
    if (conn.iceGatheringState === 'complete') { resolve(); return; }
    const t = setTimeout(resolve, 6000);
    conn.addEventListener('icegatheringstatechange', function h() {
      if (conn.iceGatheringState === 'complete') {
        clearTimeout(t);
        conn.removeEventListener('icegatheringstatechange', h);
        resolve();
      }
    });
  });
}

// ── Peer status ───────────────────────────────────────────────────────────

let peerName      = 'Other person';
let activityTimer = null;

function setPeerStatus(state) {
  const bar  = document.getElementById('peer-status');
  const dot  = document.getElementById('peer-dot');
  const text = document.getElementById('peer-status-text');

  dot.className = 'peer-dot ' + state;

  const labels = {
    connecting:   'Connecting…',
    active:       peerName + ' is active',
    idle:         peerName + ' has been idle for a minute',
    away:         peerName + '\'s tab is in the background',
    disconnected: peerName + ' disconnected'
  };

  text.textContent = labels[state] || state;
  bar.classList.remove('hidden');
}

function sendStatus(s) {
  if (dc && dc.readyState === 'open') {
    dc.send(JSON.stringify({ type: 'status', s, u: myId }));
  }
}

function startActivityTracking() {
  // Track local visibility → tell peer when we go away/come back
  document.addEventListener('visibilitychange', () => {
    sendStatus(document.hidden ? 'away' : 'active');
  });

  // Track mouse/keyboard — if silent for 60s, tell peer we're idle
  const onActivity = () => {
    sendStatus('active');
    clearTimeout(activityTimer);
    activityTimer = setTimeout(() => sendStatus('idle'), 60000);
  };

  document.addEventListener('mousemove',  onActivity, { passive: true });
  document.addEventListener('keydown',    onActivity, { passive: true });
  document.addEventListener('touchstart', onActivity, { passive: true });

  // Kick off the first idle timer
  activityTimer = setTimeout(() => sendStatus('idle'), 60000);
}

// ── Session verification (SAS — short authentication string) ─────────────

function genNonce() {
  return Array.from(crypto.getRandomValues(new Uint8Array(8)))
    .map(b => b.toString(16).padStart(2, '0')).join('');
}

async function computeSessionCode(a, b) {
  const [n1, n2] = [a, b].sort();
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(n1 + n2));
  return Array.from(new Uint8Array(buf)).slice(0, 6)
    .map(b => b.toString(16).padStart(2, '0').toUpperCase())
    .join('·'); // middle-dot separator
}

function showSessionCode(code) {
  const el  = document.getElementById('session-code');
  const val = document.getElementById('session-code-val');
  const sep = document.getElementById('session-sep');
  if (!el) return;
  if (val) val.textContent = '🔐 ' + code;
  el.classList.remove('hidden');
  if (sep) sep.classList.remove('hidden');
}

// ── QR Code for offer URL ─────────────────────────────────────────────────

function renderOfferQR(url) {
  try {
    var qr = qrcode(0, 'M');
    qr.addData(url, 'Byte');
    qr.make();
    var svg = qr.createSvgTag({ scalable: true, margin: 2 });
    document.getElementById('offer-qr').innerHTML = svg;
  } catch (_) {
    var btn = document.getElementById('qr-toggle');
    if (btn) btn.style.display = 'none';
  }
}

// ── Typing indicator ─────────────────────────────────────────────────────

function showTyping() {
  const el = document.getElementById('typing-indicator');
  const nm = document.getElementById('typing-name');
  if (!el) return;
  if (nm) nm.textContent = peerName;
  el.classList.remove('hidden');
}

function hideTyping() {
  const el = document.getElementById('typing-indicator');
  if (el) el.classList.add('hidden');
  clearTimeout(peerTypingTimer);
}

function sendTyping() {
  if (!dc || dc.readyState !== 'open') return;
  const now = Date.now();
  if (now - lastTypingSent < 2000) return;  // throttle to once per 2s
  lastTypingSent = now;
  dc.send(JSON.stringify({ type: 'typing', u: myId }));
}

// ── DataChannel ───────────────────────────────────────────────────────────

function setupChannel(channel) {
  dc = channel;
  dc.addEventListener('open', () => {
    setStatus('🔒 Connected');
    showState('chat');
    render();
    toast('Connected — fully encrypted');
    setPeerStatus('connecting');
    startActivityTracking();
    sendStatus('active');
    // Exchange nonces to compute a session verification code
    localNonce = genNonce();
    dc.send(JSON.stringify({ type: 'verify', nonce: localNonce }));
    // Passphrase no longer needed once the DataChannel is open
    sessionStorage.removeItem('btw_pass');
  });
  dc.addEventListener('message', e => {
    const data = JSON.parse(e.data);
    if (data.type === 'verify') {
      remoteNonce = data.nonce;
      if (localNonce) {
        computeSessionCode(localNonce, remoteNonce).then(showSessionCode);
      }
    } else if (data.type === 'typing') {
      if (data.u) peerName = data.u;
      showTyping();
      clearTimeout(peerTypingTimer);
      peerTypingTimer = setTimeout(hideTyping, 3000);
    } else if (data.type === 'status') {
      if (data.u) peerName = data.u;
      setPeerStatus(data.s);
    } else {
      if (data.u) peerName = data.u;
      hideTyping();
      messages.push(data);
      render();
    }
  });
  dc.addEventListener('close', () => {
    setStatus('Disconnected');
    setPeerStatus('disconnected');
    toast('Other person disconnected');
  });
}

// ── User A: create + encrypt offer ────────────────────────────────────────

async function initOffer() {
  showState('loading');
  setStatus('Setting up…');

  const passphrase = genPassphrase();
  sessionStorage.setItem('btw_pass', passphrase);

  pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
  pc.addEventListener('connectionstatechange', onConnState);
  setupChannel(pc.createDataChannel('chat'));

  await pc.setLocalDescription(await pc.createOffer());
  await waitForICE(pc);

  // Compress then encrypt the SDP
  const compressed = await compress(JSON.stringify(pc.localDescription));
  const encrypted  = await encryptText(compressed, passphrase);

  const url = location.origin + location.pathname + '#offer=' + encrypted;
  document.getElementById('offer-url').value = url;
  document.getElementById('passphrase-display').textContent = passphrase;
  renderOfferQR(url);

  setStatus('Waiting for reply');
  showState('offering');

  // Auto-copy invite link
  copyText(url, false);
  toast('Invite link copied — share it, then send the passphrase separately');
}

// ── User B: show passphrase entry ─────────────────────────────────────────

function promptPassphrase(offerEncrypted) {
  pendingOfferEncrypted = offerEncrypted;
  setStatus('Enter passphrase');
  showState('passphrase');
  document.getElementById('passphrase-input').focus();
}

async function unlockOffer() {
  const passphrase = document.getElementById('passphrase-input').value.trim();
  const errEl      = document.getElementById('passphrase-error');
  errEl.classList.add('hidden');

  if (!passphrase) return;

  showState('loading');
  setStatus('Decrypting…');

  try {
    const compressed = await decryptText(pendingOfferEncrypted, passphrase);
    sessionStorage.setItem('btw_pass', passphrase);
    await buildAnswer(compressed);
  } catch (_) {
    // AES-GCM auth tag failure = wrong passphrase
    showState('passphrase');
    setStatus('Enter passphrase');
    errEl.classList.remove('hidden');
    document.getElementById('passphrase-input').focus();
  }
}

// ── User B: create + encrypt answer ──────────────────────────────────────

async function buildAnswer(compressedOffer) {
  showState('loading');
  setStatus('Preparing reply…');

  const passphrase = sessionStorage.getItem('btw_pass');

  pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
  pc.addEventListener('connectionstatechange', onConnState);
  pc.addEventListener('datachannel', e => setupChannel(e.channel));

  const offer = JSON.parse(await decompress(compressedOffer));
  await pc.setRemoteDescription(new RTCSessionDescription(offer));
  await pc.setLocalDescription(await pc.createAnswer());
  await waitForICE(pc);

  const compressed = await compress(JSON.stringify(pc.localDescription));
  const encrypted  = await encryptText(compressed, passphrase);

  const url = location.origin + location.pathname + '#answer=' + encrypted;
  document.getElementById('answer-url').value = url;

  setStatus('Waiting for connection');
  showState('answering');

  copyText(url, false);
  toast('Reply link copied — send it back to them');
}

// ── User A: decrypt answer + complete connection ──────────────────────────

async function completeConnection() {
  const raw = document.getElementById('answer-paste').value.trim();
  if (!raw) return;

  let encoded = raw;
  if (raw.includes('#answer=')) encoded = raw.split('#answer=')[1];
  else if (raw.includes('answer=')) encoded = raw.split('answer=')[1];
  encoded = encoded.split('&')[0];

  showState('loading');
  setStatus('Connecting…');

  try {
    const passphrase = sessionStorage.getItem('btw_pass');
    const compressed = await decryptText(encoded, passphrase);
    const answer     = JSON.parse(await decompress(compressed));
    await pc.setRemoteDescription(new RTCSessionDescription(answer));
    // DataChannel 'open' fires → transitions to chat
  } catch (_) {
    showState('offering');
    setStatus('Waiting for reply');
    toast('Invalid or tampered link — try again');
  }
}

function onConnState() {
  if (pc.connectionState === 'failed') {
    setStatus('Failed');
    toast('Connection failed — try starting a new chat');
  }
}

// ── Send message ──────────────────────────────────────────────────────────

function sendMessage() {
  const input = document.getElementById('msg-input');
  const text  = input.value.trim();
  if (!text || !dc || dc.readyState !== 'open') return;

  const msg = { type: 'msg', u: myId, m: text, t: Date.now() };
  messages.push(msg);
  dc.send(JSON.stringify(msg));
  input.value = '';
  render();
}

// ── Render ────────────────────────────────────────────────────────────────

function render() {
  const el = document.getElementById('messages');
  if (!messages.length) {
    el.innerHTML = '<div class="empty-state"><div class="icon">🔒</div><p>Connected &amp; encrypted.<br>Say hello.</p></div>';
    return;
  }
  el.innerHTML = messages.map(msg => {
    const own = msg.u === myId;
    return `<div class="msg ${own ? 'own' : 'them'}">
      <span class="msg-meta">${own ? 'You' : escHtml(msg.u)} · ${fmtTime(msg.t)}</span>
      <div class="msg-bubble">${escHtml(msg.m)}</div>
    </div>`;
  }).join('');
  el.scrollTop = el.scrollHeight;
}

// ── Toast ─────────────────────────────────────────────────────────────────

let toastTimer;
function toast(text) {
  const el = document.getElementById('toast');
  el.textContent = text;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 3500);
}

// ── Copy ──────────────────────────────────────────────────────────────────

async function copyText(text, notify = true) {
  try {
    await navigator.clipboard.writeText(text);
    if (notify) toast('Copied!');
  } catch (_) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    if (notify) toast('Copied!');
  }
}

// ── Utilities ─────────────────────────────────────────────────────────────

function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function fmtTime(ts) {
  const d = new Date(ts);
  return d.getHours().toString().padStart(2,'0') + ':' + d.getMinutes().toString().padStart(2,'0');
}

// ── Init ──────────────────────────────────────────────────────────────────

async function init() {
  myId = getMyId();
  document.getElementById('my-id-label').textContent = myId;

  const params        = new URLSearchParams(location.hash.slice(1));
  const offerEncoded  = params.get('offer');

  history.replaceState(null, '', location.pathname);

  // Wire buttons
  document.getElementById('new-chat-btn').addEventListener('click', () => location.href = 'chat.html');
  document.getElementById('copy-offer').addEventListener('click', () => copyText(document.getElementById('offer-url').value));
  document.getElementById('qr-toggle').addEventListener('click', function () {
    const wrap = document.getElementById('offer-qr-wrap');
    const nowHidden = wrap.classList.toggle('hidden');
    this.setAttribute('aria-expanded', nowHidden ? 'false' : 'true');
    this.textContent = nowHidden ? 'QR' : 'Hide QR';
  });
  document.getElementById('copy-passphrase').addEventListener('click', () => copyText(document.getElementById('passphrase-display').textContent));
  document.getElementById('copy-answer').addEventListener('click', () => copyText(document.getElementById('answer-url').value));
  document.getElementById('connect-btn').addEventListener('click', completeConnection);
  document.getElementById('answer-paste').addEventListener('keydown', e => { if (e.key === 'Enter') completeConnection(); });
  document.getElementById('unlock-btn').addEventListener('click', unlockOffer);
  document.getElementById('passphrase-input').addEventListener('keydown', e => { if (e.key === 'Enter') unlockOffer(); });
  document.getElementById('send-btn').addEventListener('click', sendMessage);
  document.getElementById('msg-input').addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); return; }
    sendTyping();
  });

  if (offerEncoded) {
    promptPassphrase(offerEncoded);  // User B
  } else {
    await initOffer();               // User A
  }
}

init();
