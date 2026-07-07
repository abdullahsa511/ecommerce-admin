import { Service } from '@/models/Service';
import FeedbackHandler from '@/utils/FeedbackHandler';
import { defineStore } from 'pinia';

export interface ServiceRequestState {
    serviceRequests: Service[];
    serviceRequest: Service;
    filter: any | null;
    error: any | null;
    loading: any | null;
    fb: FeedbackHandler;
    model: string;
}

export const useServiceRequestStore = defineStore('serviceRequest', {
    state: (): ServiceRequestState => ({
        serviceRequests: [],
        serviceRequest: new Service(),
        filter: null,
        error: null,
        loading: null,
        fb: new FeedbackHandler(),
        model: 'serviceRequest'
    }),
    actions: {
        resetServiceRequest(): void {},
        async fetchServiceRequests(): Promise<Service[]> {},
        async getServiceRequestById(id: number | string): Promise<Service | any> {},
        async updateServiceRequest(serviceRequest: Service | any): Promise<any> {},
        async deleteServiceRequest(id: number | string): Promise<void> {},
        async serviceRequestsImport(newImport: FormData): Promise<any> {}
    }
});
