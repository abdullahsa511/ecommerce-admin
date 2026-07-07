import ShippingStatus from '@/models/ShippingStatus';
import ShippingStatusImportResponse from '@/models/ShippingStatusImportResponse';
import FeedbackHandler from "@/utils/FeedbackHandler";
import { defineStore } from "pinia";

export interface ShippingStatusState {
    shippingStatuses: ShippingStatus[];
    shippingStatus: ShippingStatus;
    fb: FeedbackHandler;
    model: string;
    importExport: ShippingStatusImportResponse;
}

export const useShippingStatusStore = defineStore('shippingStatus', {
    state: (): ShippingStatusState => ({
        shippingStatuses: [],
        shippingStatus: new ShippingStatus(),
        fb: new FeedbackHandler(),
        model: 'shippingStatus',
        importExport: new ShippingStatusImportResponse(),
    }),
    actions: {
        resetShippingStatus() { },
        async fetchShippingStatuses() { },
        async findShippingStatusById(shippingStatusId: number | string) { },
        async createShippingStatus(newShippingStatus: ShippingStatus): Promise<ShippingStatus | any> { },
        async updateShippingStatus(updatedShippingStatus: ShippingStatus) { },
        async deleteShippingStatus(shippingStatusId: number | string) { },
        async shippingStatusesImport(newImport: FormData): Promise<any> { }
    }
});