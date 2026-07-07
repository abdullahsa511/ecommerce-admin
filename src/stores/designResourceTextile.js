import { defineStore } from 'pinia';
import { ref } from 'vue';
import TextileService from '@/service/DesignResourceTextileService';
import DesignResourceFilter from '@/filters/DesignResourceFilter';
import DesignResource from '@/models/DesignResource';
import FeedbackHandler from '../utils/FeedbackHandler';
import DesignResourceImportResponse from '@/models/DesignResourceImport';
import { FileModel } from '@/models/Media.ts';

export const useTextileStore = defineStore('textile', () => {
    const importExport = ref(new DesignResourceImportResponse());
    /**
     * @type {import('vue').Ref<DesignResource[]>}
     */
    const textiles = ref([]);
    const textile = ref(new DesignResource());
    const types = ref([]);
    const filter = ref(new DesignResourceFilter());
    const fb = ref(new FeedbackHandler());
    const model = 'textile';


    const resetTextile = () => {
        textile.value = new DesignResource();
    };

    const fetchTextiles = async () => {
        fb.value.clearError(model + '.list');
        fb.value.removeSuccess(model + '.list');
        fb.value.startLoading(model + '.list');
        try {
            const response = await TextileService.getTextiles();
            textiles.value = response.items.map(textile => new DesignResource(textile));
            fb.value.showSuccess(model + '.list');
            return textiles.value;
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
            const response = await TextileService.getTypes();
            // console.log('response', response);
            types.value = response;
            fb.value.showSuccess(model + '.types');
            return response;
        } catch (err) {
            console.error(err);
            fb.value.setError(err, model + '.types');
        } finally {
            fb.value.finishLoading(model + '.types');
        }
    };

    const fetchTextileById = async (textileId) => {
        fb.value.clearError(model + '.edit.' + textileId);
        fb.value.removeSuccess(model + '.edit.' + textileId);
        fb.value.startLoading(model + '.edit.' + textileId);
        try {
            const lt = await TextileService.getTextileById(textileId);
            textile.value = new DesignResource(lt);
            fb.value.showSuccess(model + '.edit.' + textileId);
            return textile.value;
        } catch (err) {
            fb.value.setError(err, model + '.edit.' + textileId);
        } finally {
            fb.value.finishLoading(model + '.edit.' + textileId);
        }
    };

    const createTextile = async (newTextile) => {
        fb.value.clearError(model + '.create');
        fb.value.removeSuccess(model + '.create');
        fb.value.startLoading(model + '.create');
        try {
            newTextile.resource_type = 'textiles';
            const createdTextile = await TextileService.createTextile(newTextile);
            const textileObj = new DesignResource(createdTextile);
            textile.value = textileObj;
            fb.value.showSuccess(model + '.create');
            return textile.value;
            // document.value.push(createdDocument);
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.create');
        } finally {
            fb.value.finishLoading(model + '.create');
        }
    };

    const updateTextile = async (updatedTextile) => {
        fb.value.clearError(model + '.update.' + updatedTextile.design_resource_id);
        fb.value.removeSuccess(model + '.update.' + updatedTextile.design_resource_id);
        fb.value.startLoading(model + '.update.' + updatedTextile.design_resource_id);
        // fb.value.clearError(model + '.update');
        // fb.value.removeSuccess(model + '.update');
        // fb.value.startLoading(model + '.update');
        try {
            updatedTextile.resource_type = 'textiles';
            const response = await TextileService.updateTextile(updatedTextile);
            const textileObj = new DesignResource(response);
            const index = textiles.value.findIndex(t => t.design_resource_id === updatedTextile.design_resource_id);
            if (index !== -1) {
                textiles.value[index] = textileObj;
            }
            textile.value = textileObj;
            fb.value.showSuccess(model + '.update.' + updatedTextile.design_resource_id);
            // fb.value.showSuccess(model + '.update');
            return textile.value;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.update.' + updatedTextile.design_resource_id);
            // fb.value.setError(err, model + '.update');
        } finally {
            fb.value.finishLoading(model + '.update.' + updatedTextile.design_resource_id);
            // fb.value.finishLoading(model + '.update');
        }
    };

    const deleteTextile = async (textileId) => {
        fb.value.clearError(model + '.delete.' + textileId);
        fb.value.removeSuccess(model + '.delete.' + textileId);
        fb.value.startLoading(model + '.delete.' + textileId);
        try {
            await TextileService.deleteTextile(textileId);
            textiles.value = textiles.value.filter(t => t.design_resource_id !== textileId);
            fb.value.showSuccess(model + '.delete.' + textileId);
        } catch (err) {
            fb.value.setError(err, model + '.delete.' + textileId);
        } finally {
            fb.value.finishLoading(model + '.delete.' + textileId);
        }
    };

    const uploadFiles = async (files, property, id) => {
        fb.value.clearError('media.files.upload.' + property);
        fb.value.removeSuccess('media.files.upload.' + property);
        fb.value.startLoading('media.files.upload.' + property);
        try {
            const response = await TextileService.uploadFiles(files, property, id);
            if (property === 'img' || property === 'img2') {
                textile.value[property] = response.files.map(item => new FileModel(item));
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

    const importTextiles = async (newImport) => {
        fb.value.clearError(model + '.import');
        fb.value.removeSuccess(model + '.import');
        fb.value.startLoading(model + '.import');
        try {
            if (!newImport) {
                throw new Error('No file data provided');
            }
            const response = await TextileService.importTextiles(newImport);
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
        textiles, 
        textile,
        types,
        filter,
        fb,
        importExport,
        resetTextile,
        fetchTextiles, 
        fetchTextileById, 
        createTextile, 
        updateTextile, 
        deleteTextile,
        uploadFiles,
        importTextiles,
        getTypes
    };
}); 