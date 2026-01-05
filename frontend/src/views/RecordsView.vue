<template>
  <v-container fluid>
    <v-row class="mb-2" align="center">
      <v-col cols="12" md="6">
        <h2 class="text-h6">Records</h2>
        <div class="text-caption mt-8">Listado y creación mínima de registros.</div>
      </v-col>
      <v-col cols="12" md="6" class="text-md-right mt-10">
        <v-btn color="primary" prepend-icon="mdi-plus" @click="openCreate">
          Nuevo record
        </v-btn>
      </v-col>
    </v-row>

    <v-alert v-if="error" type="error" variant="tonal" class="mb-3">
      {{ error }}
    </v-alert>

    <v-card>
      <v-data-table
        :headers="headers"
        :items="items"
        :loading="loading"
        item-key="id"
        class="elevation-0"
      >
        <template #item.actions="{ item }">
          <v-btn size="small" variant="text" prepend-icon="mdi-pencil" @click="openEdit(item)">
            Editar
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Dialog create/edit -->
    <v-dialog v-model="dialog" max-width="640">
      <v-card>
        <v-card-title class="text-h6">
          {{ isEdit ? 'Editar record' : 'Nuevo record' }}
        </v-card-title>

        <v-card-text>
          <v-alert v-if="isEdit" type="warning" variant="tonal" class="mb-4">
            Backend actual no expone endpoint de actualización. Este formulario permite modificar los campos,
            pero al guardar se creará un nuevo record (POST).
          </v-alert>

          <v-form @submit.prevent="save">
            <v-text-field
              v-model="form.sourceId"
              label="sourceId (único)"
              required
              hint="Debe ser único en BD"
              persistent-hint
            />
            <v-text-field
              v-model="form.date"
              label="date"
              type="date"
              required
            />
            <v-text-field
              v-model="form.category"
              label="category"
              required
            />
            <v-text-field
              v-model.number="form.amount"
              label="amount"
              type="number"
              step="0.01"
              required
            />
            <v-text-field
              v-model="form.status"
              label="status"
              required
            />
            <v-textarea
              v-model="form.description"
              label="description"
              rows="2"
              auto-grow
            />
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="dialog = false">Cancelar</v-btn>
          <v-btn color="primary" :loading="saving" @click="save">
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import api from '../services/api'

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'sourceId', key: 'sourceId' },
  { title: 'date', key: 'date' },
  { title: 'category', key: 'category' },
  { title: 'amount', key: 'amount' },
  { title: 'status', key: 'status' },
  { title: 'description', key: 'description' },
  { title: 'Acciones', key: 'actions', sortable: false }
]

const items = ref([])
const loading = ref(false)
const error = ref('')

const dialog = ref(false)
const isEdit = ref(false)
const saving = ref(false)

const emptyForm = () => ({
  sourceId: '',
  date: '',
  category: '',
  amount: 0,
  status: '',
  description: ''
})

const form = ref(emptyForm())

async function fetchRecords() {
  error.value = ''
  loading.value = true
  try {
    const res = await api.get('/records')
    items.value = Array.isArray(res.data) ? res.data : []
  } catch (e) {
    error.value = e?.response?.data?.message || 'No fue posible cargar records'
  } finally {
    loading.value = false
  }
}

function openCreate() {
  isEdit.value = false
  form.value = emptyForm()
  dialog.value = true
}

function openEdit(item) {
  isEdit.value = true
  // Clon simple para editar en el formulario
  form.value = {
    sourceId: item.sourceId || '',
    date: item.date || '',
    category: item.category || '',
    amount: Number(item.amount ?? 0),
    status: item.status || '',
    description: item.description || ''
  }
  dialog.value = true
}

async function save() {
  saving.value = true
  error.value = ''
  try {
    await api.post('/records', form.value)
    dialog.value = false
    await fetchRecords()
  } catch (e) {
    error.value = e?.response?.data?.message || 'No fue posible guardar el record'
  } finally {
    saving.value = false
  }
}

onMounted(fetchRecords)
</script>
