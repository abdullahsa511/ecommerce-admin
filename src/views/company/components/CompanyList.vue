<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useCompanyStore } from '@/stores/company';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useToast } from 'primevue/usetoast';

const router = useRouter();
const companyStore = useCompanyStore();
const { companies, fb } = storeToRefs(companyStore);
const filters = ref({ global: { value: null, matchMode: 'contains' } });
const isLoading = computed(() => fb?.value?.loading === true);
const toast = useToast();



const editCompany = (data: any) => {
  router.push(`/configuration/settings/companies/edit/${data.company_id}`);
};

const deleteCompany = async (data: any) => {
  try {
    await companyStore.deleteCompany(data.company_id);
    toast.add({ severity: 'success', summary: 'Success', detail: 'Company deleted successfully', life: 3000 });
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete company.', life: 3000 });
  }
};

const clearFilter = () => {
  filters.value = { global: { value: null, matchMode: 'contains' } };
};

const renderIcon = (icon: string, action: string, id: number) => {
  return fb.value.loading[`company.${action}.${id}`] ? 'pi pi-spinner pi-spin' : icon;
}

onMounted(() => {
  companyStore.fetchCompanies();
});
</script>

<template>
  <DataTable
    v-model:filters="filters"
    :value="companies"
    paginator
    :rows="10"
    dataKey="company_id"
    filterDisplay="menu"
    :loading="isLoading"
    :globalFilterFields="['company_name', 'company_code', 'company_prefix']"
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
    <template #empty> No companies found. </template>
    <template #loading> Loading companies data. Please wait. </template>
    <Column field="company_id" header="ID" style="min-width: 6rem" sortable/>
    <Column field="company_name" header="Company Name" style="min-width: 12rem" filterField="company_name" sortable>
      <template #body="{ data }">
        <a @click="editCompany(data)" class="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline">
          {{ data.company_name }}
        </a>
      </template>
      <!-- <template #filter="{ filterModel }">
        <InputText v-model="filterModel.value" placeholder="Search by name" />
      </template> -->
    </Column>
    <Column field="company_code" header="Code" style="min-width: 10rem" filterField="company_code" sortable>
      <template #body="{ data }">
        {{ data.company_code }}
      </template>
    </Column>
    <Column field="company_prefix" header="Prefix" style="min-width: 10rem" filterField="company_prefix" sortable>
      <template #body="{ data }">
        {{ data.company_prefix }}
      </template>
    </Column>
    <Column field="vendor_id" header="Vendor ID" style="min-width: 10rem" sortable>
      <template #body="{ data }">
        {{ data.vendor_id }}
      </template>
    </Column>
    <Column header="Actions" :exportable="false" style="min-width: 8rem">
      <template #body="{ data }">
        <div class="flex gap-2">
          <Button :icon="renderIcon('pi pi-pencil', 'edit', data.company_id)" rounded outlined severity="success" @click="editCompany(data)" />
          <Button :icon="renderIcon('pi pi-trash', 'delete', data.company_id)" rounded outlined severity="danger" @click="deleteCompany(data)" />
        </div>
      </template>
    </Column>
  </DataTable>
</template>

<style scoped>
.company-index {
  padding: 2rem;
}
.p-datatable .p-datatable-thead>tr>th {
  background-color: var(--surface-100);
}
.p-datatable .p-datatable-tbody>tr>td {
  padding: 1rem;
}
</style>


