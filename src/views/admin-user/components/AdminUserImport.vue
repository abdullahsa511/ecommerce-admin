<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useAdminStore } from '@/stores/admin';
import FileUpload from 'primevue/fileupload';
import Button from 'primevue/button';
import ProgressBar from 'primevue/progressbar';
import InputText from 'primevue/inputtext';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { storeToRefs } from 'pinia';
import AdminUserImportResponse from '@/models/AdminUserImport';

// Emits
const emit = defineEmits(['editTabUnmunted', 'editTabMounted', 'saved']);

// Store and Toast
const adminStore = useAdminStore();
const { importExport, fb } = storeToRefs(adminStore);
const toast = useToast();

// Local
const selectedFile = ref<File | null>(null);
const filters = ref({ global: { value: null, matchMode: 'contains' } });
const showResults = computed(() => {
  return (importExport.value.invalid_records > 0
    || importExport.value.updated_records > 0
    || importExport.value.valid_records > 0
  );
});

// onMounted
onMounted(() => {
  emit('editTabMounted');
});

// onUnmounted
onUnmounted(() => {
  emit('editTabUnmunted');
});

// Handle file selection
const handleFileSelect = (event: any) => {
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
  selectedFile.value = file;
};

// Handle  import
const handleSave = async () => {
  if (!selectedFile.value) {
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
    formData.append('csv_file', selectedFile.value);
    await adminStore.adminUsersImport(formData);
    console.log('importExport after import', importExport.value);
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Imported successfully',
      life: 3000,
    });
    selectedFile.value = null;
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

// Clear results
const clearResults = () => {
  importExport.value = new AdminUserImportResponse();
};
// Clear filters
const clearFilter = () => {
  filters.value = { global: { value: null, matchMode: 'contains' } };
};
</script>

<template>
  <!--  Import Section -->
  <div class="bg-white rounded-lg p-6 shadow-md">
    <h2 class="text-xl font-semibold mb-2">Import CSV data</h2>
    <p class="text-gray-600 mb-4">Upload a CSV file to start importing data</p>
    <div class="flex flex-col gap-4">
      <FileUpload mode="basic" name="importFile" accept=".csv" :maxFileSize="1000000" @select="handleFileSelect"
        :auto="false" chooseLabel="Select CSV File" />
      <div v-if="selectedFile" class="flex flex-col gap-4">
        <div class="flex items-center gap-2 p-3 bg-gray-50 rounded">
          <i class="pi pi-file text-gray-500"></i>
          <span class="text-gray-700">{{ selectedFile.name }}</span>
        </div>
        <div v-if="fb.loading['admin.import']" class="w-full">
          <ProgressBar mode="indeterminate" style="height: 8px" class="w-full" />
          <p class="text-sm text-gray-600 mt-2 text-center">Importing data...</p>
        </div>
        <Button icon="pi pi-save" :label="fb.loading['admin.import'] ? 'Saving...' : 'Import '" severity="success"
          @click="handleSave" :loading="fb.loading['admin.import']" :disabled="fb.loading['admin.import']"
          class="p-button-md" />
      </div>
    </div>
  </div>

  <!--  Import Results Section -->
  <div v-if="showResults" class="bg-white rounded-lg p-6 shadow-md">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-semibold"> Import Results</h2>
      <Button icon="pi pi-times" label="Clear Results" severity="secondary" outlined @click="clearResults()" />
    </div>

    <!-- Summary Statistics -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div class="text-2xl font-bold text-blue-600">{{ importExport.total_records || 0 }}</div>
        <div class="text-sm text-blue-800">Total Records</div>
      </div>
      <div class="bg-red-50 p-4 rounded-lg border border-red-200">
        <div class="text-2xl font-bold text-red-600">{{ importExport.invalid_records || 0 }}</div>
        <div class="text-sm text-red-800">Invalid Records</div>
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
      <h3 class="text-lg font-semibold mb-4 text-red-700">Invalid Records ({{ importExport.invalid_records }})</h3>
      <DataTable v-model:filters="filters" :value="importExport.invalid_data" paginator :rows="200" dataKey="row"
        filterDisplay="menu" :globalFilterFields="['data.name', 'data.language_id']" class="th-table">
        <template #header>
          <div class="flex justify-between items-center">
            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
            <InputText v-model="filters['global'].value" placeholder="Search invalid attributes records..." />
          </div>
        </template>
        <template #empty>No invalid attributes records found.</template>
        <Column field="row" header="Row" style="min-width: 6rem">
          <template #body="{ data }">{{ data.row }}</template>
        </Column>
        <Column field="username" header="Username" style="min-width: 10rem">
          <template #body="{ data }">{{ data.data?.username || data.username || '' }}</template>
        </Column>
        <Column field="display_name" header="Display Name" style="min-width: 10rem">
          <template #body="{ data }">{{ data.data?.display_name || data.display_name || '' }}</template>
        </Column>
        <Column field="first_name" header="First Name" style="min-width: 10rem">
          <template #body="{ data }">{{ data.data?.first_name || data.first_name || '' }}</template>
        </Column>
        <Column field="last_name" header="Last Name" style="min-width: 10rem">
          <template #body="{ data }">{{ data.data?.last_name || data.last_name || '' }}</template>
        </Column>
        <Column field="email" header="Email" style="min-width: 10rem">
          <template #body="{ data }">{{ data.data?.email || data.email || '' }}</template>
        </Column>
        <Column field="phone_number" header="Phone Number" style="min-width: 10rem">
          <template #body="{ data }">{{ data.data?.phone_number || data.phone_number || '' }}</template>
        </Column>
        <Column field="status" header="Status" style="min-width: 10rem">
          <template #body="{ data }">{{ data.data?.status || data.status || '' }}</template>
        </Column>
        <Column field="errors" header="Errors" style="min-width: 15rem">
          <template #body="{ data }">
            <div class="text-red-600 text-sm">{{ data.errors }}</div>
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Duplicated Records DataTable -->
    <!-- <div v-if="importExport.updated_records > 0 && importExport.updated_data" class="mb-6">
      <h3 class="text-lg font-semibold mb-4 text-orange-700">Records Updated ({{ importExport.updated_records }})</h3>
      <DataTable
        v-model:filters="filters"
        :value="importExport.updated_data"
        paginator
        :rows="200"
        dataKey="row"
        filterDisplay="menu"
        :globalFilterFields="['name']"
        class="th-table"
      >
        <template #header>
          <div class="flex justify-between items-center">
            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
            <InputText v-model="filters['global'].value" placeholder="Search updated attributes records..." />
          </div>
        </template>
        <template #empty>No updated attributes records found.</template>
        <Column field="attribute_group_id" header="Id" style="min-width: 10rem">
          <template #body="{ data }">{{ data.attribute_group_id }}</template>
        </Column>
        <Column field="data.name" header="Name" style="min-width: 10rem">
          <template #body="{ data }">{{ data.name }}</template>
        </Column>
        <Column field="data.language_code" header="Language Code" style="min-width: 10rem">
          <template #body="{ data }">{{ importExport.language_map?.[data?.language_id] || data?.language_code || data?.language_id || '' }}</template>
        </Column>
      </DataTable>
    </div> -->

    <!-- Valid Records DataTable -->
    <div v-if="importExport.valid_records > 0 && importExport.valid_data">
      <h3 class="text-lg font-semibold mb-4 text-green-700">Records Inserted ({{ importExport.valid_records }})</h3>
      <DataTable v-model:filters="filters" :value="importExport.valid_data" paginator :rows="200" dataKey="attribute_id"
        filterDisplay="menu"
        :globalFilterFields="['username', 'first_name', 'last_name', 'email', 'phone_number', 'status', 'display_name']"
        class="th-table">
        <template #header>
          <div class="flex justify-between items-center">
            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
            <InputText v-model="filters['global'].value" placeholder="Search valid attribute content records..." />
          </div>
        </template>
        <template #empty>No valid admin users records found.</template>
        <Column field="username" header="Username" style="min-width: 10rem">
          <template #body="{ data }">{{ data.username }}</template>
        </Column>
        <Column field="display_name" header="Display Name" style="min-width: 10rem">
          <template #body="{ data }">{{ data.display_name }}</template>
        </Column>
        <Column field="first_name" header="First Name" style="min-width: 10rem">
          <template #body="{ data }">{{ data.first_name }}</template>
        </Column>
        <Column field="last_name" header="Last Name" style="min-width: 10rem">
          <template #body="{ data }">{{ data.last_name }}</template>
        </Column>
        <Column field="email" header="Email" style="min-width: 10rem">
          <template #body="{ data }">{{ data.email }}</template>
        </Column>
        <Column field="phone_number" header="Phone Number" style="min-width: 10rem">
          <template #body="{ data }">{{ data.phone_number }}</template>
        </Column>
        <Column field="status" header="Status" style="min-width: 10rem">
          <template #body="{ data }">{{ data.status }}</template>
        </Column>
      </DataTable>
    </div>

    <!-- updated records data table -->
    <div v-if="importExport.updated_records > 0 && importExport.updated_data">
      <h3 class="text-lg font-semibold mb-4 text-orange-700">Records Updated ({{ importExport.updated_records }})</h3>
      <DataTable v-model:filters="filters" :value="importExport.updated_data" paginator :rows="200" dataKey="row"
        filterDisplay="menu"
        :globalFilterFields="['username', 'first_name', 'last_name', 'email', 'phone_number', 'status', 'display_name']"
        class="th-table">
        <template #header>
          <div class="flex justify-between items-center">
            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
            <InputText v-model="filters['global'].value" placeholder="Search updated admin users records..." />
          </div>
        </template>
        <template #empty>No updated admin users records found.</template>
        <Column field="username" header="Username" style="min-width: 10rem">
          <template #body="{ data }">{{ data.data?.username || data.username || '' }}</template>
        </Column>
        <Column field="display_name" header="Display Name" style="min-width: 10rem">
          <template #body="{ data }">{{ data.data?.display_name || data.display_name || '' }}</template>
        </Column>
        <Column field="first_name" header="First Name" style="min-width: 10rem">
          <template #body="{ data }">{{ data.data?.first_name || data.first_name || '' }}</template>
        </Column>
        <Column field="last_name" header="Last Name" style="min-width: 10rem">
          <template #body="{ data }">{{ data.data?.last_name || data.last_name || '' }}</template>
        </Column>
        <Column field="email" header="Email" style="min-width: 10rem">
          <template #body="{ data }">{{ data.data?.email || data.email || '' }}</template>
        </Column>
        <Column field="phone_number" header="Phone Number" style="min-width: 10rem">
          <template #body="{ data }">{{ data.data?.phone_number || data.phone_number || '' }}</template>
        </Column>
        <Column field="status" header="Status" style="min-width: 10rem">
          <template #body="{ data }">{{ data.data?.status || data.status || '' }}</template>
        </Column>
      </DataTable>
    </div>
  </div>
  <div v-if="fb.errors['admin.import']" class="text-red-600 text-sm pt-5">
    <div v-html="fb.renderErrors('admin.import')"></div>
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
