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
import { useItemStore } from '@/stores/item';
import ItemImportResponse from '@/models/ItemImportResponse';
import { resolveMediaImage } from '@/utils/mediaUrl';
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
const ItemStore = useItemStore();
const { importExport, fb } = storeToRefs(ItemStore);

const toast = useToast();
//  item Import related states
const selectedFileItems = ref<File | null>(null);
const filters = ref({ global: { value: null, matchMode: 'contains' } })
const showItemResults = computed(() => {
  return (
    importExport.value.invalid_records > 0 ||
    importExport.value.updated_records > 0 ||
    importExport.value.valid_records > 0
  );
});

//===========================================================
// Define Local Methods
//===========================================================
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
  selectedFileItems.value = file;
};

// Handle option import (save action)
const handleSave = async () => {
  if (!selectedFileItems.value) {
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
    formData.append('csv_file', selectedFileItems.value);
    await ItemStore.importItems(formData);
    console.log('importExport after import items vue page', importExport.value);
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: ' Item imported successfully',
      life: 3000
    });
    selectedFileItems.value = null;
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

// Clear option import results
const clearItemResults = () => {
  importExport.value = new ItemImportResponse();
};

// Clear filters
const clearFilter = () => {
  filters.value = { global: { value: null, matchMode: 'contains' } };
};

//===========================================================
// Lifecycle Hooks
//===========================================================
onMounted(() => {
  console.log('import page', importExport);

  // Any initialization logic here (if needed)
});
// Helper: Lookup product/variant names from mapping_data which uses names as keys and ids as values
const getProductName = (productId: number | string) => {
  const map = importExport.value?.mapping_data?.productMap || {};
  for (const [name, id] of Object.entries(map)) {
    if (id === productId || String(id) === String(productId)) return name;
  }
  return productId;
};

const getVariantName = (variantId: number | string) => {
  const map = importExport.value?.mapping_data?.variantMap || {};
  for (const [name, id] of Object.entries(map)) {
    if (id === variantId || String(id) === String(variantId)) return name;
  }
  return variantId;
};

const formatImageData = (imageData: unknown) => resolveMediaImage(imageData);
</script>

<template>
  <div class="option-import pt-6">
    <!--  Items Import Section -->
    <div class="bg-white rounded-lg p-6 shadow-md">
      <h2 class="text-xl font-semibold mb-2">Import Items CSV data</h2>
      <p class="text-gray-600 mb-4">Upload a CSV file to start importing items data</p>
      <div class="flex flex-col gap-4">
        <FileUpload mode="basic" name="importItemFile" accept=".csv" :maxFileSize="8000000" @select="handleFileSelect"
          :auto="false" chooseLabel="Select CSV File" />
        <div v-if="selectedFileItems" class="flex flex-col gap-4">
          <div class="flex items-center gap-2 p-3 bg-gray-50 rounded">
            <i class="pi pi-file text-gray-500"></i>
            <span class="text-gray-700">{{ selectedFileItems.name }}</span>
          </div>
          <div v-if="fb.loading['item.import']" class="w-full">
            <ProgressBar mode="indeterminate" style="height: 8px" class="w-full" />
            <p class="text-sm text-gray-600 mt-2 text-center">Importing item data...</p>
          </div>
          <Button :label="fb.loading['item.import'] ? 'Importing...' : 'Import  item'" severity="success"
            :icon="fb.loading['item.import'] ? 'pi pi-spinner pi-spin' : 'pi pi-save'" @click="handleSave"
            :loading="fb.loading['item.import']" :disabled="fb.loading['item.import']" class="p-button-md" />
        </div>
      </div>

      <!--  items Import Results Section -->
      <div v-if="showItemResults" class="bg-white rounded-lg p-6 shadow-md mt-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold"> items Import Results</h2>
          <Button icon="pi pi-times" label="Clear Results" severity="secondary" outlined @click="clearItemResults" />
        </div>

        <!-- Summary Statistics -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div class="text-2xl font-bold text-blue-600">{{ importExport.total_records || 0 }}</div>
            <div class="text-sm text-blue-800">Total Records</div>
          </div>
          <div class="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <div class="text-2xl font-bold text-orange-600">{{ importExport.invalid_records || 0 }}</div>
            <div class="text-sm text-orange-800">Invalid Records</div>
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
            filterDisplay="menu"
            :globalFilterFields="['data.product_code', 'data.product_variant', 'data.item_code', 'data.km_item_id']"
            class="th-table">
            <template #header>
              <div class="flex justify-between items-center">
                <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                <InputText v-model="filters['global'].value" placeholder="Search invalid  item records..." />
              </div>
            </template>
            <template #empty>No invalid item records found.</template>
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
            <Column field="data.product_code" header="Product Code" style="min-width: 15rem">
              <template #body="{ data }">
                {{ data.data.product_code }}
              </template>
            </Column>
            <Column field="data.product_variant" header="Product Variant" style="min-width: 15rem">
              <template #body="{ data }">
                {{ data.data.product_variant }}
              </template>
            </Column>
            <Column field="data.item_code" header="Item Code" style="min-width: 15rem">
              <template #body="{ data }">
                {{ data.data.item_code }}
              </template>
            </Column>
            <Column field="data.km_item_id" header="km_item_id" style="min-width: 15rem">
              <template #body="{ data }">
                {{ data.data.km_item_id }}
              </template>
            </Column>
            <Column field="data.description" header="Description" style="min-width: 15rem">
              <template #body="{ data }">
                {{ data.data.description }}
              </template>
            </Column>
            <Column field="data.web_sku" header="Web SKU" style="min-width: 15rem">
              <template #body="{ data }">
                {{ data.data.web_sku }}
              </template>
            </Column>
          </DataTable>
        </div>

        <!-- Duplicate Records DataTable -->
        <div v-if="importExport.duplicated_records > 0 && importExport.duplicated_data" class="mb-6">
          <h3 class="text-lg font-semibold mb-4 text-orange-700">
            Duplicate Records ({{ importExport.duplicated_records }})
          </h3>
          <DataTable v-model:filters="filters" :value="importExport.duplicated_data" paginator :rows="100"
            dataKey="option_id" filterDisplay="menu"
            :globalFilterFields="['data.product_code', 'data.product_variant', 'data.item_code', 'data.km_item_id', 'data.description', 'data.web_sku']"
            class="th-table">
            <template #header>
              <div class="flex justify-between items-center">
                <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                <InputText v-model="filters['global'].value" placeholder="Search duplicate  item records..." />
              </div>
            </template>
            <template #empty>No duplicate item records found.</template>
            <Column field="quote_image" header="Image" style="min-width: 8rem">
              <template #body="{ data }">
                <img :src="formatImageData(data.quote_image)" alt="Image" style="width: 80px; height: 80px;" />
              </template>
            </Column>
            <Column field="product_id" header="Product Name" style="min-width: 15rem">
              <template #body="{ data }">{{ getProductName(data.product_id) }}</template>
            </Column>
            <Column field="product_variant_id" header="Product Variant Name" style="min-width: 15rem">
              <template #body="{ data }">{{ getVariantName(data.product_variant_id) }}</template>
            </Column>
            <Column field="item_code" header="item_code" style="min-width: 15rem" />
            <Column field="km_item_id" header="km_item_id" style="min-width: 15rem" />
            <Column field="description" header="description" style="min-width: 15rem" />
            <Column field="web_sku" header="web_sku" style="min-width: 15rem" />
          </DataTable>
        </div>

        <!-- Updated Records DataTable -->
        <div v-if="importExport.updated_records > 0 && importExport.updated_data" class="mb-6">
          <h3 class="text-lg font-semibold mb-4 text-orange-700">
            Updated Records ({{ importExport.updated_records }})
          </h3>
          <DataTable v-model:filters="filters" :value="importExport.updated_data" paginator :rows="100"
            dataKey="option_id" filterDisplay="menu"
            :globalFilterFields="['product_id', 'product_variant_id', 'item_code', 'km_item_id', 'description', 'web_sku']"
            class="th-table">
            <template #header>
              <div class="flex justify-between items-center">
                <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                <InputText v-model="filters['global'].value" placeholder="Search updated  item records..." />
              </div>
            </template>
            <template #empty>No updated item records found.</template>
            <Column field="product_id" header="Product Name" style="min-width: 15rem">
              <template #body="{ data }">{{ getProductName(data.product_id) }}</template>
            </Column>
            <Column field="product_variant_id" header="Product Variant Name" style="min-width: 15rem">
              <template #body="{ data }">{{ getVariantName(data.product_variant_id) }}</template>
            </Column>
            <Column field="item_code" header="item_code" style="min-width: 15rem" />
            <Column field="km_item_id" header="km_item_id" style="min-width: 15rem" />
            <Column field="description" header="description" style="min-width: 15rem" />
            <Column field="web_sku" header="web_sku" style="min-width: 15rem" />
          </DataTable>
        </div>

        <!-- Valid Records DataTable -->
        <div v-if="importExport.valid_records > 0 && importExport.valid_data">
          <h3 class="text-lg font-semibold mb-4 text-green-700">
            Inserted Records ({{ importExport.valid_records }})
          </h3>
          <DataTable v-model:filters="filters" :value="importExport.valid_data" paginator :rows="100" dataKey="_item_id"
            filterDisplay="menu" :globalFilterFields="['item_code', 'km_item_id', 'description']" class="th-table">
            <template #header>
              <div class="flex justify-between items-center">
                <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                <InputText v-model="filters['global'].value" placeholder="Search inserted  item records..." />
              </div>
            </template>
            <template #empty>No inserted item records found.</template>
            <Column field="quote_image" header="Image" style="min-width: 8rem">
              <template #body="{ data }">
                <img :src="formatImageData(data.quote_image)" alt="Image" style="width: 80px; height: 80px;" />
              </template>
            </Column>
            <!-- product name -->
            <Column field="product_id" header="Product Name" style="min-width: 15rem">
              <template #body="{ data }">{{ getProductName(data.product_id) }}</template>
            </Column>
            <Column field="product_variant_id" header="Product Variant Name" style="min-width: 15rem">
              <template #body="{ data }">{{ getVariantName(data.product_variant_id) }}</template>
            </Column>
            <Column field="item_code" header="item_code" style="min-width: 15rem" />
            <Column field="km_item_id" header="km_item_id" style="min-width: 15rem" />
            <Column field="description" header="description" style="min-width: 15rem" />
            <Column field="web_sku" header="web_sku" style="min-width: 15rem" />
          </DataTable>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.p-datatable .p-datatable-thead>tr>th {
  background-color: var(--surface-100);
}

.p-datatable .p-datatable-tbody>tr>td {
  padding: 1rem;
}
</style>
