<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCategoryStore } from '@/stores/category';
import { useToast } from 'primevue/usetoast';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import FileUpload from 'primevue/fileupload';
import ProgressBar from 'primevue/progressbar';

const toast = useToast();
const categoryStore = useCategoryStore();
const selectedFileCategories = ref(null);
const isSavingCategories = ref(false);

// Import results data
const categoriesImportResults = ref(null);
const showCategoriesResults = ref(false);

// Filters for datatables
const filters = ref({
    global: { value: null, matchMode: 'contains' }
});

const handleFileSelectCategories = (event) => {
    const file = event.files[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Please select a CSV file', life: 3000 });
        return;
    }

    selectedFileCategories.value = file;
};

const handleSaveCategories = async () => {
    if (!selectedFileCategories.value) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Please select a file first', life: 3000 });
        return;
    }

    isSavingCategories.value = true;
    try {
        const formData = new FormData();
        formData.append('csv_file', selectedFileCategories.value);
        formData.append('type', 'import');
        formData.append('status', 'pending');

        const response = await categoryStore.createCategoryImport(formData);
        
        // Store the import results
        categoriesImportResults.value = response;
        showCategoriesResults.value = true;
        
        toast.add({ severity: 'success', summary: 'Success', detail: 'Categories imported successfully', life: 3000 });
        selectedFileCategories.value = null;
    } catch (error) {
        console.error('Save error:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: error.message || 'Failed to save file', life: 3000 });
    } finally {
        isSavingCategories.value = false;
    }
};

const clearFilter = () => {
    filters.value.global.value = null;
};

const clearCategoriesResults = () => {
    categoriesImportResults.value = null;
    showCategoriesResults.value = false;
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
        <!-- Categories Import Section -->
        <div class="bg-white rounded-lg p-6 shadow-md">
            <h2 class="text-xl font-semibold mb-2">Import Category CSV data</h2>
            <p class="text-gray-600 mb-4">Upload a CSV file to start importing categories and sub-categories data</p>
            
            <div class="flex flex-col gap-4">
                <FileUpload 
                    mode="basic" 
                    name="importCategoriesFile" 
                    accept=".csv" 
                    :maxFileSize="1000000" 
                    @select="handleFileSelectCategories" 
                    :auto="false" 
                    chooseLabel="Select CSV File"
                />

                <!-- Selected file info and Save button -->
                <div v-if="selectedFileCategories" class="flex flex-col gap-4">
                    <div class="flex items-center gap-2 p-3 bg-gray-50 rounded">
                        <i class="pi pi-file text-gray-500"></i>
                        <span class="text-gray-700">{{ selectedFileCategories.name }}</span>
                    </div>

                    <!-- Progress Bar -->
                    <div v-if="isSavingCategories" class="w-full">
                        <ProgressBar 
                            mode="indeterminate" 
                            style="height: 8px" 
                            class="w-full"
                        />
                        <p class="text-sm text-gray-600 mt-2 text-center">Importing categories data...</p>
                    </div>

                    <Button 
                        icon="pi pi-save"
                        :label="isSavingCategories ? 'Saving...' : 'Import Categories'"
                        severity="success"
                        @click="handleSaveCategories"
                        :loading="isSavingCategories"
                        :disabled="isSavingCategories"
                        class="p-button-md"
                    />
                </div>
            </div>
        </div>

        <!-- Categories Import Results Section -->
        <div v-if="showCategoriesResults && categoriesImportResults" class="bg-white rounded-lg p-6 shadow-md">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-semibold">Categories Import Results</h2>
                <Button 
                    icon="pi pi-times" 
                    label="Clear Results" 
                    severity="secondary" 
                    outlined 
                    @click="clearCategoriesResults"
                />
            </div>

            <!-- Summary Statistics -->
            <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div class="text-2xl font-bold text-blue-600">{{ categoriesImportResults?.success?.total_valid_records || 0 }}</div>
                    <div class="text-sm text-blue-800">Total Records</div>
                </div>
                <div class="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div class="text-2xl font-bold text-green-600">{{ categoriesImportResults?.success?.valid_records || 0 }}</div>
                    <div class="text-sm text-green-800">Valid Records</div>
                </div>
                <div class="bg-red-50 p-4 rounded-lg border border-red-200">
                    <div class="text-2xl font-bold text-red-600">{{ categoriesImportResults?.success?.invalid_records || 0 }}</div>
                    <div class="text-sm text-red-800">Invalid Records</div>
                </div>
                <div class="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <div class="text-2xl font-bold text-orange-600">{{ categoriesImportResults?.success?.updated_records || 0 }}</div>
                    <div class="text-sm text-orange-800">Updated Records</div>
                </div>
                <div class="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <div class="text-2xl font-bold text-purple-600">{{ categoriesImportResults?.success?.total_valid_records || 0 }}</div>
                    <div class="text-sm text-purple-800">Inserted Records</div>
                </div>
            </div>

            <!-- Categories Section -->
            <div v-if="categoriesImportResults?.success?.categories" class="mb-8">
                <!-- <h3 class="text-lg font-semibold mb-4 text-blue-700">Categories ({{ categoriesImportResults.success.categories.length }})</h3> -->
                
                <!-- Invalid Categories -->
                <div v-if="categoriesImportResults.success.categories.invalid_data && categoriesImportResults.success.categories.invalid_data.length > 0" class="mb-6">
                    <h4 class="text-md font-semibold mb-3 text-red-600">Invalid Categories ({{ categoriesImportResults.success.categories.invalid_data.length }})</h4>
                    <DataTable
                        v-model:filters="filters"
                        :value="categoriesImportResults.success.categories.invalid_data"
                        paginator
                        :rows="10"
                        dataKey="row"
                        filterDisplay="menu"
                        :globalFilterFields="['data.category_name', 'data.category_link', 'data.meta_keywords']"
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
                                <InputText v-model="filters['global'].value" placeholder="Search invalid categories..." />
                            </div>
                        </template>
                        <template #empty> No invalid categories found. </template>

                        <Column field="row" header="Row" style="min-width: 6rem">
                            <template #body="{ data }">
                                {{ data.row }}
                            </template>
                        </Column>

                        <Column field="data.category_name" header="Name" style="min-width: 15rem">
                            <template #body="{ data }">
                                {{ data.data.category_name }}
                            </template>
                        </Column>

                        <Column field="data.label" header="Label" style="min-width: 15rem">
                            <template #body="{ data }">
                                {{ data.data.label }}
                            </template>
                        </Column>

                        <Column field="data.category_link" header="Link" style="min-width: 15rem">
                            <template #body="{ data }">
                                {{ data.data.category_link }}
                            </template>
                        </Column>

                        <Column field="data.meta_keywords" header="Meta Keywords" style="min-width: 20rem">
                            <template #body="{ data }">
                                {{ data.data.meta_keywords }}
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

                <!-- Valid Categories -->
                <div v-if="categoriesImportResults.success.categories.valid_data && categoriesImportResults.success.categories.valid_data.length > 0">
                    <h4 class="text-md font-semibold mb-3 text-green-600">Valid Categories ({{ categoriesImportResults.success.categories.valid_data.length }})</h4>
                    <DataTable
                        v-model:filters="filters"
                        :value="categoriesImportResults.success.categories.valid_data"
                        paginator
                        :rows="10"
                        dataKey="category_id"
                        filterDisplay="menu"
                        :globalFilterFields="['category_name', 'category_link', 'meta_keywords']"
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
                                <InputText v-model="filters['global'].value" placeholder="Search valid categories..." />
                            </div>
                        </template>
                        <template #empty> No valid categories found. </template>

                        <Column field="category_name" header="Name" style="min-width: 15rem" />
                        <Column field="label" header="Label" style="min-width: 15rem" />
                        <Column field="category_link" header="Link" style="min-width: 15rem" />
                        <Column field="meta_keywords" header="Meta Keywords" style="min-width: 20rem" />
                    </DataTable>
                </div>
            </div>

            <!-- Sub-Categories Section -->
            <div v-if="categoriesImportResults?.success?.sub_categories">
                <h3 class="text-lg font-semibold mb-4 text-indigo-700">Sub-Categories ({{ categoriesImportResults.success.sub_categories.length }})</h3>
                
                <!-- Invalid Sub-Categories -->
                <div v-if="categoriesImportResults.success.sub_categories.invalid_data && categoriesImportResults.success.sub_categories.invalid_data.length > 0" class="mb-6">
                    <h4 class="text-md font-semibold mb-3 text-red-600">Invalid Sub-Categories ({{ categoriesImportResults.success.sub_categories.invalid_data.length }})</h4>
                    <DataTable
                        v-model:filters="filters"
                        :value="categoriesImportResults.success.sub_categories.invalid_data"
                        paginator
                        :rows="10"
                        dataKey="row"
                        filterDisplay="menu"
                        :globalFilterFields="['data.category_name', 'data.sub_category_link', 'data.parent_category_id', 'data.meta_keywords']"
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
                                <InputText v-model="filters['global'].value" placeholder="Search invalid sub-categories..." />
                            </div>
                        </template>
                        <template #empty> No invalid sub-categories found. </template>

                        <Column field="row" header="Row" style="min-width: 6rem">
                            <template #body="{ data }">
                                {{ data.row }}
                            </template>
                        </Column>

                        <Column field="data.sub_category_name" header="Name" style="min-width: 15rem">
                            <template #body="{ data }">
                                {{ data.data.sub_category_name }}
                            </template>
                        </Column>

                        <Column field="data.label" header="Label" style="min-width: 15rem">
                            <template #body="{ data }">
                                {{ data.data.label }}
                            </template>
                        </Column>

                        <Column field="data.sub_category_link" header="Link" style="min-width: 15rem">
                            <template #body="{ data }">
                                {{ data.data.sub_category_link }}
                            </template>
                        </Column>

                        <Column field="data.parent_category_id" header="Parent ID" style="min-width: 10rem">
                            <template #body="{ data }">
                                {{ data.data.parent_category_id }}
                            </template>
                        </Column>

                        <Column field="data.meta_keywords" header="Meta Keywords" style="min-width: 20rem">
                            <template #body="{ data }">
                                {{ data.data.meta_keywords }}
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

                <!-- Valid Sub-Categories -->
                <div v-if="categoriesImportResults.success.sub_categories.valid_data && categoriesImportResults.success.sub_categories.valid_data.length > 0">
                    <h4 class="text-md font-semibold mb-3 text-green-600">Valid Sub-Categories ({{ categoriesImportResults.success.sub_categories.valid_data.length }})</h4>
                    <DataTable
                        v-model:filters="filters"
                        :value="categoriesImportResults.success.sub_categories.valid_data"
                        paginator
                        :rows="10"
                        dataKey="sub_category_id"
                        filterDisplay="menu"
                        :globalFilterFields="['category_name', 'sub_category_link', 'parent_category_id', 'meta_keywords']"
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
                                <InputText v-model="filters['global'].value" placeholder="Search valid sub-categories..." />
                            </div>
                        </template>
                        <template #empty> No valid sub-categories found. </template>

                        <Column field="category_name" header="Name" style="min-width: 15rem" />
                        <Column field="label" header="Label" style="min-width: 15rem" />
                        <Column field="sub_category_link" header="Link" style="min-width: 15rem" />
                        <Column field="parent_category_id" header="Parent ID" style="min-width: 10rem" />
                        <Column field="meta_keywords" header="Meta Keywords" style="min-width: 20rem" />
                    </DataTable>
                </div>
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
