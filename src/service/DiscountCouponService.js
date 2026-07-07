import axios from 'axios';
import DiscountCoupon from '../models/DiscountCoupon';

export default class DiscountCouponService {
    static async fetchDiscountCoupons() {
        try {
            const response = await axios.get('/data/discount-coupons.json');
            return response.data.map(coupon => DiscountCoupon.fromJSON(coupon));
        } catch (error) {
            console.error('Error fetching discount coupons:', error);
            throw error;
        }
    }

    static async getDiscountCouponByCode(code) {
        try {
            const response = await axios.get('/data/discount-coupons.json');
            const coupon = response.data.find(c => c.code === code);
            return coupon ? DiscountCoupon.fromJSON(coupon) : null;
        } catch (error) {
            console.error('Error fetching discount coupon:', error);
            throw error;
        }
    }

    static async addDiscountCoupon(coupon) {
        try {
            const newCoupon = {
                ...coupon,
                date_added: new Date().toISOString(),
                date_updated: new Date().toISOString()
            };
            return DiscountCoupon.fromJSON(newCoupon);
        } catch (error) {
            console.error('Error adding discount coupon:', error);
            throw error;
        }
    }

    static async updateDiscountCoupon(coupon) {
        try {
            const updatedCoupon = {
                ...coupon,
                date_updated: new Date().toISOString()
            };
            return DiscountCoupon.fromJSON(updatedCoupon);
        } catch (error) {
            console.error('Error updating discount coupon:', error);
            throw error;
        }
    }

    static async deleteDiscountCoupon(code) {
        try {
            // Simulate API call
            return true;
        } catch (error) {
            console.error('Error deleting discount coupon:', error);
            throw error;
        }
    }
} 