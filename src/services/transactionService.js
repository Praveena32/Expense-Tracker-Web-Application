import api from './api';

export const transactionService = {
  /**
   * Get all transactions with optional filters
   * @param {Object} params - { type, category, search, month, year, startDate, endDate, page, limit }
   */
  async getTransactions(params = {}) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '' && value !== 'all') {
        searchParams.append(key, value);
      }
    });
    const queryString = searchParams.toString();
    const endpoint = `/transactions${queryString ? `?${queryString}` : ''}`;
    return await api.get(endpoint);
  },

  /**
   * Get single transaction by ID
   */
  async getTransactionById(id) {
    return await api.get(`/transactions/${id}`);
  },

  /**
   * Create a new transaction
   * @param {{ type: 'income'|'expense', amount: number, category: string, description: string, date?: string }} data
   */
  async createTransaction(data) {
    return await api.post('/transactions', data);
  },

  /**
   * Update existing transaction
   * @param {string} id
   * @param {Object} data
   */
  async updateTransaction(id, data) {
    return await api.put(`/transactions/${id}`, data);
  },

  /**
   * Delete transaction
   * @param {string} id
   */
  async deleteTransaction(id) {
    return await api.delete(`/transactions/${id}`);
  },
};

export default transactionService;
