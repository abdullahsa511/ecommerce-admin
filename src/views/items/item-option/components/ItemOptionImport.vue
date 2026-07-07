<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useToast } from 'primevue/usetoast';
import FileUpload from 'primevue/fileupload';
import ProgressBar from 'primevue/progressbar';
import { storeToRefs } from 'pinia';
import { useItemOptionStore } from '@/stores/itemOption';
import ItemOptionImportResponse from '@/models/ItemOptionImport';

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
const itemOptionStore = useItemOptionStore();
const { importExport, fb } = storeToRefs(itemOptionStore);

const toast = useToast();
// Options item Import related states
const selectedFile = ref<File | null>(null);
const filters = ref({ global: { value: null, matchMode: 'contains' } })
const showResults = computed(() => {
  return (
    importExport.value.invalid_records > 0 ||
    importExport.value.updated_records > 0 ||
    importExport.value.valid_records  > 0
  );
});

// Handle file selection for option import
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

// Handle option import (save action)
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
  try {
    const formData = new FormData();
    formData.append('csv_file', selectedFile.value);
    await itemOptionStore.importItemOptions(formData);
    console.log('importExport after import item options vue page', importExport.value);
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Options Item imported successfully',
      life: 3000
    });
    selectedFile.value = null;
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

// Clear option import results
const clearResults = () => {
  importExport.value = new ItemOptionImportResponse();
};

// Clear filters
const clearFilter = () => {
  filters.value = { global: { value: null, matchMode: 'contains' } };
};
// itemIdToIdMap: {
//     [key: string]: number;
// };
// productVariantIdToIdMap: {
//     [key: string]: number;
// };
// productOptionGroupIdToIdMap: {
//     [key: string]: number;
// };
// productIdToIdMap: {
//     [key: string]: number;
// };
// optionIdToIdMap: {
//     [key: string]: number;
// };
// typeIdToIdMap: {
//     [key: string]: number;
// };
const getProductName = (productId: number | string) => {
  const map = importExport.value?.mapping_data?.productIdToIdMap || {};
  for (const [name, id] of Object.entries(map)) {
    if (id === productId || String(id) === String(productId)) return name;
  }
  return productId;
};

const getVariantName = (variantId: number | string) => {
  const map = importExport.value?.mapping_data?.productVariantIdToIdMap || {};
  for (const [name, id] of Object.entries(map)) {
    if (id === variantId || String(id) === String(variantId)) return name;
  }
  return variantId;
};
const getOptionGroupName = (optionGroupId: number | string) => {
  const map = importExport.value?.mapping_data?.productOptionGroupIdToIdMap || {};
  for (const [name, id] of Object.entries(map)) {
    if (id === optionGroupId || String(id) === String(optionGroupId)) return name;
  }
  return optionGroupId;
};

const getOptionName = (optionId: number | string) => {
  const map = importExport.value?.mapping_data?.optionIdToIdMap || {};
  for (const [name, id] of Object.entries(map)) {
    if (id === optionId || String(id) === String(optionId)) return name;
  }
  return optionId;
};

const getTypeName= (typeId: number | string) => {
  const map = importExport.value?.mapping_data?.typeIdToIdMap || {};
  for (const [name, id] of Object.entries(map)) {
    if (id === typeId || String(id) === String(typeId)) return name;
  }
  return typeId;
};

onMounted(() => {
  console.log('import page',importExport);
  
  // Any initialization logic here (if needed)
});
</script>

<template>
  <div class="pt-6">
    <!-- Options Items Import Section -->
    <div class="bg-white rounded-lg p-6 shadow-md">
      <h2 class="text-xl font-semibold mb-2">Import Item Options CSV data</h2>
      <p class="text-gray-600 mb-4">Upload a CSV file to start importing item option data</p>
      <div class="flex flex-col gap-4">
        <FileUpload mode="basic" name="importItemFile" accept=".csv" :maxFileSize="20000000" @select="handleFileSelect"
          :auto="false" chooseLabel="Select CSV File" />
        <div v-if="selectedFile" class="flex flex-col gap-4">
          <div class="flex items-center gap-2 p-3 bg-gray-50 rounded">
            <i class="pi pi-file text-gray-500"></i>
            <span class="text-gray-700">{{ selectedFile.name }}</span>
          </div>
          <div v-if="fb.loading['itemOption.import']" class="w-full">
            <ProgressBar mode="indeterminate" style="height: 8px" class="w-full" />
            <p class="text-sm text-gray-600 mt-2 text-center">Importing item option data...</p>
          </div>
          <Button icon="pi pi-save" :label="fb.loading['itemOption.import'] ? 'Importing...' : 'Import item option'"
            severity="success" @click="handleSave" :loading="fb.loading['itemOption.import']"
            :disabled="fb.loading['itemOption.import']" class="p-button-md" />
        </div>
      </div>

      <!-- Options items Import Results Section -->
      <div v-if="showResults" class="bg-white rounded-lg p-6 shadow-md mt-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold">Item options Import Results</h2>
          <Button icon="pi pi-times" label="Clear Results" severity="secondary" outlined
            @click="clearResults" />
        </div>

        <!-- Summary Statistics -->
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div class="text-2xl font-bold text-blue-600">{{ importExport.total_records || 0 }}</div>
            <div class="text-sm text-blue-800">Total Records</div>
          </div>
          <div class="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <div class="text-2xl font-bold text-orange-600">{{ importExport.invalid_records || 0 }}</div>
            <div class="text-sm text-orange-800">Invalid Records</div>
          </div>
          <div class="bg-orange-50 p-4 rounded-lg border border-green-200">
            <div class="text-2xl font-bold text-green-600">{{ importExport.updated_records || 0 }}</div>
            <div class="text-sm text-green-800">Records Updated</div>
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
          <DataTable v-model:filters="filters" :value="importExport.invalid_data" paginator :rows="20" dataKey="row"
            filterDisplay="menu" :globalFilterFields="['data.web_product', 'data.web_product_variant', 'data.option_group', 'data.option', 'data.item_code', 'data.description']" class="th-table">
            <template #header>
              <div class="flex justify-between items-center">
                <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                <InputText v-model="filters['global'].value" placeholder="Search invalid options item records..." />
              </div>
            </template>
            <template #empty>No invalid options item records found.</template>
            <Column field="row" header="Row" style="min-width: 6rem">
              <template #body="{ data }">
                {{ data.row }}
              </template>
            </Column>
            <Column field="errors" header="Errors" style="min-width: 15rem">
              <template #body="{ data }">
                <div class="text-red-600 text-sm">
                  {{ data.errors }}
                </div>
              </template>
            </Column>
            <Column field="data.web_product" header="Product" style="min-width: 15rem">
              <template #body="{ data }">
                {{ data.data.web_product }}
              </template>
            </Column>
            <Column field="data.web_product_variant" header="Variant" style="min-width: 10rem">
              <template #body="{ data }">
                {{ data.data.web_product_variant }}
              </template>
            </Column>
            <Column field="data.option_group" header="Option Group" style="min-width: 15rem">
              <template #body="{ data }">
                {{ data.data.option_group }}
              </template>
            </Column>
            <Column field="data.option" header="Option" style="min-width: 10rem">
              <template #body="{ data }">
                {{ data.data.option }}
              </template>
            </Column>
            <Column field="data.item_code" header="Item Code" style="min-width: 10rem">
              <template #body="{ data }">
                {{ data.data.item_code }}
              </template>
            </Column>
            <Column field="data.description" header="Description" style="min-width: 10rem">
              <template #body="{ data }">
                {{ data.data.description }}
              </template>
            </Column>
          </DataTable>
        </div>

        <!-- Duplicate Records DataTable -->
        <div v-if="importExport.duplicated_records > 0 && importExport.duplicated_data">
          <h3 class="text-lg font-semibold mb-4 text-orange-700">
            Duplicated Records ({{ importExport.duplicated_records }})
          </h3>
          <DataTable v-model:filters="filters" :value="importExport.duplicated_data" paginator :rows="100" dataKey="options_item_id"
            filterDisplay="menu" 
            :globalFilterFields="['name', 'option_id', 'product_id', 'product_variant_id', 'product_option_group_id', 'type_id', 'value', 'meta_description']" class="th-table">
            <template #header>
              <div class="flex justify-between items-center">
                <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                <InputText v-model="filters['global'].value" placeholder="Search duplicated options item records..." />
              </div>
            </template>
            <template #empty>No duplicated option content records found.</template>
            <Column field="name" header="Item Option" style="min-width: 15rem" />
            <Column field="product_id" header="Product" style="min-width: 15rem">
              <template #body="{ data }">{{ getProductName(data.product_id) }}</template>
            </Column>
            <Column field="product_variant_id" header="Variant" style="min-width: 15rem">
              <template #body="{ data }">{{ getVariantName(data.product_variant_id) }}</template>
            </Column>
            <Column field="product_option_group_id" header="Option Group" style="min-width: 15rem">
              <template #body="{ data }">{{ getOptionGroupName(data.product_option_group_id) }}</template>
            </Column>
            <Column field="option_id" header="Option" style="min-width: 15rem">
              <template #body="{ data }">{{ getOptionName(data.option_id) }}</template>
            </Column>
            <Column field="type_id" header="Type" style="min-width: 15rem">
              <template #body="{ data }">{{ getTypeName(data.type_id) }}</template>
            </Column>
            <Column field="value" header="Value" style="min-width: 15rem" />
            <Column field="meta_description" header="Meta Description" style="min-width: 15rem" />
          </DataTable>
        </div>

        <!-- Updated Records DataTable -->
        <div v-if="importExport.updated_records > 0 && importExport.updated_data" class="mb-6">
          <h3 class="text-lg font-semibold mb-4 text-orange-700">
            Updated Records ({{ importExport.updated_records }})
          </h3>
          <DataTable v-model:filters="filters" :value="importExport.updated_data" paginator :rows="100"
            dataKey="option_id" filterDisplay="menu"
            :globalFilterFields="['web_product', 'web_product_variant', 'option_group', 'option', 'item_code', 'description']" class="th-table">
            <template #header>
              <div class="flex justify-between items-center">
                <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                <InputText v-model="filters['global'].value" placeholder="Search updated options item records..." />
              </div>
            </template>
            <template #empty>No updated options item records found.</template>
            <Column field="option" header="Option" style="min-width: 15rem">
              <template #body="{ data }">{{ data.option }}</template>
            </Column>
            <Column field="item_code" header="Item Code" style="min-width: 15rem">
              <template #body="{ data }">{{ data.item_code }}</template>
            </Column>
            <Column field="web_product" header="Product" style="min-width: 15rem">
              <template #body="{ data }">{{ data.web_product }}</template>
            </Column>
            <Column field="web_product_variant" header="Variant" style="min-width: 15rem">
              <template #body="{ data }">{{ data.web_product_variant }}</template>
            </Column>
            <Column field="option_group" header="Option Group" style="min-width: 15rem">
              <template #body="{ data }">{{ data.option_group }}</template>
            </Column>
            <Column field="description" header="Description" style="min-width: 15rem">
              <template #body="{ data }">{{ data.description }}</template>
            </Column>
          </DataTable>
        </div>

        <!-- Valid Records DataTable -->
        <div v-if="importExport.valid_records > 0 && importExport.valid_data">
          <h3 class="text-lg font-semibold mb-4 text-green-700">
            Valid Records ({{ importExport.valid_records }})
          </h3>
          <DataTable v-model:filters="filters" :value="importExport.valid_data" paginator :rows="100" dataKey="options_item_id"
            filterDisplay="menu" 
            :globalFilterFields="['web_product', 'web_product_variant', 'option_group', 'option', 'item_code', 'description']" class="th-table">
            <template #header>
              <div class="flex justify-between items-center">
                <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                <InputText v-model="filters['global'].value" placeholder="Search valid options item records..." />
              </div>
            </template>
            <template #empty>No valid option content records found.</template>
            <Column field="option" header="Option" style="min-width: 15rem">
              <template #body="{ data }">{{ data.option }}</template>
            </Column>
            <Column field="item_code" header="Item Code" style="min-width: 15rem">
              <template #body="{ data }">{{ data.item_code }}</template>
            </Column>
            <Column field="web_product" header="Product" style="min-width: 15rem">
              <template #body="{ data }">{{ data.web_product }}</template>
            </Column>
            <Column field="web_product_variant" header="Variant" style="min-width: 15rem">
              <template #body="{ data }">{{ data.web_product_variant }}</template>
            </Column>
            <Column field="option_group" header="Option Group" style="min-width: 15rem">
              <template #body="{ data }">{{ data.option_group }}</template>
            </Column>
            <Column field="description" header="Description" style="min-width: 15rem">
              <template #body="{ data }">{{ data.description }}</template>
            </Column>
          </DataTable>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
