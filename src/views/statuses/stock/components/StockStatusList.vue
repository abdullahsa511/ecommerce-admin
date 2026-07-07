<script setup>
import { ref, onMounted, computed } from 'vue';
import { useStockStatusStore } from '@/stores/stockStatus';
import { storeToRefs } from 'pinia';
import MultiSelect from 'primevue/multiselect';
import { useRouter } from 'vue-router';

const router = useRouter();

const stockStatusStore = useStockStatusStore();
const { stockStatuses, fb} = storeToRefs(stockStatusStore);
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

const editStockStatus = (status) => {
  // Implement edit functionality
  router.push(`/configuration/settings/stock-statuses/edit/${status?.stock_status_id}`);
}

const deleteStockStatus = (status) => {
  // Implement delete functionality
    stockStatusStore.deleteStockStatus(status.stock_status_id);
};

</script> 

<template>
    <div>
      <DataTable
        v-model:filters="filters"
        :value="stockStatusStore.stockStatuses"
        paginator
        :rows="10"
        dataKey="stock_status_id"
        filterDisplay="menu"
        :loading="fb.loading['stockStatus.list']"
        :globalFilterFields="['name']"
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
            </div>
            <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
          </div>
        </template>
        <template #empty> No stock statuses found. </template>
        <template #loading> Loading stock statuses data. Please wait. </template>
          
        <Column header="Name" sortable filterField="name" :showFilterMatchModes="false" :filterMenuStyle="{ width: '14rem' }" style="min-width: 36rem">
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
                :icon="fb.loading['stockStatus.edit.' + data.stock_status_id] ? 'pi pi-spinner pi-spin' : 'pi pi-pencil'"
                :disabled="fb.loading['stockStatus.edit.' + data.stock_status_id]"
                rounded 
                outlined 
                severity="success" 
                class="mr-2"
                @click="editStockStatus(data)"
              />
              <Button 
                :icon="fb.loading['stockStatus.delete.' + data.stock_status_id] ? 'pi pi-spinner pi-spin' : 'pi pi-trash'"
                :disabled="fb.loading['stockStatus.delete.' + data.stock_status_id]"
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