<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useDesignResourceImportStore } from '../stores/designResourceImport';
import { useToast } from 'primevue/usetoast';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import FileUpload from 'primevue/fileupload';
import ProgressBar from 'primevue/progressbar';
import axios from 'axios';

const toast = useToast();
const designResourceImportStore = useDesignResourceImportStore();
const selectedFileFinishes = ref(null);
const selectedFileColors = ref(null);
const selectedFileTextiles = ref(null);
const isSavingFinishes = ref(false);
const isSavingColors = ref(false);
const isSavingTextiles = ref(false);

// Import results data
const finishesImportResults = ref(null);
const showFinishesResults = ref(false);
const colorsImportResults = ref(null);
const showColorsResults = ref(false);
const textilesImportResults = ref(null);
const showTextilesResults = ref(false);

// Filters for datatables
const filters = ref({
    global: { value: null, matchMode: 'contains' }
});

const handleFileSelectFinishes = (event) => {
    const file = event.files[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Please select a CSV file', life: 3000 });
        return;
    }

    selectedFileFinishes.value = file;
};

const handleFileSelectColors = (event) => {
    const file = event.files[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Please select a CSV file', life: 3000 });
        return;
    }

    selectedFileColors.value = file;
};

const handleFileSelectTextiles = (event) => {
    const file = event.files[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Please select a CSV file', life: 3000 });
        return;
    }

    selectedFileTextiles.value = file;
};

const handleSaveFinishes = async () => {
    if (!selectedFileFinishes.value) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Please select a file first', life: 3000 });
        return;
    }

    isSavingFinishes.value = true;
    try {
        const formData = new FormData();
        formData.append('csv_file', selectedFileFinishes.value);
        formData.append('type', 'import');
        formData.append('status', 'pending');

        const response = await designResourceImportStore.createFinishesImport(formData);
        
        // Store the import results
        finishesImportResults.value = response;
        showFinishesResults.value = true;
        
        toast.add({ severity: 'success', summary: 'Success', detail: 'Finishes imported successfully', life: 3000 });
        selectedFileFinishes.value = null;
    } catch (error) {
        console.error('Save error:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: error.message || 'Failed to save file', life: 3000 });
    } finally {
        isSavingFinishes.value = false;
    }
};

const handleSaveColors = async () => {
    if (!selectedFileColors.value) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Please select a file first', life: 3000 });
        return;
    }

    isSavingColors.value = true;
    try {
        const formData = new FormData();
        formData.append('csv_file', selectedFileColors.value);
        formData.append('type', 'import');
        formData.append('status', 'pending');

        const response = await designResourceImportStore.createColorsImport(formData);
        
        // Store the import results
        colorsImportResults.value = response;
        showColorsResults.value = true;
        
        toast.add({ severity: 'success', summary: 'Success', detail: 'Colors imported successfully', life: 3000 });
        selectedFileColors.value = null;
    } catch (error) {
        console.error('Save error:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: error.message || 'Failed to save file', life: 3000 });
    } finally {
        isSavingColors.value = false;
    }
};

const handleSaveTextiles = async () => {
    if (!selectedFileTextiles.value) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Please select a file first', life: 3000 });
        return;
    }

    isSavingTextiles.value = true;
    try {
        const formData = new FormData();
        formData.append('csv_file', selectedFileTextiles.value);
        formData.append('type', 'import');
        formData.append('status', 'pending');

        const response = await designResourceImportStore.createTextilesImport(formData);
        
        // Store the import results
        textilesImportResults.value = response;
        showTextilesResults.value = true;
        
        toast.add({ severity: 'success', summary: 'Success', detail: 'Textiles imported successfully', life: 3000 });
        selectedFileTextiles.value = null;
    } catch (error) {
        console.error('Save error:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: error.message || 'Failed to save file', life: 3000 });
    } finally {
        isSavingTextiles.value = false;
    }
};

const clearFilter = () => {
    filters.value.global.value = null;
};

const clearFinishesResults = () => {
    finishesImportResults.value = null;
    showFinishesResults.value = false;
};

const clearColorsResults = () => {
    colorsImportResults.value = null;
    showColorsResults.value = false;
};

const clearTextilesResults = () => {
    textilesImportResults.value = null;
    showTextilesResults.value = false;
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
        <!-- Finishes Import Section -->
        <div class="bg-white rounded-lg p-6 shadow-md">
            <h2 class="text-xl font-semibold mb-2">Import Finishes CSV data</h2>
            <p class="text-gray-600 mb-4">Upload a CSV file to start importing finishes data</p>
            
            <div class="flex flex-col gap-4">
                <FileUpload 
                    mode="basic" 
                    name="importFinishesFile" 
                    accept=".csv" 
                    :maxFileSize="1000000" 
                    @select="handleFileSelectFinishes" 
                    :auto="false" 
                    chooseLabel="Select CSV File"
                />

                <!-- Selected file info and Save button -->
                <div v-if="selectedFileFinishes" class="flex flex-col gap-4">
                    <div class="flex items-center gap-2 p-3 bg-gray-50 rounded">
                        <i class="pi pi-file text-gray-500"></i>
                        <span class="text-gray-700">{{ selectedFileFinishes.name }}</span>
                    </div>

                    <!-- Progress Bar -->
                    <div v-if="isSavingFinishes" class="w-full">
                        <ProgressBar 
                            mode="indeterminate" 
                            style="height: 8px" 
                            class="w-full"
                        />
                        <p class="text-sm text-gray-600 mt-2 text-center">Importing finishes data...</p>
                    </div>

                    <Button 
                        icon="pi pi-save"
                        :label="isSavingFinishes ? 'Saving...' : 'Import Finishes'"
                        severity="success"
                        @click="handleSaveFinishes"
                        :loading="isSavingFinishes"
                        :disabled="isSavingFinishes"
                        class="p-button-md"
                    />
                </div>
            </div>
        </div>

        <!-- Colors Import Section -->
        <div class="bg-white rounded-lg p-6 shadow-md">
            <h2 class="text-xl font-semibold mb-2">Import Colors CSV data</h2>
            <p class="text-gray-600 mb-4">Upload a CSV file to start importing colors data</p>
            
            <div class="flex flex-col gap-4">
                <FileUpload 
                    mode="basic" 
                    name="importColorsFile" 
                    accept=".csv" 
                    :maxFileSize="1000000" 
                    @select="handleFileSelectColors" 
                    :auto="false" 
                    chooseLabel="Select CSV File"
                />

                <!-- Selected file info and Save button -->
                <div v-if="selectedFileColors" class="flex flex-col gap-4">
                    <div class="flex items-center gap-2 p-3 bg-gray-50 rounded">
                        <i class="pi pi-file text-gray-500"></i>
                        <span class="text-gray-700">{{ selectedFileColors.name }}</span>
                    </div>

                    <!-- Progress Bar -->
                    <div v-if="isSavingColors" class="w-full">
                        <ProgressBar 
                            mode="indeterminate" 
                            style="height: 8px" 
                            class="w-full"
                        />
                        <p class="text-sm text-gray-600 mt-2 text-center">Importing colors data...</p>
                    </div>

                    <Button 
                        icon="pi pi-save"
                        :label="isSavingColors ? 'Saving...' : 'Import Colors'"
                        severity="success"
                        @click="handleSaveColors"
                        :loading="isSavingColors"
                        :disabled="isSavingColors"
                        class="p-button-md"
                    />
                </div>
            </div>
        </div>

        <!-- Textiles Import Section -->
        <div class="bg-white rounded-lg p-6 shadow-md">
            <h2 class="text-xl font-semibold mb-2">Import Textiles CSV data</h2>
            <p class="text-gray-600 mb-4">Upload a CSV file to start importing textiles data</p>
            
            <div class="flex flex-col gap-4">
                <FileUpload 
                    mode="basic" 
                    name="importTextilesFile" 
                    accept=".csv" 
                    :maxFileSize="1000000" 
                    @select="handleFileSelectTextiles" 
                    :auto="false" 
                    chooseLabel="Select CSV File"
                />

                <!-- Selected file info and Save button -->
                <div v-if="selectedFileTextiles" class="flex flex-col gap-4">
                    <div class="flex items-center gap-2 p-3 bg-gray-50 rounded">
                        <i class="pi pi-file text-gray-500"></i>
                        <span class="text-gray-700">{{ selectedFileTextiles.name }}</span>
                    </div>

                    <!-- Progress Bar -->
                    <div v-if="isSavingTextiles" class="w-full">
                        <ProgressBar 
                            mode="indeterminate" 
                            style="height: 8px" 
                            class="w-full"
                        />
                        <p class="text-sm text-gray-600 mt-2 text-center">Importing textiles data...</p>
                    </div>

                    <Button 
                        icon="pi pi-save"
                        :label="isSavingTextiles ? 'Saving...' : 'Import Textiles'"
                        severity="success"
                        @click="handleSaveTextiles"
                        :loading="isSavingTextiles"
                        :disabled="isSavingTextiles"
                        class="p-button-md"
                    />
                </div>
            </div>
        </div>

        <!-- Finishes Import Results Section -->
        <div v-if="showFinishesResults && finishesImportResults" class="bg-white rounded-lg p-6 shadow-md">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-semibold">Finishes Import Results</h2>
                <Button 
                    icon="pi pi-times" 
                    label="Clear Results" 
                    severity="secondary" 
                    outlined 
                    @click="clearFinishesResults"
                />
            </div>

            <!-- Summary Statistics -->
            <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div class="text-2xl font-bold text-blue-600">{{ finishesImportResults?.success?.total_records || 0 }}</div>
                    <div class="text-sm text-blue-800">Total Records</div>
                </div>
                <div class="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div class="text-2xl font-bold text-green-600">{{ finishesImportResults?.success?.valid_records || 0 }}</div>
                    <div class="text-sm text-green-800">Valid Records</div>
                </div>
                <div class="bg-red-50 p-4 rounded-lg border border-red-200">
                    <div class="text-2xl font-bold text-red-600">{{ finishesImportResults?.success?.invalid_records || 0 }}</div>
                    <div class="text-sm text-red-800">Invalid Records</div>
                </div>
                <div class="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <div class="text-2xl font-bold text-orange-600">{{ finishesImportResults?.success?.updated_records || 0 }}</div>
                    <div class="text-sm text-orange-800">Updated Records</div>
                </div>
                <div class="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <div class="text-2xl font-bold text-purple-600">{{ finishesImportResults?.success?.inserted_count || 0 }}</div>
                    <div class="text-sm text-purple-800">Inserted Records</div>
                </div>
            </div>

            <!-- Invalid Records DataTable -->
            <div v-if="finishesImportResults?.success?.invalid_records > 0 && finishesImportResults?.success?.invalid_data" class="mb-6">
                <h3 class="text-lg font-semibold mb-4 text-red-700">Invalid Records ({{ finishesImportResults.success.invalid_records }})</h3>
                <DataTable
                    v-model:filters="filters"
                    :value="finishesImportResults.success.invalid_data"
                    paginator
                    :rows="10"
                    dataKey="row"
                    filterDisplay="menu"
                    :globalFilterFields="['data.finish_id', 'data.name', 'data.slug', 'data.description']"
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
                            <InputText v-model="filters['global'].value" placeholder="Search invalid finishes records..." />
                        </div>
                    </template>
                    <template #empty> No invalid finishes records found. </template>

                    <Column field="row" header="Row" style="min-width: 6rem">
                        <template #body="{ data }">
                            {{ data.row }}
                        </template>
                    </Column>

                    <Column field="data.finish_id" header="Finish ID" style="min-width: 8rem">
                        <template #body="{ data }">
                            {{ data.data.finish_id }}
                        </template>
                    </Column>

                    <Column field="data.name" header="Name" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ data.data.name }}
                        </template>
                    </Column>

                    <Column field="data.slug" header="Slug" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ data.data.slug }}
                        </template>
                    </Column>

                    <Column field="data.description" header="Description" style="min-width: 15rem">
                        <template #body="{ data }">
                            {{ data.data.description }}
                        </template>
                    </Column>

                    <Column field="data.thumbnail" header="Thumbnail" style="min-width: 10rem">
                        <template #body="{ data }">
                            {{ formatImageData(data.data.thumbnail) }}
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
            <div v-if="finishesImportResults?.success?.updated_records > 0 && finishesImportResults?.success?.updated_data" class="mb-6">
                <h3 class="text-lg font-semibold mb-4 text-orange-700">Updated Records ({{ finishesImportResults.success.updated_records }})</h3>
                <DataTable
                    v-model:filters="filters"
                    :value="finishesImportResults.success.updated_data"
                    paginator
                    :rows="10"
                    dataKey="finish_id"
                    filterDisplay="menu"
                    :globalFilterFields="['finish_id', 'name', 'slug', 'description']"
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
                            <InputText v-model="filters['global'].value" placeholder="Search updated finishes records..." />
                        </div>
                    </template>
                    <template #empty> No updated finishes records found. </template>

                    <Column field="finish_id" header="Finish ID" style="min-width: 8rem" />
                    <Column field="name" header="Name" style="min-width: 12rem" />
                    <Column field="slug" header="Slug" style="min-width: 12rem" />
                    <Column field="description" header="Description" style="min-width: 15rem" />
                    <Column field="thumbnail" header="Thumbnail" style="min-width: 10rem">
                        <template #body="{ data }">
                            {{ formatImageData(data.thumbnail) }}
                        </template>
                    </Column>
                </DataTable>
            </div>

            <!-- Valid Records DataTable -->
            <div v-if="finishesImportResults?.success?.valid_records > 0 && finishesImportResults?.success?.valid_data">
                <h3 class="text-lg font-semibold mb-4 text-green-700">Valid Records ({{ finishesImportResults.success.valid_records }})</h3>
                <DataTable
                    v-model:filters="filters"
                    :value="finishesImportResults.success.valid_data"
                    paginator
                    :rows="10"
                    dataKey="finish_id"
                    filterDisplay="menu"
                    :globalFilterFields="['finish_id', 'name', 'slug', 'description']"
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
                            <InputText v-model="filters['global'].value" placeholder="Search valid finishes records..." />
                        </div>
                    </template>
                    <template #empty> No valid finishes records found. </template>

                    <Column field="finish_id" header="Finish ID" style="min-width: 8rem" />
                    <Column field="name" header="Name" style="min-width: 12rem" />
                    <Column field="slug" header="Slug" style="min-width: 12rem" />
                    <Column field="description" header="Description" style="min-width: 15rem" />
                    <Column field="thumbnail" header="Thumbnail" style="min-width: 10rem">
                        <template #body="{ data }">
                            {{ formatImageData(data.thumbnail) }}
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>

        <!-- Colors Import Results Section -->
        <div v-if="showColorsResults && colorsImportResults" class="bg-white rounded-lg p-6 shadow-md">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-semibold">Colors Import Results</h2>
                <Button 
                    icon="pi pi-times" 
                    label="Clear Results" 
                    severity="secondary" 
                    outlined 
                    @click="clearColorsResults"
                />
            </div>

            <!-- Summary Statistics -->
            <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div class="text-2xl font-bold text-blue-600">{{ colorsImportResults?.success?.total_records || 0 }}</div>
                    <div class="text-sm text-blue-800">Total Records</div>
                </div>
                <div class="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div class="text-2xl font-bold text-green-600">{{ colorsImportResults?.success?.valid_records || 0 }}</div>
                    <div class="text-sm text-green-800">Valid Records</div>
                </div>
                <div class="bg-red-50 p-4 rounded-lg border border-red-200">
                    <div class="text-2xl font-bold text-red-600">{{ colorsImportResults?.success?.invalid_records || 0 }}</div>
                    <div class="text-sm text-red-800">Invalid Records</div>
                </div>
                <div class="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <div class="text-2xl font-bold text-orange-600">{{ colorsImportResults?.success?.updated_records || 0 }}</div>
                    <div class="text-sm text-orange-800">Updated Records</div>
                </div>
                <div class="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <div class="text-2xl font-bold text-purple-600">{{ colorsImportResults?.success?.inserted_count || 0 }}</div>
                    <div class="text-sm text-purple-800">Inserted Records</div>
                </div>
            </div>

            <!-- Invalid Records DataTable -->
            <div v-if="colorsImportResults?.success?.invalid_records > 0 && colorsImportResults?.success?.invalid_data" class="mb-6">
                <h3 class="text-lg font-semibold mb-4 text-red-700">Invalid Records ({{ colorsImportResults.success.invalid_records }})</h3>
                <DataTable
                    v-model:filters="filters"
                    :value="colorsImportResults.success.invalid_data"
                    paginator
                    :rows="10"
                    dataKey="row"
                    filterDisplay="menu"
                    :globalFilterFields="['data.color_id', 'data.name', 'data.hex_code', 'data.rgb_code']"
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
                            <InputText v-model="filters['global'].value" placeholder="Search invalid colors records..." />
                        </div>
                    </template>
                    <template #empty> No invalid colors records found. </template>

                    <Column field="row" header="Row" style="min-width: 6rem">
                        <template #body="{ data }">
                            {{ data.row }}
                        </template>
                    </Column>

                    <Column field="data.color_id" header="Color ID" style="min-width: 8rem">
                        <template #body="{ data }">
                            {{ data.data.color_id }}
                        </template>
                    </Column>

                    <Column field="data.name" header="Name" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ data.data.name }}
                        </template>
                    </Column>

                    <Column field="data.hex_code" header="Hex Code" style="min-width: 10rem">
                        <template #body="{ data }">
                            {{ data.data.hex_code }}
                        </template>
                    </Column>

                    <Column field="data.rgb_code" header="RGB Code" style="min-width: 10rem">
                        <template #body="{ data }">
                            {{ data.data.rgb_code }}
                        </template>
                    </Column>

                    <Column field="data.description" header="Description" style="min-width: 15rem">
                        <template #body="{ data }">
                            {{ data.data.description }}
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
            <div v-if="colorsImportResults?.success?.updated_records > 0 && colorsImportResults?.success?.updated_data" class="mb-6">
                <h3 class="text-lg font-semibold mb-4 text-orange-700">Updated Records ({{ colorsImportResults.success.updated_records }})</h3>
                <DataTable
                    v-model:filters="filters"
                    :value="colorsImportResults.success.updated_data"
                    paginator
                    :rows="10"
                    dataKey="color_id"
                    filterDisplay="menu"
                    :globalFilterFields="['color_id', 'name', 'hex_code', 'rgb_code']"
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
                            <InputText v-model="filters['global'].value" placeholder="Search updated colors records..." />
                        </div>
                    </template>
                    <template #empty> No updated colors records found. </template>

                    <Column field="color_id" header="Color ID" style="min-width: 8rem" />
                    <Column field="name" header="Name" style="min-width: 12rem" />
                    <Column field="hex_code" header="Hex Code" style="min-width: 10rem" />
                    <Column field="rgb_code" header="RGB Code" style="min-width: 10rem" />
                    <Column field="description" header="Description" style="min-width: 15rem" />
                </DataTable>
            </div>

            <!-- Valid Records DataTable -->
            <div v-if="colorsImportResults?.success?.valid_records > 0 && colorsImportResults?.success?.valid_data">
                <h3 class="text-lg font-semibold mb-4 text-green-700">Valid Records ({{ colorsImportResults.success.valid_records }})</h3>
                <DataTable
                    v-model:filters="filters"
                    :value="colorsImportResults.success.valid_data"
                    paginator
                    :rows="10"
                    dataKey="color_id"
                    filterDisplay="menu"
                    :globalFilterFields="['color_id', 'name', 'hex_code', 'rgb_code']"
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
                            <InputText v-model="filters['global'].value" placeholder="Search valid colors records..." />
                        </div>
                    </template>
                    <template #empty> No valid colors records found. </template>

                    <Column field="color_id" header="Color ID" style="min-width: 8rem" />
                    <Column field="name" header="Name" style="min-width: 12rem" />
                    <Column field="hex_code" header="Hex Code" style="min-width: 10rem" />
                    <Column field="rgb_code" header="RGB Code" style="min-width: 10rem" />
                    <Column field="description" header="Description" style="min-width: 15rem" />
                </DataTable>
            </div>
        </div>

        <!-- Textiles Import Results Section -->
        <div v-if="showTextilesResults && textilesImportResults" class="bg-white rounded-lg p-6 shadow-md">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-semibold">Textiles Import Results</h2>
                <Button 
                    icon="pi pi-times" 
                    label="Clear Results" 
                    severity="secondary" 
                    outlined 
                    @click="clearTextilesResults"
                />
            </div>

            <!-- Summary Statistics -->
            <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div class="text-2xl font-bold text-blue-600">{{ textilesImportResults?.success?.total_records || 0 }}</div>
                    <div class="text-sm text-blue-800">Total Records</div>
                </div>
                <div class="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div class="text-2xl font-bold text-green-600">{{ textilesImportResults?.success?.valid_records || 0 }}</div>
                    <div class="text-sm text-green-800">Valid Records</div>
                </div>
                <div class="bg-red-50 p-4 rounded-lg border border-red-200">
                    <div class="text-2xl font-bold text-red-600">{{ textilesImportResults?.success?.invalid_records || 0 }}</div>
                    <div class="text-sm text-red-800">Invalid Records</div>
                </div>
                <div class="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <div class="text-2xl font-bold text-orange-600">{{ textilesImportResults?.success?.updated_records || 0 }}</div>
                    <div class="text-sm text-orange-800">Updated Records</div>
                </div>
                <div class="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <div class="text-2xl font-bold text-purple-600">{{ textilesImportResults?.success?.inserted_count || 0 }}</div>
                    <div class="text-sm text-purple-800">Inserted Records</div>
                </div>
            </div>

            <!-- Invalid Records DataTable -->
            <div v-if="textilesImportResults?.success?.invalid_records > 0 && textilesImportResults?.success?.invalid_data" class="mb-6">
                <h3 class="text-lg font-semibold mb-4 text-red-700">Invalid Records ({{ textilesImportResults.success.invalid_records }})</h3>
                <DataTable
                    v-model:filters="filters"
                    :value="textilesImportResults.success.invalid_data"
                    paginator
                    :rows="10"
                    dataKey="row"
                    filterDisplay="menu"
                    :globalFilterFields="['data.textile_id', 'data.name', 'data.material_type', 'data.texture']"
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
                            <InputText v-model="filters['global'].value" placeholder="Search invalid textiles records..." />
                        </div>
                    </template>
                    <template #empty> No invalid textiles records found. </template>

                    <Column field="row" header="Row" style="min-width: 6rem">
                        <template #body="{ data }">
                            {{ data.row }}
                        </template>
                    </Column>

                    <Column field="data.textile_id" header="Textile ID" style="min-width: 8rem">
                        <template #body="{ data }">
                            {{ data.data.textile_id }}
                        </template>
                    </Column>

                    <Column field="data.name" header="Name" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ data.data.name }}
                        </template>
                    </Column>

                    <Column field="data.material_type" header="Material Type" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ data.data.material_type }}
                        </template>
                    </Column>

                    <Column field="data.texture" header="Texture" style="min-width: 10rem">
                        <template #body="{ data }">
                            {{ data.data.texture }}
                        </template>
                    </Column>

                    <Column field="data.description" header="Description" style="min-width: 15rem">
                        <template #body="{ data }">
                            {{ data.data.description }}
                        </template>
                    </Column>

                    <Column field="data.preview_image" header="Preview Image" style="min-width: 10rem">
                        <template #body="{ data }">
                            {{ formatImageData(data.data.preview_image) }}
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
            <div v-if="textilesImportResults?.success?.updated_records > 0 && textilesImportResults?.success?.updated_data" class="mb-6">
                <h3 class="text-lg font-semibold mb-4 text-orange-700">Updated Records ({{ textilesImportResults.success.updated_records }})</h3>
                <DataTable
                    v-model:filters="filters"
                    :value="textilesImportResults.success.updated_data"
                    paginator
                    :rows="10"
                    dataKey="textile_id"
                    filterDisplay="menu"
                    :globalFilterFields="['textile_id', 'name', 'material_type', 'texture']"
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
                            <InputText v-model="filters['global'].value" placeholder="Search updated textiles records..." />
                        </div>
                    </template>
                    <template #empty> No updated textiles records found. </template>

                    <Column field="textile_id" header="Textile ID" style="min-width: 8rem" />
                    <Column field="name" header="Name" style="min-width: 12rem" />
                    <Column field="material_type" header="Material Type" style="min-width: 12rem" />
                    <Column field="texture" header="Texture" style="min-width: 10rem" />
                    <Column field="description" header="Description" style="min-width: 15rem" />
                    <Column field="preview_image" header="Preview Image" style="min-width: 10rem">
                        <template #body="{ data }">
                            {{ formatImageData(data.preview_image) }}
                        </template>
                    </Column>
                </DataTable>
            </div>

            <!-- Valid Records DataTable -->
            <div v-if="textilesImportResults?.success?.valid_records > 0 && textilesImportResults?.success?.valid_data">
                <h3 class="text-lg font-semibold mb-4 text-green-700">Valid Records ({{ textilesImportResults.success.valid_records }})</h3>
                <DataTable
                    v-model:filters="filters"
                    :value="textilesImportResults.success.valid_data"
                    paginator
                    :rows="10"
                    dataKey="textile_id"
                    filterDisplay="menu"
                    :globalFilterFields="['textile_id', 'name', 'material_type', 'texture']"
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
                            <InputText v-model="filters['global'].value" placeholder="Search valid textiles records..." />
                        </div>
                    </template>
                    <template #empty> No valid textiles records found. </template>

                    <Column field="textile_id" header="Textile ID" style="min-width: 8rem" />
                    <Column field="name" header="Name" style="min-width: 12rem" />
                    <Column field="material_type" header="Material Type" style="min-width: 12rem" />
                    <Column field="texture" header="Texture" style="min-width: 10rem" />
                    <Column field="description" header="Description" style="min-width: 15rem" />
                    <Column field="preview_image" header="Preview Image" style="min-width: 10rem">
                        <template #body="{ data }">
                            {{ formatImageData(data.preview_image) }}
                        </template>
                    </Column>
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
