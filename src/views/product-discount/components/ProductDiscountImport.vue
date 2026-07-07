<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useToast } from 'primevue/usetoast';
import FileUpload from 'primevue/fileupload';
import ProgressBar from 'primevue/progressbar';
import { useProductDiscountStore } from '@/stores/productDiscount';
import { storeToRefs } from 'pinia';
import ProductDiscountImportResponse from '@/models/ProductDiscountImport';

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
const productDiscountStore = useProductDiscountStore();
const { importExport, fb } = storeToRefs(productDiscountStore);
// console.log('import page ', importExport);

const toast = useToast();
// Product Discount Import related states
const selectedFileProductDiscounts = ref<File | null>(null);
const filters = ref({ global: { value: null, matchMode: 'contains' } })
const showProductDiscountResults = computed(() => {
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
  selectedFileProductDiscounts.value = file;
};

// Handle variant import (save action)
const handleSave = async () => {
  if (!selectedFileProductDiscounts.value) {
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
    formData.append('csv_file', selectedFileProductDiscounts.value);
    await productDiscountStore.importProductDiscounts(formData);
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Product Discount imported successfully',
      life: 3000
    });
    selectedFileProductDiscounts.value = null;
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
const clearProductDiscountResults = () => {
  importExport.value = new ProductDiscountImportResponse();
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
  <div class="variant-import">
    <!-- Product Discount Import Section -->
    <div class="bg-white rounded-lg p-6 shadow-md">
      <h2 class="text-xl font-semibold mb-2">Import Product Discount CSV data</h2>
      <p class="text-gray-600 mb-4">Upload a CSV file to start importing product discount data</p>
      <div class="flex flex-col gap-4">
        <FileUpload mode="basic" name="importProductDiscountFile" accept=".csv" :maxFileSize="1000000" @select="handleFileSelect"
          :auto="false" chooseLabel="Select CSV File" />
        <div v-if="selectedFileProductDiscounts" class="flex flex-col gap-4">
          <div class="flex items-center gap-2 p-3 bg-gray-50 rounded">
            <i class="pi pi-file text-gray-500"></i>
            <span class="text-gray-700">{{ selectedFileProductDiscounts.name }}</span>
          </div>
          <div v-if="fb.loading['productDiscount.import']" class="w-full">
            <ProgressBar mode="indeterminate" style="height: 8px" class="w-full" />
            <p class="text-sm text-gray-600 mt-2 text-center">Importing product type data...</p>
          </div>
          <Button icon="pi pi-save" :label="fb.loading['productDiscount.import'] ? 'Saving...' : 'Import product type'"
            severity="success" @click="handleSave" :loading="fb.loading['productDiscount.import']"
            :disabled="fb.loading['productDiscount.import']" class="p-button-md" />
        </div>
      </div>

      <!-- Product Discount Import Results Section -->
      <div v-if="showProductDiscountResults" class="bg-white rounded-lg p-6 shadow-md mt-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold">Product Discount Import Results</h2>
          <Button icon="pi pi-times" label="Clear Results" severity="secondary" outlined
            @click="clearProductDiscountResults" />
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
          <h3 class="text-lg font-semibold mb-4 text-red-700">Invalid Records ({{ importExport.invalid_records}})</h3>
          <DataTable v-model:filters="filters" :value="importExport.invalid_data" paginator :rows="100" dataKey="row"
            filterDisplay="menu" :globalFilterFields="['data.name', 'data.unit']" class="th-table">
            <template #header>
              <div class="flex justify-between items-center">
                <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                <InputText v-model="filters['global'].value" placeholder="Search invalid product type records..." />
              </div>
            </template>
            <template #empty>No invalid product type records found.</template>
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
            <Column field="data.product_code" header="Product Code" style="min-width: 15rem">
              <template #body="{ data }">
                {{ data.data.product_code }}
              </template>
            </Column>
            <Column field="data.discounted_price" header="Price" style="min-width: 10rem">
              <template #body="{ data }">
                {{ data.data.discounted_price }}
              </template>
            </Column>
            <Column field="data.from_date" header="From Date" style="min-width: 10rem">
              <template #body="{ data }">
                {{ data.data.from_date }}
              </template>
            </Column>
            <Column field="data.end_date" header="End Date" style="min-width: 10rem">
              <template #body="{ data }">
                {{ data.data.end_date }}
              </template>
            </Column>
          </DataTable>
        </div>

        <!-- Duplicate Records DataTable -->
        <div v-if="importExport.duplicated_records > 0 && importExport.duplicated_data" class="mb-6">
          <h3 class="text-lg font-semibold mb-4 text-red-700">Updated Records ({{ importExport.duplicated_records }})
          </h3>
          <DataTable v-model:filters="filters" :value="importExport.duplicated_data" paginator :rows="200" dataKey="row"
            filterDisplay="menu" :globalFilterFields="['data.name', 'data.language_id']" class="th-table">
            <template #header>
              <div class="flex justify-between items-center">
                <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                <InputText v-model="filters['global'].value" placeholder="Search duplicate product discount records..." />
              </div>
            </template>
            <template #empty>No invalid product discount records found.</template>
            <Column field="row" header="Row" style="min-width: 6rem">
              <template #body="{ data }">{{ data.row }}</template>
            </Column>
            <Column field="data.product_code" header="Product Code" style="min-width: 10rem">
              <template #body="{ data }">{{ data.data.product_code }}</template>
            </Column>
            <Column field="data.customer_group" header="User Group" style="min-width: 10rem">
              <template #body="{ data }">{{ data.data.customer_group }}</template>
            </Column>
            <Column field="data.discounted_price" header="Discounted Price" style="min-width: 10rem">
              <template #body="{ data }">{{ data.data.discounted_price }}</template>
            </Column>
            <Column field="data.from_date" header="From Date" style="min-width: 10rem">
              <template #body="{ data }">{{ data.data.from_date }}</template>
            </Column>
            <Column field="data.end_date" header="End Date" style="min-width: 10rem">
              <template #body="{ data }">{{ data.data.end_date }}</template>
            </Column>
          </DataTable>
        </div>

        <!-- Valid Records DataTable -->
        <div v-if="importExport.valid_records > 0 && importExport.valid_data">
          <h3 class="text-lg font-semibold mb-4 text-green-700">
            Inserted Records ({{ importExport.valid_records }})
          </h3>
          <DataTable v-model:filters="filters" :value="importExport.valid_data" paginator :rows="100" dataKey="product_discount_id"
            filterDisplay="menu" :globalFilterFields="['name', 'unit', 'value']" class="th-table">
            <template #header>
              <div class="flex justify-between items-center">
                <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                <InputText v-model="filters['global'].value" placeholder="Search inserted product discount records..." />
              </div>
            </template>
            <template #empty>No inserted product discount records found.</template>
            <Column field="product_id" header="Product ID" style="min-width: 15rem" />
            <Column field="user_group_id" header="User Group ID" style="min-width: 15rem" />
            <Column field="price" header="Price" style="min-width: 15rem" />
            <Column field="from_date" header="From Date" style="min-width: 15rem" />
            <Column field="to_date" header="To Date" style="min-width: 15rem" />
          </DataTable>
        </div>

      </div>
    </div>
  </div>
</template>