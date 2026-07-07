<script setup>
import { formatImportImageData } from '@/utils/mediaUrl';
import { ref } from 'vue';
import { useShowroomImportStore } from '@/stores/showroomImport';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { value } from '@primeuix/themes/aura/knob';

const toast = useToast();
const showroomImportStore = useShowroomImportStore();
const selectedFile = ref(null);
const isSaving = ref(false);
const selectedFileImage = ref(null);
const selectedFileProduct = ref(null);
const isSavingImage = ref(false);
const isSavingProduct = ref(false);

// Import results data
const importResults = ref(null);
const showResults = ref(false);
const imageImportResults = ref(null);
const productImportResults = ref(null);
const showImageResults = ref(false);
const showProductResults = ref(false);

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
const handleFileSelectProduct = (event) => {
    const file = event.files[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Please select a CSV file', life: 3000 });
        return;
    }

    selectedFileProduct.value = file;
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
        formData.append('status', 'pending');

        const response = await showroomImportStore.createSectionImport(formData);
        // Store the import results
        // importResults.value = response;
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

        // importResults.value = {
        //     success: {
        //         valid_records: 36,
        //         valid_data: [
        //             { "showroom_id": 1, "title": "Miro", "description": "Lockable in any position\nAutomatic tension adjustment control adjusts according to the user's weight\nHeight, angle, and depth adjustable arms\nSeat slider control\nNylon base with polypropylene arms and detailing\nAvailable with mesh or fabric upholstery\nWeight limit: 125kg\nAFRDI Certified\n10 Year Warranty", "image": "[{\"id\":null,\"file\":{\"name\":\"Miro_SpecImage.jpg\",\"size\":0,\"type\":\"image\\/jpeg\",\"error\":0,\"tmp_name\":\"\\/media\\/Products\\/Miro_SpecImage.jpg\",\"full_path\":\"Miro_SpecImage.jpg\"},\"name\":\"Miro_SpecImage.jpg\",\"size\":0,\"type\":\"image\\/jpeg\",\"image\":\"\\/media\\/Products\\/Miro_SpecImage.jpg\",\"status\":{\"name\":\"Expected\",\"severity\":\"info\"},\"media_id\":null,\"objectURL\":\"\\/media\\/Products\\/Miro_SpecImage.jpg\",\"created_at\":\"\",\"description\":\"\",\"product_image_id\":null}]", "slug": "miro" }, { "showroom_id": 1, "title": "Miro S", "description": "Lockable in any position\nAutomatic tension adjustment control adjusts according to the user's weight\nHeight, angle, and depth adjustable arms\nSeat slider control\nPolished aluminium base, arms, and detailing\nAvailable with mesh, fabric, or full leather upholstery\nWeight limit: 125kg\nAFRDI Certified\n10 Year Warranty", "image": "[{\"id\":null,\"file\":{\"name\":\"MiroS_SpecImage.jpg\",\"size\":0,\"type\":\"image\\/jpeg\",\"error\":0,\"tmp_name\":\"\\/media\\/Products\\/MiroS_SpecImage.jpg\",\"full_path\":\"MiroS_SpecImage.jpg\"},\"name\":\"MiroS_SpecImage.jpg\",\"size\":0,\"type\":\"image\\/jpeg\",\"image\":\"\\/media\\/Products\\/MiroS_SpecImage.jpg\",\"status\":{\"name\":\"Expected\",\"severity\":\"info\"},\"media_id\":null,\"objectURL\":\"\\/media\\/Products\\/MiroS_SpecImage.jpg\",\"created_at\":\"\",\"description\":\"\",\"product_image_id\":null}]", "slug": "miro-s" }
        //             // Add more test objects
        //         ]
        //     }
        // };

        showResults.value = true;

        // Check if data is nested under success property

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
        formData.append('status', 'pending');

        const response = await showroomImportStore.createSectionImageImport(formData);

        // Store the image import results
        // imageImportResults.value = response;
        imageImportResults.value = {
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
const handleSaveProduct = async () => {
    if (!selectedFileProduct.value) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Please select a file first', life: 3000 });
        return;
    }

    isSavingProduct.value = true;
    try {
        const formData = new FormData();
        formData.append('csv_file', selectedFileProduct.value);
        formData.append('type', 'import');
        formData.append('status', 'pending');

        const response = await showroomImportStore.createSectionProductImport(formData);

        // Store the image import results
        // productImportResults.value = response;
        productImportResults.value = {
            success: {
                total_records: response.total_records,
                valid_records: response.valid_records,
                invalid_records: response.invalid_records,
                updated_records: response.updated_records,
                inserted_count: response.inserted_count,
                valid_data: response.valid_data,
                invalid_data: response.invalid_data,
                updated_data: response.updated_data,
                product_ids_map: response.product_ids_map,
                section_ids_map: response.section_ids_map,
            }
        };
        console.log('productImportResults:', productImportResults.value.success.product_ids_map);
        showProductResults.value = true;


        toast.add({ severity: 'success', summary: 'Success', detail: 'File saved successfully', life: 3000 });
        selectedFileProduct.value = null;
    } catch (error) {
        console.error('Save error:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: error.message || 'Failed to save file', life: 3000 });
    } finally {
        isSavingProduct.value = false;
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
const clearProductResults = () => {
    productImportResults.value = null;
    showProducteResults.value = false;
};

const formatImageData = formatImportImageData;

// Helper function to format errors
const formatErrors = (errors) => {
    if (!errors) return '';
    return Object.entries(errors)
        .map(([field, message]) => `${field}: ${message}`)
        .join(', ');
};

// Helper function to format description (replace \n with <br> for line breaks)
const formatDescription = (description) => {
    if (!description) return 'No description';
    return description.replace(/\\n/g, '<br>');
};

// Helper to look up product mapping (handles both slug -> id and id -> slug)
const lookupProductMap = (productIdentifier) => {
    const map = productImportResults?.value?.success?.product_ids_map || {};
    if (productIdentifier == null || productIdentifier === '') return '';

    // If the identifier is a key in the map (slug), return the mapped id
    if (Object.prototype.hasOwnProperty.call(map, productIdentifier)) {
        return map[productIdentifier];
    }

    // If the identifier is numeric (id), find the slug key and return the slug
    const numeric = Number(productIdentifier);
    if (!Number.isNaN(numeric)) {
        const foundKey = Object.keys(map).find((k) => map[k] === numeric);
        if (foundKey) return foundKey;
    }

    // Fallback: return the original identifier
    return productIdentifier;
};

// Helper to look up section mapping (handles both slug -> id and id -> slug)
const lookupSectionMap = (sectionIdentifier) => {
    const map = productImportResults?.value?.success?.section_ids_map || {};
    if (sectionIdentifier == null || sectionIdentifier === '') return '';

    // If the identifier is a key in the map (slug), return the mapped id
    if (Object.prototype.hasOwnProperty.call(map, sectionIdentifier)) {
        return map[sectionIdentifier];
    }

    // If the identifier is numeric (id), find the slug key and return the slug
    const numeric = Number(sectionIdentifier);
    if (!Number.isNaN(numeric)) {
        const foundKey = Object.keys(map).find((k) => map[k] === numeric);
        if (foundKey) return foundKey;
    }

    // Fallback: return the original identifier
    return sectionIdentifier;
};

</script>

<template>
    <div class="flex flex-col gap-8">
        <!-- Local Import Section -->
        <div class="bg-white rounded-lg p-6 shadow-md">
            <h2 class="text-xl font-semibold mb-2">Import Section CSV data</h2>
            <p class="text-gray-600 mb-4">Upload a CSV file to start importing Section data</p>

            <div class="flex flex-col gap-4">
                <FileUpload mode="basic" name="importFile" accept=".csv" :maxFileSize="1000000"
                    @select="handleFileSelect" :auto="false" chooseLabel="Select CSV File" />

                <!-- Selected file info and Save button -->
                <div v-if="selectedFile" class="flex flex-col gap-4">
                    <div class="flex items-center gap-2 p-3 bg-gray-50 rounded">
                        <i class="pi pi-file text-gray-500"></i>
                        <span class="text-gray-700">{{ selectedFile.name }}</span>
                    </div>

                    <!-- Progress Bar -->
                    <div v-if="isSaving" class="w-full">
                        <ProgressBar mode="indeterminate" style="height: 8px" class="w-full" />
                        <p class="text-sm text-gray-600 mt-2 text-center">Importing Section data...</p>
                    </div>

                    <Button icon="pi pi-save" :label="isSaving ? 'Saving...' : 'Import'" severity="success"
                        @click="handleSave" :loading="isSaving" :disabled="isSaving" class="p-button-md" />
                </div>
            </div>
        </div>

        <div class="bg-white rounded-lg p-6 shadow-md">
            <h2 class="text-xl font-semibold mb-2">Import Section Image CSV data</h2>
            <p class="text-gray-600 mb-4">Upload a CSV file to start importing Section image data</p>

            <div class="flex flex-col gap-4">
                <FileUpload mode="basic" name="importFile" accept=".csv" :maxFileSize="1000000"
                    @select="handleFileSelectImage" :auto="false" chooseLabel="Select CSV File" />

                <!-- Selected file info and Save button -->
                <div v-if="selectedFileImage" class="flex flex-col gap-4">
                    <div class="flex items-center gap-2 p-3 bg-gray-50 rounded">
                        <i class="pi pi-file text-gray-500"></i>
                        <span class="text-gray-700">{{ selectedFileImage.name }}</span>
                    </div>

                    <!-- Progress Bar -->
                    <div v-if="isSavingImage" class="w-full">
                        <ProgressBar mode="indeterminate" style="height: 8px" class="w-full" />
                        <p class="text-sm text-gray-600 mt-2 text-center">Importing Section image data...</p>
                    </div>

                    <Button icon="pi pi-save" :label="isSavingImage ? 'Saving...' : 'Import'" severity="success"
                        @click="handleSaveImage" :loading="isSavingImage" :disabled="isSavingImage"
                        class="p-button-md" />
                </div>
            </div>
        </div>

        <div class="bg-white rounded-lg p-6 shadow-md">
            <h2 class="text-xl font-semibold mb-2">Import Section Product CSV data</h2>
            <p class="text-gray-600 mb-4">Upload a CSV file to start importing Section Product data</p>

            <div class="flex flex-col gap-4">
                <FileUpload mode="basic" name="importFile" accept=".csv" :maxFileSize="1000000"
                    @select="handleFileSelectProduct" :auto="false" chooseLabel="Select CSV File" />

                <!-- Selected file info and Save button -->
                <div v-if="selectedFileProduct" class="flex flex-col gap-4">
                    <div class="flex items-center gap-2 p-3 bg-gray-50 rounded">
                        <i class="pi pi-file text-gray-500"></i>
                        <span class="text-gray-700">{{ selectedFileProduct.name }}</span>
                    </div>

                    <!-- Progress Bar -->
                    <div v-if="isSavingProduct" class="w-full">
                        <ProgressBar mode="indeterminate" style="height: 8px" class="w-full" />
                        <p class="text-sm text-gray-600 mt-2 text-center">Importing Section Product data...</p>
                    </div>

                    <Button icon="pi pi-save" :label="isSavingProduct ? 'Saving...' : 'Import'" severity="success"
                        @click="handleSaveProduct" :loading="isSavingProduct" :disabled="isSavingProduct"
                        class="p-button-md" />
                </div>
            </div>
        </div>

        <!-- Import Results Section -->
        <div v-if="showResults && importResults" class="bg-white rounded-lg p-6 shadow-md">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-semibold">Import Results</h2>
                <Button icon="pi pi-times" label="Clear Results" severity="secondary" outlined @click="clearResults" />
            </div>

            <!-- Summary Statistics -->
            <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div class="text-2xl font-bold text-blue-600">{{ importResults?.success?.total_records || 0 }}</div>
                    <div class="text-sm text-blue-800">Total Records</div>
                </div>
                <div class="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div class="text-2xl font-bold text-green-600">{{ importResults?.success?.valid_records || 0 }}
                    </div>
                    <div class="text-sm text-green-800">Valid Records</div>
                </div>
                <div class="bg-red-50 p-4 rounded-lg border border-red-200">
                    <div class="text-2xl font-bold text-red-600">{{ importResults?.success?.invalid_records || 0 }}
                    </div>
                    <div class="text-sm text-red-800">Invalid Records</div>
                </div>
                <div class="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <div class="text-2xl font-bold text-orange-600">{{ importResults?.success?.updated_records || 0 }}
                    </div>
                    <div class="text-sm text-orange-800">Updated Records</div>
                </div>
                <div class="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <div class="text-2xl font-bold text-purple-600">{{ importResults?.success?.inserted_count || 0 }}
                    </div>
                    <div class="text-sm text-purple-800">Inserted Records</div>
                </div>
            </div>

            <!-- Invalid Records DataTable -->
            <div v-if="importResults?.success?.valid_records > 0 && importResults?.success?.valid_data">
                <h3 class="text-lg font-semibold mb-4 text-green-700">
                    Valid Records ({{ importResults.success.valid_records }})
                </h3>
                <DataTable v-model:filters="filters" :value="importResults.success.valid_data" paginator :rows="10"
                    dataKey="slug" filterDisplay="menu" :globalFilterFields="['title', 'description', 'slug']"
                    class="th-table">
                    <template #header>
                        <div class="flex justify-between items-center">
                            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined
                                @click="clearFilter()" />
                            <InputText v-model="filters['global'].value" placeholder="Search valid records..." />
                        </div>
                    </template>
                    <template #empty>No valid records found.</template>

                    <!-- Columns -->
                    <Column field="title" header="Title" style="min-width: 12rem" />
                    <Column field="description" header="Description" style="min-width: 20rem">
                        <template #body="{ data }">
                            {{ formatDescription(data.description) }}
                        </template>
                    </Column>
                    <Column field="slug" header="Slug" style="min-width: 12rem" />
                    <Column field="image" header="Image" style="min-width: 10rem">
                        <template #body="{ data }">
                            {{ formatImageData(data.image) }}
                        </template>
                    </Column>
                </DataTable>
            </div>

            <!-- Updated Records DataTable -->
            <div v-if="importResults?.success?.updated_records > 0 && importResults?.success?.updated_data"
                class="mb-6">
                <h3 class="text-lg font-semibold mb-4 text-orange-700">Updated Records ({{
                    importResults.success.updated_records }})
                </h3>
                <DataTable v-model:filters="filters" :value="importResults.success.updated_data" paginator :rows="10"
                    dataKey="section_id" filterDisplay="menu"
                    :globalFilterFields="['section_id', 'title', 'name', 'slug']" class="th-table">
                    <template #header>
                        <div class="flex justify-between items-center">
                            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined
                                @click="clearFilter()" />
                            <InputText v-model="filters['global'].value" placeholder="Search updated records..." />
                        </div>
                    </template>
                    <template #empty> No updated records found. </template>

                    <Column field="section_id" header="Section ID" style="min-width: 8rem" />

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
                    :globalFilterFields="['data.section_id', 'data.image_link', 'data.sort_order']"
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

                    <Column field="data.section_id" header="Section ID" style="min-width: 8rem">
                        <template #body="{ data }">
                            {{ data.data.section_id }}
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
                    :globalFilterFields="['section_id', 'image_link', 'sort_order']"
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

                    <Column field="section_id" header="Section ID" style="min-width: 8rem" />
                    
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
            <div v-if="imageImportResults?.success?.valid_records > 0 && imageImportResults?.success?.valid_data">
                <h3 class="text-lg font-semibold mb-4 text-green-700">Valid Records ({{ imageImportResults.success.valid_records }})</h3>
                <DataTable
                    v-model:filters="filters"
                    :value="imageImportResults.success.valid_data"
                    paginator
                    :rows="10"
                    dataKey="row"
                    filterDisplay="menu"
                    :globalFilterFields="['section_id', 'image_link', 'sort_order']"
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

                    <Column field="section_id" header="Section ID" style="min-width: 8rem" />
                    
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

        <!-- Product Import Results Section -->
        <div v-if="showProductResults && productImportResults" class="bg-white rounded-lg p-6 shadow-md">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-semibold">Product Import Results</h2>
                <Button icon="pi pi-times" label="Clear Results" severity="secondary" outlined
                    @click="clearProductResults" />
            </div>

            <!-- Summary Statistics -->
            <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div class="text-2xl font-bold text-blue-600">
                        {{ productImportResults?.success?.total_records || 0 }}
                    </div>
                    <div class="text-sm text-blue-800">Total Records</div>
                </div>
                <div class="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div class="text-2xl font-bold text-green-600">
                        {{ productImportResults?.success?.valid_records || 0 }}
                    </div>
                    <div class="text-sm text-green-800">Valid Records</div>
                </div>
                <div class="bg-red-50 p-4 rounded-lg border border-red-200">
                    <div class="text-2xl font-bold text-red-600">
                        {{ productImportResults?.success?.invalid_records || 0 }}
                    </div>
                    <div class="text-sm text-red-800">Invalid Records</div>
                </div>
                <div class="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <div class="text-2xl font-bold text-orange-600">
                        {{ productImportResults?.success?.updated_records || 0 }}
                    </div>
                    <div class="text-sm text-orange-800">Updated Records</div>
                </div>
                <div class="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <div class="text-2xl font-bold text-purple-600">
                        {{ productImportResults?.success?.inserted_count || 0 }}
                    </div>
                    <div class="text-sm text-purple-800">Inserted Records</div>
                </div>
            </div>

            <!-- Invalid Records -->
            <div v-if="productImportResults?.success?.invalid_records > 0 && productImportResults?.success?.invalid_data"
                class="mb-6">
                <h3 class="text-lg font-semibold mb-4 text-red-700">
                    Invalid Records ({{ productImportResults.success.invalid_records }})
                </h3>
                <DataTable v-model:filters="filters" :value="productImportResults.success.invalid_data" paginator
                    :rows="10" dataKey="row" filterDisplay="menu"
                    :globalFilterFields="['data.section_code', 'data.product_code', 'data.sort_order']" class="th-table">
                    <template #header>
                        <div class="flex justify-between items-center">
                            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined
                                @click="clearFilter()" />
                            <InputText v-model="filters['global'].value"
                                placeholder="Search invalid product records..." />
                        </div>
                    </template>
                    <template #empty> No invalid product records found. </template>

                    <Column field="row" header="Row" style="min-width: 6rem" />
                    <Column field="data.section_code" header="Section Code" style="min-width: 8rem">
                        <template #body="{ data }">{{ data.data.section_code }}</template>
                    </Column>
                    <Column field="data.product_code" header="Product Code" style="min-width: 8rem">
                        <template #body="{ data }">{{ data.data.product_code }}</template>
                    </Column>
                    <Column field="data.sort_order" header="Sort Order" style="min-width: 8rem">
                        <template #body="{ data }">{{ data.data.sort_order }}</template>
                    </Column>
                    <Column field="data.status" header="Status" style="min-width: 12rem">
                        <template #body="{ data }">{{ data.data.status }}</template>
                    </Column>
                    <Column field="errors" header="Errors" style="min-width: 20rem">
                        <template #body="{ data }">
                            <div class="text-red-600 text-sm">{{ formatErrors(data.errors) }}</div>
                        </template>
                    </Column>
                </DataTable>
            </div>

            <!-- Updated Records -->
            <div v-if="productImportResults?.success?.updated_records > 0 && productImportResults?.success?.updated_data"
                class="mb-6">
                <h3 class="text-lg font-semibold mb-4 text-orange-700">
                    Updated Records ({{ productImportResults.success.updated_records }})
                </h3>
                <DataTable v-model:filters="filters" :value="productImportResults.success.updated_data" paginator
                    :rows="10" dataKey="section_id" filterDisplay="menu"
                    :globalFilterFields="['section_id', 'product_id', 'sort_order']" class="th-table">
                    <template #header>
                        <div class="flex justify-between items-center">
                            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined
                                @click="clearFilter()" />
                            <InputText v-model="filters['global'].value"
                                placeholder="Search updated product records..." />
                        </div>
                    </template>
                    <template #empty> No updated product records found. </template>
                    <Column field="section_id" header="Section Code" style="min-width: 8rem">
                        <template #body="{ data }">{{ lookupSectionMap(data.section_id) }}</template>
                    </Column>
                    <Column field="product_id" header="Product Code" style="min-width: 8rem">
                        <template #body="{ data }">{{ lookupProductMap(data.product_id) }}</template>
                    </Column>
                    <Column field="sort_order" header="Sort Order" style="min-width: 8rem" />
                    <Column field="status" header="Status" style="min-width: 12rem" />
                </DataTable>
            </div>

            <!-- Valid Records -->
            <div v-if="productImportResults?.success?.valid_records > 0 && productImportResults?.success?.valid_data">
                <h3 class="text-lg font-semibold mb-4 text-green-700">
                    Valid Records ({{ productImportResults.success.valid_records }})
                </h3>
                <DataTable v-model:filters="filters" :value="productImportResults.success.valid_data" paginator
                    :rows="10" dataKey="row" filterDisplay="menu"
                    :globalFilterFields="['section_id', 'product_id', 'sort_order']" class="th-table">
                    <template #header>
                        <div class="flex justify-between items-center">
                            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined
                                @click="clearFilter()" />
                            <InputText v-model="filters['global'].value"
                                placeholder="Search valid product records..." />
                        </div>
                    </template>
                    <template #empty> No valid product records found. </template>

                    <Column field="section_id" header="Section ID" style="min-width: 8rem">
                        <template #body="{ data }">{{ lookupSectionMap(data.section_id) }}</template>
                    </Column>
                    <Column field="product_id" header="Product ID" style="min-width: 8rem">
                        <template #body="{ data }">{{ lookupProductMap(data.product_id) }}</template>
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