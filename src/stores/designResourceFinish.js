import { defineStore } from 'pinia';
import { ref } from 'vue';
import FinishService from '@/service/DesignResourceFinishService';
import DesignResourceFilter from '@/filters/DesignResourceFilter';
import DesignResource from '@/models/DesignResource';
import FeedbackHandler from '../utils/FeedbackHandler';
import DesignResourceImportResponse from '@/models/DesignResourceImport';
import { FileModel } from '@/models/Media.ts';

export const useFinishStore = defineStore('finish', () => {
    const importExport = ref(new DesignResourceImportResponse());
    /**
     * @type {import('vue').Ref<DesignResource[]>}
     */
    const finishes = ref([]);
    const finish = ref(new DesignResource());
    const types = ref([]);
    const filter = ref(new DesignResourceFilter());
    const fb = ref(new FeedbackHandler());
    const model = 'finish';


    const resetFinish = () => {
        finish.value = new DesignResource();
    };

    const fetchFinishes = async () => {
        fb.value.clearError(model + '.list');
        fb.value.removeSuccess(model + '.list');
        fb.value.startLoading(model + '.list');
        try {
            const response = await FinishService.getFinishes();
            // console.log('response', response.items);
            finishes.value = response.items.map(finish => new DesignResource(finish));
            fb.value.showSuccess(model + '.list');
        } catch (err) {
            console.error(err);
            fb.value.setError(err, model + '.list');
        } finally {
            fb.value.finishLoading(model + '.list');
        }
    };

    const getTypes = async () => {
        fb.value.clearError(model + '.types');
        fb.value.removeSuccess(model + '.types');
        fb.value.startLoading(model + '.types');
        try {
            const data = await FinishService.getTypes();
            // console.log('response types DATA:', data);
            types.value = data;
            fb.value.showSuccess(model + '.types');
            return data; // return for component usage
        } catch (err) {
            console.error(err);
            fb.value.setError(err, model + '.types');
        } finally {
            fb.value.finishLoading(model + '.types');
        }
    };

    const fetchFinishById = async (finishId) => {
        fb.value.clearError(model + '.edit.' + finishId);
        fb.value.removeSuccess(model + '.edit.' + finishId);
        fb.value.startLoading(model + '.edit.' + finishId);
        try {
            const lt = await FinishService.getFinishById(finishId);
            finish.value = new DesignResource(lt);
            fb.value.showSuccess(model + '.edit.' + finishId);
            return finish.value;
        } catch (err) {
            fb.value.setError(err, model + '.edit.' + finishId);
        } finally {
            fb.value.finishLoading(model + '.edit.' + finishId);
        }
    };

    const createFinish = async (newFinish) => {
        console.log('newFinish', newFinish);
        fb.value.clearError(model + '.create');
        fb.value.removeSuccess(model + '.create');
        fb.value.startLoading(model + '.create');
        try {
            newFinish.resource_type = 'finishes';
            const createdFinish = await FinishService.createFinish(newFinish);
            const finishObj = new DesignResource(createdFinish);
            finish.value = finishObj;
            fb.value.showSuccess(model + '.create');
            return finish.value;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.create');
        } finally {
            fb.value.finishLoading(model + '.create');
        }
    };

    const updateFinish = async (updatedFinish) => {
        fb.value.clearError(model + '.update.' + updatedFinish.design_resource_id);
        fb.value.removeSuccess(model + '.update.' + updatedFinish.design_resource_id);
        fb.value.startLoading(model + '.update.' + updatedFinish.design_resource_id);
            // fb.value.clearError(model + '.update');
            // fb.value.removeSuccess(model + '.update');
            // fb.value.startLoading(model + '.update');
        try {
            updatedFinish.resource_type = 'finishes';
            const response = await FinishService.updateFinish(updatedFinish);
            const finishObj = new DesignResource(response);
            const index = finishes.value.findIndex(f => f.design_resource_id === updatedFinish.design_resource_id);
            if (index !== -1) {
                finishes.value[index] = finishObj;
            }
            finish.value = finishObj;
            fb.value.showSuccess(model + '.update.' + updatedFinish.design_resource_id);
            // fb.value.showSuccess(model + '.update');
            return finish.value;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.update.' + updatedFinish.design_resource_id);
        } finally {
            fb.value.finishLoading(model + '.update.' + updatedFinish.design_resource_id);
            // fb.value.finishLoading(model + '.update');
        }
    };

    const deleteFinish = async (finishId) => {
        fb.value.clearError(model + '.delete.' + finishId);
        fb.value.removeSuccess(model + '.delete.' + finishId);
        fb.value.startLoading(model + '.delete.' + finishId);
        try {
            await FinishService.deleteFinish(finishId);
            finishes.value = finishes.value.filter(f => f.design_resource_id !== finishId);
            fb.value.showSuccess(model + '.delete.' + finishId);
        } catch (err) {
            fb.value.setError(err, model + '.delete.' + finishId);
        } finally {
            fb.value.finishLoading(model + '.delete.' + finishId);
        }
    };

    const uploadFiles = async (files, property, id) => {
        fb.value.clearError('media.files.upload.' + property);
        fb.value.removeSuccess('media.files.upload.' + property);
        fb.value.startLoading('media.files.upload.' + property);
        try {
            const response = await FinishService.uploadFiles(files, property, id);
            if (property === 'img' || property === 'img2') {
                finish.value[property] = response.files.map(item => new FileModel(item));
            }
            fb.value.showSuccess('Files uploaded successfully', 'media.files.upload.' + property);
            return response;
        } catch (err) {
            fb.value.setError(err, 'media.files.upload.' + property);
            throw err;
        } finally {
            fb.value.finishLoading('media.files.upload.' + property);
        }
    };

    const importFinishes = async (newImport) => {
        fb.value.clearError(model + '.import');
        fb.value.removeSuccess(model + '.import');
        fb.value.startLoading(model + '.import');
        try {
            if (!newImport) {
                throw new Error('No file data provided');
            }
            const response = await FinishService.importFinishes(newImport);
            importExport.value = new DesignResourceImportResponse(response);
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
        finishes,
        finish,
        filter,
        fb,
        importExport,
        resetFinish,
        fetchFinishes,
        fetchFinishById,
        createFinish,
        updateFinish,
        deleteFinish,
        importFinishes,
        uploadFiles,
        getTypes
    };
}); 