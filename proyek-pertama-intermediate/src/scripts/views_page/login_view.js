import logoImg from '../../assets/images/logo.png';
import Swal from 'sweetalert2';

const LoginView = {
  render() {
    const container = document.getElementById('app');
    container.innerHTML = `
      <section id="main-content" tabindex="-1" class="login-section">
        <form id="login-form" class="login-form" novalidate>
          <div class="login-logo-container">
            <img src="${logoImg}" alt="Logo" class="login-logo" />
          </div>

          <input type="email" id="email" placeholder="Email" aria-label="Email" required />

          <div class="password-field" style="position: relative;">
            <input type="password" id="password" placeholder="Password" aria-label="Password" required />
            <button type="button" id="toggle-password"
              style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); 
                     background: none; border: none; color: #666; cursor: pointer; font-size: 0.9rem;">
              Show
            </button>
          </div>

          <button type="submit">Login</button>
          <a href="#/register">Don't have an account? Register</a>
        </form>
      </section>
    `;
  },

  /**
   * Bind event listeners after render is complete
   * @param {Function} callback - function(email, password)
   */
  afterRender(callback) {
    const form = document.querySelector('#login-form');
    if (!form) return;

    const passwordInput = form.querySelector('#password');
    const toggleBtn = form.querySelector('#toggle-password');

    // Toggle show/hide password
    toggleBtn.addEventListener('click', () => {
      const isHidden = passwordInput.type === 'password';
      passwordInput.type = isHidden ? 'text' : 'password';
      toggleBtn.textContent = isHidden ? 'Hide' : 'Show';
    });

    // Submit form
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const email = form.querySelector('#email').value.trim();
      const password = passwordInput.value.trim();

      if (!email || !password) {
        Swal.fire({
          icon: 'warning',
          title: 'Input Required',
          text: 'Email and password must be filled!',
        });
        return;
      }

      callback(email, password);
    });

    // Animation using JavaScript Animation API
    this.animateLoginForm();
  },

  animateLoginForm() {
    const form = document.getElementById('login-form');
    const elements = form.querySelectorAll('input, button, a');
    
    elements.forEach((el, index) => {
      el.animate(
        [
          { opacity: 0, transform: 'translateY(20px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ],
        {
          duration: 600,
          delay: index * 150, // Stagger the animations
          easing: 'ease-out',
        }
      );
    });
  }
};

export default LoginView;
