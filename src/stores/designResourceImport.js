import { defineStore } from 'pinia';
import { ref } from 'vue';
import DesignResourceImportService from '../service/DesignResourceImportService';
import ImportExport from '../models/ImportExport';
import FeedbackHandler from '../utils/FeedbackHandler';

export const useDesignResourceImportStore = defineStore('designResourceImport', () => {
    /**
     * @type {import('vue').Ref<ImportExport[]>}
     */
    const importExport = ref([]);

    /**
     * @type {import('vue').Ref<FeedbackHandler>}
     */
    const fb = ref(new FeedbackHandler());
    const model = 'import';

    const createDesignResourceImport = async (newImport) => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);

        try {
            if (!newImport) throw new Error('No file data provided');

            const response = await DesignResourceImportService.createDesignResourceImport(newImport);

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

    const createDocumentsImport = async (newImport) => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);

        try {
            if (!newImport) throw new Error('No file data provided');

            const response = await DesignResourceImportService.createDocumentsImport(newImport);

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

    const createModelsImport = async (newImport) => {
        fb.value.clearError(model + '.models');
        fb.value.removeSuccess(model + '.models');
        fb.value.startLoading(model + '.models');

        try {
            if (!newImport) throw new Error('No file data provided');

            const response = await DesignResourceImportService.createModelsImport(newImport);

            console.log('Store received response:', response);

            importExport.value.push(response);
            fb.value.showSuccess(model + '.models');

            return response;

        } catch (err) {
            console.error('Import error:', err);
            fb.value.setError(err, model + '.models');
            throw err;

        } finally {
            fb.value.finishLoading(model + '.models');
        }
    };

    const createFinishesImport = async (newImport) => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            if (!newImport) {
                throw new Error('No file data provided');
            }

            const response = await DesignResourceImportService.createFinishesImport(newImport);
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

    const createColorsImport = async (newImport) => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            if (!newImport) {
                throw new Error('No file data provided');
            }

            const response = await DesignResourceImportService.createColorsImport(newImport);
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

    const createTextilesImport = async (newImport) => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            if (!newImport) {
                throw new Error('No file data provided');
            }

            const response = await DesignResourceImportService.createTextilesImport(newImport);
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
        createDesignResourceImport,
        createDocumentsImport,
        createModelsImport,
        createFinishesImport,
        createTextilesImport,
        createColorsImport,
    };
});
