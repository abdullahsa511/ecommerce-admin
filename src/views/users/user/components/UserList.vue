<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import UserFilter from '@/filters/UserFilter';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Avatar from 'primevue/avatar';
import { useToast } from 'primevue/usetoast';
import { mediaUrl } from '@/utils/mediaUrl';

const toast = useToast();
const router = useRouter();
const userStore = useUserStore();
const filters = ref({ ...new UserFilter() });
const selectedUsers = ref([]);
const { users, fb } = storeToRefs(userStore);
const fetchUsers = async () => {
    await userStore.fetchUsers();
};

const editUser = (data: any) => {
    router.push(`/users/edit/${data.user_id}`);
};

const deleteUser = async (data: any) => {
    try {
        await userStore.deleteUser(data.user_id);
        toast.add({ severity: 'success', summary: 'Success', detail: 'User deleted successfully', life: 3000 });
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete user.', life: 3000 });
    }
};

const deleteSelectedUsers = async () => {
    if (selectedUsers.value.length > 0) {
        for (const user of selectedUsers.value) {
            try {
                await userStore.deleteUser((user as any).user_id as number);
                toast.add({ severity: 'success', summary: 'Success', detail: 'User deleted successfully', life: 3000 });
            } catch (error) {
                toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete user.', life: 3000 });
            }
        }
        selectedUsers.value = [];
    }
};

onMounted(() => {
    fetchUsers();
    // console.log('users.value', users.value);
});

const clearFilter = () => {
    filters.value = {...new UserFilter()};
}
</script>

<template>
    <div class="user-index">
        <DataTable
            v-model:selection="selectedUsers"
            :value="users"
            paginator
            :rows="10"
            dataKey="user_id"
            filterDisplay="menu"
            :loading="fb.loading['user.list']"
            :globalFilterFields="['username', 'display_name', 'email', 'userRole', 'status']"
            selectionMode="multiple"
            class="th-table table-border"
        >
            <template #header>
                <div class="flex justify-between items-center">
                    <div class="flex gap-2">
                        <Button
                            type="button"
                            icon="pi pi-filter-slash"
                            label="Clear"
                            outlined
                            @click="clearFilter()"
                        />
                        <Button
                            v-if="selectedUsers.length > 0"
                            type="button"
                            icon="pi pi-trash"
                            label="Delete Selected"
                            severity="danger"
                            @click="deleteSelectedUsers"
                        />
                    </div>
                    <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                </div>
            </template>
            <template #empty> No users found. </template>
            <template #loading> Loading users data. Please wait. </template>

            <Column selectionMode="multiple" headerStyle="width: 3rem" />

            <Column header="Avatar" style="width: 100px">
                <template #body="{ data }">
                    <Avatar
                        :image="mediaUrl(Array.isArray(data.avatar) ? (data.avatar[0]?.objectURL || data.avatar[0]?.image || '/media/users/default-avatar.png') : (data.avatar || '/media/users/default-avatar.png'))"
                        :label="!(Array.isArray(data.avatar) ? (data.avatar[0]?.objectURL || data.avatar[0]?.image) : data.avatar) ? ((data.first_name || data.display_name || data.username || '')[0]?.toUpperCase() || null) : null"
                        shape="circle"
                        size="large"
                    />
                </template>
            </Column>
            
            <Column header="Username" filterField="username" :showFilterMatchModes="false" :filterMenuStyle="{ width: '14rem' }" style="min-width: 12rem" sortable>
                <template #body="{ data }">
                    <a 
                        @click="editUser(data)" 
                        class="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline"
                    >
                        {{ data.username }}
                    </a>
                </template>
            </Column>

            <!-- Display Name Column -->
            <Column header="Display Name" field="display_name" :showFilterMatchModes="false" style="min-width: 150px" sortable>
                <template #body="{ data }">
                    <span>{{ data.display_name }}</span>
                </template>
            </Column>

            <!-- First Name Column -->
            <Column header="First Name" field="first_name" :showFilterMatchModes="false" style="min-width: 120px" sortable>
                <template #body="{ data }">
                    <span>{{ data.first_name }}</span>
                </template>
            </Column>

            <!-- Last Name Column -->
            <Column header="Last Name" field="last_name" :showFilterMatchModes="false" style="min-width: 120px" sortable>
                <template #body="{ data }">
                    <span>{{ data.last_name }}</span>
                </template>
            </Column>

            <Column field="email" header="Email" style="min-width: 12rem" sortable>
                <template #body="{ data }">
                    {{ data.email }}
                </template>
            </Column>

            <Column field="status" header="Status" style="min-width: 12rem">
                <template #body="{ data }">
                    <span :class="[
                        'px-3 py-1 text-sm font-medium rounded-lg',
                        data.status === 1 ? 'bg-green-700 text-white' : 
                        data.status === 0 ? 'bg-red-700 text-white' :
                        data.status === 2 ? 'bg-yellow-700 text-white' :
                        data.status === 3 ? 'bg-gray-700 text-white' : 'bg-gray-500 text-white'
                    ]" style="display: inline-block;">
                        {{ data.status === 1 ? 'Active' : 
                           data.status === 0 ? 'Inactive' :
                           data.status === 2 ? 'Pending' :
                           data.status === 3 ? 'Suspended' : 'Unknown' }}
                    </span>
                </template>
            </Column>
            
            <Column header="Actions" :exportable="false" style="min-width: 8rem">
                <template #body="{ data }">
                    <div class="flex gap-2">
                        <Button 
                            :icon="fb.loading['user.update.'+data.user_id] ? 'pi pi-spinner pi-spin' : 'pi pi-pencil'"
                            :disabled="fb.loading['user.update.'+data.user_id]"
                            rounded 
                            outlined 
                            severity="success" 
                            class="mr-2 p-button-secondary"
                            @click="editUser(data)"
                        />
                        <Button 
                            :icon="fb.loading['user.delete.'+data.user_id] ? 'pi pi-spinner pi-spin' : 'pi pi-trash'"
                            :disabled="fb.loading['user.delete.'+data.user_id]"
                            rounded 
                            outlined 
                            severity="danger"
                            class="p-button-danger"
                            @click="deleteUser(data)"
                        />
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>


<style scoped>
.p-datatable .p-datatable-thead > tr > th {
    background-color: var(--surface-100);
}

.p-datatable .p-datatable-tbody > tr > td {
    padding: 1rem;
}
</style> 