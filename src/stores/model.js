import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import ModelService from '../service/ModelService';
import Model from '../models/Model';
import Field from '../models/Field';
import FeedbackHandler from '../utils/FeedbackHandler';

export const useModelStore = defineStore('model', () => {
    /**
     * @type {import('vue').Ref<Model[]>}
     */
    const models = ref([]);
    
    /**
     * @type {import('vue').Ref<Object>}
     */
    const modelFields = ref({});
    
    /**
     * @type {import('vue').Ref<Object>}
     */
    const modelItems = ref({});
    
    /**
     * @type {import('vue').Ref<FeedbackHandler>}
     */
    const fb = ref(new FeedbackHandler());
    const model = 'model';

    const fetchModels = async () => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            const response = await ModelService.getModels();
            models.value = response.map(modelData => new Model(modelData));
            fb.value.showSuccess(model);
            return models.value;
        } catch (err) {
            console.error(err);
            fb.value.setError(err, model);
            throw err;
        } finally {
            fb.value.finishLoading(model);
        }
    };

    const fetchRelatedModels = async (modelType) => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            const response = await ModelService.getRelatedModels(modelType);
            
            fb.value.showSuccess(model);
            return response;
        } catch (err) {
            console.error('Error fetching related models:', err);
            fb.value.setError(err, model);
            return []; // Return empty array on error
        } finally {
            fb.value.finishLoading(model);
        }
    };

    const fetchModelFields = async (modelType) => {
        if (modelFields.value[modelType]) {
            return modelFields.value[modelType];
        }

        fb.value.clearError(model);
        fb.value.startLoading(model);
        try {
            return await ModelService.getModelFields(modelType);
        } catch (err) {
            console.error(err);
            fb.value.setError(err, model);
            throw err;
        } finally {
            fb.value.finishLoading(model);
        }
    };

    const fetchModelItems = async (modelType, fields = []) => {
        const cacheKey = `${modelType}_${fields.map(f => f.name).join('_')}`;
        
        fb.value.clearError(model);
        fb.value.startLoading(model);
        try {
            const response = await ModelService.getModelItems(modelType, fields);
            
            // Format the response to match the expected structure
            const formattedResponse = {
                items: Array.isArray(response) ? response : (response.items || []),
                count: Array.isArray(response) ? response.length : (response.count || 0)
            };
            
            modelItems.value[cacheKey] = formattedResponse;
            return formattedResponse;
        } catch (err) {
            console.error(err);
            fb.value.setError(err, model);
            throw err;
        } finally {
            fb.value.finishLoading(model);
        }
    };

    const clearModelCache = () => {
        modelFields.value = {};
        modelItems.value = {};
    };

    const fetchJoinTableColumns = async (modelType, relatedModelName) => {
        fb.value.clearError(model);
        fb.value.startLoading(model);
        try {
            const response = await ModelService.getJoinTableColumns(modelType, relatedModelName);
            console.log('Join table columns response:', response);
            console.log('Response type:', typeof response);
            console.log('Is array:', Array.isArray(response));
            
            // Handle different response formats
            let fieldsData;
            if (Array.isArray(response)) {
                fieldsData = response;
            } else if (response && typeof response === 'object') {
                // If response is an object, check for common field properties
                if (response.joined_columns && Array.isArray(response.joined_columns)) {
                    fieldsData = response.joined_columns;
                } else if (response.fields && Array.isArray(response.fields)) {
                    fieldsData = response.fields;
                } else if (response.data && Array.isArray(response.data)) {
                    fieldsData = response.data;
                } else if (response.columns && Array.isArray(response.columns)) {
                    fieldsData = response.columns;
                } else {
                    // If it's an object but no array found, return empty array
                    console.warn('Response is object but no array found:', response);
                    return [];
                }
            } else {
                console.warn('Unexpected response format:', response);
                return [];
            }
            
            const fields = fieldsData.map(field => new Field(field));
            return fields;
        } catch (err) {
            console.error('Error fetching join table columns:', err);
            fb.value.setError(err, model);
            return []; // Return empty array instead of throwing
        } finally {
            fb.value.finishLoading(model);
        }
    };

    return { 
        models,
        modelFields, 
        modelItems,
        fb,
        fetchModels,
        fetchRelatedModels,
        fetchModelFields,
        fetchModelItems,
        fetchJoinTableColumns,
        clearModelCache
    };
}); 