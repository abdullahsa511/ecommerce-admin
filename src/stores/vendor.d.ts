
import Vendor from '@/models/Vendor';
import VendorImportResponse from '@/models/VendorImport';
import FeedbackHandler from '@/utils/FeedbackHandler';
import { defineStore } from 'pinia';
import { FileToUpload } from '@/models/File';

export interface VendorState {
  vendors: Vendor[]; 
  vendor: Vendor; 
  fb: FeedbackHandler;
  model: string;
  importExport: VendorImportResponse;
}

export const useVendorStore = defineStore('vendor', {
  state: (): VendorState => ({
    vendors: [],
    vendor: new Vendor(), 
    fb: new FeedbackHandler(),
    model: 'vendor',
    importExport: new VendorImportResponse(),
  }),


  actions: {
    resetVendor() {},
    async fetchVendors() {},
    async getVendorById(vendorId: number | string) {},
    async createVendor(newVendor: Vendor): Promise<Vendor | any> { },
    async updateVendor(updatedVendor: Vendor) { },
    async deleteVendor(vendorId: number | string) { },
    async importVendors(newImport: FormData): Promise<any> {},
    async uploadVendorImages(files: FileToUpload[], property: string, vendorId: number | string): Promise<any> {},
    async deleteVendorImages(file: FileToUpload, vendorId: number | string): Promise<any> {}
  }
}); 