import api from './api';

export const dashboardService = {
  /**
   * Fetch authenticated user's financial dashboard summary, charts, and metrics
   */
  async getDashboardData() {
    const response = await api.get('/dashboard');
    return response.data;
  },
};

export default dashboardService;
