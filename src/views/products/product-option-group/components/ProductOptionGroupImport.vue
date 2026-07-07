<script setup lang="ts">
import { ref, onMounted } from 'vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useToast } from 'primevue/usetoast';
import FileUpload from 'primevue/fileupload';
import ProgressBar from 'primevue/progressbar';
import { useProductOptionGroupStore } from '@/stores/productOptionGroup';

//===========================================================
// Define Props
//===========================================================
const props = defineProps({});

//===========================================================
// Declare Emits
//===========================================================
const emit = defineEmits(['editTabUnmunted']);

//===========================================================
// Define Local Variables
//===========================================================
const productOptionGroupStore = useProductOptionGroupStore();
const filters = ref({ global: { value: null, matchMode: 'contains' } });
const toast = useToast();
// Variants Import related states
const selectedFile = ref<File | null>(null);
const isSaving = ref(false);
const importResults = ref<any>(null);
const showResults = ref(false);

const normalizeNestedRecords = (records: any[] = []) =>
  records.map((entry) => {
    if (!entry || typeof entry !== 'object') {
      return entry;
    }

    const nestedSource =
      entry.data && typeof entry.data === 'object' ? entry.data : entry;

    return {
      ...entry,
      data: { ...nestedSource }
    };
  });

const getRecordField = (record: any, field: string) => {
  if (!record || typeof record !== 'object') {
    return undefined;
  }

  const nested = (record as Record<string, any>).data;
  if (nested && typeof nested === 'object' && field in nested) {
    return nested[field];
  }

  if (field in record) {
    return (record as Record<string, any>)[field];
  }

  return undefined;
};

const formatActiveStatus = (record: any) => {
  const status = getRecordField(record, 'active_status');

  if (typeof status === 'boolean') {
    return status ? 'Active' : 'Inactive';
  }

  if (typeof status === 'number') {
    return status === 1 ? 'Active' : 'Inactive';
  }

  if (typeof status === 'string') {
    const normalized = status.trim().toLowerCase();
    if (['active', '1', 'true', 'yes'].includes(normalized)) {
      return 'Active';
    }
    if (['inactive', '0', 'false', 'no'].includes(normalized)) {
      return 'Inactive';
    }
    return status;
  }

  return status ? 'Active' : 'Inactive';
};

//===========================================================
// Define Local Methods
//===========================================================
// Handle file selection for variant import
const handleFileSelect = (event: any) => {
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
  selectedFile.value = file;
};

// Handle variant import (save action)
const handleSave = async () => {
  if (!selectedFile.value) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Please select a file first',
      life: 3000
    });
    return;
  }
  isSaving.value = true;
  try {
    const formData = new FormData();
    formData.append('csv_file', selectedFile.value);
    const response = await productOptionGroupStore.importOptionGroups(formData);
    const invalidData = normalizeNestedRecords(response.invalid_data || []);
    const updatedData = normalizeNestedRecords(response.updated_data || []);
    const validData = normalizeNestedRecords(response.valid_data || []);
    const validVariantData = normalizeNestedRecords(response.valid_variant_data || []);

    importResults.value = {
      total_records: response.total_records || 0,
      valid_records: response.valid_records || 0,
      invalid_records: response.invalid_records || 0,
      updated_records: response.updated_records || 0,
      inserted_count: response.inserted_count || 0,
      valid_data: validData,
      invalid_data: invalidData,
      updated_data: updatedData,
      valid_variant_data: validVariantData,
    };
    showResults.value = true;
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Option groups imported successfully',
      life: 3000
    });
    selectedFile.value = null;
  } catch (error: any) {
    console.error('Save error for option groups:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.message || 'Failed to save file for option groups',
      life: 3000
    });
  } finally {
    isSaving.value = false;
  }
};

// Clear variant import results
const clearVariantsResults = () => {
  importResults.value = null;
  showResults.value = false;
};

// Clear filters
const clearFilter = () => {
  filters.value = { global: { value: null, matchMode: 'contains' } };
};

//===========================================================
// Lifecycle Hooks
//===========================================================
onMounted(() => {
  // Any initialization logic here (if needed)
});
</script>

<template>
  <div class="pt-6">
    <!-- Variants Import Section -->
    <div class="bg-white rounded-lg p-6 shadow-md">
      <h2 class="text-xl font-semibold mb-2">Import Option Groups CSV data</h2>
      <p class="text-gray-600 mb-4">Upload a CSV file to start importing option groups data</p>
      <div class="flex flex-col gap-4">
        <FileUpload mode="basic" name="importFile" accept=".csv" :maxFileSize="1000000"
          @select="handleFileSelect" :auto="false" chooseLabel="Select CSV File" />
        <div v-if="selectedFile" class="flex flex-col gap-4">
          <div class="flex items-center gap-2 p-3 bg-gray-50 rounded">
            <i class="pi pi-file text-gray-500"></i>
            <span class="text-gray-700">{{ selectedFile.name }}</span>
          </div>
          <div v-if="isSaving" class="w-full">
            <ProgressBar mode="indeterminate" style="height: 8px" class="w-full" />
            <p class="text-sm text-gray-600 mt-2 text-center">Importing option groups data...</p>
          </div>
          <Button icon="pi pi-save" :label="isSaving ? 'Saving...' : 'Import Option Groups'" severity="success"
            @click="handleSave" :loading="isSaving" :disabled="isSaving" class="p-button-md" />
        </div>
      </div>

      <!-- Variants Import Results Section -->
      <div v-if="showResults && importResults" class="bg-white rounded-lg p-6 shadow-md mt-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold">Option Groups Import Results</h2>
          <Button icon="pi pi-times" label="Clear Results" severity="secondary" outlined @click="clearVariantsResults" />
        </div>

        <!-- Summary Statistics -->
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div class="text-2xl font-bold text-blue-600">{{ importResults.total_records || 0 }}</div>
            <div class="text-sm text-blue-800">Total Records</div>
          </div>
          <div class="bg-green-50 p-4 rounded-lg border border-green-200">
            <div class="text-2xl font-bold text-green-600">{{ importResults.valid_records || 0 }}</div>
            <div class="text-sm text-green-800">Valid Records</div>
          </div>
          <div class="bg-red-50 p-4 rounded-lg border border-red-200">
            <div class="text-2xl font-bold text-red-600">{{ importResults.invalid_records || 0 }}</div>
            <div class="text-sm text-red-800">Invalid Records</div>
          </div>
          <div class="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <div class="text-2xl font-bold text-orange-600">{{ importResults.updated_records || 0 }}</div>
            <div class="text-sm text-orange-800">Updated Records</div>
          </div>
          <div class="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div class="text-2xl font-bold text-purple-600">{{ importResults.valid_records || 0 }}</div>
            <div class="text-sm text-purple-800">Inserted Records</div>
          </div>
        </div>

        <!-- Invalid Records DataTable -->
        <div v-if="importResults.invalid_records > 0 && importResults.invalid_data" class="mb-6">
          <h3 class="text-lg font-semibold mb-4 text-red-700">Invalid Records ({{ importResults.invalid_records
          }})</h3>
          <DataTable v-model:filters="filters" :value="importResults.invalid_data" paginator :rows="10"
            dataKey="row" filterDisplay="menu"
            :globalFilterFields="[
              'data.web_product_variant',
              'web_product_variant',
              'data.option_group',
              'option_group',
              'data.active_status',
              'active_status',
              'data.created_at',
              'created_at'
            ]" class="th-table">
            <template #header>
              <div class="flex justify-between items-center">
                <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                <InputText v-model="filters['global'].value" placeholder="Search invalid option groups records..." />
              </div>
            </template>
            <template #empty>No invalid option groups records found.</template>
            <Column field="row" header="Row" style="min-width: 6rem">
              <template #body="{ data }">
                {{ data.row }}
              </template>
            </Column>
            <Column field="errors" header="Errors" style="min-width: 15rem">
              <template #body="{ data }">
                {{ getRecordField(data, 'web_product_variant') }}
                <div class="text-red-600 text-sm">
                  {{ data.errors }}
                </div>
              </template>
            </Column>
            <Column field="data.option_group" header="Group Name" style="min-width: 15rem">
              <template #body="{ data }">
                {{ getRecordField(data, 'option_group') }}
              </template>
            </Column>
            <Column field="data.web_product_variant" header="Variant Name" style="min-width: 15rem">
              <template #body="{ data }">
                {{ data.data.web_product_variant }}
              </template>
            </Column>
            <Column field="data.web_product_code" header="Product Code" style="min-width: 15rem">
              <template #body="{ data }">
                {{ data.data.web_product_code }}
              </template>
            </Column>
            <Column field="data.web_product_variant" header="Variant Name" style="min-width: 15rem">
              <template #body="{ data }">
                {{ data.data.web_product_variant }}
              </template>
            </Column>
            <Column field="data.web_product_code" header="Product Code" style="min-width: 15rem">
              <template #body="{ data }">
                {{ data.data.web_product_code }}
              </template>
            </Column>
            <Column field="data.active_status" header="Status" style="min-width: 10rem">
              <template #body="{ data }">
                {{ formatActiveStatus(data) }}
              </template>
            </Column>
            <Column field="data.created_at" header="Created At" style="min-width: 10rem">
              <template #body="{ data }">
                {{ getRecordField(data, 'created_at') }}
              </template>
            </Column>
          </DataTable>
        </div>

        <!-- Updated Records DataTable -->
        <div v-if="importResults.updated_records > 0 && importResults.updated_data" class="mb-6">
          <h3 class="text-lg font-semibold mb-4 text-orange-700">
            Updated Records ({{ importResults.updated_records }})
          </h3>
          <DataTable v-model:filters="filters" :value="importResults.updated_data" paginator :rows="10"
            dataKey="variant_id" filterDisplay="menu"
            :globalFilterFields="[
              'data.web_product_variant',
              'web_product_variant',
              'data.option_group',
              'option_group',
              'data.active_status',
              'active_status',
              'data.created_at',
              'created_at'
            ]" class="th-table">
            <template #header>
              <div class="flex justify-between items-center">
                <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                <InputText v-model="filters['global'].value" placeholder="Search updated option groups records..." />
              </div>
            </template>
            <template #empty>No updated option groups records found.</template>
            <Column field="data.web_product_variant" header="Group Name" style="min-width: 15rem">
              <template #body="{ data }">
                {{ getRecordField(data, 'web_product_variant') }}
              </template>
            </Column>

            <Column field="data.option_group" header="Group Name" style="min-width: 15rem">
              <template #body="{ data }">
                {{ getRecordField(data, 'option_group') }}
              </template>
            </Column>
            <Column field="data.active_status" header="Status" style="min-width: 10rem">
              <template #body="{ data }">
                {{ formatActiveStatus(data) }}
              </template>
            </Column>
            <Column field="data.created_at" header="Created At" style="min-width: 10rem">
              <template #body="{ data }">
                {{ getRecordField(data, 'created_at') }}
              </template>
            </Column>
          </DataTable>
        </div>

        <!-- Valid Records DataTable -->
        <div v-if="importResults.valid_records > 0 && importResults.valid_data">
          <h3 class="text-lg font-semibold mb-4 text-green-700">
            Inserted Records ({{ importResults.valid_records }})
          </h3>
          <DataTable v-model:filters="filters" :value="importResults.valid_data" paginator :rows="10"
            dataKey="option_group" filterDisplay="menu"
            :globalFilterFields="[
              'web_product_variant',
              'option_group',
              'active_status',
              'created_at',
              'data.web_product_variant',
              'data.option_group',
              'data.active_status',
              'data.created_at'
            ]" class="th-table">
            <template #header>
              <div class="flex justify-between items-center">
                <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                <InputText v-model="filters['global'].value" placeholder="Search inserted option groups records..." />
              </div>
            </template>
            <template #empty>No inserted option groups records found.</template>
            <Column field="data.option_group" header="Group Name" style="min-width: 15rem">
              <template #body="{ data }">
                {{ data.option_group }}
              </template>
            </Column>
            <Column field="data.web_product_variant" header="Group Name" style="min-width: 15rem">
              <template #body="{ data }">
                {{ getRecordField(data, 'web_product_variant') }}
              </template>
            </Column>
            <Column field="option_group" header="Group Name" style="min-width: 15rem">
              <template #body="{ data }">
                {{ getRecordField(data, 'option_group') }}
              </template>
            </Column>
            <Column field="active_status" header="Status" style="min-width: 10rem">
              <template #body="{ data }">
                {{ formatActiveStatus(data) }}
              </template>
            </Column>
            <Column field="created_at" header="Created At" style="min-width: 10rem">
              <template #body="{ data }">
                {{ getRecordField(data, 'created_at') }}
              </template>
            </Column>
          </DataTable>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.variant-import {
  padding: 2rem;
}

.p-datatable .p-datatable-thead>tr>th {
  background-color: var(--surface-100);
}

.p-datatable .p-datatable-tbody>tr>td {
  padding: 1rem;
}
</style>
