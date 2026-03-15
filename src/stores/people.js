import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/stores/api'

export const usePeopleStore = defineStore('people', {
  state: () => ({
    people: []
  }),

  actions: {

    async add(data) {

      const payload = {
        nome: data.nome,
        email: data.email,
        cpf: data.cpf,
        telefone: data.telefone,
        dataNascimento: data.dataNascimento,
        genero: data.genero,
        senha: data.senha,
        matricula: data.matricula,
        papelId: this.mapPapel(data.papel)
      }

      const response = await api.post('/usuarios/cadastrar', payload)

      this.people.push(response.data)

      return response.data
    },

    mapPapel(papel) {
      const map = {
        aluno: 1,
        professor: 2,
        admin: 3
      }

      return map[papel]
    }

  }
})