<template>
  <aside class="sidebar">
    <!-- Logo -->
    <div class="sidebar-logo">
      <div class="logo-icon">E</div>
      <span class="logo-text">Instituição De Ensino</span>
    </div>

    <!-- Nav -->
    <nav class="sidebar-nav">
      <p class="nav-section-label">Principal</p>

      <RouterLink v-for="item in mainNav" :key="item.to" :to="item.to" class="nav-item" active-class="nav-item--active">
        <span class="nav-icon">{{ item.icon }}</span>
        {{ item.label }}
      </RouterLink>

      <template v-if="auth.isAdmin">
        <p class="nav-section-label">Gestão</p>
        <RouterLink v-for="item in adminNav" :key="item.to" :to="item.to" class="nav-item" active-class="nav-item--active">
          <span class="nav-icon">{{ item.icon }}</span>
          {{ item.label }}
        </RouterLink>
      </template>
    </nav>

    <!-- Footer -->
    <div class="sidebar-footer">
      <div class="user-card">
        <AppAvatar :nome="auth.user.nome" :size="34" />
        <div class="user-info">
          <p class="user-nome">{{ auth.user.nome }}</p>
          <p class="user-papel">{{ papelLabel[auth.user.papel] }}</p>
        </div>
        <button class="logout-btn" title="Sair" @click="handleLogout">↩</button>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AppAvatar from '@/components/AppAvatar.vue'

const auth   = useAuthStore()
const router = useRouter()

const mainNav = [
  { to: '/usuarios', icon: '👥', label: 'Usuários' },
  { to: '/turmas', icon: '📚', label: 'Turmas' },
]

const adminNav = [
  { to: '/cadastrar', icon: '👤', label: 'Cadastrar Pessoas' },
  { to: '/turmas/cadastrar', icon: '📚', label: 'Cadastrar Turma' },
]

const papelLabel = { admin: 'Administrador', professor: 'Professor', aluno: 'Aluno' }

function handleLogout() {
  auth.logout()
  router.push('/login')
}
</script>

<style scoped>
.sidebar {
  width: var(--sidebar-w);
  background: var(--surface);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0; left: 0; bottom: 0;
  z-index: 20;
}

.sidebar-logo {
  padding: 22px 20px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 10px;
}
.logo-icon {
  width: 34px; height: 34px;
  background: var(--accent);
  border-radius: 9px;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Playfair Display', serif;
  font-size: 17px; font-weight: 700;
  color: #0d1117;
}
.logo-text {
  font-family: 'Playfair Display', serif;
  font-size: 1.1rem;
}

.sidebar-nav { flex: 1; padding: 14px 10px; overflow-y: auto; }

.nav-section-label {
  font-size: 11px; font-weight: 600;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: .1em;
  padding: 0 10px;
  margin: 16px 0 6px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  color: var(--muted);
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: background .15s, color .15s;
  margin-bottom: 2px;
}
.nav-item:hover { background: var(--surface2); color: var(--text); }
.nav-item--active { background: rgba(232,197,71,.1); color: var(--accent); }
.nav-icon { width: 20px; text-align: center; font-size: 15px; }

.sidebar-footer {
  padding: 14px 10px;
  border-top: 1px solid var(--border);
}
.user-card {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: default;
  transition: background .15s;
}
.user-card:hover { background: var(--surface2); }
.user-info { flex: 1; min-width: 0; }
.user-nome { font-size: 13px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.user-papel { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: .05em; margin-top: 1px; }
.logout-btn {
  background: none; border: none;
  color: var(--muted); font-size: 16px;
  cursor: pointer; padding: 4px;
  border-radius: 4px;
  transition: color .15s;
}
.logout-btn:hover { color: var(--danger); }
</style>
