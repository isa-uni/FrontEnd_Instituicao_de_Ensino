<template>
  <AppLayout title="Usuários">
    <div class="page">
      <header class="page-header">
        <h1 class="page-title">Usuários</h1>
        <p class="page-sub">Lista de usuários cadastrados no sistema.</p>
      </header>

      <div v-if="loading" class="loading-wrap">
        <div class="loading-spinner" />
      </div>

      <template v-else>
        <div v-if="error" class="alert alert-danger">
          {{ error }}
        </div>

        <template v-else>
          <div class="search-wrap field">
            <label for="search">Pesquisar por nome ou e-mail</label>
            <input
              id="search"
              v-model.trim="searchQuery"
              type="search"
              placeholder="Digite para filtrar..."
              autocomplete="off"
            />
          </div>
          <p v-if="searchQuery" class="search-result-count">
            {{ filteredPeople.length }} {{ filteredPeople.length === 1 ? 'resultado' : 'resultados' }}
          </p>

          <div v-if="!peopleStore.people.length" class="card card-body empty-state">
            <span>👥</span>
            Nenhum usuário cadastrado.
          </div>

          <div v-else-if="!filteredPeople.length" class="card card-body empty-state">
            <span>🔍</span>
            Nenhum resultado para "{{ searchQuery }}". Tente outro termo.
          </div>

          <div v-else class="card overflow-hidden">
            <PersonListItem
              v-for="(user, index) in filteredPeople"
              :key="user.id ?? index"
              :person="normalizePerson(user)"
              :color-index="index % 6"
              :removable="true"
              @remove="handleRemove"
            />
          </div>
        </template>
      </template>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AppLayout from '@/components/AppLayout.vue'
import PersonListItem from '@/components/PersonListItem.vue'
import { usePeopleStore } from '@/stores/people'

const peopleStore = usePeopleStore()
const loading = ref(true)
const error = ref(null)
const searchQuery = ref('')

const filteredPeople = computed(() => {
  const q = searchQuery.value.toLowerCase()
  if (!q) return peopleStore.people
  return peopleStore.people.filter(u => {
    const nome = (u.nome ?? '').toLowerCase()
    const email = (u.email ?? '').toLowerCase()
    return nome.includes(q) || email.includes(q)
  })
})

function normalizePerson(user) {
  const p = user.papel.papel

  const map = {
    aluno: 'aluno',
    professor: 'professor',
    admin: 'admin',
    1: 'aluno',
    2: 'professor',
    3: 'admin'
  }

  return { ...user, papel: map[p] ?? 'aluno' }
}

async function handleRemove(id) {
  try {
    await peopleStore.remove(id)
    error.value = null
  } catch (e) {
    error.value = e.response?.data?.message ?? 'Erro ao excluir usuário.'
  }
}

onMounted(async () => {


  try {
    await peopleStore.fetchAll()
  } catch (e) {
    error.value = e.response?.data?.message ?? 'Erro ao carregar usuários.'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.loading-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 48px;
}
.loading-spinner {
  width: 40px;
  height: 40px;
  border: 2px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

.search-wrap { margin-bottom: 8px; }
.search-result-count {
  font-size: 12px;
  color: var(--muted);
  margin-bottom: 16px;
}

.empty-state {
  text-align: center;
  padding: 40px 24px;
  color: var(--muted);
  font-size: 14px;
}
.empty-state span { display: block; font-size: 28px; margin-bottom: 10px; }
</style>
