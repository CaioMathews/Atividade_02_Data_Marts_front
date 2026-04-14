import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

api.interceptors.request.use((configuracao) => {
  const token = localStorage.getItem('token')
  if (token) {
    configuracao.headers.Authorization = `Bearer ${token}`
  }
  return configuracao
})

export default api