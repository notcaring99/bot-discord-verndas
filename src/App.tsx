import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Transactions from './pages/Transactions'
import Settings from './pages/Settings'
import BotConfig from './pages/BotConfig'
import { ApiProvider } from './contexts/ApiContext'

function App() {
  return (
    <ApiProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/bot-config" element={<BotConfig />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </ApiProvider>
  )
}

export default App