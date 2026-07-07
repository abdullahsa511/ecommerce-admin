

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import WeightTypeService from '@/service/WeightTypeService';
import WeightTypeFilter from '@/filters/WeightTypeFilter';
import WeightType from '@/models/WeightType';
import FeedbackHandler from '../utils/FeedbackHandler';
import WeightTypeImportResponse from '@/models/WeightTypeImport';

export const useWeightTypeStore = defineStore('weightType', () => {
    /**
     * @type {import('vue').Ref<WeightType[]>}
     */
    const importExport = ref(new WeightTypeImportResponse());
    const weightTypes = ref([]);
    const weightType = ref(new WeightType());
    const filter = ref(new WeightTypeFilter());
    const fb = ref(new FeedbackHandler());
    const model = 'weightType';


    const resetWeightType = () => {
        weightType.value = new WeightType();
    };

    const fetchWeightTypes = async () => {
        fb.value.clearError(model+'.list');
        fb.value.removeSuccess(model+'.list');
        fb.value.startLoading(model+'.list');
        try {
            const response = await WeightTypeService.getWeightTypes();
            weightTypes.value = response.map(weightType => new WeightType(weightType));
            fb.value.showSuccess(model+'.list');
            return weightTypes.value;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model+'.list');
        } finally {
            fb.value.finishLoading(model+'.list');
        }
    };

    const fetchWeightTypeById = async (weightTypeId) => {
        fb.value.clearError(model + '.edit.' + weightTypeId);
        fb.value.removeSuccess(model + '.edit.' + weightTypeId);
        fb.value.startLoading(model + '.edit.' + weightTypeId);
        try {
            const lt = await WeightTypeService.getWeightTypeById(weightTypeId);
            weightType.value = new WeightType(lt);
            fb.value.showSuccess(model + '.edit.' + weightTypeId);
            return weightType;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.edit.' + weightTypeId);
        } finally {
            fb.value.finishLoading(model + '.edit.' + weightTypeId);
        }
    };

    const createWeightType = async (newWeightType) => {
        fb.value.clearError(model + '.create');
        fb.value.removeSuccess(model + '.create');
        fb.value.startLoading(model + '.create');
        try {
            const createdWeightType = await WeightTypeService.createWeightType(newWeightType);
            const weightTypeObj = new WeightType(createdWeightType);
            weightType.value = weightTypeObj;
            fb.value.showSuccess(model+'.create');
            return weightType.value;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model+'.create');
        } finally {
            fb.value.finishLoading(model+'.create');
        }
    };

    const updateWeightType = async (updatedWeightType) => {
        fb.value.clearError(model + '.update.' + updatedWeightType.weight_type_id);
        fb.value.removeSuccess(model + '.update.' + updatedWeightType.weight_type_id);
        fb.value.startLoading(model + '.update.' + updatedWeightType.weight_type_id);
        try {
            const lt = await WeightTypeService.updateWeightType(updatedWeightType);
            const weightTypeObj = new WeightType(lt);
            const index = weightTypes.value.findIndex(l => l.weight_type_id === updatedWeightType.weight_type_id);
            if (index !== -1) {
                weightTypes.value[index] = weightTypeObj;
            }
              weightType.value = weightTypeObj;
            fb.value.showSuccess(model + '.update.' + updatedWeightType.weight_type_id);
            return weightType.value;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.update.' + updatedWeightType.weight_type_id);
        } finally {
            fb.value.finishLoading(model + '.update.' + updatedWeightType.weight_type_id);
        }
    };

    const deleteWeightType = async (weightTypeId) => {
        fb.value.clearError(model + '.delete.' + weightTypeId);
        fb.value.removeSuccess(model + '.delete.' + weightTypeId);
        fb.value.startLoading(model + '.delete.' + weightTypeId);
        try {
            await WeightTypeService.deleteWeightType(weightTypeId);
            weightTypes.value = weightTypes.value.filter(l => l.weight_type_id !== weightTypeId);
            fb.value.showSuccess(model + '.delete.' + weightTypeId);
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.delete.' + weightTypeId);
        } finally {
            fb.value.finishLoading(model + '.delete.' + weightTypeId);
        }
    };

    const importWeightTypes = async (newImport) => {
        fb.value.clearError(model + '.import');
        fb.value.removeSuccess(model + '.import');
        fb.value.startLoading(model + '.import');
        try {
            if (!newImport) {
                throw new Error('No file data provided');
            }
            const response = await WeightTypeService.importWeightTypes(newImport);
            importExport.value = new WeightTypeImportResponse(response);
            fb.value.showSuccess(model + '.import');
            return importExport.value;
        } catch (err) {
            console.error('Import error:', err);
            fb.value.setError(err, model + '.import');
            throw err;
        } finally {
            fb.value.finishLoading(model + '.import');
        }
    };

    return { 
        weightTypes, 
        weightType,
        filter,
        fb,
        importExport,
        resetWeightType,
        fetchWeightTypes, 
        fetchWeightTypeById, 
        createWeightType, 
        updateWeightType, 
        deleteWeightType,
        importWeightTypes
    };
}); 