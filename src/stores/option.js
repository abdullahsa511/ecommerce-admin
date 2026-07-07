import { ref } from 'vue';
import { defineStore } from 'pinia';
import ImportExport from '../models/ImportExport';
import FeedbackHandler from '../utils/FeedbackHandler';
import Option from '@/models/Option';
import OptionService from '@/service/OptionService';
import ProductOption from '@/models/ProductOption';
import ProductOptionService from '@/service/ProductOptionService';

export const useOptionStore = defineStore('option', () => {
    const options = ref([]);
    const option = ref(new Option());
    const types = ref([]);
    const importExport = ref([]);
    const fb = ref(new FeedbackHandler());
    const model = 'option';
    const productOptions = ref([]);

    const fetchOptions = async () => {
        fb.value.startLoading(model + ".list");
        try {
            const response = await OptionService.getOptions();
            options.value = response.map(opt => new Option(opt));
            option.value.sort_order =  (options.value[options.value.length - 1].sort_order || 0) + 1;
        } catch (err) {
            fb.value.setError(model + '.list');
        } finally {
            fb.value.finishLoading(model + '.list');
        }
    };

    const fetchProductOptions = async () => {
        fb.value.startLoading(model + ".list");
        try {
            const response = await ProductOptionService.getProductOptions();
            productOptions.value = response.map(opt => new ProductOption(opt));
        } catch (err) {
            fb.value.setError(model + '.list');
        } finally {
            fb.value.finishLoading(model + '.list');
        }
    };

    const fetchOptionTypes = async () => {
        loading.value = true;
        error.value = null;
        try {
            const data = await OptionService.fetchOptionTypes();
            types.value = data; // update the store ref
            return data; // return for component usage
        } catch (err) {
            console.error('Failed to fetch option types:', err);
            return [];
        } finally {
            loading.value = false;
        }
    };

    const createOption = async (newOptions) => {
        fb.value.clearError(model + '.create');
        fb.value.removeSuccess(model + '.create');
        fb.value.startLoading(model + '.create');
        try {
            const option = await OptionService.createOption(newOptions);
            const optionObj = new Option(option);
            optionObj.value = optionObj;
            fb.value.showSuccess(model + '.create');
            return optionObj.value;
        } catch (err) {
            fb.value.setError(err, model + '.create');
            throw err;
        } finally {
            fb.value.finishLoading(model + '.create');
        }
    };

    const getOptionById = async (id) => {
        fb.value.clearError(model+ '.show.'+id);
        fb.value.removeSuccess(model+ '.show.'+id);
        fb.value.startLoading(model+ '.show.'+id);
        try {
            const response = await OptionService.getOptionById(id);
            option.value = new Option(response);
            fb.value.showSuccess(model+ '.show.'+id);
            return response;
        } catch (err) {
            fb.value.setError(err, model+ '.show.'+id);
            throw err;
        } finally {
            fb.value.finishLoading(model+ '.show.'+id);
        }
    };

    const updateOption = async (option) => {
        fb.value.clearError(model+ '.update.' + option.option_id);
        fb.value.removeSuccess(model + '.update.' + option.option_id);
        fb.value.startLoading(model + '.update.' + option.option_id);
        try {
            const response = await OptionService.updateOption(option);
            fb.value.showSuccess(model + '.update.' + option.option_id);
            return response;
        } catch (err) {
            fb.value.setError(err, model + '.update.' + option.option_id);
            throw err;
        } finally {
            fb.value.finishLoading(model + '.update.' + option.option_id);
        }
    };


    const optionsImport = async (newImport) => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            if (!newImport) {
                throw new Error('No file data provided');
            }
            const response = await OptionService.optionsImport(newImport);
            importExport.value.push(response);
            fb.value.showSuccess(model);
            return response;
        } catch (err) {
            fb.value.setError(err, model);
            throw err;
        } finally {
            fb.value.finishLoading(model);
        }
    };

    const productOptionsImport = async (newImport) => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            if (!newImport) {
                throw new Error('No file data provided');
            }
            const response = await OptionService.productOptionsImport(newImport);
            importExport.value.push(response);
            fb.value.showSuccess(model);
            return response;
        } catch (err) {
            fb.value.setError(err, model);
            throw err;
        } finally {
            fb.value.finishLoading(model);
        }
    };

    const deleteOption = async (id) => {
        fb.value.clearError(model + '.delete.'+id);
        fb.value.removeSuccess(model + '.delete.'+id);
        fb.value.startLoading(model + '.delete.'+id);
        try {
            await OptionService.deleteOption(id);
            options.value = options.value.filter(p => p.option_id !== id);
            fb.value.showSuccess(model + '.delete.'+id);
        } catch (err) {
            fb.value.setError(err, model + '.delete.'+id);
        } finally {
            fb.value.finishLoading(model + '.delete.'+id);
        }
    };

    return {
        options,
        option,
        productOptions,
        fb,
        types,
        model,
        importExport,
        fetchOptions,
        fetchProductOptions,
        fetchOptionTypes,
        getOptionById,
        createOption,
        updateOption,
        deleteOption,
        optionsImport,
        productOptionsImport,
    };
});