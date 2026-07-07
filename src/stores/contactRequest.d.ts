import { ContactRequest } from '@/models/ContactRequest';
import ContactRequestImportExport from '@/models/ContactRequestImportExport';
import FeedbackHandler from '@/utils/FeedbackHandler';
import { defineStore } from 'pinia';

export interface ContactRequestState {
    contactRequests: ContactRequest[];
    contactRequest: ContactRequest;
    filter: any | null;
    error: any | null;
    loading: any | null;
    importExport: ContactRequestImportExport[];
    fb: FeedbackHandler;
    model: string;
}

export const useContactRequestStore = defineStore('contactRequest', {
    state: (): ContactRequestState => ({
        contactRequests: [],
        contactRequest: new ContactRequest(),
        filter: null,
        error: null,
        loading: null,
        importExport: [],
        fb: new FeedbackHandler(),
        model: 'visit_showroom',
    }),
    actions: {
        resetContactRequest(): void {},
        async fetchContactRequests(): Promise<ContactRequest[]> {},
        async getContactRequestById(id: number | string): Promise<ContactRequest | any> {},
        // async createContactRequest(newContactRequest: ContactRequest | any): Promise<ContactRequest | any> {},
        async updateContactRequest(contactRequest: ContactRequest | any): Promise<any> {},
        async deleteContactRequest(id: number | string): Promise<void> {},
        async contactRequestsImport(newImport: FormData): Promise<any> {}
    }
});

