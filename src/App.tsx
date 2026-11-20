import { Route, Routes } from 'react-router'
import Layout from './components/Layout'
import NotFoundPage from './pages/NotFoundPage'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
