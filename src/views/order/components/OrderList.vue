<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useOrderStore } from '@/stores/order';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { formatDate } from '@/utils/date';
import { formatCurrency } from '@/utils/currency';
import { Order } from '@/models/Order';
import OrderFilter from '@/filters/OrderFilter';

const router = useRouter();
const orderStore = useOrderStore();
const { fb, orders } = storeToRefs(orderStore);

const filters = ref({...new OrderFilter()});

const selectedOrders = ref([]);

const statusOptions = [
    { label: 'Open', value: 'Open' },
    { label: 'Complete', value: 'Complete' },
    { label: 'Processing', value: 'Processing' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Requires Action', value: 'Requires Action' }
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
    await orderStore.fetchOrders();
};

const addOrder = () => {
    router.push('/orders/new');
};

const editOrder = (data: Order) => {
    router.push(`/ecommerce/sales/orders/${data.order_id}/edit`);
};

const deleteOrder = async (data:any) => {
    await orderStore.deleteOrder(data.order_id);
};

const deleteSelectedOrders = async (selectedOrders:any) => {
    if (selectedOrders.value.length > 0) {
        for (const order of selectedOrders) {
            await orderStore.deleteOrder(order.order_id);
        }
        selectedOrders = [];
    }
};

onMounted(() => {
    fetchData();
});

const clearFilter = () => {
    filters.value = {...new OrderFilter()};
};
</script>

<template>
  <div class="order-index">
    <DataTable
        v-model:filters="filters"
        v-model:selection="selectedOrders"
        :value="orders"
        paginator
        :rows="10"
        dataKey="order_id"
        filterDisplay="menu"
        :loading="fb.loading['order.list']"
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
                        @click="deleteSelectedOrders(selectedOrders)"
                    />
                </div>
                <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
            </div>
        </template>
        <template #empty> No orders found. </template>
        <template #loading> Loading orders data. Please wait. </template>

        <Column selectionMode="multiple" headerStyle="width: 3rem" />
        
        <Column field="orderDetails.reference_no" header="Order Reference" style="min-width: 10rem">
            <template #body="{ data }">
                <a 
                    @click="editOrder(data)" 
                    class="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline"
                >
                    {{ data.orderDetails.reference_no }}
                </a>
            </template>
        </Column>

        <Column field="accountManagerDetails.first_name" header="Account Manager" style="min-width: 12rem">
            <template #body="{ data }">
                {{ data.accountManagerDetails.first_name }} {{ data.accountManagerDetails.last_name  }}
            </template>
        </Column>

        <Column field="status" header="Status" style="min-width: 12rem">
            <template #body="{ data }">
                <!-- <span :class="[
                    'px-3 py-1 text-sm font-medium rounded-lg',
                    data.orderDetails.status === 'Open' ? 'bg-amber-300 text-gray-900' :
                    data.orderDetails.status === 'Complete' ? 'bg-green-700 text-white' : 
                    data.orderDetails.status === 'Processing' ? 'bg-sky-200 text-gray-900' :
                    data.orderDetails.status === 'Pending' ? 'bg-sky-100 text-gray-900' :
                    'bg-amber-300 text-gray-900'
                ]" style="display: inline-block;">
                    {{ data.orderDetails.status }}
                </span> -->
                <span
                    :class="[
                        'px-3 py-1 text-sm font-medium rounded-lg',
                        data.orderDetails.order_status_id == '1' ? 'bg-amber-300 text-gray-900' :
                        data.orderDetails.order_status_id == '2' ? 'bg-green-700 text-white' :
                        data.orderDetails.order_status_id == '3' ? 'bg-sky-200 text-gray-900' :
                        data.orderDetails.order_status_id == '4' ? 'bg-sky-100 text-gray-900' :
                        data.orderDetails.order_status_id == '5' ? 'bg-red-700 text-white' :
                        data.orderDetails.order_status_id == '6' ? 'bg-gray-500 text-white' :
                        data.orderDetails.order_status_id == '7' ? 'bg-blue-500 text-white' :
                        'bg-amber-300 text-gray-900'
                    ]"
                    style="display: inline-block;"
                >
                        {{ data.orderDetails.order_status_id == '1' ? 'Pending' :
                            data.orderDetails.order_status_id == '2' ? 'Processing' :
                            data.orderDetails.order_status_id == '3' ? 'Complete' :
                            data.orderDetails.order_status_id == '4' ? 'Cancelled' :
                            data.orderDetails.order_status_id == '5' ? 'Requires Action' :
                            data.orderDetails.order_status_id == '6' ? 'Delivered' :
                            data.orderDetails.order_status_id == '7' ? 'Shipped' : 'Unknown' }}
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

        <Column field="total" header="Total" style="min-width: 10rem">
            <template #body="{ data }">
                {{ formatCurrency(data.orderDetails.total) }}
            </template>
        </Column>

        <Column field="date_added" header="Date Added" style="min-width: 12rem">
            <template #body="{ data }">
                {{ formatDate(data.orderDetails.created_at) }}
            </template>
        </Column>

        <Column field="date_modified" header="Date Modified" style="min-width: 12rem">
            <template #body="{ data }">
                {{ formatDate(data.orderDetails.updated_at) }}
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


</style> 
