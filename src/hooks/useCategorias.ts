import { useState, useEffect } from 'react'
import api from '../services/api'

export function useCategorias() {
  const [categoriasAgrupadas, setCategoriasAgrupadas] = useState<Record<string, string[]>>({})
  const [carregandoCategorias, setCarregandoCategorias] = useState(true)

  useEffect(() => {
    const buscarCategorias = async () => {
      try {
        setCarregandoCategorias(true)
        const resposta = await api.get('/produtos/categorias')
        setCategoriasAgrupadas(resposta.data)
      } catch (error) {
        console.error("Erro ao carregar categorias", error)
        setCategoriasAgrupadas({}) 
      } finally {
        setCarregandoCategorias(false)
      }
    }

    buscarCategorias()
  }, [])

  return { categoriasAgrupadas, carregandoCategorias }
}