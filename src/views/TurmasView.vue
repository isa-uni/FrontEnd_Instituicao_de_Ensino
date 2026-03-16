<template>
  <AppLayout title="Turmas">
    <template #topbar-actions>
      <RouterLink v-if="auth.isAdmin" to="/turmas/cadastrar" class="btn btn-sm btn-accent">+ Cadastrar turma</RouterLink>
    </template>
    <div class="page">
      <header class="page-header">
        <h1 class="page-title">Turmas</h1>
        <p class="page-sub">Lista de todas as turmas cadastradas no sistema.</p>
      </header>

      <div v-if="loading" class="loading-wrap">
        <div class="loading-spinner" />
      </div>

      <template v-else>
        <div v-if="error" class="alert alert-danger">
          {{ error }}
        </div>

        <div v-else-if="!turmasStore.turmas.length" class="card card-body empty-state">
          <span>📚</span>
          Nenhuma turma cadastrada.
        </div>

        <div v-else class="card overflow-hidden">
          <RouterLink
            v-for="turma in turmasStore.turmas"
            :key="turma.id"
            :to="{ name: 'turma-detail', params: { id: turma.id } }"
            class="turma-item turma-item-link"
          >
            <div class="turma-info">
              <p class="turma-nome">{{ turma.nome }}</p>
              <p v-if="turma.descricao" class="turma-descricao">{{ turma.descricao }}</p>
            </div>
            <span class="turma-arrow">→</span>
          </RouterLink>
        </div>
      </template>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import AppLayout from '@/components/AppLayout.vue'
import { useAuthStore } from '@/stores/auth'
import { useTurmasStore } from '@/stores/turmas'

const auth = useAuthStore()
const turmasStore = useTurmasStore()
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    await turmasStore.fetchAll()
  } catch (e) {
    error.value = e.response?.data?.message ?? 'Erro ao carregar turmas.'
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

.turma-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 22px;
  border-bottom: 1px solid var(--border);
  transition: background 0.15s;
}
.turma-item:last-child { border-bottom: none; }
.turma-item:hover { background: var(--surface2); }
.turma-item-link {
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}
.turma-info { flex: 1; min-width: 0; }
.turma-arrow {
  font-size: 14px;
  color: var(--muted);
}
.turma-nome {
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
}
.turma-descricao {
  font-size: 12px;
  color: var(--muted);
  margin-top: 4px;
  line-height: 1.4;
}

.empty-state {
  text-align: center;
  padding: 40px 24px;
  color: var(--muted);
  font-size: 14px;
}
.empty-state span { display: block; font-size: 28px; margin-bottom: 10px; }
</style>
