<script setup lang="ts">
import { ref, onMounted } from 'vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useToast } from 'primevue/usetoast';
import FileUpload from 'primevue/fileupload';
import ProgressBar from 'primevue/progressbar';
import { useProductAccessoriesStore } from '@/stores/productAccessories';

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
const productAccessoriesStore = useProductAccessoriesStore();
const invalidFilters = ref({ global: { value: null, matchMode: 'contains' } });
const duplicateFilters = ref({ global: { value: null, matchMode: 'contains' } });
const insertedFilters = ref({ global: { value: null, matchMode: 'contains' } });
const validFilters = ref({ global: { value: null, matchMode: 'contains' } });
const updatedFilters = ref({ global: { value: null, matchMode: 'contains' } });
const toast = useToast();
// Accessories Import related states
const selectedFileAccessories = ref<File | null>(null);
const isSavingAccessories = ref(false);
const accessoriesImportResults = ref<any>(null);
const showAccessoriesResults = ref(false);

//===========================================================
// Define Local Methods
//===========================================================
// Handle file selection for accessories import
const handleFileSelectAccessories = (event: any) => {
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
  selectedFileAccessories.value = file;
};

// Handle accessories import (save action)
const handleSaveAccessories = async () => {
  if (!selectedFileAccessories.value) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Please select a file first',
      life: 3000
    });
    return;
  }
  isSavingAccessories.value = true;
  try {
    const formData = new FormData();
    formData.append('csv_file', selectedFileAccessories.value);
    const response = await productAccessoriesStore.productAccessoriessImport(formData);
    accessoriesImportResults.value = {
      total_records: response.total_records || 0,
      valid_records: response.valid_records || 0,
      invalid_records: response.invalid_records || 0,
      updated_records: response.updated_records || 0,
      updated_data: response.updated_data || [],
      duplicate_records: response.duplicated_records || 0,
      duplicate_data: response.duplicated_data || [],
      inserted_count: response.inserted_count || 0,
      valid_data: response.valid_data || [],
      invalid_data: response.invalid_data || [],
      valid_Accessories_data: response.valid_Accessories_data || [],
      mapping_data: response.mapping_data || [],
    };
    showAccessoriesResults.value = true;
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Accessories imported successfully',
      life: 3000
    });
    selectedFileAccessories.value = null;
  } catch (error: any) {
    console.error('Save error:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.message || 'Failed to save file',
      life: 3000
    });
  } finally {
    isSavingAccessories.value = false;
  }
};

// Clear accessories import results
const clearAccessoriesResults = () => {
  accessoriesImportResults.value = null;
  showAccessoriesResults.value = false;
};

// Clear filters
const clearFilter = () => {
  invalidFilters.value = { global: { value: null, matchMode: 'contains' } };
  duplicateFilters.value = { global: { value: null, matchMode: 'contains' } };
  insertedFilters.value = { global: { value: null, matchMode: 'contains' } };
  updatedFilters.value = { global: { value: null, matchMode: 'contains' } };
};

//===========================================================
// Lifecycle Hooks
//===========================================================
onMounted(() => {
  // Any initialization logic here (if needed)
});
</script>

<template>
  <div class="accessories-import p-6">
    <!-- Accessories Import Section -->
    <div class="bg-white rounded-lg p-6 shadow-md">
      <h2 class="text-xl font-semibold mb-2">Import Product Accessories CSV data</h2>
      <p class="text-gray-600 mb-4">Upload a CSV file to start importing product accessories data</p>
      <div class="flex flex-col gap-4">
        <FileUpload mode="basic" name="importAccessoriesFile" accept=".csv" :maxFileSize="10000000"
          @select="handleFileSelectAccessories" :auto="false" chooseLabel="Select CSV File" />
        <div v-if="selectedFileAccessories" class="flex flex-col gap-4">
          <div class="flex items-center gap-2 p-3 bg-gray-50 rounded">
            <i class="pi pi-file text-gray-500"></i>
            <span class="text-gray-700">{{ selectedFileAccessories.name }}</span>
          </div>
          <div v-if="isSavingAccessories" class="w-full">
            <ProgressBar mode="indeterminate" style="height: 8px" class="w-full" />
            <p class="text-sm text-gray-600 mt-2 text-center">Importing product accessories data...</p>
          </div>
          <Button icon="pi pi-save" :label="isSavingAccessories ? 'Saving...' : 'Import Product Accessories'" severity="success"
            @click="handleSaveAccessories" :loading="isSavingAccessories" :disabled="isSavingAccessories" class="p-button-md" />
        </div>
      </div>

      <!-- Accessories Import Results Section -->
      <div v-if="showAccessoriesResults && accessoriesImportResults" class="bg-white rounded-lg p-6 shadow-md mt-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold">Product Accessories Import Results</h2>
          <Button icon="pi pi-times" label="Clear Results" severity="secondary" outlined @click="clearAccessoriesResults" />
        </div>

        <!-- Summary Statistics -->
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div class="text-2xl font-bold text-blue-600">{{ accessoriesImportResults.total_records || 0 }}</div>
            <div class="text-sm text-blue-800">Total Records</div>
          </div>
          <div class="bg-green-50 p-4 rounded-lg border border-green-200">
            <div class="text-2xl font-bold text-green-600">{{ accessoriesImportResults.valid_records || 0 }}</div>
            <div class="text-sm text-green-800">Valid Records</div>
          </div>
          <div class="bg-red-50 p-4 rounded-lg border border-red-200">
            <div class="text-2xl font-bold text-red-600">{{ accessoriesImportResults.invalid_records || 0 }}</div>
            <div class="text-sm text-red-800">Invalid Records</div>
          </div>
          <div class="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <div class="text-2xl font-bold text-orange-600">{{ accessoriesImportResults.updated_records || 0 }}</div>
            <div class="text-sm text-orange-800">Updated Records</div>
          </div>
          <div class="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div class="text-2xl font-bold text-purple-600">{{ accessoriesImportResults.valid_records || 0 }}</div>
            <div class="text-sm text-purple-800">Inserted Records</div>
          </div>
        </div>

        <!-- Invalid Records DataTable -->
        <div v-if="accessoriesImportResults.invalid_records > 0 && accessoriesImportResults.invalid_data" class="mb-6">
          <h3 class="text-lg font-semibold mb-4 text-red-700">Invalid Records ({{ accessoriesImportResults.invalid_records
          }})</h3>
          <DataTable v-model:filters="invalidFilters" :value="accessoriesImportResults.invalid_data" paginator :rows="100"
            dataKey="row" filterDisplay="menu"
            :globalFilterFields="['data.parent_product', 'data.web_product_range', 'data.item_code', 'data.price']" class="th-table">
            <template #header>
              <div class="flex justify-between items-center">
                <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                <InputText v-model="invalidFilters['global'].value" placeholder="Search invalid product accessories records..." />
              </div>
            </template>
            <template #empty>No invalid product accessories records found.</template>
            <Column field="row" header="Row" style="min-width: 6rem"/>
            <Column header="Errors" style="min-width: 15rem" >
              <template #body="{ data }">
                <div class="text-red-600 text-sm">
                  <span v-for="error in data.errors" :key="error">{{ error }}<br></span>
                </div>
              </template>
            </Column>
            <Column field="data.parent_product" header="ParentProduct" style="min-width: 10rem"/>
            <Column field="data.web_product_range" header="Product Range" style="min-width: 10rem"/>
            <Column field="data.item_code" header="Item Code" style="min-width: 10rem"/>
            <Column field="data.price" header="Price" style="min-width: 15rem"/>
          </DataTable>
        </div>

        <!-- Duplicate Records DataTable -->
        <div v-if="accessoriesImportResults.duplicate_records > 0 && accessoriesImportResults.duplicate_data" class="mb-6">
          <h3 class="text-lg font-semibold mb-4 text-orange-700">
            Duplicate Records ({{ accessoriesImportResults.duplicate_records }})
          </h3>
          <DataTable v-model:filters="duplicateFilters" :value="accessoriesImportResults.duplicate_data" paginator :rows="100"
            dataKey="Accessories_id" filterDisplay="menu"
            :globalFilterFields="['web_product', 'product_variant', 'Accessories_group', 'accessories', 'sort_order']" class="th-table">
            <template #header>
              <div class="flex justify-between items-center">
                <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                <InputText v-model="duplicateFilters['global'].value" placeholder="Search duplicate product accessories records..." />
              </div>
            </template>
            <template #empty>No duplicate product accessories records found.</template>
            <Column field="web_product" header="Product" style="min-width: 15rem" />
            <Column field="product_variant" header="Variant" style="min-width: 15rem" />
            <Column field="Accessories_group" header="Accessories Group" style="min-width: 15rem" />
            <Column field="accessories" header="Accessories" style="min-width: 15rem" />
            <Column field="sort_order" header="Sort Order" style="min-width: 5rem" />
          </DataTable>
        </div>

        <!-- Updated Records DataTable -->
        <div v-if="accessoriesImportResults.updated_records > 0 && accessoriesImportResults.updated_data" class="mb-6">
          <h3 class="text-lg font-semibold mb-4 text-green-600">
            Updated Records ({{ accessoriesImportResults.updated_records }})
          </h3>
          <DataTable v-model:filters="updatedFilters" :value="accessoriesImportResults.updated_data" paginator :rows="100"
            dataKey="Accessories_id" filterDisplay="menu"
            :globalFilterFields="['parent_product', 'web_product_range', 'item_code', 'price']" class="th-table">
            <template #header>
              <div class="flex justify-between items-center">
                <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                <InputText v-model="updatedFilters['global'].value" placeholder="Search updated product accessories records..." />
              </div>
            </template>
            <template #empty>No updated product accessories records found.</template>
            <Column field="row" header="Row" style="min-width: 6rem">
                    <template #body="{ data }">
                        {{ data.row }}
                    </template>
                </Column>
            <Column field="data.parent_product" header="Parent Product" style="min-width: 10rem">
                    <template #body="{ data }">
                        {{ data.data.parent_product }}
                    </template>
                </Column>
                <Column field="data.web_product_range" header="Product Range" style="min-width: 15rem">
                    <template #body="{ data }">
                        {{ data.data.web_product_range }}
                    </template>
                </Column>
                <Column field="data.item_code" header="Item Code" style="min-width: 15rem">
                    <template #body="{ data }">
                        {{ data.data.item_code }}
                    </template>
                </Column>
                <Column field="data.price" header="Price" style="min-width: 15rem">
                    <template #body="{ data }">
                        {{ data.data.price }}
                    </template>
                </Column>
          </DataTable>
        </div>

        <!-- inserted Records DataTable -->
        <!-- <div v-if="accessoriesImportResults.inserted_records > 0 && accessoriesImportResults.inserted_data">
          <h3 class="text-lg font-semibold mb-4 text-green-700">
            Valid Records ({{ accessoriesImportResults.inserted_records }})
          </h3>
          <DataTable v-model:filters="insertedFilters" :value="accessoriesImportResults.inserted_data" paginator :rows="100"
            dataKey="accessories" filterDisplay="menu" :globalFilterFields="['web_product', 'product_variant', 'Accessories_group', 'accessories', 'sort_order']"
            class="th-table">
            <template #header>
              <div class="flex justify-between items-center">
                <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                <InputText v-model="insertedFilters['global'].value" placeholder="Search valid product accessories content records..." />
              </div>
            </template>
            <template #empty>No valid product accessories content records found.</template>
            <Column field="web_product" header="Product" style="min-width: 15rem" />
            <Column field="product_variant" header="Variant" style="min-width: 15rem" />
            <Column field="Accessories_group" header="Accessories Group" style="min-width: 15rem" />
            <Column field="accessories" header="Accessories" style="min-width: 15rem" />
            <Column field="sort_order" header="Sort Order" style="min-width: 5rem" />
          </DataTable>
        </div> -->

        <!-- Valid Records DataTable -->
        <!-- <div v-if="accessoriesImportResults.valid_records > 0 && accessoriesImportResults.valid_data">
          <h3 class="text-lg font-semibold mb-4 text-green-700">
            Valid Records ({{ accessoriesImportResults.valid_records }})
          </h3>
          <DataTable v-model:filters="validFilters" :value="accessoriesImportResults.valid_data" paginator :rows="100"
            dataKey="product_accessories_id" filterDisplay="menu" :globalFilterFields="['parent_product', 'web_product_range', 'item_code', 'price']"
            class="th-table">
            <template #header>
              <div class="flex justify-between items-center">
                <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                <InputText v-model="validFilters['global'].value" placeholder="Search valid product accessories content records..." />
              </div>
            </template>
            <template #empty>No valid product accessories records found.</template>
            <Column field="parent_product" header="Parent Product" style="min-width: 15rem">
              <template #body="{ data }">
                {{ data.parent_product }}
              </template>
            </Column>
            <Column field="web_product_range" header="Product Range" style="min-width: 15rem">
              <template #body="{ data }">
                {{ data.web_product_range }}
              </template>
            </Column>
            <Column field="item_code" header="Item Code" style="min-width: 15rem">
              <template #body="{ data }">
                {{ data.item_code }}
              </template>
            </Column>
            <Column field="price" header="Price" style="min-width: 15rem">
              <template #body="{ data }">
                {{ data.price }}
              </template>
            </Column>
          </DataTable>
        </div> -->

      </div>
    </div>
  </div>
</template>

<style scoped>
.accessories-import {
  padding: 2rem;
}

.p-datatable .p-datatable-thead>tr>th {
  background-color: var(--surface-100);
}

.p-datatable .p-datatable-tbody>tr>td {
  padding: 1rem;
}
</style>
