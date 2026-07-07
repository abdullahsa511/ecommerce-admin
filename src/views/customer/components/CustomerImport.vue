<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useCustomerStore } from '@/stores/customer';
import { storeToRefs } from 'pinia';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useToast } from 'primevue/usetoast';

//===========================================================
// Define Props
//===========================================================

//===========================================================
// Declare Emits
//===========================================================
// const emit = defineEmits({});
const emit = defineEmits(['editTabUnmunted', 'editTabMounted', 'saved']);

// ===========================================================
// Define Local Variables
// ===========================================================
const customerStore = useCustomerStore();
const { fb } = storeToRefs(customerStore);

const filters = ref({ global: { value: null, matchMode: 'contains' } });
const toast = useToast();

// ===========================================================
// Customers Import related states
// ===========================================================
const selectedFileCustomers = ref<File | null>(null);
const isSavingCustomers = ref(false);
const customersImportResults = ref<any>(null);
const showCustomersResults = ref(false);

// ===========================================================
// Define Local Methods
// ===========================================================

// Handle file selection for customer import
const handleFileSelectCustomers = (event: any) => {
  const file = event.files[0];
  if (!file) return;

  if (!file.name.endsWith('.csv')) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Please select a CSV file',
      life: 3000
    });
    return;
  }

  selectedFileCustomers.value = file;
};

// Handle customer import (save action)
const handleSaveCustomers = async () => {
  if (!selectedFileCustomers.value) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Please select a file first',
      life: 3000
    });
    return;
  }

  isSavingCustomers.value = true;

  try {
    const formData = new FormData();
    formData.append('csv_file', selectedFileCustomers.value);

    const response = await customerStore.customersImport(formData);

    customersImportResults.value = {
      success: {
        total_records: response.total_records || 0,
        valid_records: response.valid_records || 0,
        invalid_records: response.invalid_records || 0,
        updated_records: response.updated_records || 0,
        inserted_count: response.inserted_count || 0,
        valid_data: response.valid_data || response.customer_contents?.valid_data,
        invalid_data: response.invalid_data || [],
        updated_data: response.updated_data || [],
        valid_customer_data: response.valid_customer_data || [],
      },
    };

    showCustomersResults.value = true;

    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Customers imported successfully',
      life: 3000
    });

    selectedFileCustomers.value = null;

    // Emit saved event for parent listener
    // emit('saved');
  } catch (error: any) {
    console.error('Save error:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.message || 'Failed to save file',
      life: 3000
    });
  } finally {
    isSavingCustomers.value = false;
  }
};

// Clear customer import results
const clearCustomersResults = () => {
  customersImportResults.value = null;
  showCustomersResults.value = false;
};

// Clear filters
const clearFilter = () => {
  filters.value = { global: { value: null, matchMode: 'contains' } };
};

// ===========================================================
// Lifecycle Hooks
// ===========================================================
onMounted(() => {
  // Any initialization logic here (if needed)
});
</script>


<template>
  <!-- Customers Import Section -->
  <div class="bg-white rounded-lg p-6 shadow-md">
    <h2 class="text-xl font-semibold mb-2">Import Customers CSV data</h2>
    <p class="text-gray-600 mb-4">Upload a CSV file to start importing customers data</p>
    <div class="flex flex-col gap-4">
      <FileUpload mode="basic" name="importCustomersFile" accept=".csv" :maxFileSize="1000000"
        @select="handleFileSelectCustomers" :auto="false" chooseLabel="Select CSV File" />
      <div v-if="selectedFileCustomers" class="flex flex-col gap-4">
        <div class="flex items-center gap-2 p-3 bg-gray-50 rounded">
          <i class="pi pi-file text-gray-500"></i>
          <span class="text-gray-700">{{ selectedFileCustomers.name }}</span>
        </div>
        <div v-if="isSavingCustomers" class="w-full">
          <ProgressBar mode="indeterminate" style="height: 8px" class="w-full" />
          <p class="text-sm text-gray-600 mt-2 text-center">Importing customers data...</p>
        </div>
        <Button icon="pi pi-save" :label="isSavingCustomers ? 'Saving...' : 'Import Customers'" severity="success"
          @click="handleSaveCustomers" :loading="isSavingCustomers" :disabled="isSavingCustomers"
          class="p-button-md" />
      </div>
    </div>
  </div>
  <!-- Customers Import Results Section -->
  <div v-if="showCustomersResults && customersImportResults" class="bg-white rounded-lg p-6 shadow-md">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-semibold">Customers Import Results</h2>
      <Button icon="pi pi-times" label="Clear Results" severity="secondary" outlined @click="clearCustomersResults" />
    </div>

    <!-- Summary Statistics -->
    <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
      <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div class="text-2xl font-bold text-blue-600">{{
          customersImportResults?.success?.total_records || 0
          }}</div>
        <div class="text-sm text-blue-800">Total Records</div>
      </div>
      <div class="bg-green-50 p-4 rounded-lg border border-green-200">
        <div class="text-2xl font-bold text-green-600">{{
          customersImportResults?.success?.valid_records || 0
          }}</div>
        <div class="text-sm text-green-800">Valid Records</div>
      </div>
      <div class="bg-red-50 p-4 rounded-lg border border-red-200">
        <div class="text-2xl font-bold text-red-600">{{
          customersImportResults?.success?.invalid_records || 0
          }}</div>
        <div class="text-sm text-red-800">Invalid Records</div>
      </div>
      <div class="bg-orange-50 p-4 rounded-lg border border-orange-200">
        <div class="text-2xl font-bold text-orange-600">{{
          customersImportResults?.success?.updated_records || 0
          }}</div>
        <div class="text-sm text-orange-800">Updated Records</div>
      </div>
      <div class="bg-purple-50 p-4 rounded-lg border border-purple-200">
        <div class="text-2xl font-bold text-purple-600">{{
          customersImportResults?.success?.inserted_count || 0
          }}</div>
        <div class="text-sm text-purple-800">Inserted Records</div>
      </div>
    </div>
    <!-- Invalid Records DataTable -->
    <div v-if="customersImportResults?.success?.invalid_records > 0 && customersImportResults?.success?.invalid_data"
      class="mb-6">
      <h3 class="text-lg font-semibold mb-4 text-red-700">Invalid Records ({{
        customersImportResults.success.invalid_records
        }})</h3>
      <DataTable v-model:filters="filters" :value="customersImportResults.success.invalid_data" paginator :rows="10"
        dataKey="row" filterDisplay="menu"
        :globalFilterFields="['data.org_code', 'data.name', 'data.phone']"
        class="th-table">
        <template #header>
          <div class="flex justify-between items-center">
            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
            <InputText v-model="filters['global'].value" placeholder="Search invalid customers records..." />
          </div>
        </template>
        <template #empty> No invalid customers records found. </template>
        <Column field="row" header="Row" style="min-width: 6rem">
          <template #body="{ data }">
            {{ data.row }}
          </template>
        </Column>
        <Column field="data.uuid" header="uuid" style="min-width: 10rem">
          <template #body="{ data }">
            {{ data.data.uuid }}
          </template>
        </Column>
        <Column field="data.name" header="Name" style="min-width: 10rem">
          <template #body="{ data }">
            {{ data.data.name }}
          </template>
        </Column>
        <Column field="data.org_code" header="Org Code" style="min-width: 10rem">
          <template #body="{ data }">
            {{ data.data.org_code }}
          </template>
        </Column>
        <Column field="errors" header="Errors" style="min-width: 15rem">
          <template #body="{ data }">
            <div class="text-red-600 text-sm">
              {{ data.errors }}
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Updated Records DataTable -->
    <div v-if="customersImportResults?.success?.updated_records > 0 && customersImportResults?.success?.updated_data">
      <h3 class="text-lg font-semibold mb-4 text-orange-700">Updated Records ({{
        customersImportResults.success.updated_records
        }})</h3>
      <DataTable v-model:filters="filters" :value="customersImportResults.success.updated_data" paginator :rows="10"
        dataKey="customer_id" filterDisplay="menu" :globalFilterFields="['name', 'email', 'phone']" class="th-table">
        <template #header>
          <div class="flex justify-between items-center">
            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
            <InputText v-model="filters['global'].value" placeholder="Search valid customer records..." />
          </div>
        </template>
        <template #empty>
          No valid customer records found.
        </template>
        <Column field="uuid" header="Customer ID" style="min-width: 8rem" />
        <Column field="name" header="Name" style="min-width: 15rem" />
        <Column field="org_code" header="Org Code" style="min-width: 15rem" />
        <Column field="user_id" header="User ID" style="min-width: 12rem" />
        <Column field="organisation_id" header="Organisation ID" style="min-width: 12rem" />
      </DataTable>
    </div>

    <!-- Valid Records DataTable -->
    <div v-if="customersImportResults?.success?.valid_records > 0 && customersImportResults?.success?.valid_data">
      <h3 class="text-lg font-semibold mb-4 text-green-700">Valid Records ({{
        customersImportResults.success.valid_records
        }})</h3>
      <DataTable v-model:filters="filters" :value="customersImportResults.success.valid_data" paginator :rows="10"
        dataKey="customer_id" filterDisplay="menu" :globalFilterFields="['name', 'email', 'phone']" class="th-table">
        <template #header>
          <div class="flex justify-between items-center">
            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
            <InputText v-model="filters['global'].value" placeholder="Search valid customer records..." />
          </div>
        </template>
        <template #empty>
          No valid customer records found.
        </template>
        <Column field="uuid" header="Customer ID" style="min-width: 8rem" />
        <Column field="name" header="Name" style="min-width: 15rem" />
        <Column field="org_code" header="Org Code" style="min-width: 15rem" />
        <Column field="user_id" header="User ID" style="min-width: 12rem" />
        <Column field="organisation_id" header="Organisation ID" style="min-width: 12rem" />
      </DataTable>
    </div>
  </div>
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

