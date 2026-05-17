// Cookie consent banner for Google Analytics (Consent Mode v2).
// gtag('consent','default', …) is set inline in each page head BEFORE config,
// defaulting analytics_storage to 'denied'. This banner flips it to 'granted'
// only on explicit opt-in, and persists the choice in localStorage.
(function () {
  'use strict';

  var KEY = 'btw_consent';
  var choice = null;
  try { choice = localStorage.getItem(KEY); } catch (e) {}
  if (choice === 'granted' || choice === 'denied') return;

  var L = {
    en: {
      text: 'We use Google Analytics to measure traffic. Your chats are never tracked — they stay end-to-end encrypted. Analytics cookies are only set if you accept.',
      accept: 'Accept',
      decline: 'Decline'
    },
    fr: {
      text: 'Nous utilisons Google Analytics pour mesurer l’audience. Vos conversations ne sont jamais suivies — elles restent chiffrées de bout en bout. Les cookies d’analyse ne sont posés que si vous acceptez.',
      accept: 'Accepter',
      decline: 'Refuser'
    },
    ln: {
      text: 'Tosalelaka Google Analytics mpo na kotanga bato baye bayaka. Masolo na yo elandamaka te — ezali ekangami ndɛlɛ-na-ndɛlɛ. Ba-cookies ya analytics etiamaka kaka soki ondimi.',
      accept: 'Ndima',
      decline: 'Boya'
    }
  };

  var lang = (document.documentElement.lang || 'en').slice(0, 2);
  var t = L[lang] || L.en;

  function build() {
    var bar = document.createElement('div');
    bar.className = 'consent-bar';
    bar.setAttribute('role', 'dialog');
    bar.setAttribute('aria-live', 'polite');
    bar.setAttribute('aria-label', t.text);

    var p = document.createElement('p');
    p.className = 'consent-text';
    p.textContent = t.text;

    var actions = document.createElement('div');
    actions.className = 'consent-actions';

    var decline = document.createElement('button');
    decline.type = 'button';
    decline.className = 'consent-btn consent-decline';
    decline.textContent = t.decline;

    var accept = document.createElement('button');
    accept.type = 'button';
    accept.className = 'consent-btn consent-accept';
    accept.textContent = t.accept;

    actions.appendChild(decline);
    actions.appendChild(accept);
    bar.appendChild(p);
    bar.appendChild(actions);
    document.body.appendChild(bar);

    function close() { if (bar.parentNode) bar.parentNode.removeChild(bar); }

    accept.addEventListener('click', function () {
      try { localStorage.setItem(KEY, 'granted'); } catch (e) {}
      if (typeof gtag === 'function') {
        gtag('consent', 'update', { analytics_storage: 'granted' });
      }
      close();
    });

    decline.addEventListener('click', function () {
      try { localStorage.setItem(KEY, 'denied'); } catch (e) {}
      close();
    });
  }

  if (document.body) build();
  else document.addEventListener('DOMContentLoaded', build);
})();
