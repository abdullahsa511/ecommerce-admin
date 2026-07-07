import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import AdminService from '../service/AdminService';
import AdminFilter from '../filters/AdminFilter';
import Admin from '../models/Admin';
import FeedbackHandler from '../utils/FeedbackHandler';
import AdminUserImportResponse from '@/models/AdminUserImport';
import { FileModel } from '@/models/Media';

export const useAdminStore = defineStore('admin', () => {
    /**
     * @type {import('vue').Ref<Admin[]>}
     */
    const admins = ref([]);
    const newAdmin = ref(new Admin());
    const filter = ref(new AdminFilter());
    const importExport = ref(new AdminUserImportResponse());
    /**
     * @type {import('vue').Ref<FeedbackHandler>}
     */
    const fb = ref(new FeedbackHandler());
    const model = 'admin';

    const resetNewAdmin = () => {
        newAdmin.value = new Admin();
    };

    const fetchAdmins = async () => {
        fb.value.clearError(model + '.list');
        fb.value.removeSuccess(model + '.list');
        fb.value.startLoading(model + '.list');
        try {
            const response = await AdminService.getAdmins();
            admins.value = response.map(admin => new Admin(admin));
            fb.value.showSuccess(model + '.list');
        } catch (err) {
            console.error(err);
            fb.value.setError(err, model + '.list');
        } finally {
            fb.value.finishLoading(model + '.list');
        }
    };

    const fetchAdminById = async (adminId) => {
        fb.value.clearError(model + '.show');
        fb.value.removeSuccess(model + '.show');
        fb.value.startLoading(model + '.show');
        try {
            const admin = await AdminService.getAdminById(adminId);
            newAdmin.value = new Admin(admin);
            fb.value.showSuccess(model + '.show');
            return admin;
        } catch (err) {
            fb.value.setError(err, model + '.show');
            return err;
        } finally {
            fb.value.finishLoading(model + '.show');
        }
    };

    const createAdmin = async (newAdmin) => {
        fb.value.clearError(model + '.create');
        fb.value.removeSuccess(model + '.create'    );
        fb.value.startLoading(model + '.create');
        try {
            const createdAdmin = await AdminService.createAdmin(newAdmin);
            admins.value.push(createdAdmin);
            fb.value.showSuccess(model + '.create');
            return createdAdmin;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.create');
            return err;
        } finally {
            fb.value.finishLoading(model + '.create');
        }
    };

    const updateAdmin = async (adminId, updatedAdmin) => {
        fb.value.clearError(model + '.update.' + adminId);
        fb.value.removeSuccess(model + '.update.' + adminId);
        fb.value.startLoading(model + '.update.' + adminId);
        try {
            const admin = await AdminService.updateAdmin(adminId, updatedAdmin);
            const index = admins.value.findIndex(a => a.admin_id === adminId);
            if (index !== -1) {
                admins.value[index] = admin;
            }
            fb.value.showSuccess(model + '.update.' + adminId);
            return admin;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.update.' + adminId);
            return err;
        } finally {
            fb.value.finishLoading(model + '.update.' + adminId);
        }
    };

    const deleteAdmin = async (adminId) => {
        fb.value.clearError(model + '.delete.' + adminId);
        fb.value.removeSuccess(model + '.delete.' + adminId);
        fb.value.startLoading(model + '.delete.' + adminId);
        try {
            await AdminService.deleteAdmin(adminId);
            admins.value = admins.value.filter(a => a.admin_id !== adminId);
            fb.value.showSuccess(model + '.delete.' + adminId);
        } catch (err) {
            fb.value.setError(err, model + '.delete.' + adminId);
            return err;
        } finally {
            fb.value.finishLoading(model + '.delete.' + adminId);
        }
    };

    const adminUsersImport = async (formData) => {
        fb.value.clearError(model + '.import');
        fb.value.removeSuccess(model + '.import');
        fb.value.startLoading(model + '.import');
        try {
            const response = await AdminService.adminUsersImport(formData);
            importExport.value = new AdminUserImportResponse(response);
            fb.value.showSuccess(model + '.import');
            return response;
        } catch (err) {
            fb.value.setError(err, model + '.import');
            return err;
        } finally {
            fb.value.finishLoading(model + '.import');
        }
    };

    const clearImportExport = () => {
        importExport.value = new AdminUserImportResponse();
    };

    const uploadUserImages = async (files, property, adminId) => {
        fb.value.clearError('media.files.upload.'+property);
        fb.value.removeSuccess('media.files.upload.'+property);
        fb.value.startLoading('media.files.upload.'+property);
        try {
            const response = await AdminService.uploadUserImages(files, property, adminId);
            newAdmin.value.avatar = response.files.map(item => new FileModel(item));
            fb.value.showSuccess('Files uploaded successfully', 'media.files.upload.'+property);
            return response;
        } catch (err) {
            fb.value.setError(err, 'media.files.upload.'+property);
            throw err;
        } finally {
            fb.value.finishLoading('media.files.upload.'+property);
        }
    };

    const deleteUserImages = async (file, adminId) => {
        fb.value.clearError('media.files.delete.'+adminId);
        fb.value.removeSuccess('media.files.delete.'+adminId);
        fb.value.startLoading('media.files.delete.'+adminId);
        try {
            const response = await AdminService.deleteUserImages(file, adminId);
            newAdmin.value.avatar = [];
            fb.value.showSuccess('media.files.delete.'+adminId);
            return response;
        } catch (err) {
            fb.value.setError(err, 'media.files.delete.'+adminId);
            throw err;
        } finally {
            fb.value.finishLoading('media.files.delete.'+adminId);
        }
    };

    return { 
        resetNewAdmin,
        admins, 
        importExport,
        newAdmin,
        filter,
        fb,
        fetchAdmins, 
        fetchAdminById, 
        createAdmin, 
        updateAdmin, 
        deleteAdmin,
        adminUsersImport,
        clearImportExport,
        uploadUserImages,
        deleteUserImages,
    };
}); 