import api from './client.js';

const get = (url, config) => api.get(url, config).then((r) => r.data);
const post = (url, body, config) => api.post(url, body, config).then((r) => r.data);
const put = (url, body, config) => api.put(url, body, config).then((r) => r.data);
const del = (url, config) => api.delete(url, config).then((r) => r.data);

const toFormData = (object) => {
  const formData = new FormData();
  Object.entries(object).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    if (Array.isArray(value)) {
      value.forEach((v) => formData.append(key, v));
    } else {
      formData.append(key, value);
    }
  });
  return formData;
};

export const authApi = {
  register: (data) => post('/auth/register', data),
  login: (data) => post('/auth/login', data),
  logout: () => post('/auth/logout'),
  getMe: () => get('/auth/me'),
  updateProfile: (data) => put('/auth/profile', data),
  updatePassword: (data) => put('/auth/password', data),
  updateVetProfile: (data) => put('/auth/vet-profile', data),
  updateShelterProfile: (data) => put('/auth/shelter-profile', data),
};

export const userApi = {
  getAll: (params) => get('/users', { params }),
  getById: (id) => get(`/users/${id}`),
  update: (id, data) => put(`/users/${id}`, data),
  deactivate: (id) => put(`/users/${id}/deactivate`),
  activate: (id) => put(`/users/${id}/activate`),
  remove: (id) => del(`/users/${id}`),
  publicVets: (params) => get('/users/veterinarians/public', { params }),
  publicVetById: (id) => get(`/users/veterinarians/public/${id}`),
  publicShelters: (params) => get('/users/shelters/public', { params }),
};

export const petApi = {
  getAll: (params) => get('/pets', { params }),
  getMy: () => get('/pets/my'),
  getById: (id) => get(`/pets/${id}`),
  create: (data) => post('/pets', toFormData(data), { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => put(`/pets/${id}`, toFormData(data), { headers: { 'Content-Type': 'multipart/form-data' } }),
  remove: (id) => del(`/pets/${id}`),
  addToGallery: (id, file) => {
    const fd = new FormData();
    if (file instanceof File) fd.append('image', file);
    else fd.append('imageUrl', file);
    return post(`/pets/${id}/gallery`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  getVetPets: () => get('/pets/vet'),
};

export const healthApi = {
  getForPet: (petId) => get(`/health-records/pet/${petId}`),
  getById: (id) => get(`/health-records/${id}`),
  create: (petId, data) => post(`/health-records/pet/${petId}`, toFormData(data), { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => put(`/health-records/${id}`, toFormData(data), { headers: { 'Content-Type': 'multipart/form-data' } }),
  remove: (id) => del(`/health-records/${id}`),
  timeline: (petId) => get(`/health-records/timeline/${petId}`),
  getVetRecords: (petId) => get(`/health-records/vet/${petId}`),
  getMy: (params) => get('/health-records/my', { params }),
};

export const appointmentApi = {
  getAll: (params) => get('/appointments', { params }),
  getById: (id) => get(`/appointments/${id}`),
  create: (data) => post('/appointments', data),
  updateStatus: (id, data) => put(`/appointments/${id}/status`, data),
  availability: (params) => get('/appointments/availability', { params }),
};

export const productApi = {
  getAll: (params) => get('/products', { params }),
  getById: (id) => get(`/products/${id}`),
  create: (data) => post('/products', toFormData(data), { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => put(`/products/${id}`, toFormData(data), { headers: { 'Content-Type': 'multipart/form-data' } }),
  remove: (id) => del(`/products/${id}`),
  toggle: (id) => put(`/products/${id}/toggle`),
  toggleCategory: (id) => put(`/products/categories/${id}/toggle`),
  getCategories: () => get('/products/categories'),
  getCategory: (id) => get(`/products/categories/${id}`),
  createCategory: (data) => post('/products/categories', toFormData(data), { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateCategory: (id, data) => put(`/products/categories/${id}`, toFormData(data), { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteCategory: (id) => del(`/products/categories/${id}`),
};

export const storeApi = {
  getCart: () => get('/store/cart'),
  addToCart: (data) => post('/store/cart/items', data),
  updateCartItem: (data) => put('/store/cart/items', data),
  removeFromCart: (productId) => del(`/store/cart/items/${productId}`),
  clearCart: () => del('/store/cart'),
  createOrder: (data) => post('/store/orders', data),
  getOrders: (params) => get('/store/orders', { params }),
  getOrderById: (id) => get(`/store/orders/${id}`),
  updateOrderStatus: (id, status) => put(`/store/orders/${id}/status`, { status }),
  cancelOrder: (id) => put(`/store/orders/${id}/cancel`),
};

export const adoptionApi = {
  getAll: (params) => get('/adoptions', { params }),
  getById: (id) => get(`/adoptions/${id}`),
  create: (data) => post('/adoptions', toFormData(data), { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => put(`/adoptions/${id}`, toFormData(data), { headers: { 'Content-Type': 'multipart/form-data' } }),
  remove: (id) => del(`/adoptions/${id}`),
  addCare: (id, data) => put(`/adoptions/${id}/care`, data),
  submitInterest: (id, data) => post(`/adoptions/${id}/interest`, data),
  updateInterest: (id, data) => put(`/adoptions/${id}/interest`, data),
  markAdopted: (id) => put(`/adoptions/${id}/adopted`),
  getMine: () => get('/adoptions/mine/shelter'),
};

export const reviewApi = {
  getAll: (params) => get('/reviews', { params }),
  create: (data) => post('/reviews', data),
  update: (id, data) => put(`/reviews/${id}`, data),
  remove: (id) => del(`/reviews/${id}`),
  manageAll: (params) => get('/reviews/manage/all', { params }),
  updateStatus: (id, status) => put(`/reviews/manage/${id}`, { status }),
};

export const notificationApi = {
  getAll: (params) => get('/notifications', { params }),
  unreadCount: () => get('/notifications/unread-count'),
  markRead: (id) => put(`/notifications/${id}/read`),
  markAllRead: () => put('/notifications/read-all'),
  remove: (id) => del(`/notifications/${id}`),
  send: (data) => post('/notifications/send', data),
};

export const careApi = {
  getArticles: (params) => get('/care/articles', { params }),
  manageArticles: (params) => get('/care/articles/manage/all', { params }),
  getArticle: (id) => get(`/care/articles/${id}`),
  createArticle: (data) => post('/care/articles', toFormData(data), { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateArticle: (id, data) => put(`/care/articles/${id}`, toFormData(data), { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteArticle: (id) => del(`/care/articles/${id}`),
  getFaqs: (params) => get('/care/faqs', { params }),
  manageFaqs: () => get('/care/faqs/manage'),
  createFaq: (data) => post('/care/faqs', data),
  updateFaq: (id, data) => put(`/care/faqs/${id}`, data),
  deleteFaq: (id) => del(`/care/faqs/${id}`),
  getVideos: (params) => get('/care/videos', { params }),
  getVideo: (id) => get(`/care/videos/${id}`),
  createVideo: (data) => post('/care/videos', data),
  updateVideo: (id, data) => put(`/care/videos/${id}`, data),
  deleteVideo: (id) => del(`/care/videos/${id}`),
};

export const contactApi = {
  submit: (data) => post('/contact', data),
  getAll: () => get('/contact'),
  updateStatus: (id, status) => put(`/contact/${id}/status`, { status }),
  remove: (id) => del(`/contact/${id}`),
};

export const dashboardApi = {
  admin: () => get('/dashboard/admin'),
  owner: () => get('/dashboard/owner'),
  vet: () => get('/dashboard/veterinarian'),
  shelter: () => get('/dashboard/shelter'),
};