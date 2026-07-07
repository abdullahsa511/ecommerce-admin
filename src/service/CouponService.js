import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/coupons';
const API_URL_IMPORT = (import.meta.env.VITE_API_BASE_URL || '') + '/import-coupons';

class CouponService {
    // Get all coupons
    static getCoupons() {
        return new Promise((resolve, reject) => {
            axios.get(API_URL)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error fetching coupons:', error);
                    reject(error);
                });
        });
    }

    // Get a single coupon by ID
    static getCouponById(couponId) {
        
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/${couponId}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error fetching coupon:', error);
                    reject(error);
                });
        });
    }

    // Create a new coupon
    static createCoupon(newCoupon) {
        return new Promise((resolve, reject) => {
            axios.post(API_URL, { coupon: newCoupon }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error creating coupon:', error);
                    reject(error);
                });
        });
    }

    // Update an existing coupon
    static updateCoupon(updatedCoupon) {
        return new Promise((resolve, reject) => {
            axios.put(`${API_URL}/${updatedCoupon.coupon_id}`, {updatedCoupon }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error updating coupon:', error);
                    reject(error);
                });
        });
    }

    // Delete a coupon
    static deleteCoupon(couponId) {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL}/${couponId}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error deleting coupon:', error);
                    reject(error);
                });
        });
    }

    static async importCoupons(fromData) {
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

export default CouponService; 