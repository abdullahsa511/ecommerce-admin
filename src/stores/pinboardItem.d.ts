import { PinboardItem } from '@/models/Pinboard.ts';
import FeedbackHandler from '@/utils/FeedbackHandler';
import { defineStore } from 'pinia';

export interface PinboardItemState {
  pinboard:[];
  pinboardItems: [];
  fb: FeedbackHandler;
}

export const usePinboardItemStore = defineStore('pinboardItem', {
  state: (): PinboardItemState => ({
    pinboard: [],
    pinboardItems: [],
    fb: new FeedbackHandler()
  }),
  actions: {
    async fetchPinboardItems() {},
    async fetchPinboardItemById(pinboardItemId: number | string): Promise<PinboardItem | any> {},
    async createPinboardItem(newPinboardItems: PinboardItem[]): Promise<PinboardItem[] | any> {},
    async updatePinboardItem(updatedPinboardItem: PinboardItem): Promise<PinboardItem | any> {},
    async deletePinboardItem(pinboardItemId: number | string) {},
    async deletePinboardItemsByPinboardId(pinboardId: number | string) {},
    async getProductList(query: string): Promise<any[]> {},
  }
}); 