import { defineStore } from 'pinia';
import { ref } from 'vue';
import ImportService from '../service/ImportService';
import ImportExport from '../models/ImportExport';
import FeedbackHandler from '../utils/FeedbackHandler';

export const useImportStore = defineStore('import', () => {
    /**
     * @type {import('vue').Ref<ImportExport[]>}
     */
    const importExport = ref([]);
    
    /**
     * @type {import('vue').Ref<FeedbackHandler>}
     */
    const fb = ref(new FeedbackHandler());
    const model = 'import';

    const createImport = async (newImport) => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            if (!newImport) {
                throw new Error('No file data provided');
            }

            const createdImport = await ImportService.createImport(newImport);
            importExport.value.push(createdImport);
            fb.value.showSuccess(model);
            return createdImport;
        } catch (err) {
            console.error('Import error:', err);
            fb.value.setError(err, model);
            throw err;
        } finally {
            fb.value.finishLoading(model);
        }
    };

    const userExport = async () => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            const response = await ImportService.userExport();
            
            // Debug: Log all headers to see what's available
            console.log('All response headers:', response.headers);
            console.log('Response type:', typeof response.data);
            console.log('Response data:', response.data);
            
            // Check if response is a file download (CSV)
            const contentDisposition = response.headers['content-disposition'] || response.headers['Content-Disposition'];
            const contentType = response.headers['content-type'] || response.headers['Content-Type'];
            
            console.log('Content-Disposition:', contentDisposition);
            console.log('Content-Type:', contentType);
            
            // Check if this is a CSV file download
            // Since we have responseType: 'blob' and content-type is text/csv, we can assume it's a file download
            if (response.data instanceof Blob && contentType && contentType.toLowerCase().includes('text/csv')) {
                
                // Extract filename from content-disposition header
                const filenameMatch = contentDisposition ? contentDisposition.match(/filename="(.+)"/) : null;
                const filename = filenameMatch ? filenameMatch[1] : `users_export_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.csv`;
                
                // Create blob and download file
                const blob = new Blob([response.data], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
                
                fb.value.showSuccess(model, 'File downloaded successfully');
                console.log('CSV file downloaded:', filename);
            } else {
                // Handle regular data response (backward compatibility)
                importExport.value = response.data.map(importExport => new ImportExport(importExport));
                fb.value.showSuccess(model);
                console.log(importExport.value);
            }
        } catch (err) {
            console.error(err);
            fb.value.setError(err, model);
        } finally {
            fb.value.finishLoading(model);
        }
    };

    return { 
        importExport,
        fb,
        createImport,
        userExport
    };
}); 