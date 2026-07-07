import ItemOption from '@/models/ItemOption';
import ItemOptionImportResponse from '@/models/ItemOptionImport';
import FeedbackHandler from '@/utils/FeedbackHandler';
import { defineStore } from 'pinia';
import { FileToUpload } from '@/models/File';

export interface ItemOptionState {
  itemOptions: ItemOption[]; 
  itemOption: ItemOption; 
  items: any[];
  products: any[];
  productVariants: any[];
  productOptionGroups: any[];
  productOptions: any[];
  types: any[];
  fb: FeedbackHandler;
  model: string;
  importExport: OptionsItemImportResponse;
}

export const useItemOptionStore = defineStore('itemOption', {
  state: (): ItemOptionState => ({
    itemOptions: [],
    itemOption: new ItemOption(), 
    items: [],
    products: [],
    productVariants: [],
    productOptionGroups: [],
    productOptions: [],
    types: [],
    fb: new FeedbackHandler(),
    model: 'itemOption',
    importExport: new ItemOptionImportResponse(),
  }),
  actions: {
    resetItemOption() {},
    //fetch data from api
    async fetchItems() {},
    async fetchProducts() {},
    async fetchProductVariants() {},
    async fetchProductOptionGroups() {},
    async fetchProductOptions() {},
    async fetchTypes() {},
    // end
    async fetchItemOptions() {},
    async fetchItemOptionById(itemOptionId: number | string) {},
    async createItemOption(newItemOption: ItemOption): Promise<ItemOption | any> { },
    async updateItemOption(updatedItemOption: ItemOption) { },
    async deleteItemOption(itemOptionId: number | string) { },
    async importItemOptions(newImport: FormData): Promise<any> {},
    // autocompletion
    async searchProducts(query: string): Promise<any[]> { },
    async searchItems(query: string, productId: number): Promise<any[]> { },
    async searchProductVariants(query: string, productId: number): Promise<any[]> { },
    async searchOptionGroups(query: string, productId: number, variantId: number): Promise<any[]> { },
    async searchOption(query: string, productId: number, variantId: number, optionGroupId: number): Promise<any[]> { },
    async uploadItemOptionImages(files: FileToUpload[], property: string, itemOptionId: number): Promise<any[]> { },
    async deleteItemOptionImages(file: FileToUpload, itemOptionId: number): Promise<any[]> { },
  }
}); 