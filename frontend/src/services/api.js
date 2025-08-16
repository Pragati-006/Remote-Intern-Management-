// frontend/src/services/api.js
import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

// Attach token from localStorage for protected routes
API.interceptors.request.use((req) => {
  const user = localStorage.getItem('user');
  if (user) {
    req.headers.Authorization = `Bearer ${JSON.parse(user).token}`;
  }
  return req;
});

export default API;

/** ========= AUTH ========= */
export const login = (email, password) => API.post('/users/login', { email, password });

export const register = (name, email, password, role = 'manager') => API.post('/users/register', { name, email, password, role });


/** ========= INTERNS ========= */
export const fetchInterns = () => API.get('/interns');
export const createIntern = (data) => API.post('/interns', data);
export const updateIntern = (id, data) => API.put(`/interns/${id}`, data);
export const deleteIntern = (id) => API.delete(`/interns/${id}`);

/** ========= TASKS ========= */
export const fetchTasks = (internId) =>
  API.get(`/tasks${internId ? `?internId=${internId}` : ''}`);
export const createTask = (data) => API.post('/tasks', data);
export const updateTask = (id, data) => API.put(`/tasks/${id}`, data);
export const deleteTask = (id) => API.delete(`/tasks/${id}`);

/** ========= ATTENDANCE ========= */
export const markAttendance = (data) => API.post('/attendance', data);
export const fetchAttendanceReport = (internId) =>
  API.get(`/attendance/report?internId=${internId}`);
export const deleteAttendance = (id) => API.delete(`/attendance/${id}`);

/** ========= EVALUATIONS ========= */
export const submitEvaluation = (data) => API.post('/evaluations', data);
export const fetchPerformanceReport = (internId) =>
  API.get(`/evaluations/report?internId=${internId}`);
export const deleteEvaluation = (id) => API.delete(`/evaluations/${id}`);


