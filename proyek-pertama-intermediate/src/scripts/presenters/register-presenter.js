// src/scripts/presenters/register-presenter.js
import Swal from 'sweetalert2';
import AuthApi from '../koneksi_api/api.js';
import RegisterView from '../views_page/register_view.js';

class RegisterPresenter {
  constructor({ view }) {
    this.view = view;
    this.view.render();
    this.init();
  }

  init() {
    this.view.onRegisterSubmit(this.handleRegister.bind(this));
  }

  async handleRegister(name, email, password) {
    try {
      Swal.fire({
        title: '',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      await AuthApi.register(name, email, password);

      Swal.close();
      Swal.fire({
        icon: 'success',
        title: 'Registrasi Berhasil',
        text: 'Sekarang Anda dapat masuk!',
      });

      window.location.hash = '#/login';
    } catch (error) {
      Swal.close();
      Swal.fire({
        icon: 'error',
        title: 'Registrasi Gagal',
        text: error.message || 'Terjadi kesalahan.',
      });
    }
  }
}

export default RegisterPresenter;
