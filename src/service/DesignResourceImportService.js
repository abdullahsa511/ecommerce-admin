import axios from 'axios';

const DESIGN_RESOURCE_IMPORT_URL = import.meta.env.VITE_API_BASE_URL + '/import-design-resource';
const DOCUMENTS_IMPORT_URL = import.meta.env.VITE_API_BASE_URL + '/documents-import';
const MODELS_IMPORT_URL = import.meta.env.VITE_API_BASE_URL + '/models-import';
const TEXTILES_IMPORT_URL = import.meta.env.VITE_API_BASE_URL + '/textiles-import';
const FINISHES_IMPORT_URL = import.meta.env.VITE_API_BASE_URL + '/finishes-import';
const COLORS_IMPORT_URL = import.meta.env.VITE_API_BASE_URL + '/colors-import';

export default class DesignResourceImportService {
    
    static async createDesignResourceImport(newImport) {
        try {
            const response = await axios.post(DESIGN_RESOURCE_IMPORT_URL, newImport);
            console.log('Design Resource Import Service response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error creating Design Resource Import:', error);
            throw error;
        }
    }

    static async createDocumentsImport(newImport) {
        try {
            const response = await axios.post(DOCUMENTS_IMPORT_URL, newImport);
            console.log('Documents Import Service response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error creating Documents Import:', error);
            throw error;
        }
    }

    static async createModelsImport(newImport) {
        try {
            const response = await axios.post(MODELS_IMPORT_URL, newImport);
            console.log('Models Import Service response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error creating Models Import:', error);
            throw error;
        }
    }

    static createFinishesImport(newImport) {
        return new Promise((resolve, reject) => {
            axios.post(FINISHES_IMPORT_URL, newImport)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error creating Finishes Import:', error);
                    reject(error);
                });
        });
    }

    static createTextilesImport(newImport) {
        return new Promise((resolve, reject) => {
            axios.post(TEXTILES_IMPORT_URL, newImport)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error creating Textiles Import:', error);
                    reject(error);
                });
        });
    }

    static createColorsImport(newImport) {
        return new Promise((resolve, reject) => {
            axios.post(COLORS_IMPORT_URL, newImport)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error creating Colors Import:', error);
                    reject(error);
                });
        });
    }
}
