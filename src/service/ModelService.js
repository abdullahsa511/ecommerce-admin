import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/models';

export default class ModelService {
    static getModels() {
        return new Promise((resolve, reject) => {
            axios.get(API_URL)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        });
    }

    static getRelatedModels(modelType) {
        return new Promise((resolve, reject) => {
            // Create FormData object for sending form-data
            const formData = new FormData();
            formData.append('name', modelType);
            
            
            // Send POST request with form-data
            axios.post(`${API_URL}/related-models`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(response => {
                console.log('Response data:', response.data);
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error fetching related models:', error);
                console.error('Error response:', error.response);
                return reject(error);
            });
        });
    }

    static getModelById(modelId) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/${modelId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        });
    }

    static getModelFields(modelType) {
        return new Promise((resolve, reject) => {
            // Create FormData object for sending form-data
            const formData = new FormData();
            formData.append('name', modelType);
            
            // Send POST request with form-data
            axios.post(`${API_URL}/table-columns`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error fetching model fields:', error);
                return reject(error);
            });
        });
    }

    static getModelItems(modelType, fields = []) {
        return new Promise((resolve, reject) => {
            const fieldNames = fields.map(f => f.name);
            axios.post(`${API_URL}/${modelType}/items`, { fields: fieldNames })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        });
    }

    static getJoinTableColumns(modelType, relatedModelName) {
        return new Promise((resolve, reject) => {
            // Create FormData object for sending form-data
            const formData = new FormData();
            formData.append('name', modelType);
            formData.append('related_model', relatedModelName);
            
            // Send POST request with form-data
            axios.post(`${API_URL}/join-table-columns`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error fetching join table columns:', error);
                return reject(error);
            });
        });
    }
} 