<script setup>
import { ref, onMounted, computed } from 'vue';
import { useStockStatusStore } from '../stores/stockStatus';
import { storeToRefs } from 'pinia';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import MultiSelect from 'primevue/multiselect';
import { useRouter } from 'vue-router';

const router = useRouter();

const stockStatusStore = useStockStatusStore();
const { stockStatuses, fb} = storeToRefs(stockStatusStore);
const selectedStockStatuses = ref([]);
const filters = ref({
  global: { value: null, matchMode: 'contains' },
  name: { value: null, matchMode: 'contains' }
});

const stockStatusNames = computed(() => {
  return stockStatuses.value.map(status => status.name);
});

onMounted(() => {
  stockStatusStore.fetchStockStatuses();
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

const deleteSelectedStockStatuses = () => {
  if (selectedStockStatuses.value && selectedStockStatuses.value.length > 0) {
    // Implement delete functionality for selected items
    console.log('Delete selected stock statuses:', selectedStockStatuses.value);
  }
};

const editStockStatus = (stockStatus) => {
  // Implement edit functionality
  console.log('Edit stock status:', stockStatus);
  router.push(`/configuration/settings/edit-stock-statuses/${stockStatus.stock_status_id}`);
}

const deleteStockStatus = (stockStatus) => {
  // Implement delete functionality
    stockStatusStore.deleteStockStatus(stockStatus.stock_status_id);
};

const goToStockStatusAdd = () => {
  router.push('/configuration/settings/add-stock-statuses');
};
</script> 

<template>
    <div>
      <div class="flex justify-end gap-2 mb-6">
        <Button 
          icon="pi pi-plus" 
          label="Add Stock Status" 
          severity="primary" 
          @click="goToStockStatusAdd"
          class="p-button-md"
        />
      </div>
      <DataTable
        v-model:filters="filters"
        v-model:selection="selectedStockStatuses"
        :value="stockStatusStore.stockStatuses"
        paginator
        :rows="10"
        dataKey="stock_status_id"
        filterDisplay="menu"
        :loading="fb.loading.stockStatus"
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
                v-if="selectedStockStatuses && selectedStockStatuses.length > 0"
                type="button"
                icon="pi pi-trash"
                label="Delete Selected"
                severity="danger"
                @click="deleteSelectedStockStatuses"
              />
            </div>
            <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
          </div>
        </template>
        <template #empty> No stock statuses found. </template>
        <template #loading> Loading stock statuses data. Please wait. </template>
  
        <Column selectionMode="multiple" headerStyle="width: 3rem" />
        
        <Column header="Name" filterField="name" :showFilterMatchModes="false" :filterMenuStyle="{ width: '14rem' }" style="min-width: 36rem">
          <template #body="{ data }">
            <a 
              @click="editStockStatus(data)" 
              class="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline"
            >
              {{ data.name }}
            </a>
          </template>
          <template #filter="{ filterModel }">
            <MultiSelect v-model="filterModel.value" :options="stockStatusNames" placeholder="Any">
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
                @click="editStockStatus(data)"
              />
              <Button 
                icon="pi pi-trash" 
                rounded 
                outlined 
                severity="danger"
                @click="deleteStockStatus(data)"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </template>