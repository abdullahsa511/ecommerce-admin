import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import ProductFinishService from '../service/ProductFinishService';
import ProductFinishFilter from '../filters/ProductFinishFilter';
import ProductFinish from '../models/ProductFinish';
import FeedbackHandler from '../utils/FeedbackHandler';

export const useProductFinishStore = defineStore('productFinish', () => {
    /**
     * @type {import('vue').Ref<ProductFinish[]>}
     */
    const productFinishes = ref([]);
    const filter = ref(new ProductFinishFilter());
    
    /**
     * @type {import('vue').Ref<FeedbackHandler>}
     */
    const fb = ref(new FeedbackHandler());
    const model = 'productFinish';

    const filteredProductFinishes = computed(() => {
        let filtered = [...productFinishes.value];

        if (filter.value.global.value) {
            const searchTerm = filter.value.global.value.toLowerCase();
            filtered = filtered.filter(finish => 
                finish.name.toLowerCase().includes(searchTerm) ||
                finish.slug.toLowerCase().includes(searchTerm) ||
                finish.description.toLowerCase().includes(searchTerm)
            );
        }

        if (filter.value.name.value) {
            filtered = filtered.filter(finish => 
                finish.name.toLowerCase().includes(filter.value.name.value.toLowerCase())
            );
        }

        if (filter.value.slug.value) {
            filtered = filtered.filter(finish => 
                finish.slug.toLowerCase().includes(filter.value.slug.value.toLowerCase())
            );
        }

        if (filter.value.description.value) {
            filtered = filtered.filter(finish => 
                finish.description.toLowerCase().includes(filter.value.description.value.toLowerCase())
            );
        }

        return filtered;
    });

    const fetchProductFinishes = async () => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            const response = await ProductFinishService.getProductFinishes();
            productFinishes.value = response;
            fb.value.showSuccess(model);
        } catch (err) {
            console.error(err);
            fb.value.setError(err, model);
        } finally {
            fb.value.finishLoading(model);
        }
    };

    const fetchProductFinishById = async (finishId) => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            const finish = await ProductFinishService.getProductFinishById(finishId);
            fb.value.showSuccess(model);
            return finish;
        } catch (err) {
            fb.value.setError(err, model);
        } finally {
            fb.value.finishLoading(model);
        }
    };

    const createProductFinish = async (newFinish) => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            const createdFinish = await ProductFinishService.createProductFinish(newFinish);
            productFinishes.value.push(createdFinish);
            fb.value.showSuccess(model);
        } catch (err) {
            fb.value.setError(err, model);
        } finally {
            fb.value.finishLoading(model);
        }
    };

    const updateProductFinish = async (finishId, updatedFinish) => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            const finish = await ProductFinishService.updateProductFinish(finishId, updatedFinish);
            const index = productFinishes.value.findIndex(f => f.finish_id === finishId);
            if (index !== -1) {
                productFinishes.value[index] = finish;
            }
            fb.value.showSuccess('Product finish updated successfully');
        } catch (err) {
            fb.value.setError(err, model);
        } finally {
            fb.value.finishLoading(model);
        }
    };

    const deleteProductFinish = async (finishId) => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            await ProductFinishService.deleteProductFinish(finishId);
            productFinishes.value = productFinishes.value.filter(f => f.finish_id !== finishId);
            fb.value.showSuccess('Product finish deleted successfully');
        } catch (err) {
            fb.value.setError(err, model);
        } finally {
            fb.value.finishLoading(model);
        }
    };

    function setFilter(newFilter) {
        filter.value = newFilter;
    }

    function clearFilter() {
        filter.value = new ProductFinishFilter();
    }

    return {
        productFinishes,
        filter,
        fb,
        filteredProductFinishes,
        fetchProductFinishes,
        fetchProductFinishById,
        createProductFinish,
        updateProductFinish,
        deleteProductFinish,
        setFilter,
        clearFilter
    };
});
