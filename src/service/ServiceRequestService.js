import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_BASE_URL || '') + '/service-requests';

const resolveId = (serviceRequest = {}) => {
    return serviceRequest.service_request_id || serviceRequest.id;
};

export default class ServiceRequestService {
    static async getServiceRequests() {
        return new Promise((resolve, reject) => {
            axios
                .get(API_URL)
                .then((response) => resolve(response.data))
                .catch((error) => reject(error));
        });
    }

    static async searchServiceRequests(query) {
        return new Promise((resolve, reject) => {
            axios
                .get(`${API_URL}/search?query=${query}`)
                .then((response) => resolve(response.data))
                .catch((error) => reject(error));
        });
    }

    static async updateServiceRequest(serviceRequest) {
        const id = resolveId(serviceRequest);
        return new Promise((resolve, reject) => {
            axios
                .put(`${API_URL}/${id}`, serviceRequest, {
                    headers: { 'Content-Type': 'application/json' }
                })
                .then((response) => resolve(response.data))
                .catch((error) => reject(error));
        });
    }

    static async getServiceRequestById(id) {
        return new Promise((resolve, reject) => {
            axios
                .get(`${API_URL}/${id}`)
                .then((response) => resolve(response.data))
                .catch((error) => reject(error));
        });
    }

    static async deleteServiceRequest(id) {
        return new Promise((resolve, reject) => {
            axios
                .delete(`${API_URL}/${id}`)
                .then((response) => resolve(response.data))
                .catch((error) => reject(error));
        });
    }

    static async serviceRequestsImport(formData) {
        try {
            const response = await axios.post(`${API_URL}/import`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            return response.data;
        } catch (error) {
            throw error;
        }
    }
}
