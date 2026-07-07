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
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';

const toast = useToast();
const productStore = useProductStore();
const activeTab = ref(0);

// State for Tag Setup
const selectedFileTags = ref(null);
const isSavingTags = ref(false);
const tagsImportResults = ref(null);
const showTagsResults = ref(false);

// State for Attribute Setup
const selectedFileAttributes = ref(null);
const isSavingAttributes = ref(false);
const attributesImportResults = ref(null);
const showAttributesResults = ref(false);

// Filters for datatables
const filters = ref({
    global: { value: null, matchMode: 'contains' }
});

// File selection handlers
const handleFileSelect = (event, type) => {
    const file = event.files[0];
    if (!file) return;
    if (!file.name.endsWith('.csv')) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Please select a CSV file', life: 3000 });
        return;
    }
    switch (type) {
        case 'tags':
            selectedFileTags.value = file;
            break;
        case 'attributes':
            selectedFileAttributes.value = file;
            break;
    }
};

// Save handlers
const handleSave = async (type) => {
    let selectedFile, isSaving, importType, results, showResults, successMessage;
    switch (type) {
        case 'tags':
            selectedFile = selectedFileTags;
            isSaving = isSavingTags;
            importType = 'tags_categories_setup';
            results = tagsImportResults;
            showResults = showTagsResults;
            successMessage = 'Tags imported successfully';
            break;
        case 'attributes':
            selectedFile = selectedFileAttributes;
            isSaving = isSavingAttributes;
            importType = 'attributes_setup';
            results = attributesImportResults;
            showResults = showAttributesResults;
            successMessage = 'Attributes imported successfully';
            break;
    }
    if (!selectedFile.value) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Please select a file first', life: 3000 });
        return;
    }
    isSaving.value = true;
    try {
        const formData = new FormData();
        formData.append('csv_file', selectedFile.value);
        formData.append('type', 'import');
        formData.append('status', 'pending');
        const response = await productStore.createProductSetupImport(formData, importType);
        results.value = {
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
        showResults.value = true;
        toast.add({ severity: 'success', summary: 'Success', detail: successMessage, life: 3000 });
        // Reset the selected file
        switch (type) {
            case 'tags':
                selectedFileTags.value = null;
                break;
            case 'attributes':
                selectedFileAttributes.value = null;
                break;
        }
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

const clearTagsResults = () => {
    tagsImportResults.value = null;
    showTagsResults.value = false;
};

const clearAttributesResults = () => {
    attributesImportResults.value = null;
    showAttributesResults.value = false;
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
        <TabView v-model:activeIndex="activeTab" class="import-tabs">
            <!-- Tag Setup Tab -->
            <TabPanel header="">
                <template #header>
                    <div class="flex items-center gap-2">
                        <i class="pi pi-tag"></i> <i class="pi pi-sitemap"></i>
                        <span>Tags & Categories</span>
                    </div>
                </template>
                <!-- Tag Setup Import Section -->
                <div class="bg-white rounded-lg p-6 shadow-md">
                    <h2 class="text-xl font-semibold mb-2">Import Tags or Categories CSV data</h2>
                    <p class="text-gray-600 mb-4">Upload a CSV file to start importing tag or category data</p>
                    <div class="flex flex-col gap-4">
                        <FileUpload mode="basic" name="importTagsFile" accept=".csv" :maxFileSize="1000000"
                            @select="(e) => handleFileSelect(e, 'tags')" :auto="false" chooseLabel="Select CSV File" />
                        <div v-if="selectedFileTags" class="flex flex-col gap-4">
                            <div class="flex items-center gap-2 p-3 bg-gray-50 rounded">
                                <i class="pi pi-file text-gray-500"></i>
                                <span class="text-gray-700">{{ selectedFileTags.name }}</span>
                            </div>
                            <div v-if="isSavingTags" class="w-full">
                                <ProgressBar mode="indeterminate" style="height: 8px" class="w-full" />
                                <p class="text-sm text-gray-600 mt-2 text-center">Importing tag or category data...</p>
                            </div>
                            <Button icon="pi pi-save" :label="isSavingTags ? 'Saving...' : 'Import Tags'"
                                severity="success" @click="() => handleSave('tags')" :loading="isSavingTags"
                                :disabled="isSavingTags" class="p-button-md" />
                        </div>
                    </div>
                </div>
                <!-- Tag Import Results Section -->
                <div v-if="showTagsResults && tagsImportResults" class="bg-white rounded-lg p-6 shadow-md">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-xl font-semibold">Tag or Category Import Results</h2>
                        <Button icon="pi pi-times" label="Clear Results" severity="secondary" outlined
                            @click="clearTagsResults" />
                    </div>
                    <!-- Summary Statistics -->
                    <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                        <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <div class="text-2xl font-bold text-blue-600">{{ tagsImportResults?.success?.total_records
                                || 0 }}</div>
                            <div class="text-sm text-blue-800">Total Records</div>
                        </div>
                        <div class="bg-green-50 p-4 rounded-lg border border-green-200">
                            <div class="text-2xl font-bold text-green-600">{{ tagsImportResults?.success?.valid_records
                                || 0 }}</div>
                            <div class="text-sm text-green-800">Valid Records</div>
                        </div>
                        <div class="bg-red-50 p-4 rounded-lg border border-red-200">
                            <div class="text-2xl font-bold text-red-600">{{ tagsImportResults?.success?.invalid_records
                                || 0 }}</div>
                            <div class="text-sm text-red-800">Invalid Records</div>
                        </div>
                        <div class="bg-orange-50 p-4 rounded-lg border border-orange-200">
                            <div class="text-2xl font-bold text-orange-600">{{
                                tagsImportResults?.success?.updated_records || 0 }}</div>
                            <div class="text-sm text-orange-800">Updated Records</div>
                        </div>
                        <div class="bg-purple-50 p-4 rounded-lg border border-purple-200">
                            <div class="text-2xl font-bold text-purple-600">{{
                                tagsImportResults?.success?.inserted_count || 0 }}</div>
                            <div class="text-sm text-purple-800">Inserted Records</div>
                        </div>
                    </div>
                    <!-- Invalid Records DataTable -->
                    <div v-if="tagsImportResults?.success?.invalid_records > 0 && tagsImportResults?.success?.invalid_data"
                        class="mb-6">
                        <h3 class="text-lg font-semibold mb-4 text-red-700">Invalid Records ({{
                            tagsImportResults.success.invalid_records }})</h3>
                        <DataTable v-model:filters="filters" :value="tagsImportResults.success.invalid_data" paginator
                            :rows="10" dataKey="row" filterDisplay="menu" class="th-table">
                            <template #header>
                                <div class="flex justify-between items-center">
                                    <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined
                                        @click="clearFilter()" />
                                    <InputText v-model="filters['global'].value"
                                        placeholder="Search invalid tag records..." />
                                </div>
                            </template>
                            <template #empty> No invalid tag records found. </template>
                            <Column field="row" header="Row" style="min-width: 6rem">
                                <template #body="{ data }">
                                    {{ data.row }}
                                </template>
                            </Column>
                            <Column field="data.tag_name" header="Tag Name" style="min-width: 10rem">
                                <template #body="{ data }">
                                    {{ data.data.tag_name }}
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
                    <!-- Valid Records DataTable -->
                    <div v-if="tagsImportResults?.success?.valid_records > 0 && tagsImportResults?.success?.valid_data">
                        <h3 class="text-lg font-semibold mb-4 text-green-700">Valid Records ({{
                            tagsImportResults.success.valid_records
                            }})</h3>
                        <DataTable v-model:filters="filters" :value="tagsImportResults.success.valid_data" paginator
                            :rows="10" dataKey="tag_id" filterDisplay="menu" class="th-table">
                            <template #header>
                                <div class="flex justify-between items-center">
                                    <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined
                                        @click="clearFilter()" />
                                    <InputText v-model="filters['global'].value"
                                        placeholder="Search valid tag records..." />
                                </div>
                            </template>
                            <template #empty> No valid tag or category records found. </template>
                            <Column field="tag_name" header="Tag Name" style="min-width: 10rem" />
                        </DataTable>
                    </div>
                </div>
            </TabPanel>

            <!-- Attribute Setup Tab -->
            <TabPanel header="">
                <template #header>
                    <div class="flex items-center gap-2">
                        <i class="pi pi-sliders-h"></i>
                        <span>Attribute Setup</span>
                    </div>
                </template>
                <!-- Attribute Setup Import Section -->
                <div class="bg-white rounded-lg p-6 shadow-md">
                    <h2 class="text-xl font-semibold mb-2">Import Attribute CSV data</h2>
                    <p class="text-gray-600 mb-4">Upload a CSV file to start importing attribute data</p>
                    <div class="flex flex-col gap-4">
                        <FileUpload mode="basic" name="importAttributesFile" accept=".csv" :maxFileSize="1000000"
                            @select="(e) => handleFileSelect(e, 'attributes')" :auto="false"
                            chooseLabel="Select CSV File" />
                        <div v-if="selectedFileAttributes" class="flex flex-col gap-4">
                            <div class="flex items-center gap-2 p-3 bg-gray-50 rounded">
                                <i class="pi pi-file text-gray-500"></i>
                                <span class="text-gray-700">{{ selectedFileAttributes.name }}</span>
                            </div>
                            <div v-if="isSavingAttributes" class="w-full">
                                <ProgressBar mode="indeterminate" style="height: 8px" class="w-full" />
                                <p class="text-sm text-gray-600 mt-2 text-center">Importing attribute data...</p>
                            </div>
                            <Button icon="pi pi-save" :label="isSavingAttributes ? 'Saving...' : 'Import Attributes'"
                                severity="success" @click="() => handleSave('attributes')" :loading="isSavingAttributes"
                                :disabled="isSavingAttributes" class="p-button-md" />
                        </div>
                    </div>
                </div>
                <!-- Attribute Import Results Section -->
                <div v-if="showAttributesResults && attributesImportResults" class="bg-white rounded-lg p-6 shadow-md">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-xl font-semibold">Attribute Import Results</h2>
                        <Button icon="pi pi-times" label="Clear Results" severity="secondary" outlined
                            @click="clearAttributesResults" />
                    </div>
                    <!-- Summary Statistics -->
                    <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                        <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <div class="text-2xl font-bold text-blue-600">{{
                                attributesImportResults?.success?.total_records || 0 }}
                            </div>
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
                                attributesImportResults?.success?.updated_records ||
                                0 }}</div>
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
                            attributesImportResults.success.invalid_records }})</h3>
                        <DataTable v-model:filters="filters" :value="attributesImportResults.success.invalid_data"
                            paginator :rows="10" dataKey="row" filterDisplay="menu" class="th-table">
                            <template #header>
                                <div class="flex justify-between items-center">
                                    <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined
                                        @click="clearFilter()" />
                                    <InputText v-model="filters['global'].value"
                                        placeholder="Search invalid attribute records..." />
                                </div>
                            </template>
                            <template #empty> No invalid attribute records found. </template>
                            <Column field="row" header="Row" style="min-width: 6rem">
                                <template #body="{ data }">
                                    {{ data.row }}
                                </template>
                            </Column>
                            <Column field="data.attribute_name" header="Attribute Name" style="min-width: 10rem">
                                <template #body="{ data }">
                                    {{ data.data.attribute_name }}
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
                    <!-- Valid Records DataTable -->
                    <div
                        v-if="attributesImportResults?.success?.valid_records > 0 && attributesImportResults?.success?.valid_data">
                        <h3 class="text-lg font-semibold mb-4 text-green-700">Valid Records ({{
                            attributesImportResults.success.valid_records }})</h3>
                        <DataTable v-model:filters="filters" :value="attributesImportResults.success.valid_data"
                            paginator :rows="10" dataKey="attribute_id" filterDisplay="menu" class="th-table">
                            <template #header>
                                <div class="flex justify-between items-center">
                                    <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined
                                        @click="clearFilter()" />
                                    <InputText v-model="filters['global'].value"
                                        placeholder="Search valid attribute records..." />
                                </div>
                            </template>
                            <template #empty> No valid attribute records found. </template>
                            <Column field="attribute_name" header="Attribute Name" style="min-width: 10rem" />
                        </DataTable>
                    </div>
                </div>
            </TabPanel>
        </TabView>
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
