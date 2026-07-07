
import DesignResourceImportResponse from '@/models/DesignResourceImport';
import DesignResource from '@/models/DesignResource';
import FeedbackHandler from '@/utils/FeedbackHandler';
import { defineStore } from 'pinia';

export interface FinishState {
  finishes: DesignResource[]; 
  finish: DesignResource; 
  types: any[];
  fb: FeedbackHandler;
  model: string;
  importExport: DesignResourceImportResponse;
}

export const useFinishStore = defineStore('finish', {
  state: (): FinishState => ({
    finishes: [],
    finish: new DesignResource(), 
    types: [] as any[],
    fb: new FeedbackHandler(),
    model: 'document',
    importExport: new DesignResourceImportResponse(),
  }),
  actions: {
  
    resetFinish() {},
    async fetchFinishes() {},
    async fetchFinishById(finishId: number | string) {},
    async createFinish(newFinish: DesignResource): Promise<DesignResource | any> { },
    async updateFinish(updatedFinish: DesignResource) { },
    async deleteFinish(finishId: number | string) { },
    async uploadFiles(files: File[], property: string, id: number | string) { },
    async importFinishes(newImport: FormData): Promise<any> {},
    async getTypes() {}
  }
}); 