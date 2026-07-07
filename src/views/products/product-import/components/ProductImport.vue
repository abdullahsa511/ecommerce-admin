<script setup>
import { formatImportImageData } from '@/utils/mediaUrl';
import { computed, ref } from 'vue';
import { useProductStore } from '@/stores/product';
import { useToast } from 'primevue/usetoast';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import FileUpload from 'primevue/fileupload';
import ProgressBar from 'primevue/progressbar';
import Message from 'primevue/message';
import { storeToRefs } from 'pinia';

const toast = useToast();
const productStore = useProductStore();
const { fb } = storeToRefs(productStore);
// Products Import
const selectedFileProducts = ref(null);
const isSavingProducts = ref(false);
const productsImportResults = ref(null);
const showProductsResults = ref(false);

// Products Sort Order by Category Import
const selectedFileProductsSortOrderByCategory = ref(null);
const isSavingProductsSortOrderByCategory = ref(false);
const productsImportResultsSortOrderByCategory = ref(null);
const showProductsResultsSortOrderByCategory = ref(false);

// Filters for datatables
const filters = ref({
  global: { value: null, matchMode: 'contains' }
});

const globalImportMessages = computed(() => {
  const messages = fb.value?.errors?.['product.import']?.global_message;
  if (!messages) return [];
  return Array.isArray(messages) ? messages : [messages];
});

// Handlers for Products Import
const handleFileSelectProducts = (event) => {
  const file = event.files[0];
  if (!file) return;

  if (!file.name.endsWith('.csv')) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Please select a CSV file', life: 3000 });
    return;
  }

  selectedFileProducts.value = file;
};

const handleSaveProducts = async () => {
  // alert('handleSaveProducts');
  if (!selectedFileProducts.value) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Please select a file first', life: 3000 });
    return;
  }

  isSavingProducts.value = true;
  try {
    const formData = new FormData();
    formData.append('csv_file', selectedFileProducts.value);
    formData.append('type', 'import');
    formData.append('status', 'pending');

    const response = await productStore.createProductImport(formData);
    console.log('response product import:', response);
    // console.log('product response:', response);
    // Store the import results
    // productsImportResults.value = response;
    productsImportResults.value = {
      success: {
        total_records: response.total_records,
        valid_records: response.valid_records,
        invalid_records: response.invalid_records,
        updated_records: response.updated_records,
        inserted_count: response.inserted_count,
        valid_data: response.products ? response.valid_data : [],
        valid_categpries_data: response.categories ? response.categories.valid_data : [],
        invalid_data: response.invalid_data,
        // updated_data: response.updated_data,
        updated_data: response.updated_data,
        duplicated_records: response.duplicated_records,
        duplicated_data: response.duplicated_data,
      }
    };
    showProductsResults.value = true;
    console.log('productsImportResults.value:', productsImportResults.value);

    toast.add({ severity: 'success', summary: 'Success', detail: 'Products imported successfully', life: 3000 });
    selectedFileProducts.value = null;
  } catch (error) {
    console.error('Save error:', error);
    toast.add({ severity: 'error', summary: 'Error', detail: error.message || 'Failed to save file', life: 3000 });
  } finally {
    isSavingProducts.value = false;
  }
};

// Handlers for Products Sort Order by Category Import
const handleFileSelectProductsSortOrderByCategory = (event) => {
  const file = event.files[0];
  if (!file) return;
  if (!file.name.endsWith('.csv')) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Please select a CSV file', life: 3000 });
    return;
  }
  selectedFileProductsSortOrderByCategory.value = file;
};

const handleImportProductsSortOrderByCategory = async () => {
  if (!selectedFileProductsSortOrderByCategory.value) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Please select a file first', life: 3000 });
    return;
  }
  isSavingProductsSortOrderByCategory.value = true;
  try {
    const formData = new FormData();
    formData.append('csv_file', selectedFileProductsSortOrderByCategory.value);
    formData.append('type', 'import');
    formData.append('status', 'pending');

    const response = await productStore.importProductsSortOrderByCategory(formData);
    console.log('response product sort order by category import:', response);
    productsImportResultsSortOrderByCategory.value = response;
    showProductsResultsSortOrderByCategory.value = true;
    toast.add({ severity: 'success', summary: 'Success', detail: 'Products sort order by category imported successfully', life: 3000 });
    selectedFileProductsSortOrderByCategory.value = null;
  } catch (error) {
    console.error('Save error:', error);
    toast.add({ severity: 'error', summary: 'Error', detail: error.message || 'Failed to save file', life: 3000 });
  } finally {
    isSavingProductsSortOrderByCategory.value = false;
  }
};

// Clear Products Sort Order by Category Results
const clearProductsSortOrderByCategoryResults = () => {
  productsImportResultsSortOrderByCategory.value = null;
  showProductsResultsSortOrderByCategory.value = false;
};

// Clear filters and results
const clearFilter = () => {
  filters.value.global.value = null;
};

const clearProductsResults = () => {
  productsImportResults.value = null;
  showProductsResults.value = false;
};


const formatImageData = formatImportImageData;

// Helper function to format errors
const formatErrors = (errors) => {
  if (!errors) return '';
  return Object.entries(errors)
    .map(([field, message]) => `${field}: ${message}`)
    .join(', ');
};

</script>

<template>

  <Message closable v-if="globalImportMessages.length" class="br_content border-l-4 mb-5 w-full rounded-md shadow-sm">
    <span v-for="error in globalImportMessages" :key="error" class="flex flex-col">
      {{ error }}
    </span>
  </Message>

  <!-- <Message closable>Closable Message</Message> -->

  <!-- Products Import Section -->
  <div class="bg-white rounded-lg p-6 shadow-md">
    <h2 class="text-xl font-semibold mb-2">Import Products CSV data</h2>
    <p class="text-gray-600 mb-4">Upload a CSV file to start importing products data</p>
    <div class="flex flex-col gap-4">
      <FileUpload mode="basic" name="importProductsFile" accept=".csv" :maxFileSize="1000000"
        @select="handleFileSelectProducts" :auto="false" chooseLabel="Select CSV File" />
      <div v-if="selectedFileProducts" class="flex flex-col gap-4">
        <div class="flex items-center gap-2 p-3 bg-gray-50 rounded">
          <i class="pi pi-file text-gray-500"></i>
          <span class="text-gray-700">{{ selectedFileProducts.name }}</span>
        </div>
        <div v-if="isSavingProducts" class="w-full">
          <ProgressBar mode="indeterminate" style="height: 8px" class="w-full" />
          <p class="text-sm text-gray-600 mt-2 text-center">Importing products data...</p>
        </div>
        <Button icon="pi pi-save" :label="isSavingProducts ? 'Saving...' : 'Import Products'" severity="success"
          @click="handleSaveProducts" :loading="isSavingProducts" :disabled="isSavingProducts" class="p-button-md" />
      </div>
    </div>
  </div>

   <!-- Products Sort Order by Category Import Section -->
   <div class="bg-white rounded-lg p-6 shadow-md mt-20">
      <h2 class="text-xl font-semibold mb-2">Import Products Sort Order by Category CSV data</h2>
      <p class="text-gray-600 mb-4">Upload a CSV file to start importing products sort order by category data</p>
      <div class="flex flex-col gap-4">
          <FileUpload mode="basic" name="importProductsSortOrderByCategoryFile" accept=".csv" :maxFileSize="1000000"
              @select="handleFileSelectProductsSortOrderByCategory" :auto="false" chooseLabel="Select CSV File" />
          <div v-if="selectedFileProductsSortOrderByCategory" class="flex flex-col gap-4">
              <div class="flex items-center gap-2 p-3 bg-gray-50 rounded">
                  <i class="pi pi-file text-gray-500"></i>
                  <span class="text-gray-700">{{ selectedFileProductsSortOrderByCategory.name }}</span>
              </div>
              <div v-if="isSavingProductsSortOrderByCategory" class="w-full">
                  <ProgressBar mode="indeterminate" style="height: 8px" class="w-full" />
                  <p class="text-sm text-gray-600 mt-2 text-center">Importing data...</p>
              </div>
              <Button icon="pi pi-save" :label="isSavingProductsSortOrderByCategory ? 'Saving...' : 'Import Sort Order'"
                  severity="success" @click="handleImportProductsSortOrderByCategory" :loading="isSavingProductsSortOrderByCategory"
                  :disabled="isSavingProductsSortOrderByCategory" class="p-button-md" />
          </div>
      </div>
  </div>

  <!-- Products Import Results Section -->
  <div v-if="showProductsResults && productsImportResults" class="bg-white rounded-lg p-6 shadow-md">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-semibold">Products Import Results</h2>
      <Button icon="pi pi-times" label="Clear Results" severity="secondary" outlined @click="clearProductsResults" />
    </div>
    <!-- Summary Statistics -->
    <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
      <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div class="text-2xl font-bold text-blue-600">{{
          productsImportResults?.success?.total_records
          || 0
        }}</div>
        <div class="text-sm text-blue-800">Total Records</div>
      </div>
      <div class="bg-red-50 p-4 rounded-lg border border-red-200">
        <div class="text-2xl font-bold text-red-600">{{
          productsImportResults?.success?.invalid_records
          || 0
        }}</div>
        <div class="text-sm text-red-800">Invalid Records</div>
      </div>
      <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div class="text-2xl font-bold text-gray-600">{{
          productsImportResults?.success?.duplicated_records
          || 0
        }}</div>
        <div class="text-sm text-gray-800">Duplicated Records</div>
      </div>
      <div class="bg-orange-50 p-4 rounded-lg border border-orange-200">
        <div class="text-2xl font-bold text-orange-600">{{
          productsImportResults?.success?.updated_records
          || 0 }}</div>
        <div class="text-sm text-orange-800">Updated Records</div>
      </div>
      <div class="bg-purple-50 p-4 rounded-lg border border-purple-200">
        <div class="text-2xl font-bold text-purple-600">{{
          productsImportResults?.success?.valid_records ||
          0 }}</div>
        <div class="text-sm text-purple-800">Inserted Records</div>
      </div>
    </div>

    <!-- Invalid Records DataTable -->
    <div v-if="productsImportResults?.success?.invalid_records > 0 && productsImportResults?.success?.invalid_data">
      <h3 class="text-lg font-semibold text-red-700">Invalid Records ({{
        productsImportResults.success.invalid_records
      }})</h3>
      <DataTable v-model:filters="filters" :value="productsImportResults.success.invalid_data" paginator :rows="10"
        dataKey="row" filterDisplay="menu"
        :globalFilterFields="['product_id', 'product_code', 'product_title', 'specifications']" class="th-table">
        <template #header>
          <div class="flex justify-between items-center">
            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
            <InputText v-model="filters['global'].value" placeholder="Search invalid products records..." />
          </div>
        </template>
        <template #empty> No invalid products records found. </template>
        <Column field="row" header="Row" style="min-width: 6rem">
          <template #body="{ data }">
            {{ data.row }}
          </template>
        </Column>
        <!-- Error data -->
        <Column field="errors" header="Errors" style="min-width: 15rem">
          <template #body="{ data }">
            <div class="text-red-600 text-sm">
              {{ formatErrors(data.errors) }}
            </div>
          </template>
        </Column>
        <Column field="data.product_code" header="Product Code" style="min-width: 10rem">
          <template #body="{ data }">
            {{ data.data.product_code }}
          </template>
        </Column>
        <Column field="data.product_title" header="Product Title" style="min-width: 15rem">
          <template #body="{ data }">
            {{ data.data.product_title }}
          </template>
        </Column>
        <Column field="data.specifications" header="Specifications" style="min-width: 15rem">
          <template #body="{ data }">
            {{ data.data.specifications }}
          </template>
        </Column>
        <Column field="data.store_link" header="Store Link" style="min-width: 12rem">
          <template #body="{ data }">
            <a :href="data.data.store_link" target="_blank" class="text-blue-500 hover:underline">
              {{ data.data.store_link }}
            </a>
          </template>
        </Column>
        <Column field="data.catalogue_link" header="Catalogue Link" style="min-width: 12rem">
          <template #body="{ data }">
            <a :href="data.data.catalogue_link" target="_blank" class="text-blue-500 hover:underline">
              {{ data.data.catalogue_link }}
            </a>
          </template>
        </Column>
        <Column field="data.banner_image" header="Banner Image" style="min-width: 12rem">
          <template #body="{ data }">
            <img :src="formatImageData(data.banner_image)" alt="Banner Image" style="width: 100px; height: 100px;" />
          </template>
        </Column>
        <Column field="data.image_thumb" header="Image Thumb" style="min-width: 10rem">
          <template #body="{ data }">
            <img :src="formatImageData(data.image_thumb)" alt="Image Thumb" style="width: 100px; height: 100px;" />
          </template>
        </Column>
        <Column field="data.main_image_one" header="Main Image One" style="min-width: 12rem">
          <template #body="{ data }">
            <img :src="formatImageData(data.main_image_one)" alt="Main Image One"
              style="width: 100px; height: 100px;" />
          </template>
        </Column>
        <Column field="data.main_image_one_title" header="Main Image One Title" style="min-width: 12rem">
          <template #body="{ data }">
            {{ data.data.main_image_one_title }}
          </template>
        </Column>
        <Column field="data.main_image_one_description" header="Main Image One Description" style="min-width: 15rem">
          <template #body="{ data }">
            {{ data.data.main_image_one_description }}
          </template>
        </Column>
        <Column field="data.main_image_two" header="Main Image Two" style="min-width: 12rem">
          <template #body="{ data }">
            <img :src="formatImageData(data.main_image_two)" alt="Main Image Two"
              style="width: 100px; height: 100px;" />
          </template>
        </Column>
        <Column field="data.specifications_image" header="Specifications Image" style="min-width: 12rem">
          <template #body="{ data }">
            <img :src="formatImageData(data.specifications_image)" alt="Specifications Image"
              style="width: 100px; height: 100px;" />
          </template>
        </Column>
        <Column field="data.video_link" header="Video Link" style="min-width: 12rem">
          <template #body="{ data }">
            {{ data.data.video_link }}
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Updated Records DataTable -->
    <div v-if="productsImportResults?.success?.updated_records > 0 && productsImportResults?.success?.updated_data">
      <h3 class="text-lg font-semibold text-green-700 pt-5">Updated Records ({{
        productsImportResults.success.updated_records
      }})</h3>
      <DataTable v-model:filters="filters" :value="productsImportResults.success.updated_data" paginator :rows="10"
        dataKey="product_id" filterDisplay="menu"
        :globalFilterFields="['product_id', 'product_code', 'product_title', 'specifications']" class="th-table">
        <template #header>
          <div class="flex justify-between items-center">
            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
            <InputText v-model="filters['global'].value" placeholder="Search updated products records..." />
          </div>
        </template>
        <template #empty> No updated products records found. </template>
        <Column field="image" header="Image" style="min-width: 10rem">
          <template #body="{ data }">
            <img :src="formatImageData(data.image)" alt="Image" style="width: 100px; height: 100px;" />
          </template>
        </Column>
        <Column field="product_code" header="Product Code" style="min-width: 10rem" />
        <!-- <Column field="product_title" header="Product Title" style="min-width: 15rem" /> -->
        <Column field="description" header="Description" style="min-width: 15rem" />
        <Column field="specifications" header="Specifications" style="min-width: 15rem" />
        <Column field="store_link" header="Store Link" style="min-width: 12rem">
          <template #body="{ data }">
            <a :href="data.store_link" target="_blank" class="text-blue-500 hover:underline">
              {{ data.store_link }}
            </a>
          </template>
        </Column>
        <Column field="catalogue_link" header="Catalogue Link" style="min-width: 12rem">
          <template #body="{ data }">
            <a :href="data.catalogue_link" target="_blank" class="text-blue-500 hover:underline">
              {{ data.catalogue_link }}
            </a>
          </template>
        </Column>
        <Column field="banner_image" header="Banner Image" style="min-width: 12rem">
          <template #body="{ data }">
            <img :src="formatImageData(data.banner_image)" alt="Banner Image" style="width: 100px; height: 100px;" />
          </template>
        </Column>
        <Column field="image_thumb" header="Image Thumb" style="min-width: 10rem">
          <template #body="{ data }">
            <img :src="formatImageData(data.image_thumb)" alt="Image Thumb" style="width: 100px; height: 100px;" />
          </template>
        </Column>
        <Column field="main_image_one" header="Main Image One" style="min-width: 12rem">
          <template #body="{ data }">
            <img :src="formatImageData(data.main_image_one)" alt="Main Image One"
              style="width: 100px; height: 100px;" />
          </template>
        </Column>
        <Column field="main_image_one_title" header="Main Image One Title" style="min-width: 12rem" />
        <Column field="main_image_one_description" header="Main Image One Description" style="min-width: 15rem" />
        <Column field="main_image_two" header="Main Image Two" style="min-width: 12rem">
          <template #body="{ data }">
            <img :src="formatImageData(data.main_image_two)" alt="Main Image Two"
              style="width: 100px; height: 100px;" />
          </template>
        </Column>
        <Column field="specifications_image" header="Specifications Image" style="min-width: 12rem">
          <template #body="{ data }">
            <img :src="formatImageData(data.specifications_image)" alt="Specifications Image"
              style="width: 100px; height: 100px;" />
          </template>
        </Column>
        <Column field="video_link" header="Video Link" style="min-width: 12rem" />
        <Column field="main_image_two_title" header="Main Image Two Title" style="min-width: 12rem" />
        <Column field="main_image_two_description" header="Main Image Two Description" style="min-width: 15rem" />
        <Column field="feature_description" header="Feature Description" style="min-width: 15rem" />
        <Column field="feature_image_one" header="Feature Image One" style="min-width: 12rem">
          <template #body="{ data }">
            <img :src="formatImageData(data.feature_image_one)" alt="Feature Image One"
              style="width: 100px; height: 100px;" />
          </template>
        </Column>
        <Column field="feature_image_one_title" header="Feature Image One Title" style="min-width: 12rem" />
        <Column field="feature_image_one_description" header="Feature Image One Description" style="min-width: 15rem" />
        <Column field="feature_image_two" header="Feature Image Two" style="min-width: 12rem">
          <template #body="{ data }">
            <img :src="formatImageData(data.feature_image_two)" alt="Feature Image Two"
              style="width: 100px; height: 100px;" />
          </template>
        </Column>
        <Column field="feature_image_two_title" header="Feature Image Two Title" style="min-width: 12rem" />
        <Column field="feature_image_two_description" header="Feature Image Two Description" style="min-width: 15rem" />
        <Column field="feature_image_three" header="Feature Image Three" style="min-width: 12rem">
          <template #body="{ data }">
            <img :src="formatImageData(data.feature_image_three)" alt="Feature Image Three"
              style="width: 100px; height: 100px;" />
          </template>
        </Column>
        <Column field="feature_image_three_title" header="Feature Image Three Title" style="min-width: 12rem" />
        <Column field="feature_image_three_description" header="Feature Image Three Description"
          style="min-width: 15rem" />
      </DataTable>
    </div>

    <!-- Duplicated Records DataTable -->
    <div
      v-if="productsImportResults?.success?.duplicated_records > 0 && productsImportResults?.success?.duplicated_data">
      <h3 class="text-lg font-semibold mb-2 text-gray-700 pt-5">Duplicated Records ({{
        productsImportResults.success.duplicated_records
      }})</h3>
      <DataTable v-model:filters="filters" :value="productsImportResults.success.duplicated_data" paginator :rows="10"
        dataKey="product_id" filterDisplay="menu"
        :globalFilterFields="['product_id', 'product_code', 'product_title', 'specifications']" class="th-table">
        <Column field="image" header="Image" style="min-width: 10rem">
          <template #body="{ data }">
            <img :src="formatImageData(data.image)" alt="Image" style="width: 100px; height: 100px;" />
          </template>
        </Column>
        <Column field="product_code" header="Product Code" style="min-width: 10rem" />
        <!-- <Column field="product_title" header="Product Title" style="min-width: 15rem" /> -->
        <Column field="description" header="Description" style="min-width: 15rem" />
        <Column field="specifications" header="Specifications" style="min-width: 15rem" />
        <Column field="store_link" header="Store Link" style="min-width: 12rem" />
        <Column field="catalogue_link" header="Catalogue Link" style="min-width: 12rem" />
        <Column field="banner_image" header="Banner Image" style="min-width: 12rem">
          <template #body="{ data }">
            <img :src="formatImageData(data.banner_image)" alt="Banner Image" style="width: 100px; height: 100px;" />
          </template>
        </Column>
        <Column field="image_thumb" header="Image Thumb" style="min-width: 10rem">
          <template #body="{ data }">
            <img :src="formatImageData(data.image_thumb)" alt="Image Thumb" style="width: 100px; height: 100px;" />
          </template>
        </Column>
        <Column field="main_image_one" header="Main Image One" style="min-width: 12rem">
          <template #body="{ data }">
            <img :src="formatImageData(data.main_image_one)" alt="Main Image One"
              style="width: 100px; height: 100px;" />
          </template>
        </Column>
        <Column field="main_image_one_title" header="Main Image One Title" style="min-width: 12rem" />
        <Column field="main_image_one_description" header="Main Image One Description" style="min-width: 15rem" />
        <Column field="main_image_two" header="Main Image Two" style="min-width: 12rem">
          <template #body="{ data }">
            <img :src="formatImageData(data.main_image_two)" alt="Main Image Two"
              style="width: 100px; height: 100px;" />
          </template>
        </Column>
        <Column field="specifications_image" header="Specifications Image" style="min-width: 12rem">
          <template #body="{ data }">
            <img :src="formatImageData(data.specifications_image)" alt="Specifications Image"
              style="width: 100px; height: 100px;" />
          </template>
        </Column>
        <Column field="video_link" header="Video Link" style="min-width: 12rem" />
        <Column field="main_image_two_title" header="Main Image Two Title" style="min-width: 12rem" />
        <Column field="main_image_two_description" header="Main Image Two Description" style="min-width: 15rem" />
        <Column field="feature_description" header="Feature Description" style="min-width: 15rem" />
        <Column field="feature_image_one" header="Feature Image One" style="min-width: 12rem">
          <template #body="{ data }">
            <img :src="formatImageData(data.feature_image_one)" alt="Feature Image One"
              style="width: 100px; height: 100px;" />
          </template>
        </Column>
        <Column field="feature_image_one_title" header="Feature Image One Title" style="min-width: 12rem" />
        <Column field="feature_image_one_description" header="Feature Image One Description" style="min-width: 15rem" />
        <Column field="feature_image_two" header="Feature Image Two" style="min-width: 12rem">
          <template #body="{ data }">
            <img :src="formatImageData(data.feature_image_two)" alt="Feature Image Two"
              style="width: 100px; height: 100px;" />
          </template>
        </Column>
        <Column field="feature_image_two_title" header="Feature Image Two Title" style="min-width: 12rem" />
        <Column field="feature_image_two_description" header="Feature Image Two Description" style="min-width: 15rem" />
        <Column field="feature_image_three" header="Feature Image Three" style="min-width: 12rem">
          <template #body="{ data }">
            <img :src="formatImageData(data.feature_image_three)" alt="Feature Image Three"
              style="width: 100px; height: 100px;" />
          </template>
        </Column>
        <Column field="feature_image_three_title" header="Feature Image Three Title" style="min-width: 12rem" />
        <Column field="feature_image_three_description" header="Feature Image Three Description"
          style="min-width: 15rem" />
      </DataTable>
    </div>

    <!-- Valid Records DataTable -->
    <div v-if="productsImportResults?.success?.valid_records > 0 && productsImportResults?.success?.valid_data">
      <h3 class="text-lg font-semibold text-green-700 pt-5">
        Valid Records ({{ productsImportResults.success.valid_records }})
      </h3>
      <DataTable v-model:filters="filters" :value="productsImportResults.success.valid_data" paginator :rows="10"
        dataKey="product_id" filterDisplay="menu"
        :globalFilterFields="['product_id', 'product_code', 'product_title', 'specifications']" class="th-table">
        <template #header>
          <div class="flex justify-between items-center">
            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
            <InputText v-model="filters['global'].value" placeholder="Search valid products records..." />
          </div>
        </template>
        <template #empty> No valid products records found. </template>
        <Column field="image" header="Image" style="min-width: 10rem">
          <template #body="{ data }">
            <img :src="formatImageData(data.image)" alt="Image" style="width: 100px; height: 100px;" />
          </template>
        </Column>
        <Column field="product_code" header="Product Code" style="min-width: 10rem" />
        <!-- <Column field="product_title" header="Product Title" style="min-width: 15rem" /> -->
        <Column field="description" header="Description" style="min-width: 15rem" />
        <Column field="specifications" header="Specifications" style="min-width: 15rem" />
        <Column field="store_link" header="Store Link" style="min-width: 12rem">
          <template #body="{ data }">
            <a :href="data.store_link" target="_blank" class="text-blue-500 hover:underline">
              {{ data.store_link }}
            </a>
          </template>
        </Column>
        <Column field="catalogue_link" header="Catalogue Link" style="min-width: 12rem">
          <template #body="{ data }">
            <a :href="data.catalogue_link" target="_blank" class="text-blue-500 hover:underline">
              {{ data.catalogue_link }}
            </a>
          </template>
        </Column>
        <Column field="banner_image" header="Banner Image" style="min-width: 12rem">
          <template #body="{ data }">
            <img :src="formatImageData(data.banner_image)" alt="Banner Image" style="width: 100px; height: 100px;" />
          </template>
        </Column>
        <Column field="image_thumb" header="Image Thumb" style="min-width: 10rem">
          <template #body="{ data }">
            <img :src="formatImageData(data.image_thumb)" alt="Image Thumb" style="width: 100px; height: 100px;" />
          </template>
        </Column>
        <Column field="main_image_one" header="Main Image One" style="min-width: 12rem">
          <template #body="{ data }">
            <img :src="formatImageData(data.main_image_one)" alt="Main Image One"
              style="width: 100px; height: 100px;" />
          </template>
        </Column>
        <Column field="main_image_one_title" header="Main Image One Title" style="min-width: 12rem" />
        <Column field="main_image_one_description" header="Main Image One Description" style="min-width: 15rem" />
        <Column field="main_image_two" header="Main Image Two" style="min-width: 12rem">
          <template #body="{ data }">
            <img :src="formatImageData(data.main_image_two)" alt="Main Image Two"
              style="width: 100px; height: 100px;" />
          </template>
        </Column>
        <Column field="specifications_image" header="Specifications Image" style="min-width: 12rem">
          <template #body="{ data }">
            <img :src="formatImageData(data.specifications_image)" alt="Specifications Image"
              style="width: 100px; height: 100px;" />
          </template>
        </Column>
        <Column field="video_link" header="Video Link" style="min-width: 12rem" />
        <Column field="main_image_two_title" header="Main Image Two Title" style="min-width: 12rem" />
        <Column field="main_image_two_description" header="Main Image Two Description" style="min-width: 15rem" />
        <Column field="feature_description" header="Feature Description" style="min-width: 15rem" />
        <Column field="feature_image_one" header="Feature Image One" style="min-width: 12rem">
          <template #body="{ data }">
            <img :src="formatImageData(data.feature_image_one)" alt="Feature Image One"
              style="width: 100px; height: 100px;" />
          </template>
        </Column>
        <Column field="feature_image_one_title" header="Feature Image One Title" style="min-width: 12rem" />
        <Column field="feature_image_one_description" header="Feature Image One Description" style="min-width: 15rem" />
        <Column field="feature_image_two" header="Feature Image Two" style="min-width: 12rem">
          <template #body="{ data }">
            <img :src="formatImageData(data.feature_image_two)" alt="Feature Image Two"
              style="width: 100px; height: 100px;" />
          </template>
        </Column>
        <Column field="feature_image_two_title" header="Feature Image Two Title" style="min-width: 12rem" />
        <Column field="feature_image_two_description" header="Feature Image Two Description" style="min-width: 15rem" />
        <Column field="feature_image_three" header="Feature Image Three" style="min-width: 12rem">
          <template #body="{ data }">
            <img :src="formatImageData(data.feature_image_three)" alt="Feature Image Three"
              style="width: 100px; height: 100px;" />
          </template>
        </Column>
        <Column field="feature_image_three_title" header="Feature Image Three Title" style="min-width: 12rem" />
        <Column field="feature_image_three_description" header="Feature Image Three Description"
          style="min-width: 15rem" />
      </DataTable>
    </div>




  </div>

</template>

<style scoped>
.br_content {
  /* border: 1px solid #8b6161 !important; */
  padding: 2px !important;
  background-color: #f1d3d3 !important;
  color: #ff0000 !important;
  margin-bottom: 1rem !important;
}

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

/* tab design */
.import-tabs .p-tabview-nav {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 0 1rem;
}

.import-tabs .p-tabview-nav-link {
  padding: 1rem;
  border: none;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
}

.import-tabs .p-tabview-nav-link:not(.p-disabled):focus {
  box-shadow: none;
  border-bottom: 5px solid #3b82f6;
}

.import-tabs .p-tabview-nav-link.p-highlight {
  background: white;
  border-bottom: 5px solid #3b82f6;
  color: #3b82f6;
}

.import-tabs .p-tabview-nav-link:hover:not(.p-highlight) {
  background: #f8fafc;
  border-color: transparent;
}

.import-tabs .p-tabview-panels {
  padding: 1rem;
  background: #f8fafc;
}
</style>
