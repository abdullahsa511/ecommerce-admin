<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import UserFilter from '@/filters/UserFilter';
import InputText from 'primevue/inputtext';
import MultiSelect from 'primevue/multiselect';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Avatar from 'primevue/avatar';
import Dropdown from 'primevue/dropdown';

const router = useRouter();
const userStore = useUserStore();

const filters = ref(new UserFilter());

const selectedUsers = ref([]);
const userNames = computed(() => userStore.users.map(user => user.username));

const { users, fb } = storeToRefs(userStore);

const serverUrl = import.meta.env.VITE_API_BASE_URL; 
const usersWithFullAvatar = computed(() =>
  users.value.map(user => ({
    ...user,
    avatar: user.avatar && !user.avatar.startsWith('http')
      ? serverUrl + user.avatar
      : user.avatar
  }))
);

const isLoading = computed(() => {
    return fb?.value?.loading === true;
});


const roleOptions = [
    { label: 'Administrator', value: 'administrator' },
    { label: 'Editor', value: 'editor' },
    { label: 'Author', value: 'author' }
];

const statusOptions = [
    { label: 'Active', value: 1 },
    { label: 'Inactive', value: 0 },
    { label: 'Pending', value: 2 },
    { label: 'Suspended', value: 3 }
];

const fetchUsers = async () => {
    await userStore.fetchUsers();
};

const addUser = () => {
    router.push('/user/add-user');
};

const editUser = (data) => {
    router.push(`/users/edit-user/${data.user_id}`);
};

const deleteUser = async (data) => {
    await userStore.deleteUser(data.user_id);
};

const deleteSelectedUsers = async () => {
    if (selectedUsers.value.length > 0) {
        for (const user of selectedUsers.value) {
            await userStore.deleteUser(user.user_id);
        }
        selectedUsers.value = [];
    }
};

onMounted(() => {
    fetchUsers();
});

const clearFilter = () => {
    initFilters()
}

const initFilters = () => {
    filters.value = new UserFilter();
}
</script>

<template>
    <div class="user-index">
        <div class="mb-4 flex justify-end">
            <Button 
                icon="pi pi-plus" 
                label="Add User" 
                severity="primary" 
                @click="addUser"
            />
        </div>

        <DataTable
            v-model:filters="filters"
            v-model:selection="selectedUsers"
            :value="usersWithFullAvatar"
            paginator
            :rows="10"
            dataKey="user_id"
            filterDisplay="menu"
            :loading="isLoading"
            :globalFilterFields="['username', 'display_name', 'email', 'userRole', 'status']"
            selectionMode="multiple"
            class="th-table"
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
                        :image="data.avatar" 
                        :label="!data.avatar ? data.first_name?.charAt(0) + data.last_name?.charAt(0) : null"
                        shape="circle" 
                        size="large" 
                    />
                </template>
            </Column>
            
            <Column header="Username" filterField="username" :showFilterMatchModes="false" :filterMenuStyle="{ width: '14rem' }" style="min-width: 12rem">
                <template #body="{ data }">
                    <a 
                        @click="editUser(data)" 
                        class="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline"
                    >
                        {{ data.username }}
                    </a>
                </template>
                <template #filter="{ filterModel }">
                    <MultiSelect v-model="filterModel.value" :options="userNames" placeholder="Any">
                        <template #option="slotProps">
                            <div class="flex items-center gap-2">
                                <span>{{ slotProps.option }}</span>
                            </div>
                        </template>
                    </MultiSelect>
                </template>
            </Column>

            <!-- Display Name Column -->
            <Column header="Display Name" field="display_name" :showFilterMatchModes="false" style="min-width: 150px">
                <template #body="{ data }">
                    <span>{{ data.display_name }}</span>
                </template>
            </Column>

            <!-- First Name Column -->
            <Column header="First Name" field="first_name" :showFilterMatchModes="false" style="min-width: 120px">
                <template #body="{ data }">
                    <span>{{ data.first_name }}</span>
                </template>
            </Column>

            <!-- Last Name Column -->
            <Column header="Last Name" field="last_name" :showFilterMatchModes="false" style="min-width: 120px">
                <template #body="{ data }">
                    <span>{{ data.last_name }}</span>
                </template>
            </Column>

            <Column field="email" header="Email" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.email }}
                </template>
            </Column>

            <Column field="userRole" header="Role" style="min-width: 12rem">
                <template #body="{ data }">
                    <span v-if="Array.isArray(data.userRole) && data.userRole.length > 0" :class="[
                        'px-3 py-1 text-sm font-medium rounded-lg',
                        data.userRole[0].name?.toLowerCase() === 'admin' ? 'bg-green-700 text-white' : 
                        data.userRole[0].name?.toLowerCase() === 'editor' ? 'bg-yellow-700 text-white' : 
                        data.userRole[0].name?.toLowerCase() === 'moderator' ? 'bg-blue-700 text-white' : 'bg-gray-700 text-white'
                    ]" style="display: inline-block;">
                        {{ data.userRole[0].name || 'Unknown Role' }}
                    </span>
                    <span v-else class="px-3 py-1 text-sm font-medium rounded-lg bg-gray-500 text-white" style="display: inline-block;">
                        No Role
                    </span>
                </template>
                <template #filter="{ filterModel }">
                    <Dropdown
                        v-model="filterModel.value"
                        :options="roleOptions"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Select Role"
                        class="p-2"
                    />
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
                <template #filter="{ filterModel }">
                    <Dropdown
                        v-model="filterModel.value"
                        :options="statusOptions"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Select Status"
                        class="p-2"
                    />
                </template>
            </Column>
            
            <Column header="Actions" :exportable="false" style="min-width: 8rem">
                <template #body="{ data }">
                    <div class="flex gap-2">
                        <Button 
                            icon="pi pi-pencil" 
                            rounded 
                            outlined 
                            severity="success" 
                            class="mr-2 p-button-secondary"
                            @click="editUser(data)"
                        />
                        <Button 
                            icon="pi pi-trash" 
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
.user-index {
    padding: 2rem;
}

.p-datatable .p-datatable-thead > tr > th {
    background-color: var(--surface-100);
}

.p-datatable .p-datatable-tbody > tr > td {
    padding: 1rem;
}
</style> 