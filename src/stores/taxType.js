import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import TaxTypeService from '../service/TaxTypeService';
import { TaxTypeFilter } from '../filters/TaxTypeFilter';
import TaxType from '../models/TaxType';
import FeedbackHandler from '../utils/FeedbackHandler';
import TaxTypeImportResponse from '@/models/TaxTypeImport';

export const useTaxTypeStore = defineStore('taxType', () => {
    /**
     * @type {import('vue').Ref<TaxType[]>}
     */
    const taxTypes = ref([]);
    const newTaxType = ref(new TaxType());
    const filter = ref(new TaxTypeFilter());
    const importExport = ref(new TaxTypeImportResponse());
    /**
     * @type {import('vue').Ref<FeedbackHandler>}
     */
    const fb = ref(new FeedbackHandler());
    const model = 'taxType';

    const resetTaxTypeAddForm = () => {
        newTaxType.value = new TaxType();
    };

    const fetchTaxTypes = async () => {
        fb.value.clearError(model + '.list');
        fb.value.removeSuccess(model + '.list');
        fb.value.startLoading(model + '.list');
        try {
            const response = await TaxTypeService.getTaxTypes();
            taxTypes.value = response.map(taxType => new TaxType(taxType));
            fb.value.showSuccess(model + '.list');
        } catch (err) {
            console.error(err);
            fb.value.setError(err, model + '.list');
        } finally {
            fb.value.finishLoading(model + '.list');
        }
    };

    const fetchTaxTypeById = async (taxTypeId) => {
        fb.value.clearError(model + '.edit.' + taxTypeId);
        fb.value.removeSuccess(model + '.edit.' + taxTypeId);
        fb.value.startLoading(model + '.edit.' + taxTypeId);
        try {
            const taxType = await TaxTypeService.getTaxTypeById(taxTypeId);
            newTaxType.value = new TaxType(taxType);
            fb.value.showSuccess(model + '.edit.' + taxTypeId);
            return taxType;
        } catch (err) {
            fb.value.setError(err, model + '.edit.' + taxTypeId);
        } finally {
            fb.value.finishLoading(model + '.edit.' + taxTypeId);
        }
    };

    const createTaxType = async (newTaxType) => {
        fb.value.clearError(model + '.create');
        fb.value.removeSuccess(model + '.create');
        fb.value.startLoading(model + '.create');
        try {
            const createdTaxType = await TaxTypeService.createTaxType(newTaxType);
            taxTypes.value.push(createdTaxType);
            return createdTaxType;
            fb.value.showSuccess(model + '.create');  
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.create');
        } finally {
            fb.value.finishLoading(model + '.create');
        }
    };

    const updateTaxType = async (taxTypeId, updatedTaxType) => {
        fb.value.clearError(model + '.update.' + taxTypeId);
        fb.value.removeSuccess(model + '.update.' + taxTypeId);
        fb.value.startLoading(model + '.update.' + taxTypeId);
        try {
            const taxType = await TaxTypeService.updateTaxType(taxTypeId, updatedTaxType);
            const index = taxTypes.value.findIndex(t => t.tax_type_id === taxTypeId);
            if (index !== -1) {
                taxTypes.value[index] = taxType;
            }
            fb.value.showSuccess(model + '.update.' + taxTypeId);
            return taxType;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.update.' + taxTypeId);
        } finally {
            fb.value.finishLoading(model + '.update.' + taxTypeId);
        }
    };

    const deleteTaxType = async (taxTypeId) => {
        fb.value.clearError(model + '.delete.' + taxTypeId);
        fb.value.removeSuccess(model + '.delete.' + taxTypeId);
        fb.value.startLoading(model + '.delete.' + taxTypeId);
        try {
            await TaxTypeService.deleteTaxType(taxTypeId);
            taxTypes.value = taxTypes.value.filter(t => t.tax_type_id !== taxTypeId);
            fb.value.showSuccess(model + '.delete.' + taxTypeId);
        } catch (err) {
            fb.value.setError(err, model + '.delete.' + taxTypeId);
        } finally {
            fb.value.finishLoading(model + '.delete.' + taxTypeId);
        }
    };

    // import tax types csv 
    const importTaxTypes = async (newImport) => {
        fb.value.clearError(model + '.import');
        fb.value.removeSuccess(model + '.import');
        fb.value.startLoading(model + '.import');
        try {
            if (!newImport) {
                throw new Error('No file data provided');
            }
            const response = await TaxTypeService.importTaxTypes(newImport);
            importExport.value = new TaxTypeImportResponse(response);
            fb.value.showSuccess(model + '.import');
            return response;
        }
        catch (err) {
            fb.value.setError(err, model + '.import');
        } finally {
            fb.value.finishLoading(model + '.import');
        }
    };

    return { 
        taxTypes, 
        newTaxType,
        filter,
        fb,
        importExport,
        resetTaxTypeAddForm,
        fetchTaxTypes, 
        fetchTaxTypeById, 
        createTaxType, 
        updateTaxType, 
        deleteTaxType,
        importTaxTypes // import tax types csv 
    };
}); 