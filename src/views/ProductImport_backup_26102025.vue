<script setup>
import { ref } from 'vue';
import { useProductStore } from '../stores/product';
import { useToast } from 'primevue/usetoast';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import FileUpload from 'primevue/fileupload';
import ProgressBar from 'primevue/progressbar';

const toast = useToast();
const productStore = useProductStore();

// Products Import
const selectedFileProducts = ref(null);
const isSavingProducts = ref(false);
const productsImportResults = ref(null);
const showProductsResults = ref(false);

// Related Products Import
const selectedFileRelatedProducts = ref(null);
const isSavingRelatedProducts = ref(false);
const relatedProductsImportResults = ref(null);
const showRelatedProductsResults = ref(false);

// Products Attributes Import
const selectedFileProductsAttributes = ref(null);
const isSavingProductsAttributes = ref(false);
const productsAttributesImportResults = ref(null);
const showProductsAttributesResults = ref(false);

// Products Variants Import
const selectedFileProductsVariants = ref(null);
const isSavingProductsVariants = ref(false);
const productsVariantsImportResults = ref(null);
const showProductsVariantsResults = ref(false);

// Products Options Import
const selectedFileProductsOptions = ref(null);
const isSavingProductsOptions = ref(false);
const productsOptionsImportResults = ref(null);
const showProductsOptionsResults = ref(false);

// Products Images Import
const selectedFileProductsImages = ref(null);
const isSavingProductsImages = ref(false);
const productsImagesImportResults = ref(null);
const showProductsImagesResults = ref(false);

// Products Digital Assets Import
const selectedFileProductsDigitalAssets = ref(null);
const isSavingProductsDigitalAssets = ref(false);
const productsDigitalAssetsImportResults = ref(null);
const showProductsDigitalAssetsResults = ref(false);

// Products Tags Import
const selectedFileProductsTags = ref(null);
const isSavingProductsTags = ref(false);
const productsTagsImportResults = ref(null);
const showProductsTagsResults = ref(false);

// Filters for datatables
const filters = ref({
    global: { value: null, matchMode: 'contains' }
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

// Handlers for Related Products Import
const handleFileSelectRelatedProducts = (event) => {
    const file = event.files[0];
    if (!file) return;
    if (!file.name.endsWith('.csv')) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Please select a CSV file', life: 3000 });
        return;
    }
    selectedFileRelatedProducts.value = file;
};

const handleSaveRelatedProducts = async () => {
    if (!selectedFileRelatedProducts.value) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Please select a file first', life: 3000 });
        return;
    }
    isSavingRelatedProducts.value = true;
    try {
        const formData = new FormData();
        formData.append('csv_file', selectedFileRelatedProducts.value);
        const response = await productStore.createProductRelationalTableDataImport(formData, 'product_related');
        // relatedProductsImportResults.value = response;
        relatedProductsImportResults.value = {
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
        showRelatedProductsResults.value = true;
        toast.add({ severity: 'success', summary: 'Success', detail: 'Related products imported successfully', life: 3000 });
        selectedFileRelatedProducts.value = null;
    } catch (error) {
        console.error('Save error:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: error.message || 'Failed to save file', life: 3000 });
    } finally {
        isSavingRelatedProducts.value = false;
    }
};

// Handlers for Products Attributes Import
const handleFileSelectProductsAttributes = (event) => {
    const file = event.files[0];
    if (!file) return;
    if (!file.name.endsWith('.csv')) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Please select a CSV file', life: 3000 });
        return;
    }
    selectedFileProductsAttributes.value = file;
};

const handleSaveProductsAttributes = async () => {
    if (!selectedFileProductsAttributes.value) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Please select a file first', life: 3000 });
        return;
    }
    isSavingProductsAttributes.value = true;
    try {
        const formData = new FormData();
        formData.append('csv_file', selectedFileProductsAttributes.value);
        const response = await productStore.createProductRelationalTableDataImport(formData, 'product_attribute');
        // productsAttributesImportResults.value = response;
        productsAttributesImportResults.value = {
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
        showProductsAttributesResults.value = true;
        toast.add({ severity: 'success', summary: 'Success', detail: 'Product attributes imported successfully', life: 3000 });
        selectedFileProductsAttributes.value = null;
    } catch (error) {
        console.error('Save error:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: error.message || 'Failed to save file', life: 3000 });
    } finally {
        isSavingProductsAttributes.value = false;
    }
};

// Handlers for Products Variants Import
const handleFileSelectProductsVariants = (event) => {
    const file = event.files[0];
    if (!file) return;
    if (!file.name.endsWith('.csv')) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Please select a CSV file', life: 3000 });
        return;
    }
    selectedFileProductsVariants.value = file;
};

const handleSaveProductsVariants = async () => {
    if (!selectedFileProductsVariants.value) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Please select a file first', life: 3000 });
        return;
    }
    isSavingProductsVariants.value = true;
    try {
        const formData = new FormData();
        formData.append('csv_file', selectedFileProductsVariants.value);
        const response = await productStore.createProductRelationalTableDataImport(formData, 'product_variant');
        // productsVariantsImportResults.value = response;
        productsVariantsImportResults.value = {
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
        showProductsVariantsResults.value = true;
        toast.add({ severity: 'success', summary: 'Success', detail: 'Product variants imported successfully', life: 3000 });
        selectedFileProductsVariants.value = null;
    } catch (error) {
        console.error('Save error:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: error.message || 'Failed to save file', life: 3000 });
    } finally {
        isSavingProductsVariants.value = false;
    }
};

// Handlers for Products Options Import
const handleFileSelectProductsOptions = (event) => {
    const file = event.files[0];
    if (!file) return;
    if (!file.name.endsWith('.csv')) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Please select a CSV file', life: 3000 });
        return;
    }
    selectedFileProductsOptions.value = file;
};

const handleSaveProductsOptions = async () => {
    if (!selectedFileProductsOptions.value) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Please select a file first', life: 3000 });
        return;
    }
    isSavingProductsOptions.value = true;
    try {
        const formData = new FormData();
        formData.append('csv_file', selectedFileProductsOptions.value);
        const response = await productStore.createProductRelationalTableDataImport(formData, 'product_option');
        // productsOptionsImportResults.value = response;
        productsOptionsImportResults.value = {
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
        showProductsOptionsResults.value = true;
        toast.add({ severity: 'success', summary: 'Success', detail: 'Product options imported successfully', life: 3000 });
        selectedFileProductsOptions.value = null;
    } catch (error) {
        console.error('Save error:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: error.message || 'Failed to save file', life: 3000 });
    } finally {
        isSavingProductsOptions.value = false;
    }
};

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

// Handlers for Products Digital Assets Import
const handleFileSelectProductsDigitalAssets = (event) => {
    const file = event.files[0];
    if (!file) return;
    if (!file.name.endsWith('.csv')) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Please select a CSV file', life: 3000 });
        return;
    }
    selectedFileProductsDigitalAssets.value = file;
};

const handleSaveProductsDigitalAssets = async () => {
    if (!selectedFileProductsDigitalAssets.value) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Please select a file first', life: 3000 });
        return;
    }
    isSavingProductsDigitalAssets.value = true;
    try {
        const formData = new FormData();
        formData.append('csv_file', selectedFileProductsDigitalAssets.value);
        const response = await productStore.createProductRelationalTableDataImport(formData, 'product_to_digital_asset');
        // productsDigitalAssetsImportResults.value = response;
        productsDigitalAssetsImportResults.value = {
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
        showProductsDigitalAssetsResults.value = true;
        toast.add({ severity: 'success', summary: 'Success', detail: 'Product digital assets imported successfully', life: 3000 });
        selectedFileProductsDigitalAssets.value = null;
    } catch (error) {
        console.error('Save error:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: error.message || 'Failed to save file', life: 3000 });
    } finally {
        isSavingProductsDigitalAssets.value = false;
    }
};

// Handlers for Products Tags Import
const handleFileSelectProductsTags = (event) => {
    const file = event.files[0];
    if (!file) return;
    if (!file.name.endsWith('.csv')) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Please select a CSV file', life: 3000 });
        return;
    }
    selectedFileProductsTags.value = file;
};

const handleSaveProductsTags = async () => {
    if (!selectedFileProductsTags.value) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Please select a file first', life: 3000 });
        return;
    }
    isSavingProductsTags.value = true;
    try {
        const formData = new FormData();
        formData.append('csv_file', selectedFileProductsTags.value);
        const response = await productStore.createProductRelationalTableDataImport(formData, 'product_to_taxonomy_item');
        productsTagsImportResults.value = {
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
        showProductsTagsResults.value = true;
        toast.add({ severity: 'success', summary: 'Success', detail: 'Product tags imported successfully', life: 3000 });
        selectedFileProductsTags.value = null;
    } catch (error) {
        console.error('Save error:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: error.message || 'Failed to save file', life: 3000 });
    } finally {
        isSavingProductsTags.value = false;
    }
};

// Clear filters and results
const clearFilter = () => {
    filters.value.global.value = null;
};

const clearProductsResults = () => {
    productsImportResults.value = null;
    showProductsResults.value = false;
};

const clearRelatedProductsResults = () => {
    relatedProductsImportResults.value = null;
    showRelatedProductsResults.value = false;
};

const clearProductsAttributesResults = () => {
    productsAttributesImportResults.value = null;
    showProductsAttributesResults.value = false;
};

const clearProductsVariantsResults = () => {
    productsVariantsImportResults.value = null;
    showProductsVariantsResults.value = false;
};

const clearProductsOptionsResults = () => {
    productsOptionsImportResults.value = null;
    showProductsOptionsResults.value = false;
};

const clearProductsImagesResults = () => {
    productsImagesImportResults.value = null;
    showProductsImagesResults.value = false;
};

const clearProductsDigitalAssetsResults = () => {
    productsDigitalAssetsImportResults.value = null;
    showProductsDigitalAssetsResults.value = false;
};

const clearProductsTagsResults = () => {
    productsTagsImportResults.value = null;
    showProductsTagsResults.value = false;
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

        <!-- Related Products Import Section -->
        <div class="bg-white rounded-lg p-6 shadow-md">
            <h2 class="text-xl font-semibold mb-2">Import Related Products CSV data</h2>
            <p class="text-gray-600 mb-4">Upload a CSV file to start importing related products data</p>
            <div class="flex flex-col gap-4">
                <FileUpload mode="basic" name="importRelatedProductsFile" accept=".csv" :maxFileSize="1000000"
                    @select="handleFileSelectRelatedProducts" :auto="false" chooseLabel="Select CSV File" />
                <div v-if="selectedFileRelatedProducts" class="flex flex-col gap-4">
                    <div class="flex items-center gap-2 p-3 bg-gray-50 rounded">
                        <i class="pi pi-file text-gray-500"></i>
                        <span class="text-gray-700">{{ selectedFileRelatedProducts.name }}</span>
                    </div>
                    <div v-if="isSavingRelatedProducts" class="w-full">
                        <ProgressBar mode="indeterminate" style="height: 8px" class="w-full" />
                        <p class="text-sm text-gray-600 mt-2 text-center">Importing related products data...</p>
                    </div>
                    <Button icon="pi pi-save" :label="isSavingRelatedProducts ? 'Saving...' : 'Import Related Products'"
                        severity="success" @click="handleSaveRelatedProducts" :loading="isSavingRelatedProducts"
                        :disabled="isSavingRelatedProducts" class="p-button-md" />
                </div>
            </div>
        </div>

        <!-- Products Attributes Import Section -->
        <div class="bg-white rounded-lg p-6 shadow-md">
            <h2 class="text-xl font-semibold mb-2">Import Products Attributes CSV data</h2>
            <p class="text-gray-600 mb-4">Upload a CSV file to start importing product attributes data</p>
            <div class="flex flex-col gap-4">
                <FileUpload mode="basic" name="importProductsAttributesFile" accept=".csv" :maxFileSize="1000000"
                    @select="handleFileSelectProductsAttributes" :auto="false" chooseLabel="Select CSV File" />
                <div v-if="selectedFileProductsAttributes" class="flex flex-col gap-4">
                    <div class="flex items-center gap-2 p-3 bg-gray-50 rounded">
                        <i class="pi pi-file text-gray-500"></i>
                        <span class="text-gray-700">{{ selectedFileProductsAttributes.name }}</span>
                    </div>
                    <div v-if="isSavingProductsAttributes" class="w-full">
                        <ProgressBar mode="indeterminate" style="height: 8px" class="w-full" />
                        <p class="text-sm text-gray-600 mt-2 text-center">Importing product attributes data...</p>
                    </div>
                    <Button icon="pi pi-save" :label="isSavingProductsAttributes ? 'Saving...' : 'Import Attributes'"
                        severity="success" @click="handleSaveProductsAttributes" :loading="isSavingProductsAttributes"
                        :disabled="isSavingProductsAttributes" class="p-button-md" />
                </div>
            </div>
        </div>

        <!-- Products Variants Import Section -->
        <div class="bg-white rounded-lg p-6 shadow-md">
            <h2 class="text-xl font-semibold mb-2">Import Products Variants CSV data</h2>
            <p class="text-gray-600 mb-4">Upload a CSV file to start importing product variants data</p>
            <div class="flex flex-col gap-4">
                <FileUpload mode="basic" name="importProductsVariantsFile" accept=".csv" :maxFileSize="1000000"
                    @select="handleFileSelectProductsVariants" :auto="false" chooseLabel="Select CSV File" />
                <div v-if="selectedFileProductsVariants" class="flex flex-col gap-4">
                    <div class="flex items-center gap-2 p-3 bg-gray-50 rounded">
                        <i class="pi pi-file text-gray-500"></i>
                        <span class="text-gray-700">{{ selectedFileProductsVariants.name }}</span>
                    </div>
                    <div v-if="isSavingProductsVariants" class="w-full">
                        <ProgressBar mode="indeterminate" style="height: 8px" class="w-full" />
                        <p class="text-sm text-gray-600 mt-2 text-center">Importing product variants data...</p>
                    </div>
                    <Button icon="pi pi-save" :label="isSavingProductsVariants ? 'Saving...' : 'Import Variants'"
                        severity="success" @click="handleSaveProductsVariants" :loading="isSavingProductsVariants"
                        :disabled="isSavingProductsVariants" class="p-button-md" />
                </div>
            </div>
        </div>

        <!-- Products Options Import Section -->
        <div class="bg-white rounded-lg p-6 shadow-md">
            <h2 class="text-xl font-semibold mb-2">Import Products Options CSV data</h2>
            <p class="text-gray-600 mb-4">Upload a CSV file to start importing product options data</p>
            <div class="flex flex-col gap-4">
                <FileUpload mode="basic" name="importProductsOptionsFile" accept=".csv" :maxFileSize="1000000"
                    @select="handleFileSelectProductsOptions" :auto="false" chooseLabel="Select CSV File" />
                <div v-if="selectedFileProductsOptions" class="flex flex-col gap-4">
                    <div class="flex items-center gap-2 p-3 bg-gray-50 rounded">
                        <i class="pi pi-file text-gray-500"></i>
                        <span class="text-gray-700">{{ selectedFileProductsOptions.name }}</span>
                    </div>
                    <div v-if="isSavingProductsOptions" class="w-full">
                        <ProgressBar mode="indeterminate" style="height: 8px" class="w-full" />
                        <p class="text-sm text-gray-600 mt-2 text-center">Importing product options data...</p>
                    </div>
                    <Button icon="pi pi-save" :label="isSavingProductsOptions ? 'Saving...' : 'Import Options'"
                        severity="success" @click="handleSaveProductsOptions" :loading="isSavingProductsOptions"
                        :disabled="isSavingProductsOptions" class="p-button-md" />
                </div>
            </div>
        </div>

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
                        <p class="text-sm text-gray-600 mt-2 text-center">Importing product images data...</p>
                    </div>
                    <Button icon="pi pi-save" :label="isSavingProductsImages ? 'Saving...' : 'Import Images'"
                        severity="success" @click="handleSaveProductsImages" :loading="isSavingProductsImages"
                        :disabled="isSavingProductsImages" class="p-button-md" />
                </div>
            </div>
        </div>

        <!-- Products Digital Assets Import Section -->
        <div class="bg-white rounded-lg p-6 shadow-md">
            <h2 class="text-xl font-semibold mb-2">Import Products Digital Assets CSV data</h2>
            <p class="text-gray-600 mb-4">Upload a CSV file to start importing product digital assets data</p>
            <div class="flex flex-col gap-4">
                <FileUpload mode="basic" name="importProductsDigitalAssetsFile" accept=".csv" :maxFileSize="1000000"
                    @select="handleFileSelectProductsDigitalAssets" :auto="false" chooseLabel="Select CSV File" />
                <div v-if="selectedFileProductsDigitalAssets" class="flex flex-col gap-4">
                    <div class="flex items-center gap-2 p-3 bg-gray-50 rounded">
                        <i class="pi pi-file text-gray-500"></i>
                        <span class="text-gray-700">{{ selectedFileProductsDigitalAssets.name }}</span>
                    </div>
                    <div v-if="isSavingProductsDigitalAssets" class="w-full">
                        <ProgressBar mode="indeterminate" style="height: 8px" class="w-full" />
                        <p class="text-sm text-gray-600 mt-2 text-center">Importing product digital assets data...</p>
                    </div>
                    <Button icon="pi pi-save"
                        :label="isSavingProductsDigitalAssets ? 'Saving...' : 'Import Digital Assets'"
                        severity="success" @click="handleSaveProductsDigitalAssets"
                        :loading="isSavingProductsDigitalAssets" :disabled="isSavingProductsDigitalAssets"
                        class="p-button-md" />
                </div>
            </div>
        </div>

        <!-- Products Tags Import Section -->
        <div class="bg-white rounded-lg p-6 shadow-md">
            <h2 class="text-xl font-semibold mb-2">Import Product Tags CSV data</h2>
            <p class="text-gray-600 mb-4">Upload a CSV file to start importing product tags data</p>
            <div class="flex flex-col gap-4">
                <FileUpload mode="basic" name="importProductsTagsFile" accept=".csv" :maxFileSize="1000000"
                    @select="handleFileSelectProductsTags" :auto="false" chooseLabel="Select CSV File" />
                <div v-if="selectedFileProductsTags" class="flex flex-col gap-4">
                    <div class="flex items-center gap-2 p-3 bg-gray-50 rounded">
                        <i class="pi pi-file text-gray-500"></i>
                        <span class="text-gray-700">{{ selectedFileProductsTags.name }}</span>
                    </div>
                    <div v-if="isSavingProductsTags" class="w-full">
                        <ProgressBar mode="indeterminate" style="height: 8px" class="w-full" />
                        <p class="text-sm text-gray-600 mt-2 text-center">Importing product tags data...</p>
                    </div>
                    <Button icon="pi pi-save" :label="isSavingProductsTags ? 'Saving...' : 'Import Tags'"
                        severity="success" @click="handleSaveProductsTags" :loading="isSavingProductsTags"
                        :disabled="isSavingProductsTags" class="p-button-md" />
                </div>
            </div>
        </div>

        <!-- Products Import Results Section -->
        <div v-if="showProductsResults && productsImportResults" class="bg-white rounded-lg p-6 shadow-md">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-semibold">Products Import Results</h2>
                <Button icon="pi pi-times" label="Clear Results" severity="secondary" outlined
                    @click="clearProductsResults" />
            </div>
            <!-- Summary Statistics -->
            <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div class="text-2xl font-bold text-blue-600">{{ productsImportResults?.success?.total_records || 0
                        }}</div>
                    <div class="text-sm text-blue-800">Total Records</div>
                </div>
                <div class="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div class="text-2xl font-bold text-green-600">{{ productsImportResults?.success?.valid_records || 0
                        }}</div>
                    <div class="text-sm text-green-800">Valid Records</div>
                </div>
                <div class="bg-red-50 p-4 rounded-lg border border-red-200">
                    <div class="text-2xl font-bold text-red-600">{{ productsImportResults?.success?.invalid_records || 0
                        }}</div>
                    <div class="text-sm text-red-800">Invalid Records</div>
                </div>
                <div class="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <div class="text-2xl font-bold text-orange-600">{{ productsImportResults?.success?.updated_records
                        || 0 }}</div>
                    <div class="text-sm text-orange-800">Updated Records</div>
                </div>
                <div class="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <div class="text-2xl font-bold text-purple-600">{{ productsImportResults?.success?.inserted_count ||
                        0 }}</div>
                    <div class="text-sm text-purple-800">Inserted Records</div>
                </div>
            </div>
            <!-- Invalid Records DataTable -->
            <div v-if="productsImportResults?.success?.invalid_records > 0 && productsImportResults?.success?.invalid_data"
                class="mb-6">
                <h3 class="text-lg font-semibold mb-4 text-red-700">Invalid Records ({{
                    productsImportResults.success.invalid_records }})</h3>
                <DataTable v-model:filters="filters" :value="productsImportResults.success.invalid_data" paginator
                    :rows="10" dataKey="row" filterDisplay="menu"
                    :globalFilterFields="['data.product_id', 'data.product_code', 'data.product_title', 'data.specifications']"
                    class="th-table">
                    <template #header>
                        <div class="flex justify-between items-center">
                            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined
                                @click="clearFilter()" />
                            <InputText v-model="filters['global'].value"
                                placeholder="Search invalid products records..." />
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
                    <Column field="data.main_image_one_description" header="Main Image One Description"
                        style="min-width: 15rem">
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
                    <Column field="data.main_image_two_description" header="Main Image Two Description"
                        style="min-width: 15rem">
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
                    <Column field="data.feature_image_one_title" header="Feature Image One Title"
                        style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ data.data.feature_image_one_title }}
                        </template>
                    </Column>
                    <Column field="data.feature_image_one_description" header="Feature Image One Description"
                        style="min-width: 15rem">
                        <template #body="{ data }">
                            {{ data.data.feature_image_one_description }}
                        </template>
                    </Column>
                    <Column field="data.feature_image_two" header="Feature Image Two" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ formatImageData(data.data.feature_image_two) }}
                        </template>
                    </Column>
                    <Column field="data.feature_image_two_title" header="Feature Image Two Title"
                        style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ data.data.feature_image_two_title }}
                        </template>
                    </Column>
                    <Column field="data.feature_image_two_description" header="Feature Image Two Description"
                        style="min-width: 15rem">
                        <template #body="{ data }">
                            {{ data.data.feature_image_two_description }}
                        </template>
                    </Column>
                    <Column field="data.feature_image_three" header="Feature Image Three" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ formatImageData(data.data.feature_image_three) }}
                        </template>
                    </Column>
                    <Column field="data.feature_image_three_title" header="Feature Image Three Title"
                        style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ data.data.feature_image_three_title }}
                        </template>
                    </Column>
                    <Column field="data.feature_image_three_description" header="Feature Image Three Description"
                        style="min-width: 15rem">
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
            <div v-if="productsImportResults?.success?.updated_records > 0 && productsImportResults?.success?.updated_data"
                class="mb-6">
                <h3 class="text-lg font-semibold mb-4 text-orange-700">Updated Records ({{
                    productsImportResults.success.updated_records }})</h3>
                <DataTable v-model:filters="filters" :value="productsImportResults.success.updated_data" paginator
                    :rows="10" dataKey="product_id" filterDisplay="menu"
                    :globalFilterFields="['product_id', 'product_code', 'product_title', 'specifications']"
                    class="th-table">
                    <template #header>
                        <div class="flex justify-between items-center">
                            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined
                                @click="clearFilter()" />
                            <InputText v-model="filters['global'].value"
                                placeholder="Search updated products records..." />
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
                    <Column field="main_image_one_description" header="Main Image One Description"
                        style="min-width: 15rem" />
                    <Column field="main_image_two" header="Main Image Two" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ formatImageData(data.main_image_two) }}
                        </template>
                    </Column>
                    <Column field="main_image_two_title" header="Main Image Two Title" style="min-width: 12rem" />
                    <Column field="main_image_two_description" header="Main Image Two Description"
                        style="min-width: 15rem" />
                    <Column field="feature_description" header="Feature Description" style="min-width: 15rem" />
                    <Column field="feature_image_one" header="Feature Image One" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ formatImageData(data.feature_image_one) }}
                        </template>
                    </Column>
                    <Column field="feature_image_one_title" header="Feature Image One Title" style="min-width: 12rem" />
                    <Column field="feature_image_one_description" header="Feature Image One Description"
                        style="min-width: 15rem" />
                    <Column field="feature_image_two" header="Feature Image Two" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ formatImageData(data.feature_image_two) }}
                        </template>
                    </Column>
                    <Column field="feature_image_two_title" header="Feature Image Two Title" style="min-width: 12rem" />
                    <Column field="feature_image_two_description" header="Feature Image Two Description"
                        style="min-width: 15rem" />
                    <Column field="feature_image_three" header="Feature Image Three" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ formatImageData(data.feature_image_three) }}
                        </template>
                    </Column>
                    <Column field="feature_image_three_title" header="Feature Image Three Title"
                        style="min-width: 12rem" />
                    <Column field="feature_image_three_description" header="Feature Image Three Description"
                        style="min-width: 15rem" />
                </DataTable>
            </div>
            <!-- Valid Records DataTable -->
            <div v-if="productsImportResults?.success?.valid_records > 0 && productsImportResults?.success?.valid_data">
                <h3 class="text-lg font-semibold mb-4 text-green-700">Valid Records ({{
                    productsImportResults.success.valid_records
                    }})</h3>
                <DataTable v-model:filters="filters" :value="productsImportResults.success.valid_data" paginator
                    :rows="10" dataKey="product_id" filterDisplay="menu"
                    :globalFilterFields="['product_id', 'product_code', 'product_title', 'specifications']"
                    class="th-table">
                    <template #header>
                        <div class="flex justify-between items-center">
                            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined
                                @click="clearFilter()" />
                            <InputText v-model="filters['global'].value"
                                placeholder="Search valid products records..." />
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
                    <Column field="main_image_one_description" header="Main Image One Description"
                        style="min-width: 15rem" />
                    <Column field="main_image_two" header="Main Image Two" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ formatImageData(data.main_image_two) }}
                        </template>
                    </Column>
                    <Column field="main_image_two_title" header="Main Image Two Title" style="min-width: 12rem" />
                    <Column field="main_image_two_description" header="Main Image Two Description"
                        style="min-width: 15rem" />
                    <Column field="feature_description" header="Feature Description" style="min-width: 15rem" />
                    <Column field="feature_image_one" header="Feature Image One" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ formatImageData(data.feature_image_one) }}
                        </template>
                    </Column>
                    <Column field="feature_image_one_title" header="Feature Image One Title" style="min-width: 12rem" />
                    <Column field="feature_image_one_description" header="Feature Image One Description"
                        style="min-width: 15rem" />
                    <Column field="feature_image_two" header="Feature Image Two" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ formatImageData(data.feature_image_two) }}
                        </template>
                    </Column>
                    <Column field="feature_image_two_title" header="Feature Image Two Title" style="min-width: 12rem" />
                    <Column field="feature_image_two_description" header="Feature Image Two Description"
                        style="min-width: 15rem" />
                    <Column field="feature_image_three" header="Feature Image Three" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ formatImageData(data.feature_image_three) }}
                        </template>
                    </Column>
                    <Column field="feature_image_three_title" header="Feature Image Three Title"
                        style="min-width: 12rem" />
                    <Column field="feature_image_three_description" header="Feature Image Three Description"
                        style="min-width: 15rem" />
                </DataTable>
            </div>
        </div>

        <!-- Related Products Import Results Section -->
        <div v-if="showRelatedProductsResults && relatedProductsImportResults"
            class="bg-white rounded-lg p-6 shadow-md">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-semibold">Related Products Import Results</h2>
                <Button icon="pi pi-times" label="Clear Results" severity="secondary" outlined
                    @click="clearRelatedProductsResults" />
            </div>
            <!-- Summary Statistics -->
            <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div class="text-2xl font-bold text-blue-600">{{
                        relatedProductsImportResults?.success?.total_records || 0
                        }}</div>
                    <div class="text-sm text-blue-800">Total Records</div>
                </div>
                <div class="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div class="text-2xl font-bold text-green-600">{{
                        relatedProductsImportResults?.success?.valid_records || 0
                        }}</div>
                    <div class="text-sm text-green-800">Valid Records</div>
                </div>
                <div class="bg-red-50 p-4 rounded-lg border border-red-200">
                    <div class="text-2xl font-bold text-red-600">{{
                        relatedProductsImportResults?.success?.invalid_records || 0
                        }}</div>
                    <div class="text-sm text-red-800">Invalid Records</div>
                </div>
                <div class="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <div class="text-2xl font-bold text-orange-600">{{
                        relatedProductsImportResults?.success?.updated_records ||
                        0 }}</div>
                    <div class="text-sm text-orange-800">Updated Records</div>
                </div>
                <div class="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <div class="text-2xl font-bold text-purple-600">{{
                        relatedProductsImportResults?.success?.inserted_count ||
                        0 }}</div>
                    <div class="text-sm text-purple-800">Inserted Records</div>
                </div>
            </div>

            <!-- Invalid Records DataTable -->
            <div v-if="relatedProductsImportResults?.success?.invalid_records > 0 && relatedProductsImportResults?.success?.invalid_data"
                class="mb-6">
                <h3 class="text-lg font-semibold mb-4 text-red-700">Invalid Records ({{
                    relatedProductsImportResults.success.invalid_records }})</h3>
                <DataTable v-model:filters="filters" :value="relatedProductsImportResults.success.invalid_data"
                    paginator :rows="10" dataKey="row" filterDisplay="menu"
                    :globalFilterFields="['data.product_code', 'data.related_product_code']" class="th-table">
                    <template #header>
                        <div class="flex justify-between items-center">
                            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined
                                @click="clearFilter()" />
                            <InputText v-model="filters['global'].value"
                                placeholder="Search invalid related products records..." />
                        </div>
                    </template>
                    <template #empty> No invalid related products records found. </template>
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
                    <Column field="data.related_product_code" header="Related Product Code" style="min-width: 10rem">
                        <template #body="{ data }">
                            {{ data.data.related_product_code }}
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
            <div v-if="relatedProductsImportResults?.success?.updated_records > 0 && relatedProductsImportResults?.success?.updated_data"
                class="mb-6">
                <h3 class="text-lg font-semibold mb-4 text-orange-700">Updated Records ({{
                    relatedProductsImportResults.success.updated_records }})</h3>
                <DataTable v-model:filters="filters" :value="relatedProductsImportResults.success.updated_data"
                    paginator :rows="10" dataKey="product_code" filterDisplay="menu"
                    :globalFilterFields="['product_code', 'related_product_code']" class="th-table">
                    <template #header>
                        <div class="flex justify-between items-center">
                            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined
                                @click="clearFilter()" />
                            <InputText v-model="filters['global'].value"
                                placeholder="Search updated related products records..." />
                        </div>
                    </template>
                    <template #empty> No updated related products records found. </template>
                    <Column field="data.product_code" header="Product Code" style="min-width: 10rem">
                        <template #body="{ data }">
                            {{ data.data.product_code }}
                        </template>
                    </Column>
                    <Column field="data.related_product_code" header="Related Product Code" style="min-width: 10rem">
                        <template #body="{ data }">
                            {{ data.data.related_product_code }}
                        </template>
                    </Column>
                </DataTable>
            </div>

            <!-- Valid Records DataTable -->
            <div
                v-if="relatedProductsImportResults?.success?.valid_records > 0 && relatedProductsImportResults?.success?.valid_data">
                <h3 class="text-lg font-semibold mb-4 text-green-700">Valid Records ({{
                    relatedProductsImportResults.success.valid_records }})</h3>
                <DataTable v-model:filters="filters" :value="relatedProductsImportResults.success.valid_data" paginator
                    :rows="10" dataKey="product_code" filterDisplay="menu"
                    :globalFilterFields="['product_code', 'related_product_code']" class="th-table">
                    <template #header>
                        <div class="flex justify-between items-center">
                            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined
                                @click="clearFilter()" />
                            <InputText v-model="filters['global'].value"
                                placeholder="Search valid related products records..." />
                        </div>
                    </template>
                    <template #empty> No valid related products records found. </template>
                    <Column field="product_code" header="Product Code" style="min-width: 10rem" />
                    <Column field="related_product_code" header="Related Product Code" style="min-width: 10rem" />
                </DataTable>
            </div>
        </div>

        <!-- Products Attributes Import Results Section -->
        <div v-if="showProductsAttributesResults && productsAttributesImportResults"
            class="bg-white rounded-lg p-6 shadow-md">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-semibold">Products Attributes Import Results</h2>
                <Button icon="pi pi-times" label="Clear Results" severity="secondary" outlined
                    @click="clearProductsAttributesResults" />
            </div>
            <!-- Summary Statistics -->
            <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div class="text-2xl font-bold text-blue-600">{{
                        productsAttributesImportResults?.success?.total_records || 0
                        }}</div>
                    <div class="text-sm text-blue-800">Total Records</div>
                </div>
                <div class="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div class="text-2xl font-bold text-green-600">{{
                        productsAttributesImportResults?.success?.valid_records || 0
                        }}</div>
                    <div class="text-sm text-green-800">Valid Records</div>
                </div>
                <div class="bg-red-50 p-4 rounded-lg border border-red-200">
                    <div class="text-2xl font-bold text-red-600">{{
                        productsAttributesImportResults?.success?.invalid_records || 0
                        }}</div>
                    <div class="text-sm text-red-800">Invalid Records</div>
                </div>
                <div class="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <div class="text-2xl font-bold text-orange-600">{{
                        productsAttributesImportResults?.success?.updated_records || 0
                        }}</div>
                    <div class="text-sm text-orange-800">Updated Records</div>
                </div>
                <div class="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <div class="text-2xl font-bold text-purple-600">{{
                        productsAttributesImportResults?.success?.inserted_count || 0
                        }}</div>
                    <div class="text-sm text-purple-800">Inserted Records</div>
                </div>
            </div>

            <!-- Invalid Records DataTable -->
            <div v-if="productsAttributesImportResults?.success?.invalid_records > 0 && productsAttributesImportResults?.success?.invalid_data"
                class="mb-6">
                <h3 class="text-lg font-semibold mb-4 text-red-700">Invalid Records ({{
                    productsAttributesImportResults.success.invalid_records
                    }})</h3>
                <DataTable v-model:filters="filters" :value="productsAttributesImportResults.success.invalid_data"
                    paginator :rows="10" dataKey="row" filterDisplay="menu"
                    :globalFilterFields="['data.product_code', 'data.attribute_code', 'data.language_code', 'data.value']"
                    class="th-table">
                    <template #header>
                        <div class="flex justify-between items-center">
                            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined
                                @click="clearFilter()" />
                            <InputText v-model="filters['global'].value"
                                placeholder="Search invalid product attributes records..." />
                        </div>
                    </template>
                    <template #empty> No invalid product attributes records found. </template>
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
                                {{ formatErrors(data.errors) }}
                            </div>
                        </template>
                    </Column>
                </DataTable>
            </div>

            <!-- Updated Records DataTable -->
            <div v-if="productsAttributesImportResults?.success?.updated_records > 0 && productsAttributesImportResults?.success?.updated_data"
                class="mb-6">
                <h3 class="text-lg font-semibold mb-4 text-orange-700">Updated Records ({{
                    productsAttributesImportResults.success.updated_records
                    }})</h3>
                <DataTable v-model:filters="filters" :value="productsAttributesImportResults.success.updated_data"
                    paginator :rows="10" dataKey="row" filterDisplay="menu"
                    :globalFilterFields="['data.product_code', 'data.attribute_code', 'data.language_code', 'data.value']"
                    class="th-table">
                    <template #header>
                        <div class="flex justify-between items-center">
                            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined
                                @click="clearFilter()" />
                            <InputText v-model="filters['global'].value"
                                placeholder="Search updated product attributes records..." />
                        </div>
                    </template>
                    <template #empty> No updated product attributes records found. </template>
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
            <div
                v-if="productsAttributesImportResults?.success?.valid_records > 0 && productsAttributesImportResults?.success?.valid_data">
                <h3 class="text-lg font-semibold mb-4 text-green-700">Valid Records ({{
                    productsAttributesImportResults.success.valid_records
                    }})</h3>
                <DataTable v-model:filters="filters" :value="productsAttributesImportResults.success.valid_data"
                    paginator :rows="10" dataKey="product_code" filterDisplay="menu"
                    :globalFilterFields="['product_code', 'attribute_code', 'language_code', 'value']" class="th-table">
                    <template #header>
                        <div class="flex justify-between items-center">
                            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined
                                @click="clearFilter()" />
                            <InputText v-model="filters['global'].value"
                                placeholder="Search valid product attributes records..." />
                        </div>
                    </template>
                    <template #empty> No valid product attributes records found. </template>
                    <Column field="product_code" header="Product Code" style="min-width: 10rem" />
                    <Column field="attribute_code" header="Attribute Code" style="min-width: 10rem" />
                    <Column field="language_code" header="Language Code" style="min-width: 10rem" />
                    <Column field="value" header="Value" style="min-width: 15rem" />
                </DataTable>
            </div>
        </div>

        <!-- Products Variants Import Results Section -->
        <div v-if="showProductsVariantsResults && productsVariantsImportResults"
            class="bg-white rounded-lg p-6 shadow-md">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-semibold">Products Variants Import Results</h2>
                <Button icon="pi pi-times" label="Clear Results" severity="secondary" outlined
                    @click="clearProductsVariantsResults" />
            </div>
            <!-- Summary Statistics -->
            <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div class="text-2xl font-bold text-blue-600">{{
                        productsVariantsImportResults?.success?.total_records || 0
                    }}</div>
                    <div class="text-sm text-blue-800">Total Records</div>
                </div>
                <div class="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div class="text-2xl font-bold text-green-600">{{
                        productsVariantsImportResults?.success?.valid_records || 0
                    }}</div>
                    <div class="text-sm text-green-800">Valid Records</div>
                </div>
                <div class="bg-red-50 p-4 rounded-lg border border-red-200">
                    <div class="text-2xl font-bold text-red-600">{{
                        productsVariantsImportResults?.success?.invalid_records || 0
                    }}</div>
                    <div class="text-sm text-red-800">Invalid Records</div>
                </div>
                <div class="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <div class="text-2xl font-bold text-orange-600">{{
                        productsVariantsImportResults?.success?.updated_records || 0
                    }}</div>
                    <div class="text-sm text-orange-800">Updated Records</div>
                </div>
                <div class="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <div class="text-2xl font-bold text-purple-600">{{
                        productsVariantsImportResults?.success?.inserted_count || 0
                    }}</div>
                    <div class="text-sm text-purple-800">Inserted Records</div>
                </div>
            </div>

            <!-- Invalid Records DataTable -->
            <div v-if="productsVariantsImportResults?.success?.invalid_records > 0 && productsVariantsImportResults?.success?.invalid_data"
                class="mb-6">
                <h3 class="text-lg font-semibold mb-4 text-red-700">Invalid Records ({{
                    productsVariantsImportResults.success.invalid_records
                }})</h3>
                <DataTable v-model:filters="filters" :value="productsVariantsImportResults.success.invalid_data"
                    paginator :rows="10" dataKey="row" filterDisplay="menu"
                    :globalFilterFields="['data.product_code', 'data.variant_product_code']" class="th-table">
                    <template #header>
                        <div class="flex justify-between items-center">
                            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined
                                @click="clearFilter()" />
                            <InputText v-model="filters['global'].value"
                                placeholder="Search invalid product variants records..." />
                        </div>
                    </template>
                    <template #empty> No invalid product variants records found. </template>
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
                    <Column field="data.variant_product_code" header="Variant Product Code" style="min-width: 10rem">
                        <template #body="{ data }">
                            {{ data.data.variant_product_code }}
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
            <div v-if="productsVariantsImportResults?.success?.updated_records > 0 && productsVariantsImportResults?.success?.updated_data"
                class="mb-6">
                <h3 class="text-lg font-semibold mb-4 text-orange-700">Updated Records ({{
                    productsVariantsImportResults.success.updated_records
                }})</h3>
                <DataTable v-model:filters="filters" :value="productsVariantsImportResults.success.updated_data"
                    paginator :rows="10" dataKey="row" filterDisplay="menu"
                    :globalFilterFields="['data.product_code', 'data.variant_product_code']" class="th-table">
                    <template #header>
                        <div class="flex justify-between items-center">
                            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined
                                @click="clearFilter()" />
                            <InputText v-model="filters['global'].value"
                                placeholder="Search updated product variants records..." />
                        </div>
                    </template>
                    <template #empty> No updated product variants records found. </template>
                    <Column field="data.product_code" header="Product Code" style="min-width: 10rem">
                        <template #body="{ data }">
                            {{ data.data.product_code }}
                        </template>
                    </Column>
                    <Column field="data.variant_product_code" header="Variant Product Code" style="min-width: 10rem">
                        <template #body="{ data }">
                            {{ data.data.variant_product_code }}
                        </template>
                    </Column>
                </DataTable>
            </div>

            <!-- Valid Records DataTable -->
            <div
                v-if="productsVariantsImportResults?.success?.valid_records > 0 && productsVariantsImportResults?.success?.valid_data">
                <h3 class="text-lg font-semibold mb-4 text-green-700">Valid Records ({{
                    productsVariantsImportResults.success.valid_records
                }})</h3>
                <DataTable v-model:filters="filters" :value="productsVariantsImportResults.success.valid_data" paginator
                    :rows="10" dataKey="product_code" filterDisplay="menu"
                    :globalFilterFields="['product_code', 'variant_product_code']" class="th-table">
                    <template #header>
                        <div class="flex justify-between items-center">
                            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined
                                @click="clearFilter()" />
                            <InputText v-model="filters['global'].value"
                                placeholder="Search valid product variants records..." />
                        </div>
                    </template>
                    <template #empty> No valid product variants records found. </template>
                    <Column field="product_code" header="Product Code" style="min-width: 10rem" />
                    <Column field="variant_product_code" header="Variant Product Code" style="min-width: 10rem" />
                </DataTable>
            </div>
        </div>

        <!-- Products Options Import Results Section -->
        <div v-if="showProductsOptionsResults && productsOptionsImportResults"
            class="bg-white rounded-lg p-6 shadow-md">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-semibold">Products Options Import Results</h2>
                <Button icon="pi pi-times" label="Clear Results" severity="secondary" outlined
                    @click="clearProductsOptionsResults" />
            </div>
            <!-- Summary Statistics -->
            <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div class="text-2xl font-bold text-blue-600">{{
                        productsOptionsImportResults?.success?.total_records || 0
                        }}</div>
                    <div class="text-sm text-blue-800">Total Records</div>
                </div>
                <div class="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div class="text-2xl font-bold text-green-600">{{
                        productsOptionsImportResults?.success?.valid_records || 0
                        }}</div>
                    <div class="text-sm text-green-800">Valid Records</div>
                </div>
                <div class="bg-red-50 p-4 rounded-lg border border-red-200">
                    <div class="text-2xl font-bold text-red-600">{{
                        productsOptionsImportResults?.success?.invalid_records || 0
                        }}</div>
                    <div class="text-sm text-red-800">Invalid Records</div>
                </div>
                <div class="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <div class="text-2xl font-bold text-orange-600">{{
                        productsOptionsImportResults?.success?.updated_records || 0
                        }}</div>
                    <div class="text-sm text-orange-800">Updated Records</div>
                </div>
                <div class="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <div class="text-2xl font-bold text-purple-600">{{
                        productsOptionsImportResults?.success?.inserted_count || 0
                        }}</div>
                    <div class="text-sm text-purple-800">Inserted Records</div>
                </div>
            </div>

            <!-- Invalid Records DataTable -->
            <div v-if="productsOptionsImportResults?.success?.invalid_records > 0 && productsOptionsImportResults?.success?.invalid_data"
                class="mb-6">
                <h3 class="text-lg font-semibold mb-4 text-red-700">Invalid Records ({{
                    productsOptionsImportResults.success.invalid_records
                    }})</h3>
                <DataTable v-model:filters="filters" :value="productsOptionsImportResults.success.invalid_data"
                    paginator :rows="10" dataKey="row" filterDisplay="menu"
                    :globalFilterFields="['data.product_code', 'data.option_code', 'data.type', 'data.name', 'data.value', 'data.meta_description', 'data.required']"
                    class="th-table">
                    <template #header>
                        <div class="flex justify-between items-center">
                            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined
                                @click="clearFilter()" />
                            <InputText v-model="filters['global'].value"
                                placeholder="Search invalid product options records..." />
                        </div>
                    </template>
                    <template #empty> No invalid product options records found. </template>
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
                    <Column field="data.option_code" header="Option Code" style="min-width: 10rem">
                        <template #body="{ data }">
                            {{ data.data.option_code }}
                        </template>
                    </Column>
                    <Column field="data.type" header="Type" style="min-width: 8rem">
                        <template #body="{ data }">
                            {{ data.data.type }}
                        </template>
                    </Column>
                    <Column field="data.name" header="Name" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ data.data.name }}
                        </template>
                    </Column>
                    <Column field="data.value" header="Value" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ data.data.value }}
                        </template>
                    </Column>
                    <Column field="data.meta_description" header="Meta Description" style="min-width: 15rem">
                        <template #body="{ data }">
                            {{ data.data.meta_description }}
                        </template>
                    </Column>
                    <Column field="data.required" header="Required" style="min-width: 8rem">
                        <template #body="{ data }">
                            {{ data.data.required ? 'Yes' : 'No' }}
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
            <div v-if="productsOptionsImportResults?.success?.updated_records > 0 && productsOptionsImportResults?.success?.updated_data"
                class="mb-6">
                <h3 class="text-lg font-semibold mb-4 text-orange-700">Updated Records ({{
                    productsOptionsImportResults.success.updated_records
                    }})</h3>
                <DataTable v-model:filters="filters" :value="productsOptionsImportResults.success.updated_data"
                    paginator :rows="10" dataKey="row" filterDisplay="menu"
                    :globalFilterFields="['data.product_code', 'data.option_code', 'data.type', 'data.name', 'data.value', 'data.meta_description', 'data.required']"
                    class="th-table">
                    <template #header>
                        <div class="flex justify-between items-center">
                            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined
                                @click="clearFilter()" />
                            <InputText v-model="filters['global'].value"
                                placeholder="Search updated product options records..." />
                        </div>
                    </template>
                    <template #empty> No updated product options records found. </template>
                    <Column field="data.product_code" header="Product Code" style="min-width: 10rem">
                        <template #body="{ data }">
                            {{ data.data.product_code }}
                        </template>
                    </Column>
                    <Column field="data.option_code" header="Option Code" style="min-width: 10rem">
                        <template #body="{ data }">
                            {{ data.data.option_code }}
                        </template>
                    </Column>
                    <Column field="data.type" header="Type" style="min-width: 8rem">
                        <template #body="{ data }">
                            {{ data.data.type }}
                        </template>
                    </Column>
                    <Column field="data.name" header="Name" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ data.data.name }}
                        </template>
                    </Column>
                    <Column field="data.value" header="Value" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ data.data.value }}
                        </template>
                    </Column>
                    <Column field="data.meta_description" header="Meta Description" style="min-width: 15rem">
                        <template #body="{ data }">
                            {{ data.data.meta_description }}
                        </template>
                    </Column>
                    <Column field="data.required" header="Required" style="min-width: 8rem">
                        <template #body="{ data }">
                            {{ data.data.required ? 'Yes' : 'No' }}
                        </template>
                    </Column>
                </DataTable>
            </div>

            <!-- Valid Records DataTable -->
            <div
                v-if="productsOptionsImportResults?.success?.valid_records > 0 && productsOptionsImportResults?.success?.valid_data">
                <h3 class="text-lg font-semibold mb-4 text-green-700">Valid Records ({{
                    productsOptionsImportResults.success.valid_records
                    }})</h3>
                <DataTable v-model:filters="filters" :value="productsOptionsImportResults.success.valid_data" paginator
                    :rows="10" dataKey="product_code" filterDisplay="menu"
                    :globalFilterFields="['product_code', 'option_code', 'type', 'name', 'value', 'meta_description', 'required']"
                    class="th-table">
                    <template #header>
                        <div class="flex justify-between items-center">
                            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined
                                @click="clearFilter()" />
                            <InputText v-model="filters['global'].value"
                                placeholder="Search valid product options records..." />
                        </div>
                    </template>
                    <template #empty> No valid product options records found. </template>
                    <Column field="product_code" header="Product Code" style="min-width: 10rem" />
                    <Column field="option_code" header="Option Code" style="min-width: 10rem" />
                    <Column field="type" header="Type" style="min-width: 8rem" />
                    <Column field="name" header="Name" style="min-width: 12rem" />
                    <Column field="value" header="Value" style="min-width: 12rem" />
                    <Column field="meta_description" header="Meta Description" style="min-width: 15rem" />
                    <Column field="required" header="Required" style="min-width: 8rem">
                        <template #body="{ data }">
                            {{ data.required ? 'Yes' : 'No' }}
                        </template>
                    </Column>
                </DataTable>
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
                            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined
                                @click="clearFilter()" />
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
                            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined
                                @click="clearFilter()" />
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
                            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined
                                @click="clearFilter()" />
                            <InputText v-model="filters['global'].value"
                                placeholder="Search valid product images records..." />
                        </div>
                    </template>
                    <template #empty> No valid product images records found. </template>
                    <Column field="product_code" header="Product Code" style="min-width: 10rem" />
                    <Column field="image_link" header="Image Link" style="min-width: 15rem">
                        <template #body="{ data }">
                            <a :href="data.image_link" target="_blank" class="text-blue-500 hover:underline">
                                {{ data.image_link ? data.image_link.substring(0, 30) + (data.image_link.length > 30 ?
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

        <!-- Products Digital Assets Import Results Section -->
        <div v-if="showProductsDigitalAssetsResults && productsDigitalAssetsImportResults"
            class="bg-white rounded-lg p-6 shadow-md">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-semibold">Products Digital Assets Import Results</h2>
                <Button icon="pi pi-times" label="Clear Results" severity="secondary" outlined
                    @click="clearProductsDigitalAssetsResults" />
            </div>
            <!-- Summary Statistics -->
            <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div class="text-2xl font-bold text-blue-600">{{
                        productsDigitalAssetsImportResults?.success?.total_records || 0
                        }}</div>
                    <div class="text-sm text-blue-800">Total Records</div>
                </div>
                <div class="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div class="text-2xl font-bold text-green-600">{{
                        productsDigitalAssetsImportResults?.success?.valid_records || 0
                        }}</div>
                    <div class="text-sm text-green-800">Valid Records</div>
                </div>
                <div class="bg-red-50 p-4 rounded-lg border border-red-200">
                    <div class="text-2xl font-bold text-red-600">{{
                        productsDigitalAssetsImportResults?.success?.invalid_records || 0
                        }}</div>
                    <div class="text-sm text-red-800">Invalid Records</div>
                </div>
                <div class="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <div class="text-2xl font-bold text-orange-600">{{
                        productsDigitalAssetsImportResults?.success?.updated_records || 0
                        }}</div>
                    <div class="text-sm text-orange-800">Updated Records</div>
                </div>
                <div class="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <div class="text-2xl font-bold text-purple-600">{{
                        productsDigitalAssetsImportResults?.success?.inserted_count || 0
                        }}</div>
                    <div class="text-sm text-purple-800">Inserted Records</div>
                </div>
            </div>

            <!-- Invalid Records DataTable -->
            <div v-if="productsDigitalAssetsImportResults?.success?.invalid_records > 0 && productsDigitalAssetsImportResults?.success?.invalid_data"
                class="mb-6">
                <h3 class="text-lg font-semibold mb-4 text-red-700">Invalid Records ({{
                    productsDigitalAssetsImportResults.success.invalid_records
                    }})</h3>
                <DataTable v-model:filters="filters" :value="productsDigitalAssetsImportResults.success.invalid_data"
                    paginator :rows="10" dataKey="row" filterDisplay="menu"
                    :globalFilterFields="['data.product_code', 'data.digital_asset_code']" class="th-table">
                    <template #header>
                        <div class="flex justify-between items-center">
                            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined
                                @click="clearFilter()" />
                            <InputText v-model="filters['global'].value"
                                placeholder="Search invalid digital assets records..." />
                        </div>
                    </template>
                    <template #empty> No invalid digital assets records found. </template>
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
                    <Column field="data.digital_asset_code" header="Digital Asset Code" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ data.data.digital_asset_code }}
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
            <div v-if="productsDigitalAssetsImportResults?.success?.updated_records > 0 && productsDigitalAssetsImportResults?.success?.updated_data"
                class="mb-6">
                <h3 class="text-lg font-semibold mb-4 text-orange-700">Updated Records ({{
                    productsDigitalAssetsImportResults.success.updated_records
                    }})</h3>
                <DataTable v-model:filters="filters" :value="productsDigitalAssetsImportResults.success.updated_data"
                    paginator :rows="10" dataKey="row" filterDisplay="menu"
                    :globalFilterFields="['data.product_code', 'data.digital_asset_code']" class="th-table">
                    <template #header>
                        <div class="flex justify-between items-center">
                            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined
                                @click="clearFilter()" />
                            <InputText v-model="filters['global'].value"
                                placeholder="Search updated digital assets records..." />
                        </div>
                    </template>
                    <template #empty> No updated digital assets records found. </template>
                    <Column field="data.product_code" header="Product Code" style="min-width: 10rem">
                        <template #body="{ data }">
                            {{ data.data.product_code }}
                        </template>
                    </Column>
                    <Column field="data.digital_asset_code" header="Digital Asset Code" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ data.data.digital_asset_code }}
                        </template>
                    </Column>
                </DataTable>
            </div>

            <!-- Valid Records DataTable -->
            <div
                v-if="productsDigitalAssetsImportResults?.success?.valid_records > 0 && productsDigitalAssetsImportResults?.success?.valid_data">
                <h3 class="text-lg font-semibold mb-4 text-green-700">Valid Records ({{
                    productsDigitalAssetsImportResults.success.valid_records
                    }})</h3>
                <DataTable v-model:filters="filters" :value="productsDigitalAssetsImportResults.success.valid_data"
                    paginator :rows="10" dataKey="product_code" filterDisplay="menu"
                    :globalFilterFields="['product_code', 'digital_asset_code']" class="th-table">
                    <template #header>
                        <div class="flex justify-between items-center">
                            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined
                                @click="clearFilter()" />
                            <InputText v-model="filters['global'].value"
                                placeholder="Search valid digital assets records..." />
                        </div>
                    </template>
                    <template #empty> No valid digital assets records found. </template>
                    <Column field="product_code" header="Product Code" style="min-width: 10rem" />
                    <Column field="digital_asset_code" header="Digital Asset Code" style="min-width: 12rem" />
                </DataTable>
            </div>
        </div>

        <!-- Products Tags Import Results Section -->
        <div v-if="showProductsTagsResults && productsTagsImportResults" class="bg-white rounded-lg p-6 shadow-md">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-semibold">Products Tags Import Results</h2>
                <Button icon="pi pi-times" label="Clear Results" severity="secondary" outlined
                    @click="clearProductsTagsResults" />
            </div>
            <!-- Summary Statistics -->
            <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div class="text-2xl font-bold text-blue-600">{{ productsTagsImportResults?.success?.total_records
                        || 0 }}
                    </div>
                    <div class="text-sm text-blue-800">Total Records</div>
                </div>
                <div class="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div class="text-2xl font-bold text-green-600">{{ productsTagsImportResults?.success?.valid_records
                        || 0 }}
                    </div>
                    <div class="text-sm text-green-800">Valid Records</div>
                </div>
                <div class="bg-red-50 p-4 rounded-lg border border-red-200">
                    <div class="text-2xl font-bold text-red-600">{{ productsTagsImportResults?.success?.invalid_records
                        || 0 }}
                    </div>
                    <div class="text-sm text-red-800">Invalid Records</div>
                </div>
                <div class="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <div class="text-2xl font-bold text-orange-600">{{
                        productsTagsImportResults?.success?.updated_records || 0
                        }}</div>
                    <div class="text-sm text-orange-800">Updated Records</div>
                </div>
                <div class="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <div class="text-2xl font-bold text-purple-600">{{
                        productsTagsImportResults?.success?.inserted_count || 0
                        }}</div>
                    <div class="text-sm text-purple-800">Inserted Records</div>
                </div>
            </div>

            <!-- Invalid Records DataTable -->
            <div v-if="productsTagsImportResults?.success?.invalid_records > 0 && productsTagsImportResults?.success?.invalid_data"
                class="mb-6">
                <h3 class="text-lg font-semibold mb-4 text-red-700">Invalid Records ({{
                    productsTagsImportResults.success.invalid_records }})</h3>
                <DataTable v-model:filters="filters" :value="productsTagsImportResults.success.invalid_data" paginator
                    :rows="10" dataKey="row" filterDisplay="menu"
                    :globalFilterFields="['data.product_code', 'data.taxonomy_item_code']" class="th-table">
                    <template #header>
                        <div class="flex justify-between items-center">
                            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined
                                @click="clearFilter()" />
                            <InputText v-model="filters['global'].value"
                                placeholder="Search invalid product tags records..." />
                        </div>
                    </template>
                    <template #empty> No invalid product tags records found. </template>
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
                    <Column field="data.taxonomy_item_code" header="Taxonomy Item Code" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ data.data.taxonomy_item_code }}
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
            <div v-if="productsTagsImportResults?.success?.updated_records > 0 && productsTagsImportResults?.success?.updated_data"
                class="mb-6">
                <h3 class="text-lg font-semibold mb-4 text-orange-700">Updated Records ({{
                    productsTagsImportResults.success.updated_records }})</h3>
                <DataTable v-model:filters="filters" :value="productsTagsImportResults.success.updated_data" paginator
                    :rows="10" dataKey="row" filterDisplay="menu"
                    :globalFilterFields="['data.product_code', 'data.taxonomy_item_code']" class="th-table">
                    <template #header>
                        <div class="flex justify-between items-center">
                            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined
                                @click="clearFilter()" />
                            <InputText v-model="filters['global'].value"
                                placeholder="Search updated product tags records..." />
                        </div>
                    </template>
                    <template #empty> No updated product tags records found. </template>
                    <Column field="data.product_code" header="Product Code" style="min-width: 10rem">
                        <template #body="{ data }">
                            {{ data.data.product_code }}
                        </template>
                    </Column>
                    <Column field="data.taxonomy_item_code" header="Taxonomy Item Code" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ data.data.taxonomy_item_code }}
                        </template>
                    </Column>
                </DataTable>
            </div>

            <!-- Valid Records DataTable -->
            <div
                v-if="productsTagsImportResults?.success?.valid_records > 0 && productsTagsImportResults?.success?.valid_data">
                <h3 class="text-lg font-semibold mb-4 text-green-700">Valid Records ({{
                    productsTagsImportResults.success.valid_records }})</h3>
                <DataTable v-model:filters="filters" :value="productsTagsImportResults.success.valid_data" paginator
                    :rows="10" dataKey="product_code" filterDisplay="menu"
                    :globalFilterFields="['product_code', 'taxonomy_item_code']" class="th-table">
                    <template #header>
                        <div class="flex justify-between items-center">
                            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined
                                @click="clearFilter()" />
                            <InputText v-model="filters['global'].value"
                                placeholder="Search valid product tags records..." />
                        </div>
                    </template>
                    <template #empty> No valid product tags records found. </template>
                    <Column field="product_code" header="Product Code" style="min-width: 10rem" />
                    <Column field="taxonomy_item_code" header="Taxonomy Item Code" style="min-width: 12rem" />
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
