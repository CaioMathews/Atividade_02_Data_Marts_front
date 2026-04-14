import { useState, useEffect } from 'react'
import api from '../services/api'

interface Usuario {
  id_usuario: number
  nome_usuario: string
  email_usuario: string
  tipo_usuario: 'gerente' | 'usuario'
}

export function useUsuarioAtual() {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setCarregando(false)
      return
    }

    const buscarUsuario = async () => {
      try {
        const resposta = await api.get('/usuarios/me')
        setUsuario(resposta.data)
      } catch {
        setUsuario(null)
      } finally {
        setCarregando(false)
      }
    }

    buscarUsuario()
  }, [])

  const eGerente = usuario?.tipo_usuario === 'gerente'
  const estaLogado = !!localStorage.getItem('token')

  return { usuario, carregando, eGerente, estaLogado }
}