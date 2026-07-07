<script setup lang="ts">
import { ref, onMounted } from 'vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useToast } from 'primevue/usetoast';
import { useOptionStore } from '@/stores/option';
import FileUpload from 'primevue/fileupload';
import ProgressBar from 'primevue/progressbar';

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
const OptionStore = useOptionStore();
const filters = ref({ global: { value: null, matchMode: 'contains' } });
const toast = useToast();
// Options Import related states
const selectedFileOptions = ref<File | null>(null);
const isSavingOptions = ref(false);
const optionsImportResults = ref<any>(null);
const showOptionsResults = ref(false);

//===========================================================
// Define Local Methods
//===========================================================
// Handle file selection for option import
const handleFileSelectOptions = (event: any) => {
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
  selectedFileOptions.value = file;
};

// Handle option import (save action)
const handleSaveOptions = async () => {
  if (!selectedFileOptions.value) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Please select a file first',
      life: 3000
    });
    return;
  }
  isSavingOptions.value = true;
  try {
    const formData = new FormData();
    formData.append('csv_file', selectedFileOptions.value);
    const response = await OptionStore.optionsImport(formData);
    optionsImportResults.value = {
      total_records: response.total_records || 0,
      valid_records: response.valid_records || 0,
      invalid_records: response.invalid_records || 0,
      updated_records: response.updated_records || 0,
      inserted_count: response.inserted_count || 0,
      valid_data: response.valid_data || [],
      invalid_data: response.invalid_data || [],
      updated_data: response.updated_data || [],
      valid_option_data: response.valid_option_data || [],
    };
    showOptionsResults.value = true;
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Options imported successfully',
      life: 3000
    });
    selectedFileOptions.value = null;
  } catch (error: any) {
    console.error('Save error:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.message || 'Failed to save file',
      life: 3000
    });
  } finally {
    isSavingOptions.value = false;
  }
};

// Clear option import results
const clearOptionsResults = () => {
  optionsImportResults.value = null;
  showOptionsResults.value = false;
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
  <div class="option-import p-6">
    <!-- Options Import Section -->
    <div class="bg-white rounded-lg p-6 shadow-md">
      <h2 class="text-xl font-semibold mb-2">Import Options CSV data</h2>
      <p class="text-gray-600 mb-4">Upload a CSV file to start importing options data</p>
      <div class="flex flex-col gap-4">
        <FileUpload mode="basic" name="importOptionsFile" accept=".csv" :maxFileSize="1000000"
          @select="handleFileSelectOptions" :auto="false" chooseLabel="Select CSV File" />
        <div v-if="selectedFileOptions" class="flex flex-col gap-4">
          <div class="flex items-center gap-2 p-3 bg-gray-50 rounded">
            <i class="pi pi-file text-gray-500"></i>
            <span class="text-gray-700">{{ selectedFileOptions.name }}</span>
          </div>
          <div v-if="isSavingOptions" class="w-full">
            <ProgressBar mode="indeterminate" style="height: 8px" class="w-full" />
            <p class="text-sm text-gray-600 mt-2 text-center">Importing options data...</p>
          </div>
          <Button icon="pi pi-save" :label="isSavingOptions ? 'Saving...' : 'Import Options'" severity="success"
            @click="handleSaveOptions" :loading="isSavingOptions" :disabled="isSavingOptions" class="p-button-md" />
        </div>
      </div>

      <!-- Options Import Results Section -->
      <div v-if="showOptionsResults && optionsImportResults" class="bg-white rounded-lg p-6 shadow-md mt-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold">Options Import Results</h2>
          <Button icon="pi pi-times" label="Clear Results" severity="secondary" outlined @click="clearOptionsResults" />
        </div>

        <!-- Summary Statistics -->
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div class="text-2xl font-bold text-blue-600">{{ optionsImportResults.total_records || 0 }}</div>
            <div class="text-sm text-blue-800">Total Records</div>
          </div>
          <div class="bg-green-50 p-4 rounded-lg border border-green-200">
            <div class="text-2xl font-bold text-green-600">{{ optionsImportResults.valid_records || 0 }}</div>
            <div class="text-sm text-green-800">Valid Records</div>
          </div>
          <div class="bg-red-50 p-4 rounded-lg border border-red-200">
            <div class="text-2xl font-bold text-red-600">{{ optionsImportResults.invalid_records || 0 }}</div>
            <div class="text-sm text-red-800">Invalid Records</div>
          </div>
          <div class="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <div class="text-2xl font-bold text-orange-600">{{ optionsImportResults.updated_records || 0 }}</div>
            <div class="text-sm text-orange-800">Updated Records</div>
          </div>
          <div class="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div class="text-2xl font-bold text-purple-600">{{ optionsImportResults.inserted_count || 0 }}</div>
            <div class="text-sm text-purple-800">Inserted Records</div>
          </div>
        </div>

        <!-- Invalid Records DataTable -->
        <div v-if="optionsImportResults.invalid_records > 0 && optionsImportResults.invalid_data" class="mb-6">
          <h3 class="text-lg font-semibold mb-4 text-red-700">Invalid Records ({{ optionsImportResults.invalid_records
          }})</h3>
          <DataTable v-model:filters="filters" :value="optionsImportResults.invalid_data" paginator :rows="10"
            dataKey="row" filterDisplay="menu"
            :globalFilterFields="['data.option_code', 'data.language_code', 'data.value']" class="th-table">
            <template #header>
              <div class="flex justify-between items-center">
                <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                <InputText v-model="filters['global'].value" placeholder="Search invalid options records..." />
              </div>
            </template>
            <template #empty>No invalid options records found.</template>
            <Column field="row" header="Row" style="min-width: 6rem">
              <template #body="{ data }">
                {{ data.row }}
              </template>
            </Column>
            <Column field="data.option_code" header="Option Code" style="min-width: 10rem">
              <template #body="{ data }">
                {{ data.data.option_code }}
              </template>
            </Column>
            <Column field="data.language_code" header="Language Code" style="min-width: 10rem">
              <template #body="{ data }">
                {{ data.data.language_code }}
              </template>
            </Column>
            <Column field="data.value" header="Value" style="min-width: 15rem">
              <template #body="{ data }">
                {{ data.data.value }}
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
        <div v-if="optionsImportResults.updated_records > 0 && optionsImportResults.updated_data" class="mb-6">
          <h3 class="text-lg font-semibold mb-4 text-orange-700">
            Updated Records ({{ optionsImportResults.updated_records }})
          </h3>
          <DataTable v-model:filters="filters" :value="optionsImportResults.updated_data" paginator :rows="10"
            dataKey="option_id" filterDisplay="menu"
            :globalFilterFields="['name', 'type', 'language_code', 'sort_order']" class="th-table">
            <template #header>
              <div class="flex justify-between items-center">
                <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                <InputText v-model="filters['global'].value" placeholder="Search updated options records..." />
              </div>
            </template>
            <template #empty>No updated options records found.</template>
            <Column field="name" header="Name" style="min-width: 15rem" />
            <Column field="type" header="Type" style="min-width: 10rem" />
            <Column field="language_code" header="Language Code" style="min-width: 10rem" />
            <Column field="sort_order" header="Sort Order" style="min-width: 5rem" />
          </DataTable>
        </div>

        <!-- Valid Records DataTable -->
        <div v-if="optionsImportResults.valid_records > 0 && optionsImportResults.valid_data">
          <h3 class="text-lg font-semibold mb-4 text-green-700">
            Valid Records ({{ optionsImportResults.valid_records }})
          </h3>
          <DataTable v-model:filters="filters" :value="optionsImportResults.valid_data" paginator :rows="10"
            dataKey="code" filterDisplay="menu" :globalFilterFields="['name', 'language_code', 'type', 'sort_order']"
            class="th-table">
            <template #header>
              <div class="flex justify-between items-center">
                <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                <InputText v-model="filters['global'].value" placeholder="Search valid option content records..." />
              </div>
            </template>
            <template #empty>No valid option content records found.</template>
            <Column field="name" header="Name" style="min-width: 15rem" />
            <Column field="type" header="Type" style="min-width: 8rem" />
            <Column field="language_code" header="Language Code" style="min-width: 8rem" />
            <Column field="sort_order" header="Sort Order" style="min-width: 5rem" />
          </DataTable>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.option-import {
  padding: 2rem;
}

.p-datatable .p-datatable-thead>tr>th {
  background-color: var(--surface-100);
}

.p-datatable .p-datatable-tbody>tr>td {
  padding: 1rem;
}
</style>
