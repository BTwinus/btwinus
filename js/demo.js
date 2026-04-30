(function () {
  'use strict';

  // ── Mini screen renderers ─────────────────────────────────────────────────

  function screenHome(clicking) {
    return `
      <div class="ms-home">
        <div class="ms-logo">Btwinus</div>
        <p class="ms-tagline">Anonymous chat via links.<br>No account. No history.</p>
        <div class="ms-btn${clicking ? ' ms-btn-click' : ''}">Start a new chat</div>
        <div class="ms-divider">or join an existing one</div>
        <div class="ms-input-row">
          <div class="ms-ghost-input"></div>
          <div class="ms-sm-btn">Join</div>
        </div>
      </div>`;
  }

  function screenOffering(step) {
    function s(n, label, content, forceActive) {
      const on = forceActive || step >= n;
      return `
        <div class="ms-step${on ? '' : ' ms-dim'}${step === n && !forceActive ? ' ms-step-hl' : ''}">
          <span class="ms-n">${n}</span>
          <div class="ms-sc">
            <div class="ms-lb">${label}</div>
            ${content}
          </div>
        </div>`;
    }
    return `<div class="ms-steps">
      ${s(1, 'Send this link',         `<div class="ms-link">btw.in/#offer=<em>A9x…Kp</em></div>`)}
      ${s(2, 'Passphrase separately',  `<div class="ms-phrase">storm · fox · river · 4821</div>`)}
      ${s(3, 'Paste their reply',       `<div class="ms-ghost-input${step >= 3 ? ' ms-focus' : ''}"></div>`)}
    </div>`;
  }

  function screenWaiting() {
    return `<div class="ms-center">
      <div class="ms-lock">🔒</div>
      <p class="ms-wt">Waiting for a link…</p>
    </div>`;
  }

  function screenPassphrase(typed) {
    return `<div class="ms-center">
      <div class="ms-lock">🔒</div>
      <div class="ms-h2">Enter passphrase</div>
      <p class="ms-sub">Sent via a separate channel</p>
      <div class="ms-pp${typed ? ' ms-pp-typed' : ''}">
        ${typed ? 'storm · fox · river · 4821' : '<span class="ms-cur">|</span>'}
      </div>
      ${typed ? '<div class="ms-unlock">Unlock</div>' : ''}
    </div>`;
  }

  function screenAnswering() {
    return `<div class="ms-steps">
      <div class="ms-step">
        <span class="ms-n">1</span>
        <div class="ms-sc">
          <div class="ms-lb">Send this link back</div>
          <div class="ms-link">btw.in/#answer=<em>B4j…Rm</em></div>
        </div>
      </div>
      <p class="ms-waiting">Waiting for them to connect…</p>
    </div>`;
  }

  function screenConnected() {
    return `<div class="ms-center">
      <div class="ms-conn-badge">
        <span class="ms-conn-dot"></span>
        Connected
      </div>
      <p class="ms-enc">End-to-end encrypted</p>
    </div>`;
  }

  const MSGS = [
    { from: 'alice', text: 'Hey, you there?' },
    { from: 'gradi',   text: 'Yes! Got your message' },
    { from: 'alice', text: 'No one can read this' },
    { from: 'gradi',   text: 'Not even the site itself' },
  ];

  function screenChat(count, side) {
    const bubbles = MSGS.slice(0, count).map(m =>
      `<div class="ms-msg ${m.from === side ? 'ms-own' : 'ms-them'}">${m.text}</div>`
    ).join('');
    return `<div class="ms-chat">
      <div class="ms-chat-top">
        <span class="ms-conn-dot"></span>
        <span>${side === 'alice' ? 'Gradi K.' : 'Alice'} is active</span>
      </div>
      <div class="ms-msgs">${bubbles}</div>
      <div class="ms-composer">
        <div class="ms-ghost-input"></div>
        <div class="ms-send">Send</div>
      </div>
    </div>`;
  }

  // ── Phase list ────────────────────────────────────────────────────────────

  const PHASES = [
    { d: 1800, l: screenHome(false),      r: screenWaiting(),         cap: 'Alice opens Btwinus',                          pkt: null },
    { d: 1400, l: screenHome(true),       r: screenWaiting(),         cap: 'She clicks "Start a new chat"',                pkt: null },
    { d: 2000, l: screenOffering(2),      r: screenWaiting(),         cap: 'She gets an encrypted link and a passphrase',  pkt: null },
    { d: 2000, l: screenOffering(2),      r: screenWaiting(),         cap: 'She sends the link via WhatsApp',              pkt: { ch: 'link', dir: 'ltr' } },
    { d: 2200, l: screenOffering(2),      r: screenWaiting(),         cap: 'She calls Gradi K. with the passphrase',       pkt: { ch: 'pass', dir: 'ltr' } },
    { d: 1600, l: screenOffering(3),      r: screenPassphrase(false), cap: 'Gradi K. opens the link — needs the passphrase', pkt: null },
    { d: 2200, l: screenOffering(3),      r: screenPassphrase(true),  cap: 'Gradi K. types the passphrase and unlocks',    pkt: null },
    { d: 2200, l: screenOffering(3),      r: screenAnswering(),       cap: 'Gradi K. gets a reply link — sends it back',   pkt: { ch: 'link', dir: 'rtl' } },
    { d: 1800, l: screenConnected(),      r: screenConnected(),       cap: 'Alice pastes it — they\'re connected!',        pkt: null },
    { d: 1400, l: screenChat(1, 'alice'), r: screenChat(1, 'gradi'),    cap: 'End-to-end encrypted. No servers. No trace.',  pkt: null },
    { d: 1400, l: screenChat(2, 'alice'), r: screenChat(2, 'gradi'),    cap: 'End-to-end encrypted. No servers. No trace.',  pkt: null },
    { d: 1400, l: screenChat(3, 'alice'), r: screenChat(3, 'gradi'),    cap: 'End-to-end encrypted. No servers. No trace.',  pkt: null },
    { d: 2800, l: screenChat(4, 'alice'), r: screenChat(4, 'gradi'),    cap: 'End-to-end encrypted. No servers. No trace.',  pkt: null },
  ];

  // ── Animation engine ──────────────────────────────────────────────────────

  let idx = 0;

  function fade(id, html) {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.cssText = 'opacity:0;transform:translateY(5px)';
    requestAnimationFrame(() => {
      el.innerHTML = html;
      requestAnimationFrame(() => {
        el.style.cssText = 'transition:opacity .35s ease,transform .35s ease;opacity:1;transform:translateY(0)';
      });
    });
  }

  function setCaption(text) {
    const el = document.getElementById('demo-caption');
    if (!el) return;
    el.style.opacity = '0';
    setTimeout(() => {
      el.textContent = text;
      el.style.cssText = 'transition:opacity .3s ease;opacity:1';
    }, 150);
  }

  function firePacket(ch, dir) {
    const el = document.getElementById('demo-pkt-' + ch);
    if (!el) return;
    el.className = 'demo-pkt demo-pkt-' + ch;
    void el.offsetWidth; // reflow to restart animation
    el.classList.add(dir === 'ltr' ? 'pkt-ltr' : 'pkt-rtl');
  }

  function updateDots() {
    const el = document.getElementById('demo-dots');
    if (!el) return;
    el.innerHTML = PHASES.map((_, i) =>
      `<span class="demo-dot-pip${i === idx ? ' active' : ''}"></span>`
    ).join('');
  }

  function runPhase() {
    const p = PHASES[idx];
    fade('demo-left',  p.l);
    fade('demo-right', p.r);
    setCaption(p.cap);
    updateDots();
    if (p.pkt) setTimeout(() => firePacket(p.pkt.ch, p.pkt.dir), 500);
    setTimeout(() => { idx = (idx + 1) % PHASES.length; runPhase(); }, p.d);
  }

  function boot() {
    if (!document.getElementById('demo-left')) return;
    runPhase();
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', boot)
    : boot();
})();
