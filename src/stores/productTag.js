import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import ProductTagService from '../service/ProductTagService';
import ProductTagFilter from '../filters/ProductTagFilter';
import FeedbackHandler from '../utils/FeedbackHandler';
import ProductTag from '@/models/ProductTag';

export const useProductTagStore = defineStore('productTag', () => {
    /**
     * @type {import('vue').Ref<ProductTag[]>}
     */
    const productTags = ref([]);
    const newTag = ref(new ProductTag());
    const filter = ref(new ProductTagFilter());
    /**
     * @type {import('vue').Ref<FeedbackHandler>}
     */
    const fb = ref(new FeedbackHandler());
    const model = 'productTag';

    // reset product tag
    const resetProductTag = () => {
        newTag.value = new ProductTag();
    };

    const filteredProductTags = computed(() => {
        let filtered = [...productTags.value];

        if (filter.value.global.value) {
            const searchTerm = filter.value.global.value.toLowerCase();
            filtered = filtered.filter(tag => 
                tag.name.toLowerCase().includes(searchTerm) ||
                tag.slug.toLowerCase().includes(searchTerm) ||
                tag.description.toLowerCase().includes(searchTerm)
            );
        }

        if (filter.value.name.value) {
            filtered = filtered.filter(tag => 
                tag.name.toLowerCase().includes(filter.value.name.value.toLowerCase())
            );
        }

        if (filter.value.slug.value) {
            filtered = filtered.filter(tag => 
                tag.slug.toLowerCase().includes(filter.value.slug.value.toLowerCase())
            );
        }

        if (filter.value.description.value) {
            filtered = filtered.filter(tag => 
                tag.description.toLowerCase().includes(filter.value.description.value.toLowerCase())
            );
        }

        return filtered;
    });

    const fetchProductTags = async () => {
        fb.value.clearError(model + '.list');
        fb.value.removeSuccess(model + '.list');
        fb.value.startLoading(model + '.list');
        try {
            const response = await ProductTagService.getProductTags();
            productTags.value = response.map(tag => new ProductTag(tag));
            fb.value.showSuccess(model + '.list');
        } catch (err) {
            console.error(err);
            fb.value.setError(err, model + '.list');
        } finally {
            fb.value.finishLoading(model + '.list');
        }
    };

    const fetchProductTagById = async (tagId) => {
        fb.value.clearError(model + '.edit.' + tagId);
        fb.value.removeSuccess(model + '.edit.' + tagId);
        fb.value.startLoading(model + '.edit.' + tagId);
        try {
            const tag = await ProductTagService.getProductTagById(tagId);
            newTag.value = new ProductTag(tag);
            newTag.value.image = tag.image;
            fb.value.showSuccess(model + '.edit.' + tagId);
            return newTag.value;
        } catch (err) {
            fb.value.setError(err, model + '.edit.' + tagId);
        } finally {
            fb.value.finishLoading(model + '.edit.' + tagId);
        }
    };

    const createProductTag = async (newTag) => {
        fb.value.clearError(model + '.create');
        fb.value.removeSuccess(model + '.create');
        fb.value.startLoading(model + '.create');
        try {
            const createdTag = await ProductTagService.createProductTag(newTag);
            newTag.value = new ProductTag(createdTag);
            fb.value.showSuccess(model + '.create');
            return newTag.value;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.create');
        } finally {
            fb.value.finishLoading(model + '.create');
        }
    };

    const updateProductTag = async (tagId, updatedTag) => {
        fb.value.clearError(model + '.update.' + tagId);
        fb.value.removeSuccess(model + '.update.' + tagId);
        fb.value.startLoading(model + '.update.' + tagId);
        try {
            const tag = await ProductTagService.updateProductTag(tagId, updatedTag);
            const index = productTags.value.findIndex(t => t.tag_id === tagId);
            if (index !== -1) {
                productTags.value[index] = tag;
            }
            fb.value.showSuccess(model + '.update.' + tagId);
            return tag;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.update.' + tagId);
        } finally {
            fb.value.finishLoading(model + '.update.' + tagId);
        }
    };

    const deleteProductTag = async (tagId) => {
        fb.value.clearError(model + '.delete.' + tagId);
        fb.value.removeSuccess(model + '.delete.' + tagId);
        fb.value.startLoading(model + '.delete.' + tagId);
        try {
            await ProductTagService.deleteProductTag(tagId);
            productTags.value = productTags.value.filter(t => t.tag_id !== tagId);
            fb.value.showSuccess(model + '.delete.' + tagId);
        } catch (err) {
            fb.value.setError(err, model + '.delete.' + tagId);
        } finally {
            fb.value.finishLoading(model + '.delete.' + tagId);
        }
    };

    function setFilter(newFilter) {
        filter.value = newFilter;
    }

    function clearFilter() {
        filter.value = new ProductTagFilter();
    }

    return {
        productTags,
        newTag,
        filter,
        fb,
        filteredProductTags,
        resetProductTag,
        fetchProductTags,
        fetchProductTagById,
        createProductTag,
        updateProductTag,
        deleteProductTag,
        setFilter,
        clearFilter
    };
}); 