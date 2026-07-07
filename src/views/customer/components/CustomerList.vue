<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useCustomerStore } from '@/stores/customer';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useToast } from 'primevue/usetoast';

const router = useRouter();
const customerStore = useCustomerStore();
const { customers, fb } = storeToRefs(customerStore);
const filters = ref({ global: { value: null, matchMode: 'contains' } });
const isLoading = computed(() => fb?.value?.loading === true);
const toast = useToast();



const editCustomer = (data: any) => {
  router.push(`/configuration/settings/customers/edit/${data.customer_id}`);
};

const deleteCustomer = async (data: any) => {
  try {
    await customerStore.deleteCustomer(data.customer_id);
    toast.add({ severity: 'success', summary: 'Success', detail: 'Customer deleted successfully', life: 3000 });
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete customer.', life: 3000 });
  }
};

const clearFilter = () => {
  filters.value = { global: { value: null, matchMode: 'contains' } };
};

const renderIcon = (icon: string, action: string, id: number) => {
  return fb.value.loading[`customer.${action}.${id}`] ? 'pi pi-spinner pi-spin' : icon;
}

onMounted(() => {
  customerStore.fetchCustomers();
  console.log('customers:', customers);
});
</script>

<template>
  <DataTable
    v-model:filters="filters"
    :value="customers"
    paginator
    :rows="10"
    dataKey="customer_id"
    filterDisplay="menu"
    :loading="isLoading"
    :globalFilterFields="['name', 'email', 'phone']"
    class="th-table"
  >
    <template #header>
      <div class="flex justify-between items-center">
        <div class="flex gap-2">
          <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
        </div>
        <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
      </div>
    </template>
    <template #empty> No customers found. </template>
    <template #loading> Loading customers data. Please wait. </template>
    <Column field="customer_id" header="ID" style="min-width: 6rem" sortable/>
    <Column field="name" header="Name" style="min-width: 12rem" filterField="name" sortable>
      <template #body="{ data }">
        <a @click="editCustomer(data)" class="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline">
          {{ data.name }}
        </a>
      </template>
    </Column>
    <Column field="org_code" header="Org Code" style="min-width: 12rem" filterField="org_code" sortable>
      <template #body="{ data }">
        {{ data.org_code }}
      </template>
    </Column>
    <Column field="username" header="Username" style="min-width: 12rem" filterField="username" sortable>
      <template #body="{ data }">
        {{ data.username }}
      </template>
    </Column>
    <Column field="gmail_Id" header="Gmail ID" style="min-width: 12rem" filterField="gmail_Id" sortable>
      <template #body="{ data }">
        {{ data.gmail_Id }}
      </template>
    </Column>
    <Column field="phone" header="Phone" style="min-width: 12rem" filterField="phone" sortable>
      <template #body="{ data }">
        {{ data.phone }}
      </template>
    </Column>
    <Column field="address" header="Address" style="min-width: 15rem" sortable>
      <template #body="{ data }">
        {{ data.address }}
      </template>
    </Column>
    <Column header="Actions" :exportable="false" style="min-width: 8rem">
      <template #body="{ data }">
        <div class="flex gap-2">
          <Button :icon="renderIcon('pi pi-pencil', 'edit', data.customer_id)" rounded outlined severity="success" @click="editCustomer(data)" />
          <Button :icon="renderIcon('pi pi-trash', 'delete', data.customer_id)" rounded outlined severity="danger" @click="deleteCustomer(data)" />
        </div>
      </template>
    </Column>
  </DataTable>
</template>

<style scoped>
.customer-index {
  padding: 2rem;
}
.p-datatable .p-datatable-thead>tr>th {
  background-color: var(--surface-100);
}
.p-datatable .p-datatable-tbody>tr>td {
  padding: 1rem;
}
</style>

