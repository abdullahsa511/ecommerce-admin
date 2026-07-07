import ProductAttribute from '@/models/ProductAttribute';
import FeedbackHandler from '@/utils/FeedbackHandler';
import { defineStore } from 'pinia';

export interface ProductAttributeState {
  attributes: ProductAttribute[];
  attribute: ProductAttribute;
  groups: any[];
  fb: FeedbackHandler;
  model: string;
  importExport: ImportExport[];
}

export const useProductAttributeStore = defineStore('productAttribute', {
  state: (): ProductAttributeState => ({
    attributes: [],
    attribute: new ProductAttribute(),
    groups: [] as any[],
    importExport: [],
    fb: new FeedbackHandler(),
    model: 'productAttribute'
  }),
  actions: {
    resetAttribute() {},
    async fetchAttributes() {},
    async fetchAttributeGroups() {},
    async createAttribute(newAttribute: ProductAttribute): Promise<ProductAttribute | any> { },
    async updateAttribute(updatedAttribute: ProductAttribute) { },
    async getAttributeById(id: number | string) { },
    async deleteAttribute(id: number | string) { },
    async attributesImport(newImport: FormData): Promise<any> {}
  }
}); 