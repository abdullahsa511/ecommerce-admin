import axios from 'axios';
import ProductTag from '../models/ProductTag';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/product-tags';

export default class ProductTagService {

    static getProductTags() {
        return new Promise((resolve, reject) => {
            axios.get(API_URL)
            .then(response => {
                resolve(response.data.map(tag => new ProductTag(tag)));
            })
            .catch(error => {
                return reject(error);
            });
        })
    }

    static getProductTagById(tagId) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/${tagId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        })
    }

    static createProductTag(newTag) {
        return new Promise((resolve, reject) => {
            axios.post(API_URL, newTag)
                .then(response => {
                    resolve(new ProductTag(response.data));
                })
                .catch(error => {
                    console.error('Error creating ProductTag:', error);
                    reject(error);
                });
        });
    }

    static updateProductTag(tagId, updatedTag) {
        return new Promise((resolve, reject) => {
            axios.put(`${API_URL}/${tagId}`, updatedTag)
            .then(response => {
                resolve(new ProductTag(response.data));
            })
            .catch(error => {
                return reject(error);
            });
        });
    }

    static deleteProductTag(tagId) {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL}/${tagId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        });
    }
} 