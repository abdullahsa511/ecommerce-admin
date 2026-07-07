
import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_BASE_URL || '') + '/contact-requests';

export default class ContactRequestService {

    static async getContactRequests() {
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

    static async searchContactRequests(query) {
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

    // static createCustomer(newCustomer) {
    //     return new Promise((resolve, reject) => {
    //         axios.post(API_URL, newCustomer, {
    //             headers: { 'Content-Type': 'application/json' }
    //         })
    //             .then(response => {
    //                 console.log('rqs ', response);
    //                 resolve(response.data);
    //             })
    //             .catch(error => {
    //                 console.error('Error creating customer:', error);
    //                 reject(error);
    //             });
    //     });
    // }

    static updateContactRequest(contactRequest) {
        return new Promise((resolve, reject) => {
            axios.put(`${API_URL}/${contactRequest.visit_showroom_id}`, contactRequest, {
                headers: { 'Content-Type': 'application/json' }
            })
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error updating contact request:', error);
                    reject(error);
                });
        });
    }

    static getContactRequestById(id) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/${id}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error fetching contact request:', error);
                    reject(error);
                });
        });
    }

    static async deleteContactRequest(id) {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL}/${id}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error deleting contact request:', error);
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

