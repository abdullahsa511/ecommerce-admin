import { ref } from 'vue';
import { defineStore } from 'pinia';
import ContactRequestService from '../service/ContactRequestService';
import ContactRequestImportExport from '../models/ContactRequestImportExport';
import { ContactRequest } from '@/models/ContactRequest';
import FeedbackHandler from '../utils/FeedbackHandler';

export const useContactRequestStore = defineStore('contactRequest', () => {
    const contactRequests = ref([]);
    const contactRequest = ref(new ContactRequest());    // If it is edit mode the contact request will store the response with the id
    const filter = ref(null);
    const error = ref(null);
    const loading = ref(null);
    const importExport = ref(new ContactRequestImportExport());
    const fb = ref(new FeedbackHandler());

    
    const model = 'visit_showroom';

    const resetContactRequest = () => {
        contactRequest.value = new ContactRequest();
    };

    const fetchContactRequests = async () => {
        fb.value.clearError(model + '.list');
        fb.value.removeSuccess(model + '.list');
        fb.value.startLoading(model + '.list');
        try {
            const response = await ContactRequestService.getContactRequests();
            contactRequests.value = response.map(cc => new ContactRequest(cc));
            return contactRequests.value;
            fb.value.showSuccess(model + '.list');
        } catch (err) {
            console.error('Failed to fetch contact request:', err);
            fb.value.setError(err, model + '.list');
        } finally {
            fb.value.finishLoading(model + '.list');
        }
    };

    // const createContactRequest = async (newContactRequest) => {
    //     console.log('Creating contact request:', newContactRequest);
    //     fb.value.clearError(model + '.create');
    //     fb.value.removeSuccess(model + '.create');
    //     fb.value.startLoading(model + '.create');
    //     try {
    //         const contactRequestResponse = await ContactRequestService.createContactRequest(newContactRequest);
    //         const contactRequestObj = new ContactRequest(contactRequestResponse);
    //         contactRequestObj.value = contactRequestObj;
    //         fb.value.showSuccess(model + '.create');
    //         contactRequest.value = new ContactRequest();
    //         return contactRequestObj.value;
    //     } catch (err) {
    //         // Set error in FeedbackHandler
    //         let error = err.response?.data?.errors;
    //         if(!error) error = err;
    //         fb.value.setError(error, model + '.create');
    //         // Re-throw the error so caller can catch it
    //         throw err;
    //     } finally {
    //         fb.value.finishLoading(model + '.create');
    //     }
    // };

    const getContactRequestById = async (id) => {
        fb.value.clearError(model + '.show.' + id);
        fb.value.removeSuccess(model + '.show.' + id);
        fb.value.startLoading(model + '.show.' + id);
        try {
            const response = await ContactRequestService.getContactRequestById(id);
            contactRequest.value = new ContactRequest(response);
            fb.value.showSuccess(model + '.show.' + id);
            return response;
        } catch (err) {
            fb.value.setError(err, model + '.show.' + id);
            throw err;
        } finally {
            fb.value.finishLoading(model + '.show.' + id);
        }
    };

    const updateContactRequest = async (contactRequest) => {
        console.log('Updating contact request:', contactRequest);
        fb.value.clearError(model + '.update.' + contactRequest.visit_showroom_id);
        fb.value.removeSuccess(model + '.update.' + contactRequest.visit_showroom_id);
        fb.value.startLoading(model + '.update.' + contactRequest.visit_showroom_id);
        try {
            const response = await ContactRequestService.updateContactRequest(contactRequest);
            fb.value.showSuccess(model + '.update.' + contactRequest.visit_showroom_id);
            return response;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.update.' + contactRequest.visit_showroom_id);
            throw err;
        } finally {
            fb.value.finishLoading(model + '.update.' + contactRequest.visit_showroom_id);
        }
    };

    const deleteContactRequest = async (id) => {
        fb.value.clearError(model + '.delete.'+id);
        fb.value.removeSuccess(model + '.delete.'+id);
        fb.value.startLoading(model + '.delete.'+id);
        try {
            await ContactRequestService.deleteContactRequest(id);
            contactRequests.value = contactRequests.value.filter(c => c.visit_showroom_id !== id);
            fb.value.showSuccess(model + '.delete.'+id);
        } catch (err) {
            fb.value.setError(err, model + '.delete.'+id);
        } finally {
            fb.value.finishLoading(model + '.delete.'+id);
        }
    };

    const contactRequestsImport = async (newImport) => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            if (!newImport) {
                throw new Error('No file data provided');
            }
            const response = await ContactRequestService.contactRequestsImport(newImport);
            console.log('Store received response:', response);
            importExport.value = new ContactRequestImportExport(response);
            fb.value.showSuccess(model + '.import');
            return response;
        } catch (err) {
            console.error('Import error:', err);
            fb.value.setError(err, model + '.import');
            throw err;
        } finally {
            fb.value.finishLoading(model + '.import');
        }
    };

    return {
        contactRequests,
        contactRequest,
        filter,
        loading,
        error,
        fb,
        resetContactRequest,
        fetchContactRequests,
        getContactRequestById,
        // createContactRequest,
        updateContactRequest,
        deleteContactRequest,
        contactRequestsImport,
    };
});

