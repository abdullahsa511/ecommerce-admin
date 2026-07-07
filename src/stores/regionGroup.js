import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import RegionGroupService from '../service/RegionGroupService';
import { RegionGroupFilter } from '../filters/RegionGroupFilter';
import RegionGroup from '../models/RegionGroup';
import FeedbackHandler from '../utils/FeedbackHandler';

export const useRegionGroupStore = defineStore('regionGroup', () => {
    /**
     * @type {import('vue').Ref<RegionGroup[]>}
     */
    const regionGroups = ref([]);
    const newRegionGroup = ref(new RegionGroup());
    const filter = ref(new RegionGroupFilter());
    
    /**
     * @type {import('vue').Ref<FeedbackHandler>}
     */
    const fb = ref(new FeedbackHandler());
    const model = 'regionGroup';

    const resetRegionGroup = () => {
        newRegionGroup.value = new RegionGroup();
    };

    const fetchRegionGroups = async () => {
        fb.value.clearError(model + '.list');
        fb.value.removeSuccess(model + '.list');
        fb.value.startLoading(model + '.list');
        try {
            const response = await RegionGroupService.getRegionGroups();
            regionGroups.value = response.map(regionGroup => new RegionGroup(regionGroup));
            fb.value.showSuccess(model + '.list');
        } catch (err) {
            console.error(err);
            fb.value.setError(err, model + '.list');
        } finally {
            fb.value.finishLoading(model + '.list');
        }
    };

    const fetchRegionGroupById = async (regionGroupId) => {
        fb.value.clearError(model + '.edit.' + regionGroupId);
        fb.value.removeSuccess(model + '.edit.' + regionGroupId);
        fb.value.startLoading(model + '.edit.' + regionGroupId);
        try {
            const regionGroup = await RegionGroupService.getRegionGroupById(regionGroupId);
            newRegionGroup.value = new RegionGroup(regionGroup);
            fb.value.showSuccess(model + '.edit.' + regionGroupId);
            return newRegionGroup.value;
        } catch (err) {
            fb.value.setError(err, model + '.edit.' + regionGroupId);
        } finally {
            fb.value.finishLoading(model + '.edit.' + regionGroupId);
        }
    };

    const createRegionGroup = async (newRegionGroup) => {
        fb.value.clearError(model + '.create');
        fb.value.removeSuccess(model + '.create');
        fb.value.startLoading(model + '.create');
        try {
            const createdRegionGroup = await RegionGroupService.createRegionGroup(newRegionGroup);
            regionGroups.value.push(createdRegionGroup);
            newRegionGroup.value = new RegionGroup(createdRegionGroup);
            fb.value.showSuccess(model + '.create');
            return newRegionGroup.value;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.create');
        } finally {
            fb.value.finishLoading(model + '.create');
        }
    };

    const updateRegionGroup = async (regionGroupId, updatedRegionGroup) => {
        fb.value.clearError(model + '.update.' + regionGroupId);
        fb.value.removeSuccess(model + '.update.' + regionGroupId);
        fb.value.startLoading(model + '.update.' + regionGroupId);
        try {
            const regionGroup = await RegionGroupService.updateRegionGroup(regionGroupId, updatedRegionGroup);
            const index = regionGroups.value.findIndex(r => r.region_group_id === regionGroupId);
            if (index !== -1) {
                regionGroups.value[index] = regionGroup;
            }
            fb.value.showSuccess(model + '.update.' + regionGroupId);
            return newRegionGroup.value;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.update.' + regionGroupId);
        } finally {
            fb.value.finishLoading(model + '.update.' + regionGroupId);
        }
    };

    const deleteRegionGroup = async (regionGroupId) => {
        fb.value.clearError(model + '.delete.' + regionGroupId);
        fb.value.removeSuccess(model + '.delete.' + regionGroupId);
        fb.value.startLoading(model + '.delete.' + regionGroupId);
        try {
            await RegionGroupService.deleteRegionGroup(regionGroupId);
            regionGroups.value = regionGroups.value.filter(r => r.region_group_id !== regionGroupId);
            fb.value.showSuccess(model + '.delete.' + regionGroupId);
        } catch (err) {
            fb.value.setError(err, model + '.delete.' + regionGroupId);
        } finally {
            fb.value.finishLoading(model + '.delete.' + regionGroupId);
        }
    };

    return { 
        regionGroups, 
        newRegionGroup,
        filter,
        fb,
        fetchRegionGroups, 
        fetchRegionGroupById, 
        createRegionGroup, 
        updateRegionGroup, 
        deleteRegionGroup,
        resetRegionGroup
    };
}); 