import { useState, useEffect } from 'react'
import api from '../services/api'
import type { DetalhesProduto } from '../types'

export function useDetalhesProduto(id_produto: string) {
  const [produto, setProduto] = useState<DetalhesProduto | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    const buscarProduto = async () => {
      try {
        setCarregando(true)
        setErro(null)
        const [respostaProduto, respostaAvaliacoes] = await Promise.all([
          api.get(`/produtos/${id_produto}`),
          api.get(`/produtos/${id_produto}/avaliacoes`),
        ])
        setProduto({ ...respostaProduto.data, ...respostaAvaliacoes.data })
      } catch (e) {
        setErro('Erro ao carregar produto.')
      } finally {
        setCarregando(false)
      }
    }

    buscarProduto()
  }, [id_produto])

  return { produto, carregando, erro }
}