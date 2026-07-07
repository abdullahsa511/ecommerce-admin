<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useProductStore } from '../stores/product';
import { useToast } from 'primevue/usetoast';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import FileUpload from 'primevue/fileupload';
import ProgressBar from 'primevue/progressbar';
import axios from 'axios';

const toast = useToast();
const productStore = useProductStore();
const selectedFileProducts = ref(null);
const isSavingProducts = ref(false);

// Import results data
const productsImportResults = ref(null);
const showProductsResults = ref(false);

// Filters for datatables
const filters = ref({
    global: { value: null, matchMode: 'contains' }
});

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
        
        // Store the import results
        productsImportResults.value = response;
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

const clearFilter = () => {
    filters.value.global.value = null;
};

const clearProductsResults = () => {
    productsImportResults.value = null;
    showProductsResults.value = false;
};

// Helper function to format image data
const formatImageData = (imageData) => {
    if (!imageData) return 'No image';
    try {
        const parsed = JSON.parse(imageData);
        if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed[0].objectURL || 'Image available';
        }
        return 'Image available';
    } catch (e) {
        return 'Invalid image data';
    }
};

// Helper function to format errors
const formatErrors = (errors) => {
    if (!errors) return '';
    return Object.entries(errors)
        .map(([field, message]) => `${field}: ${message}`)
        .join(', ');
};
</script>

<template>
    <div class="flex flex-col gap-8">
        <!-- Products Import Section -->
        <div class="bg-white rounded-lg p-6 shadow-md">
            <h2 class="text-xl font-semibold mb-2">Import Products CSV data</h2>
            <p class="text-gray-600 mb-4">Upload a CSV file to start importing products data</p>
            
            <div class="flex flex-col gap-4">
                <FileUpload 
                    mode="basic" 
                    name="importProductsFile" 
                    accept=".csv" 
                    :maxFileSize="1000000" 
                    @select="handleFileSelectProducts" 
                    :auto="false" 
                    chooseLabel="Select CSV File"
                />

                <!-- Selected file info and Save button -->
                <div v-if="selectedFileProducts" class="flex flex-col gap-4">
                    <div class="flex items-center gap-2 p-3 bg-gray-50 rounded">
                        <i class="pi pi-file text-gray-500"></i>
                        <span class="text-gray-700">{{ selectedFileProducts.name }}</span>
                    </div>

                    <!-- Progress Bar -->
                    <div v-if="isSavingProducts" class="w-full">
                        <ProgressBar 
                            mode="indeterminate" 
                            style="height: 8px" 
                            class="w-full"
                        />
                        <p class="text-sm text-gray-600 mt-2 text-center">Importing products data...</p>
                    </div>

                    <Button 
                        icon="pi pi-save"
                        :label="isSavingProducts ? 'Saving...' : 'Import Products'"
                        severity="success"
                        @click="handleSaveProducts"
                        :loading="isSavingProducts"
                        :disabled="isSavingProducts"
                        class="p-button-md"
                    />
                </div>
            </div>
        </div>

        <!-- Products Import Results Section -->
        <div v-if="showProductsResults && productsImportResults" class="bg-white rounded-lg p-6 shadow-md">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-semibold">Products Import Results</h2>
                <Button 
                    icon="pi pi-times" 
                    label="Clear Results" 
                    severity="secondary" 
                    outlined 
                    @click="clearProductsResults"
                />
            </div>

            <!-- Summary Statistics -->
            <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div class="text-2xl font-bold text-blue-600">{{ productsImportResults?.success?.total_records || 0 }}</div>
                    <div class="text-sm text-blue-800">Total Records</div>
                </div>
                <div class="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div class="text-2xl font-bold text-green-600">{{ productsImportResults?.success?.valid_records || 0 }}</div>
                    <div class="text-sm text-green-800">Valid Records</div>
                </div>
                <div class="bg-red-50 p-4 rounded-lg border border-red-200">
                    <div class="text-2xl font-bold text-red-600">{{ productsImportResults?.success?.invalid_records || 0 }}</div>
                    <div class="text-sm text-red-800">Invalid Records</div>
                </div>
                <div class="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <div class="text-2xl font-bold text-orange-600">{{ productsImportResults?.success?.updated_records || 0 }}</div>
                    <div class="text-sm text-orange-800">Updated Records</div>
                </div>
                <div class="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <div class="text-2xl font-bold text-purple-600">{{ productsImportResults?.success?.inserted_count || 0 }}</div>
                    <div class="text-sm text-purple-800">Inserted Records</div>
                </div>
            </div>

            <!-- Invalid Records DataTable -->
            <div v-if="productsImportResults?.success?.invalid_records > 0 && productsImportResults?.success?.invalid_data" class="mb-6">
                <h3 class="text-lg font-semibold mb-4 text-red-700">Invalid Records ({{ productsImportResults.success.invalid_records }})</h3>
                <DataTable
                    v-model:filters="filters"
                    :value="productsImportResults.success.invalid_data"
                    paginator
                    :rows="10"
                    dataKey="row"
                    filterDisplay="menu"
                    :globalFilterFields="['data.product_id', 'data.product_code', 'data.product_title', 'data.specifications']"
                    class="th-table"
                >
                    <template #header>
                        <div class="flex justify-between items-center">
                            <Button
                                type="button"
                                icon="pi pi-filter-slash"
                                label="Clear"
                                outlined
                                @click="clearFilter()"
                            />
                            <InputText v-model="filters['global'].value" placeholder="Search invalid products records..." />
                        </div>
                    </template>
                    <template #empty> No invalid products records found. </template>

                    <Column field="row" header="Row" style="min-width: 6rem">
                        <template #body="{ data }">
                            {{ data.row }}
                        </template>
                    </Column>

                    <Column field="data.product_id" header="Product ID" style="min-width: 8rem">
                        <template #body="{ data }">
                            {{ data.data.product_id }}
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

                    <Column field="data.specifications_image" header="Specifications Image" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ formatImageData(data.data.specifications_image) }}
                        </template>
                    </Column>

                    <Column field="data.banner_image" header="Banner Image" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ formatImageData(data.data.banner_image) }}
                        </template>
                    </Column>

                    <Column field="data.video_link" header="Video Link" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ data.data.video_link }}
                        </template>
                    </Column>

                    <Column field="data.image" header="Image" style="min-width: 10rem">
                        <template #body="{ data }">
                            {{ formatImageData(data.data.image) }}
                        </template>
                    </Column>

                    <Column field="data.image_thumb" header="Image Thumb" style="min-width: 10rem">
                        <template #body="{ data }">
                            {{ formatImageData(data.data.image_thumb) }}
                        </template>
                    </Column>

                    <Column field="data.main_image_one" header="Main Image One" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ formatImageData(data.data.main_image_one) }}
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
                            {{ formatImageData(data.data.main_image_two) }}
                        </template>
                    </Column>

                    <Column field="data.main_image_two_title" header="Main Image Two Title" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ data.data.main_image_two_title }}
                        </template>
                    </Column>

                    <Column field="data.main_image_two_description" header="Main Image Two Description" style="min-width: 15rem">
                        <template #body="{ data }">
                            {{ data.data.main_image_two_description }}
                        </template>
                    </Column>

                    <Column field="data.feature_description" header="Feature Description" style="min-width: 15rem">
                        <template #body="{ data }">
                            {{ data.data.feature_description }}
                        </template>
                    </Column>

                    <Column field="data.feature_image_one" header="Feature Image One" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ formatImageData(data.data.feature_image_one) }}
                        </template>
                    </Column>

                    <Column field="data.feature_image_one_title" header="Feature Image One Title" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ data.data.feature_image_one_title }}
                        </template>
                    </Column>

                    <Column field="data.feature_image_one_description" header="Feature Image One Description" style="min-width: 15rem">
                        <template #body="{ data }">
                            {{ data.data.feature_image_one_description }}
                        </template>
                    </Column>

                    <Column field="data.feature_image_two" header="Feature Image Two" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ formatImageData(data.data.feature_image_two) }}
                        </template>
                    </Column>

                    <Column field="data.feature_image_two_title" header="Feature Image Two Title" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ data.data.feature_image_two_title }}
                        </template>
                    </Column>

                    <Column field="data.feature_image_two_description" header="Feature Image Two Description" style="min-width: 15rem">
                        <template #body="{ data }">
                            {{ data.data.feature_image_two_description }}
                        </template>
                    </Column>

                    <Column field="data.feature_image_three" header="Feature Image Three" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ formatImageData(data.data.feature_image_three) }}
                        </template>
                    </Column>

                    <Column field="data.feature_image_three_title" header="Feature Image Three Title" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ data.data.feature_image_three_title }}
                        </template>
                    </Column>

                    <Column field="data.feature_image_three_description" header="Feature Image Three Description" style="min-width: 15rem">
                        <template #body="{ data }">
                            {{ data.data.feature_image_three_description }}
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
            <div v-if="productsImportResults?.success?.updated_records > 0 && productsImportResults?.success?.updated_data" class="mb-6">
                <h3 class="text-lg font-semibold mb-4 text-orange-700">Updated Records ({{ productsImportResults.success.updated_records }})</h3>
                <DataTable
                    v-model:filters="filters"
                    :value="productsImportResults.success.updated_data"
                    paginator
                    :rows="10"
                    dataKey="product_id"
                    filterDisplay="menu"
                    :globalFilterFields="['product_id', 'product_code', 'product_title', 'specifications']"
                    class="th-table"
                >
                    <template #header>
                        <div class="flex justify-between items-center">
                            <Button
                                type="button"
                                icon="pi pi-filter-slash"
                                label="Clear"
                                outlined
                                @click="clearFilter()"
                            />
                            <InputText v-model="filters['global'].value" placeholder="Search updated products records..." />
                        </div>
                    </template>
                    <template #empty> No updated products records found. </template>

                    <Column field="product_id" header="Product ID" style="min-width: 8rem" />
                    <Column field="product_code" header="Product Code" style="min-width: 10rem" />
                    <Column field="product_title" header="Product Title" style="min-width: 15rem" />
                    <Column field="specifications" header="Specifications" style="min-width: 15rem" />
                    <Column field="specifications_image" header="Specifications Image" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ formatImageData(data.specifications_image) }}
                        </template>
                    </Column>
                    <Column field="banner_image" header="Banner Image" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ formatImageData(data.banner_image) }}
                        </template>
                    </Column>
                    <Column field="video_link" header="Video Link" style="min-width: 12rem" />
                    <Column field="image" header="Image" style="min-width: 10rem">
                        <template #body="{ data }">
                            {{ formatImageData(data.image) }}
                        </template>
                    </Column>
                    <Column field="image_thumb" header="Image Thumb" style="min-width: 10rem">
                        <template #body="{ data }">
                            {{ formatImageData(data.image_thumb) }}
                        </template>
                    </Column>
                    <Column field="main_image_one" header="Main Image One" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ formatImageData(data.main_image_one) }}
                        </template>
                    </Column>
                    <Column field="main_image_one_title" header="Main Image One Title" style="min-width: 12rem" />
                    <Column field="main_image_one_description" header="Main Image One Description" style="min-width: 15rem" />
                    <Column field="main_image_two" header="Main Image Two" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ formatImageData(data.main_image_two) }}
                        </template>
                    </Column>
                    <Column field="main_image_two_title" header="Main Image Two Title" style="min-width: 12rem" />
                    <Column field="main_image_two_description" header="Main Image Two Description" style="min-width: 15rem" />
                    <Column field="feature_description" header="Feature Description" style="min-width: 15rem" />
                    <Column field="feature_image_one" header="Feature Image One" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ formatImageData(data.feature_image_one) }}
                        </template>
                    </Column>
                    <Column field="feature_image_one_title" header="Feature Image One Title" style="min-width: 12rem" />
                    <Column field="feature_image_one_description" header="Feature Image One Description" style="min-width: 15rem" />
                    <Column field="feature_image_two" header="Feature Image Two" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ formatImageData(data.feature_image_two) }}
                        </template>
                    </Column>
                    <Column field="feature_image_two_title" header="Feature Image Two Title" style="min-width: 12rem" />
                    <Column field="feature_image_two_description" header="Feature Image Two Description" style="min-width: 15rem" />
                    <Column field="feature_image_three" header="Feature Image Three" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ formatImageData(data.feature_image_three) }}
                        </template>
                    </Column>
                    <Column field="feature_image_three_title" header="Feature Image Three Title" style="min-width: 12rem" />
                    <Column field="feature_image_three_description" header="Feature Image Three Description" style="min-width: 15rem" />
                </DataTable>
            </div>

            <!-- Valid Records DataTable -->
            <div v-if="productsImportResults?.success?.valid_records > 0 && productsImportResults?.success?.valid_data">
                <h3 class="text-lg font-semibold mb-4 text-green-700">Valid Records ({{ productsImportResults.success.valid_records }})</h3>
                <DataTable
                    v-model:filters="filters"
                    :value="productsImportResults.success.valid_data"
                    paginator
                    :rows="10"
                    dataKey="product_id"
                    filterDisplay="menu"
                    :globalFilterFields="['product_id', 'product_code', 'product_title', 'specifications']"
                    class="th-table"
                >
                    <template #header>
                        <div class="flex justify-between items-center">
                            <Button
                                type="button"
                                icon="pi pi-filter-slash"
                                label="Clear"
                                outlined
                                @click="clearFilter()"
                            />
                            <InputText v-model="filters['global'].value" placeholder="Search valid products records..." />
                        </div>
                    </template>
                    <template #empty> No valid products records found. </template>

                    <Column field="product_id" header="Product ID" style="min-width: 8rem" />
                    <Column field="product_code" header="Product Code" style="min-width: 10rem" />
                    <Column field="product_title" header="Product Title" style="min-width: 15rem" />
                    <Column field="specifications" header="Specifications" style="min-width: 15rem" />
                    <Column field="specifications_image" header="Specifications Image" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ formatImageData(data.specifications_image) }}
                        </template>
                    </Column>
                    <Column field="banner_image" header="Banner Image" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ formatImageData(data.banner_image) }}
                        </template>
                    </Column>
                    <Column field="video_link" header="Video Link" style="min-width: 12rem" />
                    <Column field="image" header="Image" style="min-width: 10rem">
                        <template #body="{ data }">
                            {{ formatImageData(data.image) }}
                        </template>
                    </Column>
                    <Column field="image_thumb" header="Image Thumb" style="min-width: 10rem">
                        <template #body="{ data }">
                            {{ formatImageData(data.image_thumb) }}
                        </template>
                    </Column>
                    <Column field="main_image_one" header="Main Image One" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ formatImageData(data.main_image_one) }}
                        </template>
                    </Column>
                    <Column field="main_image_one_title" header="Main Image One Title" style="min-width: 12rem" />
                    <Column field="main_image_one_description" header="Main Image One Description" style="min-width: 15rem" />
                    <Column field="main_image_two" header="Main Image Two" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ formatImageData(data.main_image_two) }}
                        </template>
                    </Column>
                    <Column field="main_image_two_title" header="Main Image Two Title" style="min-width: 12rem" />
                    <Column field="main_image_two_description" header="Main Image Two Description" style="min-width: 15rem" />
                    <Column field="feature_description" header="Feature Description" style="min-width: 15rem" />
                    <Column field="feature_image_one" header="Feature Image One" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ formatImageData(data.feature_image_one) }}
                        </template>
                    </Column>
                    <Column field="feature_image_one_title" header="Feature Image One Title" style="min-width: 12rem" />
                    <Column field="feature_image_one_description" header="Feature Image One Description" style="min-width: 15rem" />
                    <Column field="feature_image_two" header="Feature Image Two" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ formatImageData(data.feature_image_two) }}
                        </template>
                    </Column>
                    <Column field="feature_image_two_title" header="Feature Image Two Title" style="min-width: 12rem" />
                    <Column field="feature_image_two_description" header="Feature Image Two Description" style="min-width: 15rem" />
                    <Column field="feature_image_three" header="Feature Image Three" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ formatImageData(data.feature_image_three) }}
                        </template>
                    </Column>
                    <Column field="feature_image_three_title" header="Feature Image Three Title" style="min-width: 12rem" />
                    <Column field="feature_image_three_description" header="Feature Image Three Description" style="min-width: 15rem" />
                </DataTable>
            </div>
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
</style>
