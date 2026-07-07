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

// Products Images Import
const selectedFileProductsImages = ref(null);
const isSavingProductsImages = ref(false);
const productsImagesImportResults = ref(null);
const showProductsImagesResults = ref(false);

// Filters for datatables
const filters = ref({
    global: { value: null, matchMode: 'contains' }
});

// Handlers for Products Images Import
const handleFileSelectProductsImages = (event) => {
    const file = event.files[0];
    if (!file) return;
    if (!file.name.endsWith('.csv')) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Please select a CSV file', life: 3000 });
        return;
    }
    selectedFileProductsImages.value = file;
};

const handleSaveProductsImages = async () => {
    if (!selectedFileProductsImages.value) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Please select a file first', life: 3000 });
        return;
    }
    isSavingProductsImages.value = true;
    try {
        const formData = new FormData();
        formData.append('csv_file', selectedFileProductsImages.value);
        const response = await productStore.createProductRelationalTableDataImport(formData, 'product_image');
        // productsImagesImportResults.value = response;
        productsImagesImportResults.value = {
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
        showProductsImagesResults.value = true;
        toast.add({ severity: 'success', summary: 'Success', detail: 'Product images imported successfully', life: 3000 });
        selectedFileProductsImages.value = null;
    } catch (error) {
        console.error('Save error:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: error.message || 'Failed to save file', life: 3000 });
    } finally {
        isSavingProductsImages.value = false;
    }
};

// Clear filters and results
const clearFilter = () => {
    filters.value.global.value = null;
};

const clearProductsImagesResults = () => {
    productsImagesImportResults.value = null;
    showProductsImagesResults.value = false;
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

    <!-- Products Images Import Section -->
    <div class="bg-white rounded-lg p-6 shadow-md">
        <h2 class="text-xl font-semibold mb-2">Import Products Images CSV data</h2>
        <p class="text-gray-600 mb-4">Upload a CSV file to start importing product images data</p>
        <div class="flex flex-col gap-4">
            <FileUpload mode="basic" name="importProductsImagesFile" accept=".csv" :maxFileSize="1000000"
                @select="handleFileSelectProductsImages" :auto="false" chooseLabel="Select CSV File" />
            <div v-if="selectedFileProductsImages" class="flex flex-col gap-4">
                <div class="flex items-center gap-2 p-3 bg-gray-50 rounded">
                    <i class="pi pi-file text-gray-500"></i>
                    <span class="text-gray-700">{{ selectedFileProductsImages.name }}</span>
                </div>
                <div v-if="isSavingProductsImages" class="w-full">
                    <ProgressBar mode="indeterminate" style="height: 8px" class="w-full" />
                    <p class="text-sm text-gray-600 mt-2 text-center">Importing product images data...
                    </p>
                </div>
                <Button icon="pi pi-save" :label="isSavingProductsImages ? 'Saving...' : 'Import Images'"
                    severity="success" @click="handleSaveProductsImages" :loading="isSavingProductsImages"
                    :disabled="isSavingProductsImages" class="p-button-md" />
            </div>
        </div>
    </div>
    <!-- Products Images Import Results Section -->
    <div v-if="showProductsImagesResults && productsImagesImportResults" class="bg-white rounded-lg p-6 shadow-md">
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-semibold">Products Images Import Results</h2>
            <Button icon="pi pi-times" label="Clear Results" severity="secondary" outlined
                @click="clearProductsImagesResults" />
        </div>
        <!-- Summary Statistics -->
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div class="text-2xl font-bold text-blue-600">{{
                    productsImagesImportResults?.success?.total_records || 0
                }}</div>
                <div class="text-sm text-blue-800">Total Records</div>
            </div>
            <div class="bg-green-50 p-4 rounded-lg border border-green-200">
                <div class="text-2xl font-bold text-green-600">{{
                    productsImagesImportResults?.success?.valid_records || 0
                }}</div>
                <div class="text-sm text-green-800">Valid Records</div>
            </div>
            <div class="bg-red-50 p-4 rounded-lg border border-red-200">
                <div class="text-2xl font-bold text-red-600">{{
                    productsImagesImportResults?.success?.invalid_records || 0
                }}</div>
                <div class="text-sm text-red-800">Invalid Records</div>
            </div>
            <div class="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <div class="text-2xl font-bold text-orange-600">{{
                    productsImagesImportResults?.success?.updated_records || 0
                }}</div>
                <div class="text-sm text-orange-800">Updated Records</div>
            </div>
            <div class="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <div class="text-2xl font-bold text-purple-600">{{
                    productsImagesImportResults?.success?.inserted_count || 0
                }}</div>
                <div class="text-sm text-purple-800">Inserted Records</div>
            </div>
        </div>

        <!-- Invalid Records DataTable -->
        <div v-if="productsImagesImportResults?.success?.invalid_records > 0 && productsImagesImportResults?.success?.invalid_data"
            class="mb-6">
            <h3 class="text-lg font-semibold mb-4 text-red-700">Invalid Records ({{
                productsImagesImportResults.success.invalid_records
            }})</h3>
            <DataTable v-model:filters="filters" :value="productsImagesImportResults.success.invalid_data" paginator
                :rows="10" dataKey="row" filterDisplay="menu"
                :globalFilterFields="['data.product_code', 'data.image_link', 'data.image', 'data.sort_order', 'data.status', 'data.way_point']"
                class="th-table">
                <template #header>
                    <div class="flex justify-between items-center">
                        <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                        <InputText v-model="filters['global'].value"
                            placeholder="Search invalid product images records..." />
                    </div>
                </template>
                <template #empty> No invalid product images records found. </template>
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
                <Column field="data.image_link" header="Image Link" style="min-width: 15rem">
                    <template #body="{ data }">
                        <a :href="data.data.image_link" target="_blank" class="text-blue-500 hover:underline">
                            {{ data.data.image_link ? data.data.image_link.substring(0, 30) +
                                (data.data.image_link.length > 30 ? '...' : '') : '' }}
                        </a>
                    </template>
                </Column>
                <Column field="data.image" header="Image" style="min-width: 12rem">
                    <template #body="{ data }">
                        {{ formatImageData(data.data.image) }}
                    </template>
                </Column>
                <Column field="data.sort_order" header="Sort Order" style="min-width: 8rem">
                    <template #body="{ data }">
                        {{ data.data.sort_order }}
                    </template>
                </Column>
                <Column field="data.status" header="Status" style="min-width: 8rem">
                    <template #body="{ data }">
                        {{ data.data.status }}
                    </template>
                </Column>
                <Column field="data.way_point" header="Way Point" style="min-width: 10rem">
                    <template #body="{ data }">
                        {{ data.data.way_point }}
                    </template>
                </Column>
                <Column field="errors" header="Errors" style="min-width: 15rem">
                    <template #body="{ data }">
                        <div class="text-red-600 text-sm">
                            {{ formatErrors(data.errors) }}
                        </div>
                    </template>
                </Column>
            </DataTable>
        </div>

        <!-- Updated Records DataTable -->
        <div v-if="productsImagesImportResults?.success?.updated_records > 0 && productsImagesImportResults?.success?.updated_data"
            class="mb-6">
            <h3 class="text-lg font-semibold mb-4 text-orange-700">Updated Records ({{
                productsImagesImportResults.success.updated_records
            }})</h3>
            <DataTable v-model:filters="filters" :value="productsImagesImportResults.success.updated_data" paginator
                :rows="10" dataKey="row" filterDisplay="menu"
                :globalFilterFields="['data.product_code', 'data.image_link', 'data.image', 'data.sort_order', 'data.status', 'data.way_point']"
                class="th-table">
                <template #header>
                    <div class="flex justify-between items-center">
                        <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                        <InputText v-model="filters['global'].value"
                            placeholder="Search updated product images records..." />
                    </div>
                </template>
                <template #empty> No updated product images records found. </template>
                <Column field="data.product_code" header="Product Code" style="min-width: 10rem">
                    <template #body="{ data }">
                        {{ data.data.product_code }}
                    </template>
                </Column>
                <Column field="data.image_link" header="Image Link" style="min-width: 15rem">
                    <template #body="{ data }">
                        <a :href="data.data.image_link" target="_blank" class="text-blue-500 hover:underline">
                            {{ data.data.image_link ? data.data.image_link.substring(0, 30) +
                                (data.data.image_link.length > 30 ? '...' : '') : '' }}
                        </a>
                    </template>
                </Column>
                <Column field="data.image" header="Image" style="min-width: 12rem">
                    <template #body="{ data }">
                        {{ formatImageData(data.data.image) }}
                    </template>
                </Column>
                <Column field="data.sort_order" header="Sort Order" style="min-width: 8rem">
                    <template #body="{ data }">
                        {{ data.data.sort_order }}
                    </template>
                </Column>
                <Column field="data.status" header="Status" style="min-width: 8rem">
                    <template #body="{ data }">
                        {{ data.data.status }}
                    </template>
                </Column>
                <Column field="data.way_point" header="Way Point" style="min-width: 10rem">
                    <template #body="{ data }">
                        {{ data.data.way_point }}
                    </template>
                </Column>
            </DataTable>
        </div>

        <!-- Valid Records DataTable -->
        <div
            v-if="productsImagesImportResults?.success?.valid_records > 0 && productsImagesImportResults?.success?.valid_data">
            <h3 class="text-lg font-semibold mb-4 text-green-700">Valid Records ({{
                productsImagesImportResults.success.valid_records
            }})</h3>
            <DataTable v-model:filters="filters" :value="productsImagesImportResults.success.valid_data" paginator
                :rows="10" dataKey="product_code" filterDisplay="menu"
                :globalFilterFields="['product_code', 'image_link', 'image', 'sort_order', 'status', 'way_point']"
                class="th-table">
                <template #header>
                    <div class="flex justify-between items-center">
                        <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                        <InputText v-model="filters['global'].value"
                            placeholder="Search valid product images records..." />
                    </div>
                </template>
                <template #empty> No valid product images records found. </template>
                <Column field="product_code" header="Product Code" style="min-width: 10rem" />
                <Column field="image_link" header="Image Link" style="min-width: 15rem">
                    <template #body="{ data }">
                        <a :href="data.image_link" target="_blank" class="text-blue-500 hover:underline">
                            {{ data.image_link ? data.image_link.substring(0, 30) +
                                (data.image_link.length
                                    > 30
                                    ?
                                    '...' : '') : '' }}
                        </a>
                    </template>
                </Column>
                <Column field="image" header="Image" style="min-width: 12rem">
                    <template #body="{ data }">
                        {{ formatImageData(data.image) }}
                    </template>
                </Column>
                <Column field="sort_order" header="Sort Order" style="min-width: 8rem" />
                <Column field="status" header="Status" style="min-width: 8rem" />
                <Column field="way_point" header="Way Point" style="min-width: 10rem" />
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
