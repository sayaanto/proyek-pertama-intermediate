import L from 'leaflet';

const StoryView = {
  _map: null,

  render() {
    return `
      <section id="main-content" tabindex="-1" class="story-feed" style="padding: 1rem;">
        <h2 tabindex="0" style="margin-bottom: 1rem;">Daftar Cerita</h2>
        <div id="story-list" class="story-list" role="list" aria-label="Daftar cerita pengguna"></div>
        <div id="map" style="height: 400px; margin-top: 20px;" aria-label="Peta lokasi cerita"></div>
      </section>
    `;
  },

  showStories(stories) {
    const storyList = document.getElementById('story-list');
    storyList.innerHTML = '';

    // Bersihkan peta sebelumnya jika ada
    if (this._map) {
      this._map.remove();
      this._map = null;
    }

    // Inisialisasi peta
    this._map = L.map('map').setView([-6.200000, 106.816666], 5);

    // Tile layers untuk variasi map
    const streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    });

    const satellite = L.tileLayer('https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=2sxrVeV47fFEDxOxOeGS', {
      attribution: '&copy; MapTiler & OpenStreetMap contributors'
    });

    const dark = L.tileLayer('https://api.maptiler.com/maps/darkmatter/{z}/{x}/{y}.png?key=2sxrVeV47fFEDxOxOeGS', {
      attribution: '&copy; MapTiler & OpenStreetMap contributors'
    });

    // Menambahkan kontrol layer untuk memilih variasi peta
    const layersControl = L.control.layers({
      "Streets": streets,
      "Satellite": satellite,
      "Dark Mode": dark
    }).addTo(this._map);

    // Menambahkan gaya peta default
    streets.addTo(this._map);

    const latLngs = [];

    // Render setiap cerita
    stories.forEach((story) => {
      const storyItem = document.createElement('article');
      storyItem.classList.add('story-item', 'fade-in'); // Tambahkan efek animasi
      storyItem.setAttribute('role', 'listitem');
      storyItem.setAttribute('tabindex', '0');
      storyItem.setAttribute('aria-label', `Cerita oleh ${story.name}`);

      storyItem.innerHTML = `
        <header class="story-header" style="display: flex; align-items: center; gap: 8px;">
          <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(story.name)}"
               alt="Avatar ${story.name}" width="40" height="40" style="border-radius: 50%;" />
          <span class="username" style="font-weight: bold;">${story.name}</span>
        </header>
        
        <div class="story-image" style="margin-top: 8px;">
          <img src="${story.photoUrl}" alt="Foto cerita oleh ${story.name}" loading="lazy"
               style="width: 100%; border-radius: 8px;" />
        </div>
        
        <div class="story-caption" style="margin-top: 10px; word-break: break-word;">
          <p><strong>Nama:</strong> ${story.name}</p>
          <p><strong>Deskripsi:</strong> ${story.description}</p>
          <p><strong>Tanggal:</strong> ${new Date(story.createdAt).toLocaleDateString('id-ID')}</p>
          <div style="margin-top: 10px;">
            <button class="detail-button" data-id="${story.id}" aria-label="Lihat detail cerita dari ${story.name}">
              Lihat Detail
            </button>
          </div>
        </div>
      `;

      storyList.appendChild(storyItem);

      // Tambahkan marker ke peta jika ada koordinat
      if (typeof story.lat === 'number' && typeof story.lon === 'number') {
        const marker = L.marker([story.lat, story.lon]).addTo(this._map);
        marker.bindPopup(`<strong>${story.name}</strong><br/>${story.description}`).openPopup();

        // Tutup popup setelah 1.5 detik
        setTimeout(() => marker.closePopup(), 1500);

        latLngs.push([story.lat, story.lon]);
      }
    });

    // Zoom agar semua marker terlihat
    if (latLngs.length > 0) {
      const bounds = L.latLngBounds(latLngs);
      if (bounds.isValid()) {
        this._map.fitBounds(bounds);
      } else {
        console.error('Invalid bounds:', latLngs);
      }
    }

    // Bind listeners setelah stories ditampilkan
    this.bindDetailButtonListeners();
  },

  bindDetailButtonListeners() {
    const detailButtons = document.querySelectorAll('.detail-button');
    detailButtons.forEach((button) => {
      button.addEventListener('click', (event) => {
        event.stopPropagation();
        const id = button.dataset.id;
        if (id) {
          window.location.hash = `#/stories/${id}`;
        }
      });
    });
  },
};

export default StoryView;
