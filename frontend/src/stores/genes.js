import { defineStore } from 'pinia'
import { genesAPI } from '@/api'

export const useGenesStore = defineStore('genes', {
  state: () => ({
    genes: [],
    currentGene: null,
    geneHistory: [],
    statistics: null,
    summary: [],
    searchResults: null,
    loading: false,
    error: null,
    pagination: {
      page: 1,
      per_page: 20,
      total: 0,
      pages: 0
    },
    searchParams: {
      query: '',
      gene_family: '',
      chromosome: '',
      sort_by: 'approved_symbol',
      sort_order: 'asc'
    }
  }),

  getters: {
    getGeneById: (state) => (id) => {
      return state.genes.find(gene => gene.id === id)
    },
    
    getGeneByHgnc: (state) => (hgncId) => {
      return state.genes.find(gene => gene.hgnc_id === hgncId)
    },

    filteredGenes: (state) => {
      if (!state.searchResults) return state.genes
      return state.searchResults.genes || []
    },

    totalGenes: (state) => {
      return state.searchResults?.total || state.pagination.total
    },

    hasNextPage: (state) => {
      return state.pagination.page < state.pagination.pages
    },

    hasPrevPage: (state) => {
      return state.pagination.page > 1
    }
  },

  actions: {
    async fetchGenes(params = {}) {
      try {
        this.loading = true
        this.error = null

        const queryParams = {
          page: params.page || this.pagination.page,
          per_page: params.per_page || this.pagination.per_page,
          sort_by: params.sort_by || this.searchParams.sort_by,
          sort_order: params.sort_order || this.searchParams.sort_order
        }

        const response = await genesAPI.getGenes(queryParams)
        
        this.genes = response.genes
        this.pagination = {
          page: response.page,
          per_page: response.per_page,
          total: response.total,
          pages: response.pages
        }

        return response
      } catch (error) {
        this.error = error.response?.data?.detail || 'Failed to fetch genes'
        throw error
      } finally {
        this.loading = false
      }
    },

    async searchGenes(searchParams = {}) {
      try {
        this.loading = true
        this.error = null

        const params = {
          ...this.searchParams,
          ...searchParams
        }

        this.searchParams = params
        const response = await genesAPI.searchGenes(params)
        
        this.searchResults = response
        
        return response
      } catch (error) {
        this.error = error.response?.data?.detail || 'Search failed'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchGeneById(geneId) {
      try {
        this.loading = true
        this.error = null

        const response = await genesAPI.getGeneById(geneId)
        this.currentGene = response
        
        return response
      } catch (error) {
        this.error = error.response?.data?.detail || 'Failed to fetch gene'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchGeneByHgnc(hgncId) {
      try {
        this.loading = true
        this.error = null

        const response = await genesAPI.getGeneByHgnc(hgncId)
        this.currentGene = response
        
        return response
      } catch (error) {
        this.error = error.response?.data?.detail || 'Failed to fetch gene'
        throw error
      } finally {
        this.loading = false
      }
    },

    async createGene(geneData) {
      try {
        this.loading = true
        this.error = null

        const response = await genesAPI.createGene(geneData)
        
        // Add to local state
        this.genes.unshift(response)
        this.pagination.total += 1
        
        return response
      } catch (error) {
        this.error = error.response?.data?.detail || 'Failed to create gene'
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateGene(geneId, geneData) {
      try {
        this.loading = true
        this.error = null

        const response = await genesAPI.updateGene(geneId, geneData)
        
        // Update local state
        const index = this.genes.findIndex(gene => gene.id === geneId)
        if (index !== -1) {
          this.genes[index] = response
        }
        
        if (this.currentGene?.id === geneId) {
          this.currentGene = response
        }
        
        return response
      } catch (error) {
        this.error = error.response?.data?.detail || 'Failed to update gene'
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteGene(geneId) {
      try {
        this.loading = true
        this.error = null

        await genesAPI.deleteGene(geneId)
        
        // Remove from local state
        this.genes = this.genes.filter(gene => gene.id !== geneId)
        this.pagination.total -= 1
        
        if (this.currentGene?.id === geneId) {
          this.currentGene = null
        }
        
        return true
      } catch (error) {
        this.error = error.response?.data?.detail || 'Failed to delete gene'
        throw error
      } finally {
        this.loading = false
      }
    },

    async bulkCreateGenes(genes) {
      try {
        this.loading = true
        this.error = null

        const response = await genesAPI.bulkCreateGenes(genes)
        
        // Refresh the genes list after bulk creation
        await this.fetchGenes()
        
        return response
      } catch (error) {
        this.error = error.response?.data?.detail || 'Bulk creation failed'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchGeneHistory(geneId) {
      try {
        this.loading = true
        this.error = null

        const response = await genesAPI.getGeneHistory(geneId)
        this.geneHistory = response
        
        return response
      } catch (error) {
        this.error = error.response?.data?.detail || 'Failed to fetch gene history'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchStatistics() {
      try {
        const response = await genesAPI.getGeneStatistics()
        this.statistics = response
        
        return response
      } catch (error) {
        this.error = error.response?.data?.detail || 'Failed to fetch statistics'
        throw error
      }
    },

    async fetchSummary() {
      try {
        const response = await genesAPI.getGeneSummary()
        this.summary = response
        
        return response
      } catch (error) {
        this.error = error.response?.data?.detail || 'Failed to fetch summary'
        throw error
      }
    },

    // Navigation helpers
    async nextPage() {
      if (this.hasNextPage) {
        this.pagination.page += 1
        await this.fetchGenes()
      }
    },

    async prevPage() {
      if (this.hasPrevPage) {
        this.pagination.page -= 1
        await this.fetchGenes()
      }
    },

    async setPage(page) {
      this.pagination.page = page
      await this.fetchGenes()
    },

    async setSorting(sortBy, sortOrder = 'asc') {
      this.searchParams.sort_by = sortBy
      this.searchParams.sort_order = sortOrder
      this.pagination.page = 1
      
      if (this.searchResults) {
        await this.searchGenes()
      } else {
        await this.fetchGenes()
      }
    },

    clearSearch() {
      this.searchResults = null
      this.searchParams = {
        query: '',
        gene_family: '',
        chromosome: '',
        sort_by: 'approved_symbol',
        sort_order: 'asc'
      }
      this.pagination.page = 1
    },

    clearError() {
      this.error = null
    },

    clearCurrentGene() {
      this.currentGene = null
      this.geneHistory = []
    }
  }
})