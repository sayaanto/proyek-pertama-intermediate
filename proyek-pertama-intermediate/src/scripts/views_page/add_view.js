// File: AddForm.js (View)
const AddForm = {
  render() {
    return `
      <section class="add-story">
        <h2>Add New Story</h2>
        <form id="add-story-form" enctype="multipart/form-data">
          <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" required placeholder="Tell your story..."></textarea>
          </div>
          <div class="form-group">
            <label for="upload-file">Upload from Gallery</label>
            <input type="file" id="upload-file" accept="image/*" />
            <img id="image-preview" style="display:none; margin-top:10px; max-width:100%; border-radius:10px;" alt="Image Preview" />
          </div>
          <div class="form-group">
            <label>Capture Image from Camera</label>
            <video id="camera-stream" autoplay playsinline class="responsive-media"></video>
            <button type="button" id="capture-btn" class="capture-button" style="margin-top:10px;">📸 Capture</button>
            <canvas id="snapshot" class="responsive-media" style="display:none;"></canvas>
          </div>
          <div class="form-group">
            <label>Choose Location</label>
            <div id="map-picker" style="height: 300px; border-radius: 10px; overflow: hidden;"></div>
            <p id="location-coordinates" style="text-align:center; font-size: 0.9rem; color: #555;"></p>
          </div>
          <button type="submit" class="submit-button">🚀 Submit Story</button>
        </form>
      </section>
    `;
  },

  bindEvents({ onSubmit, onCapture, onUpload }) {
    document.getElementById('add-story-form').addEventListener('submit', onSubmit);
    document.getElementById('capture-btn').addEventListener('click', onCapture);
    document.getElementById('upload-file').addEventListener('change', onUpload);
  },

  updatePreviewImage(src) {
    const preview = document.getElementById('image-preview');
    preview.src = src;
    preview.style.display = 'block';
    document.getElementById('snapshot').style.display = 'none';
  },

  showSnapshot(canvas) {
    canvas.style.display = 'block';
    document.getElementById('image-preview').style.display = 'none';
  },

  updateCoordinates(lat, lon) {
    document.getElementById('location-coordinates').textContent = `Lat: ${lat.toFixed(5)}, Lng: ${lon.toFixed(5)}`;
  },

  getElements() {
    return {
      form: document.getElementById('add-story-form'),
      video: document.getElementById('camera-stream'),
      canvas: document.getElementById('snapshot'),
      fileInput: document.getElementById('upload-file'),
      preview: document.getElementById('image-preview'),
      description: document.getElementById('description'),
    };
  },

  addPageTransition() {
    const section = document.querySelector('.add-story');
    const animation = section.animate(
      [
        { opacity: 0, transform: 'translateY(100px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ],
      {
        duration: 500,
        easing: 'ease-out',
      }
    );
    animation.play();
  },
};

export default AddForm;
