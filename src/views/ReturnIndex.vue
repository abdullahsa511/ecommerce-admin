<script setup>
import { ref, onMounted } from 'vue';
import { useReturnStore } from '../stores/return';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { formatDate } from '../utils/date';
import Card from 'primevue/card';

const router = useRouter();
const returnStore = useReturnStore();
const { loading, error, filteredReturns } = storeToRefs(returnStore);

const filters = ref({
    global: { value: null, matchMode: 'contains' },
    return_id: { value: null, matchMode: 'equals' },
    user: { value: null, matchMode: 'contains' },
    reason: { value: null, matchMode: 'contains' },
    status: { value: null, matchMode: 'equals' },
    action: { value: null, matchMode: 'equals' }
});

const selectedReturns = ref([]);

const statusOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Processing', value: 'processing' },
    { label: 'Pending', value: 'pending' },
    { label: 'Cancelled', value: 'cancelled' }
];

const actionOptions = [
    { label: 'Refund', value: 'refund' },
    { label: 'Exchange', value: 'exchange' },
    { label: 'Cancel', value: 'cancel' }
];

const fetchData = async () => {
    loading.value = true;
    await returnStore.fetchReturns();
    loading.value = false;
};

const addReturn = () => {
    router.push('/ecommerce/sales/add-return');
};

const editReturn = (data) => {
    router.push(`/ecommerce/sales/edit-return/1`);
};

const deleteReturn = async (data) => {
    await returnStore.deleteReturn(data.return_id);
};

const deleteSelectedReturns = async () => {
    if (selectedReturns.value.length > 0) {
        for (const returnItem of selectedReturns.value) {
            await returnStore.deleteReturn(returnItem.return_id);
        }
        selectedReturns.value = [];
    }
};

onMounted(() => {
    fetchData();
});

const clearFilter = () => {
    returnStore.clearFilter();
    filters.value.global.value = null;
};
</script>

<template>
    <div class="return-index">
        <DataTable
            v-model:filters="filters"
            v-model:selection="selectedReturns"
            :value="filteredReturns"
            paginator
            :rows="10"
            dataKey="return_id"
            filterDisplay="menu"
            :loading="loading"
            :globalFilterFields="['return_id', 'user', 'reason', 'status', 'action']"
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
                            v-if="selectedReturns.length > 0"
                            type="button"
                            icon="pi pi-trash"
                            label="Delete Selected"
                            severity="danger"
                            @click="deleteSelectedReturns"
                        />
                    </div>
                    <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                </div>
            </template>
            <template #empty> No returns to display! </template>
            <template #loading> Loading returns data. Please wait. </template>

            <Column selectionMode="multiple" headerStyle="width: 3rem" />
            
            <Column field="return_id" header="Return ID" style="min-width: 8rem">
                <template #body="{ data }">
                    <a 
                        @click="editReturn(data)" 
                        class="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline"
                    >
                        #{{ data.return_id }}
                    </a>
                </template>
            </Column>

            <Column field="user" header="User" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.user }}
                </template>
            </Column>

            <Column field="reason" header="Reason" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.reason }}
                </template>
            </Column>

            <Column field="status" header="Status" style="min-width: 12rem">
                <template #body="{ data }">
                    <span :class="[
                        'px-3 py-1 text-sm font-medium rounded-lg',
                        data.status === 'active' ? 'bg-emerald-500 text-gray-900' : 
                        data.status === 'processing' ? 'bg-sky-200 text-gray-900' :
                        data.status === 'pending' ? 'bg-sky-200 text-gray-900' :
                        'bg-amber-400 text-gray-900'
                    ]" style="display: inline-block;">
                        {{ data.status }}
                    </span>
                </template>
                <template #filter="{ filterModel }">
                    <Dropdown
                        v-model="filterModel.value"
                        :options="statusOptions"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Select Status"
                        class="p-2"
                    />
                </template>
            </Column>

            <Column field="action" header="Action" style="min-width: 12rem">
                <template #body="{ data }">
                    <span :class="[
                        'px-3 py-1 text-sm font-medium rounded-lg',
                        data.action === 'refund' ? 'bg-amber-100 text-gray-900' : 
                        data.action === 'exchange' ? 'bg-amber-100 text-gray-900' :
                        'bg-amber-400 text-gray-900'
                    ]" style="display: inline-block;">
                        {{ data.action }}
                    </span>
                </template>
                <template #filter="{ filterModel }">
                    <Dropdown
                        v-model="filterModel.value"
                        :options="actionOptions"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Select Action"
                        class="p-2"
                    />
                </template>
            </Column>

            <Column field="date_ordered" header="Date Ordered" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ formatDate(data.date_ordered) }}
                </template>
            </Column>

            <Column field="date_added" header="Date Added" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ formatDate(data.date_added) }}
                </template>
            </Column>

            <Column field="date_updated" header="Date Updated" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ formatDate(data.date_updated) }}
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
                            @click="editReturn(data)"
                        />
                        <Button 
                            icon="pi pi-trash" 
                            rounded 
                            outlined 
                            severity="danger"
                            @click="deleteReturn(data)"
                        />
                    </div>
                </template>
            </Column>
        </DataTable>

        <div class="return-area">
            <div class="flex justify-center items-center w-full">
                <Card class="w-[500px]">
                    <template #content>
                        <div class="flex flex-col items-center gap-6">
                            <div class="">
                                <i class="pi pi-arrow-left text-4xl text-black"></i>
                            </div>
                            <div class="text-xl text-black">No returns to display!</div>
                            <Button 
                                label="Add return" 
                                icon="pi pi-plus"
                                @click="addReturn"
                                class="bg-blue-600 hover:bg-blue-700 border-none text-white px-4 py-2 rounded-lg"
                            />
                        </div>
                    </template>
                </Card>
            </div>
        </div>
    </div>
</template>

<style scoped>
.return-index {
    padding: 2rem;
}

.return-area {
    padding: 2rem;
    min-height: 200px;
    background-color: #f8f9fa;
}

.p-datatable .p-datatable-tbody > tr > td {
    padding: 1rem;
}

.p-button {
    border: none;
}

.p-card {
    background-color: #f8f9fa;
    border: none;
    box-shadow: none;
}
</style> 