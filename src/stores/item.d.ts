import { FileToUpload } from '@/models/File';
import { FeedbackHandler } from '@/utils/FeedbackHandler';
import { Ref } from 'vue';
import { defineStore } from 'pinia';
import Item from '@/models/Item';
import ItemImportResponse from '@/models/ItemImportResponse';
import Request from '@/models/Request';
import { VariantItem } from '@/models/Item';

export interface ItemState {
  items: Item[];
  item: Item;
  itemVariant: VariantItem;
  fb: FeedbackHandler;
  itemLists: any[];
  importExport: ItemImportResponse;
  dimensionImportExport: ItemImportResponse;
  products: any[];
  productVariants: any[];
  variantItems: any[];
  itemVariantOptions: any[];
  itemOptions: any[];
  pagination: Request;
  filters: ItemFilter;
}

export const useItemStore = defineStore('item', {
  state: (): ItemState => ({
    items: [],
    item: new Item(),
    itemVariant: new VariantItem(),
    fb: new FeedbackHandler(),
    itemLists: [],
    importExport: new ItemImportResponse(),
    products: [],
    productVariants: [],
    variantItems: [],
    itemVariantOptions: [],
    itemOptions: [],
    pagination: new Request(),
    filters: new ItemFilter()
  }),
  actions: {
    async fetchItems(query: string, resetItems: boolean = false) {},
    async fetchItemById(itemId: number | string): Promise<Item | any> {},
    async createItem(newItem: Item): Promise<Item | any> {},
    async updateItem(updatedItem: Item) {},
    async deleteItem(itemId: number | string) {},
    async itemList() {},
    async uploadItemImages(files: FileToUpload[], property: string, itemId: number | string): Promise<any> {},
    async deleteItemImage(imageId: number | string): Promise<any> {},
    async deleteImageByFilePath(filepath: string, property: string, itemId: number | string): Promise<any> {},
    async importItems(formData: FormData): Promise<ItemImportResponse | any> {},
    async importDimensions(formData: FormData): Promise<ItemImportResponse | any> {},
    async fetchProducts() {},
    async fetchProductVariants() {},

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
    resetItem(): void {}


  }
}); 