<script setup>
import { formatImportImageData } from '@/utils/mediaUrl';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { usePostStore } from '@/stores/post';
import { useToast } from 'primevue/usetoast';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import FileUpload from 'primevue/fileupload';
import ProgressBar from 'primevue/progressbar';
import axios from 'axios';

const toast = useToast();
const postStore = usePostStore();
const selectedFilePosts = ref(null);
const isSavingPosts = ref(false);
const selectedFilePostsImage = ref(null);
const isSavingPostsImage = ref(false);

// Import results data
const postsImportResults = ref(null);
const showPostsResults = ref(false);
const postsImageImportResults = ref(null);
const showPostsImageResults = ref(false);

// Filters for datatables
const filters = ref({
    global: { value: null, matchMode: 'contains' }
});

const handleFileSelectPosts = (event) => {
    const file = event.files[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Please select a CSV file', life: 3000 });
        return;
    }

    selectedFilePosts.value = file;
};

const handleFileSelectPostsImage = (event) => {
    const file = event.files[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Please select a CSV file', life: 3000 });
        return;
    }

    selectedFilePostsImage.value = file;
};

const handleSavePages = async () => {
    if (!selectedFilePosts.value) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Please select a file first', life: 3000 });
        return;
    }

    isSavingPosts.value = true;
    try {
        const formData = new FormData();
        formData.append('csv_file', selectedFilePosts.value);
        formData.append('type', 'import');
        formData.append('status', 'pending');

        const response = await postStore.createPageImport(formData);
        
        // Store the import results
        postsImportResults.value = response;
        showPostsResults.value = true;
        
        toast.add({ severity: 'success', summary: 'Success', detail: 'Posts imported successfully', life: 3000 });
        selectedFilePosts.value = null;
    } catch (error) {
        console.error('Save error:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: error.message || 'Failed to save file', life: 3000 });
    } finally {
        isSavingPosts.value = false;
    }
};

const handleSavePostsImage = async () => {
    if (!selectedFilePostsImage.value) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Please select a file first', life: 3000 });
        return;
    }

    isSavingPostsImage.value = true;
    try {
        const formData = new FormData();
        formData.append('csv_file', selectedFilePostsImage.value);
        formData.append('type', 'import');
        formData.append('status', 'pending');

        const response = await postStore.createPostImageImport(formData);

        // Store the import results
        postsImageImportResults.value = response;
        showPostsImageResults.value = true;

        toast.add({ severity: 'success', summary: 'Success', detail: 'Post images imported successfully', life: 3000 });
        selectedFilePostsImage.value = null;
    } catch (error) {
        console.error('Save error:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: error.message || 'Failed to save file', life: 3000 });
    } finally {
        isSavingPostsImage.value = false;
    }
};

const clearFilter = () => {
    filters.value.global.value = null;
};

const clearPostsResults = () => {
    postsImportResults.value = null;
    showPostsResults.value = false;
};

const clearPostsImageResults = () => {
    postsImageImportResults.value = null;
    showPostsImageResults.value = false;
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
        <!-- Posts Import Section -->
        <div class="bg-white rounded-lg p-6 shadow-md">
            <h2 class="text-xl font-semibold mb-2">Import Pages CSV data</h2>
            <p class="text-gray-600 mb-4">Upload a CSV file to start importing pages data</p>
            
            <div class="flex flex-col gap-4">
                <FileUpload 
                    mode="basic" 
                    name="importPostsFile" 
                    accept=".csv" 
                    :maxFileSize="1000000" 
                    @select="handleFileSelectPosts" 
                    :auto="false" 
                    chooseLabel="Select CSV File"
                />

                <!-- Selected file info and Save button -->
                <div v-if="selectedFilePosts" class="flex flex-col gap-4">
                    <div class="flex items-center gap-2 p-3 bg-gray-50 rounded">
                        <i class="pi pi-file text-gray-500"></i>
                        <span class="text-gray-700">{{ selectedFilePosts.name }}</span>
                    </div>

                    <!-- Progress Bar -->
                    <div v-if="isSavingPosts" class="w-full">
                        <ProgressBar 
                            mode="indeterminate" 
                            style="height: 8px" 
                            class="w-full"
                        />
                        <p class="text-sm text-gray-600 mt-2 text-center">Importing pages data...</p>
                    </div>

                    <Button 
                        icon="pi pi-save"
                        :label="isSavingPosts ? 'Saving...' : 'Import Pages'"
                        severity="success"
                        @click="handleSavePages"
                        :loading="isSavingPosts"
                        :disabled="isSavingPosts"
                        class="p-button-md"
                    />
                </div>
            </div>
        </div>

        <!-- Post Images Import Section -->
        <div class="bg-white rounded-lg p-6 shadow-md">
            <h2 class="text-xl font-semibold mb-2">Import Page Images CSV data</h2>
            <p class="text-gray-600 mb-4">Upload a CSV file to start importing page image data</p>
            
            <div class="flex flex-col gap-4">
                <FileUpload 
                    mode="basic" 
                    name="importPostsImageFile" 
                    accept=".csv" 
                    :maxFileSize="1000000" 
                    @select="handleFileSelectPostsImage" 
                    :auto="false" 
                    chooseLabel="Select CSV File"
                />

                <!-- Selected file info and Save button -->
                <div v-if="selectedFilePostsImage" class="flex flex-col gap-4">
                    <div class="flex items-center gap-2 p-3 bg-gray-50 rounded">
                        <i class="pi pi-file text-gray-500"></i>
                        <span class="text-gray-700">{{ selectedFilePostsImage.name }}</span>
                    </div>

                    <!-- Progress Bar -->
                    <div v-if="isSavingPostsImage" class="w-full">
                        <ProgressBar 
                            mode="indeterminate" 
                            style="height: 8px" 
                            class="w-full"
                        />
                        <p class="text-sm text-gray-600 mt-2 text-center">Importing post images data...</p>
                    </div>

                    <Button 
                        icon="pi pi-save"
                        :label="isSavingPostsImage ? 'Saving...' : 'Import Post Images'"
                        severity="success"
                        @click="handleSavePostsImage"
                        :loading="isSavingPostsImage"
                        :disabled="isSavingPostsImage"
                        class="p-button-md"
                    />
                </div>
            </div>
        </div>

        <!-- Posts Import Results Section -->
        <div v-if="showPostsResults && postsImportResults" class="bg-white rounded-lg p-6 shadow-md">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-semibold">Posts Import Results</h2>
                <Button 
                    icon="pi pi-times" 
                    label="Clear Results" 
                    severity="secondary" 
                    outlined 
                    @click="clearPostsResults"
                />
            </div>

            <!-- Summary Statistics -->
            <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div class="text-2xl font-bold text-blue-600">{{ postsImportResults?.success?.total_records || 0 }}</div>
                    <div class="text-sm text-blue-800">Total Records</div>
                </div>
                <div class="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div class="text-2xl font-bold text-green-600">{{ postsImportResults?.success?.valid_records || 0 }}</div>
                    <div class="text-sm text-green-800">Valid Records</div>
                </div>
                <div class="bg-red-50 p-4 rounded-lg border border-red-200">
                    <div class="text-2xl font-bold text-red-600">{{ postsImportResults?.success?.invalid_records || 0 }}</div>
                    <div class="text-sm text-red-800">Invalid Records</div>
                </div>
                <div class="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <div class="text-2xl font-bold text-orange-600">{{ postsImportResults?.success?.updated_records || 0 }}</div>
                    <div class="text-sm text-orange-800">Updated Records</div>
                </div>
                <div class="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <div class="text-2xl font-bold text-purple-600">{{ postsImportResults?.success?.inserted_count || 0 }}</div>
                    <div class="text-sm text-purple-800">Inserted Records</div>
                </div>
            </div>

            <!-- Invalid Records DataTable -->
            <div v-if="postsImportResults?.success?.invalid_records > 0 && postsImportResults?.success?.invalid_data" class="mb-6">
                <h3 class="text-lg font-semibold mb-4 text-red-700">Invalid Records ({{ postsImportResults.success.invalid_records }})</h3>
                <DataTable
                    v-model:filters="filters"
                    :value="postsImportResults.success.invalid_data"
                    paginator
                    :rows="10"
                    dataKey="row"
                    filterDisplay="menu"
                    :globalFilterFields="['data.site_id', 'data.status', 'data.admin_id', 'data.name', 'data.slug']"
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
                            <InputText v-model="filters['global'].value" placeholder="Search invalid posts records..." />
                        </div>
                    </template>
                    <template #empty> No invalid posts records found. </template>

                    <Column field="row" header="Row" style="min-width: 6rem">
                        <template #body="{ data }">
                            {{ data.row }}
                        </template>
                    </Column>

                    <Column field="data.site_id" header="Site ID" style="min-width: 8rem">
                        <template #body="{ data }">
                            {{ data.data.site_id }}
                        </template>
                    </Column>

                    <Column field="data.status" header="Status" style="min-width: 8rem">
                        <template #body="{ data }">
                            {{ data.data.status }}
                        </template>
                    </Column>

                    <Column field="data.admin_id" header="Admin ID" style="min-width: 8rem">
                        <template #body="{ data }">
                            {{ data.data.admin_id }}
                        </template>
                    </Column>

                    <Column field="data.name" header="Name" style="min-width: 15rem">
                        <template #body="{ data }">
                            {{ data.data.name }}
                        </template>
                    </Column>

                    <Column field="data.slug" header="Slug" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ data.data.slug }}
                        </template>
                    </Column>

                    <Column field="data.keyline" header="Keyline" style="min-width: 15rem">
                        <template #body="{ data }">
                            {{ data.data.keyline }}
                        </template>
                    </Column>

                    <Column field="data.e_quote" header="E-Quote" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ data.data.e_quote }}
                        </template>
                    </Column>

                    <Column field="data.excerpt" header="Excerpt" style="min-width: 15rem">
                        <template #body="{ data }">
                            {{ data.data.excerpt }}
                        </template>
                    </Column>

                    <Column field="data.description" header="Description" style="min-width: 15rem">
                        <template #body="{ data }">
                            {{ data.data.description }}
                        </template>
                    </Column>

                    <Column field="data.description_one" header="Description One" style="min-width: 15rem">
                        <template #body="{ data }">
                            {{ data.data.description_one }}
                        </template>
                    </Column>

                    <Column field="data.description_two" header="Description Two" style="min-width: 15rem">
                        <template #body="{ data }">
                            {{ data.data.description_two }}
                        </template>
                    </Column>

                    <Column field="data.description_three" header="Description Three" style="min-width: 15rem">
                        <template #body="{ data }">
                            {{ data.data.description_three }}
                        </template>
                    </Column>

                    <Column field="data.feature_image_thumb" header="Feature Image Thumb" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ formatImageData(data.data.feature_image_thumb) }}
                        </template>
                    </Column>

                    <Column field="data.feature_image" header="Feature Image" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ formatImageData(data.data.feature_image) }}
                        </template>
                    </Column>

                    <Column field="data.image_banner" header="Image Banner" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ formatImageData(data.data.image_banner) }}
                        </template>
                    </Column>

                    <Column field="data.image_thumb" header="Image Thumb" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ formatImageData(data.data.image_thumb) }}
                        </template>
                    </Column>

                    <Column field="data.image" header="Image" style="min-width: 10rem">
                        <template #body="{ data }">
                            {{ formatImageData(data.data.image) }}
                        </template>
                    </Column>

                    <Column field="data.main_image_one" header="Main Image One" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ formatImageData(data.data.main_image_one) }}
                        </template>
                    </Column>

                    <Column field="data.main_image_two" header="Main Image Two" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ formatImageData(data.data.main_image_two) }}
                        </template>
                    </Column>

                    <Column field="data.meta_title" header="Meta Title" style="min-width: 15rem">
                        <template #body="{ data }">
                            {{ data.data.meta_title }}
                        </template>
                    </Column>

                    <Column field="data.meta_description" header="Meta Description" style="min-width: 15rem">
                        <template #body="{ data }">
                            {{ data.data.meta_description }}
                        </template>
                    </Column>

                    <Column field="data.meta_keywords" header="Meta Keywords" style="min-width: 15rem">
                        <template #body="{ data }">
                            {{ data.data.meta_keywords }}
                        </template>
                    </Column>

                    <Column field="data.link_text" header="Link Text" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ data.data.link_text }}
                        </template>
                    </Column>

                    <Column field="data.is_featured" header="Is Featured" style="min-width: 10rem">
                        <template #body="{ data }">
                            {{ data.data.is_featured }}
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
            <div v-if="postsImportResults?.success?.updated_records > 0 && postsImportResults?.success?.updated_data" class="mb-6">
                <h3 class="text-lg font-semibold mb-4 text-orange-700">Updated Records ({{ postsImportResults.success.updated_records }})</h3>
                <DataTable
                    v-model:filters="filters"
                    :value="postsImportResults.success.updated_data"
                    paginator
                    :rows="10"
                    dataKey="post_id"
                    filterDisplay="menu"
                    :globalFilterFields="['post_id', 'site_id', 'status', 'admin_id', 'name', 'slug']"
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
                            <InputText v-model="filters['global'].value" placeholder="Search updated posts records..." />
                        </div>
                    </template>
                    <template #empty> No updated posts records found. </template>

                    <Column field="post_id" header="Post ID" style="min-width: 8rem" />
                    <Column field="site_id" header="Site ID" style="min-width: 8rem" />
                    <Column field="status" header="Status" style="min-width: 8rem" />
                    <Column field="admin_id" header="Admin ID" style="min-width: 8rem" />
                    <Column field="name" header="Name" style="min-width: 15rem" />
                    <Column field="slug" header="Slug" style="min-width: 12rem" />
                    <Column field="keyline" header="Keyline" style="min-width: 15rem" />
                    <Column field="e_quote" header="E-Quote" style="min-width: 12rem" />
                    <Column field="excerpt" header="Excerpt" style="min-width: 15rem" />
                    <Column field="description" header="Description" style="min-width: 15rem" />
                    <Column field="description_one" header="Description One" style="min-width: 15rem" />
                    <Column field="description_two" header="Description Two" style="min-width: 15rem" />
                    <Column field="description_three" header="Description Three" style="min-width: 15rem" />
                    <Column field="feature_image_thumb" header="Feature Image Thumb" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ formatImageData(data.feature_image_thumb) }}
                        </template>
                    </Column>
                    <Column field="feature_image" header="Feature Image" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ formatImageData(data.feature_image) }}
                        </template>
                    </Column>
                    <Column field="image_banner" header="Image Banner" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ formatImageData(data.image_banner) }}
                        </template>
                    </Column>
                    <Column field="image_thumb" header="Image Thumb" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ formatImageData(data.image_thumb) }}
                        </template>
                    </Column>
                    <Column field="image" header="Image" style="min-width: 10rem">
                        <template #body="{ data }">
                            {{ formatImageData(data.image) }}
                        </template>
                    </Column>
                    <Column field="main_image_one" header="Main Image One" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ formatImageData(data.main_image_one) }}
                        </template>
                    </Column>
                    <Column field="main_image_two" header="Main Image Two" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ formatImageData(data.main_image_two) }}
                        </template>
                    </Column>
                    <Column field="meta_title" header="Meta Title" style="min-width: 15rem" />
                    <Column field="meta_description" header="Meta Description" style="min-width: 15rem" />
                    <Column field="meta_keywords" header="Meta Keywords" style="min-width: 15rem" />
                    <Column field="link_text" header="Link Text" style="min-width: 12rem" />
                    <Column field="is_featured" header="Is Featured" style="min-width: 10rem" />
                </DataTable>
            </div>

            <!-- Valid Records DataTable -->
            <div v-if="postsImportResults?.success?.valid_records > 0 && postsImportResults?.success?.valid_data">
                <h3 class="text-lg font-semibold mb-4 text-green-700">Valid Records ({{ postsImportResults.success.valid_records }})</h3>
                <DataTable
                    v-model:filters="filters"
                    :value="postsImportResults.success.valid_data"
                    paginator
                    :rows="10"
                    dataKey="post_id"
                    filterDisplay="menu"
                    :globalFilterFields="['post_id', 'site_id', 'status', 'admin_id', 'name', 'slug']"
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
                            <InputText v-model="filters['global'].value" placeholder="Search valid posts records..." />
                        </div>
                    </template>
                    <template #empty> No valid posts records found. </template>

                    <Column field="post_id" header="Post ID" style="min-width: 8rem" />
                    <Column field="site_id" header="Site ID" style="min-width: 8rem" />
                    <Column field="status" header="Status" style="min-width: 8rem" />
                    <Column field="admin_id" header="Admin ID" style="min-width: 8rem" />
                    <Column field="name" header="Name" style="min-width: 15rem" />
                    <Column field="slug" header="Slug" style="min-width: 12rem" />
                    <Column field="keyline" header="Keyline" style="min-width: 15rem" />
                    <Column field="e_quote" header="E-Quote" style="min-width: 12rem" />
                    <Column field="excerpt" header="Excerpt" style="min-width: 15rem" />
                    <Column field="description" header="Description" style="min-width: 15rem" />
                    <Column field="description_one" header="Description One" style="min-width: 15rem" />
                    <Column field="description_two" header="Description Two" style="min-width: 15rem" />
                    <Column field="description_three" header="Description Three" style="min-width: 15rem" />
                    <Column field="feature_image_thumb" header="Feature Image Thumb" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ formatImageData(data.feature_image_thumb) }}
                        </template>
                    </Column>
                    <Column field="feature_image" header="Feature Image" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ formatImageData(data.feature_image) }}
                        </template>
                    </Column>
                    <Column field="image_banner" header="Image Banner" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ formatImageData(data.image_banner) }}
                        </template>
                    </Column>
                    <Column field="image_thumb" header="Image Thumb" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ formatImageData(data.image_thumb) }}
                        </template>
                    </Column>
                    <Column field="image" header="Image" style="min-width: 10rem">
                        <template #body="{ data }">
                            {{ formatImageData(data.image) }}
                        </template>
                    </Column>
                    <Column field="main_image_one" header="Main Image One" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ formatImageData(data.main_image_one) }}
                        </template>
                    </Column>
                    <Column field="main_image_two" header="Main Image Two" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ formatImageData(data.main_image_two) }}
                        </template>
                    </Column>
                    <Column field="meta_title" header="Meta Title" style="min-width: 15rem" />
                    <Column field="meta_description" header="Meta Description" style="min-width: 15rem" />
                    <Column field="meta_keywords" header="Meta Keywords" style="min-width: 15rem" />
                    <Column field="link_text" header="Link Text" style="min-width: 12rem" />
                    <Column field="is_featured" header="Is Featured" style="min-width: 10rem" />
                </DataTable>
            </div>
        </div>

        <!-- Post Images Import Results Section -->
        <div v-if="showPostsImageResults && postsImageImportResults" class="bg-white rounded-lg p-6 shadow-md">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-semibold">Post Images Import Results</h2>
                <Button 
                    icon="pi pi-times" 
                    label="Clear Results" 
                    severity="secondary" 
                    outlined 
                    @click="clearPostsImageResults"
                />
            </div>

            <!-- Summary Statistics -->
            <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div class="text-2xl font-bold text-blue-600">{{ postsImageImportResults?.success?.total_records || 0 }}</div>
                    <div class="text-sm text-blue-800">Total Records</div>
                </div>
                <div class="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div class="text-2xl font-bold text-green-600">{{ postsImageImportResults?.success?.valid_records || 0 }}</div>
                    <div class="text-sm text-green-800">Valid Records</div>
                </div>
                <div class="bg-red-50 p-4 rounded-lg border border-red-200">
                    <div class="text-2xl font-bold text-red-600">{{ postsImageImportResults?.success?.invalid_records || 0 }}</div>
                    <div class="text-sm text-red-800">Invalid Records</div>
                </div>
                <div class="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <div class="text-2xl font-bold text-orange-600">{{ postsImageImportResults?.success?.updated_records || 0 }}</div>
                    <div class="text-sm text-orange-800">Updated Records</div>
                </div>
                <div class="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <div class="text-2xl font-bold text-purple-600">{{ postsImageImportResults?.success?.inserted_count || 0 }}</div>
                    <div class="text-sm text-purple-800">Inserted Records</div>
                </div>
            </div>

            <!-- Invalid Records DataTable -->
            <div v-if="postsImageImportResults?.success?.invalid_records > 0 && postsImageImportResults?.success?.invalid_data" class="mb-6">
                <h3 class="text-lg font-semibold mb-4 text-red-700">Invalid Records ({{ postsImageImportResults.success.invalid_records }})</h3>
                <DataTable
                    v-model:filters="filters"
                    :value="postsImageImportResults.success.invalid_data"
                    paginator
                    :rows="10"
                    dataKey="row"
                    filterDisplay="menu"
                    :globalFilterFields="['data.post_id', 'data.image_link', 'data.sort_order']"
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

                    <Column field="data.post_id" header="Post ID" style="min-width: 8rem">
                        <template #body="{ data }">
                            {{ data.data.post_id }}
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
            <div v-if="postsImageImportResults?.success?.updated_records > 0 && postsImageImportResults?.success?.updated_data" class="mb-6">
                <h3 class="text-lg font-semibold mb-4 text-orange-700">Updated Records ({{ postsImageImportResults.success.updated_records }})</h3>
                <DataTable
                    v-model:filters="filters"
                    :value="postsImageImportResults.success.updated_data"
                    paginator
                    :rows="10"
                    dataKey="row"
                    filterDisplay="menu"
                    :globalFilterFields="['post_id', 'image_link', 'sort_order']"
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

                    <Column field="post_id" header="Post ID" style="min-width: 8rem" />
                    
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

            <!-- Valid Records DataTable -->
            <div v-if="postsImageImportResults?.success?.valid_records > 0 && postsImageImportResults?.success?.valid_data">
                <h3 class="text-lg font-semibold mb-4 text-green-700">Valid Records ({{ postsImageImportResults.success.valid_records }})</h3>
                <DataTable
                    v-model:filters="filters"
                    :value="postsImageImportResults.success.valid_data"
                    paginator
                    :rows="10"
                    dataKey="row"
                    filterDisplay="menu"
                    :globalFilterFields="['post_id', 'image_link', 'sort_order']"
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

                    <Column field="post_id" header="Post ID" style="min-width: 8rem" />
                    
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
