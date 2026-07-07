<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useProductAttributeStore } from '@/stores/productAttribute';
import { storeToRefs } from 'pinia';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useToast } from 'primevue/usetoast';

//===========================================================
// Define Props
//===========================================================

//===========================================================
// Declare Emits
//===========================================================
// const emit = defineEmits({});
const emit = defineEmits(['editTabUnmunted', 'editTabMounted', 'saved']);

// ===========================================================
// Define Local Variables
// ===========================================================
const attributeStore = useProductAttributeStore();
const { fb } = storeToRefs(attributeStore);

const filters = ref({ global: { value: null, matchMode: 'contains' } });
const toast = useToast();

// ===========================================================
// Attributes Import related states
// ===========================================================
const selectedFileAttributes = ref<File | null>(null);
const isSavingAttributes = ref(false);
const attributesImportResults = ref<any>(null);
const showAttributesResults = ref(false);

// ===========================================================
// Define Local Methods
// ===========================================================

// Handle file selection for attribute import
const handleFileSelectAttributes = (event: any) => {
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

  selectedFileAttributes.value = file;
};

// Handle attribute import (save action)
const handleSaveAttributes = async () => {
  if (!selectedFileAttributes.value) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Please select a file first',
      life: 3000
    });
    return;
  }

  isSavingAttributes.value = true;

  try {
    const formData = new FormData();
    formData.append('csv_file', selectedFileAttributes.value);

    const response = await attributeStore.attributesImport(formData);

    attributesImportResults.value = {
      success: {
        total_records: response.total_records || 0,
        valid_records: response.valid_records || 0,
        invalid_records: response.invalid_records || 0,
        updated_records: response.updated_records || 0,
        inserted_count: response.inserted_count || 0,
        valid_data: response.attribute_contents?.valid_data || [],
        invalid_data: response.invalid_data || [],
        updated_data: response.updated_data || [],
        valid_attribute_data: response.valid_attribute_data || [],
      },
    };

    showAttributesResults.value = true;

    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Attributes imported successfully',
      life: 3000
    });

    selectedFileAttributes.value = null;

    // Emit saved event for parent listener
    // emit('saved');
  } catch (error: any) {
    console.error('Save error:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.message || 'Failed to save file',
      life: 3000
    });
  } finally {
    isSavingAttributes.value = false;
  }
};

// Clear attribute import results
const clearAttributesResults = () => {
  attributesImportResults.value = null;
  showAttributesResults.value = false;
};

// Clear filters
const clearFilter = () => {
  filters.value = { global: { value: null, matchMode: 'contains' } };
};

// ===========================================================
// Lifecycle Hooks
// ===========================================================
onMounted(() => {
  // Any initialization logic here (if needed)
});
</script>


<template>
  <!-- Attributes Import Section -->
  <div class="bg-white rounded-lg p-6 shadow-md">
    <h2 class="text-xl font-semibold mb-2">Import Attributes CSV data</h2>
    <p class="text-gray-600 mb-4">Upload a CSV file to start importing attributes data</p>
    <div class="flex flex-col gap-4">
      <FileUpload mode="basic" name="importAttributesFile" accept=".csv" :maxFileSize="1000000"
        @select="handleFileSelectAttributes" :auto="false" chooseLabel="Select CSV File" />
      <div v-if="selectedFileAttributes" class="flex flex-col gap-4">
        <div class="flex items-center gap-2 p-3 bg-gray-50 rounded">
          <i class="pi pi-file text-gray-500"></i>
          <span class="text-gray-700">{{ selectedFileAttributes.name }}</span>
        </div>
        <div v-if="isSavingAttributes" class="w-full">
          <ProgressBar mode="indeterminate" style="height: 8px" class="w-full" />
          <p class="text-sm text-gray-600 mt-2 text-center">Importing attributes data...</p>
        </div>
        <Button icon="pi pi-save" :label="isSavingAttributes ? 'Saving...' : 'Import Attributes'" severity="success"
          @click="handleSaveAttributes" :loading="isSavingAttributes" :disabled="isSavingAttributes"
          class="p-button-md" />
      </div>
    </div>
  </div>
  <!-- Attributes Import Results Section -->
  <div v-if="showAttributesResults && attributesImportResults" class="bg-white rounded-lg p-6 shadow-md">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-semibold">Attributes Import Results</h2>
      <Button icon="pi pi-times" label="Clear Results" severity="secondary" outlined @click="clearAttributesResults" />
    </div>

    <!-- Summary Statistics -->
    <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
      <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div class="text-2xl font-bold text-blue-600">{{
          attributesImportResults?.success?.total_records || 0
          }}</div>
        <div class="text-sm text-blue-800">Total Records</div>
      </div>
      <div class="bg-green-50 p-4 rounded-lg border border-green-200">
        <div class="text-2xl font-bold text-green-600">{{
          attributesImportResults?.success?.valid_records || 0
          }}</div>
        <div class="text-sm text-green-800">Valid Records</div>
      </div>
      <div class="bg-red-50 p-4 rounded-lg border border-red-200">
        <div class="text-2xl font-bold text-red-600">{{
          attributesImportResults?.success?.invalid_records || 0
          }}</div>
        <div class="text-sm text-red-800">Invalid Records</div>
      </div>
      <div class="bg-orange-50 p-4 rounded-lg border border-orange-200">
        <div class="text-2xl font-bold text-orange-600">{{
          attributesImportResults?.success?.updated_records || 0
          }}</div>
        <div class="text-sm text-orange-800">Updated Records</div>
      </div>
      <div class="bg-purple-50 p-4 rounded-lg border border-purple-200">
        <div class="text-2xl font-bold text-purple-600">{{
          attributesImportResults?.success?.inserted_count || 0
          }}</div>
        <div class="text-sm text-purple-800">Inserted Records</div>
      </div>
    </div>
    <!-- Invalid Records DataTable -->
    <div v-if="attributesImportResults?.success?.invalid_records > 0 && attributesImportResults?.success?.invalid_data"
      class="mb-6">
      <h3 class="text-lg font-semibold mb-4 text-red-700">Invalid Records ({{
        attributesImportResults.success.invalid_records
        }})</h3>
      <DataTable v-model:filters="filters" :value="attributesImportResults.success.invalid_data" paginator :rows="10"
        dataKey="row" filterDisplay="menu"
        :globalFilterFields="['data.product_code', 'data.attribute_code', 'data.language_code', 'data.value']"
        class="th-table">
        <template #header>
          <div class="flex justify-between items-center">
            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
            <InputText v-model="filters['global'].value" placeholder="Search invalid attributes records..." />
          </div>
        </template>
        <template #empty> No invalid attributes records found. </template>
        <Column field="row" header="Row" style="min-width: 6rem">
          <template #body="{ data }">
            {{ data.row }}
          </template>
        </Column>
        <Column field="data.product_code" header="Product Code" style="min-width: 10rem">
          <template #body="{ data }">
            {{ data.data.product_code }}
          </template>
        </Column>
        <Column field="data.attribute_code" header="Attribute Code" style="min-width: 10rem">
          <template #body="{ data }">
            {{ data.data.attribute_code }}
          </template>
        </Column>
        <Column field="data.language_code" header="Language Code" style="min-width: 10rem">
          <template #body="{ data }">
            {{ data.data.language_code }}
          </template>
        </Column>
        <Column field="data.value" header="Value" style="min-width: 15rem">
          <template #body="{ data }">
            {{ data.data.value }}
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

    <!-- Updated Records DataTable -->
    <div v-if="attributesImportResults?.success?.updated_records > 0 && attributesImportResults?.success?.updated_data"
      class="mb-6">
      <h3 class="text-lg font-semibold mb-4 text-orange-700">Updated Records ({{
        attributesImportResults.success.updated_records
        }})</h3>
      <DataTable v-model:filters="filters" :value="attributesImportResults.success?.updated_data" paginator :rows="10"
        dataKey="row" filterDisplay="menu"
        :globalFilterFields="['data.product_code', 'data.attribute_code', 'data.language_code', 'data.value']"
        class="th-table">
        <template #header>
          <div class="flex justify-between items-center">
            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
            <InputText v-model="filters['global'].value" placeholder="Search updated attributes records..." />
          </div>
        </template>
        <template #empty> No updated attributes records found. </template>
        <Column field="data.product_code" header="Product Code" style="min-width: 10rem">
          <template #body="{ data }">
            {{ data.data.product_code }}
          </template>
        </Column>
        <Column field="data.attribute_code" header="Attribute Code" style="min-width: 10rem">
          <template #body="{ data }">
            {{ data.data.attribute_code }}
          </template>
        </Column>
        <Column field="data.language_code" header="Language Code" style="min-width: 10rem">
          <template #body="{ data }">
            {{ data.data.language_code }}
          </template>
        </Column>
        <Column field="data.value" header="Value" style="min-width: 15rem">
          <template #body="{ data }">
            {{ data.data.value }}
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Valid Records DataTable -->
    <div v-if="attributesImportResults?.success?.valid_records > 0 && attributesImportResults?.success?.valid_data">
      <h3 class="text-lg font-semibold mb-4 text-green-700">Valid Records ({{
        attributesImportResults.success.valid_records
        }})</h3>
      <DataTable v-model:filters="filters" :value="attributesImportResults.success.valid_data" paginator :rows="10"
        dataKey="attribute_id" filterDisplay="menu" :globalFilterFields="['name', 'language_id']" class="th-table">
        <template #header>
          <div class="flex justify-between items-center">
            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
            <InputText v-model="filters['global'].value" placeholder="Search valid attribute content records..." />
          </div>
        </template>
        <template #empty>
          No valid attribute content records found.
        </template>
        <Column field="attribute_id" header="Attribute ID" style="min-width: 8rem" />
        <Column field="language_id" header="Language ID" style="min-width: 8rem" />
        <Column field="name" header="Name" style="min-width: 15rem" />
      </DataTable>
    </div>
  </div>
</template>
<style scoped>
.product-attribute-index {
  padding: 2rem;
}

.p-datatable .p-datatable-thead>tr>th {
  background-color: var(--surface-100);
}

.p-datatable .p-datatable-tbody>tr>td {
  padding: 1rem;
}
</style>
