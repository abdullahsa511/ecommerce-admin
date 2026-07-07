<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';

import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useToast } from 'primevue/usetoast';
import FileUpload from 'primevue/fileupload';
import ProgressBar from 'primevue/progressbar';
import { useTypeStore } from '@/stores/type';
import { storeToRefs } from 'pinia';
import TypeImportResponse from '@/models/typeImport';

const props = defineProps({});
const emit = defineEmits(['editTabUnmunted', 'editTabMounted', 'saved']);

const typeStore = useTypeStore();
const { importExport, fb } = storeToRefs(typeStore);

const filters = ref({ global: { value: null, matchMode: 'contains' } });
const toast = useToast();


const selectedFileTypes = ref<File | null>(null);
const showTypeResults = computed(() => {
  return (importExport.value.invalid_records > 0
    || importExport.value.updated_records > 0
    || importExport.value.valid_records > 0
  );
});


const handleFileSelectTypes = (event: any) => {
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
  selectedFileTypes.value = file;
};


const handleSaveTypes = async () => {
  if (!selectedFileTypes.value) {
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
    formData.append('csv_file', selectedFileTypes.value);
    await typeStore.importTypes(formData);
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Types imported successfully',
      life: 3000,
    });
    selectedFileTypes.value = null;
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

// Clear option import results
const clearTypesResults = () => {
  importExport.value = new TypeImportResponse();
  // showTypesResults.value = false;
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
  <div class="type-import p-6">
    <!-- types Import Section -->
    <div class="bg-white rounded-lg p-6 shadow-md">
      <h2 class="text-xl font-semibold mb-2">Import types CSV data</h2>
      <p class="text-gray-600 mb-4">Upload a CSV file to start importing types data</p>
      <div class="flex flex-col gap-4">
        <FileUpload mode="basic" name="importTypeFile" accept=".csv" :maxFileSize="1000000"
          @select="handleFileSelectTypes" :auto="false" chooseLabel="Select CSV File" />
        <div v-if="selectedFileTypes" class="flex flex-col gap-4">
          <div class="flex items-center gap-2 p-3 bg-gray-50 rounded">
            <i class="pi pi-file text-gray-500"></i>
            <span class="text-gray-700">{{ selectedFileTypes.name }}</span>
          </div>
          <div v-if="fb.loading['type.import']" class="w-full">
            <ProgressBar mode="indeterminate" style="height: 8px" class="w-full" />
            <p class="text-sm text-gray-600 mt-2 text-center">Importing types data...</p>
          </div>
          <Button icon="pi pi-save" :label="fb.loading['type.import'] ? 'Saving...' : 'Import Attributes'"
            severity="success" @click="handleSaveTypes" :loading="fb.loading['type.import']"
            :disabled="fb.loading['type.import']" class="p-button-md" />
        </div>
      </div>

      <!-- types Import Results Section -->
      <div v-if="showTypeResults" class="bg-white rounded-lg p-6 shadow-md mt-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold">Types Import Results</h2>
          <Button icon="pi pi-times" label="Clear Results" severity="secondary" outlined @click="clearTypesResults" />
        </div>

        <!-- Summary Statistics -->
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div class="text-2xl font-bold text-blue-600">{{ importExport.total_records || 0 }}</div>
            <div class="text-sm text-blue-800">Total Records</div>
          </div>
          
          <div class="bg-red-50 p-4 rounded-lg border border-red-200">
            <div class="text-2xl font-bold text-red-600">{{ importExport.invalid_records || 0 }}</div>
            <div class="text-sm text-red-800">Invalid Records</div>
          </div>
          <div class="bg-red-50 p-4 rounded-lg border border-red-200">
            <div class="text-2xl font-bold text-red-600">{{ importExport.duplicated_records || 0 }}</div>
            <div class="text-sm text-red-800">Duplicate Records</div>
          </div>
          <div class="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <div class="text-2xl font-bold text-orange-600">{{ importExport.updated_records || 0 }}</div>
            <div class="text-sm text-orange-800">Updated Records</div>
          </div>
          <div class="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div class="text-2xl font-bold text-purple-600">{{ importExport.valid_records || 0 }}</div>
            <div class="text-sm text-purple-800">Inserted Records</div>
          </div>
        </div>

        <!-- Invalid Records DataTable -->
        <div v-if="importExport.invalid_records > 0 && importExport.invalid_data" class="mb-6">
          <h3 class="text-lg font-semibold mb-4 text-red-700">Invalid Records ({{ importExport.invalid_records }})</h3>
          <DataTable v-model:filters="filters" :value="importExport.invalid_data" paginator :rows="10" dataKey="row"
            filterDisplay="menu" :globalFilterFields="['data.option_code', 'data.language_code', 'data.value']"
            class="th-table">
            <template #header>
              <div class="flex justify-between items-center">
                <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                <InputText v-model="filters['global'].value" placeholder="Search invalid types records..." />
              </div>
            </template>
            <template #empty>No invalid types records found.</template>
            <Column field="row" header="Row" style="min-width: 6rem">
              <template #body="{ data }">
                {{ data.row }}
              </template>
            </Column>
            <Column field="data.type" header="Type" style="min-width: 10rem">
              <template #body="{ data }">
                {{ data.data.type }}
              </template>
            </Column>
            
            <Column field="data.sort_order" header="Sort Order" style="min-width: 15rem">
              <template #body="{ data }">
                {{ data.data.sort_order }}
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

        <!-- Duplicate Records DataTable -->
        <div v-if="importExport.duplicated_data" class="mb-6">
          <h3 class="text-lg font-semibold mb-4 text-orange-700">
            Duplicate Records ({{ importExport.duplicated_records }})
          </h3>
          <DataTable v-model:filters="filters" :value="importExport.duplicated_data" paginator :rows="10"
            dataKey="type_id" filterDisplay="menu"
            :globalFilterFields="['type', 'sort_order']" class="th-table">
            <template #header>
              <div class="flex justify-between items-center">
                <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                <InputText v-model="filters['global'].value" placeholder="Search duplicate types records..." />
              </div>
            </template>
            <template #empty>No duplicate types records found.</template>

            <Column field="data.type" header="Type" style="min-width: 10rem" />

            <Column field="data.sort_order" header="Sort Order" style="min-width: 5rem" />
          </DataTable>
        </div>

        <!-- Updated Records DataTable -->
        <div v-if="importExport.updated_records" class="mb-6">
          <h3 class="text-lg font-semibold mb-4 text-orange-700">
            Updated Records ({{ importExport.updated_records }})
          </h3>
          <DataTable v-model:filters="filters" :value="importExport.updated_data" paginator :rows="10"
            dataKey="option_id" filterDisplay="menu"
            :globalFilterFields="['name', 'type', 'language_code', 'sort_order']" class="th-table">
            <template #header>
              <div class="flex justify-between items-center">
                <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                <InputText v-model="filters['global'].value" placeholder="Search updated types records..." />
              </div>
            </template>
            <template #empty>No updated types records found.</template>

            <Column field="type" header="Type" style="min-width: 10rem" />

            <Column field="sort_order" header="Sort Order" style="min-width: 5rem" />
          </DataTable>
        </div>

        <!-- Valid Records DataTable -->
        <div v-if="importExport.valid_records > 0">
          <h3 class="text-lg font-semibold mb-4 text-green-700">Records Inserted ({{ importExport.valid_records }})</h3>
          <DataTable v-model:filters="filters" :value="importExport.valid_data" paginator :rows="200"
            dataKey="type_id" filterDisplay="menu" :globalFilterFields="['type', 'type_id']" class="th-table">
            <template #header>
              <div class="flex justify-between items-center">
                <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                <InputText v-model="filters['global'].value" placeholder="Search valid type content records..." />
              </div>
            </template>
            <template #empty>No valid type content records found.</template>
            <Column field="type" header="Type" style="min-width: 15rem" />
            <Column field="data.sort_order" header="Sort Order" style="min-width: 10rem">
              <template #body="{ data }">{{ data.sort_order }}</template>
            </Column>
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
