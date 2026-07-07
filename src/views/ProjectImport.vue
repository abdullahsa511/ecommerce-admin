<script setup>
import { formatImportImageData } from '@/utils/mediaUrl';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useProjectImportStore } from '../stores/projectImport';
import { useToast } from 'primevue/usetoast';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import FileUpload from 'primevue/fileupload';
import ProgressBar from 'primevue/progressbar';
import axios from 'axios';

const toast = useToast();
const projectImportStore = useProjectImportStore();
const selectedFile = ref(null);
const isSaving = ref(false);
const selectedFileImage = ref(null);
const isSavingImage = ref(false);

// Import results data
const importResults = ref(null);
const showResults = ref(false);
const imageImportResults = ref(null);
const showImageResults = ref(false);

// Filters for datatables
const filters = ref({
    global: { value: null, matchMode: 'contains' }
});

const handleFileSelect = (event) => {
    const file = event.files[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Please select a CSV file', life: 3000 });
        return;
    }

    selectedFile.value = file;
};

const handleFileSelectImage = (event) => {
    const file = event.files[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Please select a CSV file', life: 3000 });
        return;
    }

    selectedFileImage.value = file;
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
        formData.append('type', 'import');
        formData.append('status', 'Published');

        const response = await projectImportStore.createProjectImport(formData);
        
        // Store the import results
        importResults.value = response;
        showResults.value = true;
        
        // Check if data is nested under success property
        if (importResults.value && importResults.value.success) {
        } else {
            console.log('No success property found');
        }
        
        toast.add({ severity: 'success', summary: 'Success', detail: 'File imported successfully', life: 3000 });
        selectedFile.value = null;
    } catch (error) {
        console.error('Save error:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: error.message || 'Failed to save file', life: 3000 });
    } finally {
        isSaving.value = false;
    }
};

const handleSaveImage = async () => {
    if (!selectedFileImage.value) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Please select a file first', life: 3000 });
        return;
    }

    isSavingImage.value = true;
    try {
        const formData = new FormData();
        formData.append('csv_file', selectedFileImage.value);
        formData.append('type', 'import');
        formData.append('status', 'Published');

        const response = await projectImportStore.createProjectImageImport(formData);

        // Store the image import results
        imageImportResults.value = response;
        showImageResults.value = true;
        
        
        toast.add({ severity: 'success', summary: 'Success', detail: 'File saved successfully', life: 3000 });
        selectedFileImage.value = null;
    } catch (error) {
        console.error('Save error:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: error.message || 'Failed to save file', life: 3000 });
    } finally {
        isSavingImage.value = false;
    }
};

const clearFilter = () => {
    filters.value.global.value = null;
};

const clearResults = () => {
    importResults.value = null;
    showResults.value = false;
};

const clearImageResults = () => {
    imageImportResults.value = null;
    showImageResults.value = false;
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
    <div class="flex flex-col gap-8">
        <!-- Local Import Section -->
        <div class="bg-white rounded-lg p-6 shadow-md">
            <h2 class="text-xl font-semibold mb-2">Import Project CSV data</h2>
            <p class="text-gray-600 mb-4">Upload a CSV file to start importing project data</p>
            
            <div class="flex flex-col gap-4">
                <FileUpload 
                    mode="basic" 
                    name="importFile" 
                    accept=".csv" 
                    :maxFileSize="1000000" 
                    @select="handleFileSelect" 
                    :auto="false" 
                    chooseLabel="Select CSV File"
                />

                <!-- Selected file info and Save button -->
                <div v-if="selectedFile" class="flex flex-col gap-4">
                    <div class="flex items-center gap-2 p-3 bg-gray-50 rounded">
                        <i class="pi pi-file text-gray-500"></i>
                        <span class="text-gray-700">{{ selectedFile.name }}</span>
                    </div>

                    <!-- Progress Bar -->
                    <div v-if="isSaving" class="w-full">
                        <ProgressBar 
                            mode="indeterminate" 
                            style="height: 8px" 
                            class="w-full"
                        />
                        <p class="text-sm text-gray-600 mt-2 text-center">Importing project data...</p>
                    </div>

                    <Button 
                        icon="pi pi-save"
                        :label="isSaving ? 'Saving...' : 'Import'"
                        severity="success"
                        @click="handleSave"
                        :loading="isSaving"
                        :disabled="isSaving"
                        class="p-button-md"
                    />
                </div>
            </div>
        </div>

        <div class="bg-white rounded-lg p-6 shadow-md">
            <h2 class="text-xl font-semibold mb-2">Import Project Image CSV data</h2>
            <p class="text-gray-600 mb-4">Upload a CSV file to start importing project image data</p>
            
            <div class="flex flex-col gap-4">
                <FileUpload 
                    mode="basic" 
                    name="importFile" 
                    accept=".csv" 
                    :maxFileSize="1000000" 
                    @select="handleFileSelectImage" 
                    :auto="false" 
                    chooseLabel="Select CSV File"
                />

                <!-- Selected file info and Save button -->
                <div v-if="selectedFileImage" class="flex flex-col gap-4">
                    <div class="flex items-center gap-2 p-3 bg-gray-50 rounded">
                        <i class="pi pi-file text-gray-500"></i>
                        <span class="text-gray-700">{{ selectedFileImage.name }}</span>
                    </div>

                    <!-- Progress Bar -->
                    <div v-if="isSavingImage" class="w-full">
                        <ProgressBar 
                            mode="indeterminate" 
                            style="height: 8px" 
                            class="w-full"
                        />
                        <p class="text-sm text-gray-600 mt-2 text-center">Importing project image data...</p>
                    </div>

                    <Button 
                        icon="pi pi-save"
                        :label="isSavingImage ? 'Saving...' : 'Import'"
                        severity="success"
                        @click="handleSaveImage"
                        :loading="isSavingImage"
                        :disabled="isSavingImage"
                        class="p-button-md"
                    />
                </div>
            </div>
        </div>

        <!-- Import Results Section -->
        <div v-if="showResults && importResults" class="bg-white rounded-lg p-6 shadow-md">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-semibold">Import Results</h2>
                <Button 
                    icon="pi pi-times" 
                    label="Clear Results" 
                    severity="secondary" 
                    outlined 
                    @click="clearResults"
                />
            </div>

            <!-- Summary Statistics -->
            <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div class="text-2xl font-bold text-blue-600">{{ importResults?.success?.total_records || 0 }}</div>
                    <div class="text-sm text-blue-800">Total Records</div>
                </div>
                <div class="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div class="text-2xl font-bold text-green-600">{{ importResults?.success?.valid_records || 0 }}</div>
                    <div class="text-sm text-green-800">Valid Records</div>
                </div>
                <div class="bg-red-50 p-4 rounded-lg border border-red-200">
                    <div class="text-2xl font-bold text-red-600">{{ importResults?.success?.invalid_records || 0 }}</div>
                    <div class="text-sm text-red-800">Invalid Records</div>
                </div>
                <div class="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <div class="text-2xl font-bold text-orange-600">{{ importResults?.success?.updated_records || 0 }}</div>
                    <div class="text-sm text-orange-800">Updated Records</div>
                </div>
                <div class="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <div class="text-2xl font-bold text-purple-600">{{ importResults?.success?.inserted_count || 0 }}</div>
                    <div class="text-sm text-purple-800">Inserted Records</div>
                </div>
            </div>

            <!-- Invalid Records DataTable -->
            <div v-if="importResults?.success?.invalid_records > 0 && importResults?.success?.invalid_data" class="mb-6">
                <h3 class="text-lg font-semibold mb-4 text-red-700">Invalid Records ({{ importResults.success.invalid_records }})</h3>
                <DataTable
                    v-model:filters="filters"
                    :value="importResults.success.invalid_data"
                    paginator
                    :rows="10"
                    dataKey="row"
                    filterDisplay="menu"
                    :globalFilterFields="['data.project_id', 'data.title', 'data.name', 'data.slug']"
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
                            <InputText v-model="filters['global'].value" placeholder="Search invalid records..." />
                        </div>
                    </template>
                    <template #empty> No invalid records found. </template>

                    <!-- <Column field="row" header="Row" style="min-width: 6rem">
                        <template #body="{ data }">
                            {{ data.row }}
                        </template>
                    </Column> -->

                    <Column field="data.project_id" header="Project ID" style="min-width: 8rem">
                        <template #body="{ data }">
                            {{ data.data.project_id }}
                        </template>
                    </Column>

                    <Column field="data.title" header="Title" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ data.data.title }}
                        </template>
                    </Column>

                    <Column field="data.slug" header="Slug" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ data.data.slug }}
                        </template>
                    </Column>

                    <Column field="data.meta_title" header="Meta Title" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ data.data.meta_title }}
                        </template>
                    </Column>

                    <Column field="data.keyline_quote" header="Keyline Quote" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ data.data.keyline_quote }}
                        </template>
                    </Column>

                    <Column field="data.label" header="Label" style="min-width: 10rem">
                        <template #body="{ data }">
                            {{ data.data.label }}
                        </template>
                    </Column>

                    <Column field="data.image" header="Image" style="min-width: 10rem">
                        <template #body="{ data }">
                            {{ formatImageData(data.data.image) }}
                        </template>
                    </Column>

                    <Column field="data.status_id" header="Status" style="min-width: 10rem">
                        <template #body="{ data }">
                            {{ data.data.status_id }}
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
            <div v-if="importResults?.success?.updated_records > 0 && importResults?.success?.updated_data" class="mb-6">
                <h3 class="text-lg font-semibold mb-4 text-orange-700">Updated Records ({{ importResults.success.updated_records }})</h3>
                <DataTable
                    v-model:filters="filters"
                    :value="importResults.success.updated_data"
                    paginator
                    :rows="10"
                    dataKey="project_id"
                    filterDisplay="menu"
                    :globalFilterFields="['project_id', 'title', 'name', 'slug']"
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
                            <InputText v-model="filters['global'].value" placeholder="Search updated records..." />
                        </div>
                    </template>
                    <template #empty> No updated records found. </template>

                    <Column field="project_id" header="Project ID" style="min-width: 8rem" />
                    
                    <Column field="title" header="Title" style="min-width: 12rem" />
                    
                    <Column field="name" header="Name" style="min-width: 12rem" />
                    
                    <Column field="slug" header="Slug" style="min-width: 12rem" />
                    
                    <Column field="meta_title" header="Meta Title" style="min-width: 12rem" />
                    
                    <Column field="keyline_quote" header="Keyline Quote" style="min-width: 12rem" />
                    
                    <Column field="label" header="Label" style="min-width: 10rem" />
                    
                    <Column field="image" header="Image" style="min-width: 10rem">
                        <template #body="{ data }">
                            {{ formatImageData(data.image) }}
                        </template>
                    </Column>
                    <Column field="status_id" header="Status" style="min-width: 10rem" />
                </DataTable>
            </div>

            <!-- Valid Records DataTable -->
            <div v-if="importResults?.success?.valid_records > 0 && importResults?.success?.valid_data">
                <h3 class="text-lg font-semibold mb-4 text-green-700">Valid Records ({{ importResults.success.valid_records }})</h3>
                <DataTable
                    v-model:filters="filters"
                    :value="importResults.success.valid_data"
                    paginator
                    :rows="10"
                    dataKey="project_id"
                    filterDisplay="menu"
                    :globalFilterFields="['project_id', 'title', 'name', 'slug']"
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
                            <InputText v-model="filters['global'].value" placeholder="Search valid records..." />
                        </div>
                    </template>
                    <template #empty> No valid records found. </template>

                    <Column field="project_id" header="Project ID" style="min-width: 8rem" />
                    
                    <Column field="title" header="Title" style="min-width: 12rem" />
                    
                    <Column field="name" header="Name" style="min-width: 12rem" />
                    
                    <Column field="slug" header="Slug" style="min-width: 12rem" />
                    
                    <Column field="meta_title" header="Meta Title" style="min-width: 12rem" />
                    
                    <Column field="keyline_quote" header="Keyline Quote" style="min-width: 12rem" />
                    
                    <Column field="label" header="Label" style="min-width: 10rem" />
                    
                    <Column field="image" header="Image" style="min-width: 10rem">
                        <template #body="{ data }">
                            {{ formatImageData(data.image) }}
                        </template>
                    </Column>
                    <Column field="status_id" header="Status" style="min-width: 10rem" />
                </DataTable>
            </div>
        </div>

        <!-- Image Import Results Section -->
        <div v-if="showImageResults && imageImportResults" class="bg-white rounded-lg p-6 shadow-md">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-semibold">Image Import Results</h2>
                <Button 
                    icon="pi pi-times" 
                    label="Clear Results" 
                    severity="secondary" 
                    outlined 
                    @click="clearImageResults"
                />
            </div>

            <!-- Summary Statistics -->
            <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div class="text-2xl font-bold text-blue-600">{{ imageImportResults?.success?.total_records || 0 }}</div>
                    <div class="text-sm text-blue-800">Total Records</div>
                </div>
                <div class="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div class="text-2xl font-bold text-green-600">{{ imageImportResults?.success?.valid_records || 0 }}</div>
                    <div class="text-sm text-green-800">Valid Records</div>
                </div>
                <div class="bg-red-50 p-4 rounded-lg border border-red-200">
                    <div class="text-2xl font-bold text-red-600">{{ imageImportResults?.success?.invalid_records || 0 }}</div>
                    <div class="text-sm text-red-800">Invalid Records</div>
                </div>
                <div class="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <div class="text-2xl font-bold text-orange-600">{{ imageImportResults?.success?.updated_records || 0 }}</div>
                    <div class="text-sm text-orange-800">Updated Records</div>
                </div>
                <div class="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <div class="text-2xl font-bold text-purple-600">{{ imageImportResults?.success?.inserted_count || 0 }}</div>
                    <div class="text-sm text-purple-800">Inserted Records</div>
                </div>
            </div>

            <!-- Invalid Records DataTable -->
            <div v-if="imageImportResults?.success?.invalid_records > 0 && imageImportResults?.success?.invalid_data" class="mb-6">
                <h3 class="text-lg font-semibold mb-4 text-red-700">Invalid Records ({{ imageImportResults.success.invalid_records }})</h3>
                <DataTable
                    v-model:filters="filters"
                    :value="imageImportResults.success.invalid_data"
                    paginator
                    :rows="10"
                    dataKey="row"
                    filterDisplay="menu"
                    :globalFilterFields="['data.project_id', 'data.image_link', 'data.sort_order']"
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
                            <InputText v-model="filters['global'].value" placeholder="Search invalid image records..." />
                        </div>
                    </template>
                    <template #empty> No invalid image records found. </template>

                    <Column field="row" header="Row" style="min-width: 6rem">
                        <template #body="{ data }">
                            {{ data.row }}
                        </template>
                    </Column>

                    <Column field="data.project_id" header="Project ID" style="min-width: 8rem">
                        <template #body="{ data }">
                            {{ data.data.project_id }}
                        </template>
                    </Column>

                    <Column field="data.image_link" header="Image Link" style="min-width: 15rem">
                        <template #body="{ data }">
                            {{ data.data.image_link }}
                        </template>
                    </Column>

                    <Column field="data.image" header="Image Data" style="min-width: 15rem">
                        <template #body="{ data }">
                            {{ formatImageData(data.data.image) }}
                        </template>
                    </Column>

                    <Column field="data.sort_order" header="Sort Order" style="min-width: 8rem">
                        <template #body="{ data }">
                            {{ data.data.sort_order }}
                        </template>
                    </Column>

                    <Column field="data.status" header="Status" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ data.data.status }}
                        </template>
                    </Column>

                    <Column field="errors" header="Errors" style="min-width: 20rem">
                        <template #body="{ data }">
                            <div class="text-red-600 text-sm">
                                {{ formatErrors(data.errors) }}
                            </div>
                        </template>
                    </Column>
                </DataTable>
            </div>

            <!-- Updated Records DataTable -->
            <div v-if="imageImportResults?.success?.updated_records > 0 && imageImportResults?.success?.updated_data" class="mb-6">
                <h3 class="text-lg font-semibold mb-4 text-orange-700">Updated Records ({{ imageImportResults.success.updated_records }})</h3>
                <DataTable
                    v-model:filters="filters"
                    :value="imageImportResults.success.updated_data"
                    paginator
                    :rows="10"
                    dataKey="row"
                    filterDisplay="menu"
                    :globalFilterFields="['project_id', 'image_link', 'sort_order']"
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
                            <InputText v-model="filters['global'].value" placeholder="Search updated image records..." />
                        </div>
                    </template>
                    <template #empty> No updated image records found. </template>

                    <Column field="row" header="Row" style="min-width: 6rem">
                        <template #body="{ data }">
                            {{ data.row }}
                        </template>
                    </Column>

                    <Column field="project_id" header="Project ID" style="min-width: 8rem">
                        <template #body="{ data }">
                            {{ data.data.project_id }}
                        </template>
                    </Column>
                    
                    <Column field="image_link" header="Image Link" style="min-width: 15rem">
                        <template #body="{ data }">
                            {{ data.data.image_link }}
                        </template>
                    </Column>
                    
                    <Column field="image" header="Image Data" style="min-width: 15rem">
                        <template #body="{ data }">
                            {{ formatImageData(data.data.image) }}
                        </template>
                    </Column>
                    
                    <Column field="sort_order" header="Sort Order" style="min-width: 8rem">
                        <template #body="{ data }">
                            {{ data.data.sort_order }}
                        </template>
                    </Column>
                    
                    <Column field="status" header="Status" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ data.data.status }}
                        </template>
                    </Column>
                </DataTable>
            </div>

            <!-- Valid Records DataTable -->
            <div v-if="imageImportResults?.success?.valid_records > 0 && imageImportResults?.success?.valid_data">
                <h3 class="text-lg font-semibold mb-4 text-green-700">Valid Records ({{ imageImportResults.success.valid_records }})</h3>
                <DataTable
                    v-model:filters="filters"
                    :value="imageImportResults.success.valid_data"
                    paginator
                    :rows="10"
                    dataKey="row"
                    filterDisplay="menu"
                    :globalFilterFields="['project_id', 'image_link', 'sort_order']"
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
                            <InputText v-model="filters['global'].value" placeholder="Search valid image records..." />
                        </div>
                    </template>
                    <template #empty> No valid image records found. </template>

                    <Column field="project_id" header="Project ID" style="min-width: 8rem" />
                    
                    <Column field="image_link" header="Image Link" style="min-width: 15rem" />
                    
                    <Column field="image" header="Image Data" style="min-width: 15rem">
                        <template #body="{ data }">
                            {{ formatImageData(data.image) }}
                        </template>
                    </Column>
                    
                    <Column field="sort_order" header="Sort Order" style="min-width: 8rem" />
                    
                    <Column field="status" header="Status" style="min-width: 12rem" />
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