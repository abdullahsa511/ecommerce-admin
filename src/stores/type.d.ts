import Type from '@/models/Type';
import TypeImportResponse from '@/models/typeImport';
import FeedbackHandler from '@/utils/FeedbackHandler';
import { defineStore } from 'pinia';
import { types } from 'util';

export interface TypeState {
  types: Type[];
  type: Type;
  fb: FeedbackHandler;
  model: string;
  importExport: TypeImportResponse;
}

export const useTypeStore = defineStore('type', {
  state: (): TypeState => ({
    types: [],
    type: new Type(),
    importExport: new TypeImportResponse(),
    fb: new FeedbackHandler(),
    model: 'type',
  }),
  actions: {
    resetTypeAddForm() {},
    async getTypes() {},
    async createType(newType: Type): Promise<Type | any> { },
    async getTypeById(id: number | string) { },
    async updateType(updatedType: Type) { },
    async deleteType(id: number | string) { },
    async importTypes(newImport: FormData): Promise<any> {}
  }
}); 