

import Quote from '@/models/Quote';
import QuoteImportResponse from '@/models/QuoteImport';
import FeedbackHandler from '@/utils/FeedbackHandler';
import { defineStore } from 'pinia';

export interface QuoteState {
  quotes: Quote[];
  quote: Quote;
  quoteItems: [];
  fb: FeedbackHandler;
  modle:string;
  importExport: QuoteImportResponse;
  quoteStatuses: QuoteStatus[];
  productList: any[];
  customers: any[];
}

export const useQuoteStore = defineStore('quote', {
  state: (): QuoteState => ({
    quotes: [],
    quote: new Quote(),
    fb: new FeedbackHandler(),
    modle: 'quote',
    importExport: new QuoteImportResponse(),
    quoteStatuses: [],
    productList: [],
    customers: [],
    quoteItems: []
  }),
  actions: {
    resetQuote() {},
    async fetchQuotes() {},
    async fetchQuoteById(quoteId: number | string): Promise<Quote | any> {},
    async createQuote(newQuote: Quote): Promise<Quote | any> {},
    async updateQuote(updatedQuote: Quote): Promise<Quote | any> {},
    async deleteQuote(quoteId: number | string) {},
    async getQuoteStatuses(): Promise<QuoteStatus[]> {},
    async getProductList(query: string): Promise<any[]> {},

    async importQuotes(newImport: FormData): Promise<any> {},
    async getCustomers(): Promise<any[]> {},
    async showQuoteItems(quoteId: number | string): Promise<any[]> {},
    async acceptQuote(quoteId: number | string): Promise<any> {},
  }
}); 