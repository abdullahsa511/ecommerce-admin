import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { ReturnReasonService } from '../service/ReturnReasonService';
import ReturnReasonFilter from '../filters/ReturnReasonFilter';
import FeedbackHandler from '../utils/FeedbackHandler';
import ReturnReason from '../models/ReturnReason';
import ReturnReasonImportResponse from '@/models/ReturnReasonImportResponse';

export const useReturnReasonStore = defineStore('returnReason', () => {
    /**
     * @type {import('vue').Ref<ReturnReason[]>}
     */
    const returnReasons = ref([]);
    const returnReason = ref(new ReturnReason());

    const filter = ref(new ReturnReasonFilter());
    const fb = ref(new FeedbackHandler());
    const model = 'returnReason';
    // import export
    const importExport = ref(new ReturnReasonImportResponse());

    const filteredReturnReasons = computed(() => {
        return filter.value.apply(returnReasons.value);
    });
    const resetReturnReason = () => {
        returnReason.value = new ReturnReason();
    };

    const fetchReturnReasons = async () => {
        fb.value.clearError(model+'.list');
        fb.value.removeSuccess(model+'.list');
        fb.value.startLoading(model+'.list');
        try {
            const response = await ReturnReasonService.getReturnReasons();
            returnReasons.value = response.map(returnReason => new ReturnReason(returnReason));
            fb.value.showSuccess(model+'.list');
        } catch (err) {
            fb.value.setError(err, model+'.list');
            console.error('Error fetching return reasons:', err);
        } finally {
            fb.value.finishLoading(model+'.list');
        }
    };

    const findReturnReasonById = async (returnReasonId) => {
        fb.value.clearError(model+'.edit.'+returnReasonId);
        fb.value.removeSuccess(model+'.edit.'+returnReasonId);
        fb.value.startLoading(model+'.edit.'+returnReasonId);
        try {
            const response = await ReturnReasonService.getReturnReasonById(returnReasonId);
            returnReason.value = new ReturnReason(response);
            fb.value.showSuccess(model+'.edit.'+returnReasonId);
            return returnReason.value;
        } catch (err) {
            fb.value.setError(err, model+'.edit.'+returnReasonId);
            console.error('Error fetching return reasons:', err);
        } finally {
            fb.value.finishLoading(model+'.edit.'+returnReasonId);
        }
    };

    const updateFilter = (newFilter) => {
        filter.value = { ...filter.value, ...newFilter };
    };

    const createReturnReason = async (newReturnReason) => {
        fb.value.clearError(model+'.create');
        fb.value.removeSuccess(model+'.create');
        fb.value.startLoading(model+'.create');
        try {
            const createdReturnReason = await ReturnReasonService.createReturnReason(newReturnReason);
            returnReasons.value.push(new ReturnReason(createdReturnReason));
            fb.value.showSuccess(model+'.create');
            return createdReturnReason;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model+'.create');
        } finally {
            fb.value.finishLoading(model+'.create');
        }
    };

    const updateReturnReason = async (returnReasonId, updatedReturnReason) => {
        fb.value.clearError(model+'.update.'+returnReasonId);
        fb.value.removeSuccess(model+'.update.'+returnReasonId);
        fb.value.startLoading(model+'.update.'+returnReasonId);
        try {
            const response = await ReturnReasonService.updateReturnReason(returnReasonId, updatedReturnReason);
            const index = returnReasons.value.findIndex(s => s.return_reason_id === returnReasonId);
            if (index !== -1) {
                returnReasons.value[index] = new ReturnReason(response);
            }
            fb.value.showSuccess(model+'.update.'+returnReasonId);
            return response;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model+'.update.'+returnReasonId);
        } finally {
            fb.value.finishLoading(model+'.update.'+returnReasonId);
        }
    };

    const deleteReturnReason = async (returnReasonId) => {
        fb.value.clearError(model+'.delete.'+returnReasonId);
        fb.value.removeSuccess(model+'.delete.'+returnReasonId);
        fb.value.startLoading(model+'.delete.'+returnReasonId);
        try {
            await ReturnReasonService.deleteReturnReason(returnReasonId);
            returnReasons.value = returnReasons.value.filter(s => s.return_reason_id !== returnReasonId);
            fb.value.showSuccess(model+'.delete.'+returnReasonId);
        } catch (err) {
            fb.value.setError(err, model+'.delete.'+returnReasonId);
        } finally {
            fb.value.finishLoading(model+'.delete.'+returnReasonId);
        }
    };

    // import export
    const returnReasonsImport = async (newImport) => {
        fb.value.clearError(model+'.import');
        fb.value.removeSuccess(model+'.import');
        fb.value.startLoading(model+'.import');
        try {
            if (!newImport) {
                throw new Error('No file data provided');
            }
            const response = await ReturnReasonService.returnReasonsImport(newImport);
            importExport.value = new ReturnReasonImportResponse(response);
            fb.value.showSuccess(model+'.import');
            return importExport.value;
        } catch (err) {
            console.error('Import error:', err);
            fb.value.setError(err, model+'.import');
            throw err;
        } finally {
            fb.value.finishLoading(model+'.import');
        }
    }

    return { 
        returnReasons, 
        returnReason,
        filter, 
        fb, 
        filteredReturnReasons, 
        resetReturnReason,
        fetchReturnReasons, 
        findReturnReasonById,
        updateFilter, 
        createReturnReason, 
        updateReturnReason, 
        deleteReturnReason,
        returnReasonsImport,
        importExport
    };
}); 