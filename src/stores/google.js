import { ref } from 'vue';
import { defineStore } from 'pinia';
import FeedbackHandler from '../utils/FeedbackHandler';
import GoogleService from '../service/GoogleService';
import { Address } from '../models/Google';

export const useGoogleStore = defineStore('google', () => {
    /**
     * @type {import('vue').Ref<Product[]>}
     */
    const projects = ref([]);
    /**
     * @type {import('vue').Ref<FeedbackHandler>}
     */
    const fb = ref(new FeedbackHandler());
    const model = 'google';

    const searchAddresses = async (query) => {
        fb.value.clearError(model+"-address-autocomplete");
        fb.value.removeSuccess(model+"-address-autocomplete");
        fb.value.startLoading(model+"-address-autocomplete");
        try {
            const response = await GoogleService.searchAddresses(query);
            addresses.value = response.map(address => new Address(address));
            fb.value.showSuccess(model+"-address-autocomplete");
        } catch (err) {
            fb.value.setError(err, model+"-address-autocomplete");
        } finally {
            fb.value.finishLoading(model+"-address-autocomplete");
        }
    };


    return { 
        fb, 
        searchAddresses
    };
}); 