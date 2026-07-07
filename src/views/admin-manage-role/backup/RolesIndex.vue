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
  const filters = ref(new RoleFilter());
  const selectedRoles = ref([]);

  const isLoading = computed(() => {
    return fb.value.loading === true;
  });

  const fetchRoles = async () => {
    await Promise.all([
      roleStore.fetchRoles()
    ]);
  };

  const clearFilter = () => {
    filters.value = new RoleFilter();
  };

  const addRole = () => {
    router.push('/configuration/settings/add-role');
  };

  const editRole = (role) => {
    router.push(`/configuration/settings/edit-role/${role.role_id}`);
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
      paginator
      :rows="10"
      dataKey="role_id"
      selectionMode="multiple"
      :loading="isLoading"
    >
      <template #header>
        <div class="flex justify-between">
          <h3>Roles List</h3>
          <Button label="Add Role" @click="addRole" />
        </div>
      </template>
      <template #empty> No roles found. </template>
      <template #loading> Loading roles data. Please wait. </template>

      <Column selectionMode="multiple" headerStyle="width: 3rem" />

      <Column field="name" header="Name" style="min-width: 20rem">
        <template #body="{ data }">
          {{ data.display_name }}
        </template>
        <template #filter="{ filterModel }">
          <InputText v-model="filterModel.value" placeholder="Search by name" />
        </template>
      </Column>

      <Column header="Actions" :exportable="false" style="min-width: 5rem">
        <template #body="{ data }">
          <div class="flex gap-2">
            <Button 
              icon="pi pi-pencil" 
              rounded 
              outlined 
              severity="success" 
              @click="editRole(data)"
            />
            <Button 
              icon="pi pi-trash" 
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