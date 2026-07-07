import ShowroomContactImportResponse from '@/models/ShowroomContactImport';
import FeedbackHandler from '@/utils/FeedbackHandler';
import { defineStore } from 'pinia';
import { FileToUpload } from '@/models/File';
import ShowroomContact from '@/models/ShowroomContact';
import Showroom from '@/models/Showroom';

export interface ShowroomContactState {
  showroomContacts: ShowroomContact[]; 
  slotData: Slot[];
  showroomContact: ShowroomContact; 
  fb: FeedbackHandler;
  model: string;
  importExport: ShowroomContactImportResponse;
  showrooms: Showroom[];
}

export const useShowroomContactStore = defineStore('showroomContact', {
  state: (): ShowroomContactState => ({
    showroomContacts: [],
    slotData: [],
    showroomContact: new ShowroomContact(), 
    fb: new FeedbackHandler(),
    model: 'showroomContact',
    importExport: new ShowroomContactImportResponse(),
    showrooms: [],
  }),


  actions: {
    resetShowroomContact() {},
    async fetchShowroomContacts() {},
    async getShowroomContactById(showroomContactId: number | string) {},
    async createShowroomContact(newShowroomContact: ShowroomContact): Promise<ShowroomContact | any> { },
    async updateShowroomContact(updatedShowroomContact: ShowroomContact) { },
    async deleteShowroomContact(showroomContactId: number | string) { },
    async importShowroomContacts(formData: FormData) { },
    async uploadShowroomContactImages(files: FileToUpload[], property: string, showroomContactId: number | string) { },
    async deleteShowroomContactImages(file: FileToUpload, showroomContactId: number | string) { },
    async getShowrooms() { },
    async updateSlotStatus(showroomContactId: number | string, slot: Slot) { },
    async fetchSlots(showroomContactId: number | string) { },
  }
}); 