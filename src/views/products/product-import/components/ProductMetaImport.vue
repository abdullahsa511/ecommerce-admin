<script setup lang="ts">
import { ref, computed } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useProductStore } from '@/stores/product';
import { storeToRefs } from 'pinia';
import ProductMetaImportResponse from '@/models/ProductMetaImportResponse';

const emit = defineEmits(['editTabUnmunted', 'editTabMounted', 'saved']);

const productStore = useProductStore();
const { metaImportExport, fb } = storeToRefs(productStore);
const toast = useToast();

const selectedFileProductMeta = ref<File | null>(null);
const filters = ref({ global: { value: null, matchMode: 'contains' } });
const showProductMetaResults = computed(() => {
  return (
    metaImportExport.value.invalid_records > 0
    || metaImportExport.value.updated_records > 0
    || metaImportExport.value.valid_records > 0
  );
});

const handleFileSelectProductMeta = (event: any) => {
  const file = event.files[0];
  if (!file) return;

  if (!file.name.endsWith('.csv')) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Please select a CSV file',
      life: 3000,
    });
    return;
  }
  selectedFileProductMeta.value = file;
};

const handleSaveProductMeta = async () => {
  if (!selectedFileProductMeta.value) {
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
    formData.append('csv_file', selectedFileProductMeta.value);
    await productStore.importProductsMeta(formData);
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Product meta imported successfully',
      life: 3000,
    });
    selectedFileProductMeta.value = null;
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

const clearResults = () => {
  metaImportExport.value = new ProductMetaImportResponse();
};

const clearFilter = () => {
  filters.value = { global: { value: null, matchMode: 'contains' } };
};

const metaFilterFields = [
  'product_id',
  'product_code',
  'meta_keywords',
  'meta_description',
  'meta_content',
  'data.product_id',
  'data.product_code',
  'data.meta_keywords',
  'data.meta_description',
  'data.meta_content',
];
</script>

<template>
  <div class="bg-white rounded-lg p-6 shadow-md">
    <h2 class="text-xl font-semibold mb-2">Import Product Meta CSV data</h2>
    <p class="text-gray-600 mb-4">Upload a CSV file to start importing product meta data</p>
    <div class="flex flex-col gap-4">
      <FileUpload
        mode="basic"
        name="importProductMetaFile"
        accept=".csv"
        :maxFileSize="1000000"
        @select="handleFileSelectProductMeta"
        :auto="false"
        chooseLabel="Select CSV File"
      />
      <div v-if="selectedFileProductMeta" class="flex flex-col gap-4">
        <div class="flex items-center gap-2 p-3 bg-gray-50 rounded">
          <i class="pi pi-file text-gray-500"></i>
          <span class="text-gray-700">{{ selectedFileProductMeta.name }}</span>
        </div>
        <div v-if="fb.loading['product.importMeta']" class="w-full">
          <ProgressBar mode="indeterminate" style="height: 8px" class="w-full" />
          <p class="text-sm text-gray-600 mt-2 text-center">Importing product meta data...</p>
        </div>
        <Button
          icon="pi pi-save"
          :label="fb.loading['product.importMeta'] ? 'Saving...' : 'Import Product Meta'"
          severity="success"
          @click="handleSaveProductMeta"
          :loading="fb.loading['product.importMeta']"
          :disabled="fb.loading['product.importMeta']"
          class="p-button-md"
        />
      </div>
    </div>
  </div>

  <div v-if="showProductMetaResults" class="bg-white rounded-lg p-6 shadow-md">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-semibold">Product Meta Import Results</h2>
      <Button icon="pi pi-times" label="Clear Results" severity="secondary" outlined @click="clearResults()" />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div class="text-2xl font-bold text-blue-600">{{ metaImportExport.total_records || 0 }}</div>
        <div class="text-sm text-blue-800">Total Records</div>
      </div>
      <div class="bg-red-50 p-4 rounded-lg border border-red-200">
        <div class="text-2xl font-bold text-red-600">{{ metaImportExport.invalid_records || 0 }}</div>
        <div class="text-sm text-red-800">Invalid Records</div>
      </div>
      <div class="bg-orange-50 p-4 rounded-lg border border-orange-200">
        <div class="text-2xl font-bold text-orange-600">{{ metaImportExport.updated_records || 0 }}</div>
        <div class="text-sm text-orange-800">Records Updated</div>
      </div>
      <div class="bg-purple-50 p-4 rounded-lg border border-purple-200">
        <div class="text-2xl font-bold text-purple-600">{{ metaImportExport.valid_records || 0 }}</div>
        <div class="text-sm text-purple-800">Records Inserted</div>
      </div>
    </div>

    <div v-if="metaImportExport.invalid_records > 0 && metaImportExport.invalid_data" class="mb-6">
      <h3 class="text-lg font-semibold mb-4 text-red-700">Invalid Records ({{ metaImportExport.invalid_records }})</h3>
      <DataTable
        v-model:filters="filters"
        :value="metaImportExport.invalid_data"
        paginator
        :rows="200"
        dataKey="row"
        filterDisplay="menu"
        :globalFilterFields="metaFilterFields"
        class="th-table"
      >
        <template #header>
          <div class="flex justify-between items-center">
            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
            <InputText v-model="filters['global'].value" placeholder="Search invalid product meta records..." />
          </div>
        </template>
        <template #empty>No invalid product meta records found.</template>
        <Column field="row" header="Row" style="min-width: 6rem">
          <template #body="{ data }">{{ data.row }}</template>
        </Column>
        <Column field="data.product_id" header="Product ID" style="min-width: 8rem">
          <template #body="{ data }">{{ data.data.product_id }}</template>
        </Column>
        <Column field="data.product_code" header="Product Code" style="min-width: 10rem">
          <template #body="{ data }">{{ data.data.product_code }}</template>
        </Column>
        <Column field="data.meta_keywords" header="Meta Keywords" style="min-width: 12rem">
          <template #body="{ data }">{{ data.data.meta_keywords }}</template>
        </Column>
        <Column field="data.meta_description" header="Meta Description" style="min-width: 15rem">
          <template #body="{ data }">{{ data.data.meta_description }}</template>
        </Column>
        <Column field="data.meta_content" header="Meta Content" style="min-width: 15rem">
          <template #body="{ data }">{{ data.data.meta_content }}</template>
        </Column>
        <Column field="errors" header="Errors" style="min-width: 15rem">
          <template #body="{ data }"><div class="text-red-600 text-sm">{{ data.errors }}</div></template>
        </Column>
      </DataTable>
    </div>

    <div v-if="metaImportExport.updated_records > 0 && metaImportExport.updated_data" class="mb-6">
      <h3 class="text-lg font-semibold mb-4 text-orange-700">Records Updated ({{ metaImportExport.updated_records }})</h3>
      <DataTable
        v-model:filters="filters"
        :value="metaImportExport.updated_data"
        paginator
        :rows="200"
        dataKey="product_id"
        filterDisplay="menu"
        :globalFilterFields="metaFilterFields"
        class="th-table"
      >
        <template #header>
          <div class="flex justify-between items-center">
            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
            <InputText v-model="filters['global'].value" placeholder="Search updated product meta records..." />
          </div>
        </template>
        <template #empty>No updated product meta records found.</template>
        <Column field="product_id" header="Product ID" style="min-width: 8rem" />
        <Column field="product_code" header="Product Code" style="min-width: 10rem" />
        <Column field="meta_keywords" header="Meta Keywords" style="min-width: 12rem" />
        <Column field="meta_description" header="Meta Description" style="min-width: 15rem" />
        <Column field="meta_content" header="Meta Content" style="min-width: 15rem" />
      </DataTable>
    </div>

    <div v-if="metaImportExport.valid_records > 0 && metaImportExport.valid_data">
      <h3 class="text-lg font-semibold mb-4 text-green-700">Records Inserted ({{ metaImportExport.valid_records }})</h3>
      <DataTable
        v-model:filters="filters"
        :value="metaImportExport.valid_data"
        paginator
        :rows="200"
        dataKey="product_id"
        filterDisplay="menu"
        :globalFilterFields="metaFilterFields"
        class="th-table"
      >
        <template #header>
          <div class="flex justify-between items-center">
            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
            <InputText v-model="filters['global'].value" placeholder="Search valid product meta records..." />
          </div>
        </template>
        <template #empty>No valid product meta records found.</template>
        <Column field="product_id" header="Product ID" style="min-width: 8rem" />
        <Column field="product_code" header="Product Code" style="min-width: 10rem" />
        <Column field="meta_keywords" header="Meta Keywords" style="min-width: 12rem" />
        <Column field="meta_description" header="Meta Description" style="min-width: 15rem" />
        <Column field="meta_content" header="Meta Content" style="min-width: 15rem" />
      </DataTable>
    </div>
  </div>

  <div v-if="fb.errors['product.importMeta']" class="text-red-600 text-sm pt-5">
    <div v-html="fb.renderErrors('product.importMeta')"></div>
  </div>
</template>

<style scoped>
.p-datatable .p-datatable-thead > tr > th {
  background-color: var(--surface-100);
}
.p-datatable .p-datatable-tbody > tr > td {
  padding: 1rem;
}
</style>
