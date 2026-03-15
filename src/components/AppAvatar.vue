<template>
  <div
    class="avatar"
    :style="{
      width:  size + 'px',
      height: size + 'px',
      background: color,
      fontSize: Math.round(size * 0.38) + 'px'
    }"
  >
    {{ initials }}
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  nome: { type: String, required: true },
  size: { type: Number, default: 36 },
  colorIndex: { type: Number, default: null }
})

const COLORS = ['#e8c547','#58a6ff','#3fb950','#f0a500','#bc8cff','#f78166']

const initials = computed(() =>
  props.nome.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()
)

const color = computed(() => {
  const idx = props.colorIndex !== null
    ? props.colorIndex
    : props.nome.charCodeAt(0) % COLORS.length
  return COLORS[idx]
})
</script>
