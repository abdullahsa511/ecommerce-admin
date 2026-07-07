import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import CouponProductService from '../service/CouponProductService';
import { Coupon, CouponProduct } from '../models/Coupon';
import FeedbackHandler from '../utils/FeedbackHandler';

export const useCouponProductStore = defineStore('couponProduct', () => {
    /**
     * @type {import('vue').Ref<CouponProduct[]>}
     */
    const couponProducts = ref([]);
     /**
     * @type {import('vue').Ref<FeedbackHandler>}
     */
     const fb = ref(new FeedbackHandler());
     const model = 'couponProduct';

     const fetchCouponProducts = async () => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            const response = await CouponProductService.getCouponProducts();
            couponProducts.value = response.map(couponProduct => new CouponProduct(couponProduct));
            fb.value.showSuccess(model);
        } catch (err) {
            fb.value.setError(err, model);
        } finally {
            fb.value.finishLoading(model);
        }
    };

    const couponProductNames = computed(() => {
        return couponProducts.value.map(couponProduct => couponProduct.product_name);
    });

    const fetchCouponProductById = async (couponProductId) => {
        fb.value.clearError(model+'.show');
        fb.value.removeSuccess(model+'.show');
        fb.value.startLoading(model+'.show');
        try {
            const couponProduct = await CouponProductService.getCouponProductById(couponProductId);
            fb.value.showSuccess(model+'.show');
            return new CouponProduct(couponProduct);
        } catch (err) {
            fb.value.setError(err, model+'.show');
        } finally {
            fb.value.finishLoading(model+'.show');
        }
    };

    const createCouponProduct = async (newCouponProducts) => {
        fb.value.clearError(model+'.create');
        fb.value.removeSuccess(model+'.create');
        fb.value.startLoading(model+'.create');
        try {
            const createdCouponProducts = await CouponProductService.createCouponProduct(newCouponProducts);
            // If the response is an array, map to CouponProduct, else single
            let result = Array.isArray(createdCouponProducts)
                ? createdCouponProducts.map(cp => new CouponProduct(cp))
                : [new CouponProduct(createdCouponProducts)];
            couponProducts.value.push(...result);
            fb.value.showSuccess(model+'.create');
            return result;
        } catch (err) {
            fb.value.setError(err, model+'.create');
        } finally {
            fb.value.finishLoading(model+'.create');
        }
    };

    const updateCouponProduct = async (updatedCouponProduct) => {
        fb.value.clearError(model+'.update');
        fb.value.removeSuccess(model+'.update');
        fb.value.startLoading(model+'.update');
        try {
            const couponProduct = await CouponProductService.updateCouponProduct(updatedCouponProduct);
            fb.value.showSuccess(model+'.update');
            return new CouponProduct(couponProduct);
        } catch (err) {
            fb.value.setError(err, model+'.update');
        } finally {
            fb.value.finishLoading(model+'.update');
        }
    };

    const deleteCouponProduct = async (couponProductId) => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            await CouponProductService.deleteCouponProduct(couponProductId);
            couponProducts.value = couponProducts.value.filter(c => c.coupon_product_id !== couponProductId);
            fb.value.showSuccess(model);
        } catch (err) {
            fb.value.setError(err, model);
        } finally {
            fb.value.finishLoading(model);
        }
    };

    const getProductList = async (query) => {
        fb.value.clearError(model+"-product-list");
        fb.value.removeSuccess(model+"-product-list");
        fb.value.startLoading(model+"-product-list");
        try {
            const response = await CouponProductService.getProductList(query);
            fb.value.showSuccess(model+"-product-list");
            return response;
        } catch (err) {
            fb.value.setError(err, model+"-product-list");
            return [];
        } finally {
            fb.value.finishLoading(model+"-product-list");
        }
    };

    return { 
        couponProducts, 
        fb, 
        model, 
        couponProductNames, 
        fetchCouponProducts, 
        fetchCouponProductById, 
        createCouponProduct, 
        updateCouponProduct, 
        deleteCouponProduct, 
        getProductList
    };
}); 