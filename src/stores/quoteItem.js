import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
// import QuoteItemService from '../service/QuoteItemService';
// import { Quote, QuoteItem } from '../models/Quote';
import FeedbackHandler from '../utils/FeedbackHandler';
import { QuoteItem } from '@/models/Quote';
import QuoteItemService from '@/service/QuoteItemService';

export const useQuoteItemStore = defineStore('quoteItem', () => {
    /**
     * @type {import('vue').Ref<Quote[]>}
     */
    const quoteItems = ref([]);
    const quoteItem = ref(new QuoteItem());
     /**
     * @type {import('vue').Ref<FeedbackHandler>}
     */
     const fb = ref(new FeedbackHandler());
     const model = 'quoteItem';

     const fetchQuoteItems = async () => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            const response = await QuoteItemService.getQuoteItems();
            console.log('this is quoteitems store page data', response);
            quoteItems.value = response.map(qItem => new QuoteItem(qItem));
            fb.value.showSuccess(model);
            return quoteItems.value;
        } catch (err) {
            fb.value.setError(err, model);
        } finally {
            fb.value.finishLoading(model);
        }
    };

    const quoteNames = computed(() => {
        return quoteItems.value.map(quoteItem => quoteItem.name);
    });

    const fetchQuoteItemById = async (quoteItemId) => {
        fb.value.clearError(model+'.show');
        fb.value.removeSuccess(model+'.show');
        fb.value.startLoading(model+'.show');
        try {
            const quoteItem = await QuoteItemService.getQuoteItemById(quoteItemId);
            fb.value.showSuccess(model+'.show');
            return new QuoteItem(quoteItem);
        } catch (err) {
            fb.value.setError(err, model+'.show');
        } finally {
            fb.value.finishLoading(model+'.show');
        }
    };

    const createQuoteItem = async (newQuoteItem) => {
        fb.value.clearError(model+'.create');
        fb.value.removeSuccess(model+'.create');
        fb.value.startLoading(model+'.create');
        try {
            const createdQuoteItem = await QuoteItemService.createQuoteItem(newQuoteItem);
            let quoteItem = new QuoteItem(createdQuoteItem);
            quoteItems.value.push(quoteItem);
            fb.value.showSuccess(model+'.create');
            return quoteItem;
        } catch (err) {
            fb.value.setError(err, model+'.create');
        } finally {
            fb.value.finishLoading(model+'.create');
        }
    };

    const updateQuoteItem = async (updatedQuoteItem) => {
        fb.value.clearError(model+'.update');
        fb.value.removeSuccess(model+'.update');
        fb.value.startLoading(model+'.update');
        try {
            const quoteItem = await QuoteItemService.updateQuoteItem(updatedQuoteItem);
            fb.value.showSuccess(model+'.update');
            return new QuoteItem(quoteItem);
        } catch (err) {
            fb.value.setError(err, model+'.update');
        } finally {
            fb.value.finishLoading(model+'.update');
        }
    };

    const deleteQuoteItem = async (quoteItemId) => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            await QuoteItemService.deleteQuoteItem(quoteItemId);
            quoteItems.value = quoteItems.value.filter(q => q.quote_id !== quoteItemId);
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
            const response = await QuoteItemService.getProductList(query);
            fb.value.showSuccess(model+"-product-list");
            return response;
        } catch (err) {
            fb.value.setError(err, model+"-product-list");
            return [];
        } finally {
            fb.value.finishLoading(model+"-product-list");
        }
    };

    const searchQuoteItems = async (query) => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            const response = await QuoteItemService.searchQuoteItems(query);
            fb.value.showSuccess(model);
            return response;
        } catch (err) {
            fb.value.setError(err, model);
            return [];
        } finally {
            fb.value.finishLoading(model);
        }
    };

    return { 
        quoteItems, 
        fb, 
        model, 
        quoteNames, 
        fetchQuoteItems, 
        fetchQuoteItemById, 
        createQuoteItem, 
        updateQuoteItem, 
        deleteQuoteItem, 
        getProductList,
        searchQuoteItems
    };
}); 