<template>
  <v-app>
    <BaseLayout v-if="auth.isAuthenticated" />
    <router-view v-else />
  </v-app>
</template>

<script setup>
import { useAuthStore } from './stores/auth'
import BaseLayout from './layouts/BaseLayout.vue'

const auth = useAuthStore()
</script>
