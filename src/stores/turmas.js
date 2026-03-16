import { defineStore } from 'pinia'
import { api } from '@/stores/api'

export const useTurmasStore = defineStore('turmas', {
  state: () => ({
    turmas: []
  }),

  actions: {
    async fetchAll() {
      const response = await api.get('/turmas')
      this.turmas = response.data ?? []
      return this.turmas
    },

    async add(data) {
      const response = await api.post('/turmas', {
        nome: data.nome,
        descricao: data.descricao ?? ''
      })
      this.turmas.push(response.data)
      return response.data
    },

    async fetchUsuariosByTurmaId(turmaId) {
      const response = await api.get(`/turmas/${turmaId}/usuarios`)
      return response.data ?? []
    },

    async associarUsuario(usuarioId, turmaId) {
      const response = await api.post('/usuario-turma', {
        usuarioId,
        turmaId
      })
      return response.data
    },

    async atualizarNota(usuarioTurmaId, nota) {
      const response = await api.patch(`/usuario-turma/${usuarioTurmaId}/nota`, { nota })
      return response.data
    }
  }
})
