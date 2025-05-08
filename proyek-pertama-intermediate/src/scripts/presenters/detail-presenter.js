import Swal from 'sweetalert2';
import AuthApi from '../koneksi_api/api.js';

class DetailPresenter {
  constructor({ view }) {
    this.view = view;
    this.token = localStorage.getItem('token');
    this.init();
  }

  async init() {
    try {
      if (!this.token) {
        Swal.fire({
          icon: 'warning',
          title: 'Login Diperlukan',
          text: 'Silakan login terlebih dahulu.',
        });
        window.location.hash = '#/login';
        return;
      }

      const url = window.location.hash.split('/');
      const id = url[url.length - 1];

      const story = await AuthApi.getDetailStory(this.token, id);
      this.view.showDetail(story);
    } catch (error) {
    //   console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Kesalahan',
        text: 'Gagal memuat detail cerita.',
      });
    }
  }
}

export default DetailPresenter;
