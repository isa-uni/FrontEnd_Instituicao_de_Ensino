<template>
  <AppLayout title="Teste">
    <template #topbar-actions>
      <RouterLink v-if="auth.user.papel === 'admin'" to="/cadastrar" class="btn btn-sm btn-accent">+ Cadastrar</RouterLink>
    </template>
  </AppLayout>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore  } from '@/stores/auth'
import { usePeopleStore } from '@/stores/people'
import AppLayout      from '@/components/AppLayout.vue'
import KpiCard        from '@/components/KpiCard.vue'
import PersonListItem from '@/components/PersonListItem.vue'

const auth   = useAuthStore()
const people = usePeopleStore()

const firstName = computed(() => auth.user?.nome?.split(" ")[0] || "")
</script>

<style scoped>
.welcome-banner {
  background: linear-gradient(135deg, #161b22 0%, #1c2a1e 100%);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 28px 32px;
  margin-bottom: 24px;
  position: relative;
  overflow: hidden;
}
.welcome-banner::after {
  content: '';
  position: absolute;
  right: -60px; top: -60px;
  width: 240px; height: 240px;
  background: radial-gradient(circle, rgba(232,197,71,.1) 0%, transparent 70%);
  pointer-events: none;
}
.banner-title { font-family: 'Playfair Display', serif; font-size: 1.5rem; margin-bottom: 4px; }
.banner-sub   { font-size: 14px; color: var(--muted); }

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.empty { padding: 28px; text-align: center; color: var(--muted); font-size: 13px; }

@media (max-width: 1100px) { .kpi-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 640px)  { .kpi-grid { grid-template-columns: 1fr; } }
</style>
