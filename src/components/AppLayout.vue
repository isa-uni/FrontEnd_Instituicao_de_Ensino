<template>
  <div class="app-shell">
    <AppSidebar />
    <div class="main-content">
      <AppTopbar :title="title">
        <template #actions>
          <slot name="topbar-actions" />
        </template>
      </AppTopbar>
      <main>
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import AppSidebar from '@/components/AppSidebar.vue'
import AppTopbar  from '@/components/AppTopbar.vue'

defineProps({
  title: { type: String, required: true }
})
</script>

<style scoped>
.app-shell { display: flex; min-height: 100vh; }
.main-content {
  margin-left: var(--sidebar-w);
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
main { flex: 1; }
</style>
