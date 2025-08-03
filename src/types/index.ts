export interface Product {
  hash: string
  title: string
  cover: string | null
  sale_page: string
  payment_type: number
  product_type: 'digital' | 'fisico'
  delivery_type: number
  id_category: number
  amount: number
  created_at: string
  updated_at: string
}

export interface Offer {
  hash: string
  title: string
  cover: string | null
  amount: number
  product_hash: string
  created_at: string
  updated_at: string
}

export interface Transaction {
  hash: string
  amount: number
  status: 'pending' | 'paid' | 'cancelled' | 'refunded'
  payment_method: 'pix' | 'credit_card' | 'billet'
  customer: Customer
  cart: CartItem[]
  installments?: number
  created_at: string
  updated_at: string
}

export interface Customer {
  name: string
  email: string
  phone_number: string
  document: string
  street_name: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  zip_code: string
}

export interface CartItem {
  product_hash: string
  title: string
  cover: string | null
  price: number
  quantity: number
  operation_type: number
  tangible: boolean
}

export interface Card {
  number: string
  holder_name: string
  exp_month: number
  exp_year: number
  cvv: string
}

export interface PaymentRequest {
  amount: number
  offer_hash?: string
  payment_method: 'pix' | 'credit_card' | 'billet'
  card?: Card
  customer: Customer
  cart: CartItem[]
  installments?: number
  expire_in_days?: number
  postback_url?: string
}

export interface Category {
  id: number
  name: string
}

export interface BotConfig {
  token: string
  prefix: string
  channels: {
    sales: string
    logs: string
    support: string
  }
  roles: {
    admin: string
    moderator: string
    customer: string
  }
  messages: {
    welcome: string
    purchase_success: string
    purchase_error: string
  }
}

export interface ApiConfig {
  nitro: {
    endpoint: string
    api_token: string
  }
  mercadopago?: {
    access_token: string
    public_key: string
  }
}