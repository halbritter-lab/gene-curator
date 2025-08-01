import apiClient from './client.js'

export const genesAPI = {
  async getGenes(params = {}) {
    const response = await apiClient.get('/genes/', { params })
    return response.data
  },

  async searchGenes(searchParams) {
    const response = await apiClient.post('/genes/search', searchParams)
    return response.data
  },

  async getGeneById(geneId) {
    const response = await apiClient.get(`/genes/${geneId}`)
    return response.data
  },

  async getGeneByHgnc(hgncId) {
    const response = await apiClient.get(`/genes/hgnc/${hgncId}`)
    return response.data
  },

  async createGene(geneData) {
    const response = await apiClient.post('/genes/', geneData)
    return response.data
  },

  async updateGene(geneId, geneData) {
    const response = await apiClient.put(`/genes/${geneId}`, geneData)
    return response.data
  },

  async deleteGene(geneId) {
    const response = await apiClient.delete(`/genes/${geneId}`)
    return response.data
  },

  async bulkCreateGenes(genes) {
    const response = await apiClient.post('/genes/bulk', { genes })
    return response.data
  },

  async getGeneHistory(geneId) {
    const response = await apiClient.get(`/genes/${geneId}/history`)
    return response.data
  },

  async getGeneStatistics() {
    const response = await apiClient.get('/genes/statistics')
    return response.data
  },

  async getGeneSummary() {
    const response = await apiClient.get('/genes/summary')
    return response.data
  }
}
