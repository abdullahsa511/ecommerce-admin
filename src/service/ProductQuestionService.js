import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/product-questions';

export default class ProductQuestionService {

    static getProductQuestions() {
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

    static getProductQuestionById(ProductQuestionId) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/${ProductQuestionId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        })
    }
    // Create a new product question
    static createProductQuestion(newProductQuestion) {
        return new Promise((resolve, reject) => {
            axios.post(API_URL, newProductQuestion)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error creating ProductQuestion:', error);
                    reject(error);
                });
        });
    }

    static updateProductQuestion(ProductQuestionId, updatedProductQuestion) {
        return new Promise((resolve, reject) => {
            axios.put(`${API_URL}/${ProductQuestionId}`, updatedProductQuestion)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        });
    }

    static deleteProductQuestion(ProductQuestionId) {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL}/${ProductQuestionId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        });
    }
    
} 