// media-helper.js
import Swal from 'sweetalert2';

export default class MediaHelper {
  constructor(view) {
    this.view = view;
    this.stream = null;
    this.capturedImage = null;
    this.uploadedImage = null;
    this.lat = null;
    this.lon = null;
  }

  async startCamera() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const { video } = this.view.getElements();
      if (video) video.srcObject = this.stream;
    } catch (error) {
      console.error('Camera error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Kesalahan Kamera',
        text: 'Tidak dapat mengakses kamera.',
      });
    }
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }

  captureImage() {
    const { video, canvas } = this.view.getElements();
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    this.view.showSnapshot(canvas);

    canvas.toBlob((blob) => {
      this.capturedImage = blob;
      this.uploadedImage = null;
    }, 'image/jpeg');

    this.stopCamera();
  }

  handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
      this.uploadedImage = file;
      this.capturedImage = null;

      const reader = new FileReader();
      reader.onload = (e) => {
        this.view.updatePreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);

      this.stopCamera();
    }
  }

  initMap() {
    const map = L.map('map-picker').setView([-6.2, 106.816666], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    let marker;
    map.on('click', (e) => {
      this.lat = e.latlng.lat;
      this.lon = e.latlng.lng;
      this.view.updateCoordinates(this.lat, this.lon);

      if (marker) {
        marker.setLatLng(e.latlng);
      } else {
        marker = L.marker(e.latlng).addTo(map);
      }
    });
  }
}
