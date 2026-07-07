import { ref } from 'vue';
import { defineStore } from 'pinia';
import ImportExport from '../models/ImportExport';
import FeedbackHandler from '../utils/FeedbackHandler';
import Type from '@/models/Type';
import TypeService from '@/service/TypeService';
import TypeImportResponse from '@/models/typeImport';

export const useTypeStore = defineStore('type', () => {
    const types = ref([]);
    const type = ref(new Type());
    /**
     * @type {import('vue').Ref<ImportExport[]>}
     */
    const importExport = ref(new TypeImportResponse());

    /**
     * @type {import('vue').Ref<FeedbackHandler>}
     */
    const fb = ref(new FeedbackHandler());
    const model = 'type';

    const resetTypeAddForm = () => {
        type.value = new Type();
    };

    const getTypes = async () => {
        fb.value.clearError(model + '.list');
        fb.value.removeSuccess(model + '.list');
        fb.value.startLoading(model + '.list');
        try {
            const data = await TypeService.getTypes();
            types.value = data.map(type => new Type(type));
            fb.value.showSuccess(model + '.list');
        } catch (err) {
            console.error('Failed to fetch type:', err);
            fb.value.setError(err, model + '.list');
            throw err; // rethrow so caller can catch
        } finally {
            fb.value.finishLoading(model + '.list');
        }
    };

    const createType = async (newTypes) => {
        fb.value.clearError(model + '.create');
        fb.value.removeSuccess(model + '.create');
        fb.value.startLoading(model + '.create');
        try {
            const type = await TypeService.createType(newTypes);
            const optionObj = new Type(type);
            optionObj.value = optionObj;
            fb.value.showSuccess(model + '.create');
            return optionObj.value;
        } catch (err) {
            // Set error in FeedbackHandler
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.create');
        } finally {
            fb.value.finishLoading(model + '.create');
        }
    };

    const getTypeById = async (id) => {
        fb.value.clearError(model + '.edit.' + id);
        fb.value.removeSuccess(model + '.edit.' + id);
        fb.value.startLoading(model + '.edit.' + id);
        try {
            console.log('Fe store:', id);
            const response = await TypeService.getTypeById(id);
            type.value = new Type(response);
            fb.value.showSuccess(model + '.edit.' + id);
            return response;
        } catch (err) {
            fb.value.setError(err, model + '.edit.' + id);
        } finally {
            fb.value.finishLoading(model + '.edit.' + id);
        }
    };

    const updateType = async (type) => {
        fb.value.clearError(model + '.update.'+type.type_id);
        fb.value.removeSuccess(model + '.update.'+type.type_id);
        fb.value.startLoading(model + '.update.'+type.type_id);
        try {
            const response = await TypeService.updateType(type);
            fb.value.showSuccess(model + '.update.'+type.type_id);
            return response;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.update.'+type.type_id);
        } finally {
            fb.value.finishLoading(model + '.update.'+type.type_id);
        }
    };

    const deleteType = async (id) => {
        fb.value.clearError(model + '.delete.' + id);
        fb.value.removeSuccess(model + '.delete.' + id);
        fb.value.startLoading(model + '.delete.' + id);
        try {
            await TypeService.deleteType(id);
            types.value = types.value.filter(p => p.type_id !== id);
            fb.value.showSuccess(model + '.delete.' + id);
        } catch (err) {
            fb.value.setError(err, model + '.delete.' + id);
        } finally {
            fb.value.finishLoading(model + '.delete.' + id);
        }
    };

    const importTypes = async (newImport) => {
        fb.value.clearError(model + '.import');
        fb.value.removeSuccess(model + '.import');
        fb.value.startLoading(model + '.import');
        try {
            if (!newImport) {
                throw new Error('No file data provided');
            }
            const response = await TypeService.importTypes(newImport);
            console.log('Store received response:', response);
            importExport.value = new TypeImportResponse(response);
            fb.value.showSuccess(model + '.import');
            return importExport.value;
        } catch (err) {
            console.error('Import error:', err);
            fb.value.setError(err, model + '.import');
            throw err;
        } finally {
            fb.value.finishLoading(model + '.import');
        }
    };

    return {
        types,
        type,
        fb,
        model,
        importExport,
        resetTypeAddForm,
        getTypes,
        getTypeById,
        createType,
        updateType,
        deleteType,
        importTypes,
    };
});
