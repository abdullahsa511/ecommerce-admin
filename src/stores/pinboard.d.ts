
import PinboardImportResponse from '@/models/PinboardImportResponse';
import  Pinboard  from '@/models/Pinboard';
import FeedbackHandler from '@/utils/FeedbackHandler';
import { defineStore } from 'pinia';

export interface PinboardState {
  pinboards: Pinboard[];
  pinboardItems:any[];
  pinboard: Pinboard;
  fb: FeedbackHandler;
  pinboardStatuses: PinboardStatus[];
  model: string;
  importExport: PinboardImportResponse;
}

export const usePinboardStore = defineStore('pinboard', {
  state: (): PinboardState => ({
    pinboards: [],
    pinboardItems: [],
    pinboard : new Pinboard(),
    fb: new FeedbackHandler(),
    pinboardStatuses: [],
    model:'pinboard',
    importExport: new PinboardImportResponse(),
  }),
  actions: {
    async fetchPinboards() {},
    async showPinboardItems(pinboardId: number | string): Promise<any[]> {},
    async acceptPinboard(pinboardId: number | string): Promise<any> {},
    async fetchPinboardById(pinboardId: number | string): Promise<Pinboard | any> {},
    async createPinboard(newPinboard: Pinboard): Promise<Pinboard | any> {},
    async updatePinboard(updatedPinboard: Pinboard): Promise<Pinboard | any> {},
    async deletePinboard(pinboardId: number | string) {},
    async sendEmailDraftPinboard() {},
    async deleteTemporaryPinboard(pinboardId: number | string) {},
    async getPinboardStatuses(): Promise<PinboardStatus[]> {},
    async getProductList(query: string): Promise<any[]> {},
    async pinboardsImport(formData: FormData): Promise<PinboardImportResponse | any> {},
    async createLead(pinboard: Pinboard): Promise<Pinboard | any> {},
    async fetchTemporaryPinboards() {},
  }
}); 