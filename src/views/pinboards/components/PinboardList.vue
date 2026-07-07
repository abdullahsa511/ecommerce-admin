<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { usePinboardStore } from '@/stores/pinboard';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { Pinboard } from '@/models/Pinboard';
import { useToast } from 'primevue/usetoast';
import SplitButton from 'primevue/splitbutton';

import {
  exportTableData,
  type ExportColumn
} from '@/utils/exportUtils';   // 👈 add this

const toast = useToast();
const router = useRouter();
const pinboardStore = usePinboardStore();
const { fb, pinboards } = storeToRefs(pinboardStore);

const filters = ref({
    global: { value: null, matchMode: 'contains' },
    reference_number: { value: null, matchMode: 'contains' },
    job_title: { value: null, matchMode: 'contains' },
    organisation_name: { value: null, matchMode: 'contains' },
    grand_total_sp_inc_gst: { value: null, matchMode: 'equals' }
});

const emit = defineEmits(['editTabUnmunted']);

const selectedPinboards = ref<Pinboard[]>([]);

const fetchData = async () => {
    await pinboardStore.fetchPinboards();


    console.log(pinboards);


};

const addPinboard = () => {
    router.push('/pinboards/new');
};

const editPinboard = (data: Pinboard) => {
    if (data.pinboard_id) {
        router.push(`/pinboards/${data.pinboard_id}`);
    }
};

const viewPinboard = (data: Pinboard) => {
    if (data.pinboard_id) {
        router.push(`/pinboards/item/${data.pinboard_id}`);
    }
};

const deletePinboard = async (data: Pinboard) => {
    if (data.pinboard_id) {
        await pinboardStore.deletePinboard(data.pinboard_id);
    }
};

const sendEmailDraftPinboard = async () => {
    const response =  await pinboardStore.sendEmailDraftPinboard();
    if (response) {
    toast.add({ severity: 'success', summary: 'Email Send Success!', detail: 'Send email draft pinboards.', life: 4000 });
    }
};

const deleteSelectedPinboards = async () => {
    if (selectedPinboards.value.length > 0) {
        for (const pinboard of selectedPinboards.value) {
            if (pinboard.pinboard_id) {
                await pinboardStore.deletePinboard(pinboard.pinboard_id); 
            }
        }
        selectedPinboards.value = [];
    }
};

onMounted(() => {
    fetchData();
    emit('editTabUnmunted');
});

const clearFilter = () => {
    filters.value.global.value = null;
    filters.value.reference_number.value = null;
    filters.value.job_title.value = null;
    filters.value.organisation_name.value = null;
    filters.value.grand_total_sp_inc_gst.value = null;
};

const formatCurrency = (amount: string | number) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(numAmount || 0);
};

const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

const getStatusLabel = (data: Pinboard) =>
    data.pinboard_status?.name ||
    data.pinboardDetails?.pinboard_status_name ||
    'Draft';

const getStatusClass = (data: Pinboard) => {
    const id = data.pinboard_status?.order_status_id ?? data.pinboardDetails?.pinboard_status_id;
    if (id === 8) return 'bg-red-700 text-white';
    if (id === 0) return 'bg-green-700 text-white';
    return 'bg-gray-500 text-white';
};


// ==========================================================================
// Export (CSV / XLSX / PDF) — powered by exportUtils.js
// ==========================================================================
const exportMenuItems = [
  { label: 'Export as CSV', icon: 'pi pi-file', command: () => exportData('csv') },
  { label: 'Export as Excel (.xlsx)', icon: 'pi pi-file-excel', command: () => exportData('xlsx') },
  { label: 'Export as PDF', icon: 'pi pi-file-pdf', command: () => exportData('pdf') }
];

const pinboardColumns: ExportColumn<any>[] = [
  { accessor: (row) => row.pinboardDetails?.referenceNumber || '', header: 'Reference Number', width: 95 },
  { accessor: (row) => row.pinboardDetails?.pinboardName || '', header: 'Project Name', width: 120 },
  { accessor: (row) => row.customerDetails?.customer_name || '', header: 'Customer', width: 105 },
  { accessor: (row) => row.customerDetails?.customer_email || '', header: 'Email', width: 155 },
  { accessor: (row) => row.customerDetails?.customer_phone || '', header: 'Phone', width: 85 },
  { accessor: (row) => row.item_count ?? 0, header: 'Items', width: 40 },
  { accessor: (row) => formatDate(row.pinboardDetails?.created_at || ''), header: 'Created', width: 75 },
  { accessor: (row) => getStatusLabel(row), header: 'Status', width: 90, badge: true }
];

function getExportFileName(format: 'csv' | 'xlsx' | 'pdf', dataToExport: Pinboard[], today: string) {
  if (format === 'pdf') {
    const source =
      selectedPinboards.value.length === 1
        ? selectedPinboards.value[0]
        : dataToExport.length === 1
          ? dataToExport[0]
          : null;
    const jobTitle = source?.pinboardDetails?.jobTitle?.trim();
    if (jobTitle) return jobTitle;
  }
  return `pinboards_report_${today}`;
}

function exportData(format: 'csv' | 'xlsx' | 'pdf') {
  const dataToExport = pinboards.value || [];

  if (!dataToExport.length) {
    toast.add({
      severity: 'warn',
      summary: 'Export Failed',
      detail: 'There are no pinboards available to export.',
      life: 4000
    });
    return;
  }

  const today = new Date().toISOString().slice(0, 10);

  try {
    exportTableData(format, {
      columns: pinboardColumns,
      data: dataToExport,
      fileName: getExportFileName(format, dataToExport, today),
      title: 'Pinboards Report',
      paperSize: 'A3',
      orientation: 'portrait'
    });

    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: `${format.toUpperCase()} file downloaded successfully.`,
      life: 3000
    });
  } catch (error) {
    console.error(`${format.toUpperCase()} Export Error:`, error);
    toast.add({ severity: 'error', summary: 'Error', detail: `Failed to export ${format.toUpperCase()} file.`, life: 4000 });
  }
}

</script>

<template>
    <div class="pinboard-index">
        <DataTable
            v-model:filters="filters"
            v-model:selection="selectedPinboards"
            :value="pinboards"
            paginator
            :rows="10"
            dataKey="pinboard_id"
            filterDisplay="menu"
            :loading="fb.loading.pinboard"
            :globalFilterFields="['pinboardDetails.referenceNumber', 'pinboardDetails.jobTitle', 'customerDetails.organisationName']"
            selectionMode="multiple"
            class="th-table mb-4"
        >
            <template #header>
                <div class="flex justify-between items-center">
                    <div class="flex gap-2">
                        <Button
                            type="button"
                            icon="pi pi-filter-slash"
                            label="Clear"
                            outlined
                            @click="clearFilter()"
                        />
                        <SplitButton 
                            label="Export" 
                            icon="pi pi-download" 
                            :model="exportMenuItems" 
                            severity="secondary" 
                            size="small"
                            class="mr-2"
                            @click="exportData('csv')" 
                        />
                        <Button
                            v-if="selectedPinboards.length > 0"
                            type="button"
                            icon="pi pi-trash"
                            label="Delete Selected"
                            severity="danger"
                            @click="deleteSelectedPinboards"
                        />
                        <Button
                            type="button"
                            :disabled="fb.loading['pinboard.send_email']"
                            :loading="fb.loading['pinboard.send_email']"
                            :icon="fb.loading['pinboard.send_email'] ? 'pi pi-spinner pi-spin' : 'pi pi-send'" rounded
                            label="Send Email Draft Pinboard"
                            severity="info"
                            @click="sendEmailDraftPinboard"
                        />
                    </div>
                    <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                </div>
            </template>
            <template #empty> No pinboards to display! </template>
            <template #loading> Loading pinboards data. Please wait. </template>

            <Column selectionMode="multiple" headerStyle="width: 3rem" />
            
            <Column field="pinboardDetails.referenceNumber" header="Reference Number" style="min-width: 12rem" sortable>
                <template #body="{ data }">
                    <a 
                        @click="editPinboard(data)" 
                        class="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline font-medium"
                    >
                        {{ data.pinboardDetails.referenceNumber }}
                    </a>
                </template>
            </Column>

            <Column field="pinboardDetails.pinboardName" header="Project Name" style="min-width: 12rem" sortable>
                <template #body="{ data }">
                    <div class="font-medium">{{ data.pinboardDetails.pinboardName }}</div>
                </template>
            </Column>
            <Column field="customerDetails.customer_name" header="Customer" style="min-width: 12rem" sortable>
                <template #body="{ data }">
                    <div class="font-medium">{{ data.customerDetails.customer_name }}</div>
                    <div class="text-sm text-gray-600 mt-1">{{ data.customerDetails.customer_email }}</div>
                    <div class="text-sm text-gray-600 mt-1">{{ data.customerDetails.customer_phone }}</div>
                </template>
            </Column>
            <Column field="item_count" header="Items" style="min-width: 10rem" sortable></Column>
            <Column field="pinboardDetails.created_at" header="Created" style="min-width: 10rem" sortable>
                <template #body="{ data }">
                    {{ formatDate(data.pinboardDetails.created_at) }}
                </template>
            </Column>

            <Column field="pinboard_status.name" header="Status" style="min-width: 10rem" sortable>
                <template #body="{ data }">
                    <span
                        :class="['px-3 py-1 text-sm font-medium rounded-lg inline-block', getStatusClass(data)]"
                    >
                        {{ getStatusLabel(data) }}
                    </span>
                </template>
            </Column>
            
            <Column header="Actions" :exportable="false" style="min-width: 8rem">
                <template #body="{ data }">
                    <div class="flex gap-2">
                        <!-- view pinboard -->
                        <Button 
                            icon="pi pi-eye" 
                            rounded 
                            outlined 
                            severity="primary" 
                            class="mr-2"
                            @click="viewPinboard(data)"
                        />
                        <Button 
                            icon="pi pi-pencil" 
                            rounded 
                            outlined 
                            severity="success" 
                            class="mr-2"
                            @click="editPinboard(data)"
                        />
                        <Button 
                            icon="pi pi-trash" 
                            rounded 
                            outlined 
                            severity="danger"
                            @click="deletePinboard(data)"
                        />
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>
