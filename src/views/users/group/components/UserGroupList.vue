<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useUserGroupStore } from '@/stores/userGroup';
import { storeToRefs } from 'pinia';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import MultiSelect from 'primevue/multiselect';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const router = useRouter();

const userGroupStore = useUserGroupStore();
const { userGroups, fb } = storeToRefs(userGroupStore);
const selectedUserGroups = ref([]);

const filters = ref({
  global: { value: null, matchMode: 'contains' },
  name: { value: null, matchMode: 'contains' },
  status: { value: null, matchMode: 'contains' }
});

// const isLoading = computed(() => {
//   return fb.value.loading?.userGroup === true;
// });

const userGroupNames = computed(() => {
  return userGroups.value.map((group: any) => group.userGroupContent?.name).filter(Boolean);
});

const userGroupStatuses = computed(() => {
  return ['Active', 'Inactive'];
});

onMounted(async () => {
    userGroupStore.fetchUserGroups();
    // console.log("userGroups.value", userGroups.value)
});

const clearFilter = () => {
  filters.value = {
    global: { value: null, matchMode: 'contains' },
    name: { value: null, matchMode: 'contains' },
    status: { value: null, matchMode: 'contains' }
  };
};

const onRowSelect = (event: any) => {
  console.log('Row selected:', event.data);
};

const onRowUnselect = (event: any) => {
  console.log('Row unselected:', event.data);
};

const deleteSelectedUserGroups = () => {
  if (selectedUserGroups.value && selectedUserGroups.value.length > 0) {
    console.log('Delete selected user groups:', selectedUserGroups.value);
  }
};

const editUserGroup = (userGroup: any) => {
  router.push(`/users/groups/edit/${userGroup.user_group_id}`);
};

const deleteUserGroup = async (data: any) => {
  
  try {
    await userGroupStore.deleteUserGroup(data.user_group_id);
          toast.add({ severity: 'success', summary: 'Success', detail: 'Vendor deleted successfully', life: 3000 });
      } catch (error) {
          toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete vendor.', life: 3000 });
      }
};

const renderIcon = (icon: string, action: string, id: string) => {
  return fb.value.loading[`userGroup.${action}.${id}`] ? 'pi pi-spinner pi-spin' : icon;
};
</script>

<template>
  <div>
    <DataTable
      v-model:filters="filters"
      v-model:selection="selectedUserGroups"
      :value="userGroups"
      paginator
      :rows="10"
      dataKey="user_group_id"
      filterDisplay="menu"
      :loading="fb.loading['userGroup.list']"
      :globalFilterFields="['name', 'status']"
      selectionMode="multiple"
      @rowSelect="onRowSelect"
      @rowUnselect="onRowUnselect"
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
              v-if="selectedUserGroups && selectedUserGroups.length > 0"
              type="button"
              icon="pi pi-trash"
              label="Delete Selected"
              severity="danger"
              @click="deleteSelectedUserGroups"
            />
          </div>
          <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
        </div>
      </template>
      <template #empty> No user groups found. </template>
      <template #loading> Loading user groups data. Please wait. </template>

      <Column selectionMode="multiple" headerStyle="width: 3rem" />
      
      <Column header="Name" filterField="name" :showFilterMatchModes="false" :filterMenuStyle="{ width: '14rem' }" style="min-width: 20rem">
        <template #body="{ data }">
          <a 
            @click="editUserGroup(data)" 
            class="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline"
          >
            {{ data.userGroupContent?.name }}
          </a>
        </template>
        <template #filter="{ filterModel }">
          <MultiSelect v-model="filterModel.value" :options="userGroupNames" placeholder="Any">
            <template #option="slotProps">
              <div class="flex items-center gap-2">
                <span>{{ slotProps.option }}</span>
              </div>
            </template>
          </MultiSelect>
        </template>
      </Column>

      <Column header="Status" filterField="status" :showFilterMatchModes="false" :filterMenuStyle="{ width: '14rem' }" style="min-width: 12rem">
        <template #body="{ data }">
          <span :class="data.status === 1 ? 'text-green-600' : 'text-red-600'">
            {{ data.status === 1 ? 'Active' : 'Inactive' }}
          </span>
        </template>
        <template #filter="{ filterModel }">
          <MultiSelect v-model="filterModel.value" :options="userGroupStatuses" placeholder="Any">
            <template #option="slotProps">
              <div class="flex items-center gap-2">
                <span>{{ slotProps.option }}</span>
              </div>
            </template>
          </MultiSelect>
        </template>
      </Column>

      <Column header="Actions" :exportable="false" style="min-width: 8rem">
        <template #body="{ data }">
          <div class="flex gap-2">
            <Button 
              :icon="renderIcon('pi pi-pencil', 'edit', data.user_group_id)"
              rounded 
              outlined 
              severity="success" 
              class="mr-2"
              @click="editUserGroup(data)"
            />
            <Button 
              :icon="renderIcon('pi pi-trash', 'delete', data.user_group_id)"
              rounded 
              outlined 
              severity="danger"
              @click="deleteUserGroup(data)"
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