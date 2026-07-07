<script setup>
import { ref, onMounted, computed } from 'vue';
import { useOrderStore } from '../stores/order';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { formatDate } from '../utils/date';

const router = useRouter();
const orderStore = useOrderStore();
const { loading, error, filteredOrders } = storeToRefs(orderStore);

const filters = ref({
    global: { value: null, matchMode: 'contains' },
    order_id: { value: null, matchMode: 'equals' },
    user: { value: null, matchMode: 'contains' },
    status: { value: null, matchMode: 'equals' },
    payment_status: { value: null, matchMode: 'equals' },
    shipping_status: { value: null, matchMode: 'equals' },
    total: { value: null, matchMode: 'equals' }
});

const selectedOrders = ref([]);

const statusOptions = [
    { label: 'Complete', value: 'complete' },
    { label: 'Processing', value: 'processing' },
    { label: 'Pending', value: 'pending' },
    { label: 'Requires Action', value: 'requires_action' }
];

const paymentStatusOptions = [
    { label: 'Paid', value: 'paid' },
    { label: 'Awaiting', value: 'awaiting' },
    { label: 'Partially Refunded', value: 'partially_refunded' },
    { label: 'Not Paid', value: 'not_paid' }
];

const shippingStatusOptions = [
    { label: 'Fulfilled', value: 'fulfilled' },
    { label: 'Not Fulfilled', value: 'not_fulfilled' }
];

const fetchData = async () => {
    loading.value = true;
    await orderStore.fetchOrders();
    loading.value = false;
};

const addOrder = () => {
    router.push('/orders/new');
};

const editOrder = (data) => {
    router.push(`/orders/${data.order_id}/edit`);
};

const deleteOrder = async (data) => {
    await orderStore.deleteOrder(data.order_id);
};

const deleteSelectedOrders = async () => {
    if (selectedOrders.value.length > 0) {
        for (const order of selectedOrders.value) {
            await orderStore.deleteOrder(order.order_id);
        }
        selectedOrders.value = [];
    }
};

onMounted(() => {
    fetchData();
});

const clearFilter = () => {
    orderStore.clearFilter();
    filters.value.global.value = null;
};
</script>

<template>
    <div class="order-index">

        <DataTable
            v-model:filters="filters"
            v-model:selection="selectedOrders"
            :value="filteredOrders"
            paginator
            :rows="10"
            dataKey="order_id"
            filterDisplay="menu"
            :loading="loading"
            :globalFilterFields="['order_id', 'user', 'status', 'payment_status', 'shipping_status', 'total']"
            selectionMode="multiple"
            class="th-table"
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
                            v-if="selectedOrders.length > 0"
                            type="button"
                            icon="pi pi-trash"
                            label="Delete Selected"
                            severity="danger"
                            @click="deleteSelectedOrders"
                        />
                    </div>
                    <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                </div>
            </template>
            <template #empty> No orders found. </template>
            <template #loading> Loading orders data. Please wait. </template>

            <Column selectionMode="multiple" headerStyle="width: 3rem" />
            
            <Column field="order_id" header="Order ID" style="min-width: 8rem">
                <template #body="{ data }">
                    <a 
                        @click="editOrder(data)" 
                        class="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline"
                    >
                        {{ data.order_id }}
                    </a>
                </template>
            </Column>

            <Column field="user" header="User" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.user }}
                </template>
            </Column>

            <Column field="status" header="Status" style="min-width: 12rem">
                <template #body="{ data }">
                    <span :class="[
                        'px-3 py-1 text-sm font-medium rounded-lg',
                        data.status === 'complete' ? 'bg-green-700 text-white' : 
                        data.status === 'processing' ? 'bg-sky-200 text-gray-900' :
                        data.status === 'pending' ? 'bg-sky-100 text-gray-900' :
                        'bg-amber-300 text-gray-900'
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

            <Column field="payment_status" header="Payment Status" style="min-width: 12rem">
                <template #body="{ data }">
                    <span :class="[
                        'px-3 py-1 text-sm font-medium rounded-lg',
                        data.payment_status === 'not_paid' ? 'bg-amber-400 text-gray-900' : 
                        'bg-amber-100 text-gray-900'
                    ]" style="display: inline-block;">
                        {{ data.payment_status }}
                    </span>
                </template>
                <template #filter="{ filterModel }">
                    <Dropdown
                        v-model="filterModel.value"
                        :options="paymentStatusOptions"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Select Payment Status"
                        class="p-2"
                    />
                </template>
            </Column>

            <Column field="shipping_status" header="Shipping Status" style="min-width: 12rem">
                <template #body="{ data }">
                    <span class="px-3 py-1 text-sm font-medium rounded-lg bg-amber-100 text-gray-900" style="display: inline-block;">
                        {{ data.shipping_status || 'not_fulfilled' }}
                    </span>
                </template>
                <template #filter="{ filterModel }">
                    <Dropdown
                        v-model="filterModel.value"
                        :options="shippingStatusOptions"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Select Shipping Status"
                        class="p-2"
                    />
                </template>
            </Column>

            <Column field="total" header="Total" style="min-width: 10rem">
                <template #body="{ data }">
                    {{ data.total }}
                </template>
            </Column>

            <Column field="date_added" header="Date Added" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ formatDate(data.date_added) }}
                </template>
            </Column>

            <Column field="date_modified" header="Date Modified" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ formatDate(data.date_modified) }}
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
                            @click="editOrder(data)"
                        />
                        <Button 
                            icon="pi pi-trash" 
                            rounded 
                            outlined 
                            severity="danger"
                            @click="deleteOrder(data)"
                        />
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>


<style scoped>
.order-index {
    padding: 2rem;
}

.p-datatable .p-datatable-thead > tr > th {
    background-color: var(--surface-100);
}

.p-datatable .p-datatable-tbody > tr > td {
    padding: 1rem;
}
</style> 