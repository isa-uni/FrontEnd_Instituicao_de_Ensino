<template>
  <div class="person-item">
    <AppAvatar :nome="person.nome" :size="36" :color-index="colorIndex" />
    <div class="info">
      <p class="nome">{{ person.nome }}</p>
      <p class="email">{{ person.email }}</p>
    </div>
    <span class="pill" :class="pillClass[person.papel]">{{ roleLabel[person.papel] }}</span>
    <button v-if="removable" class="remove-btn" title="Remover" @click="$emit('remove', person.id)">✕</button>
  </div>
</template>

<script setup>
import AppAvatar from '@/components/AppAvatar.vue'

defineProps({
  person:     { type: Object, required: true },
  colorIndex: { type: Number, default: 0 },
  removable:  { type: Boolean, default: false }
})
defineEmits(['remove'])

const roleLabel = { aluno: 'Aluno', professor: 'Professor', admin: 'Admin' }
const pillClass = { aluno: 'pill-student', professor: 'pill-teacher', admin: 'pill-admin' }
</script>

<style scoped>
.person-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 22px;
  border-bottom: 1px solid var(--border);
  transition: background .15s;
}
.person-item:last-child { border-bottom: none; }
.person-item:hover { background: var(--surface2); }
.info      { flex: 1; min-width: 0; }
.nome      { font-size: 13px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.email     { font-size: 11px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 1px; }
.remove-btn {
  background: none; border: none;
  color: var(--muted); font-size: 12px;
  cursor: pointer; padding: 5px 7px;
  border-radius: 6px;
  transition: background .15s, color .15s;
}
.remove-btn:hover { background: rgba(248,81,73,.12); color: var(--danger); }
</style>
