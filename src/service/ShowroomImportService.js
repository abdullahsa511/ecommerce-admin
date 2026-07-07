import axios from 'axios';

const SECTION_IMPORT_URL = import.meta.env.VITE_API_BASE_URL + '/section-import';
const SECTION_IMAGE_IMPORT_URL = import.meta.env.VITE_API_BASE_URL + '/section-image-import';
const SECTION_PROCUT_IMPORT_URL = import.meta.env.VITE_API_BASE_URL + '/section-product-import';

export default class ShowroomImportService {
    static createSectionImport(newImport) {
        return new Promise((resolve, reject) => {
            axios.post(SECTION_IMPORT_URL, newImport)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error creating Section Import:', error);
                    reject(error);
                });
        });
    }

    static createSectionImageImport(newImport) {
        return new Promise((resolve, reject) => {
            axios.post(SECTION_IMAGE_IMPORT_URL, newImport)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error creating Section Image Import:', error);
                    reject(error);
                });
        });
    }
    static createSectionProductImport(newImport) {
        return new Promise((resolve, reject) => {
            axios.post(SECTION_PROCUT_IMPORT_URL, newImport)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error creating Section Product Import:', error);
                    reject(error);
                });
        });
    }
}