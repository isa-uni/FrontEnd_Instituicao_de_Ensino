import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/stores/api'

function loadUserFromStorage() {
  const token = localStorage.getItem('token')
  const stored = localStorage.getItem('user')
  if (!token || !stored) return null
  try {
    return JSON.parse(stored)
  } catch {
    return null
  }
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref(loadUserFromStorage())

  const isLoggedIn = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.papel === 'admin')

  async function login(email, senha) {
    try {
      const response = await api.post("/login", {
        email: email,
        senha: senha
      })

      const token = response.data.token
      const usuario = response.data.usuario

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(usuario))

      user.value = usuario

      return { ok: true }
    } catch (error) {
      return {
        ok: false,
        message: "E-mail ou senha incorretos."
      }
    }
  }

  function logout() {
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return { user, isLoggedIn, isAdmin, login, logout }
})
