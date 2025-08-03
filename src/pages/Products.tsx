import React, { useState, useEffect } from 'react'
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useApi } from '../contexts/ApiContext'
import NitroAPI from '../services/nitroApi'
import { Product, Category } from '../types'
import ProductModal from '../components/ProductModal'

const Products: React.FC = () => {
  const { config, isConfigured } = useApi()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  useEffect(() => {
    if (isConfigured) {
      loadData()
    } else {
      setLoading(false)
    }
  }, [isConfigured])

  const loadData = async () => {
    try {
      const api = new NitroAPI(config.nitro.endpoint, config.nitro.api_token)
      const [productsData, categoriesData] = await Promise.all([
        api.getProducts(),
        api.getCategories()
      ])
      setProducts(productsData)
      setCategories(categoriesData)
    } catch (error) {
      console.error('Erro ao carregar produtos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProduct = () => {
    setSelectedProduct(null)
    setModalOpen(true)
  }

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product)
    setModalOpen(true)
  }

  const handleSaveProduct = async (productData: any) => {
    try {
      const api = new NitroAPI(config.nitro.endpoint, config.nitro.api_token)
      
      if (selectedProduct) {
        await api.updateProduct(selectedProduct.hash, productData)
      } else {
        await api.createProduct(productData)
      }
      
      await loadData()
      setModalOpen(false)
    } catch (error) {
      console.error('Erro ao salvar produto:', error)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value / 100)
  }

  const getCategoryName = (id: number) => {
    const category = categories.find(c => c.id === id)
    return category?.name || 'Categoria não encontrada'
  }

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
        <h2 className="text-2xl font-bold text-gray-900">Produtos</h2>
        <button
          onClick={handleCreateProduct}
          className="btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Novo Produto</span>
        </button>
      </div>

      <div className="card">
        {products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preço
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.hash} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {product.cover && (
                          <img
                            className="h-10 w-10 rounded-lg object-cover mr-4"
                            src={product.cover}
                            alt={product.title}
                          />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {product.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {product.hash}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getCategoryName(product.id_category)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        product.product_type === 'digital' 
                          ? 'text-blue-600 bg-blue-100' 
                          : 'text-green-600 bg-green-100'
                      }`}>
                        {product.product_type === 'digital' ? 'Digital' : 'Físico'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(product.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="text-discord-600 hover:text-discord-900"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum produto</h3>
            <p className="mt-1 text-sm text-gray-500">
              Comece criando seu primeiro produto.
            </p>
            <div className="mt-6">
              <button onClick={handleCreateProduct} className="btn-primary">
                Criar Produto
              </button>
            </div>
          </div>
        )}
      </div>

      <ProductModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveProduct}
        product={selectedProduct}
        categories={categories}
      />
    </div>
  )
}

export default Products