import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/vendors';
const API_URL_IMPORT = (import.meta.env.VITE_API_BASE_URL || '') + '/import-vendors';

export default class VendorService {

    static fetchVendors() {
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

    static searchVendors(query) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/search-vendors?name=${query}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        })
    }

    static async getVendorById(id) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/${id}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        })
    }

    static async createVendor(vendor) {
        console.log('createVendor service', vendor);
        
        return new Promise((resolve, reject) => {
            axios.post(API_URL, vendor)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        })
    }

    static async updateVendor(vendor) {
        return new Promise((resolve, reject) => {
            axios.put(`${API_URL}/${vendor.vendor_id}`, vendor)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        })
    }

    static async importVendors(formData) {
        return new Promise((resolve, reject) => {
            axios.post(API_URL_IMPORT, formData)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        })
    }

    static async deleteVendor(id) {
       return new Promise((resolve, reject) => {
            axios.delete(`${API_URL}/${id}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        })
    }

    // upload vendor images
    static async uploadVendorImages(files, property, vendorId) {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            for(const file of files) {
                formData.append(file.index.toString(), file.file);
            }
            // Add property to form data for backend processing
            if (property) {
                formData.append('property', property);
            }
            console.log( "formData vendor images", formData);
            axios.post(`${API_URL}/${vendorId}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error uploading files:', error);
                reject(error);
            });
        });
    }

    // delete vendor images
    static async deleteVendorImages(file, vendorId) {
        return new Promise((resolve, reject) => {
            axios.post(`${API_URL}/${vendorId}/delete`, {file: file})
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        })
    }
} 