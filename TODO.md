# TODO: Why nobody finds Btwinus, and what to fix

Audit date: 2026-09-06. Every item below was verified against the live site
or the repo. Ordered by impact. Sections A and B are dashboard / outreach work
that only the site owner can do. Sections C onward are code and content work.

Quick summary of what was found:

- Site is live, fast, HTTPS, no `noindex`, deployed HTML matches the repo. Not a technical bug.
- Bing has **zero** pages from btwinus.com indexed (`site:btwinus.com` returns unrelated results).
- Google shows a stale "domain is inactive" page for the brand instead of the site.
- Google Search Console is set up. All-time performance: 1 query ("btmessage"), 1 impression,
  0 clicks. Indexed, but ranking for nothing.
- Zero external links or mentions of btwinus.com anywhere on the web.
- Brand name collides with Decathlon BTWIN (bikes) and "Btwin Us", a Kinshasa carpooling
  company at btwinus.org with active Facebook, Instagram, YouTube. Same target market.
- Domain was first seen in 2016 and went inactive in 2021. Search engines remember a different owner.
- Cloudflare returns **403** to GPTBot, ClaudeBot, PerplexityBot. `robots.txt` and `llms.txt`
  welcome them, but the edge blocks them first.
- All target keywords are held by established competitors (chatlink.com, elm.chat, lock.pub,
  otr.to, chatcrypt.com, password.link, nbit.chat; FR: chatnova.fr, chatiz.fr, chatiwi.com).
- Content stopped 2026-06-14. All four posts share the publish date 2026-05-10.
- Homepage H1 is just "Btwinus". The biggest block of static text is the spy-movie ticker.

---

## A. Indexing (do first, ~30 minutes, decides everything else)

- [x] **A1. Google Search Console.** Already set up (Performance report exists as of
      2026-09-06). No HTML verification tag is present, so it must be DNS- or GA-verified.
      Performance over the full period: 1 query ("btmessage"), 1 impression, 0 clicks.
      That means Google has the site but ranks it for nothing. The problem is authority and
      content (sections C–F), not indexing mechanics.
- [ ] **A2. Confirm the sitemap is submitted** in GSC: Indexing → Sitemaps →
      `https://btwinus.com/sitemap.xml` should show "Success" with 10 discovered URLs.
- [ ] **A3. Check Indexing → Pages.** Count how many of the 10 sitemap URLs are "Indexed" vs
      "Not indexed". For each not-indexed URL run URL Inspection and Request Indexing. Note the
      reason: "Discovered, currently not indexed" = authority problem (section C);
      "Crawled, currently not indexed" = content quality problem (sections D and F).
      Record the counts under Status at the bottom of this file.
- [ ] **A4. Bing Webmaster Tools.** Already verified via `msvalidate.01`. Log in, confirm the
      sitemap is submitted, and use "URL Submission" on the 10 sitemap URLs. Bing currently has
      nothing, which is the strongest evidence the sitemap was never submitted anywhere.
- [ ] **A5. Check Google Analytics for organic sessions** over the last 90 days, to see whether
      any traffic arrives from search at all and from which country.
- [x] **A6. Add IndexNow** (code task, no server needed). Generate a 32-char hex key, save it as
      `/<key>.txt` at the repo root containing the key, then after every deploy ping
      `https://api.indexnow.org/indexnow?url=https://btwinus.com/&key=<key>`. Bing and Yandex
      index within minutes. Add the key file to `sw.js` ASSETS is NOT needed. Document the ping
      command in `CLAUDE.md`.

## B. Cloudflare and crawler access

- [x] **B1. Unblock AI crawlers.** In the Cloudflare dashboard: Security → Bots → turn off
      "Block AI bots" (or "AI Scrapers and Crawlers"), or add a WAF custom rule that allows
      user agents `GPTBot`, `ClaudeBot`, `anthropic-ai`, `PerplexityBot`, `ChatGPT-User`,
      `Applebot`. Verify with:
      `curl -s -o /dev/null -w '%{http_code}\n' -A GPTBot https://btwinus.com/` → must be 200.
      Until this is done, `llms.txt` and the AI section of `robots.txt` do nothing, and ChatGPT /
      Perplexity / Claude cannot recommend the product.
- [ ] **B2. Confirm Googlebot is not challenged.** In Cloudflare, Security → Settings, make sure
      "Bot Fight Mode" is off or set to skip verified bots. A JS challenge served to Googlebot
      produces an empty page in the index.
- [x] **B3. Update `CLAUDE.md`.** It says hosting is GitHub Pages only. The live site is behind
      Cloudflare (`server: cloudflare` header, `cf-ray`). Document that Cloudflare proxies the
      domain and that bot settings live there, so future edits to `robots.txt` don't assume it is
      the final word.

## C. Backlinks and mentions (the actual ranking problem)

A four-month-old domain with zero links will not rank for commercial queries no matter how good
the on-page work is. Each item below is one link from a relevant site.

- [x] **C1. Public GitHub README.** The repo is `github.com/BTwinus/btwinus`. Make sure it is
      public and the README describes the product, links to `https://btwinus.com`, and explains
      the crypto (reuse `llms.txt`). GitHub links are nofollow but they get crawled and cited.
- [ ] **C2. Show HN.** (parked, see Status: needs the owner's own words and presence) Post "Show HN: Btwinus – E2E encrypted P2P chat in a link, no server,
      no account" with a short technical explanation (SDP compressed + AES-GCM in the URL
      fragment, two-channel passphrase). HN links get scraped by dozens of aggregators.
- [ ] **C3. Product Hunt launch.** One-line tagline plus 3 screenshots (light + dark + mobile).
- [x] **C4. AlternativeTo.** Create a listing as an alternative to Signal, ChatCrypt, otr.to,
      Privnote, OneTimeSecret.
- [x] **C5. GitHub awesome lists.** Open PRs to `awesome-privacy`, `awesome-webrtc`,
      `awesome-selfhosted` (not applicable, no server; skip), `awesome-e2ee` style lists.
- [ ] **C6. Privacy Guides forum** (discuss.privacyguides.net), post in "Tool Suggestions" with
      an honest threat-model writeup. They will push back on "military-grade" wording; that is
      one more reason to remove it (see D3).
- [ ] **C7. Reddit.** r/privacy, r/privacytoolsIO, r/webdev ("I built..."), r/selfhosted (no),
      r/Congo and r/Kinshasa for the Lingála angle if those communities are active.
- [ ] **C8. dev.to / Hashnode technical writeup.** "How I put a WebRTC handshake inside a URL
      fragment". Competitors already rank on dev.to for the exact query
      "anonymous chat WebRTC no signup"; a post there links back and ranks on its own.
- [ ] **C9. Directory listings.** SaaSHub, Slant, ToolFinder, Uneed, Peerlist, BetaList.
- [ ] **C10. Wikipedia-style citations are out of reach for now. Skip.**
- [ ] **C11. Track it.** Keep a list of every placed link with date in this file or a
      `docs/links.md`. Re-check GSC "Links" report monthly.

## D. Homepage on-page fixes (`index.html`, `fr/index.html`, `ln/index.html`, `js/i18n.js`)

- [x] **D1. H1 carries no keyword.** `index.html:150` is `<h1 class="logo">Btwinus</h1>`.
      Make the logo a `<div>` or `<a>` and turn the tagline (currently `home_tagline` in
      `js/i18n.js:4/109/214`) into the `<h1>`. Target wording, EN:
      "Anonymous encrypted chat via a link. No account. No server. No history." is fine as is;
      it just needs to be the H1. Update `.logo` CSS selector in `css/style.css` if it targets
      the `h1` element, and bump `style.css?v=21` → `22` everywhere it is referenced
      (`index.html`, `fr/`, `ln/`, `chat.html`, `blog/*`, `privacy/*`).
- [x] **D2. Remove or rewrite the ticker.** `index.html:179–191` (and the same block in `fr/`
      and `ln/`). "MILITARY · SPY · CLASSIFIED · BLACK OPS · COVERT OPS · TOP SECRET · EYES ONLY ·
      GHOST PROTOCOL" is the largest static text block a crawler sees on the page. It reads as
      keyword stuffing to Google and as a joke to the journalists and lawyers the page targets.
      Either delete the block (it is `aria-hidden` already, so nothing is lost for users) or
      replace with real terms: "AES-256-GCM · PBKDF2 · DTLS 1.3 · WebRTC · No server ·
      No account · No history · Open source". Keep it `aria-hidden`.
- [x] **D3. Drop "military-grade".** `js/i18n.js:17` (`sec_title`) and the FR/LN equivalents,
      `index.html:41` (JSON-LD description), `index.html:62` (featureList item claiming
      "approved by the NSA for TOP SECRET information"). AES-256 is in NIST's Suite B list, but
      the phrase "NSA approved" on a consumer privacy tool invites ridicule from exactly the
      communities in section C. Replace with "AES-256-GCM end-to-end encryption, the same
      standard used by Signal and TLS".
- [x] **D4. Clean the keywords meta.** `index.html:9` and the JSON-LD `keywords` on line 50
      list "NSA approved encryption", "spy grade messaging", "top secret encryption", "covert
      messaging", "crisis hotline chat", "crypto seed phrase transfer". Google ignores the
      keywords meta, but the stuffed list is visible to anyone reviewing the page and is a
      spam signal in the JSON-LD. Trim to ~10 real terms: anonymous chat, encrypted chat,
      no account chat, P2P chat, WebRTC chat, end-to-end encrypted, disposable chat,
      share password securely, anonymous tip line, secure link chat. Mirror in `fr/` and `ln/`.
- [x] **D5. Add a visible FAQ section** with `FAQPage` JSON-LD. Questions that match real
      searches: "Is Btwinus really free?", "Does Btwinus store messages?", "Do I need to
      install anything?", "Can Btwinus be used on mobile?", "What happens if I share the
      passphrase in the same message as the link?", "How is this different from Signal?".
      Add `faq_*` keys to all three languages in `js/i18n.js`.
- [x] **D6. Add an "Open source" mention and link** to the GitHub repo in the footer. It is
      a trust signal and the only outbound link on the page today is none.
- [x] **D7. `chat.html` in the sitemap.** Its description says "Your secure anonymous chat room
      is ready". Either give it a real landing-style description or set priority 0.3. A page
      whose entire body is a JS app should not compete with the homepage for the same query.

## E. Brand and naming

- [x] **E1. Decide the brand strategy.** Ranking for "btwinus" against Decathlon and a
      five-year-old Kinshasa company is a long fight. Options, pick one and write it down here:
      (a) keep the name, accept that discovery comes from descriptive queries and links, not
      the brand term; (b) add a descriptor everywhere the name appears in titles, e.g.
      "Btwinus Chat" so the brand term becomes "btwinus chat"; (c) rename.
      Recommended: (b). It costs one title edit per page.
- [ ] **E2. Claim the social handles** `btwinus` / `btwinuschat` on X, Bluesky, Mastodon,
      LinkedIn, YouTube even if unused. Each one is a profile link and a search result you own.
- [ ] **E3. Google Business / Knowledge panel is not applicable** (no physical business). Skip.
- [x] **E4. Add `Organization` JSON-LD with `sameAs`** pointing to the GitHub repo and the
      social profiles from E2, so Google can connect the name to this site rather than to
      btwinus.org. `index.html:79` already has an `Organization` node inside `WebApplication`;
      add the `sameAs` array there.

## F. Content (blog)

- [ ] **F1. Publish cadence.** Nothing since 2026-06-14. Commit to one post every two weeks and
      set real `datePublished` values per post (all four currently say 2026-05-10, which makes
      the blog look like a one-day dump).
- [x] **F2. French blog.** `/fr/blog/` does not exist. The French SERP for "chat chiffré sans
      serveur sans compte" is far less crowded than the English one and the FR landing page has
      no supporting content. Translate the four existing posts first, then write FR-native
      posts. Add each to `sitemap.xml` with hreflang pairs and to `sw.js` navigate fallback
      (`/fr/blog/...` → `/fr/index.html` already works via the `/fr/` prefix rule; verify).
- [ ] **F3. Lingála blog.** At least one post, e.g. the "share a password" one, to give `/ln/`
      something to link to. Lingála search volume is tiny but there is zero competition.
- [x] **F4. Comparison pages.** Competitors rank with pages titled "X vs Y". Write
      `/blog/btwinus-vs-privnote/`, `/blog/btwinus-vs-onetimesecret/`, `/blog/btwinus-vs-chatcrypt/`,
      `/blog/btwinus-vs-otr-to/`. Honest tables, same format as the existing Signal post.
- [x] **F5. Use-case pages.** The homepage lists six use cases (`uc_*` keys). Each deserves a
      500–800 word page: `/use/journalists/`, `/use/lawyers/`, `/use/share-a-password/`,
      `/use/anonymous-feedback/`, `/use/negotiations/`, `/use/support/`. Link them from the
      use-case cards on the homepage. These pages need the `body.blog-page`-style
      `overflow: auto` override (see CLAUDE.md gotcha).
- [x] **F6. Update `lastmod` in `sitemap.xml`** whenever a page actually changes. Homepage
      says 2026-05-02 but was edited 2026-06-14.
- [ ] **F7. Blog index has no analytics.** That is deliberate per CLAUDE.md, but it means you
      cannot see which posts get organic traffic. Either add GA with the same Consent Mode
      block to blog pages, or rely on GSC "Performance" per URL. Decide and write it down.
- [x] **F8. Author byline.** Posts use `"author": { "@type": "Organization" }`. Google's
      helpful-content signals favour a named person. Add a `Person` author with a short bio.

## G. Technical SEO housekeeping (small, do alongside the above)

- [x] **G1. `og.svg` as the share image.** Most platforms (WhatsApp, X, LinkedIn, Slack) do not
      render SVG `og:image`. Export a 1200×630 PNG and point `og:image` / `twitter:image` at it
      on every page. Add to `sw.js` ASSETS and bump `CACHE` to `btwinus-v11`. This matters
      directly for section C: every shared link currently shows no preview image.
- [x] **G2. Homepage payload.** `js/qr.js` is 56 KB and is loaded on the landing page. Confirm
      it is lazy-loaded only when the QR is requested (commit history says it is; verify in
      `js/home.js`). Relevant for Core Web Vitals and for the low-data audience.
- [x] **G3. Add `<link rel="alternate" type="application/rss+xml">`** and a `/blog/feed.xml`.
      Feed readers and aggregators (which are backlinks) need it.
- [x] **G4. `robots.txt` cleanup.** Keep the AI-crawler allow block but add a comment noting
      that Cloudflare must also allow them (B1). Otherwise the next person will assume the file
      is enough.
- [x] **G5. 404 page.** `404.html` is a meta-refresh to `/`. GitHub Pages serves it with a 404
      status, which is correct, but a refresh-to-home hides broken links from GSC. Make it a
      real page with a link home instead.
- [x] **G6. `chat.html` title.** "Btwinus, Start a Secure Anonymous Chat, No Account Needed"
      duplicates the homepage intent. Consider `noindex` on `chat.html` and remove it from the
      sitemap; the app surface does not need to rank, the landing page does.

## I. App weaknesses found while writing the README (fix before Show HN / Privacy Guides)

Found by reading `js/app.js`. Each is already disclosed honestly in `README.md` and `docs/outreach.md`,
because those communities will find them within an hour. Fixing them first makes the launch land better.

- [x] **I1. Passphrase entropy is ~28 bits.** `genPassphrase()` (`js/app.js:73`) picks 3 words from a
      30-word `WORDS` list plus a 4-digit number: 30³ × 9000 ≈ 2.4 × 10⁸ combinations. With the link in
      hand, PBKDF2 at 100k iterations makes a GPU brute force a matter of hours. Word choice also uses
      `Math.random`, not `crypto.getRandomValues`. Fix: expand to an EFF-style list of at least 1,000
      words (4 words ≈ 40 bits, 5 words ≈ 50 bits) and pick with `crypto.getRandomValues`. Keep the
      `word-word-word-1234` shape so it stays sayable over the phone.
- [x] **I2. The SAS is not bound to the DTLS session.** `computeSessionCode()` (`js/app.js:272`) hashes
      two nonces exchanged over the data channel itself, so a relaying man-in-the-middle forwards them
      unchanged and both sides still see a matching code. Fix: hash the two DTLS certificate
      fingerprints from the local and remote SDP (`a=fingerprint:` lines) instead of, or in addition
      to, the nonces.
- [x] **I3. Messages are persisted to localStorage.** `saveMessages()` writes the session to
      `localStorage['btw_msgs']` for 24 hours (`js/app.js:21`). The "No history" tagline is not literally
      true while this exists. Either drop the feature, make it opt-in, or change the copy to
      "cleared when a new chat starts" everywhere the tagline appears (i18n `home_tagline`,
      `site_footer_tagline`, JSON-LD featureList, llms.txt, privacy pages).
- [x] **I4. Single Google STUN server, no TURN.** `ICE_SERVERS` (`js/app.js:2`) is
      `stun.l.google.com:19302` only. Google sees the public IP of every participant, and two users
      behind symmetric NATs cannot connect at all. Adding a TURN relay would fix connectivity but
      contradicts "no server" and would see (encrypted) traffic; state the trade-off in the FAQ instead,
      and consider a non-Google STUN host.
- [x] **I5. Add a LICENSE file.** README says "see LICENSE (not yet added)". Lissy93/awesome-privacy
      and AlternativeTo both require one. MIT or AGPL are the usual choices for this kind of tool.

## J. Website security headers (flagged by the awesome-privacy bot on PR #802)

Done in the repo: CSP meta tag on every page, `/.well-known/security.txt` (+ `/security.txt`),
`.nojekyll`, GitHub private vulnerability reporting enabled. The rest are HTTP headers, which only
Cloudflare can set for a GitHub Pages site:

- [x] **J1. HSTS to one year.** Cloudflare → SSL/TLS → Edge Certificates → HTTP Strict Transport
      Security → Enable: Max Age 12 months, Include subdomains on, Preload on. Currently 30 days.
- [x] **J2. Response headers.** Cloudflare → Rules → Transform Rules → Modify Response Header →
      Create rule "Security headers", expression `true` (all requests), Set static:
      - `X-Frame-Options` = `DENY`
      - `X-Content-Type-Options` = `nosniff`
      - `Referrer-Policy` = `strict-origin-when-cross-origin`
      - `Permissions-Policy` = `camera=(self), microphone=(), geolocation=()`
        (camera stays on for the QR scanner)
      - `Content-Security-Policy` = the exact string in the meta tag on index.html, plus
        `; frame-ancestors 'none'`
      Verify with `curl -sI https://btwinus.com/ | grep -iE 'strict|frame|content-security'`.
- [ ] **J3. Repo maturity** (age, stars, contributors) is only fixed by time and by the Show HN /
      AlternativeTo links. If the awesome-privacy maintainer asks to resubmit later, do it after
      the next release.

## H. Measurement (so this list can be re-checked)

- [ ] **H1. Monthly check.** GSC Coverage: number of indexed pages (target: all sitemap URLs).
      GSC Performance: impressions and clicks. GSC Links: referring domains.
- [ ] **H2. Re-run the crawler test** from B1 after any Cloudflare change.
- [ ] **H3. Re-run `site:btwinus.com` on Google and Bing** monthly until every sitemap URL shows.
- [ ] **H4. Record results in this file** under a dated "Status" heading at the bottom.

---

## Status

- 2026-09-06: Audit done.
- 2026-09-06: Code items done, uncommitted: A6 (IndexNow key `a6b6e5f6d2e0ba8a54dda1e1b505f81c.txt`, ping
  after first deploy), B3, D1–D7, E4, F6, G1–G6. `style.css` → v22, `i18n.js` → v22. chat.html kept in
  the sitemap at priority 0.3 rather than noindexed. Still open: A2–A5, B1–B2, C (all), E1–E2, F1–F5, F7–F8.
  Note for E1: the Organization `sameAs` already points at the Btwin Us Facebook/Instagram accounts, so
  those profiles are ours; the only real name collision is Decathlon BTWIN.
- 2026-09-06 (later): Cloudflare AI-bot block confirmed off (GPTBot/ClaudeBot/PerplexityBot → 200).
  GSC Pages: 4 of 10 indexed (/, /blog/, /chat.html, /fr/). Not indexed: /ln/, 4 blog posts, 3 privacy.
  Done: E1 → option (b), every title now "Btwinus Chat". F2 French blog (5 pages). F4 four comparison
  posts. F5 six use-case pages + hub. F8 Person author. C1 README. docs/outreach.md holds all section C
  copy ready to post. Sitemap now 28 URLs, feed 8 items. New section I lists app weaknesses found.
- 2026-09-06 (later still): I1–I4 fixed in js/app.js (v17): 4-word EFF passphrase ≈54 bits via
  crypto.getRandomValues; SAS bound to DTLS fingerprints; history in sessionStorage; STUN trade-off
  is FAQ question 7. README, outreach copy, privacy pages, CLAUDE.md updated to match. I5 (LICENSE)
  still open: owner's choice.
- 2026-09-06 (GitHub side): MIT LICENSE added. Repo has description, homepage, 10 topics, release
  v1.0.0. Pull requests opened from the gradikay account, each disclosing authorship and AI drafting:
  https://github.com/lissy93/awesome-privacy/pull/802,
  https://github.com/pluja/awesome-privacy/pull/1088,
  https://github.com/anondotli/awesome-privacy-tools/pull/52.
  emircem/awesome-webrtc skipped (0 stars, last commit 2017). Check the PRs weekly for maintainer
  questions; reply from the same account.
- 2026-09-07: Cloudflare done by the owner: HSTS one year, Response Header Transform rule with
  CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy. Verified live.
  Bot report on PR #802 answered. Remaining red marks (repo age, stars, contributors) need time.
- 2026-09-07: lissy93/awesome-privacy #802 CLOSED by the maintainer: "doesn't meet quality or privacy
  requirements", no specifics. Read as maturity (age, stars, single contributor, AI commits, no audit).
  Do not reopen or resubmit before March 2027, and only with stars, a second contributor, and at least
  one outside review of app.js. pluja #1088 and anondotli #52 still open.
- 2026-09-07: AlternativeTo listing submitted by the owner with ~12 alternatives (Privnote, Telegram,
  Signal, One-Time Secret, BurnChat, Niltalk, vanish.so, Nix, Olvid, Session, SimpleX, Briar, Wire).
  ACCEPTED 2026-09-07, listing is live. Hacker News skipped on purpose: new-account
  restriction on Show HN plus their rule against AI-written text; the owner would have to write and
  discuss it personally. Screenshots for directories live in docs/screenshots/.
  GSC Performance (all time): 1 query "btmessage", 1 impression, 0 clicks. Bing index: 0 pages.
  Backlinks: 0. AI crawlers: blocked at Cloudflare (403).
