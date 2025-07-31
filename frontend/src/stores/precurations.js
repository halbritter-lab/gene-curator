import { defineStore } from 'pinia'
import { precurationsAPI } from '@/api'

export const usePrecurationsStore = defineStore('precurations', {
  state: () => ({
    precurations: [],
    currentPrecuration: null,
    precurationHistory: [],
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
      gene_id: null,
      mondo_id: '',
      lumping_splitting_decision: null,
      status: null,
      sort_by: 'created_at',
      sort_order: 'desc'
    }
  }),

  getters: {
    getPrecurationById: (state) => (id) => {
      return state.precurations.find(precuration => precuration.id === id)
    },
    
    getPrecurationsByGene: (state) => (geneId) => {
      return state.precurations.filter(precuration => precuration.gene_id === geneId)
    },

    filteredPrecurations: (state) => {
      if (!state.searchResults) return state.precurations
      return state.searchResults.precurations || []
    },

    totalPrecurations: (state) => {
      return state.searchResults?.total || state.pagination.total
    },

    hasNextPage: (state) => {
      return state.pagination.page < state.pagination.pages
    },

    hasPrevPage: (state) => {
      return state.pagination.page > 1
    },

    pendingPrecurations: (state) => {
      return state.precurations.filter(p => 
        ['Draft', 'In_Primary_Review', 'In_Secondary_Review'].includes(p.status)
      )
    }
  },

  actions: {
    async fetchPrecurations(params = {}) {
      try {
        this.loading = true
        this.error = null

        const queryParams = {
          page: params.page || this.pagination.page,
          per_page: params.per_page || this.pagination.per_page,
          sort_by: params.sort_by || this.searchParams.sort_by,
          sort_order: params.sort_order || this.searchParams.sort_order
        }

        const response = await precurationsAPI.getPrecurations(queryParams)
        
        this.precurations = response.precurations
        this.pagination = {
          page: response.page,
          per_page: response.per_page,
          total: response.total,
          pages: response.pages
        }

        return response
      } catch (error) {
        this.error = error.response?.data?.detail || 'Failed to fetch precurations'
        throw error
      } finally {
        this.loading = false
      }
    },

    async searchPrecurations(searchParams = {}) {
      try {
        this.loading = true
        this.error = null

        const params = {
          ...this.searchParams,
          ...searchParams
        }

        this.searchParams = params
        const response = await precurationsAPI.searchPrecurations(params)
        
        this.searchResults = response
        
        return response
      } catch (error) {
        this.error = error.response?.data?.detail || 'Search failed'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchPrecurationById(precurationId) {
      try {
        this.loading = true
        this.error = null

        const response = await precurationsAPI.getPrecurationById(precurationId)
        this.currentPrecuration = response
        
        return response
      } catch (error) {
        this.error = error.response?.data?.detail || 'Failed to fetch precuration'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchPrecurationsByGene(geneId) {
      try {
        this.loading = true
        this.error = null

        const response = await precurationsAPI.getPrecurationsByGene(geneId)
        // Update local state with gene-specific precurations
        const existingIds = new Set(this.precurations.map(p => p.id))
        const newPrecurations = response.filter(p => !existingIds.has(p.id))
        this.precurations.push(...newPrecurations)
        
        return response
      } catch (error) {
        this.error = error.response?.data?.detail || 'Failed to fetch precurations'
        throw error
      } finally {
        this.loading = false
      }
    },

    async createPrecuration(precurationData) {
      try {
        this.loading = true
        this.error = null

        const response = await precurationsAPI.createPrecuration(precurationData)
        
        // Add to local state
        this.precurations.unshift(response)
        this.pagination.total += 1
        
        return response
      } catch (error) {
        this.error = error.response?.data?.detail || 'Failed to create precuration'
        throw error
      } finally {
        this.loading = false
      }
    },

    async updatePrecuration(precurationId, precurationData) {
      try {
        this.loading = true
        this.error = null

        const response = await precurationsAPI.updatePrecuration(precurationId, precurationData)
        
        // Update local state
        const index = this.precurations.findIndex(p => p.id === precurationId)
        if (index !== -1) {
          this.precurations[index] = response
        }
        
        if (this.currentPrecuration?.id === precurationId) {
          this.currentPrecuration = response
        }
        
        return response
      } catch (error) {
        this.error = error.response?.data?.detail || 'Failed to update precuration'
        throw error
      } finally {
        this.loading = false
      }
    },

    async deletePrecuration(precurationId) {
      try {
        this.loading = true
        this.error = null

        await precurationsAPI.deletePrecuration(precurationId)
        
        // Remove from local state
        this.precurations = this.precurations.filter(p => p.id !== precurationId)
        this.pagination.total -= 1
        
        if (this.currentPrecuration?.id === precurationId) {
          this.currentPrecuration = null
        }
        
        return true
      } catch (error) {
        this.error = error.response?.data?.detail || 'Failed to delete precuration'
        throw error
      } finally {
        this.loading = false
      }
    },

    async workflowAction(precurationId, action) {
      try {
        this.loading = true
        this.error = null

        const response = await precurationsAPI.precurationWorkflowAction(precurationId, action)
        
        // Update local state
        const index = this.precurations.findIndex(p => p.id === precurationId)
        if (index !== -1) {
          this.precurations[index] = response
        }
        
        if (this.currentPrecuration?.id === precurationId) {
          this.currentPrecuration = response
        }
        
        return response
      } catch (error) {
        this.error = error.response?.data?.detail || 'Workflow action failed'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchPrecurationHistory(precurationId) {
      try {
        this.loading = true
        this.error = null

        const response = await precurationsAPI.getPrecurationHistory(precurationId)
        this.precurationHistory = response.history
        
        return response
      } catch (error) {
        this.error = error.response?.data?.detail || 'Failed to fetch precuration history'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchStatistics() {
      try {
        const response = await precurationsAPI.getPrecurationStatistics()
        this.statistics = response
        
        return response
      } catch (error) {
        this.error = error.response?.data?.detail || 'Failed to fetch statistics'
        throw error
      }
    },

    async fetchSummary() {
      try {
        const response = await precurationsAPI.getPrecurationSummary()
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
        await this.fetchPrecurations()
      }
    },

    async prevPage() {
      if (this.hasPrevPage) {
        this.pagination.page -= 1
        await this.fetchPrecurations()
      }
    },

    async setPage(page) {
      this.pagination.page = page
      await this.fetchPrecurations()
    },

    async setSorting(sortBy, sortOrder = 'desc') {
      this.searchParams.sort_by = sortBy
      this.searchParams.sort_order = sortOrder
      this.pagination.page = 1
      
      if (this.searchResults) {
        await this.searchPrecurations()
      } else {
        await this.fetchPrecurations()
      }
    },

    clearSearch() {
      this.searchResults = null
      this.searchParams = {
        query: '',
        gene_id: null,
        mondo_id: '',
        lumping_splitting_decision: null,
        status: null,
        sort_by: 'created_at',
        sort_order: 'desc'
      }
      this.pagination.page = 1
    },

    clearError() {
      this.error = null
    },

    clearCurrentPrecuration() {
      this.currentPrecuration = null
      this.precurationHistory = []
    }
  }
})