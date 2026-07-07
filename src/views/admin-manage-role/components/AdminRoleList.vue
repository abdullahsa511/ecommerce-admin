<script setup>
  import { ref, onMounted, computed } from 'vue';
  import { useRoleStore } from '@/stores/role'; // Assuming you have a role store
  import RoleFilter from '@/filters/RoleFilter';
  import InputText from 'primevue/inputtext';
  import { useRouter } from 'vue-router';
  import { useToast } from 'primevue/usetoast';
  import { storeToRefs } from 'pinia';

  const toast = useToast();
  const router = useRouter();
  const roleStore = useRoleStore();
  const { roles, fb } = storeToRefs(roleStore);

  const filters = ref({
    global: { value: null, matchMode: 'contains' },
    'name': { value: null, matchMode: 'contains' },
    'display_name': { value: null, matchMode: 'contains' },
  });
  const selectedRoles = ref([]);

  const fetchRoles = async () => {
    await Promise.all([
      roleStore.fetchRoles()
    ]);
  };

  const clearFilter = () => {
    filters.value = {
      global: { value: null, matchMode: 'contains' },
      'name': { value: null, matchMode: 'contains' },
      'display_name': { value: null, matchMode: 'contains' },
    };
  };

  const addRole = () => {
    router.push('/configuration/settings/manage-roles/add');
  };

  const editRole = (role) => {
    router.push(`/configuration/settings/manage-roles/edit/${role.role_id}`);
  };

  const deleteRole = async (role) => {
    try {
      await roleStore.deleteRole(role.role_id);
      toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Role deleted successfully',
          life: 3000
      });
      await roleStore.fetchRoles();
  } catch (error) {
      toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete role',
          life: 3000
      });
  }
  };

  onMounted(() => {
    fetchRoles();
  });
  </script>

<template>
  <div>
    <DataTable
      v-model:filters="filters"
      v-model:selection="selectedRoles"
      :value="roles"
      filterDisplay="menu"
      :global-filter-fields="['name', 'display_name']"
      paginator
      :rows="10"
      dataKey="role_id"
      selectionMode="multiple"
      :loading="fb.loading['role.list']"
    >
      <template #header>
        <div class="flex justify-between items-center">
          <div class="flex gap-2">
            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
          </div>
          <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
        </div>
      </template>
      <template #empty> No roles found. </template>
      <template #loading> Loading roles data. Please wait. </template>

      <Column field="name" header="Name" style="min-width: 20rem">
        <template #body="{ data }">
          <a @click="editRole(data)" class="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline">
            {{ data.name }}
          </a>
        </template>
        <template #filter="{ filterModel }">
          <InputText v-model="filterModel.value" placeholder="Search by name" />
        </template>
      </Column>
      <Column field="display_name" header="Display Name" style="min-width: 20rem">
        <template #body="{ data }">
          {{ data.display_name }}
        </template>
      </Column>

      <Column header="Actions" :exportable="false" style="min-width: 5rem">
        <template #body="{ data }">
          <div class="flex gap-2">
            <Button 
              icon="pi pi-pencil" 
              :disabled="fb.loading['role.edit.' + data.role_id]"
              :loading="fb.loading['role.edit.' + data.role_id]"
              :icon="fb.loading['role.edit.' + data.role_id] ? 'pi pi-spinner pi-spin' : 'pi pi-pencil'"
              rounded 
              outlined 
              severity="success" 
              @click="editRole(data)"
            />
            <Button 
              icon="pi pi-trash" 
              :disabled="fb.loading['role.delete.' + data.role_id]"
              :loading="fb.loading['role.delete.' + data.role_id]"
              :icon="fb.loading['role.delete.' + data.role_id] ? 'pi pi-spinner pi-spin' : 'pi pi-trash'"
              rounded 
              outlined 
              severity="danger"
              @click="deleteRole(data)"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>