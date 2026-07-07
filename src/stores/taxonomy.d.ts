import Taxonomy from '@/models/Taxonomy';
import TaxonomyImportResponse from '@/models/TaxonomyImport';
import FeedbackHandler from '@/utils/FeedbackHandler';
import { defineStore } from 'pinia';

export interface TaxonomyState {
  taxonomies: Taxonomy[]; 
  taxonomyTypes: any[];
  modelTypes: any[];
  taxonomy: Taxonomy; 
  fb: FeedbackHandler;
  model: string;
  newTaxonomy: Taxonomy;
  importExport: TaxonomyImportResponse;
}

export const useTaxonomyStore = defineStore('taxonomy', {
  state: (): TaxonomyState => ({
    taxonomies: [],
    taxonomyTypes: [],
    modelTypes: [],
    taxonomy: new Taxonomy(), 
    fb: new FeedbackHandler(),
    model: 'taxonomy',
    newTaxonomy: new Taxonomy(),
    importExport: new TaxonomyImportResponse(),
  }),
  actions: {
    resetTaxonomy() {},
    async fetchTaxonomies() {},
    async fetchTaxonomyById(texonomyId: number | string) {},
    async createTaxonomy(newTexonomy: Texonomy): Promise<Texonomy | any> { },
    async updateTaxonomy(taxonomyId: number | string, updatedTexonomy: Texonomy) { },   
    async deleteTaxonomy(texonomyId: number | string) { },
    async taxonomyImport(formData: FormData): Promise<any> {},
    async fetchTaxonomyTypes() {},
  }
}); 