import api from './api';

export const authService = {
  /**
   * Register a new user
   * @param {{ name: string, email: string, password: string }} userData
   */
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  },

  /**
   * Log in user with credentials
   * @param {{ email: string, password: string }} credentials
   */
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  },

  /**
   * Fetch current user profile
   */
  async getMe() {
    return await api.get('/auth/me');
  },

  /**
   * Log out user
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  /**
   * Get currently cached user
   */
  getCurrentUser() {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  /**
   * Get JWT token
   */
  getToken() {
    return localStorage.getItem('token');
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!localStorage.getItem('token');
  },
};

export default authService;
