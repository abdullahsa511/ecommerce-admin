<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted} from 'vue';
  import { useToast } from 'primevue/usetoast';
  import FileUpload from 'primevue/fileupload';
  import Button from 'primevue/button';
  import ProgressBar from 'primevue/progressbar';
  import InputText from 'primevue/inputtext';
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  import { storeToRefs } from 'pinia';
  import PostTypeImportResponse from '@/models/PostTypeImport';
  import { usePostTypeStore } from '@/stores/postType';
  
  // Emits
  const emit = defineEmits(['editTabUnmunted', 'editTabMounted', 'saved']);
  
  // Store and Toast
  const postTypeStore = usePostTypeStore();
  const { importExport, fb } = storeToRefs(postTypeStore);
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
      await postTypeStore.postTypeImport(formData);
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
    importExport.value = new PostTypeImportResponse();
  };
  // Clear filters
  const clearFilter = () => {
    filters.value = { global: { value: null, matchMode: 'contains' } };
  };
  </script>
  
  <template>
    <!--  Import Section -->
    <div class="bg-white rounded-lg p-6 shadow-md">
      <h2 class="text-xl font-semibold mb-2">Import Post Type CSV data</h2>
      <p class="text-gray-600 mb-4">Upload a CSV file to start importing data</p>
      <div class="flex flex-col gap-4">
        <FileUpload mode="basic" name="importFile" accept=".csv" :maxFileSize="1000000" @select="handleFileSelect"
          :auto="false" chooseLabel="Select CSV File" />
        <div v-if="selectedFile" class="flex flex-col gap-4">
          <div class="flex items-center gap-2 p-3 bg-gray-50 rounded">
            <i class="pi pi-file text-gray-500"></i>
            <span class="text-gray-700">{{ selectedFile.name }}</span>
          </div>
          <div v-if="fb.loading['postType.import']" class="w-full">
            <ProgressBar mode="indeterminate" style="height: 8px" class="w-full" />
            <p class="text-sm text-gray-600 mt-2 text-center">Importing post type data...</p>
          </div>
          <Button icon="pi pi-save" :label="fb.loading['postType.import'] ? 'Importing...' : 'Import '" severity="success"
            @click="handleSave" :loading="fb.loading['postType.import']" :disabled="fb.loading['postType.import']"
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
          filterDisplay="menu" :globalFilterFields="['name', 'plural', 'icon', 'source', 'type']" class="th-table">
          <template #header>
            <div class="flex justify-between items-center">
              <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
              <InputText v-model="filters['global'].value" placeholder="Search invalid tax rates records..." />
            </div>
          </template>
          <template #empty>No invalid tax rates records found.</template>
          <Column field="row" header="Row" style="min-width: 6rem">
            <template #body="{ data }">{{ data.row }}</template>
          </Column>
          <Column field="name" header="Name" style="min-width: 10rem">
            <template #body="{ data }">{{ data.data?.name || data.name || '' }}</template>
          </Column>
          <Column field="plural" header="Plural" style="min-width: 10rem">
            <template #body="{ data }">{{ data.data?.plural || data.plural || '' }}</template>
          </Column>
          <Column field="type" header="Type" style="min-width: 10rem">
            <template #body="{ data }">{{ data.data?.type || data.type || '' }}</template>
          </Column>
          <Column field="errors" header="Errors" style="min-width: 15rem">
            <template #body="{ data }">
              <div class="text-red-600 text-sm">{{ data.errors }}</div>
            </template>
          </Column>
          <Column field="icon" header="Icon" style="min-width: 10rem">
            <template #body="{ data }">{{ data.icon }}</template>
          </Column>
          <Column field="source" header="Source" style="min-width: 10rem">
            <template #body="{ data }">{{ data.source }}</template>
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
          :globalFilterFields="['name', 'plural', 'icon', 'source', 'type']"
          class="th-table">
          <template #header>
            <div class="flex justify-between items-center">
              <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
              <InputText v-model="filters['global'].value" placeholder="Search valid attribute content records..." />
            </div>
          </template>
          <template #empty>No valid tax rates records found.</template>
          <Column field="name" header="Name" style="min-width: 10rem">
            <template #body="{ data }">{{ data.name }}</template>
          </Column>
          <Column field="plural" header="Plural" style="min-width: 10rem">
            <template #body="{ data }">{{ data.plural }}</template>
          </Column>
          <Column field="type" header="Type" style="min-width: 10rem">
            <template #body="{ data }">{{ data.type }}</template>
          </Column>
          <Column field="icon" header="Icon" style="min-width: 10rem">
            <template #body="{ data }">{{ data.icon }}</template>
          </Column>
          <Column field="source" header="Source" style="min-width: 10rem">
            <template #body="{ data }">{{ data.source }}</template>
          </Column>
        </DataTable>
      </div>
  
      <!-- updated records data table -->
      <div v-if="importExport.updated_records > 0 && importExport.updated_data">
        <h3 class="text-lg font-semibold mb-4 text-orange-700">Records Updated ({{ importExport.updated_records }})</h3>
        <DataTable v-model:filters="filters" :value="importExport.updated_data" paginator :rows="200" dataKey="row"
          filterDisplay="menu"
          :globalFilterFields="['name', 'plural', 'icon', 'source', 'type']"
          class="th-table">
          <template #header>
            <div class="flex justify-between items-center">
              <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
              <InputText v-model="filters['global'].value" placeholder="Search updated taxonomies records..." />
            </div>
          </template>
          <template #empty>No updated taxonomies records found.</template>
          <Column field="name" header="Name" style="min-width: 10rem">
            <template #body="{ data }">{{ data.data?.name || data.name || '' }}</template>
          </Column>
          <Column field="plural" header="Plural" style="min-width: 10rem">
            <template #body="{ data }">{{ data.data?.plural || data.plural || '' }}</template>
          </Column>
          <Column field="icon" header="Icon" style="min-width: 10rem">
            <template #body="{ data }">{{ data.data?.icon || data.icon || '' }}</template>
          </Column>
          <Column field="source" header="Source" style="min-width: 10rem">
            <template #body="{ data }">{{ data.data?.source || data.source || '' }}</template>
          </Column>
          <Column field="type" header="Type" style="min-width: 10rem">
            <template #body="{ data }">{{ data.data?.type || data.type || '' }}</template>
          </Column>
        </DataTable>
      </div>
    </div>
    <div v-if="fb.errors['postType.import']" class="text-red-600 text-sm pt-5">
      <div v-html="fb.errors['postType.import']"></div>
    </div>
  </template>
  
  <style scoped>
  .product-attribute-index {
    padding: 2rem;
  }
  .p-datatable .p-datatable-thead > tr > th {
    background-color: var(--surface-100);
  }
  .p-datatable .p-datatable-tbody > tr > td {
    padding: 1rem;
  }
  </style>
  