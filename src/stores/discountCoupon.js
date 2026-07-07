import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import DiscountCouponService from '../service/DiscountCouponService';
import DiscountCouponFilter from '../filters/DiscountCouponFilter';

export const useDiscountCouponStore = defineStore('discountCoupon', () => {
    const discountCoupons = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const filter = ref(new DiscountCouponFilter());

    const filteredDiscountCoupons = computed(() => {
        return discountCoupons.value.filter(coupon => {
            if (filter.value.global.value) {
                const searchStr = filter.value.global.value.toLowerCase();
                return (
                    coupon.name.toLowerCase().includes(searchStr) ||
                    coupon.code.toLowerCase().includes(searchStr) ||
                    coupon.discount.toString().includes(searchStr) ||
                    coupon.type.toLowerCase().includes(searchStr) ||
                    coupon.status.toLowerCase().includes(searchStr)
                );
            }
            return true;
        });
    });

    const fetchDiscountCoupons = async () => {
        try {
            loading.value = true;
            error.value = null;
            discountCoupons.value = await DiscountCouponService.fetchDiscountCoupons();
        } catch (e) {
            error.value = e.message;
        } finally {
            loading.value = false;
        }
    };

    const getDiscountCouponByCode = async (code) => {
        try {
            loading.value = true;
            error.value = null;
            return await DiscountCouponService.getDiscountCouponByCode(code);
        } catch (e) {
            error.value = e.message;
            return null;
        } finally {
            loading.value = false;
        }
    };

    const addDiscountCoupon = async (coupon) => {
        try {
            loading.value = true;
            error.value = null;
            const newCoupon = await DiscountCouponService.addDiscountCoupon(coupon);
            discountCoupons.value.push(newCoupon);
            return newCoupon;
        } catch (e) {
            error.value = e.message;
            return null;
        } finally {
            loading.value = false;
        }
    };

    const updateDiscountCoupon = async (coupon) => {
        try {
            loading.value = true;
            error.value = null;
            const updatedCoupon = await DiscountCouponService.updateDiscountCoupon(coupon);
            const index = discountCoupons.value.findIndex(c => c.code === coupon.code);
            if (index !== -1) {
                discountCoupons.value[index] = updatedCoupon;
            }
            return updatedCoupon;
        } catch (e) {
            error.value = e.message;
            return null;
        } finally {
            loading.value = false;
        }
    };

    const deleteDiscountCoupon = async (code) => {
        try {
            loading.value = true;
            error.value = null;
            await DiscountCouponService.deleteDiscountCoupon(code);
            discountCoupons.value = discountCoupons.value.filter(c => c.code !== code);
            return true;
        } catch (e) {
            error.value = e.message;
            return false;
        } finally {
            loading.value = false;
        }
    };

    const clearFilter = () => {
        filter.value = new DiscountCouponFilter();
    };

    return {
        discountCoupons,
        loading,
        error,
        filter,
        filteredDiscountCoupons,
        fetchDiscountCoupons,
        getDiscountCouponByCode,
        addDiscountCoupon,
        updateDiscountCoupon,
        deleteDiscountCoupon,
        clearFilter
    };
}); 