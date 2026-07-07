import StockStatus from '@/models/StockStatus';
import { StockStatusFilter } from '@/filters/StockStatusFilter';
import FeedbackHandler from '@/utils/FeedbackHandler';
import { defineStore } from 'pinia';
import StockStatusImportResponse from '@/models/StockStatusImportResponse';

export interface StockStatusState {
  stockStatuses: StockStatus[];
  stockStatus: StockStatus;
  filter: StockStatusFilter;
  fb: FeedbackHandler;
  model: string;
  importExport: StockStatusImportResponse;
}

export const useStockStatusStore = defineStore('stockStatus', {
  state: (): StockStatusState => ({
    stockStatuses: [],
    stockStatus: new StockStatus(),
    filter: new StockStatusFilter(),
    fb: new FeedbackHandler(),
    model: 'stockStatus',
    importExport: new StockStatusImportResponse()
  }),
  actions: {
    resetStockStatus(): void {},
    async fetchStockStatuses() {},
    async findStockStatusById(stockStatusId: number | string): Promise<StockStatus | any> {},
    updateFilter(newFilter: Partial<StockStatusFilter>) {},
    async createStockStatus(): Promise<StockStatus | any> {},
    async updateStockStatus(stockStatusId: number | string) {},
    async deleteStockStatus(stockStatusId: number | string) {},
    async stockStatusesImport(newImport: FormData): Promise<StockStatusImportResponse | any> {}
  }
});

