<template>
  <AppLayout :title="turmaNome || 'Turma'">
    <div class="page">
      <header class="page-header">
        <RouterLink to="/turmas" class="back-link">← Voltar às turmas</RouterLink>
        <h1 class="page-title">{{ turmaNome || 'Carregando...' }}</h1>
        <p v-if="turmaDescricao" class="page-sub">{{ turmaDescricao }}</p>
      </header>

      <div v-if="loading" class="loading-wrap">
        <div class="loading-spinner" />
      </div>

      <template v-else>
        <div v-if="error" class="alert alert-danger">
          {{ error }}
        </div>

        <template v-if="!error">
          <div v-if="canManageTurma" class="card card-body add-user-section">
            <h2 class="section-title">Adicionar usuário à turma</h2>
            <p class="section-sub">Selecione um usuário para associar a esta turma.</p>
            <div v-if="addError" class="alert alert-danger">{{ addError }}</div>
            <div class="add-user-form">
              <div class="field">
                <label for="usuario-select">Usuário</label>
                <select
                  id="usuario-select"
                  v-model="selectedUsuarioId"
                  :disabled="addLoading || !disponiveisParaAssociar.length"
                >
                  <option :value="null">Selecione um usuário</option>
                  <option
                    v-for="p in disponiveisParaAssociar"
                    :key="p.id"
                    :value="p.id"
                  >
                    {{ p.nome }} {{ p.email ? `(${p.email})` : '' }}
                  </option>
                </select>
              </div>
              <button
                type="button"
                class="btn btn-accent"
                :disabled="!selectedUsuarioId || addLoading"
                @click="associarUsuario"
              >
                {{ addLoading ? 'Associando...' : 'Adicionar à turma' }}
              </button>
            </div>
            <p v-if="disponiveisParaAssociar.length === 0 && !peopleLoading" class="section-hint">
              Todos os usuários já estão nesta turma ou não há usuários cadastrados.
            </p>
          </div>

          <div v-if="!usuarios.length" class="card card-body empty-state">
            <span>👥</span>
            Nenhum usuário associado a esta turma.
          </div>

          <div v-else class="card overflow-hidden">
            <div class="card-header">
              <span class="card-title">Usuários na turma</span>
            </div>
            <div
              v-for="(item, index) in usuarios"
              :key="item.id"
              class="usuario-item"
            >
              <div class="usuario-info">
                <p class="usuario-nome">{{ item.usuarioNome }}</p>
                <span class="pill" :class="pillClass(item.tipo)">{{ tipoLabel(item.tipo) }}</span>
              </div>
              <div v-if="item.tipo === 'aluno'" class="usuario-nota">
                <span class="nota-label">Nota</span>
                <template v-if="canManageTurma">
                  <div class="nota-edit">
                    <input
                      v-model.number="notaInputs[item.id]"
                      type="number"
                      min="0"
                      max="10"
                      step="0.5"
                      placeholder="—"
                      class="nota-input"
                      @keyup.enter="salvarNota(item)"
                    />
                    <button
                      type="button"
                      class="btn btn-sm btn-accent"
                      :disabled="notaSavingId === item.id"
                      @click="salvarNota(item)"
                    >
                      {{ notaSavingId === item.id ? 'Salvando...' : 'Salvar' }}
                    </button>
                  </div>
                </template>
                <span v-else class="nota-value">{{ formatNota(item.nota) }}</span>
              </div>
              <button
                v-if="canManageTurma"
                type="button"
                class="btn btn-sm btn-danger"
                :disabled="removendoId === item.id"
                @click="removerUsuario(item)"
              >
                {{ removendoId === item.id ? 'Removendo...' : 'Remover' }}
              </button>
            </div>
          </div>
        </template>
      </template>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import AppLayout from '@/components/AppLayout.vue'
import { useAuthStore } from '@/stores/auth'
import { useTurmasStore } from '@/stores/turmas'
import { usePeopleStore } from '@/stores/people'

const route = useRoute()
const auth = useAuthStore()
const turmasStore = useTurmasStore()
const peopleStore = usePeopleStore()

const loading = ref(true)
const error = ref(null)
const usuarios = ref([])
const selectedUsuarioId = ref(null)
const addLoading = ref(false)
const addError = ref(null)
const peopleLoading = ref(false)
const notaInputs = ref({})
const notaSavingId = ref(null)
const removendoId = ref(null)

const turmaId = computed(() => Number(route.params.id))

const canManageTurma = computed(() => {
  const papel = auth.user?.papel
  const p = typeof papel === 'object' ? papel?.papel : papel
  return p === 'professor' || p === 'admin'
})

const disponiveisParaAssociar = computed(() => {
  const idsNaTurma = new Set(usuarios.value.map(u => u.usuarioId))
  return peopleStore.people.filter(p => !idsNaTurma.has(p.id))
})

const turmaNome = computed(() => {
  const t = turmasStore.turmas.find(turma => turma.id === turmaId.value)
  return t?.nome ?? (usuarios.value[0]?.turmaNome ?? null)
})

const turmaDescricao = computed(() => {
  const t = turmasStore.turmas.find(turma => turma.id === turmaId.value)
  return t?.descricao ?? null
})

function tipoLabel(tipo) {
  const map = { aluno: 'Aluno', professor: 'Professor', admin: 'Admin' }
  return map[tipo] ?? tipo
}

function pillClass(tipo) {
  const map = {
    aluno: 'pill-student',
    professor: 'pill-teacher',
    admin: 'pill-admin'
  }
  return map[tipo] ?? 'pill-blue'
}

function formatNota(nota) {
  if (nota == null || nota === '') return '—'
  return Number(nota)
}

function initNotaInputs() {
  const next = {}
  for (const u of usuarios.value) {
    if (u.tipo === 'aluno') next[u.id] = u.nota != null ? u.nota : ''
  }
  notaInputs.value = next
}

async function load() {
  if (!turmaId.value) return
  loading.value = true
  error.value = null
  try {
    usuarios.value = await turmasStore.fetchUsuariosByTurmaId(turmaId.value)
    initNotaInputs()
    if (!turmasStore.turmas.length) {
      await turmasStore.fetchAll()
    }
  } catch (e) {
    error.value = e.response?.data?.message ?? 'Erro ao carregar usuários da turma.'
  } finally {
    loading.value = false
  }
}

async function loadPeople() {
  if (!canManageTurma.value) return
  peopleLoading.value = true
  try {
    await peopleStore.fetchAll()
  } finally {
    peopleLoading.value = false
  }
}

async function associarUsuario() {
  if (!selectedUsuarioId.value || !turmaId.value) return
  addError.value = null
  addLoading.value = true
  try {
    const novo = await turmasStore.associarUsuario(selectedUsuarioId.value, turmaId.value)
    usuarios.value.push(novo)
    if (novo.tipo === 'aluno') notaInputs.value[novo.id] = novo.nota != null ? novo.nota : ''
    selectedUsuarioId.value = null
  } catch (e) {
    addError.value = e.response?.data?.message ?? 'Erro ao associar usuário à turma.'
  } finally {
    addLoading.value = false
  }
}

async function removerUsuario(item) {
  if (!confirm(`Remover ${item.usuarioNome} da turma?`)) return
  removendoId.value = item.id
  try {
    await turmasStore.removerUsuarioDaTurma(item.id)
    usuarios.value = usuarios.value.filter(u => u.id !== item.id)
  } catch (e) {
    error.value = e.response?.data?.message ?? 'Erro ao remover usuário da turma.'
  } finally {
    removendoId.value = null
  }
}

async function salvarNota(item) {
  const valor = notaInputs.value[item.id]
  const nota = valor === '' || valor == null ? null : Number(valor)
  if (nota != null && (nota < 0 || nota > 10)) return
  notaSavingId.value = item.id
  try {
    const atualizado = await turmasStore.atualizarNota(item.id, nota)
    const idx = usuarios.value.findIndex(u => u.id === item.id)
    if (idx !== -1) usuarios.value[idx] = atualizado
    notaInputs.value[item.id] = atualizado.nota != null ? atualizado.nota : ''
  } catch (e) {
    error.value = e.response?.data?.message ?? 'Erro ao salvar nota.'
  } finally {
    notaSavingId.value = null
  }
}

onMounted(async () => {
  await load()
  await loadPeople()
})
watch(turmaId, load)
</script>

<style scoped>
.back-link {
  display: inline-block;
  font-size: 13px;
  color: var(--muted);
  text-decoration: none;
  margin-bottom: 12px;
  transition: color 0.15s;
}
.back-link:hover { color: var(--accent); }

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

.usuario-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 22px;
  border-bottom: 1px solid var(--border);
  transition: background 0.15s;
}
.usuario-item:last-child { border-bottom: none; }
.usuario-item:hover { background: var(--surface2); }

.usuario-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}
.usuario-nome {
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
}
.usuario-nota {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  flex-shrink: 0;
}
.nota-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.nota-value {
  font-size: 15px;
  font-weight: 600;
  color: var(--text);
}
.nota-edit {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}
.nota-input {
  width: 72px;
  padding: 6px 10px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface2);
  color: var(--text);
  font-size: 14px;
  font-weight: 600;
  text-align: center;
}
.nota-input:focus {
  outline: none;
  border-color: var(--accent);
}

.add-user-section { margin-bottom: 24px; }
.section-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.15rem;
  margin-bottom: 4px;
}
.section-sub {
  font-size: 13px;
  color: var(--muted);
  margin-bottom: 18px;
}
.add-user-form {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: flex-end;
}
.add-user-form .field { margin-bottom: 0; flex: 1; min-width: 200px; }
.section-hint {
  font-size: 13px;
  color: var(--muted);
  margin-top: 8px;
}

.btn-danger {
  background: transparent;
  color: #e05252;
  border: 1px solid #e05252;
  flex-shrink: 0;
}
.btn-danger:hover:not(:disabled) {
  background: #e05252;
  color: #fff;
}
.btn-danger:disabled { opacity: 0.5; cursor: not-allowed; }

.empty-state {
  text-align: center;
  padding: 40px 24px;
  color: var(--muted);
  font-size: 14px;
}
.empty-state span { display: block; font-size: 28px; margin-bottom: 10px; }
</style>
