import { useParams, useNavigate } from 'react-router-dom'
import { useDetalhesProduto } from '../../hooks/useDetalhesProduto'
import { useUsuarioAtual } from '../../hooks/useUsuarioAtual'

const formatarCategoria = (cat: string) =>
  cat.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())

export function DetalhesProduto() {
  const { id_produto } = useParams<{ id_produto: string }>()
  const navegar = useNavigate()
  const { produto, carregando, erro } = useDetalhesProduto(id_produto!)
  const { eGerente } = useUsuarioAtual()

  if (carregando) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-sm font-bold text-slate-400 animate-pulse">Carregando detalhes...</p>
      </div>
    )
  }

  if (erro || !produto) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 p-8 rounded-[2rem] text-center">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">✕</div>
          <h3 className="font-bold text-red-900 dark:text-red-300 mb-1">Ops, algo deu errado</h3>
          <p className="text-xs text-red-500 dark:text-red-400 font-medium leading-relaxed">{erro || 'Produto não encontrado.'}</p>
          <button onClick={() => navegar('/')} className="mt-6 text-sm font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors">
            ← Voltar ao Catálogo
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 font-sans pb-16 transition-colors duration-300">
      
      {/* ── TOPO (Navegação) ── */}
      <header className="sticky top-0 z-30 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border-b border-slate-200 dark:border-zinc-800 px-6 lg:px-12 py-4 flex items-center justify-between">
        <button
          onClick={() => navegar('/')}
          className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 transition-colors group"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Voltar ao Catálogo
        </button>

        {eGerente && (
          <button
            onClick={() => navegar(`/produtos/${id_produto}/editar`)}
            className="text-xs bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-5 py-2.5 rounded-xl font-bold hover:scale-105 active:scale-95 transition-all shadow-sm"
          >
            Editar Registro
          </button>
        )}
      </header>

      <main className="max-w-5xl mx-auto px-6 mt-12 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* ── CARD PRINCIPAL (Produto) ── */}
        <section className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-[2.5rem] shadow-sm p-6 sm:p-10 flex flex-col md:flex-row gap-10">
          
          {/* Área da Imagem */}
          <div className="w-full md:w-1/2 lg:w-2/5 aspect-square bg-slate-50 dark:bg-zinc-800 rounded-[2rem] flex items-center justify-center shrink-0 overflow-hidden relative border border-slate-100 dark:border-zinc-800/50">
            {produto.imagem_url ? (
              <img 
                src={produto.imagem_url} 
                alt={produto.nome_produto} 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            ) : (
              <div className="text-slate-300 dark:text-zinc-600 flex flex-col items-center">
                <svg className="w-20 h-20 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <span className="text-xs font-medium uppercase tracking-widest">Sem Imagem</span>
              </div>
            )}
            <span className="absolute top-4 left-4 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-500 border border-slate-100 dark:border-zinc-700 shadow-sm">
              {formatarCategoria(produto.categoria_produto)}
            </span>
          </div>

          {/* Dados Técnicos */}
          <div className="flex-1 flex flex-col justify-center">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-tight mb-6">
              {produto.nome_produto}
            </h1>
              <div className="grid grid-cols-2 gap-4 text-sm bg-slate-50 dark:bg-zinc-800/50 rounded-3xl p-6 border border-slate-100 dark:border-zinc-800">
              
              {/*Bloco de Vendas em destaque */}
              <div className="flex flex-col col-span-2 border-b border-slate-200 dark:border-zinc-700 pb-4 mb-2">
                <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Unidades Vendidas</span>
                <span className="font-black text-2xl text-indigo-600 dark:text-indigo-400">
                  {produto.total_vendas !== undefined ? produto.total_vendas : 0} <span className="text-sm font-normal text-slate-400 dark:text-zinc-500">unidades</span>
                </span>
              </div>

              {produto.peso_produto_gramas ? (
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Peso</span>
                  <span className="font-semibold">{produto.peso_produto_gramas} <span className="text-slate-400 font-normal">g</span></span>
                </div>
              ) : <div className="hidden"></div>}
              
              {produto.comprimento_centimetros ? (
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Comprimento</span>
                  <span className="font-semibold">{produto.comprimento_centimetros} <span className="text-slate-400 font-normal">cm</span></span>
                </div>
              ) : <div className="hidden"></div>}
              
              {produto.altura_centimetros ? (
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Altura</span>
                  <span className="font-semibold">{produto.altura_centimetros} <span className="text-slate-400 font-normal">cm</span></span>
                </div>
              ) : <div className="hidden"></div>}
              
              {produto.largura_centimetros ? (
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Largura</span>
                  <span className="font-semibold">{produto.largura_centimetros} <span className="text-slate-400 font-normal">cm</span></span>
                </div>
              ) : <div className="hidden"></div>}

              {!produto.peso_produto_gramas && !produto.comprimento_centimetros && !produto.altura_centimetros && !produto.largura_centimetros && (
                <div className="col-span-2 text-slate-400 text-xs font-medium italic">Nenhuma dimensão cadastrada.</div>
              )}
            </div>
            
          </div>
        </section>

        {/* ── SEÇÃO DE AVALIAÇÕES ── */}
        <section className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-[2.5rem] shadow-sm p-6 sm:p-10">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Avaliações de Clientes</h2>
            
            <div className="flex items-center gap-3 bg-slate-50 dark:bg-zinc-800 px-4 py-2 rounded-2xl border border-slate-100 dark:border-zinc-700 w-fit">
              <span className="text-yellow-400">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              </span>
              <div>
                <span className="text-sm font-black text-slate-800 dark:text-white">
                  {produto.media_avaliacao ? produto.media_avaliacao.toFixed(1) : '—'}
                </span>
                <span className="text-[10px] font-bold text-slate-400 ml-2 uppercase tracking-widest">
                  ({produto.total_avaliacoes} {produto.total_avaliacoes === 1 ? 'review' : 'reviews'})
                </span>
              </div>
            </div>
          </div>

          {!produto.avaliacoes || produto.avaliacoes.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-slate-400 bg-slate-50 dark:bg-zinc-800/30 rounded-3xl border border-dashed border-slate-200 dark:border-zinc-700">
              <svg className="w-10 h-10 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              <p className="text-sm font-medium">Este produto ainda não recebeu avaliações.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {produto.avaliacoes.map((avaliacao: any) => (
                <div
                  key={avaliacao.id_avaliacao}
                  className="bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 rounded-2xl p-5 hover:border-indigo-100 dark:hover:border-indigo-900/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex text-yellow-400 text-xs">
                      {'★'.repeat(avaliacao.avaliacao).padEnd(5, '☆')}
                    </div>
                    {avaliacao.data_comentario && (
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {new Date(avaliacao.data_comentario).toLocaleDateString('pt-BR')}
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-zinc-200 mb-1 leading-tight">
                    {avaliacao.titulo_comentario || 'Sem título'}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                    {avaliacao.comentario || 'O cliente optou por não deixar um comentário escrito.'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  )
}