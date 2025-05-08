import './assets/styles/style.css';
import './routes/router.js';

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('skip-link')) {
    e.preventDefault();

    const targetId = e.target.getAttribute('href')?.replace('#', '');
    const target = document.getElementById(targetId);

    if (target) {
      // Pastikan tabindex dan fokus aktif
      target.setAttribute('tabindex', '-1');
      target.focus();
    }
  }
});
