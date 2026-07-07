import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { ShippingStatusService } from '../service/ShippingStatusService';
import { ShippingStatusFilter } from '../filters/ShippingStatusFilter';
import FeedbackHandler from '../utils/FeedbackHandler';
import ShippingStatus from '../models/ShippingStatus';
import ShippingStatusImportResponse from '@/models/ShippingStatusImportResponse';

export const useShippingStatusStore = defineStore('shippingStatus', () => {
    /**
     * @type {import('vue').Ref<ShippingStatus[]>}
     */
    const shippingStatuses = ref([]);
    const shippingStatus = ref(new ShippingStatus());

    const filter = ref(new ShippingStatusFilter());
    const fb = ref(new FeedbackHandler());
    const model = 'shippingStatus';
    // import export
    const importExport = ref(new ShippingStatusImportResponse());

    const filteredShippingStatuses = computed(() => {
        return filter.value.apply(shippingStatuses.value);
    });

    const resetShippingStatus = () => {
        shippingStatus.value = new ShippingStatus();
    };

    const fetchShippingStatuses = async () => {
        fb.value.clearError(model + '.list');
        fb.value.removeSuccess(model + '.list');
        fb.value.startLoading(model + '.list');
        try {
            const response = await ShippingStatusService.getShippingStatuses();
            shippingStatuses.value = response.map(shippingStatus => new ShippingStatus(shippingStatus));
            fb.value.showSuccess(model + '.list');
        } catch (err) {
            fb.value.setError(err, model + '.list');
            console.error('Error fetching shipping statuses:', err);
        } finally {
            fb.value.finishLoading(model + '.list');
        }
    };

    const findShippingStatusById = async (shippingStatusId) => {
        fb.value.clearError(model + '.edit.' + shippingStatusId);
        fb.value.removeSuccess(model + '.edit.' + shippingStatusId);
        fb.value.startLoading(model + '.edit.' + shippingStatusId);
        try {
            const response = await ShippingStatusService.getShippingStatusById(shippingStatusId);
            shippingStatus.value = new ShippingStatus(response);
            fb.value.showSuccess(model + '.edit.' + shippingStatusId);
            return shippingStatus;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.edit.' + shippingStatusId);
            throw err;
        } finally {
            fb.value.finishLoading(model + '.edit.' + shippingStatusId);
        }
    };

    const updateFilter = (newFilter) => {
        filter.value = { ...filter.value, ...newFilter };
    };

    const createShippingStatus = async (newShippingStatus) => {
        fb.value.clearError(model + '.create');
        fb.value.removeSuccess(model + '.create');
        fb.value.startLoading(model + '.create');
        try {
            const createdShippingStatus = await ShippingStatusService.createShippingStatus(newShippingStatus);
            const shippingStatusObj = new ShippingStatus(createdShippingStatus);
            shippingStatus.value = shippingStatusObj;
            shippingStatuses.value.push(shippingStatus.value);
            fb.value.showSuccess(model + '.create');
            return shippingStatus.value;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.create');
            throw err;
        } finally {
            fb.value.finishLoading(model + '.create');
        }
    };

    const updateShippingStatus = async (updatedShippingStatus) => {
        fb.value.clearError(model + '.update.' + updatedShippingStatus.shipping_status_id);
        fb.value.removeSuccess(model + '.update.' + updatedShippingStatus.shipping_status_id);
        fb.value.startLoading(model + '.update.' + updatedShippingStatus.shipping_status_id);
        try {
            const response = await ShippingStatusService.updateShippingStatus(updatedShippingStatus);
            const shippingStatusObj = new ShippingStatus(response);
            const index = shippingStatuses.value.findIndex(s => s.shipping_status_id === updatedShippingStatus.shipping_status_id);
            if (index !== -1) {
                shippingStatuses.value[index] = shippingStatusObj;
            }
            shippingStatus.value = shippingStatusObj;
            fb.value.showSuccess(model + '.update.' + updatedShippingStatus.shipping_status_id);
            return shippingStatus.value;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.update.' + updatedShippingStatus.shipping_status_id);
            throw err;
        } finally {
            fb.value.finishLoading(model + '.update.' + updatedShippingStatus.shipping_status_id);
        }
    };

    const deleteShippingStatus = async (shippingStatusId) => {
        fb.value.clearError(model + '.delete.' + shippingStatusId);
        fb.value.removeSuccess(model + '.delete.' + shippingStatusId);
        fb.value.startLoading(model + '.delete.' + shippingStatusId);
        try {
            await ShippingStatusService.deleteShippingStatus(shippingStatusId);
            shippingStatuses.value = shippingStatuses.value.filter(s => s.shipping_status_id !== shippingStatusId);
            fb.value.showSuccess(model + '.delete.' + shippingStatusId);
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.delete.' + shippingStatusId);
            throw err;
        } finally {
            fb.value.finishLoading(model + '.delete.' + shippingStatusId);
        }
    };
    const shippingStatusesImport = async (newImport) => {
        fb.value.clearError(model + '.import');
        fb.value.removeSuccess(model + '.import');
        fb.value.startLoading(model + '.import');
        try {
            if (!newImport) {
                throw new Error('No file data provided');
            }
            const response = await ShippingStatusService.shippingStatusesImport(newImport);
            console.log('Store received response:', response);
            importExport.value = new ShippingStatusImportResponse(response);
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
        shippingStatuses,
        shippingStatus,
        filter,
        fb,
        filteredShippingStatuses,
        fetchShippingStatuses,
        findShippingStatusById,
        updateFilter,
        createShippingStatus,
        updateShippingStatus,
        deleteShippingStatus,
        shippingStatusesImport,
        importExport,
        resetShippingStatus
    };
}); 