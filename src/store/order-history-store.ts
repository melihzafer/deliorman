import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface OrderHistory {
  orderId: string;
  date: string;
  items: OrderItem[];
  total: number;
  paymentMethod: 'cash' | 'card';
  status: 'pending' | 'confirmed' | 'preparing' | 'on-the-way' | 'delivered' | 'cancelled';
  customer: {
    name: string;
    phone: string;
    address: string;
  };
  notes?: string;
}

interface OrderHistoryStore {
  orders: OrderHistory[];
  addOrder: (order: OrderHistory) => void;
  getOrderById: (orderId: string) => OrderHistory | undefined;
  getAllOrders: () => OrderHistory[];
  updateOrderStatus: (orderId: string, status: OrderHistory['status']) => void;
}

export const useOrderHistoryStore = create<OrderHistoryStore>()(
  persist(
    (set, get) => ({
      orders: [],

      addOrder: (order) => {
        set((state) => ({
          orders: [order, ...state.orders], // New orders at the beginning
        }));
      },

      getOrderById: (orderId) => {
        return get().orders.find(order => order.orderId === orderId);
      },

      getAllOrders: () => {
        return get().orders;
      },

      updateOrderStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map(order =>
            order.orderId === orderId
              ? { ...order, status }
              : order
          ),
        }));
      },
    }),
    {
      name: 'order-history-storage',
    }
  )
);
