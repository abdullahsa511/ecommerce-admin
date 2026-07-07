import axios from 'axios';

const PROJECT_IMPORT_URL = import.meta.env.VITE_API_BASE_URL + '/project-import';
const PROJECT_IMAGE_IMPORT_URL = import.meta.env.VITE_API_BASE_URL + '/project-image-import';



export default class ProjectImportService {
    static createProjectImport(newImport) {
        return new Promise((resolve, reject) => {
            axios.post(PROJECT_IMPORT_URL, newImport)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error creating Project Import:', error);
                    reject(error);
                });
        });
    }

    static createProjectImageImport(newImport) {
        return new Promise((resolve, reject) => {
            axios.post(PROJECT_IMAGE_IMPORT_URL, newImport)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error creating Project Image Import:', error);
                    reject(error);
                });
        });
    }
}