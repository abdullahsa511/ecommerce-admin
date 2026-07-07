<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useToast } from 'primevue/usetoast';
import FileUpload from 'primevue/fileupload';
import ProgressBar from 'primevue/progressbar';
import { useCouponStore } from '@/stores/coupon';
import { storeToRefs } from 'pinia';
import CouponImportResponse from '@/models/CouponImport';

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
const couponStore = useCouponStore();
const { importExport, fb } = storeToRefs(couponStore);
// console.log('import page ', importExport);

const toast = useToast();
// Coupon Import related states
const selectedFileCoupons = ref<File | null>(null);
const filters = ref({ global: { value: null, matchMode: 'contains' } })
const showCouponResults = computed(() => {
  return (
    importExport.value.invalid_records > 0 ||
    importExport.value.updated_records > 0 ||
    importExport.value.valid_records  > 0
  );
});

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
  selectedFileCoupons.value = file;
};

// Handle variant import (save action)
const handleSave = async () => {
  if (!selectedFileCoupons.value) {
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
    formData.append('csv_file', selectedFileCoupons.value);
    await couponStore.importCoupons(formData);
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Coupon imported successfully',
      life: 3000
    });
    selectedFileCoupons.value = null;
  } catch (error: any) {
    console.error('Save error:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.message || 'Failed to save file',
      life: 3000
    });
  } finally {
    fb.loading = false;
  }
};

// Clear variant import results
const clearCouponResults = () => {
  importExport.value = new CouponImportResponse();
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
    <!-- Coupon Import Section -->
    <div class="bg-white rounded-lg p-6 shadow-md">
      <h2 class="text-xl font-semibold mb-2">Import Coupon CSV data</h2>
      <p class="text-gray-600 mb-4">Upload a CSV file to start importing coupon data</p>
      <div class="flex flex-col gap-4">
        <FileUpload mode="basic" name="importCouponFile" accept=".csv" :maxFileSize="1000000" @select="handleFileSelect"
          :auto="false" chooseLabel="Select CSV File" />
        <div v-if="selectedFileCoupons" class="flex flex-col gap-4">
          <div class="flex items-center gap-2 p-3 bg-gray-50 rounded">
            <i class="pi pi-file text-gray-500"></i>
            <span class="text-gray-700">{{ selectedFileCoupons.name }}</span>
          </div>
          <div v-if="fb.loading['coupon.import']" class="w-full">
            <ProgressBar mode="indeterminate" style="height: 8px" class="w-full" />
            <p class="text-sm text-gray-600 mt-2 text-center">Importing coupon data...</p>
          </div>
          <Button icon="pi pi-save" :label="fb.loading['coupon.import'] ? 'Saving...' : 'Import coupon'"
            severity="success" @click="handleSave" :loading="fb.loading['coupon.import']"
            :disabled="fb.loading['coupon.import']" class="p-button-md" />
        </div>
      </div>

      <!-- Coupon Import Results Section -->
      <div v-if="showCouponResults" class="bg-white rounded-lg p-6 shadow-md mt-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold">Coupon Import Results</h2>
          <Button icon="pi pi-times" label="Clear Results" severity="secondary" outlined
            @click="clearCouponResults" />
        </div>

        <!-- Summary Statistics -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div class="text-2xl font-bold text-blue-600">{{ importExport.total_records || 0 }}</div>
            <div class="text-sm text-blue-800">Total Records</div>
          </div>
          <div class="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <div class="text-2xl font-bold text-orange-600">{{ importExport.invalid_records || 0 }}</div>
            <div class="text-sm text-orange-800">Invalid Records</div>
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
          <h3 class="text-lg font-semibold mb-4 text-red-700">Invalid Records ({{ importExport.invalid_records
          }})</h3>
          <DataTable v-model:filters="filters" :value="importExport.invalid_data" paginator :rows="100" dataKey="row"
            filterDisplay="menu" :globalFilterFields="['data.name', 'data.unit']" class="th-table">
            <template #header>
              <div class="flex justify-between items-center">
                <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                <InputText v-model="filters['global'].value" placeholder="Search invalid coupon records..." />
              </div>
            </template>
            <template #empty>No invalid coupon records found.</template>
            <Column field="errors" header="Errors" style="min-width: 15rem">
              <template #body="{ data }">
                <div class="text-red-600 text-sm">
                  {{ data.errors }}
                </div>
              </template>
            </Column>
            <Column field="row" header="Row" style="min-width: 6rem">
              <template #body="{ data }">
                {{ data.row }}
              </template>
            </Column>
            <Column field="data.name" header="Name" style="min-width: 10rem">
              <template #body="{ data }">{{ data.data.name }}</template>
            </Column>
            <Column field="data.code" header="Code Name" style="min-width: 10rem">
              <template #body="{ data }">{{ data.data.code }}</template>
            </Column>
            <Column field="data.discount" header="Discount" style="min-width: 10rem">
              <template #body="{ data }">{{ data.data.discount }}</template>
            </Column>
            <Column field="data.type" header="Type" style="min-width: 10rem">
              <template #body="{ data }">{{ data.data.type }}</template>
            </Column>
            <Column field="data.free_shipping" header="Free Shipping" style="min-width: 10rem">
              <template #body="{ data }">{{ data.data.free_shipping }}</template>
            </Column>
            <Column field="data.date_start" header="From Date" style="min-width: 10rem">
              <template #body="{ data }">{{ data.data.date_start }}</template>
            </Column>
            <Column field="data.date_end" header="To Date" style="min-width: 10rem">
              <template #body="{ data }">{{ data.data.date_end }}</template>
            </Column>
            <Column field="data.status" header="Status" style="min-width: 10rem">
              <template #body="{ data }">{{ data.data.status }}</template>
            </Column>
          </DataTable>
        </div>

        <!-- Duplicate Records DataTable -->
        <div v-if="importExport.duplicated_records > 0 && importExport.duplicated_data" class="mb-6">
          <h3 class="text-lg font-semibold mb-4 text-orange-700">Updated Records ({{ importExport.updated_records }})
          </h3>
          <DataTable v-model:filters="filters" :value="importExport.updated_data" paginator :rows="200" dataKey="row"
            filterDisplay="menu" :globalFilterFields="['data.name', 'data.code']" class="th-table">
            <template #header>
              <div class="flex justify-between items-center">
                <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                <InputText v-model="filters['global'].value" placeholder="Search updated coupons records..." />
              </div>
            </template>
            <template #empty>No updated coupons records found.</template>
            <Column field="data.name" header="Name" style="min-width: 10rem">
              <template #body="{ data }">{{ data.data.name }}</template>
            </Column>
            <Column field="data.code" header="Code Name" style="min-width: 10rem">
              <template #body="{ data }">{{ data.data.code }}</template>
            </Column>
            <Column field="data.discount" header="Discount" style="min-width: 10rem">
              <template #body="{ data }">{{ data.data.discount }}</template>
            </Column>
            <Column field="data.type" header="Type" style="min-width: 10rem">
              <template #body="{ data }">{{ data.data.type }}</template>
            </Column>
            <Column field="data.free_shipping" header="Free Shipping" style="min-width: 10rem">
              <template #body="{ data }">{{ data.data.free_shipping }}</template>
            </Column>
            <Column field="data.date_start" header="From Date" style="min-width: 10rem">
              <template #body="{ data }">{{ data.data.date_start }}</template>
            </Column>
            <Column field="data.date_end" header="To Date" style="min-width: 10rem">
              <template #body="{ data }">{{ data.data.date_end }}</template>
            </Column>
            <Column field="data.status" header="Status" style="min-width: 10rem">
              <template #body="{ data }">{{ data.data.status }}</template>
            </Column>
          </DataTable>
        </div>

        <!-- Valid Records DataTable -->
        <div v-if="importExport.valid_records > 0 && importExport.valid_data">
          <h3 class="text-lg font-semibold mb-4 text-green-700">
            Valid Records ({{ importExport.valid_records }})
          </h3>
          <DataTable v-model:filters="filters" :value="importExport.valid_data" paginator :rows="100" dataKey="length_type_id"
            filterDisplay="menu" :globalFilterFields="['name', 'unit', 'value']" class="th-table">
            <template #header>
              <div class="flex justify-between items-center">
                <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                <InputText v-model="filters['global'].value" placeholder="Search valid coupon records..." />
              </div>
            </template>
            <template #empty>No valid variant content records found.</template>
            <Column field="name" header="Name" style="min-width: 10rem" />
            <Column field="code" header="Code Name" style="min-width: 10rem" />
            <Column field="discount" header="Discount" style="min-width: 10rem" />
            <Column field="type" header="Type" style="min-width: 10rem" />
            <Column field="free_shipping" header="Free Shipping" style="min-width: 10rem" />
            <Column field="date_start" header="From Date" style="min-width: 10rem" />
            <Column field="date_end" header="To Date" style="min-width: 10rem" />
            <Column field="status" header="Status" style="min-width: 10rem" />
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
