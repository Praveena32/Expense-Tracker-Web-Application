import api from './api';

export const budgetService = {
  /**
   * Get all category budgets for a given month & year
   * @param {{ month?: number, year?: number }} params
   */
  async getBudgets(params = {}) {
    const searchParams = new URLSearchParams();
    if (params.month !== undefined) searchParams.append('month', params.month);
    if (params.year !== undefined) searchParams.append('year', params.year);
    const queryString = searchParams.toString();
    const endpoint = `/budgets${queryString ? `?${queryString}` : ''}`;
    return await api.get(endpoint);
  },

  /**
   * Get budget by ID
   */
  async getBudgetById(id) {
    return await api.get(`/budgets/${id}`);
  },

  /**
   * Create or update budget
   * @param {{ category: string, amount: number, month?: number, year?: number }} data
   */
  async createBudget(data) {
    return await api.post('/budgets', data);
  },

  /**
   * Update budget
   * @param {string} id
   * @param {Object} data
   */
  async updateBudget(id, data) {
    return await api.put(`/budgets/${id}`, data);
  },

  /**
   * Delete budget
   * @param {string} id
   */
  async deleteBudget(id) {
    return await api.delete(`/budgets/${id}`);
  },
};

export default budgetService;
