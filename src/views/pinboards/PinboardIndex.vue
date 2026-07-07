<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { usePinboardStore } from '@/stores/pinboard';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { Pinboard } from '@/models/Pinboard';

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

const selectedPinboards = ref<Pinboard[]>([]);

const fetchData = async () => {
    await pinboardStore.fetchPinboards();
};

const addPinboard = () => {
    router.push('/pinboards/new');
};

const editPinboard = (data: Pinboard) => {
    if (data.pinboard_id) {
        router.push(`/pinboards/${data.pinboard_id}`);
    }
};

const deletePinboard = async (data: Pinboard) => {
    if (data.pinboard_id) {
        await pinboardStore.deletePinboard(data.pinboard_id);
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
                        <Button
                            v-if="selectedPinboards.length > 0"
                            type="button"
                            icon="pi pi-trash"
                            label="Delete Selected"
                            severity="danger"
                            @click="deleteSelectedPinboards"
                        />
                    </div>
                    <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                </div>
            </template>
            <template #empty> No pinboards to display! </template>
            <template #loading> Loading pinboards data. Please wait. </template>

            <Column selectionMode="multiple" headerStyle="width: 3rem" />
            
            <Column field="pinboardDetails.referenceNumber" header="Reference Number" style="min-width: 12rem">
                <template #body="{ data }">
                    <a 
                        @click="editPinboard(data)" 
                        class="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline font-medium"
                    >
                        {{ data.pinboardDetails.referenceNumber }}
                    </a>
                </template>
            </Column>

            <Column field="pinboardDetails.jobTitle" header="Job Title" style="min-width: 15rem">
                <template #body="{ data }">
                    <div class="font-medium">{{ data.pinboardDetails.jobTitle }}</div>
                    <div class="text-sm text-gray-600 mt-1">{{ data.pinboardDetails.pinboardDescription }}</div>
                </template>
            </Column>

            <Column field="customerDetails.organisationName" header="Customer" style="min-width: 12rem">
                <template #body="{ data }">
                    <div class="font-medium">{{ data.customerDetails.organisationName }}</div>
                    <div class="text-sm text-gray-600 mt-1">{{ data.customerDetails.organisationCode }}</div>
                </template>
            </Column>

            <Column field="pinboardDetails.customerPO" header="PO Number" style="min-width: 10rem">
                <template #body="{ data }">
                    {{ data.pinboardDetails.customerPO || '-' }}
                </template>
            </Column>

            <Column field="pinboardTotals.grandTotalSpIncGst" header="Total Amount" style="min-width: 10rem">
                <template #body="{ data }">
                    <div class="font-medium text-green-600">
                        {{ formatCurrency(data.pinboardTotals.grandTotalSpIncGst) }}
                    </div>
                </template>
            </Column>

            <Column field="pinboardDetails.expiryDate" header="Expiry Date" style="min-width: 10rem">
                <template #body="{ data }">
                    {{ formatDate(data.pinboardDetails.expiryDate) }}
                </template>
            </Column>

            <Column field="pinboard_status.name" header="Status" style="min-width: 10rem">
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

<style scoped>
.pinboard-index {
    padding: 2rem;
}

.pinboard-area {
    padding: 2rem;
    min-height: 200px;
    background-color: #f8f9fa;
}

.p-datatable .p-datatable-tbody > tr > td {
    padding: 1.5rem 1rem;
}

.p-button {
    border: none;
}

.p-card {
    background-color: #f8f9fa;
    border: none;
    box-shadow: none;
}

:deep(.p-datatable-tbody > tr) {
    height: 100px;
}
</style> 