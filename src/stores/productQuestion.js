import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import ProductQuestion from '../models/ProductQuestion';
import ProductQuestionService from '../service/ProductQuestionService';
import FeedbackHandler from '../utils/FeedbackHandler';
import ProductQuestionFilter from '../filters/ProductQuestionFilter';

export const useProductQuestionStore = defineStore('productQuestion', () => {
    /**
     * @type {Ref<ProductQuestion[]>}
     */
    const productQuestions = ref([]);
    const filter = ref(new ProductQuestionFilter());

    const selectedStatus = ref('All');

    /**
     * @type {import('vue').Ref<FeedbackHandler>}
     */
    const fb = ref(new FeedbackHandler());
    const model = 'productQuestion';

    const filteredProductQuestions = computed(() => {
        if (selectedStatus.value === 'All') {
            return productQuestions.value;
        }
        return productQuestions.value.filter(productQuestion => productQuestion.status === selectedStatus.value);
    });

    async function fetchProductQuestions() {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            productQuestions.value = await ProductQuestionService.getProductQuestions();
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

    const fetchProductQuestionById = async (productQuestionId) => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            const productQuestion = await ProductQuestionService.getProductQuestionById(productQuestionId);
            return productQuestion;
        } catch (err) {
            fb.value.setError(err, model);
        } finally {
            fb.value.finishLoading(model);
        }
    }

    const createProductQuestion = async (newProductQuestion) => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        
        try {
            const createdProductQuestion = await ProductQuestionService.createProductQuestion(newProductQuestion);
            productQuestions.value.push(createdProductQuestion);
            fb.value.showSuccess(model);
        } catch (err) {
            fb.value.setError(err, model);
        } finally {
            fb.value.finishLoading(model);
        }
    };

    const updateProductQuestion = async (ProductQuestionId, updatedProductQuestion) => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            const productQuestion = await ProductQuestionService.updateProductQuestion(ProductQuestionId, updatedProductQuestion);
            const index = productQuestions.value.findIndex(t => t.ProductQuestion_id === ProductQuestionId);
            if (index !== -1) {
                productQuestions.value[index] = productQuestion;
            }
            fb.value.showSuccess('ProductQuestion updated successfully');
        } catch (err) {
            fb.value.setError(err);
        } finally {
            fb.value.finishLoading();
        }
    };

    const deleteProductQuestion = async (ProductQuestionId) => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            await ProductQuestionService.deleteProductQuestion(ProductQuestionId);
            productQuestions.value = productQuestions.value.filter(t => t.ProductQuestion_id !== ProductQuestionId);
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
        productQuestions,
        selectedStatus,
        setStatus,
        filter,
        fb,
        filteredProductQuestions,
        fetchProductQuestions,
        fetchProductQuestionById,
        setFilter,
        createProductQuestion,
        updateProductQuestion,
        deleteProductQuestion
    };
}); 