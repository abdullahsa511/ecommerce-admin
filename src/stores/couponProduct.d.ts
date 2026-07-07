import { CouponProduct } from '@/models/Coupon.ts';
import FeedbackHandler from '@/utils/FeedbackHandler';
import { defineStore } from 'pinia';

export interface CouponProductState {
  couponProducts: CouponProduct[];
  fb: FeedbackHandler;
}

export const useCouponProductStore = defineStore('couponProduct', {
  state: (): CouponProductState => ({
    couponProducts: [],
    fb: new FeedbackHandler()
  }),
  actions: {
    async fetchCouponProducts() {},
    async fetchCouponProductById(couponProductId: number | string): Promise<CouponProduct | any> {},
    async createCouponProduct(newCouponProduct: CouponProduct): Promise<CouponProduct | any> {},
    async updateCouponProduct(updatedCouponProduct: CouponProduct): Promise<CouponProduct | any> {},
    async deleteCouponProduct(couponProductId: number | string) {},
    async getProductList(query: string): Promise<any[]> {},
  }
}); 