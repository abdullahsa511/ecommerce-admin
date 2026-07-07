import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { ReturnStatusService } from '@/service/ReturnStatusService';
import ReturnStatusFilter from '../filters/ReturnStatusFilter';
import FeedbackHandler from '../utils/FeedbackHandler';
import ReturnStatus from '@/models/ReturnStatus';
import ReturnStatusImportResponse from '@/models/ReturnStatusImportResponse';

export const useReturnStatusStore = defineStore('returnStatus', () => {
    /**
     * @type {import('vue').Ref<ReturnStatus[]>}
     */
    const returnStatuses = ref([]);
    const returnStatus = ref(new ReturnStatus());
    const filter = ref(new ReturnStatusFilter());
    const fb = ref(new FeedbackHandler());
    const model = 'returnStatus';
    // import export
    const importExport = ref(new ReturnStatusImportResponse());

    const filteredReturnStatuses = computed(() => {
        return filter.value.apply(returnStatuses.value);
    });

    const resetReturnStatus = () => {
        returnStatus.value = new ReturnStatus();
    };

    const fetchReturnStatuses = async () => {
        fb.value.clearError(model + '.list');
        fb.value.removeSuccess(model + '.list');
        fb.value.startLoading(model + '.list');
        try {
            const response = await ReturnStatusService.getReturnStatuses();
            returnStatuses.value = response.map(returnStatus => new ReturnStatus(returnStatus));
            fb.value.showSuccess(model + '.list');
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.list');
        } finally {
            fb.value.finishLoading(model + '.list');
        }
    };

    const findReturnStatusById = async (returnStatusId) => {
        fb.value.clearError(model + '.edit.' + returnStatusId);
        fb.value.removeSuccess(model + '.edit.' + returnStatusId);
        fb.value.startLoading(model + '.edit.' + returnStatusId);
        try {
           const response = await ReturnStatusService.getReturnStatusById(returnStatusId);
            returnStatus.value = new ReturnStatus(response);
            fb.value.showSuccess(model + '.edit.' + returnStatusId);
            return returnStatus.value;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.edit.' + returnStatusId);
            console.error('Error fetching return statuses:', err);
        } finally {
            fb.value.finishLoading(model + '.edit.' + returnStatusId);
        }
    };

    const updateFilter = (newFilter) => {
        filter.value = { ...filter.value, ...newFilter };
    };

    const createReturnStatus = async (newReturnStatus) => {
        fb.value.clearError(model + '.create');
        fb.value.removeSuccess(model + '.create');
        fb.value.startLoading(model + '.create');
        try {
            const response = await ReturnStatusService.createReturnStatus(newReturnStatus);
            const returnStatusObj = new ReturnStatus(response);
            returnStatus.value = returnStatusObj;
            fb.value.showSuccess(model + '.create');
            return returnStatus.value;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.create');
        } finally {
            fb.value.finishLoading(model + '.create');
        }
    };

    const updateReturnStatus = async (updatedReturnStatus) => {
        fb.value.clearError(model + '.update.' + updatedReturnStatus.return_status_id);
        fb.value.removeSuccess(model + '.update.' + updatedReturnStatus.return_status_id);
        fb.value.startLoading(model + '.update.' + updatedReturnStatus.return_status_id);
        try {
            const response = await ReturnStatusService.updateReturnStatus(updatedReturnStatus);
            const returnStatusObj = new ReturnStatus(response);
            const index = returnStatuses.value.findIndex(s => s.return_status_id === updatedReturnStatus.return_status_id);
            if (index !== -1) {
                returnStatuses.value[index] = returnStatusObj;
            }
            returnStatus.value = returnStatusObj;
            fb.value.showSuccess(model + '.update.' + updatedReturnStatus.return_status_id);
            return returnStatus.value;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.update.' + updatedReturnStatus.return_status_id);
        } finally {
            fb.value.finishLoading(model + '.update.' + updatedReturnStatus.return_status_id);
        }
    };

    const deleteReturnStatus = async (returnStatusId) => {
        fb.value.clearError(model + '.delete.' + returnStatusId);
        fb.value.removeSuccess(model + '.delete.' + returnStatusId);
        fb.value.startLoading(model + '.delete.' + returnStatusId);
        try {
            await ReturnStatusService.deleteReturnStatus(returnStatusId);
            returnStatuses.value = returnStatuses.value.filter(s => s.return_status_id !== returnStatusId);
            fb.value.showSuccess(model + '.delete.' + returnStatusId);
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.delete.' + returnStatusId);
        } finally {
            fb.value.finishLoading(model + '.delete.' + returnStatusId);
        }
    };

    const returnStatusesImport = async (newImport) => {
        fb.value.clearError(model + '.import');
        fb.value.removeSuccess(model + '.import');
        fb.value.startLoading(model + '.import');
        try {
            if (!newImport) {
                throw new Error('No file data provided');
            }
            const response = await ReturnStatusService.returnStatusesImport(newImport);
            console.log('Store received response:', response);
            importExport.value = new ReturnStatusImportResponse(response);
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
        returnStatuses,
        returnStatus,
        filter,
        fb,
        filteredReturnStatuses,
        fetchReturnStatuses,
        findReturnStatusById,
        updateFilter,
        createReturnStatus,
        updateReturnStatus,
        deleteReturnStatus,
        returnStatusesImport,
        importExport,
        resetReturnStatus
    };
}); 