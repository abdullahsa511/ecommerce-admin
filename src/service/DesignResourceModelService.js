import axios from 'axios';

const DESIGN_RESOURCE_API_URL = import.meta.env.VITE_API_BASE_URL + '/design-resources';
const API_URL_MODELS = import.meta.env.VITE_API_BASE_URL + '/design-resources/models';
const API_URL = import.meta.env.VITE_API_BASE_URL + '/design-resources/models?context=product';
const API_URL_IMPORT = (import.meta.env.VITE_API_BASE_URL || '') + '/models-import';
const API_DOCUMENT_URL = import.meta.env.VITE_API_BASE_URL + '/design-resources/documents';
const API_RESOURCE_URL = import.meta.env.VITE_API_BASE_URL + '/design-resources';
const API_UPLOAD_URL = import.meta.env.VITE_API_BASE_URL + '/design-resources/upload';

export default class DesignResourceModelService {
    static getModels() {
        return new Promise((resolve, reject) => {
            axios.get(API_URL)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    return reject(error);
                });
        })
    }

    static getModelById(modelId) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_RESOURCE_URL}/${modelId}?resource_type=models`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    return reject(error);
                });
        })
    }
    // Create a new post
    static createModel(newModel) {
        return new Promise((resolve, reject) => {
            axios.post(API_URL + '/create', newModel, {
                headers: { 'Content-Type': 'application/json' }
            })
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error creating model:', error);
                    reject(error);
                });
        });
    }

    static updateModel(updatedModel) {
        return new Promise((resolve, reject) => {
            axios.put(`${API_URL_MODELS}/update/${updatedModel.design_resource_id}`, updatedModel, {
                headers: { 'Content-Type': 'application/json' }
            })
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    return reject(error);
                });
        });
    }

    static deleteModel(modelId) {
        return new Promise((resolve, reject) => {
            axios.post(`${API_URL}/delete/${modelId}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    return reject(error);
                });
        });
    }

    static async uploadFiles(files, property, id) {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            let formats = [];
            for (const file of files) {
                formData.append(file.index.toString(), file.file);
                formats.push({index: file.index.toString(), format: file.file?.format});
            }

            formData.append('property', property);
            formData.append('resource_type', 'models');
            formData.append('formats', JSON.stringify(formats));
            axios.post(`${API_UPLOAD_URL}/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error uploading files:', error);
                    reject(error);
                });
        });
    }

    static async importModels(fromData) {
        // alert('importVariants');
        try {
            const response = await axios.post(`${API_URL_IMPORT}`, fromData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data;
        } catch (error) {
            console.error('Error importing models:', error);
            throw error;
        }
    }
    static async deleteDesignResourceDocRecord(designResourceDocumentRecordId) {
        return new Promise((resolve, reject) => {
            axios.post(`${DESIGN_RESOURCE_API_URL}/document-record/${designResourceDocumentRecordId}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error deleting design resource document record:', error);
                    reject(error);
                });
        });
    }

    static async deleteModelDocuments(resourceDocumentIds, property = 'models') {
        // console.log('deleteModelDocuments service resourceDocumentIds', resourceDocumentIds);
        // console.log('deleteModelDocuments service property', property);
        return new Promise((resolve, reject) => {
            axios.post(`${DESIGN_RESOURCE_API_URL}/models/delete-by-ids`, { resource_document_ids: resourceDocumentIds, property: property })
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error deleting model documents:', error);
                    reject(error);
                });
        });
    }

    static updateModelDocumentFormat(file) {
        return new Promise((resolve, reject) => {
            axios.post(`${DESIGN_RESOURCE_API_URL}/update-model-document-format`, {
                design_resource_document_id: file.design_resource_document_id,
                format: file.format,
            })
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error updating model document format:', error);
                    reject(error);
                });
        });
    }
} 