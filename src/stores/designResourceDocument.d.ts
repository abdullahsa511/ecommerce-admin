
import DesignResourceImportResponse from '@/models/DesignResourceImport';
import { DesignResource, DesignResourceDocument } from '@/models/DesignResource';
import FeedbackHandler from '@/utils/FeedbackHandler';
import { defineStore } from 'pinia';
import { FileToUpload } from '@/models/File';

export interface DocumentState {
  documents: DesignResource[]; 
  document: DesignResource; 
  fb: FeedbackHandler;
  model: string;
  importExport: DesignResourceImportResponse;
}

export const useDocumentStore = defineStore('document', {
  state: (): DocumentState => ({
    documents: [],
    document: new DesignResource(), 
    fb: new FeedbackHandler(),
    model: 'document',
    importExport: new DesignResourceImportResponse(),
  }),
  actions: {
  
    resetDocument() {},
    async fetchDocuments() {},
    async fetchDocumentById(documentId: number | string) {},
    async createDocument(newDocument: DesignResource): Promise<DesignResource | any> { },
    async updateDocument(updatedDocument: DesignResource) { },
    async deleteDocument(documentId: number | string) { },
    async uploadFiles(files: FileToUpload[], property: string, id: number | string) {},
    async importDocuments(newImport: FormData): Promise<any> {},
    async uploadDocumentFile(event: any, property: string, id: number | string): Promise<any> {},
    async deleteDesignResourceDocRecord(designResourceDocumentRecordId: number | string): Promise<any> {},
    async deleteDocuments(files: DesignResourceDocument[], property: string): Promise<any> {},
  }
}); 