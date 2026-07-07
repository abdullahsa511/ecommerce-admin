import axios from 'axios';


const API_URL = import.meta.env.VITE_API_BASE_URL + '/return-reasons';
const API_URL_IMPORT = import.meta.env.VITE_API_BASE_URL + '/return-reasons/import';

export class ReturnReasonService {
    static getReturnReasons() {
        return new Promise((resolve, reject) => {
            axios.get(API_URL)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    return reject(error);
                });
        })
    }

    static getReturnReasonById(returnReasonId) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/${returnReasonId}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    return reject(error);
                });
        })
    }
    // Create a new post
    static createReturnReason(newReturnReason) {
        return new Promise((resolve, reject) => {
            axios.post(API_URL, newReturnReason)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error creating Return Reason:', error);
                    reject(error);
                });
        });
    }

    static updateReturnReason(returnReasonId, updatedReturnReason) {
        return new Promise((resolve, reject) => {
            axios.put(`${API_URL}/${returnReasonId}`, updatedReturnReason)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    return reject(error);
                });
        });
    }

    static deleteReturnReason(returnReasonId) {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL}/${returnReasonId}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    return reject(error);
                });
        });
    }

    // import export
    static async returnReasonsImport(fromData) {
        try {
            const response = await axios.post(`${API_URL_IMPORT}`, fromData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data;
        } catch (error) {
            console.error('Error importing stock statuses:', error);
            throw error;
        }
    }
} 