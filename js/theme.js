// Apply saved theme before first paint to avoid flash
(function () {
  var saved = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
})();

function updateThemeBtn() {
  var btn = document.getElementById('theme-toggle');
  if (!btn) return;
  btn.textContent = document.documentElement.getAttribute('data-theme') === 'dark' ? 'Light' : 'Dark';
}

function toggleTheme() {
  var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeBtn();
}

document.addEventListener('DOMContentLoaded', updateThemeBtn);
