<template>
  <AppLayout title="Cadastrar Turma">
    <div class="page">
      <div class="form-layout">
        <div class="card card-body">
          <h2 class="section-title">Nova turma</h2>
          <p class="section-sub">Preencha os dados para cadastrar uma nova turma.</p>

          <Transition name="fade">
            <div v-if="success" class="alert alert-success">
              ✓ Turma cadastrada com sucesso!
            </div>
          </Transition>
          <Transition name="fade">
            <div v-if="error" class="alert alert-danger">
              {{ error }}
            </div>
          </Transition>

          <div class="field">
            <label for="nome">Nome da turma *</label>
            <input
              id="nome"
              v-model.trim="form.nome"
              type="text"
              placeholder="Ex.: 3º Ano A, Turma 101"
            />
          </div>
          <div class="field">
            <label for="descricao">Descrição</label>
            <input
              id="descricao"
              v-model.trim="form.descricao"
              type="text"
              placeholder="Ex.: Turma do terceiro ano do ensino médio"
            />
          </div>

          <button
            class="btn btn-accent btn-full"
            :disabled="!isValid || loading"
            @click="submit"
          >
            {{ loading ? 'Cadastrando...' : 'Cadastrar turma' }}
          </button>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import AppLayout from '@/components/AppLayout.vue'
import { useTurmasStore } from '@/stores/turmas'

const turmasStore = useTurmasStore()
const success = ref(false)
const error = ref(null)
const loading = ref(false)

const form = reactive({ nome: '', descricao: '' })

const isValid = computed(() => form.nome.length > 0)

async function submit() {
  error.value = null
  loading.value = true
  try {
    await turmasStore.add({ nome: form.nome, descricao: form.descricao })
    form.nome = ''
    form.descricao = ''
    success.value = true
    setTimeout(() => { success.value = false }, 3000)
  } catch (e) {
    error.value = e.response?.data?.message ?? 'Erro ao cadastrar turma.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.form-layout {
  max-width: 480px;
}
.section-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.3rem;
  margin-bottom: 6px;
}
.section-sub {
  font-size: 13px;
  color: var(--muted);
  margin-bottom: 26px;
}
</style>
