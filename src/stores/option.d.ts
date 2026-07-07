
import Option from '@/models/Option';
import FeedbackHandler from '@/utils/FeedbackHandler';
import { defineStore } from 'pinia';
import { types } from 'util';

export interface OptionState {
  options: Option[];
  option: Option;
  productOptions: ProductOption[];
  types: any[];
  fb: FeedbackHandler;
  model: string;
  importExport: ImportExport[];
}

export const useOptionStore = defineStore('Option', {
  state: (): OptionState => ({
    options: [],
    option: new Option(),
    productOptions: [],
    types: [] as any[],
    importExport: [],
    fb: new FeedbackHandler(),
    model: 'option',
  }),
  actions: {
    async fetchProductOptions() {},
    async fetchOptions() {},
    async fetchOptionTypes() {},
    async createOption(newOption: Option): Promise<Option | any> { },
    async updateOption(updatedOption: Option) { },
    async getOptionById(id: number | string) { },
    async deleteOption(id: number | string) { },
    async optionsImport(newImport: FormData): Promise<any> {},
    async productOptionsImport(newImport: FormData): Promise<any> {}
  }
}); 