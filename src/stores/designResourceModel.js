import { defineStore } from 'pinia';
import { ref } from 'vue';
import ModelService from '@/service/DesignResourceModelService';
import DesignResourceFilter from '@/filters/DesignResourceFilter';
import DesignResource, { DesignResourceDocument } from '@/models/DesignResource';
import FeedbackHandler from '../utils/FeedbackHandler';
import DesignResourceImportResponse from '@/models/DesignResourceImport';
import { FileModel } from '@/models/Media.ts';

export const useModelStore = defineStore('model', () => {
    const importExport = ref(new DesignResourceImportResponse());
    /**
     * @type {import('vue').Ref<DesignResource[]>}
     */
    const models = ref([]);
    const newModel = ref(new DesignResource());

    const designResourceModel = ref(new DesignResource());
    const filter = ref(new DesignResourceFilter());
    const fb = ref(new FeedbackHandler());
    const model = 'model';


    const resetDesignResourceModel = () => {
        designResourceModel.value = new DesignResource();
    };

    const fetchModels = async () => {
        fb.value.clearError(model + '.list');
        fb.value.removeSuccess(model + '.list');
        fb.value.startLoading(model + '.list');
        try {
            const response = await ModelService.getModels();
            models.value = response.items.map(model => new DesignResource(model));
            fb.value.showSuccess(model + '.list');
            // console.log('models', models.value);
            return models.value;
        } catch (err) {
            console.error(err);
            fb.value.setError(err, model + '.list');
        } finally {
            fb.value.finishLoading(model + '.list');
        }
    };

    const fetchModelById = async (modelId) => {
        fb.value.clearError(model + '.show.' + modelId);
        fb.value.removeSuccess(model + '.show.' + modelId);
        fb.value.startLoading(model + '.show.' + modelId);
        try {
            const response = await ModelService.getModelById(modelId);
            newModel.value = new DesignResource(response);
            fb.value.showSuccess(model + '.show.' + modelId);
            return newModel.value;
        } catch (err) {
            fb.value.setError(err, model + '.show.' + modelId);
        } finally {
            fb.value.finishLoading(model + '.show.' + modelId);
        }
    };

    const createModel = async (newModel) => {
        fb.value.clearError(model + '.create');
        fb.value.removeSuccess(model + '.create');
        fb.value.startLoading(model + '.create');
        try {
            newModel.resource_type = 'models';
            const createdModel = await ModelService.createModel(newModel);
            const designResourceModelObj = new DesignResource(createdModel);
            designResourceModel.value = designResourceModelObj;
            fb.value.showSuccess(model + '.create');
            return designResourceModel.value;
        } catch (err) {
            let error = err.response?.data?.errors;
            if (!error) error = err;
            fb.value.setError(error, model + '.create');
        } finally {
            fb.value.finishLoading(model + '.create');
        }
    };

    const updateModel = async (updatedModel) => {
        fb.value.clearError(model + '.update.' + updatedModel.design_resource_id);
        fb.value.removeSuccess(model + '.update.' + updatedModel.design_resource_id);
        fb.value.startLoading(model + '.update.' + updatedModel.design_resource_id);
        try {
            updatedModel.resource_type = 'models';
            const lt = await ModelService.updateModel(updatedModel);
            const designResourceModelObj = new DesignResource(lt);
            const index = models.value.findIndex(m => m.design_resource_id === updatedModel.design_resource_id);
            if (index !== -1) {
                models.value[index] = designResourceModelObj;
            }
            designResourceModel.value = designResourceModelObj;
            fb.value.showSuccess(model + '.update.' + updatedModel.design_resource_id);
            return designResourceModel.value;
        } catch (err) {
            let error = err.response?.data?.errors;
            if (!error) error = err;
            fb.value.setError(error, model + '.update.' + updatedModel.design_resource_id);
        } finally {
            fb.value.finishLoading(model + '.update.' + updatedModel.design_resource_id);
        }
    };

    const deleteModel = async (modelId) => {
        fb.value.clearError(model + '.delete.' + modelId);
        fb.value.removeSuccess(model + '.delete.' + modelId);
        fb.value.startLoading(model + '.delete.' + modelId);
        try {
            await ModelService.deleteModel(modelId);
            models.value = models.value.filter(m => m.design_resource_id !== modelId);
            fb.value.showSuccess(model + '.delete.' + modelId);
        } catch (err) {
            fb.value.setError(err, model + '.delete.' + modelId);
        } finally {
            fb.value.finishLoading(model + '.delete.' + modelId);
        }
    };

    const uploadFiles = async (files, property, id) => {
        if (['img', 'img2'].includes(property)) {
            fb.value.clearError('media.files.upload.' + property);
            fb.value.removeSuccess('media.files.upload.' + property);
            fb.value.startLoading('media.files.upload.' + property);
        } else {
            for (let file of files) {
                let index = newModel.value.design_resource_documents.findIndex(l => {
                    return l.name === file.file?.name;
                });
                if (index !== -1) {
                    newModel.value.design_resource_documents[index].loading = true;
                }
            }
        }
        try {
            const response = await ModelService.uploadFiles(files, property, id);
            if (property === 'img' || property === 'img2') {
                newModel.value[property] = response.files.map(item => new FileModel(item));
            } else {
                newModel.value.design_resource_documents = response.design_resource_documents.map((document) => {
                    document.resource_type = 'models';
                    return new DesignResourceDocument(document);
                });
            }
            return response;
        } catch (err) {
            console.error('Error uploading files:', err);
            if (['img', 'img2'].includes(property)) {
                fb.value.setError(err, 'media.files.upload.' + property);
            }
        } finally {
            if (['img', 'img2'].includes(property)) {
                fb.value.finishLoading('media.files.upload.' + property);
            } else {
                for (let file of files) {
                    let index = newModel.value.design_resource_documents.findIndex(l => l.name === file.file?.name);
                    if (index !== -1) {
                        newModel.value.design_resource_documents[index].loading = false;
                    }
                }
            }
        }
    };

    const importModels = async (newImport) => {
        fb.value.clearError(model + '.import');
        fb.value.removeSuccess(model + '.import');
        fb.value.startLoading(model + '.import');
        try {
            if (!newImport) {
                throw new Error('No file data provided');
            }
            const response = await ModelService.importModels(newImport);
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
    const deleteDesignResourceDocRecord = async (designResourceDocumentRecordId) => {
        const index = newModel.value.design_resource_documents.findIndex(l => l.design_resource_document_id === designResourceDocumentRecordId);
        if (index !== -1) {
            newModel.value.design_resource_documents[index].loading = true;
        }
        try {
            const response = await ModelService.deleteDesignResourceDocRecord(designResourceDocumentRecordId);
            newModel.value.design_resource_documents = newModel.value.design_resource_documents.filter(l => l.design_resource_document_id !== designResourceDocumentRecordId);
            return response;
        } catch (err) {
            console.error('Delete design resource document record error:', err);
            if (index !== -1) {
                newModel.value.design_resource_documents[index].loading = false;
            }
        } finally {

        }
    };

    const updateDocumentFormat = async (file) => {
        try {
            const response = await ModelService.updateModelDocumentFormat(file);
            return response;
        } catch (err) {
            console.error('Error updating document format:', err);
            throw err;
        }
    };

    const deleteModelDocuments = async (files, property = 'models') => {
        try {
            const resourceDocumentIds = files.map(file => file.design_resource_document_id);
            // console.log('deleteModelDocuments store resourceDocumentIds', resourceDocumentIds);
            const response = await ModelService.deleteModelDocuments(resourceDocumentIds, property);
            return response;
        } catch (err) {
            console.error('Error deleting model documents:', err);
            throw err;
        }
    };

    return {
        models,
        designResourceModel,
        filter,
        fb,
        newModel,
        importExport,
        resetDesignResourceModel,
        fetchModels,
        fetchModelById,
        createModel,
        updateModel,
        deleteModel,
        uploadFiles,
        importModels,
        deleteDesignResourceDocRecord,
        deleteModelDocuments,
        updateDocumentFormat
    };
}); 