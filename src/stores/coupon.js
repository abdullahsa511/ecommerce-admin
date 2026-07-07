import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import CouponService from '@/service/CouponService';
import CouponFilter from '@/filters/CouponFilter';
import FeedbackHandler from '../utils/FeedbackHandler';
import CouponImportResponse from '@/models/CouponImport';
import CouponProductService from '@/service/CouponProductService';
import Coupon from '@/models/Coupon';

export const useCouponStore = defineStore('coupon', () => {


    const importExport = ref(new CouponImportResponse());
    const coupons = ref([]);
    const coupon = ref(new Coupon());
    const filter = ref(new CouponFilter());
    const fb = ref(new FeedbackHandler());
    const model = 'coupon';
    const productList = ref([]);

    const resetCoupon = () => {
        coupon.value = new Coupon();
    };

    const fetchCoupons = async () => {
        fb.value.clearError(model + 'list');
        fb.value.removeSuccess(model + 'list');
        fb.value.startLoading(model + 'list');
        try {
            const response = await CouponService.getCoupons();
            coupons.value = response.map(coupon => new Coupon(coupon));
            fb.value.showSuccess(model + 'list');
        } catch (err) {
            fb.value.setError(err, model + 'list');
        } finally {
            fb.value.finishLoading(model + 'list');
        }
    };

    // const couponNames = computed(() => {
    //     return coupons.value.map(coupon => coupon.couponDetails.name);
    // });

    const fetchCouponById = async (couponId) => {
        
        fb.value.clearError(model + '.edit.' + couponId);
        fb.value.removeSuccess(model + '.edit.' + couponId);
        fb.value.startLoading(model + '.edit.' + couponId);
        try {
            const data = await CouponService.getCouponById(couponId);
            coupon.value = new Coupon(data);
            
            console.log('this is store data', coupon.value);
            fb.value.showSuccess(model + '.edit.' + couponId);
            return coupon.value;
        } catch (err) {
            fb.value.setError(err, model + '.edit.' + couponId);
        } finally {
            fb.value.finishLoading(model + '.edit.' + couponId);
        }
    };

    const createCoupon = async (newCoupon) => {
        console.log('this is create value test', newCoupon);
        
        fb.value.clearError(model + '.create');
        fb.value.removeSuccess(model + '.create');
        fb.value.startLoading(model + '.create');
        try {
            const createdCoupon = await CouponService.createCoupon(newCoupon);
            let coupon = new Coupon(createdCoupon);
            coupons.value.push(coupon);
            fb.value.showSuccess(model + '.create');
            return coupon;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.create');
            throw error;
        } finally {
            fb.value.finishLoading(model + '.create');
        }
    };

    const updateCoupon = async (updatedCoupon) => {
        fb.value.clearError(model + '.update.' + updatedCoupon.coupon_id);
        fb.value.removeSuccess(model + '.update.' + updatedCoupon.coupon_id);
        fb.value.startLoading(model + '.update.' + updatedCoupon.coupon_id);
        try {
            const coupondata = await CouponService.updateCoupon(updatedCoupon);
            fb.value.showSuccess(model + '.update.' + updatedCoupon.coupon_id);
            return new Coupon(coupondata);
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.update.' + updatedCoupon.coupon_id);
            throw error;
        } finally {
            fb.value.finishLoading(model + '.update.' + updatedCoupon.coupon_id);
        }
    };

    const deleteCoupon = async (couponId) => {
        fb.value.clearError(model + '.delete.' + couponId);
        fb.value.removeSuccess(model + '.delete.' + couponId);
        fb.value.startLoading(model + '.delete.' + couponId);
        try {
            await CouponService.deleteCoupon(couponId);
            coupons.value = coupons.value.filter(c => c.coupon_id !== couponId);
            fb.value.showSuccess(model + '.delete.' + couponId);
        } catch (err) {
            fb.value.setError(err, model + '.delete.' + couponId);
        } finally {
            fb.value.finishLoading(model + '.delete.' + couponId);
        }
    };

    const getProductList = async (query) => {
        fb.value.clearError(model + "-product-list");
        fb.value.removeSuccess(model + "-product-list");
        fb.value.startLoading(model + "-product-list");
        try {
            const response = await CouponProductService.getProductList(query);
            fb.value.showSuccess(model + "-product-list");
            return response;
        } catch (err) {
            fb.value.setError(err, model + "-product-list");
            return [];
        } finally {
            fb.value.finishLoading(model + "-product-list");
        }
    };

    const importCoupons = async (newImport) => {
        fb.value.clearError(model + '.import');
        fb.value.removeSuccess(model + '.import');
        fb.value.startLoading(model + '.import');
        try {
            if (!newImport) {
                throw new Error('No file data provided');
            }
            const response = await CouponService.importCoupons(newImport);
            importExport.value = new CouponImportResponse(response);
            fb.value.showSuccess(model + '.import');
            return importExport.value;
        } catch (err) {
            console.error('Import error:', err);
            fb.value.setError(err, model + '.import');
            throw err;
        } finally {
            fb.value.finishLoading(model + '.import');
        }
    };

    return {
        coupons,
        coupon,
        fb,
        model,
        // couponNames, 
        productList,
        importExport,
        filter,
        resetCoupon,
        fetchCoupons,
        fetchCouponById,
        createCoupon,
        updateCoupon,
        deleteCoupon,
        getProductList,
        importCoupons
    };
}); 