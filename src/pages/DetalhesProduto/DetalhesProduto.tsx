import { useParams, useNavigate } from 'react-router-dom'
import { useDetalhesProduto } from '../../hooks/useDetalhesProduto'
import { useUsuarioAtual } from '../../hooks/useUsuarioAtual'

export function DetalhesProduto() {
  const { id_produto } = useParams<{ id_produto: string }>()
  const navegar = useNavigate()
  const { produto, carregando, erro } = useDetalhesProduto(id_produto!)
  const { eGerente } = useUsuarioAtual()

  if (carregando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Carregando produto...</p>
      </div>
    )
  }

  if (erro || !produto) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{erro || 'Produto não encontrado.'}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* TOPO */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navegar('/')}
          className="text-sm text-gray-500 hover:text-blue-600 transition"
        >
          ← Voltar
        </button>
        {eGerente && (
          <button
            onClick={() => navegar(`/produtos/${id_produto}/editar`)}
            className="ml-auto text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            ✏️ Editar produto
          </button>
        )}
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-6">

        {/* INFORMAÇÕES DO PRODUTO */}
        <div className="flex gap-6 mb-8">
          <div className="bg-gray-100 rounded-xl w-48 h-48 flex items-center justify-center text-6xl shrink-0">
            📦
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs text-blue-500 uppercase font-medium">
              {produto.categoria_produto}
            </span>
            <h1 className="text-2xl font-bold text-gray-800">
              {produto.nome_produto}
            </h1>

            <div className="mt-2 grid grid-cols-2 gap-x-8 gap-y-1 text-sm text-gray-600">
              {produto.peso_produto_gramas && (
                <p>⚖️ Peso: <span className="font-medium">{produto.peso_produto_gramas}g</span></p>
              )}
              {produto.comprimento_centimetros && (
                <p>📏 Comprimento: <span className="font-medium">{produto.comprimento_centimetros}cm</span></p>
              )}
              {produto.altura_centimetros && (
                <p>📐 Altura: <span className="font-medium">{produto.altura_centimetros}cm</span></p>
              )}
              {produto.largura_centimetros && (
                <p>📦 Largura: <span className="font-medium">{produto.largura_centimetros}cm</span></p>
              )}
            </div>
          </div>
        </div>

        {/* AVALIAÇÕES */}
        <div className="border-t pt-6">
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-lg font-bold text-gray-800">Avaliações</h2>
            <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1 rounded-full">
              <span className="text-yellow-500">⭐</span>
              <span className="text-sm font-semibold text-gray-700">
                {produto.media_avaliacao
                  ? produto.media_avaliacao.toFixed(1)
                  : 'Sem avaliações'}
              </span>
              <span className="text-xs text-gray-400">
                ({produto.total_avaliacoes} avaliações)
              </span>
            </div>
          </div>

          {produto.avaliacoes.length === 0 ? (
            <p className="text-sm text-gray-400">Nenhuma avaliação ainda.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {produto.avaliacoes.map((avaliacao) => (
                <div
                  key={avaliacao.id_avaliacao}
                  className="border rounded-xl p-4"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-yellow-500">
                      {'⭐'.repeat(avaliacao.avaliacao)}
                    </span>
                    <span className="text-sm font-semibold text-gray-700">
                      {avaliacao.titulo_comentario || 'Sem título'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {avaliacao.comentario || 'Sem comentário'}
                  </p>
                  {avaliacao.data_comentario && (
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(avaliacao.data_comentario).toLocaleDateString('pt-BR')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}