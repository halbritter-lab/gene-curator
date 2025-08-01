import apiClient from './client.js'

export const precurationsAPI = {
  /**
   * Get all precurations with pagination
   */
  async getPrecurations(params = {}) {
    const response = await apiClient.get('/precurations/', { params })
    return response.data
  },

  /**
   * Search precurations with filters
   */
  async searchPrecurations(searchParams) {
    const response = await apiClient.post('/precurations/search', searchParams)
    return response.data
  },

  /**
   * Get precuration statistics
   */
  async getPrecurationStatistics() {
    const response = await apiClient.get('/precurations/statistics')
    return response.data
  },

  /**
   * Get precuration summary list
   */
  async getPrecurationSummary(limit = 100) {
    const response = await apiClient.get('/precurations/summary', { 
      params: { limit } 
    })
    return response.data
  },

  /**
   * Get precurations by gene ID
   */
  async getPrecurationsByGene(geneId) {
    const response = await apiClient.get(`/precurations/gene/${geneId}`)
    return response.data
  },

  /**
   * Get a specific precuration by ID
   */
  async getPrecurationById(precurationId) {
    const response = await apiClient.get(`/precurations/${precurationId}`)
    return response.data
  },

  /**
   * Create a new precuration
   */
  async createPrecuration(precurationData) {
    const response = await apiClient.post('/precurations/', precurationData)
    return response.data
  },

  /**
   * Update precuration
   */
  async updatePrecuration(precurationId, precurationData) {
    const response = await apiClient.put(`/precurations/${precurationId}`, precurationData)
    return response.data
  },

  /**
   * Delete precuration
   */
  async deletePrecuration(precurationId) {
    const response = await apiClient.delete(`/precurations/${precurationId}`)
    return response.data
  },

  /**
   * Perform workflow action on precuration
   */
  async precurationWorkflowAction(precurationId, action) {
    const response = await apiClient.post(`/precurations/${precurationId}/workflow`, action)
    return response.data
  },

  /**
   * Get precuration change history
   */
  async getPrecurationHistory(precurationId) {
    const response = await apiClient.get(`/precurations/${precurationId}/history`)
    return response.data
  }
}

export default precurationsAPI