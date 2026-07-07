import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/product-discounts';
const API_URL_IMPORT = (import.meta.env.VITE_API_BASE_URL || '') + '/import-product-discounts';

export default class ProductDiscountService {

    static getProductDiscounts() {
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

    static getProductDiscountById(productDiscountId) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/${productDiscountId}`)
                .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        })
    }
    // Create a new post
    static createProductDiscount(newProductDiscount) {
        return new Promise((resolve, reject) => {
            axios.post(API_URL, newProductDiscount, {
                headers: {'Content-Type': 'application/json'}
            })
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error creating Length Type:', error);
                    reject(error);
                });
        });
    }

    static updateProductDiscount(updatedProductDiscount) {
        return new Promise((resolve, reject) => {
            axios.put(`${API_URL}/${updatedProductDiscount.product_discount_id}`, updatedProductDiscount, {
                headers: {'Content-Type': 'application/json'}
            })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        });
    }

    static deleteProductDiscount(productDiscountId) {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL}/${productDiscountId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        });
    }

    static async importProductDiscounts(fromData) {
        // alert('importVariants');
        try {
          const response = await axios.post(`${API_URL_IMPORT}`, fromData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
    
          return response.data;
        } catch (error) {
          console.error('Error importing length types:', error);
          throw error;
        }
      }
    
} 