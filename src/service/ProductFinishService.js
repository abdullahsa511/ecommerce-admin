import axios from 'axios';
import ProductFinish from '../models/ProductFinish';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/product-finishes';

export default class ProductFinishService {

    static getProductFinishes() {
        return new Promise((resolve, reject) => {
            axios.get(API_URL)
            .then(response => {
                resolve(response.data.map(finish => new ProductFinish(finish)));
            })
            .catch(error => {
                return reject(error);
            });
        })
    }

    static getProductFinishById(finishId) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/${finishId}`)
            .then(response => {
                resolve(new ProductFinish(response.data));
            })
            .catch(error => {
                return reject(error);
            });
        })
    }

    static createProductFinish(newFinish) {
        return new Promise((resolve, reject) => {
            axios.post(API_URL, newFinish)
                .then(response => {
                    resolve(new ProductFinish(response.data));
                })
                .catch(error => {
                    console.error('Error creating ProductFinish:', error);
                    reject(error);
                });
        });
    }

    static updateProductFinish(finishId, updatedFinish) {
        return new Promise((resolve, reject) => {
            axios.put(`${API_URL}/${finishId}`, updatedFinish)
            .then(response => {
                resolve(new ProductFinish(response.data));
            })
            .catch(error => {
                return reject(error);
            });
        });
    }

    static deleteProductFinish(finishId) {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL}/${finishId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        });
    }
}
