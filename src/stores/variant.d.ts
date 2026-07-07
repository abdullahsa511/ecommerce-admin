import Variant from '@/models/Variant';
import FeedbackHandler from '@/utils/FeedbackHandler';
import { defineStore } from 'pinia';
import Product from '@/models/Product';
import { ProductVariant } from '@/models/Product.ts';

export interface VariantState {
  variants: ProductVariant[];
  variant: ProductVariant;
  fb: FeedbackHandler;
  model: string;
  importExport: ImportExport[];
  products: any[];
}

export const useVariantStore = defineStore('variant', {
  state: (): VariantState => ({
    variants: [],
    variant: new ProductVariant(),
    importExport: [],
    fb: new FeedbackHandler(),
    model: 'variant',
    products: [] as any[],
  }),
  actions: {
    resetVariants() {},
    async getVariants() {},
    async createVariant(newVariant: Variant): Promise<Variant | any> { },
    async updateVariant(updatedVariant: Variant) { },
    async getVariantById(id: number | string) { },
    async deleteVariant(id: number | string) { },
    async importVariants(newImport: FormData): Promise<any> {},
    async fetchProducts() {},
  }
}); 