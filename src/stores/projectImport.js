import { defineStore } from 'pinia';
import { ref } from 'vue';
import ProjectImportService from '../service/ProjectImportService';
import ImportExport from '../models/ImportExport';
import FeedbackHandler from '../utils/FeedbackHandler';

export const useProjectImportStore = defineStore('projectImport', () => {
    /**
     * @type {import('vue').Ref<ImportExport[]>}
     */
    const importExport = ref([]);
    
    /**
     * @type {import('vue').Ref<FeedbackHandler>}
     */
    const fb = ref(new FeedbackHandler());
    const model = 'import';

    const createProjectImport = async (newImport) => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            if (!newImport) {
                throw new Error('No file data provided');
            }

            const response = await ProjectImportService.createProjectImport(newImport);
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
    const createProjectImageImport = async (newImport) => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            if (!newImport) {
                throw new Error('No file data provided');
            }

            const response = await ProjectImportService.createProjectImageImport(newImport);
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
        createProjectImport,
        createProjectImageImport
    };
}); 