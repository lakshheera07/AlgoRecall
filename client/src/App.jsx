import { Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import AddProblemPage from './pages/AddProblemPage'
import AnalysisPage from './pages/AnalysisPage'
import EditProblemPage from './pages/EditProblemPage'
import HomePage from './pages/HomePage'
import ProblemListPage from './pages/ProblemListPage'
import RevisionHubPage from './pages/RevisionHubPage'
import RevisionSessionPage from './pages/RevisionSessionPage'

function App() {
  const location = useLocation()
  const isRevisionSession = location.pathname.startsWith('/revision/session')

  return (
    <div className="app-shell">
      {!isRevisionSession ? <Navbar /> : null}

      <main className="content-shell">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/add" element={<AddProblemPage />} />
          <Route path="/problems" element={<ProblemListPage />} />
          <Route path="/problems/:id/edit" element={<EditProblemPage />} />
          <Route path="/revision" element={<RevisionHubPage />} />
          <Route path="/revision/session" element={<RevisionSessionPage />} />
          <Route path="/analysis" element={<AnalysisPage />} />
          <Route path="/analytics" element={<AnalysisPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
