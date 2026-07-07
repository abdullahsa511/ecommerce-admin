import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/product-reviews';

export default class ProductReviewService {

    static getProductReviews() {
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

    static getProductReviewById(ProductReviewId) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/${ProductReviewId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        })
    }
    // Create a new product question
    static createProductReview(newProductReview) {
        return new Promise((resolve, reject) => {
            axios.post(API_URL, newProductReview)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error creating ProductReview:', error);
                    reject(error);
                });
        });
    }

    static updateProductReview(ProductReviewId, updatedProductReview) {
        return new Promise((resolve, reject) => {
            axios.put(`${API_URL}/${ProductReviewId}`, updatedProductReview)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        });
    }

    static deleteProductReview(ProductReviewId) {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL}/${ProductReviewId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        });
    }
    
} 