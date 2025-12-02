export interface MercadoPagoItem {
  id: string;
  title: string;
  description?: string;
  picture_url?: string;
  category_id?: string;
  quantity: number;
  currency_id: 'BRL';
  unit_price: number;
}

export interface PaymentStatus {
  id: string;
  status: 'approved' | 'pending' | 'rejected' | 'cancelled' | 'unknown';
  status_detail: string;
  external_reference: string;
  payment_method_id: string;
  transaction_amount: number;
  date_created: string;
  date_approved?: string;
}

export interface PreferenceConfig {
  items: MercadoPagoItem[];
  baseUrl: string;
  isTest: boolean;
}

export interface ProcessedItem {
  id: string;
  title: string;
  description: string;
  image?: any;
  price: number;
  category: string;
  quantity: number;
}

export interface PreferenceResponse {
  id: string;
  init_point: string;
  sandbox_init_point?: string;
  external_reference: string;
} 