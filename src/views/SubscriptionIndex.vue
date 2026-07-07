<script setup>
import { ref, onMounted } from 'vue';
import { useSubscriptionStore } from '../stores/subscription';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { formatDate } from '../utils/date';
import Card from 'primevue/card';

const router = useRouter();
const subscriptionStore = useSubscriptionStore();
const { loading, error, filteredSubscriptions } = storeToRefs(subscriptionStore);

const filters = ref({
    global: { value: null, matchMode: 'contains' },
    subscription_id: { value: null, matchMode: 'equals' },
    user: { value: null, matchMode: 'contains' },
    reason: { value: null, matchMode: 'contains' },
    status: { value: null, matchMode: 'equals' },
    action: { value: null, matchMode: 'equals' }
});

const selectedSubscriptions = ref([]);

const statusOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Processing', value: 'processing' },
    { label: 'Pending', value: 'pending' },
    { label: 'Cancelled', value: 'cancelled' }
];

const actionOptions = [
    { label: 'Upgrade', value: 'upgrade' },
    { label: 'Downgrade', value: 'downgrade' },
    { label: 'Renew', value: 'renew' },
    { label: 'Cancel', value: 'cancel' }
];

const fetchData = async () => {
    loading.value = true;
    await subscriptionStore.fetchSubscriptions();
    loading.value = false;
};

const addSubscription = () => {
    router.push('/ecommerce/sales/subscriptions/add');
};

const editSubscription = (data) => {
    router.push(`/ecommerce/sales/subscriptions/edit/1`);
};

const deleteSubscription = async (data) => {
    await subscriptionStore.deleteSubscription(data.subscription_id);
};

const deleteSelectedSubscriptions = async () => {
    if (selectedSubscriptions.value.length > 0) {
        for (const subscription of selectedSubscriptions.value) {
            await subscriptionStore.deleteSubscription(subscription.subscription_id);
        }
        selectedSubscriptions.value = [];
    }
};

onMounted(() => {
    fetchData();
});

const clearFilter = () => {
    subscriptionStore.clearFilter();
    filters.value.global.value = null;
};
</script>

<template>
    <div class="subscription-index">
        <DataTable
            v-model:filters="filters"
            v-model:selection="selectedSubscriptions"
            :value="filteredSubscriptions"
            paginator
            :rows="10"
            dataKey="subscription_id"
            filterDisplay="menu"
            :loading="loading"
            :globalFilterFields="['subscription_id', 'user', 'reason', 'status', 'action']"
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
                            v-if="selectedSubscriptions.length > 0"
                            type="button"
                            icon="pi pi-trash"
                            label="Delete Selected"
                            severity="danger"
                            @click="deleteSelectedSubscriptions"
                        />
                    </div>
                    <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                </div>
            </template>
            <template #empty> No subscriptions to display! </template>
            <template #loading> Loading subscriptions data. Please wait. </template>

            <Column selectionMode="multiple" headerStyle="width: 3rem" />
            
            <Column field="subscription_id" header="Subscription ID" style="min-width: 10rem">
                <template #body="{ data }">
                    <a 
                        @click="editSubscription(data)" 
                        class="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline"
                    >
                        #{{ data.subscription_id }}
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
                        data.action === 'upgrade' ? 'bg-amber-100 text-gray-900' : 
                        data.action === 'downgrade' ? 'bg-amber-100 text-gray-900' :
                        data.action === 'renew' ? 'bg-amber-100 text-gray-900' :
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
                            @click="editSubscription(data)"
                        />
                        <Button 
                            icon="pi pi-trash" 
                            rounded 
                            outlined 
                            severity="danger"
                            @click="deleteSubscription(data)"
                        />
                    </div>
                </template>
            </Column>
        </DataTable>

        <div class="subscription-area">

            <div class="flex justify-center items-center w-full">
                <Card class="w-[500px]">
                    <template #content>
                        <div class="flex flex-col items-center gap-6">
                            <div class="">
                                <i class="pi pi-sync text-4xl text-black"></i>
                            </div>
                            <div class="text-xl text-black">No subscriptions to display!</div>
                            <Button 
                                label="Add subscription" 
                                icon="pi pi-plus"
                                @click="addSubscription"
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
.subscription-index {
    padding: 2rem;
}

.subscription-area {
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

:deep(.p-card) {
    border: none;
    box-shadow: none;
}


</style> 