import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../services/api' 

export function FormularioProduto() {
  const { id_produto } = useParams<{ id_produto: string }>()
  const navegar = useNavigate()
  const editando = !!id_produto

  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const [nomeProduto, setNomeProduto] = useState('')
  const [categoriaProduto, setCategoriaProduto] = useState('')
  const [imagemUrl, setImagemUrl] = useState('')
  const [pesoProduto, setPesoProduto] = useState('')
  const [comprimento, setComprimento] = useState('')
  const [altura, setAltura] = useState('')
  const [largura, setLargura] = useState('')

  useEffect(() => {
    if (!editando) return

    const buscarProduto = async () => {
      try {
        const resposta = await api.get(`/produtos/${id_produto}`)
        const produto = resposta.data
        setNomeProduto(produto.nome_produto)
        setCategoriaProduto(produto.categoria_produto)
        setImagemUrl(produto.imagem_url || '')
        setPesoProduto(produto.peso_produto_gramas ?? '')
        setComprimento(produto.comprimento_centimetros ?? '')
        setAltura(produto.altura_centimetros ?? '')
        setLargura(produto.largura_centimetros ?? '')
      } catch {
        setErro('Erro ao carregar produto.')
      }
    }

    buscarProduto()
  }, [id_produto])

  const aoEnviar = async (e: React.FormEvent) => {
    e.preventDefault()
    setCarregando(true)
    setErro(null)

    const dados = {
      nome_produto: nomeProduto,
      categoria_produto: categoriaProduto,
      imagem_url: imagemUrl || null, 
      peso_produto_gramas: pesoProduto ? Number(pesoProduto) : null,
      comprimento_centimetros: comprimento ? Number(comprimento) : null,
      altura_centimetros: altura ? Number(altura) : null,
      largura_centimetros: largura ? Number(largura) : null,
    }

    try {
      if (editando) {
        await api.patch(`/produtos/${id_produto}`, dados)
      } else {
        await api.post('/produtos/', dados)
      }
      navegar('/')
    } catch {
      setErro('Erro ao salvar produto.')
    } finally {
      setCarregando(false)
    }
  }

  const aoDeletar = async () => {
    if (!confirm('Tem certeza que deseja deletar este produto?')) return
    try {
      setCarregando(true)
      await api.delete(`/produtos/${id_produto}`)
      navegar('/')
    } catch {
      setErro('Erro ao deletar produto.')
      setCarregando(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center py-12 px-4 transition-colors font-sans">
      
      <div className="w-full max-w-2xl mb-6">
        <button 
          onClick={() => navegar('/')}
          className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Voltar para a loja
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-lg p-8 sm:p-10 w-full max-w-2xl">
        
        <div className="mb-8 border-b border-gray-100 dark:border-gray-800 pb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {editando ? 'Editar Produto' : 'Novo Produto'}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Preencha as informações do produto abaixo.
            </p>
          </div>
        </div>

        <form onSubmit={aoEnviar} className="flex flex-col gap-6">

          {/* Nome e Categoria */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1.5">
                Nome do produto *
              </label>
              <input
                type="text"
                value={nomeProduto}
                onChange={(e) => setNomeProduto(e.target.value)}
                placeholder="Ex: Teclado Mecânico"
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1.5">
                Categoria *
              </label>
              <input
                type="text"
                value={categoriaProduto}
                onChange={(e) => setCategoriaProduto(e.target.value)}
                placeholder="Ex: informatica_acessorios"
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                required
              />
            </div>
          </div>

          {/* URL da Imagem */}
          <div>
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1.5">
              URL da Imagem
            </label>
            <input
              type="url"
              value={imagemUrl}
              onChange={(e) => setImagemUrl(e.target.value)}
              placeholder="https://exemplo.com/imagem.png"
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
          </div>

          {/* Dimensões e Peso */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1.5">
                Peso (g)
              </label>
              <input
                type="number"
                value={pesoProduto}
                onChange={(e) => setPesoProduto(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1.5">
                Comp. (cm)
              </label>
              <input
                type="number"
                value={comprimento}
                onChange={(e) => setComprimento(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1.5">
                Altura (cm)
              </label>
              <input
                type="number"
                value={altura}
                onChange={(e) => setAltura(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1.5">
                Largura (cm)
              </label>
              <input
                type="number"
                value={largura}
                onChange={(e) => setLargura(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all"
              />
            </div>
          </div>

          {erro && (
            <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm font-medium text-center">
              {erro}
            </div>
          )}

          <div className="pt-4 flex flex-col gap-3 border-t border-gray-100 dark:border-gray-800 mt-2">
            <button
              type="submit"
              disabled={carregando}
              className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-3.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 shadow-sm"
            >
              {carregando ? 'Salvando...' : editando ? 'Salvar alterações' : 'Criar produto'}
            </button>

            {editando && (
              <button
                type="button"
                onClick={aoDeletar}
                disabled={carregando}
                className="w-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/50 py-3.5 rounded-xl text-sm font-semibold hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors disabled:opacity-50"
              >
                Deletar Produto
              </button>
            )}
          </div>

        </form>
      </div>
    </div>
  )
}