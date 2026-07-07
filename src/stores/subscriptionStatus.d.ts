import SubscriptionStatus from '@/models/SubscriptionStatus';
import { SubscriptionStatusFilter } from '@/filters/SubscriptionStatusFilter';
import FeedbackHandler from '@/utils/FeedbackHandler';
import { defineStore } from 'pinia';
import SubscriptionStatusImportResponse from '@/models/SubscriptionStatusImportResponse';

export interface SubscriptionStatusState {
  subscriptionStatuses: SubscriptionStatus[];
  subscriptionStatus: SubscriptionStatus;
  filter: SubscriptionStatusFilter;
  fb: FeedbackHandler;
  model: string;
  importExport: SubscriptionStatusImportResponse;
}

export const useSubscriptionStatusStore = defineStore('subscriptionStatus', {
  state: (): SubscriptionStatusState => ({
    subscriptionStatuses: [],
    subscriptionStatus: new SubscriptionStatus(),
    filter: new SubscriptionStatusFilter(),
    fb: new FeedbackHandler(),
    model: 'subscriptionStatus',
    importExport: new SubscriptionStatusImportResponse()
  }),
  actions: {
    resetSubscriptionStatus(): void {},
    async fetchSubscriptionStatuses() {},
    async findSubscriptionStatusById(subscriptionStatusId: number | string): Promise<SubscriptionStatus | any> {},
    updateFilter(newFilter: Partial<SubscriptionStatusFilter>) {},
    async createSubscriptionStatus(): Promise<SubscriptionStatus | any> {},
    async updateSubscriptionStatus(subscriptionStatusId: number | string): Promise<SubscriptionStatus | any> {},
    async deleteSubscriptionStatus(subscriptionStatusId: number | string) {},
    async subscriptionStatusesImport(newImport: FormData): Promise<SubscriptionStatusImportResponse | any> {}
  }
});

