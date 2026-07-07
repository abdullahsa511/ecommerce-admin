
import Order from '@/models/Order';
import OrderImportResponse from '@/models/OrderImport';
import FeedbackHandler from '@/utils/FeedbackHandler';
import { defineStore } from 'pinia';

export interface OrderState {
  orders: Order[];
  order: Order;
  fb: FeedbackHandler;
  modle: string;
  orderStatuses: OrderStatus[];
  importExport: OrderImportResponse;
  customers: any[];
}

export const useOrderStore = defineStore('order', {
  state: (): OrderState => ({
    orders: [],
    order: new Order(),
    fb: new FeedbackHandler(),
    modle: 'order',
    orderStatuses: [],
    importExport: new OrderImportResponse(),
    customers: [],
  }),
  actions: {
    resetOrder() {},
    async fetchOrders() {},
    async fetchOrderById(orderId: number | string): Promise<Order | any> {},
    async createOrder(newOrder: Order): Promise<Order | any> {},
    async updateOrder(updatedOrder: Order) {},
    async deleteOrder(orderId: number | string) {},
    async getOrderStatuses(): Promise<OrderStatus[]> { },
    async importOrders(newImport: FormData): Promise<any> {},
    async getCustomers(): Promise<any[]> {}
  }
}); 