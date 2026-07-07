import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/tax-types';

export default class TaxTypeService {

    static getTaxTypes() {
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

    static getTaxTypeById(taxTypeId) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/${taxTypeId}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    return reject(error);
                });
        })
    }
    // Create a new post
    static createTaxType(newTaxType) {
        return new Promise((resolve, reject) => {
            axios.post(API_URL, newTaxType)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error creating Tax Type:', error);
                    reject(error);
                });
        });
    }

    static updateTaxType(taxTypeId, updatedTaxType) {
        return new Promise((resolve, reject) => {
            axios.put(`${API_URL}/${taxTypeId}`, updatedTaxType)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    return reject(error);
                });
        });
    }

    static deleteTaxType(taxTypeId) {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL}/${taxTypeId}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    return reject(error);
                });
        });
    }

    // import tax types csv 
    // static importTaxTypes(newImport) {
    //     return new Promise((resolve, reject) => {
    //         console.log('newImport', newImport);
    //         axios.post(`${API_URL}/import`, newImport)
    //             .then(response => {
    //                 resolve(response.data);
    //             })
    //             .catch(error => {
    //                 return reject(error);
    //             });
    //     });
    // }

    // import attributes from CSV
    static async importTaxTypes(fromData) {
        try {
            const response = await axios.post(`${API_URL}/import`, fromData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data;
        } catch (error) {
            console.error('Error importing product attributes:', error);
            throw error;
        }
    }
} 