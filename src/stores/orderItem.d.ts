import { Order, OrderItem } from '@/models/Order.ts';
import FeedbackHandler from '@/utils/FeedbackHandler';
import { defineStore } from 'pinia';

export interface OrderItemState {
  orderItems: OrderItem[];
  fb: FeedbackHandler;
}

export const useOrderItemStore = defineStore('orderItem', {
  state: (): OrderItemState => ({
    orderItems: [],
    fb: new FeedbackHandler()
  }),
  actions: {
    async fetchOrderItems() {},
    async fetchOrderItemById(orderItemId: number | string): Promise<OrderItem | any> {},
    async createOrderItem(newOrderItem: OrderItem[]): Promise<OrderItem[] | any> {},
    async updateOrderItem(updatedOrderItem: OrderItem) {},
    async deleteOrderItem(orderItemId: number | string) {},
    async getProductList(query: string): Promise<any[]> {},
  }
}); 