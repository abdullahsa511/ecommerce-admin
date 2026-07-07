<script setup lang="ts">
import { ref } from 'vue';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';
import { useServiceRequestStore } from '@/stores/serviceRequest';

const serviceRequestStore = useServiceRequestStore();
const toast = useToast();

const selectedFile = ref<File | null>(null);
const isSaving = ref(false);

const handleFileSelect = (event: any) => {
    const file = event.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Please select a CSV file',
            life: 3000
        });
        return;
    }

    selectedFile.value = file;
};

const handleSave = async () => {
    if (!selectedFile.value) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Please select a file first',
            life: 3000
        });
        return;
    }

    isSaving.value = true;
    try {
        const formData = new FormData();
        formData.append('csv_file', selectedFile.value);
        await serviceRequestStore.serviceRequestsImport(formData);
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Service requests imported successfully',
            life: 3000
        });
        selectedFile.value = null;
    } catch (error: any) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error?.message || 'Failed to import service requests',
            life: 3000
        });
    } finally {
        isSaving.value = false;
    }
};
</script>

<template>
    <div class="bg-white rounded-lg p-6 shadow-md">
        <h2 class="text-xl font-semibold mb-2">Import Service Requests CSV data</h2>
        <p class="text-gray-600 mb-4">Upload a CSV file to start importing service requests data</p>
        <div class="flex flex-col gap-4">
            <FileUpload mode="basic" name="importServiceRequestFile" accept=".csv" :maxFileSize="1000000" @select="handleFileSelect" :auto="false" chooseLabel="Select CSV File" />
            <div v-if="selectedFile" class="flex flex-col gap-4">
                <div class="flex items-center gap-2 p-3 bg-gray-50 rounded">
                    <i class="pi pi-file text-gray-500"></i>
                    <span class="text-gray-700">{{ selectedFile.name }}</span>
                </div>
                <Button
                    icon="pi pi-save"
                    :label="isSaving ? 'Saving...' : 'Import Service Requests'"
                    severity="success"
                    @click="handleSave"
                    :loading="isSaving"
                    :disabled="isSaving"
                    class="p-button-md"
                />
            </div>
        </div>
    </div>
</template>
