import { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProdutos } from '../../hooks/useProdutos'
import { useUsuarioAtual } from '../../hooks/useUsuarioAtual'
import { useCategorias } from '../../hooks/useCategorias'
import type { Produto } from '../../types'


const formatarCategoria = (cat: string) =>
  cat.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())

interface ItemCarrinho extends Produto {
  quantidade: number
}

const LIMITE = 30

export function Home() {
  const navegar = useNavigate()
  const { eGerente, estaLogado } = useUsuarioAtual()

  const [pagina, setPagina] = useState(1)

  const [busca, setBusca] = useState('')
  const [buscaDebounced, setBuscaDebounced] = useState('')
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('')
  const [ordenacao, setOrdenacao] = useState('')
  const [avaliacaoMinima, setAvaliacaoMinima] = useState(0)

  const [menuAberto, setMenuAberto] = useState(false)
  const [carrinhoAberto, setCarrinhoAberto] = useState(false)
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([])
  const [feedbackId, setFeedbackId] = useState<string | null>(null)

  const { categorias } = useCategorias()

  useEffect(() => {
    const t = setTimeout(() => {
      setBuscaDebounced(busca)
      setPagina(1)
    }, 350)
    return () => clearTimeout(t)
  }, [busca])

  const { produtos, total, carregando, erro } = useProdutos(
    pagina,
    LIMITE,
    buscaDebounced,
    categoriaSelecionada,
    ordenacao,
    avaliacaoMinima,
  )

  const totalPaginas = Math.ceil(total / LIMITE)

  const adicionarAoCarrinho = useCallback((produto: Produto) => {
    setCarrinho((prev) => {
      const existe = prev.find((i) => i.id_produto === produto.id_produto)
      if (existe) {
        return prev.map((i) =>
          i.id_produto === produto.id_produto ? { ...i, quantidade: i.quantidade + 1 } : i,
        )
      }
      return [...prev, { ...produto, quantidade: 1 }]
    })
    setFeedbackId(produto.id_produto)
    setTimeout(() => setFeedbackId(null), 1500)
  }, [])

  const removerDoCarrinho = (id: string) =>
    setCarrinho((prev) => prev.filter((i) => i.id_produto !== id))

  const alterarQuantidade = (id: string, delta: number) =>
    setCarrinho((prev) =>
      prev
        .map((i) => (i.id_produto === id ? { ...i, quantidade: i.quantidade + delta } : i))
        .filter((i) => i.quantidade > 0),
    )

  const totalItens = carrinho.reduce((acc, i) => acc + i.quantidade, 0)

  const logout = () => {
    localStorage.removeItem('token')
    navegar('/login')
  }

  const mudarFiltro = (cb: () => void) => {
    cb()
    setPagina(1)
  }

  const selecionarCategoria = (cat: string) => mudarFiltro(() => setCategoriaSelecionada(cat))
  const mudarOrdenacao = (val: string) => mudarFiltro(() => setOrdenacao(val))
  const mudarAvaliacao = (val: number) => mudarFiltro(() => setAvaliacaoMinima(val))

  const limparFiltros = () => {
    setBusca('')
    setBuscaDebounced('')
    setCategoriaSelecionada('')
    setOrdenacao('')
    setAvaliacaoMinima(0)
    setPagina(1)
  }

  const isFiltrado =
    buscaDebounced !== '' ||
    categoriaSelecionada !== '' ||
    ordenacao !== '' ||
    avaliacaoMinima > 0

  const irParaPagina = (p: number) => {
    if (p < 1 || p > totalPaginas) return
    setPagina(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const gerarPaginas = () => {
    const paginas: (number | string)[] = []
    if (totalPaginas <= 7) {
      for (let i = 1; i <= totalPaginas; i++) paginas.push(i)
    } else {
      paginas.push(1)
      if (pagina > 3) paginas.push('...')
      for (let i = Math.max(2, pagina - 1); i <= Math.min(totalPaginas - 1, pagina + 1); i++) {
        paginas.push(i)
      }
      if (pagina < totalPaginas - 2) paginas.push('...')
      paginas.push(totalPaginas)
    }
    return paginas
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-200">

      {menuAberto && (
        <div className="fixed inset-0 z-20 bg-black/40 backdrop-blur-sm" onClick={() => setMenuAberto(false)} />
      )}

      {/* ── MENU LATERAL ──────────────────────────────────────────────────── */}
      <aside className={`
        fixed top-0 left-0 h-full w-72 z-30 bg-white dark:bg-gray-900 shadow-xl flex flex-col
        transition-transform duration-300 ease-in-out
        ${menuAberto ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800">
          <span className="font-semibold text-gray-700 dark:text-gray-200">Menu</span>
          <button
            onClick={() => setMenuAberto(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-400"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-6">

          {/* Carrinho */}
          <div>
            <button
              onClick={() => setCarrinhoAberto(!carrinhoAberto)}
              className="flex items-center justify-between w-full px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300 font-medium text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6h13M10 19a1 1 0 100 2 1 1 0 000-2zm7 0a1 1 0 100 2 1 1 0 000-2z" />
                </svg>
                Carrinho
              </div>
              {totalItens > 0 && (
                <span className="text-xs bg-gray-900 dark:bg-white dark:text-gray-900 text-white px-2 py-0.5 rounded-full font-medium">
                  {totalItens}
                </span>
              )}
            </button>

            {carrinhoAberto && (
              <div className="mt-2 space-y-2 pl-1">
                {carrinho.length === 0 ? (
                  <p className="text-xs text-gray-400 dark:text-gray-500 py-2 px-2">Carrinho vazio</p>
                ) : (
                  carrinho.map((item) => (
                    <div key={item.id_produto} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="w-10 h-10 rounded-md overflow-hidden shrink-0 bg-gray-100 dark:bg-gray-700">
                        {item.imagem_url ? (
                          <img src={item.imagem_url} alt={item.nome_produto} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-lg">📦</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-200 truncate">{item.nome_produto}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <button onClick={() => alterarQuantidade(item.id_produto, -1)} className="w-5 h-5 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded text-xs hover:bg-gray-300 dark:hover:bg-gray-600 transition">-</button>
                          <span className="text-xs font-semibold w-4 text-center">{item.quantidade}</span>
                          <button onClick={() => alterarQuantidade(item.id_produto, 1)} className="w-5 h-5 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded text-xs hover:bg-gray-300 dark:hover:bg-gray-600 transition">+</button>
                        </div>
                      </div>
                      <button onClick={() => removerDoCarrinho(item.id_produto)} className="text-gray-300 hover:text-red-400 transition text-xs shrink-0">✕</button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Filtros */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between px-1">
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Filtros</p>
              {isFiltrado && (
                <button
                  onClick={limparFiltros}
                  className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition underline"
                >
                  Limpar
                </button>
              )}
            </div>

            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block px-1">Ordenar por</label>
              <select
                value={ordenacao}
                onChange={(e) => mudarOrdenacao(e.target.value)}
                className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
              >
                <option value="">Padrão</option>
                <option value="nome_asc">Nome A-Z</option>
                <option value="nome_desc">Nome Z-A</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block px-1">
                Avaliação mínima: {avaliacaoMinima > 0 ? `${avaliacaoMinima}★` : 'Todas'}
              </label>
              <input
                type="range" min={0} max={5} step={1}
                value={avaliacaoMinima}
                onChange={(e) => mudarAvaliacao(Number(e.target.value))}
                className="w-full accent-gray-900 dark:accent-white"
              />
              <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 px-1">
                <span>Todas</span><span>5★</span>
              </div>
            </div>
          </div>
        </div>

        {eGerente && (
          <div className="px-4 py-5 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-1">
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-3 mb-2">Gerente</p>
            <button
              onClick={() => navegar('/produtos/novo')}
              className="w-full text-left text-sm px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              Adicionar produto
            </button>
          </div>
        )}
      </aside>

      {/* ── HEADER ────────────────────────────────────────────────────────── */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center gap-4 shrink-0">
        <button
          onClick={() => setMenuAberto(true)}
          className="flex flex-col gap-1.5 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition shrink-0"
        >
          <span className="w-5 h-0.5 bg-gray-600 dark:bg-gray-400 rounded block" />
          <span className="w-5 h-0.5 bg-gray-600 dark:bg-gray-400 rounded block" />
          <span className="w-5 h-0.5 bg-gray-600 dark:bg-gray-400 rounded block" />
        </button>

        <div className="flex-1 flex justify-center">
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full max-w-lg bg-gray-100 dark:bg-gray-800 border border-transparent dark:border-gray-700 focus:border-gray-300 dark:focus:border-gray-600 rounded-full px-5 py-2.5 text-sm focus:outline-none transition placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-800 dark:text-gray-200"
          />
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => { setMenuAberto(true); setCarrinhoAberto(true) }}
            className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6h13M10 19a1 1 0 100 2 1 1 0 000-2zm7 0a1 1 0 100 2 1 1 0 000-2z" />
            </svg>
            {totalItens > 0 && (
              <span className="absolute -top-1 -right-1 text-xs bg-gray-900 dark:bg-white dark:text-gray-900 text-white w-4 h-4 rounded-full flex items-center justify-center">
                {totalItens}
              </span>
            )}
          </button>

          {estaLogado ? (
            <button onClick={logout} className="text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition px-3 py-2">Sair</button>
          ) : (
            <button onClick={() => navegar('/login')} className="text-sm bg-gray-900 dark:bg-white dark:text-gray-900 text-white px-5 py-2.5 rounded-full font-medium hover:opacity-80 transition">Login</button>
          )}
        </div>
      </header>

      {/* ── BARRA DE CATEGORIAS ───────────────────────────────────────────── */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 py-3 shrink-0">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => selecionarCategoria('')}
            className={`shrink-0 text-xs px-4 py-1.5 rounded-full font-medium transition whitespace-nowrap
              ${categoriaSelecionada === ''
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
          >
            Todas
          </button>
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => selecionarCategoria(cat)}
              className={`shrink-0 text-xs px-4 py-1.5 rounded-full font-medium transition whitespace-nowrap
                ${categoriaSelecionada === cat
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
            >
              {formatarCategoria(cat)}
            </button>
          ))}
        </div>
      </div>

      {/* ── CONTEÚDO ──────────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto p-6">

        {/* Contador + indicador de filtros ativos */}
        {!carregando && !erro && (
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {total === 0
                ? 'Nenhum produto encontrado'
                : `${total.toLocaleString('pt-BR')} produto${total !== 1 ? 's' : ''}`
              }
              {totalPaginas > 1 && (
                <span className="ml-1 text-gray-400 dark:text-gray-500">
                  — página {pagina} de {totalPaginas.toLocaleString('pt-BR')}
                </span>
              )}
            </p>
            {isFiltrado && (
              <div className="flex items-center gap-3">
                {/* Badges dos filtros ativos */}
                <div className="flex items-center gap-1.5">
                  {categoriaSelecionada && (
                    <span className="text-xs bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-2.5 py-1 rounded-full flex items-center gap-1">
                      {formatarCategoria(categoriaSelecionada)}
                      <button onClick={() => selecionarCategoria('')} className="opacity-60 hover:opacity-100">✕</button>
                    </span>
                  )}
                  {ordenacao && (
                    <span className="text-xs bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-2.5 py-1 rounded-full flex items-center gap-1">
                      {ordenacao === 'nome_asc' ? 'A-Z' : 'Z-A'}
                      <button onClick={() => mudarOrdenacao('')} className="opacity-60 hover:opacity-100">✕</button>
                    </span>
                  )}
                  {avaliacaoMinima > 0 && (
                    <span className="text-xs bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-2.5 py-1 rounded-full flex items-center gap-1">
                      {avaliacaoMinima}★+
                      <button onClick={() => mudarAvaliacao(0)} className="opacity-60 hover:opacity-100">✕</button>
                    </span>
                  )}
                </div>
                <button
                  onClick={limparFiltros}
                  className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition underline"
                >
                  Limpar tudo
                </button>
              </div>
            )}
          </div>
        )}

        {carregando && (
          <div className="flex flex-col items-center justify-center mt-24 gap-3">
            <div className="w-8 h-8 border-2 border-gray-300 dark:border-gray-700 border-t-gray-600 dark:border-t-gray-400 rounded-full animate-spin" />
            <p className="text-sm text-gray-400 dark:text-gray-500">Carregando produtos...</p>
          </div>
        )}

        {erro && <p className="text-sm text-red-400 text-center mt-16">{erro}</p>}

        {!carregando && !erro && produtos.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
            {produtos.map((produto) => {
              const noCarrinho = carrinho.find((i) => i.id_produto === produto.id_produto)
              const emFeedback = feedbackId === produto.id_produto
              return (
                <div
                  key={produto.id_produto}
                  className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden hover:shadow-md transition flex flex-col"
                >
                  <div className="bg-gray-100 dark:bg-gray-800 h-40 flex items-center justify-center overflow-hidden">
                    {produto.imagem_url ? (
                      <img src={produto.imagem_url} alt={produto.nome_produto} className="w-full h-full object-cover" />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                      </svg>
                    )}
                  </div>

                  <div className="p-4 flex flex-col gap-3 flex-1">
                    <div>
                      <span className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                        {formatarCategoria(produto.categoria_produto)}
                      </span>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mt-0.5 line-clamp-2">
                        {produto.nome_produto}
                      </p>
                    </div>

                    <div className="flex gap-2 mt-auto">
                      <button
                        onClick={() => navegar(`/produtos/${produto.id_produto}`)}
                        className="flex-1 text-xs bg-gray-900 dark:bg-white dark:text-gray-900 text-white py-2 rounded-xl font-medium hover:opacity-80 transition"
                      >
                        Ver mais
                      </button>
                      <button
                        onClick={() => adicionarAoCarrinho(produto)}
                        className={`relative p-2 border rounded-xl transition ${
                          emFeedback
                            ? 'border-green-400 bg-green-50 dark:bg-green-900/30'
                            : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                      >
                        {noCarrinho && (
                          <span className="absolute -top-1.5 -right-1.5 text-xs bg-gray-900 dark:bg-white dark:text-gray-900 text-white w-4 h-4 rounded-full flex items-center justify-center">
                            {noCarrinho.quantidade}
                          </span>
                        )}
                        <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 ${emFeedback ? 'text-green-500' : 'text-gray-500 dark:text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6h13M10 19a1 1 0 100 2 1 1 0 000-2zm7 0a1 1 0 100 2 1 1 0 000-2z" />
                        </svg>
                      </button>
                    </div>

                    {eGerente && (
                      <button
                        onClick={() => navegar(`/produtos/${produto.id_produto}/editar`)}
                        className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition text-center"
                      >
                        Editar
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {!carregando && !erro && produtos.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-24 gap-3 text-gray-400 dark:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-sm">Nenhum produto encontrado</p>
            <button onClick={limparFiltros} className="text-xs underline hover:text-gray-600 dark:hover:text-gray-400 transition">
              Limpar filtros
            </button>
          </div>
        )}

        {/* ── PAGINAÇÃO ──────────────────────────────────────────────────── */}
        {!carregando && !erro && totalPaginas > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8 pb-4">
            <button
              onClick={() => irParaPagina(pagina - 1)}
              disabled={pagina === 1}
              className="text-sm px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ←
            </button>

            {gerarPaginas().map((p, i) =>
              p === '...' ? (
                <span key={`ellipsis-${i}`} className="text-sm text-gray-400 dark:text-gray-500 px-1">...</span>
              ) : (
                <button
                  key={p}
                  onClick={() => irParaPagina(Number(p))}
                  className={`text-sm w-9 h-9 rounded-lg transition ${
                    pagina === p
                      ? 'bg-gray-900 dark:bg-white dark:text-gray-900 text-white font-medium'
                      : 'border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {p}
                </button>
              ),
            )}

            <button
              onClick={() => irParaPagina(pagina + 1)}
              disabled={pagina === totalPaginas}
              className="text-sm px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              →
            </button>
          </div>
        )}
      </main>
    </div>
  )
}