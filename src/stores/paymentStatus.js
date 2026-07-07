import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { PaymentStatusService } from '../service/PaymentStatusService';
import { PaymentStatusFilter } from '../filters/PaymentStatusFilter';
import FeedbackHandler from '../utils/FeedbackHandler';
import PaymentStatus from '../models/PaymentStatus';
import PaymentStatusImportResponse from '@/models/PaymentStatusImportResponse';

export const usePaymentStatusStore = defineStore('paymentStatus', () => {
    /**
     * @type {import('vue').Ref<PaymentStatus[]>}
     */
    const paymentStatuses = ref([]);
    const paymentStatus = ref(new PaymentStatus());
    const filter = ref(new PaymentStatusFilter());
    const fb = ref(new FeedbackHandler());
    const model = 'paymentStatus';
    const importExport = ref(new PaymentStatusImportResponse());

    const filteredPaymentStatuses = computed(() => {
        return filter.value.apply(paymentStatuses.value);
    });
    const resetPaymentStatus = () => {
        paymentStatus.value = new PaymentStatus();
    };

    const fetchPaymentStatuses = async () => {
        fb.value.clearError(model + '.list');
        fb.value.removeSuccess(model + '.list');
        fb.value.startLoading(model + '.list');
        try {
            const response = await PaymentStatusService.getPaymentStatuses();
            paymentStatuses.value = response.map(paymentStatus => new PaymentStatus(paymentStatus));
            fb.value.showSuccess(model + '.list');
        } catch (err) {
            fb.value.setError(err, model + '.list');
            console.error('Error fetching payment statuses:', err);
        } finally {
            fb.value.finishLoading(model + '.list');
        }
    };

    const findPaymentStatusById = async (paymentStatusId) => {
        let status = paymentStatuses.value.find(s => s.payment_status_id === paymentStatusId);
        if (!status) {
            fb.value.clearError(model + '.edit.' + paymentStatusId);
            fb.value.removeSuccess(model + '.edit.' + paymentStatusId);
            fb.value.startLoading(model + '.edit.' + paymentStatusId);
            try {
                const response = await PaymentStatusService.getPaymentStatusById(paymentStatusId);
                paymentStatus.value = new PaymentStatus(response);
                fb.value.showSuccess(model + '.edit.' + paymentStatusId);
                return paymentStatus.value;
            } catch (err) {
                let error = err.response?.data?.errors;
                if(!error) error = err;
                fb.value.setError(error, model + '.edit.' + paymentStatusId);
            } finally {
                fb.value.finishLoading(model + '.edit.' + paymentStatusId);
            }
        }else{
            paymentStatus.value = status;
            fb.value.showSuccess(model + '.edit.' + paymentStatusId);
            return paymentStatus.value;
        }
    };

    const updateFilter = (newFilter) => {
        filter.value = { ...filter.value, ...newFilter };
    };

    const createPaymentStatus = async () => {
        const newPaymentStatus = paymentStatus.value;
        fb.value.clearError(model + '.create');
        fb.value.removeSuccess(model + '.create');
        fb.value.startLoading(model + '.create');
        try {
            const createdPaymentStatus = await PaymentStatusService.createPaymentStatus(newPaymentStatus);
            paymentStatus.value = new PaymentStatus(createdPaymentStatus);
            paymentStatuses.value.push(paymentStatus.value);
            fb.value.showSuccess(model + '.create');
            return paymentStatus.value;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.create');
        } finally {
            fb.value.finishLoading(model + '.create');
        }
    };

    const updatePaymentStatus = async (paymentStatus) => {
        fb.value.clearError(model + '.update.' + paymentStatus.payment_status_id);
        fb.value.removeSuccess(model + '.update.'+paymentStatus.payment_status_id);
        fb.value.startLoading(model + '.update.'+paymentStatus.payment_status_id);
        try {
            const updatedPaymentStatus = await PaymentStatusService.updatePaymentStatus(paymentStatus);
            paymentStatus.value = new PaymentStatus(updatedPaymentStatus);
            const index = paymentStatuses.value.findIndex(s => s.payment_status_id === paymentStatus.payment_status_id);
            if (index !== -1) {
                paymentStatuses.value[index] = paymentStatus.value;
            }
            fb.value.showSuccess(model + '.update.'+paymentStatus.payment_status_id);
            return paymentStatus.value;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.update.'+paymentStatus.payment_status_id);
        } finally {
            fb.value.finishLoading(model + '.update.'+paymentStatus.payment_status_id);
        }
    };

    const deletePaymentStatus = async (paymentStatusId) => {
        fb.value.clearError(model + '.delete.'+paymentStatusId);
        fb.value.removeSuccess(model + '.delete.'+paymentStatusId);
        fb.value.startLoading(model + '.delete.'+paymentStatusId);
        try {
            await PaymentStatusService.deletePaymentStatus(paymentStatusId);
            paymentStatuses.value = paymentStatuses.value.filter(s => s.payment_status_id !== paymentStatusId);
            fb.value.showSuccess(model + '.delete.'+paymentStatusId);
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.delete.'+paymentStatusId);
        } finally {
            fb.value.finishLoading(model + '.delete.'+paymentStatusId);
        }
    };
    const paymentStatusesImport = async (newImport) => {
        fb.value.clearError(model+'.import');
        fb.value.removeSuccess(model+'.import');
        fb.value.startLoading(model+'.import');
        try {
            if (!newImport) {
                throw new Error('No file data provided');
            }
            const response = await PaymentStatusService.paymentStatusesImport(newImport);
            console.log('Store received response:', response);
            importExport.value = new PaymentStatusImportResponse(response);
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
        paymentStatuses, 
        paymentStatus,
        filter, 
        fb, 
        filteredPaymentStatuses, 
        importExport,
        resetPaymentStatus,
        fetchPaymentStatuses, 
        findPaymentStatusById,
        updateFilter, 
        createPaymentStatus, 
        updatePaymentStatus, 
        deletePaymentStatus,
        paymentStatusesImport
    };
}); 