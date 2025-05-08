import Swal from 'sweetalert2';
import AuthApi from '../koneksi_api/api.js';
import MediaHelper from './media-helper.js';

class AddPresenter {
  constructor({ view }) {
    this.view = view;
    this.token = localStorage.getItem('token');
    this.mediaHelper = new MediaHelper(view);

    this.init();
  }

  init() {
    this.view.bindEvents({
      onSubmit: (e) => this.handleSubmit(e),
      onCapture: () => this.mediaHelper.captureImage(),
      onUpload: (e) => this.mediaHelper.handleFileUpload(e),
    });

    window.addEventListener('hashchange', () => this.mediaHelper.stopCamera());

    this.mediaHelper.startCamera();
    this.mediaHelper.initMap();
  }

  async handleSubmit(e) {
    e.preventDefault();
    const { description } = this.view.getElements();
    const desc = description.value.trim();
    const imageToUpload = this.mediaHelper.uploadedImage || this.mediaHelper.capturedImage;

    if (!desc) {
      Swal.fire({
        icon: 'warning',
        title: 'Deskripsi Diperlukan',
        text: 'Silakan masukkan deskripsi.',
      });
      return;
    }

    if (!imageToUpload) {
      Swal.fire({
        icon: 'warning',
        title: 'Gambar Diperlukan',
        text: 'Silakan ambil atau unggah gambar terlebih dahulu.',
      });
      return;
    }

    try {
      await AuthApi.addNewStory(this.token, {
        description: desc,
        photo: imageToUpload,
        lat: this.mediaHelper.lat,
        lon: this.mediaHelper.lon,
      });

      this.mediaHelper.stopCamera();

      Swal.fire({
        title: 'Cerita Ditambahkan',
        text: 'Cerita Anda telah berhasil ditambahkan!',
        icon: 'success',
        showClass: {
          popup: 'animate__animated animate__fadeInDown',
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp',
        },
      });
    } catch (error) {
      console.error('Submit Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Kesalahan',
        text: `Gagal menambahkan cerita: ${error.message}`,
      });
    }
  }
}

export default AddPresenter;
