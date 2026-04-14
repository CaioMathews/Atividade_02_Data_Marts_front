import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Home } from './pages/Home/Home'
import { Login } from './pages/Login/Login'
import { DetalhesProduto } from './pages/DetalhesProduto/DetalhesProduto'
import { FormularioProduto } from './pages/FormularioProduto/FormularioProduto'

function RotaProtegida({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token')
  if (!token) {
    return <Navigate to="/login" />
  }
  return <>{children}</>
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/produtos/:id_produto" element={<DetalhesProduto />} />
        <Route path="/produtos/novo" element={<RotaProtegida><FormularioProduto /></RotaProtegida>} />
        <Route path="/produtos/:id_produto/editar" element={<RotaProtegida><FormularioProduto /></RotaProtegida>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App