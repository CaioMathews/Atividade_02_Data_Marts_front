import { useState, useEffect } from 'react'
import api from '../services/api'
import type { Produto } from '../types'

export function useProdutos(
  pagina: number = 1,
  limite: number = 20,
  busca: string = '',
  categoria: string = '',
  ordenacao: string = '',
  avaliacaoMinima: number = 0,
) {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [total, setTotal] = useState(0)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    const buscarProdutos = async () => {
      try {
        setCarregando(true)
        setErro(null)

        const params = new URLSearchParams({
          skip: String((pagina - 1) * limite),
          limit: String(limite),
        })
        if (busca)                params.append('busca', busca)
        if (categoria)            params.append('categoria', categoria)
        if (ordenacao)            params.append('ordenar', ordenacao)
        if (avaliacaoMinima > 0)  params.append('avaliacao_minima', String(avaliacaoMinima))

        const resposta = await api.get(`/produtos/?${params.toString()}`)
        setProdutos(resposta.data.produtos)
        setTotal(resposta.data.total)
      } catch {
        setErro('Erro ao carregar produtos.')
      } finally {
        setCarregando(false)
      }
    }

    buscarProdutos()
  }, [pagina, limite, busca, categoria, ordenacao, avaliacaoMinima])

  return { produtos, total, carregando, erro }
}