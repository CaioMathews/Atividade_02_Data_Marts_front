export interface Produto {
  id_produto: string
  nome_produto: string
  categoria_produto: string
  peso_produto_gramas: number | null
  comprimento_centimetros: number | null
  altura_centimetros: number | null
  largura_centimetros: number | null
  imagem_url: string | null
}

export interface AvaliacaoPedido {
  id_avaliacao: string
  id_pedido: string
  avaliacao: number
  titulo_comentario: string | null
  comentario: string | null
  data_comentario: string | null
  data_resposta: string | null
}

export interface DetalhesProduto extends Produto {
  total_avaliacoes: number
  media_avaliacao: number | null
  avaliacoes: AvaliacaoPedido[]
}

export interface LoginEntrada {
  email_usuario: string
  senha_usuario: string
}

export interface TokenResposta {
  access_token: string
}