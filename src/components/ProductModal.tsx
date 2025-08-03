import React, { useState, useEffect } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Product, Category } from '../types'

interface ProductModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (product: any) => void
  product: Product | null
  categories: Category[]
}

const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSave,
  product,
  categories
}) => {
  const [formData, setFormData] = useState({
    title: '',
    cover: '',
    sale_page: '',
    payment_type: 1,
    product_type: 'digital' as 'digital' | 'fisico',
    delivery_type: 1,
    id_category: 1,
    amount: 0
  })

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title,
        cover: product.cover || '',
        sale_page: product.sale_page,
        payment_type: product.payment_type,
        product_type: product.product_type,
        delivery_type: product.delivery_type,
        id_category: product.id_category,
        amount: product.amount
      })
    } else {
      setFormData({
        title: '',
        cover: '',
        sale_page: '',
        payment_type: 1,
        product_type: 'digital',
        delivery_type: 1,
        id_category: categories[0]?.id || 1,
        amount: 0
      })
    }
  }, [product, categories])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const formatCurrency = (value: number) => {
    return (value / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {product ? 'Editar Produto' : 'Novo Produto'}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Título do Produto</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="label">URL da Imagem</label>
                <input
                  type="url"
                  value={formData.cover}
                  onChange={(e) => handleInputChange('cover', e.target.value)}
                  className="input-field"
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>

              <div>
                <label className="label">Página de Vendas</label>
                <input
                  type="url"
                  value={formData.sale_page}
                  onChange={(e) => handleInputChange('sale_page', e.target.value)}
                  className="input-field"
                  placeholder="https://exemplo.com/produto"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Tipo do Produto</label>
                  <select
                    value={formData.product_type}
                    onChange={(e) => handleInputChange('product_type', e.target.value)}
                    className="input-field"
                  >
                    <option value="digital">Digital</option>
                    <option value="fisico">Físico</option>
                  </select>
                </div>

                <div>
                  <label className="label">Categoria</label>
                  <select
                    value={formData.id_category}
                    onChange={(e) => handleInputChange('id_category', parseInt(e.target.value))}
                    className="input-field"
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="label">
                  Preço (em centavos) - {formatCurrency(formData.amount)}
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', parseInt(e.target.value) || 0)}
                  className="input-field"
                  min="0"
                  step="1"
                  placeholder="10000 = R$ 100,00"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Tipo de Pagamento</label>
                  <select
                    value={formData.payment_type}
                    onChange={(e) => handleInputChange('payment_type', parseInt(e.target.value))}
                    className="input-field"
                  >
                    <option value={1}>Pagamento Único</option>
                  </select>
                </div>

                <div>
                  <label className="label">Tipo de Entrega</label>
                  <select
                    value={formData.delivery_type}
                    onChange={(e) => handleInputChange('delivery_type', parseInt(e.target.value))}
                    className="input-field"
                  >
                    <option value={1}>Área de Membros da Plataforma</option>
                    <option value={2}>Área de Membros Externa</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  {product ? 'Atualizar' : 'Criar'} Produto
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductModal