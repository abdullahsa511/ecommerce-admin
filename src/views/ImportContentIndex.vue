<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useImportStore } from '../stores/import';
import { useToast } from 'primevue/usetoast';
import axios from 'axios';

const router = useRouter();
const toast = useToast();
const importStore = useImportStore();
const fileInput = ref(null);
const selectedFile = ref(null);
const enableOnlineImport = ref(false);
const isUploading = ref(false);
const isImporting = ref(false);
const isSaving = ref(false);

const handleFileSelect = (event) => {
    const file = event.files[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Please select a CSV file', life: 3000 });
        return;
    }

    selectedFile.value = file;
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

    
        const response = await importStore.createImport(formData);

        console.log('Save response:', response.data);
        toast.add({ severity: 'success', summary: 'Success', detail: 'File saved successfully', life: 3000 });
        selectedFile.value = null;
    } catch (error) {
        console.error('Save error:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: error.message || 'Failed to save file', life: 3000 });
    } finally {
        isSaving.value = false;
    }
};


const toggleOnlineImport = () => {
    enableOnlineImport.value = !enableOnlineImport.value;
    console.log('Online import enabled:', enableOnlineImport.value);
};

</script>

<template>
    <div class="flex flex-col gap-8">
        <!-- Local Import Section -->
        <div class="bg-white rounded-lg p-6 shadow-md">
            <h2 class="text-xl font-semibold mb-2">Import CSV data</h2>
            <p class="text-gray-600 mb-4">Upload a CSV file to start importing</p>
            
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

                    <Button 
                        icon="pi pi-save"
                        :label="isSaving ? 'Saving...' : 'Save'"
                        severity="success"
                        @click="handleSave"
                        :loading="isSaving"
                        :disabled="isSaving"
                        class="p-button-md"
                    />
                </div>
            </div>
        </div>

        <!-- Online Import Section -->
        <div class="bg-white/60 rounded-lg p-6 shadow-md opacity-60">
            <h2 class="text-xl font-semibold mb-2 text-gray-500">Online import</h2>
            <p class="text-gray-400 mb-4">Import content from another Vvveb website</p>
            
            <div class="flex items-center gap-2">
                <InputSwitch
                    v-model="enableOnlineImport"
                    @change="toggleOnlineImport"
                    :disabled="true"
                />
                <span class="text-gray-400">Enable online import</span>
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