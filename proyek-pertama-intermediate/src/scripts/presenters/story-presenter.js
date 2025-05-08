import Swal from 'sweetalert2';
import AuthApi from '../koneksi_api/api.js';
import StoryView from '../views_page/story_view.js';

class StoryPresenter {
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

      const stories = await AuthApi.getStories(this.token);
      this.view.showStories(stories);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal Memuat Cerita',
        text: 'Terjadi masalah saat memuat cerita.',
      });
    }
  }
}

export default StoryPresenter;
