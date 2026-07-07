import Component from '@/models/Component';
import { FileToUpload } from '@/models/File';
import { FeedbackHandler } from '@/utils/FeedbackHandler';
import { Ref } from 'vue';
import { defineStore } from 'pinia';
import Site from '@/models/Site';
import Vendor from '@/models/Vendor';
import Manufacturer from '@/models/Manufacturer';

export interface ListState {
  types: string[];
  sites: Site[];
  vendors: Vendor[];
  manufacturers: Manufacturer[];
  productTags: any[];
  fb: FeedbackHandler;
  model: string;
}

export const useListStore = defineStore('list', {
  state: (): ListState => ({
    types: Array<string>(),
    sites: Array<Site>(),
    vendors: Array<Vendor>(),
    manufacturers: Array<Manufacturer>(),
    productTags: Array<any>(),
    fb: new FeedbackHandler(),
    model: 'list'
  }),
  actions: {
    async fetchTypes() {},
    async fetchSites() {},  
    async fetchVendors() {},
    async fetchManufacturers() {},
    async fetchProductTags() {}
  }
}); 