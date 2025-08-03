import React, { useState, useEffect } from 'react'
import { 
  CreditCardIcon, 
  ShoppingBagIcon, 
  UsersIcon, 
  CurrencyDollarIcon,
  TrendingUpIcon,
  TrendingDownIcon
} from '@heroicons/react/24/outline'
import { useApi } from '../contexts/ApiContext'
import NitroAPI from '../services/nitroApi'

interface DashboardStats {
  totalSales: number
  totalProducts: number
  totalTransactions: number
  totalCustomers: number
  recentTransactions: any[]
  salesGrowth: number
}

const Dashboard: React.FC = () => {
  const { config, isConfigured } = useApi()
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    totalProducts: 0,
    totalTransactions: 0,
    totalCustomers: 0,
    recentTransactions: [],
    salesGrowth: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isConfigured) {
      loadDashboardData()
    } else {
      setLoading(false)
    }
  }, [isConfigured])

  const loadDashboardData = async () => {
    try {
      const api = new NitroAPI(config.nitro.endpoint, config.nitro.api_token)
      
      const [products, transactions] = await Promise.all([
        api.getProducts(),
        api.getTransactions()
      ])

      const totalSales = transactions
        .filter(t => t.status === 'paid')
        .reduce((sum, t) => sum + t.amount, 0)

      const uniqueCustomers = new Set(transactions.map(t => t.customer.email)).size

      setStats({
        totalSales,
        totalProducts: products.length,
        totalTransactions: transactions.length,
        totalCustomers: uniqueCustomers,
        recentTransactions: transactions.slice(0, 5),
        salesGrowth: 12.5 // Mock data
      })
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value / 100)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR')
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

  if (!isConfigured) {
    return (
      <div className="text-center py-12">
        <CogIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Configuração necessária</h3>
        <p className="mt-1 text-sm text-gray-500">
          Configure suas credenciais da API Nitro nas configurações para começar.
        </p>
        <div className="mt-6">
          <a href="/settings" className="btn-primary">
            Ir para Configurações
          </a>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const statCards = [
    {
      name: 'Vendas Totais',
      value: formatCurrency(stats.totalSales),
      icon: CurrencyDollarIcon,
      change: `+${stats.salesGrowth}%`,
      changeType: 'increase'
    },
    {
      name: 'Produtos',
      value: stats.totalProducts.toString(),
      icon: ShoppingBagIcon,
      change: '+2',
      changeType: 'increase'
    },
    {
      name: 'Transações',
      value: stats.totalTransactions.toString(),
      icon: CreditCardIcon,
      change: '+12',
      changeType: 'increase'
    },
    {
      name: 'Clientes',
      value: stats.totalCustomers.toString(),
      icon: UsersIcon,
      change: '+8',
      changeType: 'increase'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div key={stat.name} className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className="h-8 w-8 text-discord-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.name}
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stat.value}
                    </div>
                    <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                      stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.changeType === 'increase' ? (
                        <TrendingUpIcon className="h-4 w-4 flex-shrink-0 self-center" />
                      ) : (
                        <TrendingDownIcon className="h-4 w-4 flex-shrink-0 self-center" />
                      )}
                      <span className="ml-1">{stat.change}</span>
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Transações Recentes</h3>
          <a href="/transactions" className="text-sm text-discord-600 hover:text-discord-500">
            Ver todas
          </a>
        </div>
        
        {stats.recentTransactions.length > 0 ? (
          <div className="overflow-hidden">
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
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.recentTransactions.map((transaction) => (
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                        {getStatusText(transaction.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(transaction.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <CreditCardIcon className="mx-auto h-12 w-12 text-gray-400" />
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

export default Dashboard