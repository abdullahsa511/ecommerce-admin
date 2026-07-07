import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/tax-rates'; 

export default class TaxRateService {

    static getTaxRates() {
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

    static getTaxRateById(taxRateId) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/${taxRateId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        })
    }
    // Create a new post
    static createTaxRate(newTaxRate) {
        return new Promise((resolve, reject) => {
            axios.post(API_URL, newTaxRate)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error creating Tax Rate:', error);
                    reject(error);
                });
        });
    }

    static updateTaxRate(taxRateId, updatedTaxRate) {
        return new Promise((resolve, reject) => {
            axios.put(`${API_URL}/${taxRateId}`, updatedTaxRate)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        });
    }

    static deleteTaxRate(taxRateId) {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL}/${taxRateId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        });
    }
    static async taxRateImport(formData) {
        try {
            const response = await axios.post(`${API_URL}/import`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error importing tax rates:', error);
            throw error;
        }
    }
} 