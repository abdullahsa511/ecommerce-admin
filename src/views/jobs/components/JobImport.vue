<script setup>
import { formatImportImageData } from '@/utils/mediaUrl';
import { ref, defineEmits, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useDesignResourceImportStore } from '@/stores/designResourceImport';
import { useToast } from 'primevue/usetoast';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import FileUpload from 'primevue/fileupload';
import ProgressBar from 'primevue/progressbar';
import axios from 'axios';
import { useJobStore } from '@/stores/job';

const toast = useToast();
const jobStore = useJobStore();
const selectedFile = ref(null);
const isSaving = ref(false);
const emit = defineEmits(['editTabUnmunted', 'editTabMounted', 'saved']);
// Import results data
const importResults = ref(null);
const showResults = ref(false);

// Filters for datatables
const filters = ref({
  global: { value: null, matchMode: 'contains' }
});

const handleFileSelect = (event) => {
  const file = event.files[0];
  if (!file) return;
  if (!file.name.endsWith('.csv')) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Please select a CSV file', life: 3000 });
    return;
  }
  selectedFile.value = file;
};
// DesignResourceImportService.createDesignResourceImport is not a function
const handleSave = async () => {
  if (!selectedFile.value) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Please select a file first', life: 3000 });
    return;
  }
  isSaving.value = true;
  try {
    const formData = new FormData();
    formData.append('csv_file', selectedFile.value);
    formData.append('status', 'pending');

    const response = await jobStore.importJobs(formData);

    // Store the import results
    importResults.value = response;
    showResults.value = true;

    toast.add({ severity: 'success', summary: 'Success', detail: 'Jobs data imported successfully', life: 3000 });
    selectedFile.value = null;
  } catch (error) {
    console.error('Import error:', error);
    toast.add({ severity: 'error', summary: 'Error', detail: error.message || 'Failed to import jobs data', life: 3000 });
  } finally {
    isSaving.value = false;
  }
};

const clearFilter = () => {
  filters.value.global.value = null;
};

const clearResults = () => {
  importResults.value = null;
  showResults.value = false;
};

const formatImageData = formatImportImageData;

// Helper function to format errors
const formatErrors = (errors) => {
  if (!errors) return '';
  return Object.entries(errors)
    .map(([field, message]) => `${field}: ${message}`)
    .join(', ');
};

onMounted(() => {
  emit('editTabMounted');
});
onUnmounted(() => {
  emit('editTabUnmunted');
});
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- Design Resource Import Section -->
    <div class="bg-white rounded-lg p-6 shadow-md">
      <h2 class="text-xl font-semibold mb-2">
        Import Jobs CSV data
      </h2>
      <p class="text-gray-600 mb-4">Upload a CSV file to start importing jobs data</p>

      <div class="flex flex-col gap-4">
        <FileUpload mode="basic" name="importFile" accept=".csv" :maxFileSize="1000000" @select="handleFileSelect"
          :auto="false" chooseLabel="Select CSV File" />

        <!-- Selected file info and Save button -->
        <div v-if="selectedFile" class="flex flex-col gap-4">
          <div class="flex items-center gap-2 p-3 bg-gray-50 rounded">
            <i class="pi pi-file text-gray-500"></i>
            <span class="text-gray-700">{{ selectedFile.name }}</span>
          </div>
          <!-- Progress Bar -->
          <div v-if="isSaving" class="w-full">
            <ProgressBar mode="indeterminate" style="height: 8px" class="w-full" />
            <p class="text-sm text-gray-600 mt-2 text-center">Importing jobs data...</p>
          </div>
          <Button icon="pi pi-save" :label="isSaving ? 'Saving...' : 'Import Jobs'" severity="success"
            @click="handleSave" :loading="isSaving" :disabled="isSaving" class="p-button-md" />
        </div>
      </div>
    </div>

    <!-- Import Results Section -->
    <div v-if="showResults && importResults" class="bg-white rounded-lg p-6 shadow-md">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-semibold">Jobs Import Results</h2>
        <Button icon="pi pi-times" label="Clear Results" severity="secondary" outlined @click="clearResults" />
      </div>
      <!-- Summary Statistics -->
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div class="text-2xl font-bold text-blue-600">{{ importResults?.total_records || 0 }}</div>
          <div class="text-sm text-blue-800">Total Records</div>
        </div>
        <div class="bg-green-50 p-4 rounded-lg border border-green-200">
          <div class="text-2xl font-bold text-green-600">{{ importResults?.valid_records || 0 }}</div>
          <div class="text-sm text-green-800">Valid Records</div>
        </div>
        <div class="bg-red-50 p-4 rounded-lg border border-red-200">
          <div class="text-2xl font-bold text-red-600">{{ importResults?.invalid_records || 0 }}</div>
          <div class="text-sm text-red-800">Invalid Records</div>
        </div>
        <div class="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <div class="text-2xl font-bold text-orange-600">{{ importResults?.updated_records || 0 }}</div>
          <div class="text-sm text-orange-800">Updated Records</div>
        </div>
        <div class="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div class="text-2xl font-bold text-purple-600">{{ importResults?.inserted_count || 0 }}</div>
          <div class="text-sm text-purple-800">Inserted Records</div>
        </div>
      </div>

      <!-- Invalid Records DataTable -->
      <div v-if="importResults?.invalid_records > 0 && importResults?.invalid_data" class="mb-6">
        <h3 class="text-lg font-semibold mb-4 text-red-700">Invalid Records ({{ importResults.invalid_records
        }})</h3>
        <DataTable v-model:filters="filters" :value="importResults.invalid_data" paginator :rows="10"
          dataKey="row" filterDisplay="menu"
          :globalFilterFields="['type', 'reference', 'job_title', 'description', 'company', 'account_manager_name', 'status', 'value', 'language_code']"
          class="th-table">
          <template #header>
            <div class="flex justify-between items-center">
              <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
              <InputText v-model="filters['global'].value" placeholder="Search invalid records..." />
            </div>
          </template>
          <template #empty> No invalid records found. </template>
          <Column field="errors" header="Errors" style="min-width: 15rem">
            <template #body="{ data }">
              <div class="text-red-600 text-sm">
                {{ formatErrors(data.errors) }}
              </div>
            </template>
          </Column>
          <Column field="row" header="Row" style="min-width: 6rem">
            <template #body="{ data }">
              {{ data.row }}
            </template>
          </Column>
          <Column field="data.type" header="Type" style="min-width: 15rem">
            <template #body="{ data }">
              {{ data.data.type }}
            </template>
          </Column>
            <Column field="data.reference" header="Reference" style="min-width: 10rem">
            <template #body="{ data }">
              {{ data.data.reference }}
            </template>
          </Column>
          <Column field="data.job_title" header="Job Title" style="min-width: 8rem">
            <template #body="{ data }">
              {{ data.data.job_title }}
            </template>
          </Column>
          <Column field="data.description" header="Description" style="min-width: 12rem">
            <template #body="{ data }">
              {{ data.data.description }}
            </template>
          </Column>
          <Column field="data.company" header="Company" style="min-width: 12rem">
            <template #body="{ data }">
              {{ data.data.company }}
            </template>
          </Column>
          <Column field="data.account_manager_name" header="Account Manager Name" style="min-width: 10rem">
            <template #body="{ data }">
              {{ data.data.account_manager_name }}
            </template>
          </Column>
          <Column field="data.status" header="Status" style="min-width: 10rem">
            <template #body="{ data }">
              {{ data.data.status }}
            </template>
          </Column>
          <Column field="data.value" header="Value" style="min-width: 10rem">
            <template #body="{ data }">
              {{ data.data.value }}
            </template>
          </Column>
          <Column field="data.language_code" header="Language Code" style="min-width: 10rem">
            <template #body="{ data }">
              {{ importResults.language_map[data.data.language_id] }}
            </template>
          </Column>
        </DataTable>
      </div>

      <!-- Updated Records DataTable -->
      <div v-if="importResults?.updated_records > 0 && importResults?.updated_data" class="mb-6">
        <h3 class="text-lg font-semibold mb-4 text-orange-700">Updated Records ({{ importResults.updated_records
        }})
        </h3>
        <DataTable v-model:filters="filters" :value="importResults.updated_data" paginator :rows="10"
          dataKey="id" filterDisplay="menu"
          :globalFilterFields="['type', 'reference', 'job_title', 'description', 'company', 'account_manager_name', 'status', 'value', 'language_code']"
          class="th-table">
          <template #header>
            <div class="flex justify-between items-center">
              <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
              <InputText v-model="filters['global'].value" placeholder="Search updated records..." />
            </div>
          </template>
          <template #empty> No updated records found. </template>
          <Column field="row" header="Row" style="min-width: 6rem">
            <template #body="{ data }">
              {{ data.row }}
            </template>
          </Column>
          <!-- title -->
          <Column field="data.type" header="Type" style="min-width: 10rem">
            <template #body="{ data }">
              {{ data.data.type }}
            </template>
          </Column>
          <Column field="data.reference" header="Reference" style="min-width: 10rem">
            <template #body="{ data }">
              {{ data.data.reference }}
            </template>
          </Column>
          <Column field="data.job_title" header="Job Title" style="min-width: 8rem">
            <template #body="{ data }">
              {{ data.data.job_title }}
            </template>
          </Column>
          <Column field="data.description" header="Description" style="min-width: 12rem">
            <template #body="{ data }">
              {{ data.data.description }}
            </template>
          </Column>
          <Column field="data.company" header="Company" style="min-width: 12rem">
            <template #body="{ data }">
              {{ data.data.company }}
            </template>
          </Column>
          <Column field="data.account_manager_name" header="Account Manager Name" style="min-width: 10rem">
            <template #body="{ data }">
              {{ data.data.account_manager_name }}
            </template>
          </Column>
          <Column field="data.status" header="Status" style="min-width: 10rem">
            <template #body="{ data }">
              {{ data.data.status }}
            </template>
          </Column>
          <Column field="data.value" header="Value" style="min-width: 10rem">
            <template #body="{ data }">
              {{ data.data.value }}
            </template>
          </Column>
          <Column field="data.language_code" header="Language Code" style="min-width: 10rem">
            <template #body="{ data }">
              {{ importResults.language_map[data.data.language_id] }}
            </template>
          </Column>
        </DataTable>
      </div>

      <!-- Valid Records DataTable -->
      <div v-if="importResults?.valid_records > 0 && importResults?.valid_data">
        <h3 class="text-lg font-semibold mb-4 text-green-700">Valid Records ({{ importResults.valid_records }})
        </h3>
        <DataTable v-model:filters="filters" :value="importResults.valid_data" paginator :rows="10" dataKey="data.job_title"
          filterDisplay="menu"
          :globalFilterFields="['type', 'reference', 'job_title', 'description', 'company', 'account_manager_name', 'status', 'value', 'language_code']"
          class="th-table">
          <template #header>
            <div class="flex justify-between items-center">
              <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
              <InputText v-model="filters['global'].value" placeholder="Search valid records..." />
            </div>
          </template>
          <template #empty> No valid records found. </template>
          <Column field="type" header="Type" style="min-width: 15rem" />
          <Column field="reference" header="Reference" style="min-width: 10rem" />
          <Column field="job_title" header="Job Title" style="min-width: 8rem" />
          <Column field="description" header="Description" style="min-width: 12rem" />
          <Column field="company" header="Company" style="min-width: 12rem" />
          <Column field="account_manager_name" header="Account Manager Name" style="min-width: 10rem" />
          <Column field="status" header="Status" style="min-width: 10rem" />
          <Column field="value" header="Value" style="min-width: 10rem" />
        </DataTable>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-white {
  background-color: white;
}

.rounded-lg {
  border-radius: 0.5rem;
}

.shadow-sm {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

:deep(.p-button) {
  border-radius: 0.5rem;
}

:deep(.p-inputswitch) {
  margin-right: 0.5rem;
}
</style>
