
import { Coupon } from '@/models/Coupon';
import CouponImportResponse from '@/models/CouponImport';
import FeedbackHandler from '@/utils/FeedbackHandler';
import { defineStore } from 'pinia';

export interface CouponState {
  coupons: Coupon[];
  coupon: Coupon;
  fb: FeedbackHandler;
  productList: any[];
  model: string;
  importExport: CouponImportResponse;
}

export const useCouponStore = defineStore('coupon', {
  state: (): CouponState => ({
    coupons: [],
    coupon: new Coupon(),
    fb: new FeedbackHandler(),
    productList: [],
    model:'coupon',
    importExport: new CouponImportResponse(),
  }),
  actions: {
    resetCoupon() {},
    async fetchCoupons() {},
    async fetchCouponById(couponId: number | string): Promise<Coupon | any> {},
    async createCoupon(newCoupon: Coupon): Promise<Coupon | any> {},
    async updateCoupon(updatedCoupon: Coupon): Promise<Coupon | any> {},
    async deleteCoupon(couponId: number | string) {},
    async getProductList(query: string): Promise<any[]> {},
    async importCoupons(newImport: FormData): Promise<any> {}
  }
}); 