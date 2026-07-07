<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useImportStore } from '../stores/import';
import { useToast } from 'primevue/usetoast';

const router = useRouter();
const toast = useToast();
const importStore = useImportStore();

const databaseItems = ref([
    { name: 'Admin', selected: false },
    { name: 'Attribute', selected: false },
    { name: 'Cart', selected: false },
    { name: 'Comment', selected: false },
    { name: 'Country', selected: false },
    { name: 'Coupon', selected: false },
    { name: 'Currency', selected: false },
    { name: 'Digital', selected: false },
    { name: 'Field', selected: false },
    { name: 'Language', selected: false },
    { name: 'Layout', selected: false },
    { name: 'Module', selected: false },
    { name: 'Order', selected: false },
    { name: 'Page', selected: false },
    { name: 'Region', selected: false },
    { name: 'Shipping', selected: false },
    { name: 'Shipping Method', selected: false },
    { name: 'Shipping Zone', selected: false },
    { name: 'Store', selected: false },
    { name: 'Tax', selected: false },
    { name: 'Tax Class', selected: false },
    { name: 'Tax Rule', selected: false },
    { name: 'User', selected: false },
    { name: 'User Group', selected: false },
    { name: 'User Group Permission', selected: false },
    { name: 'User Permission', selected: false },
    { name: 'User Role', selected: false },
    { name: 'User Role Permission', selected: false },
    { name: 'User Role User', selected: false }
]);

const enableOnlineExport = ref(false);
const masterCheckbox = ref(false);

// Watch for changes in masterCheckbox
watch(masterCheckbox, (newValue) => {
    databaseItems.value.forEach(item => {
        item.selected = newValue;
    });
});

// Watch for changes in individual items
watch(databaseItems, () => {
    masterCheckbox.value = databaseItems.value.every(item => item.selected);
}, { deep: true });

const exportContent = async () => {
    try {
        const selectedItems = databaseItems.value
            .filter(item => item.selected)
            .map(item => item.name);

        if (selectedItems.length === 0) {
            toast.add({ 
                severity: 'warn', 
                summary: 'Warning', 
                detail: 'Please select at least one item to export', 
                life: 3000 
            });
            return;
        }

        const csvData = await importStore.userExport();
        
        if (!csvData) {
            throw new Error('No data received from server');
        }

        // Create a blob and download the file
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'exported_data.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.add({ 
            severity: 'success', 
            summary: 'Success', 
            detail: 'Data exported successfully', 
            life: 3000 
        });
    } catch (error) {
        console.error('Export error:', error);
        toast.add({ 
            severity: 'error', 
            summary: 'Error', 
            detail: error.message || 'Failed to export data', 
            life: 3000 
        });
    }
}
</script>

<template>
    <div class="flex flex-col gap-8">

        <div class="flex justify-end gap-2 mb-6 border-b border-gray-200 pb-6">
            <Button
                icon="pi pi-download"
                label="Export Data"
                severity="primary"
                @click="exportContent"
                class="p-button-md"
            />
        </div>
        <!-- Database Section -->
        <div class="bg-white rounded-lg p-8 relative mt-5">
            <div class="relative border-b border-gray-200 -mx-8 -mt-8">
                <div class="absolute -top-12 left-0">
                    <h2 class="-mt-1 relative inline-block bg-white px-8 py-3 text-lg font-semibold border border-gray-200 border-b-0 rounded-t-lg">Database</h2>
                </div>
            </div>
            
            <!-- Toggle All -->
            <div class="flex items-center gap-3 mb-6 mt-5">
                <Checkbox
                    v-model="masterCheckbox"
                    :binary="true"
                    id="toggle-all"
                    class="scale-110"
                />
                <label for="toggle-all" class="text-gray-700 cursor-pointer text-lg">Toggle all</label>
            </div>

            <!-- Scrollable Database Items -->
            <div class="max-h-[32rem] overflow-y-auto pr-2">
                <div v-for="item in databaseItems" 
                     :key="item.name"
                     class="flex items-center gap-3 py-3 border border-t-0 first:border-t group hover:bg-gray-50 pl-4 mr-2"
                >
                    <Checkbox
                        v-model="item.selected"
                        :binary="true"
                        :id="item.name"
                        class="scale-110"
                    />
                    <label :for="item.name" class="text-gray-700 cursor-pointer flex-grow text-lg">{{ item.name }}</label>
                    <Button
                        icon="pi pi-chevron-down"
                        class="p-button-text p-button-rounded opacity-0 group-hover:opacity-100 transition-opacity scale-125"
                        severity="secondary"
                    />
                </div>
            </div>
        </div>

        <!-- Online Export Section -->
        <div class="bg-white/60 rounded-lg p-8 shadow-md opacity-60">
            <h2 class="text-2xl font-semibold mb-3 text-gray-500">Online export</h2>
            <p class="text-gray-400 mb-6 text-lg">Enable this option if you want to transfer the contents of this website to another Vvveb website, you can use the url and password bellow in the import section on the Vvveb website where you want to transfer content</p>
            
            <div class="flex items-center gap-3">
                <Select 
                    v-model="enableOnlineExport"
                    :options="[
                        { name: 'Enable online export', code: 'enable' },
                        { name: 'Disable online export', code: 'disable' }
                    ]"
                    optionLabel="name"
                    placeholder="Enable online export"
                    class="w-full text-lg"
                    :disabled="true"
                />
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
.shadow-md {
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}
:deep(.p-button) {
    border-radius: 0.5rem;
}

/* Custom scrollbar styling */
.overflow-y-auto {
    scrollbar-width: thin;
    scrollbar-color: #CBD5E0 #EDF2F7;
}

.overflow-y-auto::-webkit-scrollbar {
    width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
    background: #EDF2F7;
    border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
    background-color: #CBD5E0;
    border-radius: 4px;
}

/* Hover effect for items */
.group:hover {
    background-color: #F9FAFB;
}

:deep(.p-checkbox) {
    width: 1.25rem !important;
    height: 1.25rem !important;
}

:deep(.p-checkbox .p-checkbox-box) {
    width: 1.25rem !important;
    height: 1.25rem !important;
}

:deep(.p-dropdown) {
    font-size: 1.125rem;
}

:deep(.p-dropdown-item) {
    font-size: 1.125rem;
    padding: 1rem 1.5rem;
}
</style> 