
// import VariantsItem from '@/models/VariantsItem';
import VariantItemImportResponse from '@/models/VariantItemImport';
import FeedbackHandler from '@/utils/FeedbackHandler';
import { defineStore } from 'pinia';
import { VariantItem } from '@/models/Item.ts';

export interface VariantItemState {
  variantItems: VariantItem[]; 
  variantItem: VariantItem; 
  itemVariant: VariantItem;
  fb: FeedbackHandler;
  model: string;
  importExport: VariantItemImportResponse;
}

export const useVariantsItemStore = defineStore('variantItem', {
  state: (): VariantItemState => ({
    variantItems: [],
    variantItem: new VariantItem(), 
    itemVariant: new VariantItem(),
    fb: new FeedbackHandler(),
    model: 'variantItem',
    importExport: new VariantItemImportResponse(),
  }),
  actions: {
  
    resetVariantsItem() {},
    async fetchVariantsItems() {},
    async fetchVariantsItemById(variantsItemId: number | string) {},
    async createVariantsItem(newVariantsItem: VariantItem): Promise<VariantItem | any> { },
    async updateVariantsItem(updatedVariantsItem: VariantItem) { },
    async deleteVariantItem(variantItemId: number | string) {},
    async importVariantsItems(newImport: FormData): Promise<any> {},
    // variant item actions
    async createItemVariant(data: any): Promise<any> {},
    async getItemVariantByItemId(itemId: number | string): Promise<VariantItem[]> {},
    async listItemOptions(query: string, productId: number | string): Promise<any> {},
    async getItemVariantOptionByItemId(itemId: number | string): Promise<any> {},
    async deleteItemOption(itemOptionId: number | string, groupId: number | string): Promise<any> {},
    async deleteItemOptionGroup(group: any): Promise<any> {},
    async updateItemVariant(data: any): Promise<any> {},
    async deleteItemVariant(productVariantId: number | string): Promise<any> {},
    async listItemVariants(query: string, productId: number | string): Promise<any> {},
    async listItemOptionGroups(query: string, productId: number | string): Promise<any> {},
    async listProductOptions(query: string, productId: number | string): Promise<any> {},
    async listTypes(query: string): Promise<any> {},
    async listItems(query: string, productId: number | string): Promise<any> {},
    async searchProducts(query: string): Promise<any> {},
  }
}); 