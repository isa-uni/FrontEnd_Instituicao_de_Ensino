<template>
  <AppLayout title="Cadastrar Pessoas">
    <div class="page">
      <div class="register-layout">

        <!-- Form -->
        <div class="card card-body">
          <h2 class="section-title">Nova pessoa</h2>
          <p class="section-sub">Preencha os dados para criar o acesso na plataforma.</p>

          <Transition name="fade">
            <div v-if="success" class="alert alert-success">
              ✓ Pessoa cadastrada com sucesso!
            </div>
          </Transition>

          <div class="form-grid-2">
            <div class="field col-span-2">
              <label for="nome">Nome completo *</label>
              <input id="nome" v-model="form.nome" type="text" placeholder="Ex.: Cleitin da Goiaba" />
            </div>

            <div class="field">
              <label for="email">E-mail *</label>
              <input id="email" v-model="form.email" type="email" placeholder="email.escolar@edu.br" />
            </div>

            <div class="field">
              <label for="cpf">CPF</label>
              <input id="cpf" v-model="form.cpf" type="text" placeholder="000.000.000-00" />
            </div>

            <div class="field">
              <label for="telefone">Telefone</label>
              <input id="telefone" v-model="form.telefone" type="text" placeholder="(00) 00000-0000" />
            </div>

            <div class="field">
              <label for="dataNascimento">Data de Nascimento</label>
              <input id="dataNascimento" v-model="form.dataNascimento" type="date" placeholder="dd/mm/aaaa" />
            </div>

            <div class="field">
              <label for="genero">Gênero *</label>
              <select id="genero" v-model="form.genero">
                <option value="mulher">Mulher</option>
                <option value="homem">Homem</option>
              </select>
            </div>

            <div class="field">
              <label for="papel">Perfil *</label>
              <select id="papel" v-model="form.papel">
                <option value="aluno">Aluno</option>
                <option value="professor">Professor</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            <!-- <div v-if="form.papel === 'aluno'" class="field col-span-2">
              <label for="turma">Turma</label>
              <input id="turma" v-model="form.turma" type="text" placeholder="Ex.: 3A, 2B" />
            </div> -->
          </div>

          <button
            class="btn btn-accent btn-full"
            :disabled="!isValid"
            @click="submit"
          >
            Cadastrar pessoa
          </button>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { usePeopleStore } from '@/stores/people'
import AppLayout      from '@/components/AppLayout.vue'
import PersonListItem from '@/components/PersonListItem.vue'

const people = usePeopleStore()

const success      = ref(false)
const activeFilter = ref('all')

const form = reactive({ nome: '', email: '', cpf: '', telefone: '', dataNascimento: '', genero: '', papel: '', turma: '' })

const isValid = computed(() => form.nome.trim() && form.email.trim() && form.cpf.trim() && form.telefone.trim() && form.dataNascimento.trim() && form.genero.trim() && form.papel.trim())

const filtered = computed(() =>
  activeFilter.value === 'all'
    ? people.people
    : people.people.filter(p => p.papel === activeFilter.value)
)

async function submit() {
  console.log("Clicou no botão")

  try {
    await people.add({ ...form })
    Object.assign(form, { nome: '', email: '', cpf: '', telefone: '', dataNascimento: '', genero: '', papel: '', turma: '' })
    success.value = true
    setTimeout(() => { success.value = false }, 3000)
  } catch (error) {

    console.error(error)

    alert("Erro ao cadastrar usuário")

  }
}
</script>

<style scoped>
.register-layout {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 24px;
  align-items: start;
}

.section-title { font-family: 'Playfair Display', serif; font-size: 1.3rem; margin-bottom: 6px; }
.section-sub   { font-size: 13px; color: var(--muted); margin-bottom: 26px; }

.list-side { overflow: hidden; }

.filter-btn {
  padding: 5px 12px;
  border: 1px solid var(--border);
  border-radius: 100px;
  background: none;
  color: var(--muted);
  font-family: 'DM Sans', sans-serif;
  font-size: 12px; font-weight: 500;
  cursor: pointer;
  transition: all .15s;
}
.filter-btn:hover        { background: var(--surface2); color: var(--text); }
.filter-btn--active      { background: var(--accent); border-color: var(--accent); color: #0d1117; }

.empty-state {
  padding: 36px;
  text-align: center;
  color: var(--muted);
  font-size: 13px;
}
.empty-state span { display: block; font-size: 28px; margin-bottom: 8px; }

@media (max-width: 960px) {
  .register-layout { grid-template-columns: 1fr; }
}
</style>
