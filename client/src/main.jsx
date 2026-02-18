import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './index.css'
import App from './App.jsx'
import { ProblemsProvider } from './state/ProblemsContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ProblemsProvider>
        <App />
        <ToastContainer position="top-right" autoClose={2000} />
      </ProblemsProvider>
    </BrowserRouter>
  </StrictMode>,
)
