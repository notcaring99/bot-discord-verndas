import React, { useState } from 'react'
import { Save, Key, Globe, CreditCard } from 'lucide-react'
import { useApi } from '../contexts/ApiContext'

const Settings: React.FC = () => {
  const { config, updateConfig } = useApi()
  const [localConfig, setLocalConfig] = useState(config)
  const [saved, setSaved] = useState(false)
  const [testingConnection, setTestingConnection] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'success' | 'error' | null>(null)

  const handleSave = () => {
    updateConfig(localConfig)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const testConnection = async () => {
    if (!localConfig.nitro.api_token) {
      alert('Por favor, insira o token da API primeiro.')
      return
    }

    setTestingConnection(true)
    setConnectionStatus(null)

    try {
      const response = await fetch(
        `${localConfig.nitro.endpoint}public/v1/products?api_token=${localConfig.nitro.api_token}`,
        {
          headers: {
            'Accept': 'application/json'
          }
        }
      )

      if (response.ok) {
        setConnectionStatus('success')
      } else {
        setConnectionStatus('error')
      }
    } catch (error) {
      setConnectionStatus('error')
    } finally {
      setTestingConnection(false)
    }
  }

  const handleNitroConfigChange = (field: string, value: string) => {
    setLocalConfig(prev => ({
      ...prev,
      nitro: {
        ...prev.nitro,
        [field]: value
      }
    }))
  }

  const handleMercadoPagoConfigChange = (field: string, value: string) => {
    setLocalConfig(prev => ({
      ...prev,
      mercadopago: {
        ...prev.mercadopago,
        [field]: value
      }
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Configurações</h2>
        <button
          onClick={handleSave}
          className={`btn-primary flex items-center space-x-2 ${saved ? 'bg-green-600' : ''}`}
        >
          <Save className="h-5 w-5" />
          <span>{saved ? 'Salvo!' : 'Salvar'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configurações Nitro Pagamentos */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-nitro-100 rounded-lg">
              <CreditCard className="h-6 w-6 text-nitro-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Nitro Pagamentos</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="label">Endpoint da API</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={localConfig.nitro.endpoint}
                  onChange={(e) => handleNitroConfigChange('endpoint', e.target.value)}
                  className="input-field pl-10"
                  placeholder="https://api.nitropagamentos.com/api/"
                />
              </div>
            </div>

            <div>
              <label className="label">Token da API</label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  value={localConfig.nitro.api_token}
                  onChange={(e) => handleNitroConfigChange('api_token', e.target.value)}
                  className="input-field pl-10"
                  placeholder="Seu token da API Nitro"
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={testConnection}
                disabled={testingConnection}
                className="btn-secondary flex-1"
              >
                {testingConnection ? 'Testando...' : 'Testar Conexão'}
              </button>
              
              {connectionStatus && (
                <div className={`flex items-center px-3 py-2 rounded-lg ${
                  connectionStatus === 'success' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {connectionStatus === 'success' ? '✅ Conectado' : '❌ Erro'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Configurações Mercado Pago (Opcional) */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CreditCard className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Mercado Pago (Opcional)</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="label">Access Token</label>
              <input
                type="password"
                value={localConfig.mercadopago?.access_token || ''}
                onChange={(e) => handleMercadoPagoConfigChange('access_token', e.target.value)}
                className="input-field"
                placeholder="Seu access token do Mercado Pago"
              />
            </div>

            <div>
              <label className="label">Public Key</label>
              <input
                type="text"
                value={localConfig.mercadopago?.public_key || ''}
                onChange={(e) => handleMercadoPagoConfigChange('public_key', e.target.value)}
                className="input-field"
                placeholder="Sua public key do Mercado Pago"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Informações sobre APIs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card bg-nitro-50 border-nitro-200">
          <h3 className="text-lg font-medium text-nitro-900 mb-4">🚀 Sobre a API Nitro</h3>
          <div className="text-sm text-nitro-800 space-y-2">
            <p>A API Nitro Pagamentos oferece:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Pagamentos via PIX, Cartão e Boleto</li>
              <li>Gestão completa de produtos e ofertas</li>
              <li>Webhooks para atualizações em tempo real</li>
              <li>Reembolsos automáticos</li>
              <li>Relatórios detalhados</li>
            </ul>
            <p className="mt-3">
              <a 
                href="https://docs.nitropagamentos.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-nitro-600 hover:text-nitro-500 underline"
              >
                Ver documentação completa →
              </a>
            </p>
          </div>
        </div>

        <div className="card bg-blue-50 border-blue-200">
          <h3 className="text-lg font-medium text-blue-900 mb-4">💡 Dicas de Configuração</h3>
          <div className="text-sm text-blue-800 space-y-2">
            <p><strong>Token da API:</strong> Encontre no painel da Nitro em "Configurações > API"</p>
            <p><strong>Webhooks:</strong> Configure a URL de postback para receber atualizações</p>
            <p><strong>Ambiente:</strong> Use o ambiente de produção para vendas reais</p>
            <p><strong>Segurança:</strong> Mantenha seus tokens seguros e nunca os compartilhe</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings