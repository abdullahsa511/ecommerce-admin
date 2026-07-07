import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import TaxonomyService from '@/service/TaxonomyService';
import TaxonomyFilter from '@/filters/TaxonomyFilter';
import Taxonomy, { TaxonomyType } from '@/models/Taxonomy';
import FeedbackHandler from '@/utils/FeedbackHandler';
import TaxonomyImportResponse from '@/models/TaxonomyImport';

export const useTaxonomyStore = defineStore('taxonomy', () => {
    /**
     * @type {import('vue').Ref<Taxonomy[]>}
     */
    const taxonomies = ref([]);
    const taxonomyTypes = ref([]);
    const modelTypes = ref([]);
    const newTaxonomy = ref(new Taxonomy());
    const filter = ref(new TaxonomyFilter());
    const importExport = ref(new TaxonomyImportResponse());
    /**
     * @type {import('vue').Ref<FeedbackHandler>}
     */
    const fb = ref(new FeedbackHandler());
    const model = 'taxonomy';

    const resetTaxonomy = () => {
        newTaxonomy.value = new Taxonomy();
    };

    const fetchTaxonomies = async () => {
        fb.value.clearError(model + '.list');
        fb.value.removeSuccess(model + '.list');
        fb.value.startLoading(model + '.list');
        try {
            const response = await TaxonomyService.getTaxonomies();
            taxonomies.value = response.map(taxonomy => new Taxonomy(taxonomy));
            fb.value.showSuccess(model + '.list');
        } catch (err) {
            console.error(err);
            fb.value.setError(err, model + '.list');
        } finally {
            fb.value.finishLoading(model + '.list');
        }
    };

    const taxonomyNames = computed(() => {
        return taxonomies.value.map(taxonomy => taxonomy.name);
    });

    const taxonomyTypeName = computed(() => {
        return taxonomies.value.map(taxonomy => taxonomy.type);
    });

    const fetchTaxonomyById = async (taxonomyId) => {
        fb.value.clearError(model + '.edit.' + taxonomyId);
        fb.value.removeSuccess(model + '.edit.' + taxonomyId);
        fb.value.startLoading(model + '.edit.' + taxonomyId);
        try {
            const taxonomy = await TaxonomyService.getTaxonomyById(taxonomyId);
            newTaxonomy.value = new Taxonomy(taxonomy);
            fb.value.showSuccess(model + '.edit.' + taxonomyId);
            return newTaxonomy.value;
        } catch (err) {
            fb.value.setError(err, model + '.edit.' + taxonomyId);
        } finally {
            fb.value.finishLoading(model + '.edit.' + taxonomyId);
        }
    };

    const createTaxonomy = async (newTaxonomy) => {
        fb.value.clearError(model+'.create');
        fb.value.removeSuccess(model+'.create');
        fb.value.startLoading(model+'.create');
        try {
            const payload = {
                ...newTaxonomy,
                post_type: newTaxonomy.post_type.name,
                site_id: newTaxonomy.site.code
            };
            const createdTaxonomy = await TaxonomyService.createTaxonomy(payload);
            newTaxonomy.value = new Taxonomy(createdTaxonomy);
            fb.value.showSuccess(model+'.create');
            return newTaxonomy.value;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model+'.create');
        } finally {
            fb.value.finishLoading(model+'.create');
        }
    };

    const updateTaxonomy = async (taxonomyId, updatedTaxonomy) => {
        fb.value.clearError(model+'.update.'+taxonomyId);
        fb.value.removeSuccess(model+'.update.'+taxonomyId);
        fb.value.startLoading(model+'.update.'+taxonomyId);
        try {
            const payload = {
                ...updatedTaxonomy,
                post_type: updatedTaxonomy.post_type.name,
                site_id: updatedTaxonomy.site.code
            };
            const taxonomy = await TaxonomyService.updateTaxonomy(taxonomyId, payload);
            fb.value.showSuccess(model+'.update.'+taxonomyId);
            return taxonomy;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model+'.update.'+taxonomyId);
        } finally {
            fb.value.finishLoading(model+'.update.'+taxonomyId);
        }
    };

    const deleteTaxonomy = async (taxonomyId) => {
        fb.value.clearError(model + '.delete.' + taxonomyId);
        fb.value.removeSuccess(model + '.delete.' + taxonomyId);
        fb.value.startLoading(model + '.delete.' + taxonomyId);
        try {
            await TaxonomyService.deleteTaxonomy(taxonomyId);
            taxonomies.value = taxonomies.value.filter(t => t.taxonomy_id !== taxonomyId);
            fb.value.showSuccess(model + '.delete.' + taxonomyId);
        } catch (err) {
            fb.value.setError(err, model + '.delete.' + taxonomyId);
        } finally {
            fb.value.finishLoading(model + '.delete.' + taxonomyId);
        }
    };

    // import taxonomies csv
    const taxonomyImport = async (formData) => {
        fb.value.clearError(model + '.import');
        fb.value.removeSuccess(model + '.import');
        fb.value.startLoading(model + '.import');
        try {
            if (!formData) {
                throw new Error('No file data provided to import taxonomies');
            }
            const response = await TaxonomyService.taxonomyImport(formData);
            console.log('Store received response:', response);
            importExport.value = new TaxonomyImportResponse(response);
            fb.value.showSuccess(model + '.import');
            return response;
        } catch (err) {
            console.error('Import error:', err);
            fb.value.setError(err, model + '.import');
            throw err;
        } finally {
            fb.value.finishLoading(model + '.import');
        }
    };

    const fetchTaxonomyTypes = async () => {
        fb.value.clearError(model + '.taxonomyTypes');
        fb.value.removeSuccess(model + '.taxonomyTypes');
        fb.value.startLoading(model + '.taxonomyTypes');
        try {
            const response = await TaxonomyService.getTaxonomyTypes();
            taxonomyTypes.value = response.taxonomyTypes.map(taxonomyType => new TaxonomyType(taxonomyType));
            modelTypes.value = response.modelTypes.map(modelType => new TaxonomyType(modelType));
            console.log('Taxonomy types:', taxonomyTypes.value);
            console.log('Model types:', modelTypes.value);
        }catch (err) {
            console.error('Taxonomy types error:', err);
            fb.value.setError(err, model + '.taxonomyTypes');
        }finally {
            fb.value.finishLoading(model + '.taxonomyTypes');
        }
    };

    return { 
        taxonomies, 
        newTaxonomy,
        filter,
        fb,
        taxonomyNames,
        taxonomyTypeName,
        taxonomyTypes,
        modelTypes,
        resetTaxonomy,
        fetchTaxonomies, 
        fetchTaxonomyById, 
        createTaxonomy, 
        updateTaxonomy, 
        deleteTaxonomy,
        taxonomyImport,
        importExport,
        fetchTaxonomyTypes
    };
}); 