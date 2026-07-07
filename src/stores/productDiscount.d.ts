
import ProductDiscountImportResponse from '@/models/ProductDiscountImport';
import FeedbackHandler from '@/utils/FeedbackHandler';
import { defineStore } from 'pinia';
import ProductDiscount from '@/models/ProductDiscount';
import UserGroup from '@/models/UserGroup';
import Product from '@/models/Product';

export interface ProductDiscountState {
  productDiscounts: ProductDiscount[]; 
  productDiscount: ProductDiscount; 
  userGroups: any[];
  products: any[];
  fb: FeedbackHandler;
  model: string;
  importExport: ProductDiscountImportResponse;
}

export const useProductDiscountStore = defineStore('productDiscount', {
  state: (): ProductDiscountState => ({
    productDiscounts: [],
    productDiscount: new ProductDiscount(), 
    userGroups: [] as any[],
    products: [] as any[],
    fb: new FeedbackHandler(),
    model: 'productDiscount',
    importExport: new ProductDiscountImportResponse(),
  }),
  actions: {
    resetProductDiscount() {},
    async fetchProductDiscounts() {},
    async fetchProductDiscountById(productDiscountId: number | string) {},
    async createProductDiscount(newProductDiscount: ProductDiscount): Promise<ProductDiscount | any> { },
    async updateProductDiscount(updatedProductDiscount: ProductDiscount) { },
    async deleteProductDiscount(productDiscountId: number | string) { },
    async importProductDiscounts(newImport: FormData): Promise<any> {},
    async fetchUserGroups() {},
    async fetchProducts() {},
  }
}); 