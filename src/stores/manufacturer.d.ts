
import ManufacturerImportResponse from '@/models/ManufacturerImport';
import FeedbackHandler from '@/utils/FeedbackHandler';
import { defineStore } from 'pinia';
import { FileToUpload } from '@/models/File';
import Manufacturer from '@/models/Manufacturer';

export interface ManufacturerState {
  manufacturers: Manufacturer[]; 
  manufacturer: Manufacturer; 
  fb: FeedbackHandler;
  model: string;
  importExport: ManufacturerImportResponse;
}

export const useManufacturerStore = defineStore('manufacturer', {
  state: (): ManufacturerState => ({
    manufacturers: [],
    manufacturer: new Manufacturer(), 
    fb: new FeedbackHandler(),
    model: 'manufacturer',
    importExport: new ManufacturerImportResponse(),
  }),


  actions: {
    resetManufacturer() {},
    async fetchManufacturers() {},
    async getManufacturerById(manufacturerId: number | string) {},
    async createManufacturer(newManufacturer: Manufacturer): Promise<Manufacturer | any> { },
    async updateManufacturer(updatedManufacturer: Manufacturer) { },
    async deleteManufacturer(manufacturerId: number | string) { },
    async importManufacturers(newImport: FormData): Promise<any> {},
    async uploadManufacturerImages(files: FileToUpload[], property: string, manufacturerId: number | string): Promise<any> {},
    async deleteManufacturerImages(file: FileToUpload, manufacturerId: number | string): Promise<any> {}
  }
}); 