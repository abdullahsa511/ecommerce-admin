import Company from '@/models/Company';
import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_BASE_URL || '') + '/companies';
const API_URL_DELETE = (import.meta.env.VITE_API_BASE_URL || '') + '/company-delete';

export default class CompanyService {

    static async getCompanies() {
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

    // static searchVendors(query) {
    //     return new Promise((resolve, reject) => {
    //         axios.get(`${API_URL}/search-vendors?name=${query}`)
    //             .then(response => {
    //                 resolve(response.data);
    //                 console.log('response', `${API_URL}/search-vendors?query=${query}`);
    //             })
    //             .catch(error => {
    //                 return reject(error);
    //             });
    //     })
    // }

    static createCompany(newCompany) {
        return new Promise((resolve, reject) => {
            axios.post(API_URL, newCompany, {
                headers: { 'Content-Type': 'application/json' }
            })
                .then(response => {
                    console.log('rqs ', response);
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error creating company:', error);
                    reject(error);
                });
        });
    }

    static updateCompany(updateCompany) {
        return new Promise((resolve, reject) => {
            axios.put(`${API_URL}/${updateCompany.company_id}`, updateCompany, {
                headers: { 'Content-Type': 'application/json' }
            })
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error updating company:', error);
                    reject(error);
                });
        });
    }

    static getCompanyById(id) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/${id}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error fetching company:', error);
                    reject(error);
                });
        });
    }

    static deleteCompany(id) {
        return new Promise((resolve, reject) => {
            axios.post(`${API_URL_DELETE}/${id}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error deleting company:', error);
                    reject(error);
                });
        });
    }

    // import companies from CSV
    static async companiesImport(fromData) {
        try {
            const response = await axios.post(`${API_URL}/import`, fromData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data;
        } catch (error) {
            console.error('Error importing companies:', error);
            throw error;
        }
    }
}

