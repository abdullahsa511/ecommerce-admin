import axios from 'axios';

const DESIGN_RESOURCE_API_URL = import.meta.env.VITE_API_BASE_URL + '/design-resources';
const API_URL = import.meta.env.VITE_API_BASE_URL + '/design-resources/documents?context=product';
const API_RESOURCE_URL = import.meta.env.VITE_API_BASE_URL + '/design-resources';
const API_URL_IMPORT = (import.meta.env.VITE_API_BASE_URL || '') + '/documents-import';
const API_UPLOAD_URL = import.meta.env.VITE_API_BASE_URL + '/design-resources/upload';

export default class DesignResourceDocumentService {

    static getDocuments() {
        return new Promise((resolve, reject) => {
            axios.get(API_URL)
                .then(response => {
                    console.log("document service data", response.data);
                    
                    resolve(response.data);
                })
                .catch(error => {
                    return reject(error);
                });
        })
    }

    static getDocumentById(documentId) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_RESOURCE_URL}/${documentId}?resource_type=documents`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    return reject(error);
                });
        })
    }
    // Create a new post
    static createDocument(newDocument) {
        return new Promise((resolve, reject) => {
            newDocument.resource_type = 'documents';
            axios.post(`${API_URL}/create`, newDocument, {
                headers: { 'Content-Type': 'application/json' }
            })
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error creating document:', error);
                    reject(error);
                });
        });
    }

    static updateDocument(updatedDocument) {
        return new Promise((resolve, reject) => {
            updatedDocument.resource_type = 'documents';
            axios.put(`${API_URL}/update/${updatedDocument.design_resource_id}`, updatedDocument, {
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

    static deleteDocument(documentId) {
        return new Promise((resolve, reject) => {
            axios.post(`${API_URL}/delete/${documentId}`)
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
            for (const file of files) {
                formData.append(file.index.toString(), file.file);
            }

            formData.append('property', property);
            formData.append('resource_type', 'documents');
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

    static async deleteFileByPath(filepath, property, projectId) {
        return new Promise((resolve, reject) => {

            axios.post(`${API_URL}/delete-by-path`, { path: filepath, property: property, project_id: projectId })
                .then(response => {
                    console.log('Delete response:', response.data);
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error deleting image:', error);
                    reject(error);
                });
        });
    }

    static async importDocuments(fromData) {
        // alert('importVariants');
        try {
            const response = await axios.post(`${API_URL_IMPORT}`, fromData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data;
        } catch (error) {
            console.error('Error importing documents:', error);
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

    static async deleteDocuments(resourceDocumentIds, property = 'models') {
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

} 