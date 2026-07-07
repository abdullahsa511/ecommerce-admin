import { Customer } from '@/models/Customer';
import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_BASE_URL || '') + '/customers';
const API_URL_DELETE = (import.meta.env.VITE_API_BASE_URL || '') + '/customer-delete';

export default class CustomerService {

    static async getCustomers() {
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

    static async searchCustomers(query) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/search?query=${query}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    return reject(error);
                });
        })
    }

    static createCustomer(newCustomer) {
        return new Promise((resolve, reject) => {
            axios.post(API_URL, newCustomer, {
                headers: { 'Content-Type': 'application/json' }
            })
                .then(response => {
                    console.log('rqs ', response);
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error creating customer:', error);
                    reject(error);
                });
        });
    }

    static updateCustomer(updateCustomer) {
        return new Promise((resolve, reject) => {
            axios.put(`${API_URL}/${updateCustomer.customer_id}`, updateCustomer, {
                headers: { 'Content-Type': 'application/json' }
            })
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error updating customer:', error);
                    reject(error);
                });
        });
    }

    static getCustomerById(id) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/${id}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error fetching customer:', error);
                    reject(error);
                });
        });
    }

    static deleteCustomer(id) {
        return new Promise((resolve, reject) => {
            axios.post(`${API_URL_DELETE}/${id}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error deleting customer:', error);
                    reject(error);
                });
        });
    }

    // import customers from CSV
    static async customersImport(fromData) {
        try {
            const response = await axios.post(`${API_URL}/import`, fromData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data;
        } catch (error) {
            console.error('Error importing customers:', error);
            throw error;
        }
    }
}

