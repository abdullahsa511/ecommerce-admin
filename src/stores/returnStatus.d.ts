
import ReturnStatusImportResponse from '@/models/ReturnStatusImportResponse';
import FeedbackHandler from "@/utils/FeedbackHandler";
import { defineStore } from "pinia";
import ReturnStatus from '@/models/ReturnStatus';

export interface ReturnStatusState {
    returnStatuses: ReturnStatus[];
    returnStatus: ReturnStatus;
    fb: FeedbackHandler;
    model: string;
    importExport: ReturnStatusImportResponse;
}

export const useReturnStatusStore = defineStore('returnStatus', {
    state: (): ReturnStatusState => ({
        returnStatuses: [],
        returnStatus: new ReturnStatus(),
        fb: new FeedbackHandler(),
        model: 'returnStatus',
        importExport: new ReturnStatusImportResponse(),
    }),
    actions: {
        resetReturnStatus() { },
        async fetchReturnStatuses() { },
        async findReturnStatusById(returnStatusId: number | string) { },
        async createReturnStatus(newReturnStatus: ReturnStatus): Promise<ReturnStatus | any> { },
        async updateReturnStatus(updatedReturnStatus: ReturnStatus) { },
        async deleteReturnStatus(returnStatusId: number | string) { },
        async returnStatusesImport(newImport: FormData): Promise<any> { }
    }
});