import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import CurrencyService from '../service/CurrencyService';
import { CurrencyFilter } from '../filters/CurrencyFilter';
import Currency from '../models/Currency';
import FeedbackHandler from '../utils/FeedbackHandler';

export const useCurrencyStore = defineStore('currency', () => {
    /**
     * @type {import('vue').Ref<Currency[]>}
     */
    const currencies = ref([]);
    const filter = ref(new CurrencyFilter());
    const newCurrency = ref(new Currency());
    
    /**
     * @type {import('vue').Ref<FeedbackHandler>}
     */
    const fb = ref(new FeedbackHandler());
    const model = 'currency';

    const resetCurrency = () => {
        newCurrency.value = new Currency();
    };

    const fetchCurrencies = async () => {
        fb.value.clearError(model + '.list');
        fb.value.removeSuccess(model + '.list');
        fb.value.startLoading(model + '.list');
        try {
            const response = await CurrencyService.getCurrencies();
            currencies.value = response.map(currency => new Currency(currency));
            fb.value.showSuccess(model + '.list');
        } catch (err) {
            console.error(err);
            fb.value.setError(err, model + '.list');
        } finally {
            fb.value.finishLoading(model + '.list');
        }
    };

    const fetchCurrencyById = async (currencyId) => {
        fb.value.clearError(model + '.edit.' + currencyId);
        fb.value.removeSuccess(model + '.edit.' + currencyId);
        fb.value.startLoading(model + '.edit.' + currencyId);
        try {
            const currency = await CurrencyService.getCurrencyById(currencyId);
            newCurrency.value = new Currency(currency);
            fb.value.showSuccess(model + '.edit.' + currencyId);
            return newCurrency.value;
        } catch (err) {
            fb.value.setError(err, model + '.edit.' + currencyId);
        } finally {
            fb.value.finishLoading(model + '.edit.' + currencyId);
        }
    };

    const createCurrency = async (newCurrency) => {
        fb.value.clearError(model + '.create');
        fb.value.removeSuccess(model + '.create');
        fb.value.startLoading(model + '.create');
        try {
            const createdCurrency = await CurrencyService.createCurrency(newCurrency);
            newCurrency.value = new Currency(createdCurrency);
            currencies.value.push(newCurrency.value);
            fb.value.showSuccess(model + '.create');
            return newCurrency.value;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.create');
        } finally {
            fb.value.finishLoading(model + '.create');
        }
    };

    const updateCurrency = async (currencyId, updatedCurrency) => {
        fb.value.clearError(model + '.update.' + currencyId);
        fb.value.removeSuccess(model + '.update.' + currencyId);
        fb.value.startLoading(model + '.update.' + currencyId);
        try {
            const currency = await CurrencyService.updateCurrency(currencyId, updatedCurrency);
            const index = currencies.value.findIndex(c => c.currency_id === currencyId);
            if (index !== -1) {
                currencies.value[index] = currency;
            }
            fb.value.showSuccess(model + '.update.' + currencyId);
            return currency;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.update.' + currencyId);
        } finally {
            fb.value.finishLoading(model + '.update.' + currencyId);
        }
    };

    const deleteCurrency = async (currencyId) => {
        fb.value.clearError(model + '.delete.' + currencyId);
        fb.value.removeSuccess(model + '.delete.' + currencyId);
        fb.value.startLoading(model + '.delete.' + currencyId);
        try {
            await CurrencyService.deleteCurrency(currencyId);
            currencies.value = currencies.value.filter(c => c.currency_id !== currencyId);
            fb.value.showSuccess(model + '.delete.' + currencyId);
        } catch (err) {
            fb.value.setError(err, model + '.delete.' + currencyId);
        } finally {
            fb.value.finishLoading(model + '.delete.' + currencyId);
        }
    };

    return { 
        currencies, 
        filter,
        fb,
        newCurrency,
        resetCurrency,
        fetchCurrencies, 
        fetchCurrencyById, 
        createCurrency, 
        updateCurrency, 
        deleteCurrency 
    };
}); 