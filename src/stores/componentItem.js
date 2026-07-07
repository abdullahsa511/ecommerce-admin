import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import ComponentItemService from '../service/ComponentItemService';
import FeedbackHandler from '../utils/FeedbackHandler';
import { ItemForm, ItemModelForm } from '@/models/Component';

export const useComponentItemStore = defineStore('componentItem', () => {
    /**
     * @type {import('vue').Ref<ComponentItemField[]|ComponentModelFieldItem[]>}
     */
    const componentItems = ref([]);
    
    /**
     * @type {import('vue').Ref<FeedbackHandler>}
     */
    const fb = ref(new FeedbackHandler());
    const model = 'componentItem';

    const fetchComponentItems = async (componentId) => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            const response = await ComponentItemService.getComponentItems(componentId);
            componentItems.value = response.map(item => new ComponentItemField(item));
            fb.value.showSuccess(model);
            return componentItems.value;
        } catch (err) {
            console.error(err);
            fb.value.setError(err, model);
            throw err;
        } finally {
            fb.value.finishLoading(model);
        }
    };

    const addComponentItem = async (componentItem) => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            const response = await ComponentItemService.addComponentItem(componentItem);

            fb.value.showSuccess('Component items added successfully');
            return response;
        } catch (err) {
            console.error(err);
            fb.value.setError(err, model);
            throw err;
        } finally {
            fb.value.finishLoading(model);
        }
    };

    const updateComponentItem = async (itemId, updatedItem) => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            const response = await ComponentItemService.updateComponentItem(itemId, updatedItem);
            const index = componentItems.value.findIndex(item => item.id === itemId);
            if (index !== -1) {
                componentItems.value[index] = new ComponentItem(response);
            }
            fb.value.showSuccess('Component item updated successfully');
            return response;
        } catch (err) {
            console.error(err);
            fb.value.setError(err, model);
            throw err;
        } finally {
            fb.value.finishLoading(model);
        }
    };

    const deleteComponentItem = async (itemId) => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            await ComponentItemService.deleteComponentItem(itemId);
            componentItems.value = componentItems.value.filter(item => item.id !== itemId);
            fb.value.showSuccess('Component item deleted successfully');
        } catch (err) {
            console.error(err);
            fb.value.setError(err, model);
            throw err;
        } finally {
            fb.value.finishLoading(model);
        }
    };

    return {
        componentItems,
        fb,
        fetchComponentItems,
        addComponentItem,
        updateComponentItem,
        deleteComponentItem
    };
}); 