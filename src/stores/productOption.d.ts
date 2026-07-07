// import ProductOption from '@/models/ProductOption';
import { ProductOption } from '@/models/Product.ts';
import ImportExport from '@/models/ImportExport';
import FeedbackHandler from '@/utils/FeedbackHandler';
import { defineStore } from 'pinia';

export interface ProductOptionState {
  productOptions: ProductOption[];
  productOption: ProductOption;
  fb: FeedbackHandler;
  model: string;
  importExport: ImportExport[];
  products: any[];
  productVariants: any[];
  productOptionGroups: any[];
}

export const useProductOptionStore = defineStore('productOption', {
  state: (): ProductOptionState => ({
    productOptions: [],
    productOption: new ProductOption(),
    importExport: [],
    fb: new FeedbackHandler(),
    model: 'productOption',
    products: [] as any[],
    productVariants: [] as any[],
    productOptionGroups: [] as any[],
  }),
  actions: {
    resetProductOption(): void {},
    async searchProductOptions(event: any, optionId: number): Promise<any> {},
    async getProductOptions() {},
    async fetchProducts() {},
    async fetchProductVariants() {},
    async fetchProductOptionGroups() {},
    async createProductOption(newProductOption: ProductOption): Promise<ProductOption | any> { },
    async updateProductOption(updatedProductOption: ProductOption) { },
    async getProductOptionById(id: number | string) { },
    async deleteProductOption(id: number | string) { },
    async productOptionsImport(newImport: FormData): Promise<any> {},
  }
}); 