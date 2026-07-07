
import LengthType from '@/models/LengthType';
import LengthTypeImportResponse from '@/models/LengthTypeImport';
import FeedbackHandler from '@/utils/FeedbackHandler';
import { defineStore } from 'pinia';

export interface LengthTypeState {
  lengthTypes: LengthType[]; 
  lengthType: LengthType; 
  fb: FeedbackHandler;
  model: string;
  importExport: LengthTypeImportResponse;
}

export const useLengthTypeStore = defineStore('lengthType', {
  state: (): LengthTypeState => ({
    lengthTypes: [],
    lengthType: new LengthType(), 
    fb: new FeedbackHandler(),
    model: 'lengthType',
    importExport: new LengthTypeImportResponse(),
  }),
  actions: {
  
    resetLengthType() {},
    async fetchLengthTypes() {},
    async fetchLengthTypeById(lengthTypeId: number | string) {},
    async createLengthType(newLengthType: LengthType): Promise<LengthType | any> { },
    async updateLengthType(updatedLengthType: LengthType) { },
    async deleteLengthType(lengthTypeId: number | string) { },

    async importLengthTypes(newImport: FormData): Promise<any> {}
  }
}); 