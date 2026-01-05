<template>
  <v-layout class="h-100">
    <v-navigation-drawer v-model="drawer" permanent app>
      <v-list>
        <v-list-item title="Menú" subtitle="MVP" />
        <v-divider class="my-2" />
        <v-list-item
          prepend-icon="mdi-table"
          title="Records"
          :to="{ name: 'records' }"
        />
      </v-list>
    </v-navigation-drawer>

    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-app-bar-title>Test Programación</v-app-bar-title>

      <v-spacer />

      <div class="mr-4">
        <small>Usuario:</small>
        <strong>{{ auth.userEmail || '—' }}</strong>
      </div>

      <v-btn variant="text" prepend-icon="mdi-logout" @click="handleLogout">
        Salir
      </v-btn>
    </v-app-bar>

    <v-main class="pa-4">
      <router-view />
    </v-main>
  </v-layout>
</template>


<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const drawer = ref(false)
const router = useRouter()
const auth = useAuthStore()

function handleLogout() {
  auth.logout()
  router.push({ name: 'login' })
}
</script>
