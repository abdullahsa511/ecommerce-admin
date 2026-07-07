import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/product-types';

export default class ProductTypeService {

    static getProductTypes() {
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

    static getProductTypeById(productTypeId) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/${productTypeId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        })
    }
    // Create a new product type
    static createProductType(newProductType) {
        return new Promise((resolve, reject) => {
            axios.post(API_URL, newProductType)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error creating Product Type:', error);
                    reject(error);
                });
        });
    }

    static updateProductType(productTypeId, updatedProductType) {
        return new Promise((resolve, reject) => {
            axios.put(`${API_URL}/${productTypeId}`, updatedProductType)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        });
    }

    static deleteProductType(productTypeId) {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL}/${productTypeId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        });
    }

    // import product types csv
    static async productTypeImport(formData) {
        try {
            const response = await axios.post(`${API_URL}/import`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error importing product types:', error);
            throw error;
        }
    }

    static async uploadProductTypeImages(files, property, productTypeId) {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            for(const file of files) {
                formData.append(file.index.toString(), file.file);
            }
            if (property) {
                formData.append('property', property);
            }
            
            axios.post(`${API_URL}/${productTypeId}/upload`, formData, {
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

    // delete product type images
    static async deleteProductTypeImages(file, productTypeId) {
        return new Promise((resolve, reject) => {
            axios.post(`${API_URL}/${productTypeId}/delete`, {file: file})
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        })
    }
    
} 