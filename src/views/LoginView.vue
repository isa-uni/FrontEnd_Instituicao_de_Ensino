<template>
  <div class="login-wrapper">
    <div class="login">
      <div class="form-box">
        <h2 class="form-title">Bem‑vindo</h2>
        <p class="form-sub">Acesse sua conta para continuar</p>

        <!-- Error -->
        <div v-if="error" class="alert alert-danger">⚠ {{ error }}</div>

        <!-- Fields -->
        <div class="field">
          <label for="email">E-mail</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            placeholder="seu@email.com"
            autocomplete="email"
            @keyup.enter="submit"
          />
        </div>
        <div class="field">
          <label for="senha">Senha</label>
          <input
            id="senha"
            v-model="form.senha"
            type="senha"
            placeholder="••••••••"
            autocomplete="current-senha"
            @keyup.enter="submit"
          />
        </div>

        <button class="btn btn-accent btn-full" :disabled="loading" @click="submit">
          {{ loading ? 'Entrando…' : 'Entrar na plataforma' }}
        </button>

        <!-- <p class="hint">
          Demo: <strong>admin@edu.br</strong> / <strong>1234</strong>
        </p> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth   = useAuthStore()

// const selectedRole = ref('admin')
const loading      = ref(false)
const error        = ref('')
const form = reactive({ email: '', senha: '' })

// const roles = [
//   { value: 'admin',   label: 'Administrador' },
//   { value: 'teacher', label: 'Professor'      },
//   { value: 'student', label: 'Aluno'          },
// ]

async function submit() {
  error.value = ''
  loading.value = true
  // simulate async
  await new Promise(r => setTimeout(r, 600))
  const result = await auth.login(form.email, form.senha)
  if (result.ok) {
    router.push('/home')
  } else {
    error.value = result.message
  }
  loading.value = false
}
</script>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr;
}

.decorative-grid {
  position: absolute; inset: 0;
  /* background-image:
    linear-gradient(rgba(48,54,61,.45) 1px, transparent 1px),
    linear-gradient(90deg, rgba(48,54,61,.45) 1px, transparent 1px); */
  background-size: 40px 40px;
  mask-image: radial-gradient(ellipse 80% 80% at 30% 40%, black 30%, transparent 80%);
  pointer-events: none;
}
.left-content { position: relative; z-index: 1; }

.brand-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: rgba(232,197,71,.1);
  border: 1px solid rgba(232,197,71,.25);
  border-radius: 100px;
  padding: 6px 18px 6px 8px;
  margin-bottom: 48px;
  width: fit-content;
}
.brand-dot {
  width: 28px; height: 28px;
  background: var(--accent);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; color: #0d1117; font-weight: 700;
}
.brand-badge span:last-child { font-size: 13px; font-weight: 500; color: var(--accent); letter-spacing: .05em; }

.headline {
  font-family: 'Playfair Display', serif;
  font-size: clamp(2rem, 3.2vw, 2.8rem);
  line-height: 1.2;
  margin-bottom: 20px;
}
.headline em { color: var(--accent); font-style: normal; }

.sub { font-size: 15px; color: var(--muted); line-height: 1.7; max-width: 380px; margin-bottom: 48px; }

.stats-row { display: flex; gap: 32px; }
.stat { display: flex; flex-direction: column; gap: 2px; }
.stat-num   { font-family: 'Playfair Display', serif; font-size: 1.8rem; color: var(--text); }
.stat-label { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: .08em; }

.login {
  background: var(--surface);
  border-left: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 56px;
}
.form-box { 
  width: 100%;
  max-width: 400px;
  padding: 40px;
  background: var(--surface2);
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
}
.form-title { font-family: 'Playfair Display', serif; font-size: 1.8rem; margin-bottom: 6px; }
.form-sub   { font-size: 14px; color: var(--muted); margin-bottom: 32px; }

.role-tabs {
  display: flex;
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 4px;
  margin-bottom: 26px;
}
.role-tab {
  flex: 1; padding: 9px;
  border: none; background: none;
  color: var(--muted);
  font-family: 'DM Sans', sans-serif;
  font-size: 13px; font-weight: 500;
  border-radius: 7px;
  cursor: pointer;
  transition: all .18s;
}
.role-tab--active { background: var(--accent); color: #0d1117; }

.hint {
  font-size: 12px; color: var(--muted);
  text-align: center; margin-top: 18px;
}
.hint strong { color: var(--accent); }

/* Responsive */
@media (max-width: 768px) {
  .login-wrapper { grid-template-columns: 1fr; }
  .login-left    { display: none; }
  .login   { padding: 40px 24px; }
}
</style>
