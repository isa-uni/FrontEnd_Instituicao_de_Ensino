<template>
  <div class="kpi-card card">
    <div class="kpi-header">
      <span class="kpi-icon">{{ icon }}</span>
      <span class="pill" :class="badgeClass">{{ badge }}</span>
    </div>
    <div class="kpi-value">{{ value }}</div>
    <div class="kpi-label">{{ label }}</div>
  </div>
</template>

<script setup>
defineProps({
  icon:       { type: String, required: true },
  badge:      { type: String, required: true },
  badgeClass: { type: String, default: 'pill-green' },
  value:      { type: [String, Number], required: true },
  label:      { type: String, required: true }
})
</script>

<style scoped>
.kpi-card { padding: 20px 22px; }
.kpi-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}
.kpi-icon   { font-size: 18px; }
.kpi-value  { font-family: 'Playfair Display', serif; font-size: 1.9rem; margin-bottom: 4px; }
.kpi-label  { font-size: 12px; color: var(--muted); }
</style>
