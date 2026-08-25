import { api } from '@/lib/axios';

export interface StoreItem {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  cost: number;
  stock: number;
  isActive: boolean;
  createdAt: string;
  _count?: {
    orders: number;
  };
}

export interface StoreOrder {
  id: string;
  userId: string;
  storeItemId: string;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  coinsSpent: number;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  trackingNumber?: string | null;
  courierName?: string | null;
  createdAt: string;
  item: StoreItem;
  user: {
    name: string;
    email: string;
    phone: string;
  };
}

export const StoreAPI = {
  // Inventory
  getItems: () => api.get<{ data: StoreItem[] }>('/store/admin/items').then((res: any) => res.data.data),
  createItem: (data: Partial<StoreItem>) => api.post<{ data: StoreItem }>('/store/admin/items', data).then((res: any) => res.data.data),
  updateItem: (id: string, data: Partial<StoreItem>) => api.put<{ data: StoreItem }>(`/store/admin/items/${id}`, data).then((res: any) => res.data.data),

  // Orders
  getOrders: () => api.get<{ data: StoreOrder[] }>('/store/admin/orders').then((res: any) => res.data.data),
  updateOrderStatus: (id: string, data: { status: string; trackingNumber?: string; courierName?: string }) => 
    api.patch<{ data: StoreOrder }>(`/store/admin/orders/${id}/status`, data).then((res: any) => res.data.data),
};
