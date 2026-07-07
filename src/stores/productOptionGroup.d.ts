// import ProductOptionGroup from '@/models/ProductOptionGroup';
import {ProductOptionGroup} from '@/models/Product';
import FeedbackHandler from '@/utils/FeedbackHandler';
import { defineStore } from 'pinia';
import Product from '@/models/Product';

export interface ProductOptionGroupState {
  productOptionGroups: ProductOptionGroup[];
  productOptionGroup: ProductOptionGroup;
  optionGroup: ProductOptionGroup;
  fb: FeedbackHandler;
  model: string;
  importExport: ImportExport[];
  products: any[];
  productVariants: any[];
}

export const useProductOptionGroupStore = defineStore('productOptionGroup', {
  state: (): ProductOptionGroupState => ({
    productOptionGroups: [],
    productOptionGroup: new ProductOptionGroup(),
    optionGroup: new ProductOptionGroup(),
    importExport: [],
    fb: new FeedbackHandler(),
    model: 'productOptionGroup',
    products: [] as any[],
    productVariants: [] as any[],
  }),
  actions: {
    resetProductOptionGroup(): void {},
    async fetchProducts() {},
    async fetchProductVariants() {},
    async getProductOptionGroups() {},
    async createProductOptionGroup(newOptionGroup: ProductOptionGroup): Promise<ProductOptionGroup | any> { },
    async updateProductOptionGroup(updatedProductOptionGroup: ProductOptionGroup) { },
    async getProductOptionGroupById(id: number | string) { },
    async deleteProductOptionGroup(id: number | string) { },
    async deleteProductOption(id: number | string) { },
    async importOptionGroups(newImport: FormData): Promise<any> {}
  }
}); 