
import WeightType from '@/models/WeightType';
import WeightTypeImportResponse from '@/models/WeightTypeImport';
import FeedbackHandler from "@/utils/FeedbackHandler";
import { defineStore } from "pinia";

export interface WeightTypeState {
    weightTypes: WeightType[];
    weightType: WeightType;
    fb: FeedbackHandler;
    model: string;
    importExport: WeightTypeImportResponse;
}

export const useWeightTypeStore = defineStore('weightType', {
    state: (): WeightTypeState => ({
        weightTypes: [],
        weightType: new WeightType(),
        fb: new FeedbackHandler(),
        model: 'weightType',
        importExport: new WeightTypeImportResponse(),
    }),
    actions: {
        resetWeightType() { },
        async fetchWeightTypes() { },
        async fetchWeightTypeById(weightTypeId: number | string) { },
        async createWeightType(newWeightType: WeightType): Promise<WeightType | any> { },
        async updateWeightType(updatedWeightType: WeightType) { },
        async deleteWeightType(weightTypeId: number | string) { },
        async importWeightTypes(newImport: FormData): Promise<any> { }
    }
});