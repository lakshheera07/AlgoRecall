import { Route, Routes } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import AddProblemPage from './pages/AddProblemPage'
import HomePage from './pages/HomePage'
import ProblemListPage from './pages/ProblemListPage'
import RecallPage from './pages/RecallPage'

function App() {
  return (
    <div className="app-shell">
      <Navbar />

      <main className="content-shell">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/add" element={<AddProblemPage />} />
          <Route path="/problems" element={<ProblemListPage />} />
          <Route path="/recall/:id" element={<RecallPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
