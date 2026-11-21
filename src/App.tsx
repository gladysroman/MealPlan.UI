import { Route, Routes } from 'react-router'
import AppShell from './components/AppShell'
import NotFoundPage from './pages/NotFoundPage'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<AppShell />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
