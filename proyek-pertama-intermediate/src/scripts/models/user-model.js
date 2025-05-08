// src/models/user-model.js

import axios from 'axios';

const UserModel = {
  async login(email, password) {
    try {
      const response = await axios.post('/login', { email, password });
      if (response.data.error === false) {
        return response.data.loginResult;  // Mengembalikan data login, termasuk token
      }
      return null;  // Jika login gagal
    } catch (error) {
      console.error('Login error:', error);
      return null;  // Return null jika ada error
    }
  },

  async register(name, email, password) {
    try {
      const response = await axios.post('/register', { name, email, password });
      if (response.data.error === false) {
        return response.data.message;  // Mengembalikan pesan jika registrasi berhasil
      }
      return null;  // Jika registrasi gagal
    } catch (error) {
      console.error('Registration error:', error);
      return null;  // Return null jika ada error
    }
  },

  async checkAuth(token) {
    try {
      const response = await axios.get('/user', {
        headers: { Authorization: `Bearer ${token}` }  // Cek apakah token valid
      });
      return response.data.user || null;
    } catch (error) {
      console.error('Auth check error:', error);
      return null;  // Return null jika token tidak valid
    }
  }
};

export default UserModel;
