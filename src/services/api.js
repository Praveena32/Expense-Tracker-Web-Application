/**
 * Centralized API Client
 * Manages baseURL, JSON serialization, and JWT Authorization headers.
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Universal request helper
 */
async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;

  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  let response;
  try {
    response = await fetch(url, config);
  } catch (netErr) {
    throw new Error('Unable to connect to the backend server. Please verify the server is running.');
  }

  // Parse JSON response
  let data;
  try {
    data = await response.json();
  } catch (jsonErr) {
    data = { message: response.statusText };
  }

  if (!response.ok) {
    // If token is invalid or expired, clear local authentication
    if (response.status === 401 && endpoint !== '/auth/login') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }

    const error = new Error(
      data.message || (data.errors && data.errors.join(', ')) || `Request failed with status ${response.status}`
    );
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  get: (endpoint, options) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options) => request(endpoint, { ...options, method: 'POST', body }),
  put: (endpoint, body, options) => request(endpoint, { ...options, method: 'PUT', body }),
  delete: (endpoint, options) => request(endpoint, { ...options, method: 'DELETE' }),
};

export default api;
