import ProductType from '@/models/ProductType';
import FeedbackHandler from '@/utils/FeedbackHandler';
import { defineStore } from 'pinia';
import ProductTypeImportResponse from '@/models/ProductTypeImport';
import ProductTypeFilter from '@/filters/ProductTypeFilter';

export interface ProductTypeState {
  productTypes: ProductType[];
  newProductType: ProductType;
  filter: ProductTypeFilter;
  fb: FeedbackHandler;
  model: string;
  importExport: ProductTypeImportResponse;
}

export const useProductTypeStore = defineStore('productType', {
  state: (): ProductTypeState => ({
    productTypes: [],
    newProductType: new ProductType(),
    importExport: new ProductTypeImportResponse(),
    fb: new FeedbackHandler(),
    model: 'productType',
    filter: new ProductTypeFilter(),
  }),
  actions: {
    resetProductType() {},
    async fetchProductTypes() {},
    async fetchProductTypeById(productTypeId: number | string): Promise<ProductType | any> {},
    async createProductType(newProductType: Partial<ProductType>): Promise<ProductType | any> {},
    async updateProductType(productTypeId: number | string, updatedProductType: Partial<ProductType>): Promise<ProductType | any> {},
    async deleteProductType(productTypeId: number | string) {},
    async productTypeImport(newImport: FormData): Promise<any> {},
    async uploadProductTypeImages(files: File[], property: string, productTypeId: number | string): Promise<any> {},
    async deleteProductTypeImages(file: File, productTypeId: number | string): Promise<any> {},
  }
}); 