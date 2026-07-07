import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { ReturnResolutionService } from '../service/ReturnResolutionService';
import ReturnResolutionFilter from '../filters/ReturnResolutionFilter';
import FeedbackHandler from '../utils/FeedbackHandler';
import ReturnResolution from '../models/ReturnResolution';
import ReturnResolutionImportResponse from '@/models/ReturnResolutionImport';

export const useReturnResolutionStore = defineStore('returnResolution', () => {
    /**
     * @type {import('vue').Ref<ReturnResolution[]>}
     */
    const returnResolutions = ref([]);
    const filter = ref(new ReturnResolutionFilter());
    const fb = ref(new FeedbackHandler());
    const model = 'returnResolution';
    const importExport = ref(new ReturnResolutionImportResponse());
    const returnResolution = ref(new ReturnResolution());

    const filteredReturnResolutions = computed(() => {
        return filter.value.apply(returnResolutions.value);
    });

    const resetReturnResolution = () => {
        returnResolution.value = new ReturnResolution();
    };

    const fetchReturnResolutions = async () => {
        fb.value.clearError(model + '.list');
        fb.value.removeSuccess(model + '.list');
        fb.value.startLoading(model + '.list');
        try {
            const response = await ReturnResolutionService.getReturnResolutions();
            returnResolutions.value = response.map(returnResolution => new ReturnResolution(returnResolution));
            fb.value.showSuccess(model + '.list');
        } catch (err) {
            fb.value.setError(err, model + '.list');
            console.error('Error fetching return resolutions:', err);
        } finally {
            fb.value.finishLoading(model + '.list');
        }
    };

    const findReturnResolutionById = async (returnResolutionId) => {
        fb.value.clearError(model + '.edit.' + returnResolutionId);
        fb.value.removeSuccess(model + '.edit.' + returnResolutionId);
        fb.value.startLoading(model + '.edit.' + returnResolutionId);
        try {
            const response = await ReturnResolutionService.getReturnResolutionById(returnResolutionId);
            returnResolution.value = new ReturnResolution(response);
            fb.value.showSuccess(model + '.edit.' + returnResolutionId);
            return response;
        } catch (err) {
            fb.value.setError(err, model + '.edit.' + returnResolutionId);
            console.error('Error fetching return resolutions:', err);
        } finally {
            fb.value.finishLoading(model + '.edit.' + returnResolutionId);
        }
    };

    const updateFilter = (newFilter) => {
        filter.value = { ...filter.value, ...newFilter };
    };

    const createReturnResolution = async (newReturnResolution) => {
        fb.value.clearError(model + '.create');
        fb.value.removeSuccess(model + '.create');
        fb.value.startLoading(model + '.create');
        try {
            const createdReturnResolution = await ReturnResolutionService.createReturnResolution(newReturnResolution);
            returnResolutions.value.push(createdReturnResolution);
            fb.value.showSuccess(model + '.create');
            return createdReturnResolution;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.create');
        } finally {
            fb.value.finishLoading(model + '.create');
        }
    };

    const updateReturnResolution = async (returnResolutionId, updatedReturnResolution) => {
        fb.value.clearError(model + '.update.' + returnResolutionId);
        fb.value.removeSuccess(model + '.update.' + returnResolutionId);
        fb.value.startLoading(model + '.update.' + returnResolutionId);
        try {
            const returnResolution = await ReturnResolutionService.updateReturnResolution(returnResolutionId, updatedReturnResolution);
            const index = returnResolutions.value.findIndex(s => s.return_resolution_id === returnResolutionId);
            if (index !== -1) {
                returnResolutions.value[index] = returnResolution;
            }
            fb.value.showSuccess(model + '.update.' + returnResolutionId);
            return returnResolution;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.update.' + returnResolutionId);
        } finally {
            fb.value.finishLoading(model + '.update.' + returnResolutionId);
        }
    };

    const deleteReturnResolution = async (returnResolutionId) => {
        fb.value.clearError(model + '.delete.' + returnResolutionId);
        fb.value.removeSuccess(model + '.delete.' + returnResolutionId);
        fb.value.startLoading(model + '.delete.' + returnResolutionId);
        try {
            await ReturnResolutionService.deleteReturnResolution(returnResolutionId);
            returnResolutions.value = returnResolutions.value.filter(s => s.return_resolution_id !== returnResolutionId);
            fb.value.showSuccess(model + '.delete.' + returnResolutionId);
        } catch (err) {
            fb.value.setError(err, model + '.delete.' + returnResolutionId);
        } finally {
            fb.value.finishLoading(model + '.delete.' + returnResolutionId);
        }
    };

    const returnResolutionsImport = async (newImport) => {
        fb.value.clearError(model + '.import');
        fb.value.removeSuccess(model + '.import');
        fb.value.startLoading(model + '.import');
        try {
            if (!newImport) {
                throw new Error('No file data provided');
            }
            const response = await ReturnResolutionService.returnResolutionsImport(newImport);
            console.log('Store received response:', response);
            importExport.value = new ReturnResolutionImportResponse(response);
            fb.value.showSuccess(model + '.import');
            return importExport.value;
        } catch (err) {
            console.error('Import error:', err);
            fb.value.setError(err, model + '.import');
            throw err;
        } finally {
            fb.value.finishLoading(model + '.import');
        }
    }

    return {
        returnResolutions,
        returnResolution,
        filter,
        fb,
        filteredReturnResolutions,
        resetReturnResolution,
        fetchReturnResolutions,
        findReturnResolutionById,
        updateFilter,
        createReturnResolution,
        updateReturnResolution,
        deleteReturnResolution,
        returnResolutionsImport,
        importExport
    };
}); 