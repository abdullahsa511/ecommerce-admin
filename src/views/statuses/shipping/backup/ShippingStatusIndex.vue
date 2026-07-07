<script setup>
import { ref, onMounted, computed } from 'vue';
import { useShippingStatusStore } from '../stores/shippingStatus';
import { storeToRefs } from 'pinia';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import MultiSelect from 'primevue/multiselect';
import { useRouter } from 'vue-router';

const router = useRouter();

const shippingStatusStore = useShippingStatusStore();
const { shippingStatuses, fb } = storeToRefs(shippingStatusStore);
const selectedShippingStatuses = ref([]);

const loading = computed(() => {
  return fb.value.loading === true;
});

const error = computed(() => {
  return fb.value.errors;
});

const filters = ref({
  global: { value: null, matchMode: 'contains' },
  name: { value: null, matchMode: 'contains' }
});

const shippingStatusNames = computed(() => {
  return shippingStatuses.value.map(status => status.name);
});

onMounted(() => {
  shippingStatusStore.fetchShippingStatuses();
});

const clearFilter = () => {
  filters.value = {
    global: { value: null, matchMode: 'contains' },
    name: { value: null, matchMode: 'contains' }
  };
};

const onRowSelect = (event) => {
  console.log('Row selected:', event.data);
};

const onRowUnselect = (event) => {
  console.log('Row unselected:', event.data);
};

const deleteSelectedShippingStatuses = () => {
  if (selectedShippingStatuses.value && selectedShippingStatuses.value.length > 0) {
    // Implement delete functionality for selected items
    console.log('Delete selected shipping statuses:', selectedShippingStatuses.value);
  }
};

const editShippingStatus = (shippingStatus) => {
  router.push(`/configuration/settings/edit-shipping-statuses/${shippingStatus.shipping_status_id}`);
};

const deleteShippingStatus = (shippingStatus) => {
  shippingStatusStore.deleteShippingStatus(shippingStatus.shipping_status_id);
};

const addShippingStatus = () => {
  router.push('/configuration/settings/add-shipping-statuses');
};
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-end gap-2 mb-6">
      <Button
        icon="pi pi-plus"
        label="Add Shipping Status"
        severity="primary"
        @click="addShippingStatus"
        class="p-button-md"
      />
    </div>

    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
    </div>

    <div v-else>
      <DataTable
        v-model:filters="filters"
        v-model:selection="selectedShippingStatuses"
        :value="shippingStatuses"
        paginator
        :rows="10"
        dataKey="shipping_status_id"
        filterDisplay="menu"
        :loading="fb.loading.shippingStatus"
        :globalFilterFields="['name']"
        selectionMode="multiple"
        @rowSelect="onRowSelect"
        @rowUnselect="onRowUnselect"
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
                v-if="selectedShippingStatuses && selectedShippingStatuses.length > 0"
                type="button"
                icon="pi pi-trash"
                label="Delete Selected"
                severity="danger"
                @click="deleteSelectedShippingStatuses"
              />
            </div>
            <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
          </div>
        </template>
        <template #empty> No shipping statuses found. </template>
        <template #loading> Loading shipping statuses data. Please wait. </template>

        <Column selectionMode="multiple" headerStyle="width: 3rem" />
        
        <Column header="Name" filterField="name" :showFilterMatchModes="false" :filterMenuStyle="{ width: '14rem' }" style="min-width: 36rem">
          <template #body="{ data }">
            <a 
              @click="editShippingStatus(data)" 
              class="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline"
            >
              {{ data.name }}
            </a>
          </template>
          <template #filter="{ filterModel }">
            <MultiSelect v-model="filterModel.value" :options="shippingStatusNames" placeholder="Any">
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
                icon="pi pi-pencil" 
                rounded 
                outlined 
                severity="success" 
                class="mr-2"
                @click="editShippingStatus(data)"
              />
              <Button 
                icon="pi pi-trash" 
                rounded 
                outlined 
                severity="danger"
                @click="deleteShippingStatus(data)"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template> 