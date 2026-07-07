import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { SubscriptionStatusService } from '../service/SubscriptionStatusService';
// import { SubscriptionStatusFilter } from '../filters/SubscriptionStatusFilter';
import FeedbackHandler from '../utils/FeedbackHandler';
import SubscriptionStatus from '../models/SubscriptionStatus';
import SubscriptionStatusImportResponse from '@/models/SubscriptionStatusImportResponse';
import SubscriptionStatusFilter from '@/filters/SubscriptionStatusFilter';

export const useSubscriptionStatusStore = defineStore('subscriptionStatus', () => {
    /**
     * @type {import('vue').Ref<SubscriptionStatus[]>}
     */
    const subscriptionStatuses = ref([]);
    const subscriptionStatus = ref(new SubscriptionStatus());
    const filter = ref(new SubscriptionStatusFilter());
    const fb = ref(new FeedbackHandler());
    const model = 'subscriptionStatus';
    const importExport = ref(new SubscriptionStatusImportResponse());

    const filteredSubscriptionStatuses = computed(() => {
        return filter.value.apply(subscriptionStatuses.value);
    });
    const resetSubscriptionStatus = () => {
        subscriptionStatus.value = new SubscriptionStatus();
    };

    const fetchSubscriptionStatuses = async () => {
        fb.value.clearError(model + '.list');
        fb.value.removeSuccess(model + '.list');
        fb.value.startLoading(model + '.list');
        try {
            const response = await SubscriptionStatusService.getSubscriptionStatuses();
            subscriptionStatuses.value = response.map(subscriptionStatus => new SubscriptionStatus(subscriptionStatus));
            fb.value.showSuccess(model + '.list');
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.list');
        } finally {
            fb.value.finishLoading(model + '.list');
        }
    };

    const findSubscriptionStatusById = async (subscriptionStatusId) => {
        let status = subscriptionStatuses.value.find(s => s.subscription_status_id === subscriptionStatusId);
        if (!status) {
            fb.value.clearError(model + '.edit.' + subscriptionStatusId);
            fb.value.removeSuccess(model + '.edit.' + subscriptionStatusId);
            fb.value.startLoading(model + '.edit.' + subscriptionStatusId);
            try {
                const response = await SubscriptionStatusService.getSubscriptionStatusById(subscriptionStatusId);
                subscriptionStatus.value = new SubscriptionStatus(response);
                fb.value.showSuccess(model + '.edit.' + subscriptionStatusId);
                return subscriptionStatus.value ;
            } catch (err) {
                let error = err.response?.data?.errors;
                if(!error) error = err;
                fb.value.setError(error, model + '.edit.' + subscriptionStatusId);
            } finally {
                fb.value.finishLoading(model + '.edit.' + subscriptionStatusId);
            }
        }else{
            subscriptionStatus.value = status;
            fb.value.showSuccess(model + '.edit.' + subscriptionStatusId);
            return subscriptionStatus.value;
        }
    };

    const updateFilter = (newFilter) => {
        filter.value = { ...filter.value, ...newFilter };
    };

    const createSubscriptionStatus = async () => {
        const newSubscriptionStatus = subscriptionStatus.value;
        fb.value.clearError(model + '.create');
        fb.value.removeSuccess(model + '.create');
        fb.value.startLoading(model + '.create');
        try {
            const createdSubscriptionStatus = await SubscriptionStatusService.createSubscriptionStatus(newSubscriptionStatus);
            subscriptionStatus.value = new SubscriptionStatus(createdSubscriptionStatus);
            subscriptionStatuses.value.push(subscriptionStatus.value);
            fb.value.showSuccess(model + '.create');
            return subscriptionStatus.value;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.create');
        } finally {
            fb.value.finishLoading(model + '.create');
        }
    };

    const updateSubscriptionStatus = async (subscriptionStatus) => {
        fb.value.clearError(model + '.update.' + subscriptionStatus.subscription_status_id);
        fb.value.removeSuccess(model + '.update.' + subscriptionStatus.subscription_status_id);
        fb.value.startLoading(model + '.update.' + subscriptionStatus.subscription_status_id);
        try {
            const status = await SubscriptionStatusService.updateSubscriptionStatus(subscriptionStatus);
            const subscriptionStatusObj = new SubscriptionStatus(status);
            const index = subscriptionStatuses.value.findIndex(s => s.subscription_status_id === subscriptionStatus.subscription_status_id);
            if (index !== -1) {
                subscriptionStatuses.value[index] = status;
            }
            subscriptionStatus.value = subscriptionStatusObj;
            fb.value.showSuccess(model + '.update.' + subscriptionStatus.subscription_status_id);
            return subscriptionStatus.value;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.update.' + subscriptionStatus.subscription_status_id);
        } finally {
            fb.value.finishLoading(model + '.update.' + subscriptionStatus.subscription_status_id);
        }
    };

    const deleteSubscriptionStatus = async (subscriptionStatusId) => {
        fb.value.clearError(model + '.delete.' + subscriptionStatusId);
        fb.value.removeSuccess(model + '.delete.' + subscriptionStatusId);
        fb.value.startLoading(model + '.delete.' + subscriptionStatusId);
        try {
            await SubscriptionStatusService.deleteSubscriptionStatus(subscriptionStatusId);
            subscriptionStatuses.value = subscriptionStatuses.value.filter(s => s.subscription_status_id !== subscriptionStatusId);
            fb.value.showSuccess(model + '.delete.' + subscriptionStatusId);
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.delete.' + subscriptionStatusId);
        } finally {
            fb.value.finishLoading(model + '.delete.' + subscriptionStatusId);
        }
    };
    const subscriptionStatusesImport = async (newImport) => {
        fb.value.clearError(model+'.import');
        fb.value.removeSuccess(model+'.import');
        fb.value.startLoading(model+'.import');
        try {
            if (!newImport) {
                throw new Error('No file data provided');
            }
            const response = await SubscriptionStatusService.subscriptionStatusesImport(newImport);
            console.log('Store received response:', response);
            importExport.value = new SubscriptionStatusImportResponse(response);
            fb.value.showSuccess(model+'.import');
            return importExport.value;
        } catch (err) {
            console.error('Import error:', err);
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model+'.import');
            throw err;
        } finally {
            fb.value.finishLoading(model+'.import');
        }
    }

    return { 
        subscriptionStatuses, 
        subscriptionStatus,
        filter, 
        fb, 
        filteredSubscriptionStatuses, 
        importExport,
        resetSubscriptionStatus,
        fetchSubscriptionStatuses, 
        findSubscriptionStatusById,
        updateFilter, 
        createSubscriptionStatus, 
        updateSubscriptionStatus, 
        deleteSubscriptionStatus,
        subscriptionStatusesImport
    };
}); 