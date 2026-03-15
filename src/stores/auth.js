import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/stores/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)

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

      localStorage.setItem("token", token)

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
    localStorage.removeItem("token")
  }

  return { user, isLoggedIn, isAdmin, login, logout }
})
