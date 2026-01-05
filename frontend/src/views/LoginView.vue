<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="5" lg="4">
        <v-card class="pa-6">
          <v-card-title class="text-h6">Iniciar sesión</v-card-title>
          <v-card-text>
            <v-alert v-if="error" type="error" variant="tonal" class="mb-4">
              {{ error }}
            </v-alert>

            <v-form @submit.prevent="onSubmit">
              <v-text-field
                v-model="email"
                label="Email"
                type="email"
                autocomplete="username"
                required
              />
              <v-text-field
                v-model="password"
                label="Password"
                type="password"
                autocomplete="current-password"
                required
              />

              <v-btn :loading="loading" type="submit" block color="primary">
                Iniciar Sesión
              </v-btn>

              <v-divider class="my-4" />

              <v-alert type="info" variant="tonal">
                Credenciales de prueba: <strong>admin@test.com</strong> / <strong>123456</strong>
              </v-alert>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

const email = ref('admin@test.com')
const password = ref('123456')
const loading = ref(false)
const error = ref('')

async function onSubmit() {
  error.value = ''
  loading.value = true
  try {
    await auth.login(email.value, password.value)
    router.push({ name: 'records' })
  } catch (e) {
    error.value = e?.response?.data?.message || 'No fue posible iniciar sesión'
  } finally {
    loading.value = false
  }
}
</script>
