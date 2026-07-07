import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import RegionService from '../service/RegionService';
import { RegionFilter } from '../filters/RegionFilter';
import Region from '../models/Region';
import FeedbackHandler from '../utils/FeedbackHandler';

export const useRegionStore = defineStore('region', () => {
    /**
     * @type {import('vue').Ref<Region[]>}
     */
    const regions = ref([]);
    const filter = ref(new RegionFilter());
    const region = ref(new Region());
    
    /**
     * @type {import('vue').Ref<FeedbackHandler>}
     */
    const fb = ref(new FeedbackHandler());
    const model = 'region';

    const resetRegion = () => {
        region.value = new Region();
    };

    const fetchRegions = async () => {
        fb.value.clearError(model + '.list');
        fb.value.removeSuccess(model + '.list');
        fb.value.startLoading(model + '.list');
        try {
            const response = await RegionService.getRegions();
            regions.value = response.map(region => new Region(region));
            fb.value.showSuccess(model + '.list');
        } catch (err) {
            console.error(err);
            fb.value.setError(err, model + '.list');
        } finally {
            fb.value.finishLoading(model + '.list');
        }
    };

    const fetchRegionById = async (regionId) => {
        fb.value.clearError(model + '.edit.' + regionId);
        fb.value.removeSuccess(model + '.edit.' + regionId);
        fb.value.startLoading(model + '.edit.' + regionId);
        try {
            const fetchedRegion = await RegionService.getRegionById(regionId);
            // assign to the store's ref (avoid shadowing the `region` ref)
            region.value = new Region(fetchedRegion);
            fb.value.showSuccess(model + '.edit.' + regionId);
            return region.value;
        } catch (err) {
            fb.value.setError(err, model + '.edit.' + regionId);
        } finally {
            fb.value.finishLoading(model + '.edit.' + regionId);
        }
    };

    const createRegion = async (newRegion) => {
        fb.value.clearError(model + '.create');
        fb.value.removeSuccess(model + '.create');
        fb.value.startLoading(model + '.create');
        try {
            const createdRegion = await RegionService.createRegion(newRegion);
            region.value = new Region(createdRegion);
            fb.value.showSuccess(model + '.create');
            return region.value;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.create');
        } finally {
            fb.value.finishLoading(model + '.create');
        }
    };

    const updateRegion = async (regionId, updatedRegion) => {
        fb.value.clearError(model + '.update.' + regionId);
        fb.value.removeSuccess(model + '.update.' + regionId);
        fb.value.startLoading(model + '.update.' + regionId);
        try {
            const region = await RegionService.updateRegion(regionId, updatedRegion);
            const index = regions.value.findIndex(r => r.region_id === regionId);
            if (index !== -1) {
                regions.value[index] = region;
            }
            fb.value.showSuccess(model + '.update.' + regionId);
            return region;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.update.' + regionId);
        } finally {
            fb.value.finishLoading(model + '.update.' + regionId);
        }
    };

    const deleteRegion = async (regionId) => {
        fb.value.clearError(model + '.delete.' + regionId);
        fb.value.removeSuccess(model + '.delete.' + regionId);
        fb.value.startLoading(model + '.delete.' + regionId);
        try {
            await RegionService.deleteRegion(regionId);
            regions.value = regions.value.filter(r => r.region_id !== regionId);
            fb.value.showSuccess(model + '.delete.' + regionId);
        } catch (err) {
            fb.value.setError(err, model + '.delete.' + regionId);
        } finally {
            fb.value.finishLoading(model + '.delete.' + regionId);
        }
    };

    return { 
        regions, 
        region,
        filter,
        fb,
        fetchRegions, 
        fetchRegionById, 
        createRegion, 
        updateRegion, 
        deleteRegion,
        resetRegion
    };
}); 