// ── PWA install prompt ────────────────────────────────────────────────────
let _installPrompt = null;

window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  _installPrompt = e;
  document.getElementById('install-banner').classList.remove('hidden');
});

window.addEventListener('appinstalled', () => {
  document.getElementById('install-banner').classList.add('hidden');
  _installPrompt = null;
});

// iOS Safari doesn't fire beforeinstallprompt — show manual hint instead
const _isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) ||
               (navigator.userAgent.includes('Mac') && 'ontouchend' in document);
if (_isIOS && !('standalone' in navigator && navigator.standalone)) {
  document.getElementById('install-ios').classList.remove('hidden');
}

document.getElementById('install-btn').addEventListener('click', async () => {
  if (!_installPrompt) return;
  _installPrompt.prompt();
  await _installPrompt.userChoice;
  _installPrompt = null;
  document.getElementById('install-banner').classList.add('hidden');
});

document.getElementById('install-dismiss').addEventListener('click', () => {
  document.getElementById('install-banner').classList.add('hidden');
  document.getElementById('install-ios').classList.add('hidden');
});

function newChat() {
  location.href = 'chat.html';
}

function joinChat() {
  const val = document.getElementById('link-input').value.trim();
  const err = document.getElementById('join-error');
  err.classList.add('hidden');

  if (!val) return;

  // Extract hash from whatever was pasted
  let hash = '';
  if (val.includes('#')) {
    hash = val.slice(val.indexOf('#'));
  }

  if (!hash || !hash.includes('offer=')) {
    err.classList.remove('hidden');
    return;
  }

  location.href = 'chat.html' + hash;
}

document.getElementById('new-chat-btn').addEventListener('click', newChat);
document.getElementById('join-btn').addEventListener('click', joinChat);
document.getElementById('link-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') joinChat();
});
