import { ref } from 'vue';
import { defineStore } from 'pinia';
import AttributeService from '../service/AttributeService';
import ImportExport from '../models/ImportExport';
import AttributeFilter from '@/filters/AttributeFilter';
import ProductAttribute from '@/models/ProductAttribute';
import FeedbackHandler from '../utils/FeedbackHandler';

export const useProductAttributeStore = defineStore('productAttribute', () => {
    const attributes = ref([]); // <-- remove <ProductAttribute[]>
    const attribute = ref(new ProductAttribute());    // If it is edit mode the attribute will store the resoponse with the id
    const filter = ref(new AttributeFilter());
    const groups = ref([]); // <-- remove <ProductAttribute[]>
    const error = ref(null);
    const loading = ref(null);
    const importExport = ref([]);
    const fb = ref(new FeedbackHandler());

    
    const model = 'attribute';

    const resetAttribute = () => {
        attribute.value = new ProductAttribute();
    };

    const fetchAttributes = async () => {
        fb.value.clearError(model + '.list');
        fb.value.removeSuccess(model + '.list');
        fb.value.startLoading(model + '.list');
        try {
            const response = await AttributeService.getAttributes();
            attributes.value = response.map(aa => new ProductAttribute(aa));
            return attributes.value;
            fb.value.showSuccess(model + '.list');
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.list');
        } finally {
            fb.value.finishLoading(model + '.list');
        }
    };

    const fetchAttributeGroups = async () => {
        loading.value = true;
        error.value = null;
        try {
            const data = await AttributeService.getAttributeGroups();
            groups.value = data; // update the store ref
            return groups.value; // return for component usage
            } catch (err) {
                console.error('Failed to fetch attribute groups:', err);
            error.value = err.message || 'Failed to load attribute groups';
            return [];
        } finally {
            loading.value = false;
        }
    };


    const createAttribute = async (newAttribute) => {
        fb.value.clearError(model + '.create');
        fb.value.removeSuccess(model + '.create');
        fb.value.startLoading(model + '.create');
        try {
            const attribute = await AttributeService.createAttribute(newAttribute);
            const attributeObj = new ProductAttribute(attribute);
            attributeObj.value = attributeObj;
            fb.value.showSuccess(model + '.create');
            attribute.value = new ProductAttribute();
            return attributeObj.value;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.create');
            throw err;
        } finally {
            fb.value.finishLoading(model + '.create');
        }
    };

    const getAttributeById = async (id) => {
        fb.value.clearError(model + '.edit.' + id);
        fb.value.removeSuccess(model + '.edit.' + id);
        fb.value.startLoading(model + '.edit.' + id);
        try {
            const response = await AttributeService.getAttributeById(id);
            attribute.value = new ProductAttribute(response);
            fb.value.showSuccess(model + '.edit.' + id);
            return response;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.edit.' + id);
            throw err;
        } finally {
            fb.value.finishLoading(model + '.edit.' + id);
        }
    };

    const updateAttribute = async (attribute) => {
        fb.value.clearError(model + '.update.' + attribute.attribute_id);
        fb.value.removeSuccess(model + '.update.' + attribute.attribute_id);
        fb.value.startLoading(model + '.update.' + attribute.attribute_id);
        try {
            const response = await AttributeService.updateAttribute(attribute);
            fb.value.showSuccess(model + '.update.' + attribute.attribute_id);
            return response;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.update.' + attribute.attribute_id);
            throw err;
        } finally {
            fb.value.finishLoading(model + '.update.' + attribute.attribute_id);
        }
    };


    const attributesImport = async (newImport) => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            if (!newImport) {
                throw new Error('No file data provided');
            }
            const response = await AttributeService.attributesImport(newImport);
            console.log('Store received response:', response);
            importExport.value.push(response);
            fb.value.showSuccess(model);
            return response;
        } catch (err) {
            console.error('Import error:', err);
            fb.value.setError(err, model);
            throw err;
        } finally {
            fb.value.finishLoading(model);
        }
    };

    const deleteAttribute = async (id) => {
        fb.value.clearError(model + '.delete.'+id);
        fb.value.removeSuccess(model + '.delete.'+id);
        fb.value.startLoading(model + '.delete.'+id);
        try {
            await AttributeService.deleteAttribute(id);
            attributes.value = attributes.value.filter(p => p.attribute_id !== id);
            fb.value.showSuccess(model + '.delete.'+id);
        } catch (err) {
            fb.value.setError(err, model + '.delete.'+id);
        } finally {
            fb.value.finishLoading(model + '.delete.'+id);
        }
    };

    return {
        attributes,
        attribute,
        groups,
        loading,
        error,
        fb,
        resetAttribute,
        fetchAttributes,
        fetchAttributeGroups,
        getAttributeById,
        createAttribute,
        updateAttribute,
        deleteAttribute,
        attributesImport,
    };
});
