import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import UserService from '../service/UserService';
import UserFilter from '../filters/UserFilter';
import User from '../models/User';
import FeedbackHandler from '../utils/FeedbackHandler';
import ImportExport from '../models/ImportExport';
import { FileModel } from '@/models/Media';

export const useUserStore = defineStore('user', () => {
    /**
     * @type {import('vue').Ref<User[]>}
     */
    const users = ref([]);
    const newUser = ref(new User());
    const filter = ref(new UserFilter());
    
    /**
     * @type {import('vue').Ref<FeedbackHandler>}
     */
    const fb = ref(new FeedbackHandler());
    const model = 'user';
    const importExport = ref(new ImportExport());

    const resetNewUser = () => {
        newUser.value = new User();
    };
    const fetchUsers = async () => {
        fb.value.clearError(model + '.list');
        fb.value.removeSuccess(model + '.list');
        fb.value.startLoading(model + '.list');
        try {
            const response = await UserService.getUsers();
            users.value = response.map(u => new User(u));
            fb.value.showSuccess(model + '.list');
        } catch (err) {
            console.error(err);
            fb.value.setError(err, model + '.list');
        } finally {
            fb.value.finishLoading(model + '.list');
        }
    };

    const fetchUserById = async (userId) => {
        fb.value.clearError(model + '.edit.' + userId);
        fb.value.removeSuccess(model + '.edit.' + userId);
        fb.value.startLoading(model + '.edit.' + userId);
        try {
            const user = await UserService.getUserById(userId);
            newUser.value = new User(user);
            fb.value.showSuccess(model + '.edit.' + userId);
            return newUser.value;
        } catch (err) {
            fb.value.setError(err, model + '.edit.' + userId);
        } finally {
            fb.value.finishLoading(model + '.edit.' + userId);
        }
    };

    const createUser = async (newUser) => {
        fb.value.clearError(model + '.create');
        fb.value.removeSuccess(model + '.create');
        fb.value.startLoading(model + '.create');
        try {
            const response = await UserService.createUser(newUser);
            users.value.push(new User(response));
            fb.value.showSuccess(model + '.create');
            return response;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.create');
        } finally {
            fb.value.finishLoading(model + '.create');
        }
    };

    const updateUser = async (userId, updatedUser) => {
        fb.value.clearError(model + '.update.' + userId);
        fb.value.removeSuccess(model + '.update.' + userId);
        fb.value.startLoading(model + '.update.' + userId);
        try {
            const user = await UserService.updateUser(userId, updatedUser);
            const index = users.value.findIndex(u => u.user_id === userId);
            if (index !== -1) {
                users.value[index] = user;
            }
            fb.value.showSuccess(model + '.update.' + userId);
            return user;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.update.' + userId);
        } finally {
            fb.value.finishLoading(model + '.update.' + userId);
        }
    };

    const deleteUser = async (userId) => {
        fb.value.clearError(model + '.delete.' + userId);
        fb.value.removeSuccess(model + '.delete.' + userId);
        fb.value.startLoading(model + '.delete.' + userId);
        try {
            await UserService.deleteUser(userId);
            users.value = users.value.filter(u => u.user_id !== userId);
            fb.value.showSuccess(model + '.delete.' + userId);
        } catch (err) {
            fb.value.setError(err, model + '.delete.' + userId);
        } finally {
            fb.value.finishLoading(model + '.delete.' + userId);
        }
    };

    // import users
    const usersImport = async (newImport) => {
        fb.value.clearError(model + '.import');
        fb.value.removeSuccess(model + '.import');
        fb.value.startLoading(model + '.import');
        try {
            if (!newImport) {
                throw new Error('No file data provided');
            }

            const response = await UserService.usersImport(newImport);
            console.log('Store received response:', response);
            importExport.value = new ImportExport(response);
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
    const uploadUserImages = async (files, property, userId) => {
        fb.value.clearError('media.files.upload.'+property);
        fb.value.removeSuccess('media.files.upload.'+property);
        fb.value.startLoading('media.files.upload.'+property);
        try {
            const response = await UserService.uploadUserImages(files, property, userId);
            newUser.value.avatar = response.files.map(item => new FileModel(item));
            fb.value.showSuccess('Files uploaded successfully', 'media.files.upload.'+property);
            return response;
        } catch (err) {
            fb.value.setError(err, 'media.files.upload.'+property);
            throw err;
        } finally {
            fb.value.finishLoading('media.files.upload.'+property);
        }
    };

    const deleteUserImages = async (file, userId) => {
        fb.value.clearError('media.files.delete.'+userId);
        fb.value.removeSuccess('media.files.delete.'+userId);
        fb.value.startLoading('media.files.delete.'+userId);
        try {
            const response = await UserService.deleteUserImages(file, userId);
            newUser.value.avatar = [];
            fb.value.showSuccess('media.files.delete.'+userId);
            return response;
        } catch (err) {
            fb.value.setError(err, 'media.files.delete.'+userId);
            throw err;
        } finally {
            fb.value.finishLoading('media.files.delete.'+userId);
        }
    };
    
    return { 
        users, 
        newUser,
        filter,
        fb,
        fetchUsers, 
        fetchUserById, 
        createUser, 
        updateUser, 
        deleteUser,
        usersImport,
        importExport,
        resetNewUser,
        uploadUserImages,
        deleteUserImages,
    };
}); 