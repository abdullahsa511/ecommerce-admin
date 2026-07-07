import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import LengthTypeService from '@/service/LengthTypeService';
import LengthTypeFilter from '@/filters/LengthTypeFilter';
import LengthType from '@/models/LengthType';
import FeedbackHandler from '../utils/FeedbackHandler';
import LengthTypeImportResponse from '@/models/LengthTypeImport';

export const useLengthTypeStore = defineStore('lengthType', () => {
    /**
     * @type {import('vue').Ref<LengthType[]>}
     */
    const importExport = ref(new LengthTypeImportResponse());
    const lengthTypes = ref([]);
    const lengthType = ref(new LengthType());
    const filter = ref(new LengthTypeFilter());
    const fb = ref(new FeedbackHandler());
    const model = 'lengthType';


    const resetLengthType = () => {
        lengthType.value = new LengthType();
    };

    const fetchLengthTypes = async () => {
        fb.value.clearError(model+'.list');
        fb.value.removeSuccess(model+'.list');
        fb.value.startLoading(model+'.list');
        try {
            const response = await LengthTypeService.getLengthTypes();
            lengthTypes.value = response.map(lengthType => new LengthType(lengthType));
            fb.value.showSuccess(model+'.list');
            return lengthTypes.value;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model+'.list');
        } finally {
            fb.value.finishLoading(model+'.list');
        }
    }

    const fetchLengthTypeById = async (lengthTypeId) => {
        fb.value.clearError(model + '.edit.' + lengthTypeId);
        fb.value.removeSuccess(model + '.edit.' + lengthTypeId);
        fb.value.startLoading(model + '.edit.' + lengthTypeId);
        try {
            const lt = await LengthTypeService.getLengthTypeById(lengthTypeId);
            lengthType.value = new LengthType(lt);
            fb.value.showSuccess(model + '.edit.' + lengthTypeId);
            return lengthType.value;
        } catch (err) {
            fb.value.setError(err, model + '.edit.' + lengthTypeId);
        } finally {
            fb.value.finishLoading(model + '.edit.' + lengthTypeId);
        }
    };

    const createLengthType = async (newLengthType) => {
        fb.value.clearError(model + '.create');
        fb.value.removeSuccess(model + '.create');
        fb.value.startLoading(model + '.create');
        try {
            const createdLengthType = await LengthTypeService.createLengthType(newLengthType);
            const lengthTypeObj = new LengthType(createdLengthType);
            lengthType.value = lengthTypeObj;
            fb.value.showSuccess(model + '.create');
            return lengthType.value;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.create');
        } finally {
            fb.value.finishLoading(model + '.create');
        }
    };

    const updateLengthType = async (updatedLengthType) => {
        fb.value.clearError(model+'.update.'+updatedLengthType.length_type_id);
        fb.value.removeSuccess(model+'.update.'+updatedLengthType.length_type_id);
        fb.value.startLoading(model+'.update.'+updatedLengthType.length_type_id);
        try {
            const lt = await LengthTypeService.updateLengthType(updatedLengthType);
            const lengthTypeObj = new LengthType(lt);
            const index = lengthTypes.value.findIndex(l => l.length_type_id === updatedLengthType.length_type_id);
            if (index !== -1) {
                lengthTypes.value[index] = lengthTypeObj;
            }
              lengthType.value = lengthTypeObj;
            fb.value.showSuccess(model+'.update.'+updatedLengthType.length_type_id);
            return lengthType.value;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model+'.update.'+updatedLengthType.length_type_id);
        } finally {
            fb.value.finishLoading(model+'.update.'+updatedLengthType.length_type_id);
        }
    };

    const deleteLengthType = async (lengthTypeId) => {
        fb.value.clearError(model+'.delete.'+lengthTypeId);
        fb.value.removeSuccess(model+'.delete.'+lengthTypeId);
        fb.value.startLoading(model+'.delete.'+lengthTypeId);
        try {
            await LengthTypeService.deleteLengthType(lengthTypeId);
            lengthTypes.value = lengthTypes.value.filter(l => l.length_type_id !== lengthTypeId);
            fb.value.showSuccess(model+'.delete.'+lengthTypeId);
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model+'.delete.'+lengthTypeId);
        } finally {
            fb.value.finishLoading(model+'.delete.'+lengthTypeId);
        }
    };

    const importLengthTypes = async (newImport) => {
        fb.value.clearError(model + '.import');
        fb.value.removeSuccess(model + '.import');
        fb.value.startLoading(model + '.import');
        try {
            if (!newImport) {
                throw new Error('No file data provided');
            }
            const response = await LengthTypeService.importLengthTypes(newImport);
            importExport.value = new LengthTypeImportResponse(response);
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
        lengthTypes, 
        lengthType,
        filter,
        fb,
        importExport,
        resetLengthType,
        fetchLengthTypes, 
        fetchLengthTypeById, 
        createLengthType, 
        updateLengthType, 
        deleteLengthType,
        importLengthTypes
    };
}); 