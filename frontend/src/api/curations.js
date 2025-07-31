import apiClient from './client.js'

export const curationsAPI = {
  /**
   * Get all curations with pagination
   */
  async getCurations(params = {}) {
    const response = await apiClient.get('/curations', { params })
    return response.data
  },

  /**
   * Search curations with filters
   */
  async searchCurations(searchParams) {
    const response = await apiClient.post('/curations/search', searchParams)
    return response.data
  },

  /**
   * Get curation statistics
   */
  async getCurationStatistics() {
    const response = await apiClient.get('/curations/statistics')
    return response.data
  },

  /**
   * Get curation summary list
   */
  async getCurationSummary(limit = 100) {
    const response = await apiClient.get('/curations/summary', { 
      params: { limit } 
    })
    return response.data
  },

  /**
   * Get curations by gene ID
   */
  async getCurationsByGene(geneId) {
    const response = await apiClient.get(`/curations/gene/${geneId}`)
    return response.data
  },

  /**
   * Get curations by verdict
   */
  async getCurationsByVerdict(verdict) {
    const response = await apiClient.get(`/curations/verdict/${verdict}`)
    return response.data
  },

  /**
   * Get a specific curation by ID
   */
  async getCurationById(curationId) {
    const response = await apiClient.get(`/curations/${curationId}`)
    return response.data
  },

  /**
   * Get detailed score summary for a curation
   */
  async getCurationScoreSummary(curationId) {
    const response = await apiClient.get(`/curations/${curationId}/score-summary`)
    return response.data
  },

  /**
   * Create a new curation
   */
  async createCuration(curationData) {
    const response = await apiClient.post('/curations', curationData)
    return response.data
  },

  /**
   * Update curation
   */
  async updateCuration(curationId, curationData) {
    const response = await apiClient.put(`/curations/${curationId}`, curationData)
    return response.data
  },

  /**
   * Delete curation
   */
  async deleteCuration(curationId) {
    const response = await apiClient.delete(`/curations/${curationId}`)
    return response.data
  },

  /**
   * Perform workflow action on curation
   */
  async curationWorkflowAction(curationId, action) {
    const response = await apiClient.post(`/curations/${curationId}/workflow`, action)
    return response.data
  },

  /**
   * Get curation change history
   */
  async getCurationHistory(curationId) {
    const response = await apiClient.get(`/curations/${curationId}/history`)
    return response.data
  },

  /**
   * Get score distribution analytics
   */
  async getScoreDistribution() {
    const response = await apiClient.get('/curations/analytics/score-distribution')
    return response.data
  }
}

export default curationsAPI