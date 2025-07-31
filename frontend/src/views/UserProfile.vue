<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card>
          <v-card-title class="text-h5">
            <v-icon start>mdi-account</v-icon>
            User Profile
          </v-card-title>
          <v-card-text>
            <div class="text-center mb-6">
              <v-avatar size="80" class="mb-4">
                <v-icon size="48">mdi-account-circle</v-icon>
              </v-avatar>
              <h2 class="text-h5 mb-2">{{ authStore.user?.email }}</h2>
              <v-chip :color="getRoleColor(authStore.user?.role)" variant="tonal">
                {{ authStore.user?.role }}
              </v-chip>
            </div>

            <v-divider class="my-6" />

            <div class="mb-4">
              <h3 class="text-h6 mb-3">Account Information</h3>
              <div class="mb-2">
                <strong>Email:</strong> {{ authStore.user?.email }}
              </div>
              <div class="mb-2">
                <strong>Role:</strong> {{ authStore.user?.role }}
              </div>
              <div class="mb-2">
                <strong>Member Since:</strong> {{ formatDate(authStore.user?.created_at) }}
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth.js'

const authStore = useAuthStore()

const getRoleColor = (role) => {
  const colors = { admin: 'error', curator: 'warning', viewer: 'info' }
  return colors[role] || 'grey'
}

const formatDate = (dateString) => {
  if (!dateString) return 'Unknown'
  return new Date(dateString).toLocaleDateString()
}
</script>