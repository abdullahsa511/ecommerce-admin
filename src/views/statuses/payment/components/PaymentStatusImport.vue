<script setup lang="ts">
import { ref, computed } from 'vue';
import { useToast } from 'primevue/usetoast';
import { usePaymentStatusStore } from '@/stores/paymentStatus';
import { storeToRefs } from 'pinia';
import PaymentStatusImportResponse from '@/models/PaymentStatusImportResponse';

// Emits
const emit = defineEmits(['editTabUnmunted', 'editTabMounted', 'saved']);

// Store and Toast
const paymentStatusStore = usePaymentStatusStore();
const { importExport, fb } = storeToRefs(paymentStatusStore);
const toast = useToast();

// Local
const selectedFilePaymentStatuses = ref<File | null>(null);
const filters = ref({ global: { value: null, matchMode: 'contains' } });
const showPaymentStatusesResults = computed(() => {
  return (importExport.value.invalid_records > 0 
  || importExport.value.updated_records > 0 
  || importExport.value.valid_records > 0
);
});

// Handle file selection
const handleFileSelectPaymentStatuses = (event: any) => {
  const file = event.files[0];
  if (!file) return;

  if (!file.name.endsWith('.csv')) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Please select a CSV file',
      life: 3000,
    });
    return;
  }
  selectedFilePaymentStatuses.value = file;
};

// Handle attribute import
const handleSavePaymentStatuses = async () => {
  if (!selectedFilePaymentStatuses.value) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Please select a file first',
      life: 3000,
    });
    return;
  }

  try {
    const formData = new FormData();
    formData.append('csv_file', selectedFilePaymentStatuses.value);
    await paymentStatusStore.paymentStatusesImport(formData);
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Payment statuses imported successfully',
      life: 3000,
    });
    selectedFilePaymentStatuses.value = null;
    // emit('saved');
  } catch (error: any) {
    console.error('Save error:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.message || 'Failed to save file',
      life: 3000,
    });
  }
};

// Clear results
const clearResults = () => {
  importExport.value = new PaymentStatusImportResponse();
};
// Clear filters
const clearFilter = () => {
  filters.value = { global: { value: null, matchMode: 'contains' } };
};
</script>

<template>
  <!-- Payment Statuses Import Section -->
  <div class="bg-white rounded-lg p-6 shadow-md">
    <h2 class="text-xl font-semibold mb-2">Import Payment Statuses CSV data</h2>
    <p class="text-gray-600 mb-4">Upload a CSV file to start importing Payment statuses data</p>
    <div class="flex flex-col gap-4">
      <FileUpload
        mode="basic"
        name="importPaymentStatusesFile"
        accept=".csv"
        :maxFileSize="1000000"
        @select="handleFileSelectPaymentStatuses"
        :auto="false"
        chooseLabel="Select CSV File"
      />
      <div v-if="selectedFilePaymentStatuses" class="flex flex-col gap-4">
        <div class="flex items-center gap-2 p-3 bg-gray-50 rounded">
          <i class="pi pi-file text-gray-500"></i>
          <span class="text-gray-700">{{ selectedFilePaymentStatuses.name }}</span>
        </div>
        <div v-if="fb.loading['paymentStatus.import']" class="w-full">
          <ProgressBar mode="indeterminate" style="height: 8px" class="w-full" />
          <p class="text-sm text-gray-600 mt-2 text-center">Importing Payment statuses data...</p>
        </div>
        <Button
          icon="pi pi-save"
          :label="fb.loading['paymentStatus.import'] ? 'Saving...' : 'Import Payment Statuses'"
          severity="success"
          @click="handleSavePaymentStatuses"
          :loading="fb.loading['paymentStatus.import']"
          :disabled="fb.loading['paymentStatus.import']"
          class="p-button-md"
        />
      </div>
    </div>
  </div>

  <!-- Attributes Import Results Section -->
  <div v-if="showPaymentStatusesResults" class="bg-white rounded-lg p-6 shadow-md">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-semibold">Payment Statuses Import Results</h2>
      <Button icon="pi pi-times" label="Clear Results" severity="secondary" outlined @click="clearResults()"/>
    </div>

    <!-- Summary Statistics -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div class="text-2xl font-bold text-blue-600">{{ importExport.total_records || 0 }}</div>
        <div class="text-sm text-blue-800">Total Records</div>
      </div>
      <div class="bg-red-50 p-4 rounded-lg border border-red-200">
        <div class="text-2xl font-bold text-red-600">{{ importExport.invalid_records || 0 }}</div>
        <div class="text-sm text-red-800">Invalid Records</div>
      </div>
      <div class="bg-orange-50 p-4 rounded-lg border border-orange-200">
        <div class="text-2xl font-bold text-orange-600">{{ importExport.updated_records || 0 }}</div>
        <div class="text-sm text-orange-800">Records Updated</div>
      </div>
      <div class="bg-purple-50 p-4 rounded-lg border border-purple-200">
        <div class="text-2xl font-bold text-purple-600">{{ importExport.valid_records || 0 }}</div>
        <div class="text-sm text-purple-800">Records Inserted</div>
      </div>
    </div>

    <!-- Invalid Records DataTable -->
    <div v-if="importExport.invalid_records > 0 && importExport.invalid_data" class="mb-6">
      <h3 class="text-lg font-semibold mb-4 text-red-700">Invalid Records ({{ importExport.invalid_records }})</h3>
      <DataTable
        v-model:filters="filters"
        :value="importExport.invalid_data"
        paginator
        :rows="200"
        dataKey="row"
        filterDisplay="menu"
        :globalFilterFields="['data.name', 'data.language_id']"
        class="th-table"
      >
        <template #header>
          <div class="flex justify-between items-center">
            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
            <InputText v-model="filters['global'].value" placeholder="Search invalid payment statuses records..." />
          </div>
        </template>
        <template #empty>No invalid payment statuses records found.</template>
        <Column field="row" header="Row" style="min-width: 6rem">
          <template #body="{ data }">{{ data.row }}</template>
        </Column>
        <Column field="data.name" header="Name" style="min-width: 10rem">
          <template #body="{ data }">{{ data.data.name }}</template>
        </Column>
        <Column field="data.sort_order" header="Sort Order" style="min-width: 10rem">
          <template #body="{ data }">{{ data.data.sort_order }}</template>
        </Column>
        <Column field="data.language_code" header="Language Code" style="min-width: 10rem">
          <template #body="{ data }">{{ data.data.language_id }}</template>
        </Column>
        <Column field="errors" header="Errors" style="min-width: 15rem">
          <template #body="{ data }"><div class="text-red-600 text-sm">{{ data.errors }}</div></template>
        </Column>
      </DataTable>
    </div>

    <!-- Duplicated Records DataTable -->
    <div v-if="importExport.updated_records > 0 && importExport.updated_data" class="mb-6">
      <h3 class="text-lg font-semibold mb-4 text-orange-700">Records Updated ({{ importExport.updated_records }})</h3>
      <DataTable
        v-model:filters="filters"
        :value="importExport.updated_data"
        paginator
        :rows="200"
        dataKey="row"
        filterDisplay="menu"
        :globalFilterFields="['name']"
        class="th-table"
      >
        <template #header>
          <div class="flex justify-between items-center">
            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
            <InputText v-model="filters['global'].value" placeholder="Search updated attributes records..." />
          </div>
        </template>
        <template #empty>No updated payment statuses records found.</template>
        <Column field="payment_status_id" header="Id" style="min-width: 10rem">
          <template #body="{ data }">{{ data.payment_status_id }}</template>
        </Column>
        <Column field="data.name" header="Name" style="min-width: 10rem">
          <template #body="{ data }">{{ data.name }}</template>
        </Column>
        <Column field="data.language_code" header="Language Code" style="min-width: 10rem">
          <template #body="{ data }">{{ importExport.language_map[data.language_id] }}</template>
        </Column>
      </DataTable>
    </div>

    <!-- Valid Records DataTable -->
    <div v-if="importExport.valid_records > 0 && importExport.valid_data">
      <h3 class="text-lg font-semibold mb-4 text-green-700">Records Inserted ({{ importExport.valid_records }})</h3>
      <DataTable
        v-model:filters="filters"
        :value="importExport.valid_data"
        paginator
        :rows="200"
        dataKey="attribute_id"
        filterDisplay="menu"
        :globalFilterFields="['name', 'language_id']"
        class="th-table"
      >
        <template #header>
          <div class="flex justify-between items-center">
            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
            <InputText v-model="filters['global'].value" placeholder="Search valid payment statuses records..." />
          </div>
        </template>
        <template #empty>No valid payment statuses records found.</template>
        <Column field="name" header="Name" style="min-width: 15rem" />
        <Column field="data.language_code" header="Language Code" style="min-width: 10rem">
          <template #body="{ data }">{{ importExport.language_map[data.language_id] }}</template>
        </Column>
      </DataTable>
    </div>
  </div>
  <div v-if="fb.errors['paymentStatus.import']" class="text-red-600 text-sm pt-5">
    <div v-html="fb.renderErrors('paymentStatus.import')"></div>
  </div>
</template>

<style scoped>
.product-attribute-index {
  padding: 2rem;
}
.p-datatable .p-datatable-thead > tr > th {
  background-color: var(--surface-100);
}
.p-datatable .p-datatable-tbody > tr > td {
  padding: 1rem;
}
</style>
