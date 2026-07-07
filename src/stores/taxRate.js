import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import TaxRateService from '../service/TaxRateService';
import { TaxRateFilter } from '../filters/TaxRateFilter';
import TaxRate from '../models/TaxRate';
import FeedbackHandler from '../utils/FeedbackHandler';
import TaxRateImportResponse from '@/models/TaxRateImport';

export const useTaxRateStore = defineStore('taxRate', () => {
    /**
     * @type {import('vue').Ref<TaxRate[]>}
     */
    const taxRates = ref([]);
    const newTaxRate = ref(new TaxRate());
    const importExport = ref(new TaxRateImportResponse());
    const filter = ref(new TaxRateFilter());
    
    /**
     * @type {import('vue').Ref<FeedbackHandler>}
     */
    const fb = ref(new FeedbackHandler());
    const model = 'taxRate';

    const resetTaxRate = () => {
        newTaxRate.value = new TaxRate();
    };
    const fetchTaxRates = async () => {
        fb.value.clearError(model + '.list');
        fb.value.removeSuccess(model + '.list');
        fb.value.startLoading(model + '.list');
        try {
            const response = await TaxRateService.getTaxRates();
            taxRates.value = response.map(taxRate => new TaxRate(taxRate));
            fb.value.showSuccess(model + '.list');
        } catch (err) {
            console.error(err);
            fb.value.setError(err, model + '.list');
        } finally {
            fb.value.finishLoading(model + '.list');
        }
    };

    const fetchTaxRateById = async (taxRateId) => {
        fb.value.clearError(model + '.edit.' + taxRateId);
        fb.value.removeSuccess(model + '.edit.' + taxRateId);
        fb.value.startLoading(model + '.edit.' + taxRateId);
        try {
            const taxRate = await TaxRateService.getTaxRateById(taxRateId);
            fb.value.showSuccess(model + '.edit.' + taxRateId);
            return taxRate;
        } catch (err) {
            fb.value.setError(err, model + '.edit.' + taxRateId);
        } finally {
            fb.value.finishLoading(model + '.edit.' + taxRateId);
        }
    };

    const createTaxRate = async (newTaxRate) => {
        fb.value.clearError(model + '.create');
        fb.value.removeSuccess(model + '.create');
        fb.value.startLoading(model + '.create');
        try {
            const createdTaxRate = await TaxRateService.createTaxRate(newTaxRate);
            taxRates.value.push(createdTaxRate);
            fb.value.showSuccess(model + '.create');
            return createdTaxRate;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.create');
        } finally {
            fb.value.finishLoading(model + '.create');
        }
    };

    const updateTaxRate = async (taxRateId, updatedTaxRate) => {
        fb.value.clearError(model + '.update.' + taxRateId);
        fb.value.removeSuccess(model + '.update.' + taxRateId);
        fb.value.startLoading(model + '.update.' + taxRateId);
        try {
            const taxRate = await TaxRateService.updateTaxRate(taxRateId, updatedTaxRate);
            const index = taxRates.value.findIndex(t => t.tax_rate_id === taxRateId);
            if (index !== -1) {
                taxRates.value[index] = taxRate;
            }
            fb.value.showSuccess(model + '.update.' + taxRateId);
            return taxRate;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.update.' + taxRateId);
        } finally {
            fb.value.finishLoading(model + '.update.' + taxRateId);
        }
    };

    const deleteTaxRate = async (taxRateId) => {
        fb.value.clearError(model + '.delete.' + taxRateId);
        fb.value.removeSuccess(model + '.delete.' + taxRateId);
        fb.value.startLoading(model + '.delete.' + taxRateId);
        try {
            await TaxRateService.deleteTaxRate(taxRateId);
            taxRates.value = taxRates.value.filter(t => t.tax_rate_id !== taxRateId);
            fb.value.showSuccess(model + '.delete.' + taxRateId);
        } catch (err) {
            fb.value.setError(err, model + '.delete.' + taxRateId);
        } finally {
            fb.value.finishLoading(model + '.delete.' + taxRateId);
        }
    };
    const taxRateImport = async (formData) => {
        fb.value.clearError(model + '.import');
        fb.value.removeSuccess(model + '.import');
        fb.value.startLoading(model + '.import');
        try {
            if (!formData) {
                throw new Error('No file data provided to import tax rates');
            }
            const response = await TaxRateService.taxRateImport(formData);
            console.log('Store received response:', response);
            importExport.value = new TaxRateImportResponse(response);
            fb.value.showSuccess(model + '.import');
            return response;
        } catch (err) {
            console.error('Import error:', err);
            fb.value.setError(err, model + '.import');
            throw err;
        } finally {
            fb.value.finishLoading(model + '.import');
        }
    };

    const clearImportExport = () => {
        importExport.value = new TaxRateImportResponse();
    };

    return { 
        taxRates, 
        newTaxRate,
        filter,
        fb,
        fetchTaxRates, 
        fetchTaxRateById, 
        createTaxRate, 
        updateTaxRate, 
        deleteTaxRate,
        importExport,
        clearImportExport,
        taxRateImport,
        resetTaxRate
    };
}); 