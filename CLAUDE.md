# CLAUDE.md: Btwinus

Hey, future Claude. Read this before you touch anything. It's the stuff you can't derive from the code alone.

## What this is

Btwinus is **anonymous, end-to-end encrypted, browser-only, peer-to-peer chat via a shareable link**. No account, no server, no history. The whole product is one HTML page (the landing) plus one HTML page (the app), with localized variants and a small blog for SEO.

The pitch on the homepage, "no app, no account, no server", is **literally true**, not marketing. There is no backend. The `server/` directory exists but is empty. The encryption happens in the browser, the WebRTC handshake travels through the URL itself, and once two peers are connected, messages go directly browser-to-browser. Preserve that invariant.

Domain: `btwinus.com`. Hosting: GitHub Pages (via `CNAME` file), **proxied by Cloudflare** (`server: cloudflare` on every response). Cloudflare's bot settings sit in front of `robots.txt`: its "Block AI bots" toggle returns 403 to GPTBot/ClaudeBot/PerplexityBot no matter what `robots.txt` says, so keep it off. Verify with `curl -o /dev/null -w '%{http_code}' -A GPTBot https://btwinus.com/` → must be 200. Analytics: Google `gtag.js` (`G-G0XHHXR5YY`) with **Consent Mode v2**: `analytics_storage` defaults to `denied` (inline in each GA page's head, before `config`), flipped to `granted` only by the cookie banner in `js/consent.js`. There are no ads, so `ad_*` consent signals stay permanently denied. Choice persists in `localStorage['btw_consent']` (`granted`/`denied`). GA is only on `/`, `/fr/`, `/ln/`, `/chat.html`: blog pages have no analytics. Bing Webmaster verification meta tag is in all main landing pages.

## How to work on it

There is **no build step**. No bundler, no transpiler, no package.json. You edit a file, you commit, GitHub Pages serves it. That's the whole loop.

- HTML/CSS/JS only, vanilla. No React, no framework, no TypeScript.
- All asset references use `?v=N` cache-busting query strings. **When you change a file referenced like that, bump its version number** or users on the service worker will see stale content. Current versions are scattered in different HTML files; check before bumping.
- The service worker (`sw.js`) has its own `CACHE = 'btwinus-vN'` string. **Bump it when you change what gets precached** or update the navigate fallback.

## Architecture in 60 seconds

```
/                    → English landing (index.html)
/fr/                 → French landing (full static, translated body + meta)
/ln/                 → Lingála landing (full static, translated body + meta)
/chat.html           → The actual app (English only, see "What's NOT translated" below)
/blog/               → SEO content (8 posts + index, English). RSS at /blog/feed.xml
/fr/blog/            → French translations of the 4 original posts + index, hreflang-paired with /blog/
/use/                → Six use-case landing pages + hub, linked from the homepage cards
/docs/outreach.md    → Ready-to-post launch copy (HN, PH, AlternativeTo, Privacy Guides, Reddit, dev.to). Not served.
/css/style.css       → Everything except blog
/css/blog.css        → Blog only
/js/app.js           → The chat app itself (handshake + WebRTC + UI). 713 lines.
/js/i18n.js          → Translations for en/fr/ln + lang router
/js/theme.js         → Dark/light toggle
/js/home.js          → Homepage interactions (new-chat button, join, install banner)
/js/demo.js          → The animated Alice↔Gradi demo on the homepage
/js/matrix.js        → Background canvas effect
/js/qr.js            → QR code generation (vendored library, ~2300 lines, don't touch)
/sw.js               → Service worker (network-first for HTML/CSS/JS, cache-first otherwise)
/manifest.json       → PWA manifest
/sitemap.xml         → Lists en/fr/ln/chat/blog URLs with hreflang annotations
/robots.txt          → Allows everything, points to sitemap
/llms.txt            → AI-crawler-friendly summary of the product
/blog/feed.xml       → RSS feed of the blog. Hand-maintained; add an <item> when you publish a post.
/og.png              → 1200×630 social share image. Rendered from og.svg with headless Chrome; keep og.svg as the source.
/<32 hex>.txt        → IndexNow key file. See \"After deploying\" below.
/404.html            → Real not-found page (noindex). GitHub Pages serves it with a 404 status.
/.well-known/security.txt → Security contact (points at GitHub private vulnerability reporting, which is enabled). Mirrored at /security.txt. Expires yearly; bump the date.
/.nojekyll           → Tells GitHub Pages to skip Jekyll so the .well-known directory is served. Do not delete.
/privacy/            → Privacy policy (en). Also /fr/privacy/ and /ln/privacy/. Linked from the consent banner.
/server/             → Empty placeholder. There is no backend. Don't fill it without discussing first.
```

## The crypto / handshake (verified against code)

This is the heart of the product. See `js/app.js` lines ~79–115 (crypto primitives) and ~406–494 (offer/answer flow).

1. **Key derivation:** `PBKDF2-SHA256, 100,000 iterations, 16-byte salt` → 256-bit AES key. The passphrase is human-readable: 4 words from the EFF short wordlist (1,295 words, in `app.js`) + 4 digits, e.g. `storm-fox-river-oak-4821`, ≈54 bits, drawn with `crypto.getRandomValues` and rejection sampling. Don't shrink the list.
2. **SDP encryption:** WebRTC offer/answer is **compressed**, then encrypted with `AES-256-GCM` (12-byte IV), then base64'd, then embedded in the **URL fragment** (`#offer=...` / `#answer=...`). Fragments never get sent to a server.
3. **Out-of-band signaling:** the encrypted link goes through one channel (WhatsApp, email). The passphrase goes through a different channel (phone, SMS, in person). **This two-channel split is the most important security property**: not the AES-256 itself, which is commodity. If both pieces travel the same channel, an attacker who compromises that channel gets everything.
4. **Wrong passphrase = GCM auth tag failure** → throws on decrypt → UI shows "wrong passphrase". This is intentional and is how we detect mismatched secrets.
5. **Transport:** once handshake completes, `RTCPeerConnection` + `RTCDataChannel`. **DTLS 1.3 transport encryption is browser-default**: we don't implement it, the browser does. All chat messages flow through this.
6. **Session verification:** a short authentication string (SAS) is shown to both users so they can verbally compare, defends against MITM during handshake. It is `SHA-256(sorted DTLS fingerprints from local+remote SDP + sorted nonces)`. The fingerprint binding is what makes a relaying MITM visible; don't drop it.
7. **Message history lives in `sessionStorage`** (`btw_msgs`), never `localStorage`, so "gone when you close the tab" stays literally true. A reload of the same tab shows a read-only view.

Don't change this stack without thinking carefully. The crypto choices are deliberate and conservative (PBKDF2 with high iteration count, AES-GCM for AEAD, WebRTC's standard DTLS).

## Brand in titles

Every `<title>` uses **"Btwinus Chat"**, not bare "Btwinus" (landing pages start with it, all other pages end with `| Btwinus Chat`). Decathlon's BTWIN bike brand owns the bare term in search; "btwinus chat" is the brand query we can actually win. The `WebSite` schema name is "Btwinus Chat" with alternateName "Btwinus". Keep the pattern on new pages.

## Languages and SEO

We support three languages: **English (en)**, **French (fr)**, **Lingála (ln)**. Lingála is for DRC / Republic of Congo audiences: Btwinus has an explicit African / low-data-market focus.

### URL routing

Each language has its **own real URL**, not a query parameter:
- `https://btwinus.com/` → `<html lang="en">`
- `https://btwinus.com/fr/` → `<html lang="fr">`
- `https://btwinus.com/ln/` → `<html lang="ln">`

This is essential for SEO. Server-rendered (static) translated bodies + hreflang alternates between the three. If Google can't find the translated content in initial HTML, it won't rank for non-English queries.

### How language switching works

- **`<html lang>` is the source of truth.** `getLang()` in `i18n.js` reads it first, then falls back to localStorage.
- **Clicking a flag navigates** (e.g. `/fr/`), it doesn't swap text in place. localStorage is updated as a preference cache only.
- **`data-i18n` attributes are preserved** on translated pages so the in-page `applyLang()` call is a safe no-op (rewrites identical text). Don't remove them.

### Translation files

All strings live in `js/i18n.js` as `I18N.{lang}.{key}`. Keep keys in sync across all three languages. The Lingála translations were written carefully, some loanwords are intentional (`lien`, `sɛrvɛr`, `aplikasyo`, `konti`). Don't "fix" them to pure Bantu equivalents without checking.

### SEO meta

Each landing page has:
- Translated `<title>`, `<meta description>`, `<meta keywords>`
- `<link rel="alternate" hreflang="en|fr|ln|x-default">` cross-references to all three URLs
- Translated OG/Twitter card tags with locale (`en_US`, `fr_FR`, `ln_CD`)
- JSON-LD `WebApplication` schema with `inLanguage` and translated description + featureList
- Bing Webmaster verification: `<meta name="msvalidate.01" content="AE475905F403EC20E0332EAEBEA4B94D">`

`sitemap.xml` uses the full `xhtml:link` hreflang annotation format on each URL, Google's preferred way.

## Service worker behavior

- Cache name: `btwinus-vN` (bump when you change what's cached).
- **HTML pages: network-first** with a per-language offline fallback. `/fr/...` falls back to `/fr/index.html`, `/ln/...` to `/ln/index.html`, `/blog/...` to `/blog/index.html`, everything else to `/index.html`.
- **CSS/JS: network-first** so version bumps reach users immediately. Falls back to cache only when offline.
- **Everything else: cache-first.** Icons, manifest, og images.

If you add a new asset that should work offline, add it to the `ASSETS` array and bump the `CACHE` version.

## Cache version numbers (current state)

These are scattered. When you change a file, find the existing `?v=N` references and bump. Approximate current values:
- `style.css?v=22`
- `blog.css?v=4`
- `theme.js?v=17`
- `i18n.js?v=24`
- `matrix.js`, `home.js` → `?v=16`, `demo.js?v=17`
- `consent.js?v=3`
- `app.js?v=18` (chat.html only)

This is fragile. Don't be afraid to bump even if you're not 100% sure, over-bumping costs one extra fetch, under-bumping serves stale content.

## Security headers

Every HTML page carries a `Content-Security-Policy` meta tag (same string everywhere, self + Google Analytics hosts, `'unsafe-inline'` because of the inline consent/gtag scripts and onclick handlers). If you add a new external host, add it to the CSP on every page or it will be blocked silently. `frame-ancestors` and HSTS cannot be set from a meta tag; they live in Cloudflare (Transform Rules → Modify Response Header, and SSL/TLS → Edge Certificates → HSTS).

## After deploying

Ping IndexNow so Bing and Yandex pick up changed URLs within minutes (Google does not use IndexNow). The key is the filename of the `.txt` at the repo root:

```
curl "https://api.indexnow.org/indexnow?url=https://btwinus.com/&key=a6b6e5f6d2e0ba8a54dda1e1b505f81c"
```

For several URLs, POST a JSON body (`host`, `key`, `urlList`) to `https://api.indexnow.org/indexnow` instead. Also bump `lastmod` in `sitemap.xml` for any page whose content changed.

## Conventions

- **No comments unless the WHY is non-obvious.** The code is the spec.
- **No emojis in code** unless they're product UI text (like 🛡 in the encryption strip).
- **No new dependencies** without discussion. Vanilla everything.
- **Cache version in every asset URL.** Plain `style.css` (without `?v=`) is a smell.
- **`data-i18n="key"`** for translatable text. `data-i18n-ph="key"` for placeholders.
- **Absolute paths (`/css/...`, `/js/...`) in subdirectory pages** (`/fr/`, `/ln/`, `/blog/*/`). Root `index.html` uses relative (`css/...`), both forms exist for historical reasons. Don't mass-rewrite.
- **`<noscript>` fallback is mandatory on JS-critical pages.** The whole product is JS-driven (crypto, WebRTC, UI). `chat.html` has a full-screen `.noscript-screen` ("JavaScript is required"); the three landing pages have a localized `.noscript-banner` (en/fr/ln, hardcoded since i18n.js can't run with JS off). Keep these in sync if you add a language or a new app page. Styles are in `style.css` (`.noscript-banner` / `.noscript-screen`).
- **The homepage `<h1>` is the tagline, not the logo.** The logo is a `<div class="logo">`; `home_tagline` sits in `<h1 class="home-tagline">`. Keep it that way, it is the only keyword-bearing H1 on the page.
- **No "military-grade", "spy-grade", "NSA approved" copy.** Removed everywhere (ticker, sec_title, JSON-LD, keywords). Privacy communities treat it as a red flag and Google treated the old ticker as keyword stuffing. Describe the actual primitives instead.
- **Never render the contact email as visible plain text.** The privacy contact (`artivicolab@gmail.com`) must only appear inside a `mailto:` `href`, shown to users as a localized "Contact us" link (EN "contact us", FR "contactez-nous", LN "benga biso"). Keeps it out of naive scrapers while still satisfying GDPR's working-contact requirement. Applies anywhere the address would otherwise be printed.

## Gotchas that already bit us

- **`html, body { overflow: hidden }` is set globally** in `style.css` line ~65 for the chat app surface. Any new page-type body class needs to override with `overflow: auto`, e.g. `body.blog-page { overflow: auto }`. Don't add `height: auto`: body needs `height: 100%` for the scroll container math to work.
- **chat.html has NO i18n yet.** It's English regardless of `btw_lang`. Translating it is a separate planned task.
- **The `home-page` body class has its own scroll override**: that's why home works. Mirror that pattern for new page types.
- **`getLang()` reads `<html lang>` first.** If you create a new page and forget to set `<html lang="...">`, you'll get the default 'en' regardless of what the user picked.
- **URL fragments don't go to the server.** Don't try to log/read `#offer=...` server-side; you can't. That's a feature.
- **Pre-bumping vs post-bumping cache versions:** the service worker is network-first for CSS/JS, so version bumps DO reach users on next request even without bumping the SW cache. But if you change `sw.js` itself you must bump `CACHE` or the new SW won't replace the old one.

## Things we deliberately did NOT do

These were considered and rejected. Don't suggest them again without new information:

- **Live "X people online" counter.** Considered with a Cloudflare Worker + WebSocket. Decided no, adds a server, sits awkwardly next to "no server, no history" copy, and is mostly vanity. GA real-time covers the internal-curiosity use case.
- **"Built for any network" data-cost strip on the home page.** Tried, user called it "weird," removed. The African / low-data audience focus is real but doesn't deserve its own marketing strip. Surface it inside the value props or skip.
- **Translating chat.html.** Discussed, it's the app surface, not a landing page. SEO doesn't need it; translation can come later if user asks.
- **Backend of any kind.** No. The product's defining property is "no server." Adding one needs explicit user buy-in.

## When in doubt

- The product positioning is **privacy-first**. Don't add features that ping home, sync to a server, store anything persistently, or require an account. If you're considering one, stop and ask.
- The audience includes **African / expensive-data markets**. Weigh payload size and background data use before adding anything. Lingála translation exists for this reason.
- **Don't break the cache versioning discipline.** It's the only thing that makes deploys reliable.

## Pointers if you need to dig deeper

- Crypto + WebRTC handshake: `js/app.js` lines ~79–115 (primitives), ~406–500 (offer/answer flow), ~340–360 (connection ready).
- Translations: `js/i18n.js`. Three top-level keys: `en`, `fr`, `ln`. `LANG_LIST` at the bottom controls the picker.
- Routing: also `js/i18n.js`. `setLang()` does the navigation, `getLang()` does the URL-vs-storage precedence.
- Theme toggle: `js/theme.js` (tiny, just toggles `[data-theme]` on `<html>`).
- Service worker: `sw.js`. Read it; it's short.
- SEO meta: each `index.html` head. They're verbose but each line is intentional.

If something feels surprising, read this file again, there's a reasonable chance the surprise is documented above.
