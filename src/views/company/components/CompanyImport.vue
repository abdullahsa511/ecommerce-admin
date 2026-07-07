<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useCompanyStore } from '@/stores/company';
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
const companyStore = useCompanyStore();
const { fb } = storeToRefs(companyStore);

const filters = ref({ global: { value: null, matchMode: 'contains' } });
const toast = useToast();

// ===========================================================
// Companies Import related states
// ===========================================================
const selectedFileCompanies = ref<File | null>(null);
const isSavingCompanies = ref(false);
// const importExport = ref<any>(null);
const importExport = ref(null);
const showCompaniesResults = ref(false);

// ===========================================================
// Define Local Methods
// ===========================================================

// Handle file selection for company import
const handleFileSelectCompanies = (event: any) => {
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

  selectedFileCompanies.value = file;
};

// Handle company import (save action)
const handleSaveCompanies = async () => {
  if (!selectedFileCompanies.value) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Please select a file first',
      life: 3000
    });
    return;
  }

  isSavingCompanies.value = true;

  try {
    const formData = new FormData();
    formData.append('csv_file', selectedFileCompanies.value);
    formData.append('status', 'pending');

    const response = await companyStore.companiesImport(formData);
    importExport.value = response;

    // importExport.value = {
    //   success: {
    //     total_records: response.total_records || 0,
    //     valid_records: response.valid_records || 0,
    //     invalid_records: response.invalid_records || 0,
    //     updated_records: response.updated_records || 0,
    //     inserted_count: response.inserted_count || 0,
    //     // prefer response.company_contents.valid_data, fall back to other possible keys returned by the API
    //     valid_data:response.valid_data || response.company_contents?.valid_data || [],
    //     invalid_data: response.invalid_data || [],
    //     updated_data: response.updated_data || [],
    //     valid_company_data: response.valid_company_data || [],
    //   },
    // };

    showCompaniesResults.value = true;

    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Companies imported successfully',
      life: 3000
    });

    selectedFileCompanies.value = null;

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
    isSavingCompanies.value = false;
  }
};

// Clear company import results
const clearCompaniesResults = () => {
  importExport.value = null;
  showCompaniesResults.value = false;
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
  <!-- Companies Import Section -->
  <div class="bg-white rounded-lg p-6 shadow-md">
    <h2 class="text-xl font-semibold mb-2">Import Companies CSV data</h2>
    <p class="text-gray-600 mb-4">Upload a CSV file to start importing companies data</p>
    <div class="flex flex-col gap-4">
      <FileUpload mode="basic" name="importCompaniesFile" accept=".csv" :maxFileSize="1000000"
        @select="handleFileSelectCompanies" :auto="false" chooseLabel="Select CSV File" />
      <div v-if="selectedFileCompanies" class="flex flex-col gap-4">
        <div class="flex items-center gap-2 p-3 bg-gray-50 rounded">
          <i class="pi pi-file text-gray-500"></i>
          <span class="text-gray-700">{{ selectedFileCompanies.name }}</span>
        </div>
        <div v-if="isSavingCompanies" class="w-full">
          <ProgressBar mode="indeterminate" style="height: 8px" class="w-full" />
          <p class="text-sm text-gray-600 mt-2 text-center">Importing companies data...</p>
        </div>
        <Button icon="pi pi-save" :label="isSavingCompanies ? 'Saving...' : 'Import Companies'" severity="success"
          @click="handleSaveCompanies" :loading="isSavingCompanies" :disabled="isSavingCompanies"
          class="p-button-md" />
      </div>
    </div>
  </div>
  <!-- Companies Import Results Section -->
  <div v-if="showCompaniesResults && importExport" class="bg-white rounded-lg p-6 shadow-md">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-semibold">Companies Import Results</h2>
      <Button icon="pi pi-times" label="Clear Results" severity="secondary" outlined @click="clearCompaniesResults" />
    </div>

    <!-- Summary Statistics -->
    <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
      <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div class="text-2xl font-bold text-blue-600">{{
          importExport?.total_records || 0
          }}</div>
        <div class="text-sm text-blue-800">Total Records</div>
      </div>
      <div class="bg-green-50 p-4 rounded-lg border border-green-200">
        <div class="text-2xl font-bold text-green-600">{{
          importExport?.valid_records || 0
          }}</div>
        <div class="text-sm text-green-800">Valid Records</div>
      </div>
      <div class="bg-red-50 p-4 rounded-lg border border-red-200">
        <div class="text-2xl font-bold text-red-600">{{
          importExport?.invalid_records || 0
          }}</div>
        <div class="text-sm text-red-800">Invalid Records</div>
      </div>
      <div class="bg-orange-50 p-4 rounded-lg border border-orange-200">
        <div class="text-2xl font-bold text-orange-600">{{
          importExport?.updated_records || 0
          }}</div>
        <div class="text-sm text-orange-800">Updated Records</div>
      </div>
      <div class="bg-purple-50 p-4 rounded-lg border border-purple-200">
        <div class="text-2xl font-bold text-purple-600">{{
          importExport?.inserted_count || 0
          }}</div>
        <div class="text-sm text-purple-800">Inserted Records</div>
      </div>
    </div>
    <!-- Invalid Records DataTable -->
    <div v-if="importExport?.invalid_records > 0 && importExport?.invalid_data"
      class="mb-6">
      <h3 class="text-lg font-semibold mb-4 text-red-700">Invalid Records ({{
        importExport.invalid_records
        }})</h3>
      <DataTable v-model:filters="filters" :value="importExport.invalid_data" paginator :rows="10"
        dataKey="row" filterDisplay="menu"
        :globalFilterFields="['data.company_code', 'data.company_name', 'data.company_prefix']"
        class="th-table">
        <template #header>
          <div class="flex justify-between items-center">
            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
            <InputText v-model="filters['global'].value" placeholder="Search invalid companies records..." />
          </div>
        </template>
        <template #empty> No invalid companies records found. </template>
        <Column field="row" header="Row" style="min-width: 6rem">
          <template #body="{ data }">
            {{ data.row }}
          </template>
        </Column>
        <Column field="data.company_code" header="Company Code" style="min-width: 10rem">
          <template #body="{ data }">
            {{ data.data.company_code }}
          </template>
        </Column>
        <Column field="data.company_name" header="Company Name" style="min-width: 10rem">
          <template #body="{ data }">
            {{ data.data.company_name }}
          </template>
        </Column>
        <Column field="data.company_prefix" header="Company Prefix" style="min-width: 10rem">
          <template #body="{ data }">
            {{ data.data.company_prefix }}
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
    <div v-if="importExport?.updated_records > 0 && importExport?.updated_data">
      <h3 class="text-lg font-semibold mb-4 text-orange-700">Updated Records ({{
        importExport?.updated_records || 0
        }})</h3>
        
      <DataTable v-model:filters="filters" :value="importExport?.updated_data" paginator :rows="10"
        dataKey="company_code" filterDisplay="menu" :globalFilterFields="['company_code', 'company_name', 'company_prefix']" class="th-table">
        <template #header>
          <div class="flex justify-between items-center">
            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
            <InputText v-model="filters['global'].value" placeholder="Search valid company records..." />
          </div>
        </template>
        <template #empty>
          No valid company records found.
        </template>

        <Column field="data.company_code" header="Company Code" style="min-width: 10rem">
          <template #body="{ data }">
            {{ data.data.company_code }}
          </template>
        </Column>

        <Column field="data.company_name" header="Company Name" style="min-width: 15rem">
          <template #body="{ data }">
            {{ data.data.company_name }}
          </template>
        </Column>

        <Column field="data.company_prefix" header="Company Prefix" style="min-width: 12rem">
          <template #body="{ data }">
            {{ data.data.company_prefix }}
          </template>
        </Column>

        <Column field="data.vendor_id" header="Vendor ID" style="min-width: 8rem">
          <template #body="{ data }">
            {{ data.data.vendor_id }}
          </template>
        </Column>

        <Column field="data.company_entity" header="Company Entity" style="min-width: 15rem">
          <template #body="{ data }">
            {{ data.data.company_entity }}
          </template>
        </Column>

        <Column field="data.company_short" header="Company Short" style="min-width: 15rem">
          <template #body="{ data }">
            {{ data.data.company_short }}
          </template>
        </Column>

        <Column field="data.sort_order" header="Sort Order" style="min-width: 15rem">
          <template #body="{ data }">
            {{ data.data.sort_order }}
          </template>
        </Column>

        <Column field="data.company_trade_name" header="Company Trade Name" style="min-width: 15rem">
          <template #body="{ data }">
            {{ data.data.company_trade_name }}
          </template>
        </Column>

        <Column field="data.company_entity_name" header="Company Entity Name" style="min-width: 15rem">
          <template #body="{ data }">
            {{ data.data.company_entity_name }}
          </template>
        </Column>

        <Column field="data.phone_main" header="Phone Main" style="min-width: 12rem">
          <template #body="{ data }">
            {{ data.data.phone_main }}
          </template>
        </Column>

        <Column field="data.krost_org_id" header="Krost Org ID" style="min-width: 12rem">
          <template #body="{ data }">
            {{ data.data.krost_org_id }}
          </template>
        </Column>

        <Column field="data.krost_qld_org_id" header="Krost QLD Org ID" style="min-width: 12rem">
          <template #body="{ data }">
            {{ data.data.krost_qld_org_id }}
          </template>
        </Column>

        <Column field="data.klein_org_id" header="Klein Org ID" style="min-width: 12rem">
          <template #body="{ data }">
            {{ data.data.klein_org_id }}
          </template>
        </Column>

        <Column field="data.meloz_org_id" header="Meloz Org ID" style="min-width: 12rem">
          <template #body="{ data }">
            {{ data.data.meloz_org_id }}
          </template>
        </Column>

        <Column field="data.gregbar_org_id" header="Gregbar Org ID" style="min-width: 12rem">
          <template #body="{ data }">
            {{ data.data.gregbar_org_id }}
          </template>
        </Column>

        <Column field="data.ship_building" header="Ship Building" style="min-width: 12rem">
          <template #body="{ data }">
            {{ data.data.ship_building }}
          </template>
        </Column>

        <Column field="data.ship_street" header="Ship Street" style="min-width: 12rem">
          <template #body="{ data }">
            {{ data.data.ship_street }}
          </template>
        </Column>

        <Column field="data.ship_suburb" header="Ship Suburb" style="min-width: 12rem">
          <template #body="{ data }">
            {{ data.data.ship_suburb }}
          </template>
        </Column>
        
        <Column field="data.ship_state" header="Ship State" style="min-width: 12rem">
          <template #body="{ data }">
            {{ data.data.ship_state }}
          </template>
        </Column>
        
        
        <Column field="data.ship_postcode" header="Ship Postcode" style="min-width: 12rem">
          <template #body="{ data }">
            {{ data.data.ship_postcode }}
          </template>
        </Column>
        
        
        
        
        <Column field="data.bill_building" header="Bill Building" style="min-width: 12rem">
          <template #body="{ data }">
            {{ data.data.bill_building }}
          </template>
        </Column>
        
        
        
        <Column field="data.bill_street" header="Bill Street" style="min-width: 12rem">
          <template #body="{ data }">
            {{ data.data.bill_street }}
          </template>
        </Column> 
        
        <Column field="data.bill_suburb" header="Bill Suburb" style="min-width: 12rem">
          <template #body="{ data }">
            {{ data.data.bill_suburb }}
          </template>
        </Column>
        
        <Column field="data.bill_state" header="Bill State" style="min-width: 12rem">
          <template #body="{ data }">
            {{ data.data.bill_state }}
          </template>
        </Column>

        <Column field="data.bill_postcode" header="Bill Postcode" style="min-width: 12rem">
          <template #body="{ data }">
            {{ data.data.bill_postcode }}
          </template>
        </Column>

        <Column field="data.bill_country" header="Bill Country" style="min-width: 12rem">
          <template #body="{ data }">
            {{ data.data.bill_country }}
          </template>
        </Column>

        <Column field="data.po_box" header="PO Box" style="min-width: 12rem">
          <template #body="{ data }">
            {{ data.data.po_box }}
          </template>
        </Column>

        <Column field="data.po_box_suburb" header="PO Box Suburb" style="min-width: 12rem">
          <template #body="{ data }">
            {{ data.data.po_box_suburb }}
          </template>
        </Column>

        <Column field="data.po_box_state" header="PO Box State" style="min-width: 12rem">
          <template #body="{ data }">
            {{ data.data.po_box_state }}
          </template>
        </Column>

        <Column field="data.abn" header="ABN" style="min-width: 12rem">
          <template #body="{ data }">
            {{ data.data.abn }}
          </template>
        </Column>

        <Column field="data.bsb" header="BSB" style="min-width: 12rem">
          <template #body="{ data }">
            {{ data.data.bsb }}
          </template>
        </Column>

        <Column field="data.account_number" header="Account Number" style="min-width: 12rem">
          <template #body="{ data }">
            {{ data.data.account_number }}
          </template>
        </Column>

        <Column field="data.bpay_biller_code" header="Bpay Biller Code" style="min-width: 12rem">
          <template #body="{ data }">
            {{ data.data.bpay_biller_code }}
          </template>
        </Column>
      </DataTable>
    </div>
    
    <!-- Valid Records DataTable -->
    <div v-if="importExport?.valid_records > 0 && importExport?.valid_data">
      <h3 class="text-lg font-semibold mb-4 text-green-700">Valid Records ({{
        importExport?.valid_records || 0
        }})</h3>
      <DataTable v-model:filters="filters" :value="importExport?.valid_data" paginator :rows="10"
        dataKey="company_code" filterDisplay="menu" :globalFilterFields="['company_code', 'company_name', 'company_prefix']" class="th-table">
        <template #header>
          <div class="flex justify-between items-center">
            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
            <InputText v-model="filters['global'].value" placeholder="Search valid company records..." />
          </div>
        </template>
        <template #empty>
          No valid company records found.
        </template>
        <Column field="company_code" header="Company Code" style="min-width: 12rem" />
        <Column field="company_name" header="Company Name" style="min-width: 15rem" />
        <Column field="company_prefix" header="Company Prefix" style="min-width: 12rem" />
        <Column field="vendor_id" header="Vendor ID" style="min-width: 8rem" />
        <Column field="company_entity" header="Company Entity" style="min-width: 15rem" />
        <Column field="company_short" header="Company Short" style="min-width: 15rem" />
        <Column field="sort_order" header="Sort Order" style="min-width: 15rem" />
        <Column field="company_trade_name" header="Company Trade Name" style="min-width: 15rem" />
        <Column field="company_entity_name" header="Company Entity Name" style="min-width: 15rem" />
        <Column field="phone_main" header="Phone Main" style="min-width: 12rem" />
        <Column field="krost_org_id" header="Krost Org ID" style="min-width: 12rem" />
        <Column field="krost_qld_org_id" header="Krost QLD Org ID" style="min-width: 12rem" />
        <Column field="klein_org_id" header="Klein Org ID" style="min-width: 12rem" />
        <Column field="meloz_org_id" header="Meloz Org ID" style="min-width: 12rem" />
        <Column field="gregbar_org_id" header="Gregbar Org ID" style="min-width: 12rem" />
        <Column field="ship_building" header="Ship Building" style="min-width: 12rem" />
        <Column field="ship_street" header="Ship Street" style="min-width: 12rem" />
        <Column field="ship_suburb" header="Ship Suburb" style="min-width: 12rem" />
        <Column field="ship_state" header="Ship State" style="min-width: 12rem" />
        <Column field="ship_postcode" header="Ship Postcode" style="min-width: 12rem" />
        <Column field="ship_country" header="Ship Country" style="min-width: 12rem" />
        <Column field="bill_building" header="Bill Building" style="min-width: 12rem" />
        <Column field="bill_street" header="Bill Street" style="min-width: 12rem" />
        <Column field="bill_suburb" header="Bill Suburb" style="min-width: 12rem" />
        <Column field="bill_state" header="Bill State" style="min-width: 12rem" />
        <Column field="bill_postcode" header="Bill Postcode" style="min-width: 12rem" />
        <Column field="bill_country" header="Bill Country" style="min-width: 12rem" />
        <Column field="po_box" header="PO Box" style="min-width: 12rem" />
        <Column field="po_box_suburb" header="PO Box Suburb" style="min-width: 12rem" />
        <Column field="po_box_state" header="PO Box State" style="min-width: 12rem" />
        <Column field="abn" header="ABN" style="min-width: 12rem" />
        <Column field="bsb" header="BSB" style="min-width: 12rem" />
        <Column field="account_number" header="Account Number" style="min-width: 12rem" />
        <Column field="bpay_biller_code" header="Bpay Biller Code" style="min-width: 12rem" />
      </DataTable>
    </div>
  </div>
</template>
