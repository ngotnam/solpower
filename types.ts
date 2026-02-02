
export type TabType = 'home' | 'products' | 'support' | 'account' | 'notifications';

export type ProductCategory = 'all' | 'panel' | 'inverter' | 'battery' | 'pump_inverter' | 'electrical' | 'cabinet' | 'diy_combo';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  model: string;
  serial?: string;
  price?: string;
  image: string;
  specs: Record<string, string>;
  warrantyMonths: number;
}

export interface WarrantyStatus {
  serial: string;
  productName: string;
  model: string;
  activationDate: string;
  expiryDate: string;
  status: 'valid' | 'near' | 'expired';
}

export interface SupportTicket {
  id: string;
  productId: string;
  productName: string;
  serial: string;
  issueType: string;
  description: string;
  status: 'received' | 'processing' | 'completed';
  createdAt: string;
}

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  type: 'system' | 'warranty' | 'promotion' | 'service';
  timestamp: string;
  isRead: boolean;
}
