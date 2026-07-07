<script setup lang="ts">
import { ref, onMounted } from 'vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useToast } from 'primevue/usetoast';
import FileUpload from 'primevue/fileupload';
import ProgressBar from 'primevue/progressbar';
import { useVendorStore } from '@/stores/vendor';
import { storeToRefs } from 'pinia';
import VendorImportResponse from '@/models/VendorImport';

//===========================================================
// Define Props
//===========================================================
// const props = defineProps({});

//===========================================================
// Declare Emits
//===========================================================
const emit = defineEmits(['editTabUnmunted', 'editTabMounted', 'saved']);

//===========================================================
// Define Local Variables
//===========================================================
const vendorStore = useVendorStore();
const { importExport, fb } = storeToRefs(vendorStore);
// console.log('import page ', importExport);

const toast = useToast();
// Vendor Import related states
const selectedFileVendors = ref<File | null>(null);
const filters = ref({ global: { value: null, matchMode: 'contains' } })
// const showVendorResults = computed(() => {
//   return (
//     importExport.value.invalid_records > 0 ||
//     importExport.value.updated_records > 0 ||
//     importExport.value.valid_records  > 0
//   );
// });
const showVendorResults = ref(false);

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
  selectedFileVendors.value = file;
};

// Handle variant import (save action)
const handleSave = async () => {
  if (!selectedFileVendors.value) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Please select a file first',
      life: 3000
    });
    return;
  }
  try {
    const formData = new FormData();
    formData.append('csv_file', selectedFileVendors.value);
    const response = await vendorStore.importVendors(formData);
    importExport.value = new VendorImportResponse(response);
    showVendorResults.value = true;
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Vendor imported successfully',
      life: 3000
    });
    selectedFileVendors.value = null;
  } catch (error: any) {
    console.error('Save error:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.message || 'Failed to save file',
      life: 3000
    });
  }
};

// Clear variant import results
const clearVendorResults = () => {
  importExport.value = new VendorImportResponse();
};

// Clear filters
const clearFilter = () => {
  filters.value = { global: { value: null, matchMode: 'contains' } };
};

//===========================================================
// Lifecycle Hooks
//===========================================================
onMounted(() => {
  console.log('import page',importExport);
  
  // Any initialization logic here (if needed)
});
</script>

<template>
  <div class="variant-import p-6">
    <!-- Vendors Import Section -->
    <div class="bg-white rounded-lg p-6 shadow-md">
      <h2 class="text-xl font-semibold mb-2">Import Vendors CSV data</h2>
      <p class="text-gray-600 mb-4">Upload a CSV file to start importing vendor data</p>
      <div class="flex flex-col gap-4">
        <FileUpload mode="basic" name="importVendorFile" accept=".csv" :maxFileSize="1000000" @select="handleFileSelect"
          :auto="false" chooseLabel="Select CSV File" />
        <div v-if="selectedFileVendors" class="flex flex-col gap-4">
          <div class="flex items-center gap-2 p-3 bg-gray-50 rounded">
            <i class="pi pi-file text-gray-500"></i>
            <span class="text-gray-700">{{ selectedFileVendors.name }}</span>
          </div>
          <div v-if="fb.loading['vendor.import']" class="w-full">
            <ProgressBar mode="indeterminate" style="height: 8px" class="w-full" />
            <p class="text-sm text-gray-600 mt-2 text-center">Importing vendor data...</p>
          </div>
          <Button icon="pi pi-save" :label="fb.loading['vendor.import'] ? 'Saving...' : 'Import vendor'"
            severity="success" @click="handleSave" :loading="fb.loading['vendor.import']"
            :disabled="fb.loading['vendor.import']" class="p-button-md" />
        </div>
      </div>

      <!-- Vendors Import Results Section -->
      <div v-if="showVendorResults" class="bg-white rounded-lg p-6 shadow-md mt-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold">Vendors Import Results</h2>
          <Button icon="pi pi-times" label="Clear Results" severity="secondary" outlined
            @click="clearVendorResults" />
        </div>

        <!-- Summary Statistics -->
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div class="text-2xl font-bold text-blue-600">{{ importExport.total_records || 0 }}</div>
            <div class="text-sm text-blue-800">Total Records</div>
          </div>
          <div class="bg-green-50 p-4 rounded-lg border border-green-200">
            <div class="text-2xl font-bold text-green-600">{{ importExport.valid_records || 0 }}</div>
            <div class="text-sm text-green-800">Valid Records</div>
          </div>
          <div class="bg-red-50 p-4 rounded-lg border border-red-200">
            <div class="text-2xl font-bold text-red-600">{{ importExport.invalid_records || 0 }}</div>
            <div class="text-sm text-red-800">Invalid Records</div>
          </div>
          <div class="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <div class="text-2xl font-bold text-orange-600">{{ importExport.duplicated_records || 0 }}</div>
            <div class="text-sm text-orange-800">Duplicate Records</div>
          </div>
          <div class="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div class="text-2xl font-bold text-purple-600">{{ importExport.valid_records || 0 }}</div>
            <div class="text-sm text-purple-800">Records Inserted</div>
          </div>

        </div>

        <!-- Invalid Records DataTable -->
        <div v-if="importExport.invalid_records > 0 && importExport.invalid_data" class="mb-6">
          <h3 class="text-lg font-semibold mb-4 text-red-700">Invalid Records ({{ importExport.invalid_records
          }})</h3>
          <DataTable v-model:filters="filters" :value="importExport.invalid_data" paginator :rows="100" dataKey="row"
            filterDisplay="menu" :globalFilterFields="['data.name', 'data.unit']" class="th-table">
            <template #header>
              <div class="flex justify-between items-center">
                <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                <InputText v-model="filters['global'].value" placeholder="Search invalid vendor records..." />
              </div>
            </template>
            <template #empty>No invalid vendor records found.</template>
            <Column field="row" header="Row" style="min-width: 6rem">
              <template #body="{ data }">
                {{ data.row }}
              </template>
            </Column>
            <Column field="data.value" header="Name" style="min-width: 15rem">
              <template #body="{ data }">
                {{ data.data.name }}
              </template>
            </Column>
            <Column field="data.unit" header="Unit" style="min-width: 10rem">
              <template #body="{ data }">
                {{ data.data.unit }}
              </template>
            </Column>
            <Column field="data.value" header="Value" style="min-width: 10rem">
              <template #body="{ data }">{{ data.data.value }}</template>
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
        <div v-if="importExport.duplicated_records > 0 && importExport.duplicated_data" class="mb-6">
          <h3 class="text-lg font-semibold mb-4 text-red-700">Duplicate Records ({{ importExport.duplicated_records }})
          </h3>
          <DataTable 
              v-model:filters="filters" 
              :value="importExport.duplicated_data" 
              paginator 
              :rows="200" 
              dataKey="vendor_code"
              filterDisplay="menu"
              :globalFilterFields="['vendor_code', 'name', 'sort_order']" 
              class="th-table">
            <template #header>
              <div class="flex justify-between items-center">
                <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                <InputText v-model="filters['global'].value" placeholder="Search duplicate vendors records..." />
              </div>
            </template>
            <template #empty>No invalid vendors records found.</template>
            <Column field="vendor_code" header="Vendor Code" style="min-width: 10rem">
              <template #body="{ data }">{{ data.vendor_code }}</template>
            </Column>
            <Column field="name" header="Name" style="min-width: 10rem">
              <template #body="{ data }">{{ data.name }}</template>
            </Column>
            <Column field="sort_order" header="Sort Order" style="min-width: 10rem">
              <template #body="{ data }">{{ data.sort_order }}</template>
            </Column>
          </DataTable>
        </div>

        <!-- Updated Records DataTable -->
        <div v-if="importExport.updated_records > 0 && importExport.updated_data" class="mb-6">
          <h3 class="text-lg font-semibold mb-4 text-orange-700">
            Updated Records ({{ importExport.updated_records }})
          </h3>
          <DataTable v-model:filters="filters" :value="importExport.updated_data" paginator :rows="100"
            dataKey="variant_id" filterDisplay="menu"
            :globalFilterFields="['name', 'vendor_code', 'sort_order']" class="th-table">
            <template #header>
              <div class="flex justify-between items-center">
                <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                <InputText v-model="filters['global'].value" placeholder="Search updated vendor records..." />
              </div>
            </template>
            <template #empty>No updated vendor records found.</template>
            <!-- <Column field="data.vendor_id" header="Id" style="min-width: 10rem">
              <template #body="{ data }">{{ data.vendor_id }}</template>
            </Column> -->
            <Column field="data.name" header="Name" style="min-width: 10rem">
              <template #body="{ data }">{{ data.name }}</template>
            </Column>
            <Column field="vendor_code" header="Vendor Code" style="min-width: 10rem">
              <template #body="{ data }">{{ data.vendor_code }}</template>
            </Column>
            <Column field="sort_order" header="Sort Order" style="min-width: 10rem">
              <template #body="{ data }">{{ data.sort_order }}</template>
            </Column>
            
          </DataTable>
        </div>

        <!-- Valid Records DataTable -->
        <div v-if="importExport.valid_records > 0 && importExport.valid_data">
          <h3 class="text-lg font-semibold mb-4 text-green-700">
            Valid Records ({{ importExport.valid_records }})
          </h3>
          <DataTable v-model:filters="filters" :value="importExport.valid_data" paginator :rows="100" dataKey="vendor_id"
            filterDisplay="menu" :globalFilterFields="['name', 'vendor_code']" class="th-table">
            <template #header>
              <div class="flex justify-between items-center">
                <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                <InputText v-model="filters['global'].value" placeholder="Search valid vendor records..." />
              </div>
            </template>
            <template #empty>No valid variant content records found.</template>
          
            <Column field="name" header="Name" style="min-width: 15rem" />
            <Column field="vendor_code" header="Vendor Code" style="min-width: 15rem" />
            <Column field="sort_order" header="Sort Order" style="min-width: 15rem"></Column>
            
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
