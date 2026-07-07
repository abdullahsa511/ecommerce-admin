import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import PinboardItemService from '../service/PinboardItemService';
import { Pinboard, PinboardItem } from '../models/Pinboard';
import FeedbackHandler from '../utils/FeedbackHandler';

export const usePinboardItemStore = defineStore('pinboardItem', () => {
    /**
     * @type {import('vue').Ref<PinboardItem[]>}
     */
    const pinboardItems = ref([]);
     /**
     * @type {import('vue').Ref<FeedbackHandler>}
     */
     const fb = ref(new FeedbackHandler());
     const model = 'pinboardItem';

     const fetchPinboardItems = async () => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            const response = await PinboardItemService.getPinboardItems();
            pinboardItems.value = response.map(pinboardItem => new PinboardItem(pinboardItem));
            fb.value.showSuccess(model);
        } catch (err) {
            fb.value.setError(err, model);
        } finally {
            fb.value.finishLoading(model);
        }
    };

    const pinboardItemNames = computed(() => {
        return pinboardItems.value.map(pinboardItem => pinboardItem.item_name);
    });

    const fetchPinboardItemById = async (pinboardItemId) => {
        fb.value.clearError(model+'.show');
        fb.value.removeSuccess(model+'.show');
        fb.value.startLoading(model+'.show');
        try {
            const pinboardItem = await PinboardItemService.getPinboardItemById(pinboardItemId);
            fb.value.showSuccess(model+'.show');
            return new PinboardItem(pinboardItem);
        } catch (err) {
            fb.value.setError(err, model+'.show');
        } finally {
            fb.value.finishLoading(model+'.show');
        }
    };

    const createPinboardItem = async (newPinboardItems) => {
        fb.value.clearError(model+'.create');
        fb.value.removeSuccess(model+'.create');
        fb.value.startLoading(model+'.create');
        try {
            const createdPinboardItems = await PinboardItemService.createPinboardItem(newPinboardItems);
            // If the response is an array, map to PinboardItem, else single
            let result = Array.isArray(createdPinboardItems)
                ? createdPinboardItems.map(pi => new PinboardItem(pi))
                : [new PinboardItem(createdPinboardItems)];
            pinboardItems.value.push(...result);
            fb.value.showSuccess(model+'.create');
            return result;
        } catch (err) {
            fb.value.setError(err, model+'.create');
        } finally {
            fb.value.finishLoading(model+'.create');
        }
    };

    const updatePinboardItem = async (updatedPinboardItem) => {
        fb.value.clearError(model+'.update');
        fb.value.removeSuccess(model+'.update');
        fb.value.startLoading(model+'.update');
        try {
            const pinboardItem = await PinboardItemService.updatePinboardItem(updatedPinboardItem);
            fb.value.showSuccess(model+'.update');
            return new PinboardItem(pinboardItem);
        } catch (err) {
            fb.value.setError(err, model+'.update');
        } finally {
            fb.value.finishLoading(model+'.update');
        }
    };

    const deletePinboardItem = async (pinboardItemId) => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            await PinboardItemService.deletePinboardItem(pinboardItemId);
            pinboardItems.value = pinboardItems.value.filter(p => p.pinboard_item_id !== pinboardItemId);
            fb.value.showSuccess(model);
        } catch (err) {
            fb.value.setError(err, model);
        } finally {
            fb.value.finishLoading(model);
        }
    };

    const deletePinboardItemsByPinboardId = async (pinboardId) => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            await PinboardItemService.deletePinboardItemsByPinboardId(pinboardId);
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
            const response = await PinboardItemService.getProductList(query);
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
        pinboardItems, 
        fb, 
        model, 
        pinboardItemNames, 
        fetchPinboardItems, 
        fetchPinboardItemById, 
        createPinboardItem, 
        updatePinboardItem, 
        deletePinboardItem, 
        deletePinboardItemsByPinboardId,
        getProductList
    };
}); 