<script setup>
import { ref, onMounted, computed } from 'vue';
import { usePaymentStatusStore } from '@/stores/paymentStatus';
import { storeToRefs } from 'pinia';
import MultiSelect from 'primevue/multiselect';
import { useRouter } from 'vue-router';

const router = useRouter();

const paymentStatusStore = usePaymentStatusStore();
const { paymentStatuses, fb } = storeToRefs(paymentStatusStore);
const filters = ref({
  global: { value: null, matchMode: 'contains' },
  name: { value: null, matchMode: 'contains' }
});

const paymentStatusNames = computed(() => {
  return paymentStatuses.value.map(status => status.name);
});

onMounted(() => {
  paymentStatusStore.fetchPaymentStatuses();
});

const clearFilter = () => {
  filters.value = {
    global: { value: null, matchMode: 'contains' },
    name: { value: null, matchMode: 'contains' }
  };
};

const editPaymentStatus = (status) => {
  // Implement edit functionality
  router.push(`/configuration/settings/payment-statuses/edit/${status?.payment_status_id}`);
}

const deletePaymentStatus = async (status) => {
  // Implement delete functionality
  // paymentStatusStore.deletePaymentStatus(status.payment_status_id);
  try {
    await paymentStatusStore.deletePaymentStatus(status.payment_status_id);
    toast.add({ severity: 'success', summary: 'Success', detail: 'Payment status deleted successfully', life: 3000 });
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete payment status.', life: 3000 });
  }



};

</script>
<template>
  <div>
    <DataTable v-model:filters="filters"
      :value="paymentStatusStore.paymentStatuses" paginator :rows="10" dataKey="stock_status_id" filterDisplay="menu"
      :loading="fb.loading['paymentStatus.list']" :globalFilterFields="['name']" class="th-table">
      <template #header>
        <div class="flex justify-between items-center">
          <div class="flex gap-2">
            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
          </div>
          <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
        </div>
      </template>
      <template #empty> No stock statuses found. </template>
      <template #loading> Loading stock statuses data. Please wait. </template>
      <Column header="Name" sortable filterField="name" :showFilterMatchModes="false"
        :filterMenuStyle="{ width: '14rem' }" style="min-width: 36rem">
        <template #body="{ data }">
          <a @click="editPaymentStatus(data)" class="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline">
            {{ data.name }}
          </a>
        </template>
        <template #filter="{ filterModel }">
          <MultiSelect v-model="filterModel.value" :options="paymentStatusNames" placeholder="Any">
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
            :icon="fb.loading['paymentStatus.edit.' + data.payment_status_id] ? 'pi pi-spinner pi-spin' : 'pi pi-pencil'"
            :disabled="fb.loading['paymentStatus.edit.' + data.payment_status_id]"
            rounded outlined severity="success" class="mr-2"
              @click="editPaymentStatus(data)" />
            <Button 
            :icon="fb.loading['paymentStatus.delete.' + data.payment_status_id] ? 'pi pi-spinner pi-spin' : 'pi pi-trash'"
            :disabled="fb.loading['paymentStatus.delete.' + data.payment_status_id]"
            rounded outlined severity="danger" @click="deletePaymentStatus(data)" />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>