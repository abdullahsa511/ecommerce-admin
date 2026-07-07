import axios from 'axios';
const API_URL = import.meta.env.VITE_API_BASE_URL + '/manufacturers';
const API_URL_IMPORT = (import.meta.env.VITE_API_BASE_URL || '') + '/import-manufacturers';

export default class ManufacturerService {
    static async fetchManufacturers() {
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

    static async getManufacturerById(id) {
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

    static async createManufacturer(manufacturer) {
        return new Promise((resolve, reject) => {
            axios.post(API_URL, manufacturer)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    return reject(error);
                });
        })
    }

    static async updateManufacturer(manufacturer) {
        return new Promise((resolve, reject) => {
            axios.put(`${API_URL}/${manufacturer.manufacturer_id}`, manufacturer)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    return reject(error);
                });
        })
    }

    static async deleteManufacturer(id) {
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
    static async importManufacturers(formData) {
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
    // upload manufacturer images
    static async uploadManufacturerImages(files, property, manufacturerId) {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            for (const file of files) {
                formData.append(file.index.toString(), file.file);
            }
            // Add property to form data for backend processing
            if (property) {
                formData.append('property', property);
            }

            axios.post(`${API_URL}/${manufacturerId}/upload`, formData, {
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

    // delete manufacturer images
    static async deleteManufacturerImages(file, manufacturerId) {
        return new Promise((resolve, reject) => {
            axios.post(`${API_URL}/${manufacturerId}/delete`, { file: file })
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    return reject(error);
                });
        })
    }
} 