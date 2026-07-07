// import { Quote, QuoteItem } from '@/models/Quote.ts';
import { QuoteItem } from '@/models/Quote';
import FeedbackHandler from '@/utils/FeedbackHandler';
import { defineStore } from 'pinia';

export interface QuoteItemState {
  quoteItems: QuoteItem[];
  quoteItem: QuoteItem;
  fb: FeedbackHandler;
  model: string;
}

export const useQuoteItemStore = defineStore('quoteItem', {
  state: (): QuoteItemState => ({
    quoteItems: [],
    quoteItem: new QuoteItem(),
    fb: new FeedbackHandler(),
    model: 'quoteItem',

  }),
  actions: {
    async fetchQuoteItems() {},
    async fetchQuoteItemById(quoteItemId: number | string): Promise<QuoteItem | any> {},
    async createQuoteItem(newQuoteItem: QuoteItem[]): Promise<QuoteItem[] | any> {},
    async updateQuoteItem(updatedQuoteItem: QuoteItem) {},
    async deleteQuoteItem(quoteItemId: number | string) {},
    async getProductList(query: string): Promise<any[]> {},

    async searchQuoteItems(query: string): Promise<QuoteItem[]> {},
  }
}); 