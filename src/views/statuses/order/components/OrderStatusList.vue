<script setup>
import { ref, onMounted, computed } from 'vue';
import { useOrderStatusStore } from '@/stores/orderStatus';
import { storeToRefs } from 'pinia';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import MultiSelect from 'primevue/multiselect';
import { useRouter } from 'vue-router';
import OrderStatusFilter from '@/filters/OrderStatusFilter';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const router = useRouter();


const orderStatusStore = useOrderStatusStore();
const { orderStatuses, fb } = storeToRefs(orderStatusStore);

const filters = ref({...new OrderStatusFilter()});

const orderStatusNames = computed(() => {
  return orderStatuses.value.map(status => status.name);
});



const clearFilter = () => {
  filters.value = {...new OrderStatusFilter()};
};

const editOrderStatus = (orderStatus) => {
  router.push(`/configuration/settings/order-statuses/edit/${orderStatus.order_status_id}`);
};

const deleteOrderStatus = async (data) => {
  // orderStatusStore.deleteOrderStatus(orderStatus.order_status_id);

  try {
    await orderStatusStore.deleteOrderStatus(data.order_status_id);
    toast.add({ severity: 'success', summary: 'Success', detail: 'Order status deleted successfully', life: 3000 });
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete order status.', life: 3000 });
  }
};


onMounted(() => {
  orderStatusStore.fetchOrderStatuses();
});
</script>

<template>
  <div>
    <DataTable
      v-model:filters="filters"
      :value="orderStatuses"
      paginator
      :rows="10"
      dataKey="order_status_id"
      filterDisplay="menu"
      :loading="fb.loading['orderStatus.list']"
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
      <template #empty> No order statuses found. </template>
      <template #loading> Loading order statuses data. Please wait. </template>

      
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
              :icon="fb.loading['orderStatus.edit.' + data.order_status_id] ? 'pi pi-spinner pi-spin' : 'pi pi-pencil'"
              :disabled="fb.loading['orderStatus.edit.' + data.order_status_id]"
              rounded 
              outlined 
              severity="success" 
              class="mr-2"
              @click="editOrderStatus(data)"
            />
            <Button 
              :icon="fb.loading['orderStatus.delete.' + data.order_status_id] ? 'pi pi-spinner pi-spin' : 'pi pi-trash'"
              :disabled="fb.loading['orderStatus.delete.' + data.order_status_id]"
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