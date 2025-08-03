import React, { useState, useEffect } from 'react'
import { EyeIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import { useApi } from '../contexts/ApiContext'
import NitroAPI from '../services/nitroApi'
import { Transaction } from '../types'

const Transactions: React.FC = () => {
  const { config, isConfigured } = useApi()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    if (isConfigured) {
      loadTransactions()
    } else {
      setLoading(false)
    }
  }, [isConfigured])

  const loadTransactions = async () => {
    try {
      const api = new NitroAPI(config.nitro.endpoint, config.nitro.api_token)
      const data = await api.getTransactions()
      setTransactions(data)
    } catch (error) {
      console.error('Erro ao carregar transações:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRefund = async (hash: string) => {
    if (!confirm('Tem certeza que deseja reembolsar esta transação?')) return
    
    try {
      const api = new NitroAPI(config.nitro.endpoint, config.nitro.api_token)
      await api.refundTransaction(hash)
      await loadTransactions()
    } catch (error) {
      console.error('Erro ao reembolsar transação:', error)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value / 100)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('pt-BR')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'cancelled': return 'text-red-600 bg-red-100'
      case 'refunded': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Pago'
      case 'pending': return 'Pendente'
      case 'cancelled': return 'Cancelado'
      case 'refunded': return 'Reembolsado'
      default: return status
    }
  }

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'pix': return 'PIX'
      case 'credit_card': return 'Cartão de Crédito'
      case 'billet': return 'Boleto'
      default: return method
    }
  }

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'all') return true
    return transaction.status === filter
  })

  if (!isConfigured) {
    return (
      <div className="text-center py-12">
        <h3 className="mt-2 text-sm font-medium text-gray-900">Configuração necessária</h3>
        <p className="mt-1 text-sm text-gray-500">
          Configure suas credenciais da API Nitro nas configurações.
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="card">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Transações</h2>
        <button
          onClick={loadTransactions}
          className="btn-secondary flex items-center space-x-2"
        >
          <ArrowPathIcon className="h-5 w-5" />
          <span>Atualizar</span>
        </button>
      </div>

      {/* Filtros */}
      <div className="card">
        <div className="flex space-x-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all' 
                ? 'bg-discord-100 text-discord-700' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFilter('paid')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'paid' 
                ? 'bg-green-100 text-green-700' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Pagas
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'pending' 
                ? 'bg-yellow-100 text-yellow-700' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Pendentes
          </button>
          <button
            onClick={() => setFilter('cancelled')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'cancelled' 
                ? 'bg-red-100 text-red-700' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Canceladas
          </button>
        </div>
      </div>

      <div className="card">
        {filteredTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Método
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.hash} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {transaction.customer.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {transaction.customer.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(transaction.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getPaymentMethodText(transaction.payment_method)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                        {getStatusText(transaction.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(transaction.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button className="text-discord-600 hover:text-discord-900">
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        {transaction.status === 'paid' && (
                          <button
                            onClick={() => handleRefund(transaction.hash)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <ArrowPathIcon className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma transação</h3>
            <p className="mt-1 text-sm text-gray-500">
              As transações aparecerão aqui quando forem criadas.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Transactions