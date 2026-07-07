import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/currencies';

export default class CurrencyService {

    static getCurrencies() {
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

    static getCurrencyById(currencyId) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/${currencyId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        })
    }
    // Create a new post
    static createCurrency(newCurrency) {
        return new Promise((resolve, reject) => {
            axios.post(API_URL, newCurrency)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error creating Currency:', error);
                    reject(error);
                });
        });
    }

    static updateCurrency(currencyId, updatedCurrency) {
        return new Promise((resolve, reject) => {
            axios.put(`${API_URL}/${currencyId}`, updatedCurrency)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        });
    }

    static deleteCurrency(currencyId) {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL}/${currencyId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        });
    }
    
} 