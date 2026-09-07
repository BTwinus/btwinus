# Outreach copy

Ready-to-post copy for each channel. Everything below is written to be accurate against the code in `js/app.js` as of September 2026. If the code changes (bigger word list, SAS bound to DTLS fingerprints, TURN added), update the limitation paragraphs before posting.

## Posting order and timing

Do these in order and leave gaps so each one gets its own traffic spike and its own set of inbound links:

1. **README first** (day 0). Every other post links to the repo; it must already describe the crypto and the limitations, or people will write the limitations for you.
2. **dev.to article** (day 1-2). It is evergreen, ranks on its own, and gives Show HN and Reddit something technical to link to besides the site.
3. **Show HN** (day 3, Tuesday to Thursday, 07:00-09:00 US Eastern). Highest-value spike; the aggregator scrapers pick up HN links within a day. Be at the keyboard for six hours to answer comments.
4. **r/webdev** (day 5) and **r/privacy** (day 8). Do not post to both the same day; the audiences overlap and cross-posting looks like spam.
5. **Privacy Guides forum** (day 10-12). Fix whatever HN and Reddit flagged first. They read the code.
6. **Product Hunt** (day 14-16, launch at 00:01 Pacific on a Tuesday or Wednesday). Needs the screenshots ready and a few people who will comment in the first hour.
7. **AlternativeTo, directory listings, awesome-list PRs** (week 3 onwards, one or two per day). These are slow-burn links; they do not need a spike, they need to exist.

Reply to every comment on every channel within a few hours on launch day. The replies, not the post, are what make these communities accept you.

---

## 1. Show HN

**Platform fields:** Title, URL, Text (leave Text empty when you give a URL; post the explanation as the first comment).

**Title (74 characters):**

```
Show HN: Btwinus – E2E-encrypted P2P chat in a link, no server, no account
```

**URL:** `https://btwinus.com`

**First comment (post immediately after submitting):**

```
Author here. Btwinus is a two-person chat that runs entirely in the browser. The WebRTC signaling never touches a server: the SDP offer is JSON-serialized, compressed with deflate-raw, encrypted with AES-256-GCM under a key derived from a short passphrase (PBKDF2-SHA256, 100k iterations, 16-byte salt, 12-byte IV), base64url-encoded and put in the URL fragment. The fragment is never sent to the host, so the invite link is the signaling channel. The recipient enters the passphrase, their browser builds the answer the same way, and they send that link back. Once the RTCDataChannel opens, messages go browser to browser over DTLS. The host is GitHub Pages serving static files; there is no backend directory with anything in it.

The property I care about is the two-channel split: the link goes over one channel, the passphrase over another. Neither alone is enough.

Things I want scrutiny on, because I know they are weak:

- The passphrase is 3 words from a 30-word list plus a 4-digit number, about 28 bits. With the link in hand, offline guessing is feasible in hours on a GPU despite PBKDF2. A larger word list is the obvious fix.
- The session verification code is SHA-256 over two nonces exchanged on the data channel, not over the DTLS fingerprints. A MITM who relays both directions passes the nonces through unchanged, so the code does not catch that case. It should be bound to the fingerprints from the SDP.
- Single Google STUN server, no TURN. Peers see each other's IPs, Google sees your public IP, and symmetric NATs fail to connect.
- You trust the host on every page load. No SRI, no signing. Clone it and serve it yourself if that matters to you.
- Messages of the current session are mirrored to localStorage for 24h so a refresh shows a read-only view. Clear site data if you need nothing left on the device.
- No audit.

Code is 700 lines of vanilla JS: https://github.com/BTwinus/btwinus (js/app.js). Site: https://btwinus.com. Write-up on the fragment trick: [dev.to link]. Happy to answer anything.
```

Word count: about 330. Attach nothing; HN has no attachments.

---

## 2. Product Hunt

**Fields:** Name, Tagline (60 max), Description (260 max), Topics, Links (website, GitHub), Gallery (images), Maker comment.

**Name:** `Btwinus Chat`

**Tagline (57 characters):**

```
Private P2P chat from a link. No app, account, or server.
```

**Description (256 characters):**

```
Start an end-to-end encrypted chat in seconds: open the page, share the link one way and the passphrase another, and talk browser to browser over WebRTC. No sign-up, no install, no server in the message path, no history. Free and open source.
```

**Links:** Website `https://btwinus.com`, Source `https://github.com/BTwinus/btwinus`

**Topics:** Privacy, Messaging, Open Source, Web App, Developer Tools

**Gallery (three screenshots, 1270x760 or 16:10):**

1. Light theme, desktop: the "Waiting for reply" screen showing the invite link box, the passphrase display, the expiry selector and the QR toggle. Caption: "One click gives you a link and a passphrase. Share them on different channels."
2. Dark theme, desktop: an active conversation with the verification code visible in the header and the typing indicator showing. Caption: "Direct browser-to-browser over WebRTC. Compare the code to confirm the session."
3. Mobile, either theme: the recipient's passphrase entry screen with the wrong-passphrase error visible. Caption: "Wrong passphrase, no chat. AES-GCM authentication fails closed."

**Maker comment (about 210 words):**

```
Hi Product Hunt, I built Btwinus because I wanted a way to have a quick private conversation with one person without asking them to install anything or create an account.

How it works: you open the page and immediately get an invite link and a passphrase. You send the link through one app (WhatsApp, email, whatever) and tell the passphrase through another (a call, a text, in person). The other person opens the link, types the passphrase, and sends back a reply link. That is the whole setup. The WebRTC handshake is encrypted inside the links themselves, so no server ever handles it; after that, messages travel directly between the two browsers.

What it is not: it is not an anonymity network, so your peer can see your IP address. Both people need to be online at the same time. The code is served from GitHub Pages, so you are trusting that host each time you load the page, unless you run it yourself from the repo. And it has not been audited; the code is about 700 lines and public, and I would rather have people read it than take my word for it.

It also comes in French and Lingala, because a lot of the people I built it for are on expensive mobile data in Central Africa and the page is deliberately small.

Would love feedback, especially from anyone who tries it on a restrictive network.
```

---

## 3. AlternativeTo

**Fields:** Name, Short description (300 max), Long description, Website, Source code URL, License, Platforms, Tags, "Alternative to" list, Screenshots.

**Name:** Btwinus

**Short description (275 characters):**

```
Anonymous, end-to-end encrypted two-person chat that runs in the browser and starts from a shareable link. The WebRTC handshake is encrypted inside the link; messages then go directly between browsers. No account, no app, no server in the message path. Open source.
```

**Long description:**

```
Btwinus lets two people open a private chat without installing anything or signing up. Opening the page produces an invite link and a passphrase. The link contains the WebRTC session offer, compressed and encrypted with AES-256-GCM under a key derived from the passphrase (PBKDF2-SHA256, 100,000 iterations); it lives in the URL fragment, which browsers never send to the host. The recipient enters the passphrase, gets a reply link, and sends it back. From then on, messages travel directly between the two browsers over a WebRTC data channel (DTLS encrypted). Both sides see a short verification code they can compare out loud.

There is no backend. The site is static files on GitHub Pages. Nothing is stored server-side because there is no server to store it; the only outside party in the connection is a STUN server used to discover public IP addresses.

Limitations, stated plainly: both people must be online at the same time; peers see each other's IP addresses; the generated passphrase is short and should be treated as a session secret, not a password; the code is loaded from the web host on each visit; there has been no independent audit. The current session's messages are kept in the browser's local storage for up to 24 hours so that a refresh shows a read-only copy, and are cleared when a new chat starts.

Available in English, French and Lingala. Vanilla HTML, CSS and JavaScript, around 700 lines for the app.
```

**Website:** `https://btwinus.com`
**Source code:** `https://github.com/BTwinus/btwinus`
**License:** Open Source (add the exact license once LICENSE is committed; until then leave the field as "Open Source" and mention in the description that the license file is pending)
**Platforms:** Web (Online), Progressive Web App, Chrome, Firefox, Safari, Edge (any modern browser, desktop and mobile)

**Alternative to (add each one; use the "why it is an alternative" box):**

- **Signal** - same goal of end-to-end encrypted chat, but no phone number, no account, no install; one-off conversations rather than an ongoing messenger.
- **Privnote** - both are link-based and leave nothing behind, but Btwinus is a live two-way conversation, not a one-time note, and has no server storing the ciphertext.
- **OneTimeSecret** - same "share a secret out of band" model; Btwinus applies it to a live chat session rather than a single stored secret.
- **ChatCrypt** - browser-based encrypted chat rooms with a shared password; Btwinus has no relay server and no room concept, it is strictly two peers connected directly.
- **otr.to** - anonymous browser-to-browser chat over WebRTC; Btwinus adds a passphrase-encrypted handshake so the invite link alone is not enough to join, and needs no signaling server.
- **Telegram** - Telegram's regular chats are not end-to-end encrypted and require a phone number; Btwinus is always end-to-end encrypted and needs neither.

**Tags:** encrypted-chat, end-to-end-encryption, webrtc, peer-to-peer, anonymous, privacy, no-registration, browser-based, open-source, ephemeral

**Screenshots:** reuse the three Product Hunt images.

---

## 4. Privacy Guides forum, "Tool Suggestions"

**Fields:** Title, Category (Tool Suggestions), Body. They expect a threat-model writeup, a source link, and a disclosure that you are the author. Add the tag `messaging`.

**Title:**

```
Btwinus: browser-only E2EE two-person chat with the WebRTC handshake encrypted inside the invite link (author post, limitations included)
```

**Body (about 440 words):**

```
Disclosure: author here.

What it is
A static web page (https://btwinus.com, source https://github.com/BTwinus/btwinus) that opens a two-person chat. The WebRTC offer is compressed, encrypted with AES-256-GCM under a PBKDF2-SHA256 key (100k iterations, 16-byte salt, 12-byte IV) derived from a generated passphrase, and placed in the URL fragment. The recipient enters the passphrase, gets a reply link built the same way, and sends it back. Messages then flow over an RTCDataChannel (DTLS). Host is GitHub Pages; there is no backend. The intended use is that the link and the passphrase travel over different channels.

Threat model
Protects against: a party who sees only the link (they get ciphertext); a party who hears only the passphrase; the web host reading handshake or messages (the fragment is never sent to it and messages never pass through it); passive observers of the peer connection (DTLS); tampered links (GCM tag check fails).

Does not protect against, and I want to be upfront:
- WebRTC IP exposure. ICE candidates put both peers' IPs in the SDP. Your peer sees your IP, and the single STUN server (stun.l.google.com) sees your public IP. This is not an anonymity tool; use it behind a VPN if that matters.
- Offline passphrase guessing from the link. The passphrase is 3 words from a 30-word list plus a 4-digit number, about 28 bits. PBKDF2 slows a GPU to the order of hours, not years. Enlarging the list is the planned fix; until then the link must be treated as sensitive.
- The SAS as implemented hashes two nonces sent over the data channel, not the DTLS fingerprints, so a relaying MITM who already has the passphrase is not detected by it. I intend to bind it to the fingerprints.
- No forward secrecy claims beyond fresh keys per session. A later-recovered passphrase reveals the recorded SDP, not the DTLS-protected messages.
- Trusting the host on every load. The JS comes from GitHub Pages; no SRI, no signing, no reproducible build. Self-hosting from the repo removes that.
- Messages of the current session are mirrored to localStorage for 24h for a read-only reload view; clear site data if that is a problem.
- No audit. The app is one 700-line file.

Why it is different from current entries
Signal, SimpleX and Briar are messengers with clients. Btwinus is a disposable session with no install and no identity, closer to a one-time note than to a messenger, and the signaling channel is the link itself rather than a server. It is not a replacement for any of them; it is a "no install, no account, no server" option for one-off conversations, with the caveats above.

Happy to have the crypto picked apart.
```

Attach nothing. If they ask for a version history, link the GitHub commit log.

---

## 5. Reddit

Both subreddits require disclosure and tend to remove posts that read as marketing. Comment on other threads for a few days first so the account is not brand new to the sub. Flair r/webdev as "Showoff Saturday" and post on a Saturday; r/privacy allows self-promotion when it is clearly labeled and the tool is open source.

### r/webdev

**Title:**

```
I built a two-person E2E encrypted chat where the WebRTC handshake lives inside the invite link (no signaling server, vanilla JS, 700 lines)
```

**Body:**

```
Author here. Wanted to see how far I could get with WebRTC and zero backend.

The trick: instead of a signaling server, the SDP offer is JSON.stringify'd, compressed with CompressionStream('deflate-raw'), encrypted with Web Crypto AES-256-GCM (key from PBKDF2-SHA256, 100k iterations, 16-byte salt, 12-byte IV), base64url'd and stuffed into the URL fragment. Fragments are never sent to the server, so GitHub Pages hosts the static files and never sees the handshake. The recipient enters a passphrase, their browser builds the answer the same way, and the answer link goes back through whatever messenger you like. After the RTCDataChannel opens, everything is browser to browser.

Things I learned:
- Compressed SDP comes out around 600-900 characters after base64; without deflate-raw it was too long to paste comfortably.
- AES-GCM's auth tag doubles as the "wrong passphrase" check. Decrypt throws, show an error.
- Wait for iceGatheringState === 'complete' (with a timeout) before serializing localDescription, or the offer has no candidates. No trickle ICE when your signaling channel is a link.
- No TURN means symmetric NAT users cannot connect. I accepted that to keep "no server" literally true.
- Lazy-load the QR library on first tap; it is 55 KB and most people never tap.

Known weaknesses I would rather list than have you find: the generated passphrase is only ~28 bits (short word list, fixing it), the session verification code hashes nonces rather than DTLS fingerprints (also fixing), and peers see each other's IPs.

No framework, no build step, no dependencies except a vendored QR generator. Repo: https://github.com/BTwinus/btwinus (js/app.js is the whole app). Live: https://btwinus.com. Longer write-up: [dev.to link].
```

### r/privacy

**Title:**

```
[Open source, author] Btwinus: encrypted P2P chat where the link and the passphrase travel on separate channels, no account, no server
```

**Body:**

```
Author disclosure up front. I made this and I am posting to get it torn apart, not to sell anything; it is free and there is nothing to sell.

The idea: a two-person chat where the WebRTC handshake is encrypted inside the invite link (AES-256-GCM, key from PBKDF2-SHA256 with 100k iterations, all in the browser via Web Crypto), and the passphrase to unlock it is shown to the sender to pass along some other way. Link over WhatsApp, passphrase over a phone call, or link by email, passphrase by SMS. Whoever intercepts one channel gets nothing useful; they need both. After the handshake, messages go browser to browser over a WebRTC data channel. The host (GitHub Pages) serves static files and never sees the handshake, because the encrypted payload is in the URL fragment, which browsers do not send to servers.

What it does not do, so nobody has to dig:
- It is not anonymity software. WebRTC exposes your IP to your peer and to the STUN server (a Google one, the only external party). Use a VPN if that matters to you.
- The passphrase is short (three words from a small list plus four digits). Someone with the link can brute-force it offline in hours. That is the biggest weakness right now and the word list is getting enlarged.
- The verification code shown to both sides is not yet bound to the DTLS fingerprints, so it does not detect a relaying MITM. Planned fix.
- You are trusting the host each time you load the page. Self-host from the repo if you need to remove that.
- Current session messages sit in localStorage for 24 hours for a reload view. Clear site data if that bothers you.
- Analytics on the page is consent-gated and off by default; it never sees links or messages.
- No audit.

The whole app is one file, js/app.js, about 700 lines. Repo: https://github.com/BTwinus/btwinus. Site: https://btwinus.com. If you find something, an issue on the repo is the fastest way to reach me.
```

---

## 6. dev.to article

**Fields:** Title, Tags (max 4), Cover image (optional; use og.png), Canonical URL (leave blank or set to a blog post on btwinus.com if you mirror it), Body (Markdown).

**Title:**

```
How I put a WebRTC handshake inside a URL fragment
```

**Tags:** `webrtc`, `javascript`, `security`, `webdev`

**Body:**

```markdown
WebRTC lets two browsers talk directly, but getting them connected requires exchanging a session description (SDP) first, and almost every tutorial hands that job to a signaling server. I wanted a two-person chat with no server at all, so I put the handshake in the link. This post walks through how [Btwinus](https://btwinus.com) does it, with the actual code from `js/app.js`, and ends with the things that are still weak.

## Why the fragment

A URL has a part the browser never sends to the server: everything after `#`. If you open `https://example.com/chat.html#offer=abc`, the request that reaches the host is for `/chat.html`; `offer=abc` stays in the browser. That makes the fragment a data channel that the web host cannot read, which is exactly what you want when the host is a static file server like GitHub Pages and the data is a WebRTC offer containing your IP addresses.

The offer still needs to be protected from whoever carries the link (a messaging app, an email provider, a friend who forwards it). So the plan is: serialize the SDP, compress it, encrypt it under a passphrase, encode it, put it in the fragment. The passphrase goes to the other person over some other channel.

## Step 1: build the offer and wait for ICE

With a signaling server you can trickle ICE candidates as they arrive. With a link you get exactly one shot, so the offer must contain all candidates before it is serialized:

```js
const ICE_SERVERS = [{ urls: 'stun:stun.l.google.com:19302' }];

pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
setupChannel(pc.createDataChannel('chat'));
await pc.setLocalDescription(await pc.createOffer());
await waitForICE(pc);
```

`waitForICE` resolves when gathering completes or after six seconds, whichever comes first, because some networks never report `complete`:

```js
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
```

There is one STUN server and no TURN. That is a deliberate trade: TURN is a relay, and a relay is a server. The cost is that peers behind symmetric NATs will not connect.

## Step 2: compress

A full SDP with candidates is a couple of kilobytes of very repetitive text. Base64 would inflate it further, and a 3 KB link is unpleasant to paste and impossible to fit in a QR code at a scannable size. `CompressionStream` with `deflate-raw` cuts it by roughly two thirds:

```js
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
```

If the browser lacks `CompressionStream`, the raw bytes are used; `decompress` on the other side tries `DecompressionStream` and falls back to decoding the bytes as-is. `deflate-raw` rather than `gzip` because there is no need for headers or a checksum: the next step provides integrity.

## Step 3: encrypt with a passphrase

The passphrase is generated in the browser and shown to the user. It is fed to PBKDF2 to derive an AES-GCM key:

```js
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
```

Encryption uses a fresh random salt and IV each time and packs everything into one buffer:

```js
async function encryptText(text, passphrase) {
  const salt      = crypto.getRandomValues(new Uint8Array(16));
  const iv        = crypto.getRandomValues(new Uint8Array(12));
  const key       = await deriveKey(passphrase, salt);
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv }, key, new TextEncoder().encode(text)
  );
  const out = new Uint8Array(16 + 12 + encrypted.byteLength);
  out.set(salt, 0);
  out.set(iv, 16);
  out.set(new Uint8Array(encrypted), 28);
  return toB64(out);
}
```

The layout is `salt(16) | iv(12) | ciphertext + GCM tag`. The receiver slices the same offsets back out. `toB64` is standard base64 with `+/` swapped for `-_` and padding removed, so the result is safe in a URL without percent-encoding.

## Step 4: build the link

```js
const compressed = await compress(JSON.stringify(pc.localDescription));
offerEncrypted   = await encryptText(compressed, passphrase);
let url = location.origin + location.pathname + '#offer=' + offerEncrypted;
if (exp) url += '&exp=' + exp;
```

The optional `exp` is a timestamp; the recipient's browser refuses the link after it. It is a client-side courtesy, not a security control, since anyone can strip it.

## Step 5: the other side

On load, the app parses the fragment, then immediately erases it from the address bar with `history.replaceState` so it does not linger in history or get shared by accident:

```js
const params       = new URLSearchParams(location.hash.slice(1));
const offerEncoded = params.get('offer');
history.replaceState(null, '', location.pathname);
```

The recipient types the passphrase. Decryption either succeeds or throws:

```js
try {
  const compressed = await decryptText(pendingOfferEncrypted, passphrase);
  await buildAnswer(compressed);
} catch (_) {
  // AES-GCM auth tag failure = wrong passphrase
  showState('passphrase');
  errEl.classList.remove('hidden');
}
```

This is the part I like most. GCM is authenticated encryption, so a wrong key does not produce garbage, it produces an exception. The "wrong passphrase" error and the "tampered link" error are the same check, and there is no separate MAC to get wrong.

`buildAnswer` mirrors the offer side: set the remote description, create the answer, wait for ICE, compress, encrypt under the same passphrase, and produce `#answer=...`. That link is auto-copied so the recipient can paste it back to the sender in whatever app they are already using. The sender pastes it, decrypts, calls `setRemoteDescription`, and the data channel's `open` event fires.

## After the handshake

Once the channel is open, the passphrase is removed from `sessionStorage`; it has done its job. Messages are JSON over the `RTCDataChannel`, which the browser encrypts with DTLS. The app adds no message-layer encryption on top; the point of the passphrase step was to protect the signaling, and DTLS keys come from certificates whose fingerprints were inside that protected SDP.

Both sides then exchange a random 8-byte nonce and display the first 6 bytes of `SHA-256(sorted(n1 + n2))` as a code to compare aloud.

## What is still weak

I would rather list these than have someone find them:

- **The passphrase is small.** Three words from a 30-word list plus a four-digit number is about 2^28 possibilities. PBKDF2 at 100k iterations makes each guess cost something, but a GPU with the link in hand gets through that in hours. The word list needs to be a few thousand entries, and the word selection currently uses `Math.random` rather than `crypto.getRandomValues`.
- **The verification code is not bound to DTLS.** It hashes nonces that travel over the channel itself. An attacker who had the passphrase and inserted themselves as a relay would forward the nonces and both sides would see the same code. Hashing the DTLS fingerprints from both SDPs instead is the correct construction, and it is next on the list.
- **IPs are in the SDP.** Your peer learns your IP, and the STUN server learns your public one. This is inherent to WebRTC without a relay.
- **You trust the host per load.** The JS comes from GitHub Pages, network-first. No subresource integrity, no signing. Cloning the repo and serving it locally removes that dependency; `python3 -m http.server` is enough.
- **No audit.** The app is about 700 lines in one file, which is short enough to read in an evening.

The code is at [github.com/BTwinus/btwinus](https://github.com/BTwinus/btwinus) (`js/app.js`) and the live version at [btwinus.com](https://btwinus.com). If you spot something in the crypto or the handshake, please open an issue.
```

Word count: about 1,450 in the body. Attach `og.png` as the cover image.

---

## 7. GitHub awesome lists worth a PR

Verified in September 2026. Each list's rules differ; read `CONTRIBUTING.md` in the repo before opening the PR, declare that you are the author in the PR body, one addition per PR, and add the entry at the end of its section unless the list is alphabetical.

**Lissy93/awesome-privacy** (https://github.com/Lissy93/awesome-privacy, actively maintained, also renders at awesome-privacy.xyz)
- Section: Communication > P2P Messaging (or Encrypted Messaging).
- Rules that matter: open source required, project must be older than 4 months with a stable release (first commit 2026-04-29, so wait until at least early September 2026 and commit a LICENSE first), description 50-250 characters, edit only `awesome-privacy.yml`, PR title `Add Btwinus in P2P Messaging`, tick the conflict-of-interest box.
- YAML entry:
  ```yaml
  - name: Btwinus
    description: Browser-only two-person chat with no account, app or server. The WebRTC handshake is AES-GCM encrypted inside the invite link; messages go peer to peer.
    url: https://btwinus.com
    github: BTwinus/btwinus
    icon: https://btwinus.com/android-icon-192x192.png
  ```

**pluja/awesome-privacy** (https://github.com/pluja/awesome-privacy, actively maintained)
- Section: Instant Messaging (near Briar and other P2P entries).
- Markdown entry (add the license once the LICENSE file exists):
  ```
  - [Btwinus](https://btwinus.com) - Browser-based end-to-end encrypted two-person chat over WebRTC. No account, no install, no server; the handshake travels encrypted inside the invite link. [Source](https://github.com/BTwinus/btwinus)
  ```

**emircem/awesome-webrtc** (https://github.com/emircem/awesome-webrtc; has an Applications > Chat subsection; low commit activity, so the PR may sit)
- Entry:
  ```
  - [Btwinus](https://btwinus.com) - Serverless two-person chat; the SDP offer/answer is compressed, AES-GCM encrypted and exchanged via URL fragments instead of a signaling server. [Source](https://github.com/BTwinus/btwinus)
  ```

**anondotli/awesome-privacy-tools** (https://github.com/anondotli/awesome-privacy-tools; has an encrypted messaging section and explicit contribution guidelines requiring conflict-of-interest disclosure)
- Entry, matching their `Name - description` style:
  ```
  - [Btwinus](https://btwinus.com) - Open-source encrypted P2P chat that runs in the browser from a shareable link. No account, no server; passphrase shared out of band unlocks the WebRTC handshake.
  ```

**status-im/awesome-secure-messaging** (https://github.com/status-im/awesome-secure-messaging; a links collection rather than an app directory, so submit the dev.to article as a resource rather than the app)
- Entry:
  ```
  - [How I put a WebRTC handshake inside a URL fragment](DEVTO_URL) - Serverless signaling by encrypting the SDP into the link; discusses passphrase entropy and SAS binding.
  ```

Skip: `awesome-selfhosted` (nothing to host), `mhatta/awesome-secure-instant-messaging` (three commits total, effectively dormant), `sobolevn/awesome-cryptography` (libraries and papers, not apps).

---

## 8. Directory submissions

Reuse the Product Hunt screenshots everywhere. Use the same one-line description so the listings reinforce each other in search.

### SaaSHub (saashub.com/submit)
- **Name:** Btwinus
- **URL:** https://btwinus.com
- **Tagline:** Encrypted P2P chat from a link. No app, no account, no server.
- **Description:** Open-source two-person chat that runs in the browser. Share the invite link on one channel and the passphrase on another; the WebRTC handshake is AES-256-GCM encrypted inside the link, and messages then travel directly between browsers. Nothing is stored server-side because there is no server. English, French and Lingala.
- **Categories:** Messaging, Privacy, Encryption, Open Source
- **Pricing:** Free
- **Alternatives to list:** Signal, Privnote, OneTimeSecret, otr.to, ChatCrypt
- **Attach:** logo (android-icon-192x192.png), 3 screenshots

### Slant (slant.co, add as an option to existing questions)
- **Questions to add Btwinus to:** "What are the best anonymous chat apps?", "What are the best encrypted messaging apps?", "What are the best ways to send a private message without an account?"
- **Option name:** Btwinus
- **Pros (one per line, each needs a short explanation):**
  - No account or install: opens from a link in any modern browser.
  - No server in the message path: WebRTC handshake is encrypted inside the link, messages go browser to browser.
  - Two-channel setup: link and passphrase travel separately, so one intercepted channel is not enough.
  - Open source and small: about 700 lines of vanilla JavaScript.
- **Cons (Slant expects them; adding your own makes the entry credible):**
  - Both people must be online at the same time; no offline delivery.
  - Peers see each other's IP addresses (standard WebRTC).
  - No TURN relay, so some restrictive networks cannot connect.
  - Not independently audited.
- **Attach:** logo, one screenshot

### Uneed (uneed.best/submit-a-tool)
- **Tool name:** Btwinus
- **Website:** https://btwinus.com
- **Tagline (short):** Private P2P chat from a link. No app, account, or server.
- **Description:** Btwinus opens an end-to-end encrypted two-person chat straight from a link. The WebRTC handshake is encrypted inside the invite link itself, the passphrase goes out of band, and messages then travel directly between the two browsers. No sign-up, no install, no server, no history. Free and open source.
- **Category:** Communication / Privacy
- **Pricing:** Free
- **Launch date:** pick a day after the Product Hunt launch
- **Attach:** logo, 3 screenshots, optional short screen recording of the handshake

### Peerlist (peerlist.io, Launchpad)
- **Project name:** Btwinus
- **Tagline:** Encrypted P2P chat where the handshake lives in the link.
- **Description:** I built a two-person chat that needs no account, no app and no server. The WebRTC offer is compressed, AES-256-GCM encrypted under a passphrase and placed in the URL fragment; the recipient unlocks it, sends back a reply link, and the browsers connect directly. Vanilla JS, about 700 lines, hosted as static files. Available in English, French and Lingala.
- **Links:** Website https://btwinus.com, GitHub https://github.com/BTwinus/btwinus
- **Tech stack:** JavaScript, WebRTC, Web Crypto API, GitHub Pages
- **Category:** Developer Tools / Privacy
- **Attach:** logo, 3 screenshots

### BetaList (betalist.com/submit)
- **Startup name:** Btwinus
- **Website:** https://btwinus.com
- **Pitch (one line):** Private, encrypted chat between two people from a single link. No account, no app, no server.
- **Description:** Btwinus is a browser-only chat for one-off private conversations. Open the page, send the link one way and the passphrase another, and you are talking directly browser to browser with end-to-end encryption. There is no backend at all: the WebRTC handshake is encrypted inside the link and never touches a server. It is free, open source, and built small enough to work on expensive mobile data, with French and Lingala versions for Central African users.
- **Stage:** Launched (BetaList prefers pre-launch or recently launched; say "recently launched" and mention the open-source repo)
- **Markets:** Privacy, Messaging, Open Source
- **Attach:** logo, one screenshot, cover image (og.png)
