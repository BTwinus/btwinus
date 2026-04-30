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
