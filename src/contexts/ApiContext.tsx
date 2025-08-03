import React, { createContext, useContext, useState, useEffect } from 'react'
import { ApiConfig } from '../types'

interface ApiContextType {
  config: ApiConfig
  updateConfig: (newConfig: Partial<ApiConfig>) => void
  isConfigured: boolean
}

const ApiContext = createContext<ApiContextType | undefined>(undefined)

export const useApi = () => {
  const context = useContext(ApiContext)
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider')
  }
  return context
}

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<ApiConfig>(() => {
    const saved = localStorage.getItem('api-config')
    return saved ? JSON.parse(saved) : {
      nitro: {
        endpoint: 'https://api.nitropagamentos.com/api/',
        api_token: ''
      }
    }
  })

  const updateConfig = (newConfig: Partial<ApiConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }))
  }

  const isConfigured = Boolean(config.nitro.api_token)

  useEffect(() => {
    localStorage.setItem('api-config', JSON.stringify(config))
  }, [config])

  return (
    <ApiContext.Provider value={{ config, updateConfig, isConfigured }}>
      {children}
    </ApiContext.Provider>
  )
}