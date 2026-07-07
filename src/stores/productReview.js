import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import ProductReview from '../models/ProductReview';
import ProductReviewService from '../service/ProductReviewService';
import FeedbackHandler from '../utils/FeedbackHandler';
import ProductReviewFilter from '../filters/ProductReviewFilter';

export const useProductReviewStore = defineStore('productReview', () => {
    /**
     * @type {Ref<ProductReview[]>}
     */
    const productReviews = ref([]);
    const filter = ref(new ProductReviewFilter());

    const selectedStatus = ref('All');

    /**
     * @type {import('vue').Ref<FeedbackHandler>}
     */
    const fb = ref(new FeedbackHandler());
    const model = 'productReview';

    const filteredProductReviews = computed(() => {
        if (selectedStatus.value === 'All') {
            return productReviews.value;
        }
        return productReviews.value.filter(productReview => productReview.status === selectedStatus.value);
    });

    async function fetchProductReviews() {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            productReviews.value = await ProductReviewService.getProductReviews();
            fb.value.showSuccess(model);
        } catch (err) {
            console.error(err);
            fb.value.setError(err, model);
        } finally {
            fb.value.finishLoading(model);
        }
    };

    const setStatus = (status) => {
        selectedStatus.value = status;
    }

    const fetchProductReviewById = async (productReviewId) => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            const productReview = await ProductReviewService.getProductReviewById(productReviewId);
            return productReview;
        } catch (err) {
            fb.value.setError(err, model);
        } finally {
            fb.value.finishLoading(model);
        }
    }

    const createProductReview = async (newProductReview) => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        
        try {
            const createdProductReview = await ProductReviewService.createProductReview(newProductReview);
            productReviews.value.push(createdProductReview);
            fb.value.showSuccess(model);
        } catch (err) {
            fb.value.setError(err, model);
        } finally {
            fb.value.finishLoading(model);
        }
    };

    const updateProductReview = async (ProductReviewId, updatedProductReview) => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            const productReview = await ProductReviewService.updateProductReview(ProductReviewId, updatedProductReview);
            const index = productReviews.value.findIndex(t => t.ProductReview_id === ProductReviewId);
            if (index !== -1) {
                productReviews.value[index] = productReview;
            }
            fb.value.showSuccess('ProductReview updated successfully');
        } catch (err) {
            fb.value.setError(err);
        } finally {
            fb.value.finishLoading();
        }
    };

    const deleteProductReview = async (ProductReviewId) => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            await ProductReviewService.deleteProductReview(ProductReviewId);
            productReviews.value = productReviews.value.filter(t => t.ProductReview_id !== ProductReviewId);
            fb.value.showSuccess(model);
        } catch (err) {
            fb.value.setError(err, model);
        } finally {
            fb.value.finishLoading(model);
        }
    };
    
    function setFilter(newFilter) {
        filter.value = newFilter;
    }

    return {
        productReviews,
        selectedStatus,
        setStatus,
        filter,
        fb,
        filteredProductReviews,
        fetchProductReviews,
        fetchProductReviewById,
        setFilter,
        createProductReview,
        updateProductReview,
        deleteProductReview
    };
}); 