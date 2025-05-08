import logoImg from '../../assets/images/logo.png';

class NavbarView {
  constructor(logoText = '') {
    this.logoText = logoText;
    this.navbarElement = document.createElement('header');
    this.navbarElement.classList.add('navbar');
  }

  render() {
    const isLoggedIn = !!localStorage.getItem('token');
    this.navbarElement.innerHTML = `
  <div class="navbar-inner">
    <div class="navbar-logo">
      <img src="${logoImg}" alt="Logo" class="navbar-logo-img" />
      <div class="navbar-logo-group">
        <span class="navbar-logo-text">${this.logoText}</span>
        <span class="navbar-logo-subtext" style="color:rgb(255, 255, 255); font-size: 1 rem; margin-left: 0.5rem;">
          Storylane app
        </span>
      </div>
    </div>

    <nav class="navbar-menu">
      <a href="#/stories" class="navbar-button">Dashboard</a>
      <a href="#/add" class="navbar-button"> Add Story</a>
      ${
        isLoggedIn
          ? '<button id="logout-btn" class="navbar-button"> Logout</button>'
          : '<a href="#/login" class="navbar-button"> Login</a>'
      }
    </nav>
  </div>
`;

    if (isLoggedIn) {
      setTimeout(() => {
        const logoutBtn = this.navbarElement.querySelector('#logout-btn');
        if (logoutBtn) {
          logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('token');
            window.location.hash = '/login';
          });
        }
      }, 0);
    }

    return this.navbarElement;
  }
}

export default NavbarView;
