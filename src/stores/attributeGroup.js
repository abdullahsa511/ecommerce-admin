import { ref } from 'vue';
import { defineStore } from 'pinia';
import FeedbackHandler from '../utils/FeedbackHandler';
import AttributeGroup from '@/models/AttributeGroup';
import AttributeGroupService from '@/service/AttributeGroupService';
import AttributeGroupImportResponse from '@/models/AttributeGroupImport';

export const useAttributeGroupStore = defineStore('attributeGroup', () => {
    const attributeGroups = ref([]); // <-- remove <ProductAttribute[]>
    const attributeGroup = ref(new AttributeGroup());    // If it is edit mode the attribute 
    /**
     * @type {import('vue').Ref<AttributeGroupImportResponse>}
     */
    const importExport = ref(new AttributeGroupImportResponse());
    
    /**
     * @type {import('vue').Ref<FeedbackHandler>}
     */
    const fb = ref(new FeedbackHandler());
    const model = 'attributeGroup';

    const resetAttributeGroup = () => {
        attributeGroup.value = new AttributeGroup();
    };

    const fetchAttributeGroups = async () => {
        // fb loading handling
        fb.value.startLoading(model + ".list");
        try {
            const response = await AttributeGroupService.fetchAttributeGroups();
            attributeGroups.value = response.map(attr => new AttributeGroup(attr));
            console.log("this is attributeGroup store data",attributeGroups.value);
            
            attributeGroup.value.sort_order =  (attributeGroups.value[attributeGroups.value.length - 1].sort_order || 0) + 1;
        } catch (err) {
            console.error('Failed to fetch attribute groups:', err);
            fb.value.setError(err, model + ".list");
        } finally {
            fb.value.finishLoading(model + ".list");
        }
    };

    const createAttributeGroup = async (newAttributeGroup) => {
        fb.value.clearError(model + '.create');
        fb.value.removeSuccess(model + '.create');
        fb.value.startLoading(model + '.create');
        try {
            const ag = await AttributeGroupService.createAttributeGroup(newAttributeGroup);
            const attributeGroupObj = new AttributeGroup(ag);
            attributeGroup.value = attributeGroupObj;
            fb.value.showSuccess(model + '.create');
            return attributeGroup.value;
        } catch (err) {
            // Set error in FeedbackHandler
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.create');
            throw err;
        } finally {
            fb.value.finishLoading(model + '.create');
        }
    };

    const updateAttributeGroup = async (updataAttributeGroup) => {
        fb.value.clearError(model+ '.update.' + updataAttributeGroup.attribute_group_id);
        fb.value.removeSuccess(model+ '.update.' + updataAttributeGroup.attribute_group_id);
        fb.value.startLoading(model+ '.update.' + updataAttributeGroup.attribute_group_id);
        try {
            const response = await AttributeGroupService.updateAttributeGroup(updataAttributeGroup);
            attributeGroup.value = new AttributeGroup(response);
            fb.value.showSuccess(model+ '.update.' + updataAttributeGroup.attribute_group_id);
            return attributeGroup.value;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.update.' + updataAttributeGroup.attribute_group_id);
            throw err;
        } finally {
            fb.value.finishLoading(model + '.update.' + updataAttributeGroup.attribute_group_id);
        }
    };  

    const getAttributeGroupById = async (id) => {
        fb.value.clearError(model + '.edit.' + id);
        fb.value.removeSuccess(model + '.edit.' + id);
        fb.value.startLoading(model + '.edit.' + id);
        try {
            const response = await AttributeGroupService.getAttributeGroupById(id);
            attributeGroup.value = new AttributeGroup(response);
            fb.value.showSuccess(model + '.edit.' + id);
            return response;
        } catch (err) {
            console.error('Error updating attribute group:', err);
            fb.value.setError(err, model + '.edit.' + id);
            throw err;
        } finally {
            fb.value.finishLoading(model + '.edit.' + id);
        }
    };

    const deleteAttributeGroup = async (id) => {
        fb.value.clearError(model + '.delete.'+id);
        fb.value.removeSuccess(model + '.delete.'+id);
        fb.value.startLoading(model + '.delete.'+id);
        try {
            await AttributeGroupService.deleteAttributeGroup(id);
            attributeGroups.value = attributeGroups.value.filter(p => p.attribute_group_id !== id);
            fb.value.showSuccess(model + '.delete.'+id);
        } catch (err) {
            fb.value.setError(err, model + '.delete.'+id);
        } finally {
            fb.value.finishLoading(model + '.delete.'+id);
        }
    };
    const attributeGroupsImport = async (newImport) => {
        fb.value.clearError(model+'.import');
        fb.value.removeSuccess(model+'.import');
        fb.value.startLoading(model+'.import');
        try {
            if (!newImport) {
                throw new Error('No file data provided');
            }
            const response = await AttributeGroupService.attributeGroupsImport(newImport);
            console.log('Store received response:', response);
            importExport.value = new AttributeGroupImportResponse(response);
            fb.value.showSuccess(model+'.import');
            return importExport.value;
        } catch (err) {
            console.error('Import error:', err);
            fb.value.setError(err, model+'.import');
            throw err;
        } finally {
            fb.value.finishLoading(model+'.import');
        }
    };

       

    return {
        importExport,
        attributeGroups,
        attributeGroup,
        fb,
        resetAttributeGroup,
        fetchAttributeGroups,
        createAttributeGroup,
        updateAttributeGroup,
        getAttributeGroupById,
        deleteAttributeGroup,
        attributeGroupsImport,
    };
});
