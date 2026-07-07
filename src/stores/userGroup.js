import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import UserGroupService from '../service/UserGroupService';
import { UserGroupFilter } from '../filters/UserGroupFilter';
import UserGroup from '../models/UserGroup.ts';
import FeedbackHandler from '../utils/FeedbackHandler';
import ImportExport from '../models/ImportExport';

export const useUserGroupStore = defineStore('userGroup', () => {
    /**
     * @type {import('vue').Ref<UserGroup[]>}
     */
    const userGroups = ref([]);
    const userGroup = ref(new UserGroup());
    /**
     * @type {import('vue').Ref<ImportExport[]>}
     */
    const importExport = ref(new ImportExport());
    const filter = ref(new UserGroupFilter());
    
    /**
     * @type {import('vue').Ref<FeedbackHandler>}
     */
    const fb = ref(new FeedbackHandler());
    const model = 'userGroup';

    const resetUserGroup = () => {
        userGroup.value = new UserGroup();
    };

    const fetchUserGroups = async () => {
        fb.value.clearError(model + '.list');
        fb.value.removeSuccess(model + '.list');
        fb.value.startLoading(model + '.list');
        try {
            const response = await UserGroupService.getUserGroups();
            userGroups.value = response.map(userGroup => new UserGroup(userGroup));
            fb.value.showSuccess(model + '.list');
        } catch (err) {
            console.error(err);
            fb.value.setError(err, model + '.list');
        } finally {
            fb.value.finishLoading(model + '.list');
        }
    };

    const fetchUserGroupById = async (userGroupId) => {
        fb.value.clearError(model + '.edit.' + userGroupId);
        fb.value.removeSuccess(model + '.edit.' + userGroupId);
        fb.value.startLoading(model + '.edit.' + userGroupId);
        try {
            const response = await UserGroupService.getUserGroupById(userGroupId);
            userGroup.value = new UserGroup(response);
            fb.value.showSuccess(model + '.edit.' + userGroupId);
            return response;
        } catch (err) {
            fb.value.setError(err, model + '.edit.' + userGroupId);
        } finally {
            fb.value.finishLoading(model + '.edit.' + userGroupId);
        }
    };

    const createUserGroup = async (newUserGroup) => {
        fb.value.clearError(model + '.create');
        fb.value.removeSuccess(model + '.create');
        fb.value.startLoading(model + '.create');
        try {
            const createdUserGroup = await UserGroupService.createUserGroup(newUserGroup);
            userGroups.value.push(new UserGroup(createdUserGroup));
            fb.value.showSuccess(model + '.create');
            return createdUserGroup;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.create');
        } finally {
            fb.value.finishLoading(model + '.create');
        }
    };

    const updateUserGroup = async (userGroupId, updatedUserGroup) => {
        fb.value.clearError(model + '.update.' + userGroupId);
        fb.value.removeSuccess(model + '.update.' + userGroupId);
        fb.value.startLoading(model + '.update.' + userGroupId);
        try {
            const userGroup = await UserGroupService.updateUserGroup(userGroupId, updatedUserGroup);
            const index = userGroups.value.findIndex(u => u.user_group_id === userGroupId);
            if (index !== -1) {
                userGroups.value[index] = new UserGroup(userGroup);
            }
            fb.value.showSuccess(model + '.update.' + userGroupId);
            return userGroup;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.update.' + userGroupId);
        } finally {
            fb.value.finishLoading(model + '.update.' + userGroupId);
        }
    };

    const deleteUserGroup = async (userGroupId) => {
        fb.value.clearError(model + '.delete.' + userGroupId);
        fb.value.removeSuccess(model + '.delete.' + userGroupId);
        fb.value.startLoading(model + '.delete.' + userGroupId);
        try {
            await UserGroupService.deleteUserGroup(userGroupId);
            userGroups.value = userGroups.value.filter(u => u.user_group_id !== userGroupId);
            fb.value.showSuccess(model + '.delete.' + userGroupId);
        } catch (err) {
            fb.value.setError(err, model + '.delete.' + userGroupId);
        } finally {
            fb.value.finishLoading(model + '.delete.' + userGroupId);
        }
    };

    // import users
    const userGroupsImport = async (newImport) => {
        fb.value.clearError(model + '.import');
        fb.value.removeSuccess(model + '.import');
        fb.value.startLoading(model + '.import');
        try {
            if (!newImport) {
                throw new Error('No file data provided');
            }

            const response = await UserGroupService.userGroupsImport(newImport);
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

    return { 
        userGroups, 
        userGroup,
        importExport,
        filter,
        fb,
        fetchUserGroups, 
        fetchUserGroupById, 
        createUserGroup, 
        updateUserGroup, 
        deleteUserGroup,
        userGroupsImport,
        resetUserGroup
    };
}); 