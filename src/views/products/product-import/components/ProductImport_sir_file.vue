<script setup>
import { ref } from 'vue';
import { useProductStore } from '@/stores/product';
import { useToast } from 'primevue/usetoast';
import { storeToRefs } from 'pinia';

//System variables such as props, useStore or stateToRef etc
const toast = useToast();
const productStore = useProductStore();
const { importExport } = storeToRefs(productStore);

//Declear emits
const emit = defineEmits({  })


const showProductsResults = ref(false);
const selectedFileProducts = ref(null);
const isSavingProducts = ref(false);

//Filters for datatables
const filters = ref({
    global: { value: null, matchMode: 'contains' }
});

//Define local methods here

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
    
        
        showProductsResults.value = true;

        toast.add({ severity: 'success', summary: 'Success', detail: 'Products imported successfully', life: 3000 });
        selectedFileProducts.value = null;
    } catch (error) {
        console.error('Save error:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: error.message || 'Failed to save file', life: 3000 });
    } finally {
        isSavingProducts.value = false;
    }
};

const clearProductsResults = () => {
    showProductsResults.value = false;
};

//Lifecycle hook started from here

</script>

<template>
  <div class="product-import">
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
                <Button icon="pi pi-save" :label="isSavingProducts ? 'Saving...' : 'Import Products'"
                    severity="success" @click="handleSaveProducts" :loading="isSavingProducts"
                    :disabled="isSavingProducts" class="p-button-md" />
            </div>
        </div>
    </div>

    <!-- Products Import Results Section -->
    <div v-if="showProductsResults && importExport" class="bg-white rounded-lg p-6 shadow-md">
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-semibold">Products Import Results</h2>
            <Button icon="pi pi-times" label="Clear Results" severity="secondary" outlined
                @click="clearProductsResults" />
        </div>
        
        <!--  items Import Results Section -->
      <div v-if="showProductsResults" class="bg-white rounded-lg p-6 shadow-md mt-6">

        <!-- Summary Statistics -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div class="text-2xl font-bold text-blue-600">{{ importExport.total_records || 0 }}</div>
            <div class="text-sm text-blue-800">Total Records</div>
          </div>
          <div class="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <div class="text-2xl font-bold text-orange-600">{{ importExport.duplicated_records || 0 }}</div>
            <div class="text-sm text-orange-800">Duplicate Records</div>
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
                <InputText v-model="filters['global'].value" placeholder="Search invalid  item records..." />
              </div>
            </template>
            <template #empty>No invalid  item records found.</template>
            <Column field="row" header="Row" style="min-width: 6rem">
              <template #body="{ data }">
                {{ data.row }}
              </template>
            </Column>
            <Column field="data.value" header="Name" style="min-width: 15rem">
              <template #body="{ data }">
                {{ data.data.name }}
              </template>
            </Column>
            <Column field="data.unit" header="Unit" style="min-width: 10rem">
              <template #body="{ data }">
                {{ data.data.unit }}
              </template>
            </Column>
            <Column field="data.value" header="Value" style="min-width: 10rem">
              <template #body="{ data }">{{ data.data.value }}</template>
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

        <!-- Duplicate Records DataTable -->
        <div v-if="importExport.duplicated_records > 0 && importExport.duplicated_data" class="mb-6">
          <h3 class="text-lg font-semibold mb-4 text-red-700">Duplicate Records ({{ importExport.duplicated_records }})
          </h3>
          <DataTable v-model:filters="filters" :value="importExport.duplicated_data" paginator :rows="200" dataKey="row"
            filterDisplay="menu" :globalFilterFields="['data.name', 'data.language_id']" class="th-table">
            <template #header>
              <div class="flex justify-between items-center">
                <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                <InputText v-model="filters['global'].value" placeholder="Search duplicate  items records..." />
              </div>
            </template>
            <template #empty>No invalid  items records found.</template>
            <Column field="row" header="Row" style="min-width: 6rem">
              <template #body="{ data }">{{ data.row }}</template>
            </Column>
            <Column field="data.name" header="Name" style="min-width: 10rem">
              <template #body="{ data }">{{ data.data.name }}</template>
            </Column>
            <Column field="data.unit" header="Unit" style="min-width: 10rem">
              <template #body="{ data }">{{ data.data.unit }}</template>
            </Column>
            <Column field="data.value" header="Value" style="min-width: 10rem">
              <template #body="{ data }">{{ data.data.value }}</template>
            </Column>
          </DataTable>
        </div>

        <!-- Updated Records DataTable -->
        <div v-if="importExport.updated_records > 0 && importExport.updated_data" class="mb-6">
          <h3 class="text-lg font-semibold mb-4 text-orange-700">
            Updated Records ({{ importExport.updated_records }})
          </h3>
          <DataTable v-model:filters="filters" :value="importExport.updated_data" paginator :rows="100"
            dataKey="option_id" filterDisplay="menu"
            :globalFilterFields="['name', 'unit']" class="th-table">
            <template #header>
              <div class="flex justify-between items-center">
                <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                <InputText v-model="filters['global'].value" placeholder="Search updated  item records..." />
              </div>
            </template>
            <template #empty>No updated  item records found.</template>
            <!-- <Column field="data._item_id" header="Id" style="min-width: 10rem">
              <template #body="{ data }">{{ data._item_id }}</template>
            </Column> -->
            <Column field="data.name" header="Name" style="min-width: 10rem">
              <template #body="{ data }">{{ data.name }}</template>
            </Column>
            <Column field="data.unit" header="Unit" style="min-width: 10rem">
              <template #body="{ data }">{{ data.unit }}</template>
            </Column>
            <Column field="data.value" header="Value" style="min-width: 10rem">
              <template #body="{ data }">{{ data.value }}</template>
            </Column>
            
          </DataTable>
        </div>

        <!-- Valid Records DataTable -->
        <div v-if="importExport.valid_records > 0 && importExport.products.valid_data">
          <h3 class="text-lg font-semibold mb-4 text-green-700">
            Valid Records ({{ importExport.valid_records }})
          </h3>
          <DataTable 
            v-model:filters="filters" 
            :value="importExport.products.valid_data" 
            paginator 
            :rows="100" 
            dataKey="product_code"
            filterDisplay="menu" 
            :globalFilterFields="['product_code', 'description']" 
            class="th-table">
            <template #header>
              <div class="flex justify-between items-center">
                <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                <InputText v-model="filters['global'].value" placeholder="Search valid  item records..." />
              </div>
            </template>
            <template #empty>No valid option content records found.</template>
            <Column field="row" header="Row" style="min-width: 6rem">
              <template #body="{ data }">
                <Image :src="data.main_image_one" alt="Product Image" width="50" height="50" />
              </template>
            </Column>
            <Column field="product_code" header="Product Code" style="min-width: 15rem" />
            <Column field="description" header="Description" style="min-width: 15rem" />
          </DataTable>
        </div>

      </div>

    </div>
  </div>
</template>