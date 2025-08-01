import { defineStore } from 'pinia'
import { curationsAPI } from '@/api'

export const useCurationsStore = defineStore('curations', {
  state: () => ({
    curations: [],
    currentCuration: null,
    curationHistory: [],
    currentScoreSummary: null,
    statistics: null,
    summary: [],
    searchResults: null,
    scoreDistribution: null,
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
      verdict: null,
      status: null,
      gcep_affiliation: '',
      min_total_score: null,
      max_total_score: null,
      has_contradictory_evidence: null,
      sort_by: 'created_at',
      sort_order: 'desc'
    }
  }),

  getters: {
    getCurationById: state => id => {
      return state.curations.find(curation => curation.id === id)
    },

    getCurationsByGene: state => geneId => {
      return state.curations.filter(curation => curation.gene_id === geneId)
    },

    getCurationsByVerdict: state => verdict => {
      return state.curations.filter(curation => curation.verdict === verdict)
    },

    filteredCurations: state => {
      if (!state.searchResults) return state.curations
      return state.searchResults.curations || []
    },

    totalCurations: state => {
      return state.searchResults?.total || state.pagination.total
    },

    hasNextPage: state => {
      return state.pagination.page < state.pagination.pages
    },

    hasPrevPage: state => {
      return state.pagination.page > 1
    },

    pendingCurations: state => {
      return state.curations.filter(c =>
        ['Draft', 'In_Primary_Review', 'In_Secondary_Review'].includes(c.status)
      )
    },

    highConfidenceCurations: state => {
      return state.curations.filter(c => ['Definitive', 'Strong'].includes(c.verdict))
    },

    curationsWithContradictoryEvidence: state => {
      return state.curations.filter(c => c.has_contradictory_evidence)
    },

    // ClinGen-specific getters
    verdictDistribution: state => {
      const distribution = {}
      state.curations.forEach(curation => {
        distribution[curation.verdict] = (distribution[curation.verdict] || 0) + 1
      })
      return distribution
    },

    averageScores: state => {
      if (state.curations.length === 0) return null

      const totals = state.curations.reduce(
        (acc, curation) => {
          acc.genetic += curation.genetic_evidence_score
          acc.experimental += curation.experimental_evidence_score
          acc.total += curation.total_score
          return acc
        },
        { genetic: 0, experimental: 0, total: 0 }
      )

      const count = state.curations.length
      return {
        avg_genetic_score: (totals.genetic / count).toFixed(2),
        avg_experimental_score: (totals.experimental / count).toFixed(2),
        avg_total_score: (totals.total / count).toFixed(2)
      }
    }
  },

  actions: {
    async fetchCurations(params = {}) {
      try {
        this.loading = true
        this.error = null

        const queryParams = {
          page: params.page || this.pagination.page,
          per_page: params.per_page || this.pagination.per_page,
          sort_by: params.sort_by || this.searchParams.sort_by,
          sort_order: params.sort_order || this.searchParams.sort_order
        }

        const response = await curationsAPI.getCurations(queryParams)

        this.curations = response.curations
        this.pagination = {
          page: response.page,
          per_page: response.per_page,
          total: response.total,
          pages: response.pages
        }

        return response
      } catch (error) {
        this.error = error.response?.data?.detail || 'Failed to fetch curations'
        throw error
      } finally {
        this.loading = false
      }
    },

    async searchCurations(searchParams = {}) {
      try {
        this.loading = true
        this.error = null

        const params = {
          ...this.searchParams,
          ...searchParams
        }

        this.searchParams = params
        const response = await curationsAPI.searchCurations(params)

        this.searchResults = response

        return response
      } catch (error) {
        this.error = error.response?.data?.detail || 'Search failed'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchCurationById(curationId) {
      try {
        this.loading = true
        this.error = null

        const response = await curationsAPI.getCurationById(curationId)
        this.currentCuration = response

        return response
      } catch (error) {
        this.error = error.response?.data?.detail || 'Failed to fetch curation'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchCurationsByGene(geneId) {
      try {
        this.loading = true
        this.error = null

        const response = await curationsAPI.getCurationsByGene(geneId)
        // Update local state with gene-specific curations
        const existingIds = new Set(this.curations.map(c => c.id))
        const newCurations = response.filter(c => !existingIds.has(c.id))
        this.curations.push(...newCurations)

        return response
      } catch (error) {
        this.error = error.response?.data?.detail || 'Failed to fetch curations'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchCurationsByVerdict(verdict) {
      try {
        this.loading = true
        this.error = null

        const response = await curationsAPI.getCurationsByVerdict(verdict)

        return response
      } catch (error) {
        this.error = error.response?.data?.detail || 'Failed to fetch curations by verdict'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchCurationScoreSummary(curationId) {
      try {
        this.loading = true
        this.error = null

        const response = await curationsAPI.getCurationScoreSummary(curationId)
        this.currentScoreSummary = response

        return response
      } catch (error) {
        this.error = error.response?.data?.detail || 'Failed to fetch score summary'
        throw error
      } finally {
        this.loading = false
      }
    },

    async createCuration(curationData) {
      try {
        this.loading = true
        this.error = null

        const response = await curationsAPI.createCuration(curationData)

        // Add to local state
        this.curations.unshift(response)
        this.pagination.total += 1

        return response
      } catch (error) {
        this.error = error.response?.data?.detail || 'Failed to create curation'
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateCuration(curationId, curationData) {
      try {
        this.loading = true
        this.error = null

        const response = await curationsAPI.updateCuration(curationId, curationData)

        // Update local state
        const index = this.curations.findIndex(c => c.id === curationId)
        if (index !== -1) {
          this.curations[index] = response
        }

        if (this.currentCuration?.id === curationId) {
          this.currentCuration = response
        }

        return response
      } catch (error) {
        this.error = error.response?.data?.detail || 'Failed to update curation'
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteCuration(curationId) {
      try {
        this.loading = true
        this.error = null

        await curationsAPI.deleteCuration(curationId)

        // Remove from local state
        this.curations = this.curations.filter(c => c.id !== curationId)
        this.pagination.total -= 1

        if (this.currentCuration?.id === curationId) {
          this.currentCuration = null
        }

        return true
      } catch (error) {
        this.error = error.response?.data?.detail || 'Failed to delete curation'
        throw error
      } finally {
        this.loading = false
      }
    },

    async workflowAction(curationId, action) {
      try {
        this.loading = true
        this.error = null

        const response = await curationsAPI.curationWorkflowAction(curationId, action)

        // Update local state
        const index = this.curations.findIndex(c => c.id === curationId)
        if (index !== -1) {
          this.curations[index] = response
        }

        if (this.currentCuration?.id === curationId) {
          this.currentCuration = response
        }

        return response
      } catch (error) {
        this.error = error.response?.data?.detail || 'Workflow action failed'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchCurationHistory(curationId) {
      try {
        this.loading = true
        this.error = null

        const response = await curationsAPI.getCurationHistory(curationId)
        this.curationHistory = response.history

        return response
      } catch (error) {
        this.error = error.response?.data?.detail || 'Failed to fetch curation history'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchStatistics() {
      try {
        const response = await curationsAPI.getCurationStatistics()
        this.statistics = response

        return response
      } catch (error) {
        this.error = error.response?.data?.detail || 'Failed to fetch statistics'
        throw error
      }
    },

    async fetchSummary() {
      try {
        const response = await curationsAPI.getCurationSummary()
        this.summary = response

        return response
      } catch (error) {
        this.error = error.response?.data?.detail || 'Failed to fetch summary'
        throw error
      }
    },

    async fetchScoreDistribution() {
      try {
        const response = await curationsAPI.getScoreDistribution()
        this.scoreDistribution = response

        return response
      } catch (error) {
        this.error = error.response?.data?.detail || 'Failed to fetch score distribution'
        throw error
      }
    },

    // Navigation helpers
    async nextPage() {
      if (this.hasNextPage) {
        this.pagination.page += 1
        await this.fetchCurations()
      }
    },

    async prevPage() {
      if (this.hasPrevPage) {
        this.pagination.page -= 1
        await this.fetchCurations()
      }
    },

    async setPage(page) {
      this.pagination.page = page
      await this.fetchCurations()
    },

    async setSorting(sortBy, sortOrder = 'desc') {
      this.searchParams.sort_by = sortBy
      this.searchParams.sort_order = sortOrder
      this.pagination.page = 1

      if (this.searchResults) {
        await this.searchCurations()
      } else {
        await this.fetchCurations()
      }
    },

    clearSearch() {
      this.searchResults = null
      this.searchParams = {
        query: '',
        gene_id: null,
        mondo_id: '',
        verdict: null,
        status: null,
        gcep_affiliation: '',
        min_total_score: null,
        max_total_score: null,
        has_contradictory_evidence: null,
        sort_by: 'created_at',
        sort_order: 'desc'
      }
      this.pagination.page = 1
    },

    clearError() {
      this.error = null
    },

    clearCurrentCuration() {
      this.currentCuration = null
      this.curationHistory = []
      this.currentScoreSummary = null
    }
  }
})
