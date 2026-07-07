
import DesignResourceImportResponse from '@/models/DesignResourceImport';
import DesignResource from '@/models/DesignResource';
import FeedbackHandler from '@/utils/FeedbackHandler';
import { defineStore } from 'pinia';

export interface TextileState {
  textiles: DesignResource[]; 
  textile: DesignResource; 
  types: any[];
  fb: FeedbackHandler;
  model: string;
  importExport: DesignResourceImportResponse;  
}

export const useTextileStore = defineStore('textile', {
  state: (): TextileState => ({
    textiles: [],
    textile: new DesignResource(), 
    types: [] as any[],
    fb: new FeedbackHandler(),
    model: 'textile',
    importExport: new DesignResourceImportResponse(),
  }),
  actions: {
  
    resetTextile() {},
    async fetchTextiles() {},
    async fetchTextileById(textileId: number | string) {},
    async createTextile(newTextile: DesignResource): Promise<DesignResource | any> { },
    async updateTextile(updatedTextile: DesignResource) { },
    async deleteTextile(textileId: number | string) { },
    async uploadFiles(files: File[], property: string, id: number | string) { },
    async importTextiles(newImport: FormData): Promise<any> {},
    async getTypes() {}
  }
}); 