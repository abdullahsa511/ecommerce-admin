import { defineStore } from 'pinia';
import { ref } from 'vue';
import ListService from '../service/ListService';
import FeedbackHandler from '../utils/FeedbackHandler';

export const useListStore = defineStore('list', () => {

    const types = ref([]);
    const sites = ref([]);
    const vendors = ref([]);
    const manufacturers = ref([]);
    const productTags = ref([]);
    /**
     * @type {import('vue').Ref<FeedbackHandler>}
     */
    const fb = ref(new FeedbackHandler());
    const model = 'list';

    const fetchTypes = async () => {
        fb.value.clearError(model+'Types');
        fb.value.removeSuccess(model+'Types');
        fb.value.startLoading(model+'Types');
        try {
            const response = await ListService.getList('types');
            types.value = response;
            fb.value.showSuccess(model+'Types');
        } catch (err) {
            console.error(err);
            fb.value.setError(err, model+'Types');
        } finally {
            fb.value.finishLoading(model+'Types');
        }
    };

    const fetchSites = async () => {
        fb.value.clearError(model+'Sites');
        fb.value.removeSuccess(model+'Sites');
        fb.value.startLoading(model+'Sites');
        try {
            const response = await ListService.getList('sites');
            sites.value = response;
            fb.value.showSuccess(model+'Sites');
        } catch (err) {
            console.error(err);
            fb.value.setError(err, model+'Sites');
        } finally {
            fb.value.finishLoading(model+'Sites');
        }
    };
    const fetchVendors = async () => {
        fb.value.clearError(model+'Vendors');
        fb.value.removeSuccess(model+'Vendors');
        fb.value.startLoading(model+'Vendors');
        try {
            const response = await ListService.getList('vendors');
            vendors.value = response;
            fb.value.showSuccess(model+'Vendors');
        } catch (err) {
            console.error(err);
            fb.value.setError(err, model+'Vendors');
        } finally {
            fb.value.finishLoading(model+'Vendors');
        }
    };
    const fetchManufacturers = async () => {
        fb.value.clearError(model+'Manufacturers');
        fb.value.removeSuccess(model+'Manufacturers');
        fb.value.startLoading(model+'Manufacturers');
        try {
            const response = await ListService.getList('manufacturers');
            manufacturers.value = response;
            fb.value.showSuccess(model+'Manufacturers');
        } catch (err) {
            console.error(err);
            fb.value.setError(err, model+'Manufacturers');
        } finally {
            fb.value.finishLoading(model+'Manufacturers');
        }
    };
    const fetchProductTags = async () => {
        fb.value.clearError(model+'ProductTags');
        fb.value.removeSuccess(model+'ProductTags');
        fb.value.startLoading(model+'ProductTags');
        try {
            const response = await ListService.getList('product-tags');
            productTags.value = response;
            fb.value.showSuccess(model+'ProductTags');
        } catch (err) {
            console.error(err);
            fb.value.setError(err, model+'ProductTags');
        } finally {
            fb.value.finishLoading(model+'ProductTags');
        }
    };


    return { 
        types, 
        fb,
        fetchTypes,
        sites,
        fetchSites,
        vendors,
        fetchVendors,
        manufacturers,
        fetchManufacturers,
        productTags,
        fetchProductTags
    };
}); 