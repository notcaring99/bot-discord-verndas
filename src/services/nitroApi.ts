import axios from 'axios'
import { Product, Transaction, PaymentRequest, Category, Offer } from '../types'

class NitroAPI {
  private baseURL: string
  private apiToken: string

  constructor(baseURL: string, apiToken: string) {
    this.baseURL = baseURL
    this.apiToken = apiToken
  }

  private getHeaders() {
    return {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }

  private getURL(endpoint: string) {
    return `${this.baseURL}${endpoint}?api_token=${this.apiToken}`
  }

  // Produtos
  async getProducts(): Promise<Product[]> {
    const response = await axios.get(this.getURL('public/v1/products'), {
      headers: this.getHeaders()
    })
    return response.data.data || []
  }

  async getProduct(hash: string): Promise<Product> {
    const response = await axios.get(this.getURL(`public/v1/products/${hash}`), {
      headers: this.getHeaders()
    })
    return response.data.data
  }

  async createProduct(product: Omit<Product, 'hash' | 'created_at' | 'updated_at'>): Promise<Product> {
    const response = await axios.post(this.getURL('public/v1/products'), product, {
      headers: this.getHeaders()
    })
    return response.data.data
  }

  async updateProduct(hash: string, product: Partial<Product>): Promise<Product> {
    const response = await axios.put(this.getURL(`public/v1/products/${hash}`), product, {
      headers: this.getHeaders()
    })
    return response.data.data
  }

  // Ofertas
  async createOffer(productHash: string, offer: Omit<Offer, 'hash' | 'product_hash' | 'created_at' | 'updated_at'>): Promise<Offer> {
    const response = await axios.post(this.getURL(`public/v1/products/${productHash}/offers`), offer, {
      headers: this.getHeaders()
    })
    return response.data.data
  }

  async updateOffer(productHash: string, offer: Partial<Offer>): Promise<Offer> {
    const response = await axios.put(this.getURL(`public/v1/products/${productHash}/offers`), offer, {
      headers: this.getHeaders()
    })
    return response.data.data
  }

  // Transações
  async getTransactions(): Promise<Transaction[]> {
    const response = await axios.get(this.getURL('public/v1/transactions'), {
      headers: this.getHeaders()
    })
    return response.data.data || []
  }

  async getTransaction(hash: string): Promise<Transaction> {
    const response = await axios.get(this.getURL(`public/v1/transactions/${hash}`), {
      headers: this.getHeaders()
    })
    return response.data.data
  }

  async createPayment(payment: PaymentRequest): Promise<Transaction> {
    const response = await axios.post(this.getURL('public/v1/transactions'), payment, {
      headers: this.getHeaders()
    })
    return response.data.data
  }

  async refundTransaction(hash: string, amount?: number): Promise<Transaction> {
    const response = await axios.post(this.getURL(`public/v1/transactions/${hash}/refund`), 
      amount ? { amount } : {}, 
      { headers: this.getHeaders() }
    )
    return response.data.data
  }

  // Categorias
  async getCategories(): Promise<Category[]> {
    const response = await axios.get(this.getURL('public/v1/products/categories'), {
      headers: this.getHeaders()
    })
    return response.data.data || []
  }

  // Parcelas
  async getInstallments(amount: number): Promise<any> {
    const response = await axios.get(this.getURL(`public/v1/installments&amount=${amount}`), {
      headers: this.getHeaders()
    })
    return response.data.data
  }

  // Checkout
  async getCheckout(hash: string): Promise<any> {
    const response = await axios.get(`${this.baseURL}public/v1/checkout/${hash}`)
    return response.data
  }
}

export default NitroAPI