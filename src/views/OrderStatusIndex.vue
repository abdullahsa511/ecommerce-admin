<script setup>
import { ref, onMounted, computed } from 'vue';
import { useOrderStatusStore } from '../stores/orderStatus';
import { storeToRefs } from 'pinia';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import MultiSelect from 'primevue/multiselect';
import { useRouter } from 'vue-router';

const router = useRouter();

const orderStatusStore = useOrderStatusStore();
const { orderStatuses, fb } = storeToRefs(orderStatusStore);
const selectedOrderStatuses = ref([]);

const loading = computed(() => {
  return fb.value.loading === true;
});

const filters = ref({
  global: { value: null, matchMode: 'contains' },
  name: { value: null, matchMode: 'contains' }
});

const orderStatusNames = computed(() => {
  return orderStatuses.value.map(status => status.name);
});

onMounted(() => {
  orderStatusStore.fetchOrderStatuses();
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

const deleteSelectedOrderStatuses = () => {
  if (selectedOrderStatuses.value && selectedOrderStatuses.value.length > 0) {
    // Implement delete functionality for selected items
    console.log('Delete selected order statuses:', selectedOrderStatuses.value);
  }
};

const editOrderStatus = (orderStatus) => {
  router.push(`/configuration/settings/edit-order-statuses/${orderStatus.order_status_id}`);
};

const deleteOrderStatus = (orderStatus) => {
  orderStatusStore.deleteOrderStatus(orderStatus.order_status_id);
};

const addOrderStatus = () => {
  router.push('/configuration/settings/add-order-statuses');
};
</script>

<template>
  <div>
    <div class="flex justify-end gap-2 mb-6">
      <Button
        icon="pi pi-plus"
        label="Add Order Status"
        severity="primary"
        @click="addOrderStatus"
        class="p-button-md"
      />
    </div>
    <DataTable
      v-model:filters="filters"
      v-model:selection="selectedOrderStatuses"
      :value="orderStatuses"
      paginator
      :rows="10"
      dataKey="order_status_id"
      filterDisplay="menu"
      :loading="fb.loading.orderStatus"
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
              v-if="selectedOrderStatuses && selectedOrderStatuses.length > 0"
              type="button"
              icon="pi pi-trash"
              label="Delete Selected"
              severity="danger"
              @click="deleteSelectedOrderStatuses"
            />
          </div>
          <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
        </div>
      </template>
      <template #empty> No order statuses found. </template>
      <template #loading> Loading order statuses data. Please wait. </template>

      <Column selectionMode="multiple" headerStyle="width: 3rem" />
      
      <Column header="Name" filterField="name" :showFilterMatchModes="false" :filterMenuStyle="{ width: '14rem' }" style="min-width: 36rem">
        <template #body="{ data }">
          <a 
            @click="editOrderStatus(data)" 
            class="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline"
          >
            {{ data.name }}
          </a>
        </template>
        <template #filter="{ filterModel }">
          <MultiSelect v-model="filterModel.value" :options="orderStatusNames" placeholder="Any">
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
              @click="editOrderStatus(data)"
            />
            <Button 
              icon="pi pi-trash" 
              rounded 
              outlined 
              severity="danger"
              @click="deleteOrderStatus(data)"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template> 