import OrderStatus from '@/models/OrderStatus';
import { OrderStatusFilter } from '@/filters/OrderStatusFilter';
import FeedbackHandler from '@/utils/FeedbackHandler';
import { defineStore } from 'pinia';
import OrderStatusImportResponse from '@/models/OrderStatusImportResponse';

export interface OrderStatusState {
  orderStatuses: OrderStatus[];
  orderStatus: OrderStatus;
  fb: FeedbackHandler;
  model: string;
  importExport: OrderStatusImportResponse;
}

export const useOrderStatusStore = defineStore('orderStatus', {
  state: (): OrderStatusState => ({
    orderStatuses: [],
    orderStatus: new OrderStatus(),
    fb: new FeedbackHandler(),
    model: 'orderStatus',
    importExport: new OrderStatusImportResponse()
  }),
  actions: {
    resetOrderStatus(): void {},
    async fetchOrderStatuses() {},
    async findOrderStatusById(orderStatusId: number | string): Promise<OrderStatus | any> {},
    updateFilter(newFilter: Partial<OrderStatusFilter>) {},
    async createOrderStatus(): Promise<OrderStatus | any> {},
    async updateOrderStatus(orderStatusId: number | string) {},
    async deleteOrderStatus(orderStatusId: number | string) {},
    async orderStatusesImport(newImport: FormData): Promise<OrderStatusImportResponse | any> {}
  }
});

