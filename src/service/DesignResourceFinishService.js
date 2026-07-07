import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/design-resources/finishes';
const API_URL_TYPES = import.meta.env.VITE_API_BASE_URL + '/design-resources/types';
const API_RESOURCE_URL = import.meta.env.VITE_API_BASE_URL + '/design-resources';
const API_URL_IMPORT = (import.meta.env.VITE_API_BASE_URL || '') + '/finishes-import';
const API_DOCUMENT_URL = import.meta.env.VITE_API_BASE_URL + '/design-resources/documents';
const API_UPLOAD_URL = import.meta.env.VITE_API_BASE_URL + '/design-resources/upload';

export default class DesignResourceFinishService {

    static getFinishes() {
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

    static async getTypes() {
        try {
            const response = await axios.get(API_URL_TYPES + '?resource_type=finishes');
            return response.data;
        } catch (error) {
            console.error('Error fetching product attributes:', error);
            throw error;
        }
    }
    static getFinishById(finishId) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_RESOURCE_URL}/${finishId}?resource_type=finishes`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    return reject(error);
                });
        })
    }
    // Create a new post
    static createFinish(newFinish) {
        return new Promise((resolve, reject) => {
            axios.post(API_URL + '/create', newFinish, {
                headers: { 'Content-Type': 'application/json' }
            })
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error creating finish:', error);
                    reject(error);
                });
        });
    }

    static updateFinish(updatedFinish) {
        return new Promise((resolve, reject) => {
            axios.put(`${API_URL}/update/${updatedFinish.design_resource_id}`, updatedFinish, {
                headers: { 'Content-Type': 'application/json' }
            })
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    return reject(error);
                });
        });
    }

    static deleteFinish(finishId) {
        return new Promise((resolve, reject) => {
            axios.post(`${API_URL}/delete/${finishId}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    return reject(error);
                });
        });
    }

    static async uploadFiles(files, property, id) {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            for (const file of files) {
                formData.append(file.index.toString(), file.file);
            }

            formData.append('property', property);
            formData.append('resource_type', 'finishes');
            axios.post(`${API_UPLOAD_URL}/${id}`, formData, {
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

    static async importFinishes(fromData) {
        // alert('importVariants');
        try {
            const response = await axios.post(`${API_URL_IMPORT}`, fromData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data;
        } catch (error) {
            console.error('Error importing finishes:', error);
            throw error;
        }
    }

} 