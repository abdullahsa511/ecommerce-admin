import { ref } from 'vue';
import { defineStore } from 'pinia';
import ServiceRequestService from '@/service/ServiceRequestService';
import { Service } from '@/models/Service';
import FeedbackHandler from '@/utils/FeedbackHandler';

const resolveId = (serviceRequest = {}) => {
    return serviceRequest.service_request_id;
};

export const useServiceRequestStore = defineStore('serviceRequest', () => {
    const serviceRequests = ref([]);
    const serviceRequest = ref(new Service());
    const filter = ref(null);
    const error = ref(null);
    const loading = ref(null);
    const fb = ref(new FeedbackHandler());

    const model = 'serviceRequest';

    const resetServiceRequest = () => {
        serviceRequest.value = new Service();
    };

    const fetchServiceRequests = async () => {
        fb.value.clearError(model + '.list');
        fb.value.removeSuccess(model + '.list');
        fb.value.startLoading(model + '.list');
        try {
            const response = await ServiceRequestService.getServiceRequests();
            const rows = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
            serviceRequests.value = rows.map((item) => new Service(item));
            return serviceRequests.value;
        } catch (err) {
            fb.value.setError(err, model + '.list');
            throw err;
        } finally {
            fb.value.finishLoading(model + '.list');
        }
    };

    const getServiceRequestById = async (id) => {
        fb.value.clearError(model + '.show.' + id);
        fb.value.removeSuccess(model + '.show.' + id);
        fb.value.startLoading(model + '.show.' + id);
        try {
            const response = await ServiceRequestService.getServiceRequestById(id);
            const payload = response?.data && !Array.isArray(response.data) ? response.data : response;
            serviceRequest.value = new Service(payload);
            fb.value.showSuccess(model + '.show.' + id);
            return serviceRequest.value;
        } catch (err) {
            fb.value.setError(err, model + '.show.' + id);
            throw err;
        } finally {
            fb.value.finishLoading(model + '.show.' + id);
        }
    };

    const updateServiceRequest = async (updatedServiceRequest) => {
        const id = resolveId(updatedServiceRequest);
        fb.value.clearError(model + '.update.' + id);
        fb.value.removeSuccess(model + '.update.' + id);
        fb.value.startLoading(model + '.update.' + id);
        try {
            const response = await ServiceRequestService.updateServiceRequest(updatedServiceRequest);
            fb.value.showSuccess(model + '.update.' + id);
            const payload = response?.data && !Array.isArray(response.data) ? response.data : response;
            serviceRequest.value = new Service(payload);
            return serviceRequest.value;
        } catch (err) {
            const requestError = err.response?.data?.errors || err;
            fb.value.setError(requestError, model + '.update.' + id);
            throw err;
        } finally {
            fb.value.finishLoading(model + '.update.' + id);
        }
    };

    const deleteServiceRequest = async (id) => {
        fb.value.clearError(model + '.delete.' + id);
        fb.value.removeSuccess(model + '.delete.' + id);
        fb.value.startLoading(model + '.delete.' + id);
        try {
            await ServiceRequestService.deleteServiceRequest(id);
            serviceRequests.value = serviceRequests.value.filter((item) => resolveId(item) !== id);
            fb.value.showSuccess(model + '.delete.' + id);
        } catch (err) {
            fb.value.setError(err, model + '.delete.' + id);
            throw err;
        } finally {
            fb.value.finishLoading(model + '.delete.' + id);
        }
    };

    const serviceRequestsImport = async (newImport) => {
        fb.value.clearError(model + '.import');
        fb.value.removeSuccess(model + '.import');
        fb.value.startLoading(model + '.import');
        try {
            const response = await ServiceRequestService.serviceRequestsImport(newImport);
            fb.value.showSuccess(model + '.import');
            return response;
        } catch (err) {
            fb.value.setError(err, model + '.import');
            throw err;
        } finally {
            fb.value.finishLoading(model + '.import');
        }
    };

    return {
        serviceRequests,
        serviceRequest,
        filter,
        loading,
        error,
        fb,
        resetServiceRequest,
        fetchServiceRequests,
        getServiceRequestById,
        updateServiceRequest,
        deleteServiceRequest,
        serviceRequestsImport
    };
});
