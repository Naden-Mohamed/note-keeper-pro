import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3003',
  withCredentials: true
});

// Add auth token to requests

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


export default API;

// Named exports instead of default export
export const fetchNotes = (params = {}) => API.get('/notes', { params });
export const fetchNoteById = (id) => API.get(`/notes/${id}`);
export const createNote = (newNote) => API.post('/notes', newNote);
export const updateNote = (id, updatedNote) => API.patch(`/notes/${id}`, updatedNote);
export const deleteNote = (id) => API.delete(`/notes/${id}`);
export const fetchUsers = () => API.get('/users');
export const shareNote = (noteId, data) => API.post(`/notes/${noteId}/share`, data);
export const getNoteVersions = (noteId) => API.get(`/notes/${noteId}/versions`);
export const restoreVersion = (noteId, data) => API.post(`/notes/${noteId}/restore`, data);
export const archiveNote = (id) => API.patch(`/notes/${id}/archive`);
export const signIn = (formData) => API.post('/auth/signin', formData);
export const signUp = (formData) => API.post('/auth/signup', formData);
