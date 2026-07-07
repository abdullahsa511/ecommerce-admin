import { defineStore } from 'pinia';
import { ref } from 'vue';
import DocumentService from '@/service/DesignResourceDocumentService';
import DesignResourceFilter from '@/filters/DesignResourceFilter';
import DesignResource, { DesignResourceDocument } from '@/models/DesignResource';
import FeedbackHandler from '../utils/FeedbackHandler';
import DesignResourceImportResponse from '@/models/DesignResourceImport';
import { FileModel } from '@/models/Media.ts';

export const useDocumentStore = defineStore('document', () => {
    const importExport = ref(new DesignResourceImportResponse());
    /**
     * @type {import('vue').Ref<DesignResource[]>}
     */
    const documents = ref([]);
    const document = ref(new DesignResource());
    const filter = ref(new DesignResourceFilter());
    const fb = ref(new FeedbackHandler());
    const model = 'document';
    const rootServer = import.meta.env.VITE_STATIC_BASE_URL;

    const resetDocument = () => {
        document.value = new DesignResource();
    };

    const fetchDocuments = async () => {
        fb.value.clearError(model + '.list');
        fb.value.removeSuccess(model + '.list');
        fb.value.startLoading(model + '.list');
        try {
            const response = await DocumentService.getDocuments();
            documents.value = response.items.map(document => new DesignResource(document));
            // console.log('documents store data', documents.value);
            return documents.value;
            fb.value.showSuccess(model + '.list');
        } catch (err) {
            console.error(err);
            fb.value.setError(err, model + '.list');
        } finally {
            fb.value.finishLoading(model + '.list');
        }
    };

    const fetchDocumentById = async (documentId) => {
        fb.value.clearError(model + '.show.' + documentId);
        fb.value.removeSuccess(model + '.show.' + documentId);
        fb.value.startLoading(model + '.show.' + documentId);
        try {
            const lt = await DocumentService.getDocumentById(documentId);
            document.value = new DesignResource(lt);
            fb.value.showSuccess(model + '.show.' + documentId);
            return document.value;
        } catch (err) {
            console.error('Error fetching document by id:', err);
            fb.value.setError(err, model + '.show.' + documentId);
        } finally {
            fb.value.finishLoading(model + '.show.' + documentId);
        }
    };

    const createDocument = async (newDocument) => {
        fb.value.clearError(model + '.create');
        fb.value.removeSuccess(model + '.create');
        fb.value.startLoading(model + '.create');
        try {
            console.log('createDocument newDocument', newDocument);
            newDocument.resource_type = 'documents';
            const createdDocument = await DocumentService.createDocument(newDocument);
            const documentObj = new DesignResource(createdDocument);
            document.value = documentObj;
            fb.value.showSuccess(model + '.create');
            return document.value;
            // document.value.push(createdDocument);
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.create');
        } finally {
            fb.value.finishLoading(model + '.create');
        }
    };

    const updateDocument = async (updatedDocument) => {
        fb.value.clearError(model + '.update.' + updatedDocument.design_resource_id);
        fb.value.removeSuccess(model + '.update.' + updatedDocument.design_resource_id);
        fb.value.startLoading(model + '.update.' + updatedDocument.design_resource_id);
        try {
            updatedDocument.resource_type = 'documents';
            const lt = await DocumentService.updateDocument(updatedDocument);
            const documentObj = new DesignResource(lt);
            const index = documents.value.findIndex(l => l.design_resource_id === updatedDocument.design_resource_id);
            if (index !== -1) {
                documents.value[index] = documentObj;
            }
            document.value = documentObj;
            fb.value.showSuccess(model + '.update.' + updatedDocument.design_resource_id);
            return document.value;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.update.' + updatedDocument.design_resource_id);
        } finally {
            fb.value.finishLoading(model + '.update.' + updatedDocument.design_resource_id);
        }
    };

    const deleteDocument = async (documentId) => {
        fb.value.clearError(model + '.delete.' + documentId);
        fb.value.removeSuccess(model + '.delete.' + documentId);
        fb.value.startLoading(model + '.delete.' + documentId);
        try {
            await DocumentService.deleteDocument(documentId);
            documents.value = documents.value.filter(l => l.design_resource_id !== documentId);
            fb.value.showSuccess(model + '.delete.' + documentId);
        } catch (err) {
            fb.value.setError(err, model);
        } finally {
            fb.value.finishLoading(model + '.delete.' + documentId);
        }
    };

    const uploadFiles = async (files, property, id) => {
        if (['img', 'img2'].includes(property)) {
            fb.value.clearError('media.files.upload.' + property);
            fb.value.removeSuccess('media.files.upload.' + property);
            fb.value.startLoading('media.files.upload.' + property);
        } else {
            for (let file of files) {
                let index = document.value.design_resource_documents.findIndex(l => {
                    return l.name === file.file?.name;
                });
                if (index !== -1) {
                    document.value.design_resource_documents[index].loading = true;
                }
            }
        }
        try {
            const response = await DocumentService.uploadFiles(files, property, id);
            if (property === 'img' || property === 'img2') {
                document.value[property] = response.files.map(item => new FileModel(item));
            } else {
                document.value.design_resource_documents = response.design_resource_documents.map(document => new DesignResourceDocument(document));
            }
            return response;
        } catch (err) {
            console.error('Error uploading files:', err);
            if (['img', 'img2'].includes(property)) {
                fb.value.setError(err, 'media.files.upload.' + property);
            }
        } finally {
            if (['img', 'img2'].includes(property)) {
                fb.value.finishLoading('media.files.upload.' + property);
            } else {
                for (let file of files) {
                    let index = document.value.design_resource_documents.findIndex(l => l.name === file.file?.name);
                    if (index !== -1) {
                        document.value.design_resource_documents[index].loading = false;
                    }
                }
            }
        }
    };

    const importDocuments = async (newImport) => {
        fb.value.clearError(model + '.import');
        fb.value.removeSuccess(model + '.import');
        fb.value.startLoading(model + '.import');
        try {
            if (!newImport) {
                throw new Error('No file data provided');
            }
            const response = await DocumentService.importDocuments(newImport);
            importExport.value = new DocumentImportResponse(response);
            fb.value.showSuccess(model + '.import');
            return importExport.value;
        } catch (err) {
            console.error('Import error:', err);
            fb.value.setError(err, model + '.import');
            throw err;
        } finally {
            fb.value.finishLoading(model + '.import');
        }
    };
    const deleteDesignResourceDocRecord = async (designResourceDocumentRecordId) => {
        const index = document.value.design_resource_documents.findIndex(l => l.design_resource_document_id === designResourceDocumentRecordId);
        if (index !== -1) {
            document.value.design_resource_documents[index].loading = true;
        }
        try {
            const response = await DocumentService.deleteDesignResourceDocRecord(designResourceDocumentRecordId);
            document.value.design_resource_documents = document.value.design_resource_documents.filter(l => l.design_resource_document_id !== designResourceDocumentRecordId);
            return response;
        } catch (err) {
            console.error('Delete design resource document record error:', err);
            if (index !== -1) {
                document.value.design_resource_documents[index].loading = false;
            }
        } finally {

        }
    };
    
    const deleteDocuments = async (files, property = 'models') => {
        try {
            const resourceDocumentIds = files.map(file => file.design_resource_document_id);
            // console.log('deleteModelDocuments store resourceDocumentIds', resourceDocumentIds);
            const response = await DocumentService.deleteDocuments(resourceDocumentIds, property);
            return response;
        } catch (err) {
            console.error('Error deleting documents:', err);
            throw err;
        }
    };

    return {
        documents,
        document,
        filter,
        fb,
        importExport,
        resetDocument,
        fetchDocuments,
        fetchDocumentById,
        createDocument,
        updateDocument,
        deleteDocument,
        uploadFiles,
        importDocuments,
        deleteDesignResourceDocRecord,
        deleteDocuments
    };
}); 