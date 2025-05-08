import LoginView from '../scripts/views_page/login_view.js';
import RegisterView from '../scripts/views_page/register_view.js';
import StoryView from '../scripts/views_page/story_view.js';
import AddView from '../scripts/views_page/add_view.js';
import DetailView from '../scripts/views_page/detail_view.js';
import FooterView from '../scripts/views_page/footer_view.js';
import NavbarView from '../scripts/views_page/navbar_view.js';

import LoginPresenter from '../scripts/presenters/login-presenter.js';
import RegisterPresenter from '../scripts/presenters/register-presenter.js';
import StoryPresenter from '../scripts/presenters/story-presenter.js';
import AddPresenter from '../scripts/presenters/add-presenter.js';
import DetailPresenter from '../scripts/presenters/detail-presenter.js';

const routes = {
  '/login': {
    view: LoginView,
    presenter: LoginPresenter,
  },
  '/register': {
    view: RegisterView,
    presenter: RegisterPresenter,
  },
  '/stories': {
    view: StoryView,
    presenter: StoryPresenter,
  },
  '/add': {
    view: AddView,
    presenter: AddPresenter,
  },
};

const renderPage = () => {
  const app = document.getElementById('app');
  const hash = window.location.hash.slice(1) || '/login';
  app.innerHTML = '';

  const isAuthPage = hash === '/login' || hash === '/register';

  // ✅ Cek jika halaman detail story
  const storyDetailRegex = /^\/stories\/(.+)/;
  const matchDetail = hash.match(storyDetailRegex);

  if (matchDetail) {
    const id = matchDetail[1];

    if (!isAuthPage) {
      const navbar = new NavbarView();
      app.appendChild(navbar.render());
    }

    const container = document.createElement('div');
    container.setAttribute('id', 'main-content');
    container.setAttribute('tabindex', '-1');
    container.innerHTML = DetailView.render();
    app.appendChild(container);

    new DetailPresenter({ view: DetailView, id });

    if (!isAuthPage) {
      const footer = new FooterView();
      app.appendChild(footer.render());
    }

    return;
  }

  // ✅ Render berdasarkan route biasa
  const route = routes[hash];
  if (!route) {
    app.innerHTML = '<h2>404 - Page Not Found</h2>';
    return;
  }

  if (!isAuthPage) {
    const navbar = new NavbarView();
    app.appendChild(navbar.render());
  }

  const container = document.createElement('div');
  container.setAttribute('id', 'main-content');
  container.setAttribute('tabindex', '-1');
  container.innerHTML = route.view.render();
  app.appendChild(container);

  new route.presenter({ view: route.view });

  if (!isAuthPage) {
    const footer = new FooterView();
    app.appendChild(footer.render());
  }
};

// ✅ Gunakan View Transition API jika tersedia
const router = () => {
  if (document.startViewTransition) {
    document.startViewTransition(() => renderPage());
  } else {
    renderPage();
  }
};

window.addEventListener('hashchange', router);
window.addEventListener('load', router);

// ✅ Aksesibilitas: Skip link fokus ke target
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('skip-link')) {
    e.preventDefault();

    const targetId = e.target.getAttribute('href')?.replace('#', '');
    const target = document.getElementById(targetId);

    if (target) {
      setTimeout(() => {
        target.setAttribute('tabindex', '-1');
        target.focus();
      }, 0);
    }
  }
});

export default router;
