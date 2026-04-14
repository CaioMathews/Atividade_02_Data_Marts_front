import { useState, useEffect } from 'react'
import api from '../services/api'

export function useCategorias() {
  const [categorias, setCategorias] = useState<string[]>([])
  const [carregandoCategorias, setCarregandoCategorias] = useState(true)

  useEffect(() => {
    const buscarCategorias = async () => {
      try {
        setCarregandoCategorias(true)
        const resposta = await api.get('/produtos/categorias')
        setCategorias(resposta.data)
      } catch (error) {
        console.error("Erro ao carregar categorias", error)
        setCategorias([]) 
      } finally {
        setCarregandoCategorias(false)
      }
    }

    buscarCategorias()
  }, [])

  return { categorias, carregandoCategorias }
}