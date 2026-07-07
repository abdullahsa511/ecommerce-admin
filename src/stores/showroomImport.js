import { defineStore } from 'pinia';
import { ref } from 'vue';
import ShowroomImportService from '../service/ShowroomImportService';
import ImportExport from '../models/ImportExport';
import FeedbackHandler from '../utils/FeedbackHandler';

export const useShowroomImportStore = defineStore('showroomImport', () => {
    /**
     * @type {import('vue').Ref<ImportExport[]>}
     */
    const importExport = ref([]);
    
    /**
     * @type {import('vue').Ref<FeedbackHandler>}
     */
    const fb = ref(new FeedbackHandler());
    const model = 'import';

    const createSectionImport = async (newImport) => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            if (!newImport) {
                throw new Error('No file data provided');
            }

            const response = await ShowroomImportService.createSectionImport(newImport);
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
    const createSectionImageImport = async (newImport) => {
        console.log('createSectionImageImport');
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            if (!newImport) {
                throw new Error('No file data provided');
            }

            const response = await ShowroomImportService.createSectionImageImport(newImport);
            console.log('createSectionImageImport response:', response);
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
    const createSectionProductImport = async (newImport) => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            if (!newImport) {
                throw new Error('No file data provided');
            }

                const response = await ShowroomImportService.createSectionProductImport(newImport);
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

    

    return { 
        importExport,
        fb,
        createSectionImport,
        createSectionImageImport,
        createSectionProductImport
    };
}); 