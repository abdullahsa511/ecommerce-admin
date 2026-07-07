import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import ShowroomContactService from '@/service/ShowroomContactService';
import FeedbackHandler from '@/utils/FeedbackHandler';
import ShowroomContactImportResponse from '@/models/ShowroomContactImport';
import ManufacturerFilter from '@/filters/ManufacturerFilter';
import { FileModel } from '@/models/Media';
import ShowroomContact from '@/models/ShowroomContact';
import {Showroom} from '@/models/Showroom';
import ShowroomService from '@/service/ShowroomService';

export const useShowroomContactStore = defineStore('showroomContact', () => {
    const showroomContacts = ref([]);
    const slotData = ref([]);
    const showroomContact = ref(new ShowroomContact());
    const filter = ref(new ManufacturerFilter());
    const fb = ref(new FeedbackHandler());
    const model = 'showroomContact';
    const importExport = ref(new ShowroomContactImportResponse());
    const showrooms = ref([]);
    const resetShowroomContact = () => {
        showroomContact.value = new ShowroomContact();
    };

    const fetchShowroomContacts = async () => {
        fb.value.clearError(model + '.list');
        fb.value.removeSuccess(model + '.list');
        fb.value.startLoading(model + '.list');
        try {
            const response = await ShowroomContactService.fetchShowroomContacts();
            showroomContacts.value = response.map(m => new ShowroomContact(m));
            fb.value.showSuccess(model + '.list');
        } catch (e) {
            console.error(e);
            fb.value.setError(e, model + '.list');
        } finally {
            fb.value.finishLoading(model + '.list');
        }
    };
    const getShowrooms = async () => {
        fb.value.clearError(model + '.showrooms.list');
        fb.value.removeSuccess(model + '.showrooms.list');
        fb.value.startLoading(model + '.showrooms.list');
        try {
            const response = await ShowroomService.getShowrooms();
            showrooms.value = response?.map(m => new Showroom(m)) ?? [];
            // console.log('showrooms pinia: ', showrooms.value);
            fb.value.showSuccess(model + '.showrooms.list');
        } catch (e) {
            console.error(e);
            fb.value.setError(e, model + '.showrooms.list');
        } finally {
            fb.value.finishLoading(model + '.showrooms.list');
        }
    };

    const getShowroomContactById = async (id) => {
        fb.value.clearError(model + '.show.' + id);
        fb.value.removeSuccess(model + '.show.' + id);
        fb.value.startLoading(model + '.show.' + id);
        try {
            const response = await ShowroomContactService.getShowroomContactById(id);
            showroomContact.value = new ShowroomContact(response);
            fb.value.showSuccess(model + '.show.' + id);
            return showroomContact.value;
        } catch (e) {
            console.error(e);
            fb.value.setError(e, model + '.show.' + id);
        } finally {
            fb.value.finishLoading(model + '.show.' + id);
        }
    };

    const createShowroomContact = async (newShowroomContact) => {
        fb.value.clearError(model + '.create');
        fb.value.removeSuccess(model + '.create');
        fb.value.startLoading(model + '.create');
        try {
            const response = await ShowroomContactService.createShowroomContact(newShowroomContact);
            const showroomContactObj = new ShowroomContact(response);
            showroomContactObj.value = showroomContactObj;
            fb.value.showSuccess(model + '.create');
            return showroomContactObj.value;
        }catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.create');
        } finally {
            fb.value.finishLoading(model + '.create');
        }
    };

    const updateShowroomContact = async (updatedShowroomContact) => {
        fb.value.clearError(model + '.update.' + updatedShowroomContact.showroom_contact_id);
        fb.value.removeSuccess(model + '.update.' + updatedShowroomContact.showroom_contact_id);
        fb.value.startLoading(model + '.update.' + updatedShowroomContact.showroom_contact_id);
        try {
            const response = await ShowroomContactService.updateShowroomContact(updatedShowroomContact);
            const showroomContactObj = new ShowroomContact(response);
            showroomContactObj.value = showroomContactObj;
            fb.value.showSuccess(model + '.update.' + updatedShowroomContact.showroom_contact_id);
            return showroomContactObj.value;
        }catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.update.' + updatedShowroomContact.showroom_contact_id);
        } finally {
            fb.value.finishLoading(model + '.update.' + updatedShowroomContact.showroom_contact_id);
        }   
    };
    
    const deleteShowroomContact = async (id) => {
        fb.value.clearError(model + '.delete.' + id);
        fb.value.removeSuccess(model + '.delete.' + id);
        fb.value.startLoading(model + '.delete.' + id);
        try {
           await ShowroomContactService.deleteShowroomContact(id);
            showroomContacts.value = showroomContacts.value.filter(m => m.showroom_contact_id !== id);
            fb.value.showSuccess(model + '.delete.' + id);
        } catch (err) {
            fb.value.setError(err, model + '.delete.' + id);
        } finally {
            fb.value.finishLoading(model + '.delete.' + id);
        }
    };

    const clearFilter = () => {
        filter.value = new ManufacturerFilter();
    };

    const importShowroomContacts = async (newImport) => {
        fb.value.clearError(model + '.import');
        fb.value.removeSuccess(model + '.import');
        fb.value.startLoading(model + '.import');
        try {
            const response = await ShowroomContactService.importShowroomContacts(newImport);
            importExport.value = new ShowroomContactImportResponse(response);
            fb.value.showSuccess(model + '.import');
            return importExport.value;
        } catch (e) {
            console.error(e);
            fb.value.setError(e, model + '.import');
        } finally {
            fb.value.finishLoading(model + '.import');
        }
    };


    const uploadShowroomContactImages = async (files, property, showroomContactId) => {
        fb.value.clearError('media.files.upload.'+property);
        fb.value.removeSuccess('media.files.upload.'+property);
        fb.value.startLoading('media.files.upload.'+property);
        try {
            const response = await ShowroomContactService.uploadShowroomContactImages(files, property, showroomContactId);
            showroomContact.value.image = response.files.map(item => new FileModel(item));
            fb.value.showSuccess('Files uploaded successfully', 'media.files.upload.'+property);
            return response;
        } catch (err) {
            fb.value.setError(err, 'media.files.upload.'+property);
            throw err;
        } finally {
            fb.value.finishLoading('media.files.upload.'+property);
        }
    };

    const deleteShowroomContactImages = async (file, showroomContactId) => {
        fb.value.clearError('media.files.delete.'+showroomContactId);
        fb.value.removeSuccess('media.files.delete.'+showroomContactId);
        fb.value.startLoading('media.files.delete.'+showroomContactId);
        try {
            console.log('file', file);
            const response = await ShowroomContactService.deleteShowroomContactImages(file, showroomContactId);
            showroomContact.value.image = [];
            fb.value.showSuccess('media.files.delete.'+showroomContactId);
            return response;
        } catch (err) {
            fb.value.setError(err, 'media.files.delete.'+showroomContactId);
            throw err;
        } finally {
            fb.value.finishLoading('media.files.delete.'+showroomContactId);
        }
    };

    const updateSlotStatus = async (showroomContactId, slot) => {
        fb.value.clearError('showroomContact.updateSlotStatus.'+showroomContactId);
        fb.value.removeSuccess('showroomContact.updateSlotStatus.'+showroomContactId);
        fb.value.startLoading('showroomContact.updateSlotStatus.'+showroomContactId);
        try {
            const response = await ShowroomContactService.updateSlotStatus(showroomContactId, slot);
            fb.value.showSuccess('showroomContact.updateSlotStatus.'+showroomContactId);
            return response;
        } catch (err) {
            fb.value.setError(err, 'showroomContact.updateSlotStatus.'+showroomContactId);
            throw err;
        } finally {
            fb.value.finishLoading('showroomContact.updateSlotStatus.'+showroomContactId);
        }
    };

    const fetchSlots = async (showroomContactId) => {
        fb.value.clearError('showroomContact.fetchSlots.'+showroomContactId);
        fb.value.removeSuccess('showroomContact.fetchSlots.'+showroomContactId);
        fb.value.startLoading('showroomContact.fetchSlots.'+showroomContactId);
        try {
            const response = await ShowroomContactService.fetchSlots(showroomContactId);
            slotData.value = response;
            return slotData.value;
        }
        catch (err) {
            fb.value.setError(err, 'showroomContact.fetchSlots.'+showroomContactId);
            throw err;
        } finally {
            fb.value.finishLoading('showroomContact.fetchSlots.'+showroomContactId);
        }
    };

    return {
        showroomContacts,
        showroomContact,
        showrooms,
        filter,
        slotData,
        fb,
        model,
        importExport,
        clearFilter,
        updateSlotStatus,
        fetchSlots,
        resetShowroomContact,
        fetchShowroomContacts,
        getShowroomContactById,
        createShowroomContact,
        updateShowroomContact,
        deleteShowroomContact,
        importShowroomContacts,
        uploadShowroomContactImages,
        deleteShowroomContactImages,
        getShowrooms,
    };
}); 