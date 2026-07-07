<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useToast } from 'primevue/usetoast';
import { useServiceRequestStore } from '@/stores/serviceRequest';
import { formatDate } from '@/utils/date';

const router = useRouter();
const serviceRequestStore = useServiceRequestStore();
const { serviceRequests, fb } = storeToRefs(serviceRequestStore);
const filters = ref({ global: { value: null, matchMode: 'contains' }, form_type: { value: null, matchMode: 'contains' } });
const isLoading = computed(() => fb?.value?.loading === true);
const toast = useToast();

const resolveId = (data: any) => data.service_request_id;

const editServiceRequest = (data: any) => {
    router.push(`/service-requests/edit/${resolveId(data)}`);
};

const deleteServiceRequest = async (data: any) => {
    try {
        await serviceRequestStore.deleteServiceRequest(resolveId(data));
        toast.add({ severity: 'success', summary: 'Success', detail: 'Service request deleted successfully', life: 3000 });
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete service request.', life: 3000 });
    }
};

const clearFilter = () => {
    filters.value = { global: { value: null, matchMode: 'contains' }, form_type: { value: null, matchMode: 'contains' } };
};

onMounted(() => {
    serviceRequestStore.fetchServiceRequests();
});
</script>

<template>
    <DataTable
        v-model:filters="filters"
        :value="serviceRequests"
        paginator
        :rows="10"
        dataKey="service_request_id"
        filterDisplay="menu"
        :loading="isLoading"
        :globalFilterFields="['full_name', 'first_name', 'last_name', 'email', 'phone_number', 'content', 'form_type', 'company']"
        class="th-table"
    >
        <template #header>
            <div class="flex justify-between items-center">
                <div class="flex gap-2">
                    <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                </div>
                <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
            </div>
        </template>
        <template #empty>No service requests found.</template>
        <template #loading>Loading service requests data. Please wait.</template>

        <Column v-if="false" field="full_name" header="Customer" style="min-width: 12rem" filterField="full_name" sortable>
            <template #body="{ data }">
                <a @click="editServiceRequest(data)" class="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline">
                    {{ data.customer_name || '-' }}
                </a>
            </template>
        </Column>
        <Column field="email" header="Email" style="min-width: 12rem" filterField="email" sortable />
        <Column field="phone_number" header="Phone" style="min-width: 10rem" filterField="phone_number" sortable />
        <Column
            field="form_type"
            header="Form Type"
            style="min-width: 10rem"
            filterField="form_type"
            sortable
            :filter="true"
            :showFilterMenu="true"
        >
            <template #filter="{ filterModel, filterCallback }">
                <InputText
                    v-model="filterModel.value"
                    placeholder="Search by Form Type"
                    @input="filterCallback()"
                    class="p-column-filter"
                    style="width: 100%"
                />
            </template>
        </Column>
        <Column field="content" header="Message" style="width: 200px; max-width: 200px; min-width: 200px;" filterField="content">
            <template #body="{ data }">
                <div style="max-width: 200px; white-space: normal; word-break: break-word;">
                    {{ data.content || '-' }}
                </div>
            </template>
        </Column>
        <Column field="created_at" header="Date" style="min-width: 10rem" filterField="created_at" sortable>
            <template #body="{ data }">
                {{ formatDate(data.created_at) }}
            </template>
        </Column>
        <Column header="Actions" :exportable="false" style="min-width: 8rem">
            <template #body="{ data }">
                <div class="flex gap-2">
                    <Button rounded outlined severity="success" icon="pi pi-pencil" @click="editServiceRequest(data)" />
                    <Button rounded outlined severity="danger" icon="pi pi-trash" @click="deleteServiceRequest(data)" />
                </div>
            </template>
        </Column>
    </DataTable>
</template>
