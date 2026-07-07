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

const emit = defineEmits(['editTabUnmunted']);

const selectedPinboards = ref<Pinboard[]>([]);

const deleteSelectedPinboards = async () => {
    if (selectedPinboards.value.length > 0) {
        for (const pinboard of selectedPinboards.value) {
            if (pinboard.pinboard_temp_id) {
                await pinboardStore.deletePinboard(pinboard.pinboard_temp_id); 
            }
        }
        selectedPinboards.value = [];
    }
};

onMounted(() => {
   pinboardStore.fetchTemporaryPinboards();
    emit('editTabUnmunted');
});

const clearFilter = () => {
    filters.value.global.value = null;
    filters.value.reference_number.value = null;
    filters.value.job_title.value = null;
    filters.value.organisation_name.value = null;
    filters.value.grand_total_sp_inc_gst.value = null;
};

const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

const viewTemporaryPinboard = (data: Pinboard) => {
    if (data.pinboard_temp_id) {
        router.push(`/pinboards/item/${data.pinboard_temp_id}`);
    }
};

const editTemporaryPinboard = (data: Pinboard) => {
    if (data.pinboard_temp_id) {
        router.push(`/pinboards/${data.pinboard_temp_id}/pinboard-temporary-overview`);
    }
};

const deleteTemporaryPinboard = async (data: Pinboard) => {
    if (data.pinboard_temp_id) {
        await pinboardStore.deleteTemporaryPinboard(data.pinboard_temp_id);
    }
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
            dataKey="pinboard_temp_id"
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
            
            <Column field="pinboardDetails.referenceNumber" header="Reference Number" style="min-width: 12rem" sortable>
                <template #body="{ data }">
                    <a 
                        @click="editTemporaryPinboard(data)" 
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
            <Column field="customerDetails.customer_email" header="Customer Email" style="min-width: 12rem" sortable>
                <template #body="{ data }">
                    <div class="font-medium">{{ data.customerDetails.customer_email }}</div>
                </template>
            </Column>
 
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
                            @click="viewTemporaryPinboard(data)"
                        />
                        <!-- <Button 
                            icon="pi pi-pencil" 
                            rounded 
                            outlined 
                            severity="success" 
                            class="mr-2"
                            @click="editTemporaryPinboard(data)"
                        /> -->
                        <Button 
                            icon="pi pi-trash" 
                            rounded 
                            outlined 
                            severity="danger"
                            @click="deleteTemporaryPinboard(data)"
                        />
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>
