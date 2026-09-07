# Btwinus

Btwinus is an anonymous, end-to-end encrypted, peer-to-peer chat that runs entirely in the browser and starts from a shareable link. There is no account, no app to install, and no server in the message path: the WebRTC handshake travels inside the link itself (encrypted, in the URL fragment), and once two browsers are connected, messages go directly between them over a WebRTC data channel. The whole product is static HTML, CSS, and vanilla JavaScript served from GitHub Pages. Try it at [https://btwinus.com](https://btwinus.com).

## How it works

1. **Start a chat.** Open [btwinus.com/chat.html](https://btwinus.com/chat.html). You immediately get two things: an encrypted invite link and a passphrase (for example `storm-fox-river-4821`).
2. **Share them separately.** Send the link through one channel (WhatsApp, email, any messenger). Send the passphrase through a different channel (a phone call, SMS, in person). Keeping them apart means one compromised channel is not enough to read the handshake.
3. **The other person opens the link and replies.** They enter the passphrase, which decrypts your WebRTC offer. Their browser produces an encrypted reply link, which is copied to their clipboard for them to send back to you.
4. **Connect.** You paste their reply link. Both browsers establish a direct peer-to-peer connection and the chat opens. A short verification code is shown on both sides so you can compare it out loud.

## Security model

This section describes what `js/app.js` actually does, not what we would like it to do.

**Key derivation.** The passphrase is run through `PBKDF2-SHA256` with 100,000 iterations and a random 16-byte salt to derive a 256-bit `AES-GCM` key (`deriveKey`, `js/app.js`). Everything uses the browser's Web Crypto API; there is no crypto library.

**Signaling payload.** The WebRTC session description (SDP) is serialized to JSON, compressed with `deflate-raw` via `CompressionStream` where available, then encrypted with `AES-256-GCM` using a random 12-byte IV. The output is packed as `salt(16) | iv(12) | ciphertext+tag`, base64url-encoded, and placed in the URL fragment: `#offer=...` for the invite and `#answer=...` for the reply. Browsers never send the fragment to the web server, so the encrypted SDP never reaches GitHub Pages. An optional `&exp=<timestamp>` in the invite lets the recipient's browser refuse expired links (this is a client-side check only).

**Passphrase out of band.** The passphrase is never put in the link. It is generated in the browser and shown to the person who started the chat; how it reaches the other person is up to them. The intended use is a second, independent channel.

**Wrong passphrase detection.** AES-GCM is authenticated. Decrypting with the wrong key fails the authentication tag check and throws, which the UI reports as a wrong passphrase. The same check catches a tampered link.

**Transport.** After the handshake, messages travel over an `RTCDataChannel` on an `RTCPeerConnection`. WebRTC data channels are always encrypted with DTLS by the browser; Btwinus does not implement its own message-layer encryption on top of that. The DTLS certificate fingerprints are part of the SDP, so they are protected by the AES-GCM step during signaling.

**Session verification.** Once the data channel opens, each side generates an 8-byte random nonce and sends it to the other. Both sides compute `SHA-256(sorted(fp_local, fp_remote) + sorted(nonce1 + nonce2))`, where `fp_*` are the DTLS certificate fingerprints taken from the local and remote SDP, and display the first 6 bytes as a short authentication string (SAS). Because a relaying man-in-the-middle terminates DTLS on each side with its own certificate, the two users would see different codes. Users are meant to compare it verbally.

**ICE configuration.** `ICE_SERVERS` is a single STUN server, `stun:stun.l.google.com:19302`. There is no TURN server, so nothing relays traffic; it also means the connection fails on networks where a direct path cannot be found (some symmetric NATs, restrictive corporate networks).

**Local persistence.** The passphrase is kept in `sessionStorage` only until the data channel opens, then removed. Messages of the current session are mirrored to `sessionStorage` (key `btw_msgs`) so that a reload of the same tab can show a read-only view of the conversation; `sessionStorage` is discarded by the browser when the tab closes, and the copy is also cleared when a new chat starts.

**Analytics.** The landing pages and `chat.html` load Google Analytics with Consent Mode v2. `analytics_storage` defaults to `denied` and is only granted if the visitor accepts the cookie banner. Blog pages have no analytics. No part of the app sends message content, links, or passphrases anywhere; the only network traffic from the chat page other than fetching static files is the STUN request and the peer connection itself.

### What it does not protect against

- **Anyone who obtains both the link and the passphrase.** They can decrypt the offer and connect as the other party, or read the handshake. The two-channel split reduces this risk; it does not eliminate it.
- **Offline guessing of the passphrase from the link alone.** The generated passphrase is four words from the 1,295-word EFF short list plus a four-digit number, about 2^54 combinations, chosen with `crypto.getRandomValues`. PBKDF2 with 100,000 iterations makes each guess cost about a tenth of a second on a CPU, so exhausting the space is not practical, but a user who types their own short passphrase instead of using the generated one loses that protection. Treat the link as sensitive and use short expiry anyway.
- **A man-in-the-middle when nobody compares the SAS.** The SAS is bound to both DTLS fingerprints, so a relaying attacker produces mismatching codes, but only if the two users actually read the code to each other over a channel the attacker does not control. The app cannot force that step.
- **IP address exposure.** WebRTC ICE candidates contain the IP addresses of both peers. Your peer sees your IP, and Google's STUN server sees the public IP of anyone who starts or answers a chat. Btwinus does not hide network-level metadata; it is not a Tor-style anonymity tool.
- **Both users must be online at the same time.** There is no server to hold messages, so there is no offline delivery.
- **A compromised device or browser.** Malware, a malicious extension, or someone reading over your shoulder sees plaintext. Nothing in the app can help with that.
- **Trusting the host on every load.** The JavaScript is fetched from GitHub Pages each time (network-first service worker). Whoever controls the hosting or the DNS for btwinus.com, or a CDN in between, could serve modified code. There is no code signing, no subresource integrity, and no reproducible build. You can clone this repository and run it yourself to remove that dependency.
- **No forward secrecy across sessions is claimed and none is needed in the usual sense** because each session has a fresh passphrase, fresh salt, and fresh DTLS keys. But within a session, a recorded handshake plus a later-recovered passphrase reveals the SDP (not the messages, which are protected by DTLS keys that are not derivable from the passphrase).
- **No independent security audit.** The code is short and public; review is welcome.

## Run locally

There is no build step. Serve the repository root with any static file server and open `chat.html`:

```
git clone https://github.com/BTwinus/btwinus.git
cd btwinus
python3 -m http.server 8000
# open http://localhost:8000/chat.html
```

Web Crypto and WebRTC require a secure context. `localhost` counts as secure; if you serve from another hostname you will need HTTPS.

## Project layout

```
index.html        English landing page
fr/ ln/           French and Lingala landing pages (full static translations)
chat.html         The app (English only)
js/app.js         Handshake, crypto, WebRTC, chat UI
js/i18n.js        Translations and language routing
js/qr.js          Vendored QR code library (loaded on demand)
js/*.js           Theme toggle, homepage interactions, demo, consent banner
css/              Stylesheets
blog/             A few articles
privacy/          Privacy policy (en/fr/ln)
sw.js             Service worker: network-first for HTML/CSS/JS, cache-first for the rest
manifest.json     PWA manifest
sitemap.xml       Sitemap with hreflang annotations
llms.txt          Plain-text summary for crawlers
server/           Empty. There is no backend.
```

## Languages

The landing pages exist in English (`/`), French (`/fr/`), and Lingala (`/ln/`), each at its own URL with hreflang alternates. Lingala is there because Btwinus is built with expensive-data markets in mind, in particular the DRC and the Republic of Congo. The chat page itself is English only for now. All strings live in `js/i18n.js`; keep the three languages' keys in sync.

## Contributing

- Vanilla HTML, CSS, and JavaScript only. No frameworks, no bundler, no transpiler, no package manager, and no new dependencies without discussion.
- No build step: edit a file, commit, and GitHub Pages serves it.
- Every CSS and JS reference carries a `?v=N` cache-busting query. When you change a file that is referenced that way, bump the number in every HTML file that references it. If you change `sw.js` or what it precaches, bump its `CACHE` constant as well.
- Keep the product invariant: no server in the message path, no accounts, nothing that phones home. Features that need a backend are out of scope.
- Keep payload size small. Part of the audience is on slow and expensive connections.
- Security findings are especially welcome. Open an issue describing the problem and, if you can, a pull request against `js/app.js`.

## License

License: see LICENSE (not yet added)
