
import DesignResourceImportResponse from '@/models/DesignResourceImport';
import DesignResource from '@/models/DesignResource';
import FeedbackHandler from '@/utils/FeedbackHandler';
import { defineStore } from 'pinia';

export interface ModelState {
  models: DesignResource[]; 
  newModel: DesignResource; 
  fb: FeedbackHandler;
  model: string;
}

export const useModelStore = defineStore('model', {
  state: (): ModelState => ({
    models: [],
    newModel: new DesignResource(), 
    fb: new FeedbackHandler(),
    model: 'model',
  }),
  actions: {
    resetDesignResourceModel() {},
    async fetchModels() {},
    async fetchModelById(modelId: number | string) {},
    async createModel(newModel: DesignResource): Promise<DesignResource | any> { },
    async updateModel(updatedModel: DesignResource) { },
    async deleteModel(modelId: number | string) { },
    async uploadFiles(files: FileModel[], property: string, id: number | string) { },
    async deleteDesignResourceDocRecord(designResourceDocumentRecordId: number | string): Promise<any> {},
    async deleteModelDocuments(files: DesignResourceDocument[], property: string): Promise<any> {},
    async updateDocumentFormat(file: FileModel): Promise<any> {},
  }
}); 