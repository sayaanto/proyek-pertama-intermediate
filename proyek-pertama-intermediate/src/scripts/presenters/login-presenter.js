// src/scripts/presenters/login-presenter.js
import Swal from 'sweetalert2';
import AuthApi from '../koneksi_api/api.js';
import LoginView from '../views_page/login_view.js';

class LoginPresenter {
  constructor({ view }) {
    this.view = view;
    this.init();
  }

  init() {
    // Pastikan render sudah dipanggil sebelum binding event
    this.view.render();
    this.view.afterRender(this.handleLogin.bind(this));
  }

  async handleLogin(email, password) {
    try {
      Swal.fire({
        title: 'Logging in...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const result = await AuthApi.login(email, password);
      localStorage.setItem('token', result.token);

      Swal.close();
      Swal.fire({
        icon: 'success',
        title: 'Login Berhasil',
        text: 'Anda sekarang sudah masuk!',
      });

      window.location.hash = '#/stories';
    } catch (error) {
      Swal.close();
      Swal.fire({
        icon: 'error',
        title: 'Login Gagal',
        text: error.message || 'Terjadi kesalahan yang tidak terduga',
      });
    }
  }
}

export default LoginPresenter;
