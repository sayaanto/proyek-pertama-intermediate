import Swal from 'sweetalert2';
import L from 'leaflet';

const DetailView = {
  _map: null,

  render() {
    return `
      <section id="detail" class="detail-page fade-in-up"
        style="display: flex; flex-direction: column; align-items: center; margin: 2rem auto 4rem auto;">
        
        <div class="detail-container"
          style="max-width: 600px; width: 100%; background-color: #1f1f1f; border-radius: 0.75rem; box-shadow: 0 4px 12px rgba(0,0,0,0.4); overflow: hidden;">
          
          <div class="detail-image-container">
            <img id="detail-image" alt="Story Image"
              style="width: 100%; height: auto; object-fit: cover; border-bottom: 1px solid #333;" />
          </div>
          
          <div class="detail-info" style="padding: 1.5rem; color: #f0f0f0;">
            <h2 id="detail-name"
              style="margin-bottom: 0.5rem; font-size: 1.5rem; font-weight: bold;"></h2>
            <p id="detail-description" style="margin-bottom: 1rem;"></p>
            <p style="font-size: 0.9rem; color: #ccc;">
              <strong>Created at:</strong> <span id="detail-createdAt"></span>
            </p>
            <p style="font-size: 0.9rem; color: #ccc;">
              <strong>Location:</strong> <span id="detail-location"></span>
            </p>

            <div class="detail-buttons" style="margin-top: 1.5rem; display: flex; gap: 1rem;">
              <button id="btn-back" style="padding: 0.5rem 1rem; border: none; border-radius: 0.5rem; background-color: #444; color: #fff; cursor: pointer;">← Kembali</button>
              <button id="btn-download" style="padding: 0.5rem 1rem; border: none; border-radius: 0.5rem; background-color: #2c7be5; color: #fff; cursor: pointer;">⬇ Unduh Gambar</button>
            </div>
          </div>
        </div>

        <div id="map"
          style="width: 100%; height: 400px; margin-top: 2rem; max-width: 600px; border-radius: 0.75rem; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.3);"></div>
      </section>
    `;
  },

  showDetail(story) {
    const img = document.getElementById('detail-image');
    img.src = story.photoUrl || 'default-image-placeholder.jpg';  // Default image if none
    img.alt = story.name || 'Story Image';

    document.getElementById('detail-name').textContent = story.name || 'No name';
    document.getElementById('detail-description').textContent = story.description || 'No description';
    document.getElementById('detail-createdAt').textContent = new Date(story.createdAt).toLocaleString('en-GB');

    if (story.lat !== undefined && story.lon !== undefined) {
      document.getElementById('detail-location').textContent = `${story.lat}, ${story.lon}`;
      this.showMap(story.lat, story.lon);
    } else {
      document.getElementById('detail-location').textContent = 'Location not available';
    }

    this.initEventListeners();
  },

  showMap(lat, lon) {
    if (this._map) {
      this._map.remove();
      this._map = null;
    }

    this._map = L.map('map').setView([lat, lon], 14); // Set higher zoom level

    const streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    });

    const satellite = L.tileLayer('https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=2sxrVeV47fFEDxOxOeGS', {
      attribution: '&copy; MapTiler & OpenStreetMap contributors',
    });

    const dark = L.tileLayer('https://api.maptiler.com/maps/darkmatter/{z}/{x}/{y}.png?key=2sxrVeV47fFEDxOxOeGS', {
      attribution: '&copy; MapTiler & OpenStreetMap contributors',
    });

    streets.addTo(this._map);

    L.marker([lat, lon]).addTo(this._map)
      .bindPopup('Location of the Story')
      .openPopup();

    L.control.layers({
      "Streets": streets,
      "Satellite": satellite,
      "Dark Mode": dark,
    }).addTo(this._map);
  },

  initEventListeners() {
    const backBtn = document.getElementById('btn-back');
    const downloadBtn = document.getElementById('btn-download');

    if (backBtn) {
      backBtn.addEventListener('click', () => {
        window.history.back(); // Or window.location.hash = '#/home';
      });
    }

    if (downloadBtn) {
      downloadBtn.addEventListener('click', async () => {
        const img = document.getElementById('detail-image');
        const imageURL = img.src;

        try {
          // Ensure the image URL is CORS-enabled for download
          const response = await fetch(imageURL, { mode: 'cors' });
          if (!response.ok) {
            throw new Error('Failed to fetch image');
          }

          const blob = await response.blob();
          const blobUrl = URL.createObjectURL(blob);

          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = 'story-image.jpg';
          document.body.appendChild(link);
          link.click();
          link.remove();

          URL.revokeObjectURL(blobUrl); // Clean up after download
        } catch (error) {
          console.error('Failed to download image:', error);
          Swal.fire({
            icon: 'error',
            title: 'Download Failed',
            text: 'Unable to download image.',
          });
        }
      });
    }
  },

  showLoginRequired() {
    Swal.fire({
      icon: 'warning',
      title: 'Login Required',
      text: 'Please login first.',
    });
    window.location.hash = '#/login';
  },

  showError(message) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message,
    });
  }
};

export default DetailView;
