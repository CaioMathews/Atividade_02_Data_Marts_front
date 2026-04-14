import { useState } from 'react'
import api from '../services/api'
import type { LoginEntrada } from '../types'

export function useAuth() {
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const login = async (dados: LoginEntrada) => {
    try {
      setCarregando(true)
      setErro(null)
      const resposta = await api.post('/auth/login', dados)
      localStorage.setItem('token', resposta.data.access_token)
      return true
    } catch (e) {
      setErro('E-mail ou senha inválidos.')
      return false
    } finally {
      setCarregando(false)
    }
  }

  const cadastrar = async (dados: { nome_usuario: string; email_usuario: string; senha_usuario: string }) => {
    try {
      setCarregando(true)
      setErro(null)
      await api.post('/usuarios/', dados)
      return true
    } catch (e: any) {
      setErro(e.response?.data?.detail || 'Erro ao criar conta.')
      return false
    } finally {
      setCarregando(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
  }

  const estaAutenticado = () => {
    return !!localStorage.getItem('token')
  }

  return { login, cadastrar, logout, estaAutenticado, carregando, erro, setErro }
}