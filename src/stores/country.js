import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import CountryService from '../service/CountryService';
import { CountryFilter } from '../filters/CountryFilter';
import Country from '../models/Country';
import FeedbackHandler from '../utils/FeedbackHandler';

export const useCountryStore = defineStore('country', () => {
    /**
     * @type {import('vue').Ref<Country[]>}
     */
    const countries = ref([]);
    const filter = ref(new CountryFilter());
    
    /**
     * @type {import('vue').Ref<FeedbackHandler>}
     */
    const fb = ref(new FeedbackHandler());
    const model = 'country';
    const newCountry = ref(new Country());

    const resetNewCountry = () => {
        newCountry.value = new Country();
    };

    const fetchCountries = async () => {
        fb.value.clearError(model + '.list');
        fb.value.removeSuccess(model + '.list');
        fb.value.startLoading(model + '.list');
        try {
            const response = await CountryService.getCountries();
            countries.value = response.map(country => new Country(country));
            fb.value.showSuccess(model + '.list');
        } catch (err) {
            console.error(err);
            fb.value.setError(err, model + '.list');
        } finally {
            fb.value.finishLoading(model + '.list');
        }
    };

    const fetchCountryById = async (countryId) => {
        fb.value.clearError(model + '.edit.' + countryId);
        fb.value.removeSuccess(model + '.edit.' + countryId);
        fb.value.startLoading(model + '.edit.' + countryId);
        try {
            const country = await CountryService.getCountryById(countryId);
            newCountry.value = new Country(country);
            fb.value.showSuccess(model + '.edit.' + countryId);
            return newCountry.value;
        } catch (err) {
            fb.value.setError(err, model + '.edit.' + countryId);
        } finally {
            fb.value.finishLoading(model + '.edit.' + countryId);
        }
    };

    const createCountry = async (newCountry) => {
        fb.value.clearError(model + '.create');
        fb.value.removeSuccess(model + '.create');
        fb.value.startLoading(model + '.create');
        try {
            const createdCountry = await CountryService.createCountry(newCountry);
            newCountry.value = new Country(createdCountry);
            fb.value.showSuccess(model + '.create');
            return newCountry.value;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.create');
        } finally {
            fb.value.finishLoading(model + '.create');
        }
    };

    const updateCountry = async (countryId, updatedCountry) => {
        fb.value.clearError(model + '.update.' + countryId);
        fb.value.removeSuccess(model + '.update.' + countryId);
        fb.value.startLoading(model + '.update.' + countryId);
        try {
            const country = await CountryService.updateCountry(countryId, updatedCountry);
            const index = countries.value.findIndex(c => c.country_id === countryId);
            if (index !== -1) {
                countries.value[index] = country;
            }
            fb.value.showSuccess(model + '.update.' + countryId);
            return country;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.update.' + countryId);
        } finally {
            fb.value.finishLoading(model + '.update.' + countryId);
        }
    };

    const deleteCountry = async (countryId) => {
        fb.value.clearError(model + '.delete.' + countryId);
        fb.value.removeSuccess(model + '.delete.' + countryId);
        fb.value.startLoading(model + '.delete.' + countryId);
        try {
            await CountryService.deleteCountry(countryId);
            countries.value = countries.value.filter(c => c.country_id !== countryId);
            fb.value.showSuccess(model + '.delete.' + countryId);
        } catch (err) {
            fb.value.setError(err, model + '.delete.' + countryId);
        } finally {
            fb.value.finishLoading(model + '.delete.' + countryId);
        }
    };

    return { 
        countries, 
        filter,
        fb,
        newCountry,
        resetNewCountry,
        fetchCountries, 
        fetchCountryById, 
        createCountry, 
        updateCountry, 
        deleteCountry 
    };
}); 