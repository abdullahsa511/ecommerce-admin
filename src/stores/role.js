import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import RoleService from '../service/RoleService';
import RoleFilter from '../filters/RoleFilter';
import Role from '../models/Role';
import FeedbackHandler from '../utils/FeedbackHandler';
import RoleImportResponse from '@/models/RoleImport';

export const useRoleStore = defineStore('role', () => {
    /**
     * @type {import('vue').Ref<Role[]>}
     */
    const roles = ref([]);
    const newRole = ref(new Role());
    const filter = ref(new RoleFilter());
    const importExport = ref(new RoleImportResponse());
    /**
     * @type {import('vue').Ref<FeedbackHandler>}
     */
    const fb = ref(new FeedbackHandler());
    const model = 'role';

    const resetNewRole = () => {
        newRole.value = new Role();
    };

    const fetchRoles = async () => {
        fb.value.clearError(model + '.list');
        fb.value.removeSuccess(model + '.list');
        fb.value.startLoading(model + '.list');
        try {
            const response = await RoleService.getRoles();
            roles.value = response.map(role => new Role(role));
            fb.value.showSuccess(model + '.list');
        } catch (err) {
            console.error(err);
            fb.value.setError(err, model + '.list');
        } finally {
            fb.value.finishLoading(model + '.list');
        }
    };

    const fetchRoleById = async (roleId) => {
        fb.value.clearError(model + '.edit.' + roleId);
        fb.value.removeSuccess(model + '.edit.' + roleId);
        fb.value.startLoading(model + '.edit.' + roleId);
        try {
            const role = await RoleService.getRoleById(roleId);
            newRole.value = new Role(role);
            fb.value.showSuccess(model + '.edit.' + roleId);
            return newRole.value;
        } catch (err) {
            fb.value.setError(err, model + '.edit.' + roleId);
        } finally {
            fb.value.finishLoading(model + '.edit.' + roleId);
        }
    };

    const createRole = async (newRole) => {
        fb.value.clearError(model + '.create');
        fb.value.removeSuccess(model + '.create');
        fb.value.startLoading(model + '.create');
        try {
            const createdRole = await RoleService.createRole(newRole);
            roles.value.push(createdRole);
            fb.value.showSuccess(model + '.create');
            return createdRole;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.create');
            return err;
        } finally {
            fb.value.finishLoading(model + '.create');
        }
    };

    const updateRole = async (roleId, updatedRole) => {
        fb.value.clearError(model + '.update.' + roleId);
        fb.value.removeSuccess(model + '.update.' + roleId);
        fb.value.startLoading(model + '.update.' + roleId);
        try {
            const role = await RoleService.updateRole(roleId, updatedRole);
            const index = roles.value.findIndex(r => r.role_id === roleId);
            if (index !== -1) {
                roles.value[index] = role;
            }
            fb.value.showSuccess(model + '.update.' + roleId);
            return role;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.update.' + roleId);
        } finally {
            fb.value.finishLoading(model + '.update.' + roleId);
        }
    };

    const deleteRole = async (roleId) => {
        fb.value.clearError(model + '.delete.' + roleId);
        fb.value.removeSuccess(model + '.delete.' + roleId);
        fb.value.startLoading(model + '.delete.' + roleId);
        try {
            await RoleService.deleteRole(roleId);
            roles.value = roles.value.filter(r => r.role_id !== roleId);
            fb.value.showSuccess(model + '.delete.' + roleId);
        } catch (err) {
            fb.value.setError(err, model + '.delete.' + roleId);
        } finally {
            fb.value.finishLoading(model + '.delete.' + roleId);
        }
    };

    const roleImport = async (formData) => {
        fb.value.clearError(model + '.import');
        fb.value.removeSuccess(model + '.import');
        fb.value.startLoading(model + '.import');
        try {
            if (!formData) {
                throw new Error('No file data provided to import roles');
            }
            const response = await RoleService.roleImport(formData);
            console.log('Store received response:', response);
            importExport.value = new RoleImportResponse(response);
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
        importExport.value = new RoleImportResponse();
    };

    return {
        resetNewRole,
        roles,
        newRole,
        filter,
        fb,
        fetchRoles,
        fetchRoleById,
        createRole,
        updateRole,
        deleteRole,
        roleImport,
        importExport,
        clearImportExport,
    };
}); 