import PaymentStatus from '@/models/PaymentStatus';
import { PaymentStatusFilter } from '@/filters/PaymentStatusFilter';
import FeedbackHandler from '@/utils/FeedbackHandler';
import { defineStore } from 'pinia';
import PaymentStatusImportResponse from '@/models/PaymentStatusImportResponse';

export interface PaymentStatusState {
  paymentStatuses: PaymentStatus[];
  paymentStatus: PaymentStatus;
  filter: PaymentStatusFilter;
  fb: FeedbackHandler;
  model: string;
  importExport: PaymentStatusImportResponse;
}

export const usePaymentStatusStore = defineStore('paymentStatus', {
  state: (): PaymentStatusState => ({
    paymentStatuses: [],
    paymentStatus: new PaymentStatus(),
    filter: new PaymentStatusFilter(),
    fb: new FeedbackHandler(),
    model: 'paymentStatus',
    importExport: new PaymentStatusImportResponse()
  }),
  actions: {
    resetPaymentStatus(): void {},
    async fetchPaymentStatuses() {},
    async findPaymentStatusById(paymentStatusId: number | string): Promise<PaymentStatus | any> {},
    updateFilter(newFilter: Partial<PaymentStatusFilter>) {},
    async createPaymentStatus(): Promise<PaymentStatus | any> {},
    async updatePaymentStatus(paymentStatusId: number | string): Promise<PaymentStatus | any> {},
    async deletePaymentStatus(paymentStatusId: number | string) {},
    async paymentStatusesImport(newImport: FormData): Promise<PaymentStatusImportResponse | any> {}
  }
});

