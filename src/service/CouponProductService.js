import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/coupon-products';
const API_URL_PRODUCT_LIST = import.meta.env.VITE_API_BASE_URL + '/items-product-list';

class CouponProductService {
    // Get all coupon products
    static getCouponProducts() {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/products`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error fetching coupon products:', error);
                    reject(error);
                });
        });
    }

    // Get a single coupon product by ID
    static getCouponProductById(couponProductId) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/products/${couponProductId}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error fetching coupon product:', error);
                    reject(error);
                });
        });
    }

    // Create a new coupon product
    static createCouponProduct(newCouponProducts) {
        return new Promise((resolve, reject) => {
            axios.post(`${API_URL}`, {couponProduct: newCouponProducts}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error creating coupon product:', error);
                reject(error);
            });
        });
    }

    // Update an existing coupon product
    static updateCouponProduct(updatedCouponProduct) {
        return new Promise((resolve, reject) => {
            axios.put(`${API_URL}/products/${updatedCouponProduct.coupon_product_id}`, {couponProduct: updatedCouponProduct}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error updating coupon product:', error);
                reject(error);
            });
        });
    }

    // Delete a coupon product
    static deleteCouponProduct(couponProductId) {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL}/products/${couponProductId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error deleting coupon product:', error);
                reject(error);
            });
        });
    }

    // Get product list
    static getProductList(query) {
        return new Promise((resolve, reject) => {
            axios.post(API_URL_PRODUCT_LIST, 
                { search: query },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error searching products:', error);
                reject(error);
            });
        });
    }
}

export default CouponProductService; 