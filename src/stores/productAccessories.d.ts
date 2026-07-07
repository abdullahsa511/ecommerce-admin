
import { ProductAccessories } from '@/models/Product.ts';
import ProductAccessoriesImportResponse from '@/models/ProductAccessoriesImportResponse';
import FeedbackHandler from '@/utils/FeedbackHandler';
import { defineStore } from 'pinia';

export interface ProductAccessoriesState {
  productAccessoriess: ProductAccessories[];
  productAccessories: ProductAccessories;
  fb: FeedbackHandler;
  model: string;
  importExport: ProductAccessoriesImportResponse;
  products: any[];
  items: any[];
}

export const useProductAccessoriesStore = defineStore('productAccessories', {
  state: (): ProductAccessoriesState => ({
    productAccessoriess: [],
    productAccessories: new ProductAccessories(),
    importExport: new ProductAccessoriesImportResponse(),
    fb: new FeedbackHandler(),
    model: 'productAccessories',
    products: [] as any[],
    items: [] as any[],
  }),
  actions: {
    resetProductAccessories(): void {},
    async searchProductAccessoriess(event: any, optionId: number): Promise<any> {},
    async getProductAccessoriess() {},
    async fetchProducts() {},
    async fetchProductVariants() {},
    async createProductAccessories(newProductAccessories: ProductAccessories): Promise<ProductAccessories | any> { },
    async updateProductAccessories(updatedProductAccessories: ProductAccessories) { },
    async getProductAccessoriesById(id: number | string) { },
    async deleteProductAccessories(id: number | string) { },
    async productAccessoriessImport(newImport: FormData): Promise<any> {},
  }
}); 