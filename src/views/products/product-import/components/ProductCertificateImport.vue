<script setup>
import { formatImportImageData } from '@/utils/mediaUrl';
import { ref } from 'vue';
import { useProductStore } from '@/stores/product';
import { useToast } from 'primevue/usetoast';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import FileUpload from 'primevue/fileupload';
import ProgressBar from 'primevue/progressbar';

const toast = useToast();
const productStore = useProductStore();

// Certificate Import
const selectedFile = ref(null);
const isSaving = ref(false);
const importResults = ref(null);
const showResults = ref(false);


// Filters for datatables
const filters = ref({
    global: { value: null, matchMode: 'contains' }
});

const handleFile = (event) => {
    const file = event.files[0];
    if (!file) return;
    if (!file.name.endsWith('.csv')) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Please select a CSV file', life: 3000 });
        return;
    }
    selectedFile.value = file;
};

const handleSave = async () => {
    if (!selectedFile.value) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Please select a file first', life: 3000 });
        return;
    }
    isSaving.value = true;
    try {
        const formData = new FormData();
        formData.append('csv_file', selectedFile.value);
        const response = await productStore.createProductRelationalTableDataImport(formData, 'certificate');
        importResults.value = {
            success: {
                total_records: response.total_records,
                valid_records: response.valid_records,
                invalid_records: response.invalid_records,
                updated_records: response.updated_records,
                inserted_count: response.inserted_count,
                valid_data: response.valid_data,
                invalid_data: response.invalid_data,
                updated_data: response.updated_data,
            }
        };
        console.log('importResults certificate vue :', importResults.value);
        showResults.value = true;
        toast.add({ severity: 'success', summary: 'Success', detail: 'Certificate imported successfully', life: 3000 });
        selectedFile.value = null;
    } catch (error) {
        console.error('Save error:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: error.message || 'Failed to save file', life: 3000 });
    } finally {
        isSaving.value = false;
    }
};


// Clear filters and results
const clearFilter = () => {
    filters.value.global.value = null;
};

const clearResults = () => {
    importResults.value = null;
    showResults.value = false;
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

    <!-- Certificate Import Section -->
    <div class="bg-white rounded-lg p-6 shadow-md">
        <h2 class="text-xl font-semibold mb-2">Import Certificate CSV data</h2>
        <p class="text-gray-600 mb-4">Upload a CSV file to import Certificate data.</p>
        <div class="flex flex-col gap-4">
            <FileUpload mode="basic" name="importCertificateFile" accept=".csv" :maxFileSize="1000000"
                @select="handleFile" :auto="false" chooseLabel="Select CSV File" />

            <div v-if="selectedFile" class="flex flex-col gap-4">
                <div class="flex items-center gap-2 p-3 bg-gray-50 rounded">
                    <i class="pi pi-file text-gray-500"></i>
                    <span class="text-gray-700">{{ selectedFile.name }}</span>
                </div>
                <div v-if="isSaving" class="w-full">
                    <ProgressBar mode="indeterminate" style="height: 8px" class="w-full" />
                    <p class="text-sm text-gray-600 mt-2 text-center">Importing Certificate data...</p>
                </div>
                <Button icon="pi pi-save" :label="isSaving ? 'Saving...' : 'Import Certificate'"
                    severity="success" @click="handleSave" :loading="isSaving"
                    :disabled="isSaving" class="p-button-md" />
            </div>
        </div>
    </div>

    <!-- Certificate Import Results -->
    <div v-if="showResults && importResults"
        class="bg-white rounded-lg p-6 shadow-md">
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-semibold">Certificate Import Results</h2>
            <Button icon="pi pi-times" label="Clear Results" severity="secondary" outlined
                @click="clearResults" />
        </div>

        <!-- Summary Stats -->
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div class="text-2xl font-bold text-blue-600">{{
                    importResults?.success?.total_records || 0
                }}</div>
                <div class="text-sm text-blue-800">Total Records</div>
            </div>
            <div class="bg-green-50 p-4 rounded-lg border border-green-200">
                <div class="text-2xl font-bold text-green-600">{{
                    importResults?.success?.valid_records ||
                    0 }}</div>
                <div class="text-sm text-green-800">Valid Records</div>
            </div>
            <div class="bg-red-50 p-4 rounded-lg border border-red-200">
                <div class="text-2xl font-bold text-red-600">{{
                    importResults?.success?.invalid_records ||
                    0 }}</div>
                <div class="text-sm text-red-800">Invalid Records</div>
            </div>
            <div class="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <div class="text-2xl font-bold text-orange-600">{{
                    importResults?.success?.updated_records
                    || 0 }}</div>
                <div class="text-sm text-orange-800">Updated Records</div>
            </div>
            <div class="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <div class="text-2xl font-bold text-purple-600">{{
                    importResults?.success?.inserted_count
                    || 0 }}</div>
                <div class="text-sm text-purple-800">Inserted Records</div>
            </div>
        </div>

        <!-- Invalid Records DataTable -->
        <div v-if="importResults?.success?.invalid_records > 0 && importResults?.success?.invalid_data"
            class="mb-6">
            <h3 class="text-lg font-semibold mb-4 text-red-700">Invalid Records ({{
                importResults.success.invalid_records }})</h3>
            <DataTable v-model:filters="filters" :value="importResults.success.invalid_data" paginator
                :rows="10" dataKey="row" filterDisplay="menu" :globalFilterFields="['data.Product', 'data.Certificate', 'data.certificate_type', 'data.Type', 'data.title']"
                class="th-table">
                <template #header>
                    <div class="flex justify-between items-center">
                        <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                        <InputText v-model="filters['global'].value"
                            placeholder="Search invalid certificate records..." />
                    </div>
                </template>
                <template #empty> No invalid certificate records found. </template>
                <Column field="row" header="Row" style="min-width: 6rem">
                    <template #body="{ data }">{{ data.row }}</template>
                </Column>
                <Column field="data.Product" header="Product" style="min-width: 10rem">
                    <template #body="{ data }">{{ data.data.Product }}</template>
                </Column>
                <Column field="data.Certificate" header="Certificate" style="min-width: 12rem">
                    <template #body="{ data }">{{ data.data.Certificate }}</template>
                </Column>
                <Column field="data.Type" header="Type" style="min-width: 12rem">
                    <template #body="{ data }">
                        {{ data.data.Type }}
                    </template>
                </Column>
                <Column field="errors" header="Errors" style="min-width: 15rem">
                    <template #body="{ data }">
                        <div class="text-red-600 text-sm">{{ formatErrors(data.errors) }}</div>
                    </template>
                </Column>
            </DataTable>
        </div>

        <!-- Updated Records DataTable -->
        <div v-if="importResults?.success?.updated_records > 0 && importResults?.success?.updated_data"
            class="mb-6">
            <h3 class="text-lg font-semibold mb-4 text-orange-700">Updated Records ({{
                importResults.success.updated_records }})</h3>
            <DataTable v-model:filters="filters" :value="importResults.success.updated_data" paginator
                :rows="10" dataKey="row" filterDisplay="menu" :globalFilterFields="['Product', 'Certificate', 'Type']"
                class="th-table">
                <template #header>
                    <div class="flex justify-between items-center">
                        <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                        <InputText v-model="filters['global'].value" placeholder="Search updated certificate records..." />
                    </div>
                </template>
                <template #empty> No updated certificate records found. </template>
                <Column field="Product" header="Product" style="min-width: 10rem">
                        <template #body="{ data }">{{ data.Product }}</template>
                </Column>
                <Column field="Certificate" header="Certificate" style="min-width: 12rem">
                        <template #body="{ data }">{{ data.Certificate }}</template>
                </Column>
                <Column field="Type" header="Type" style="min-width: 12rem">
                        <template #body="{ data }">{{ data.Type }}</template>
                </Column>
            </DataTable>
        </div>

        <!-- Valid Records DataTable -->
        <div
            v-if="importResults?.success?.valid_records > 0 && importResults?.success?.valid_data">
            <h3 class="text-lg font-semibold mb-4 text-green-700">Valid Records ({{
                importResults.success.valid_records }})</h3>
            <DataTable v-model:filters="filters" :value="importResults.success.valid_data" paginator
                :rows="10" dataKey="certificate_code" filterDisplay="menu" :globalFilterFields="['Product', 'Certificate', 'Type']"
                class="th-table">
                <template #header>
                    <div class="flex justify-between items-center">
                        <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                        <InputText v-model="filters['global'].value"
                            placeholder="Search valid certificate records..." />
                    </div>
                </template>
                <template #empty> No valid certificate records found. </template>
                <!-- <Column field="vendor_code" header="Code" style="min-width: 10rem" /> -->
                <Column field="Product" header="Product" style="min-width: 10rem">
                    <template #body="{ data }">
                        {{ data.Product }}
                    </template>
                </Column>
                <Column field="Certificate" header="Certificate" style="min-width: 12rem">
                    <template #body="{ data }">
                        {{ data.Certificate }}
                    </template>
                </Column>
                <Column field="Type" header="Type" style="min-width: 12rem">
                    <template #body="{ data }">
                        {{ data.Type }}
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
</template>

<style scoped>
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
