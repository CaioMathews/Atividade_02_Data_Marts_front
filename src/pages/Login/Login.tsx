import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export function Login() {
  const navegar = useNavigate()
  const { login, cadastrar, carregando, erro, setErro } = useAuth()

  const [modoCadastro, setModoCadastro] = useState(false)
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [sucesso, setSucesso] = useState('')

  const aoEnviar = async (e: React.FormEvent) => {
    e.preventDefault()
    setSucesso('')

    if (modoCadastro) {
      const ok = await cadastrar({
        nome_usuario: nome,
        email_usuario: email,
        senha_usuario: senha,
      })

      if (ok) {
        setSucesso('Conta criada com sucesso! Faça login para continuar.')
        setModoCadastro(false)
        setSenha('') 
      }
    } else {
      const ok = await login({ email_usuario: email, senha_usuario: senha })
      if (ok) {
        navegar('/')
      }
    }
  }

  const alternarModo = () => {
    setModoCadastro(!modoCadastro)
    setErro(null)
    setSucesso('')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-4 transition-colors font-sans">
      
      {/* Botão Voltar */}
      <div className="w-full max-w-md mb-6">
        <button 
          onClick={() => navegar('/')}
          className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Voltar para a loja
        </button>
      </div>

      {/* Card Principal */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-lg p-8 sm:p-10 w-full max-w-md">

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {modoCadastro ? 'Criar Conta' : 'Bem-vindo'}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {modoCadastro ? 'Preencha os dados abaixo para se registrar.' : 'Acesse sua conta para continuar.'}
          </p>
        </div>

        {/* Feedbacks Visuais */}
        {sucesso && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl text-green-700 dark:text-green-400 text-sm font-medium text-center">
            {sucesso}
          </div>
        )}
        {erro && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm font-medium text-center">
            {erro}
          </div>
        )}

        <form onSubmit={aoEnviar} className="flex flex-col gap-4">
          
          {modoCadastro && (
            <div>
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1.5">
                Nome Completo
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: João da Silva"
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                required={modoCadastro}
              />
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1.5">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1.5">
              Senha
            </label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={carregando}
            className="mt-4 w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-3.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {carregando 
              ? 'Aguarde...' 
              : modoCadastro ? 'Criar Conta' : 'Entrar na Conta'}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-gray-100 dark:border-gray-800 pt-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {modoCadastro ? 'Já tem uma conta?' : 'Ainda não tem conta?'}
            <button
              type="button"
              onClick={alternarModo}
              className="ml-2 text-gray-900 dark:text-white font-medium hover:underline"
            >
              {modoCadastro ? 'Faça login' : 'Crie uma agora'}
            </button>
          </p>
        </div>

      </div>
    </div>
  )
}