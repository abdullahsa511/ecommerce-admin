<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAdminStore } from '@/stores/admin'; // Assuming you have an admin store
import AdminFilter from '@/filters/AdminFilter';
import InputText from 'primevue/inputtext';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
const adminStore = useAdminStore();
const { admins, fb } = storeToRefs(adminStore);
const filters = ref(new AdminFilter());
const router = useRouter();

const isLoading = computed(() => {
    return fb.value.loading === true;
});


const fetchAdmins = async () => {
  await adminStore.fetchAdmins();
};

const initFilters = () => {
    filters.value = new AdminFilter();
}
const clearFilter = () => {
  initFilters()
}

const addAdmin = () => {
  console.log('Add Admin clicked');
  // Logic to add a new admin
};

const editAdmin = (admin) => {
  router.push(`/configuration/settings/admin-edit/${admin.admin_id}`);
};

const deleteAdmin = async (admin) => {
  await adminStore.deleteAdmin(admin.admin_id);
};

onMounted(() => {
  fetchAdmins();
});
</script>

<template>
    <div>
      <DataTable
        v-model:filters="filters"
        :value="admins"
        paginator
        :rows="10"
        dataKey="admin_id"
        filterDisplay="menu"
        :loading="isLoading"
      >
        <template #header>
          <div class="flex justify-between">
            <Button
              type="button"
              icon="pi pi-filter-slash"
              label="Clear"
              outlined
              @click="clearFilter()"
            />
            <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
          </div>
        </template>
        <template #empty> No users found. </template>
        <template #loading> Loading users data. Please wait. </template>
  
        <Column field="avatar" header="Avatar" style="min-width: 8rem">
          <template #body="{ data }">
            <img :src="data.avatar" alt="Avatar" style="width: 50px; height: 50px; object-fit: cover;" />
          </template>
        </Column>
  
        <Column field="username" header="User" style="min-width: 12rem">
          <template #body="{ data }">
            {{ data.username }}
          </template>
          <template #filter="{ filterModel }">
            <InputText v-model="filterModel.value" placeholder="Search by username" />
          </template>
        </Column>
  
        <Column field="display_name" header="Display Name" style="min-width: 12rem">
          <template #body="{ data }">
            {{ data.display_name }}
          </template>
          <template #filter="{ filterModel }">
            <InputText v-model="filterModel.value" placeholder="Search by display name" />
          </template>
        </Column>
  
        <Column field="first_name" header="First Name" style="min-width: 12rem">
          <template #body="{ data }">
            {{ data.first_name }}
          </template>
          <template #filter="{ filterModel }">
            <InputText v-model="filterModel.value" placeholder="Search by first name" />
          </template>
        </Column>
  
        <Column field="last_name" header="Last Name" style="min-width: 12rem">
          <template #body="{ data }">
            {{ data.last_name }}
          </template>
          <template #filter="{ filterModel }">
            <InputText v-model="filterModel.value" placeholder="Search by last name" />
          </template>
        </Column>
  
        <Column field="email" header="Email" style="min-width: 12rem">
          <template #body="{ data }">
            {{ data.email }}
          </template>
          <template #filter="{ filterModel }">
            <InputText v-model="filterModel.value" placeholder="Search by email" />
          </template>
        </Column>
  
        <Column field="status" header="Status" style="min-width: 12rem">
          <template #body="{ data }">
            {{ data.status === 1 ? 'Active' : 'Inactive' }}
          </template>
          <template #filter="{ filterModel }">
            <InputText v-model="filterModel.value" placeholder="Search by status" />
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
                @click="editAdmin(data)"
              />
              <Button 
                icon="pi pi-trash" 
                rounded 
                outlined 
                severity="danger"
                @click="deleteAdmin(data)"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </template>