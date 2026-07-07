<script setup>
import { ref, onMounted } from 'vue';
import { useCouponStore } from '../../stores/coupon';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { formatDate } from '../../utils/date';
import Card from 'primevue/card';

const router = useRouter();
const couponStore = useCouponStore();
const { fb, coupons } = storeToRefs(couponStore);

const filters = ref({
    global: { value: null, matchMode: 'contains' },
    name: { value: null, matchMode: 'contains' },
    code: { value: null, matchMode: 'contains' },
    type: { value: null, matchMode: 'equals' },
    status: { value: null, matchMode: 'equals' }
});

const selectedDiscountCoupons = ref([]);

const typeOptions = [
    { label: 'Percentage', value: 'Percentage' },
    { label: 'Fixed', value: 'Fixed' }
];

const statusOptions = [
    { label: 'Enabled', value: 'Enabled' },
    { label: 'Disabled', value: 'Disabled' }
];

const fetchData = async () => {
    await couponStore.fetchCoupons();
};

const addDiscountCoupon = () => {
    router.push('/coupons/add');
};

const editDiscountCoupon = (data) => {
    router.push(`/coupons/${data.coupon_id}`);
};

const deleteDiscountCoupon = async (data) => {
    await couponStore.deleteCoupon(data.coupon_id);
};

const deleteSelectedDiscountCoupons = async () => {
    if (selectedDiscountCoupons.value.length > 0) {
        for (const coupon of selectedDiscountCoupons.value) {
            await couponStore.deleteCoupon(coupon.coupon_id);
        }
        selectedDiscountCoupons.value = [];
    }
};

onMounted(() => {
    fetchData();
});

const clearFilter = () => {
    // Clear filters manually since we don't have clearFilter in new store
    filters.value.global.value = null;
    filters.value.name.value = null;
    filters.value.code.value = null;
    filters.value.type.value = null;
    filters.value.status.value = null;
};
</script>

<template>
    <div class="discount-coupon-index">
        <div class="flex justify-end gap-2 mb-6">
            <Button
                icon="pi pi-plus"
                label="Add Discount Coupon"
                severity="primary"
                @click="addDiscountCoupon"
            />
        </div>
        <DataTable
            v-model:filters="filters"
            v-model:selection="selectedDiscountCoupons"
            :value="coupons"
            paginator
            :rows="10"
            dataKey="coupon_id"
            filterDisplay="menu"
            :loading="fb.loading.coupon"
            :globalFilterFields="['name', 'code', 'discount', 'type', 'free_shipping', 'status']"
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
                            v-if="selectedDiscountCoupons.length > 0"
                            type="button"
                            icon="pi pi-trash"
                            label="Delete Selected"
                            severity="danger"
                            @click="deleteSelectedDiscountCoupons"
                        />
                    </div>
                    <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                </div>
            </template>
            <template #empty> No discount coupons to display! </template>
            <template #loading> Loading discount coupons data. Please wait. </template>

            <Column selectionMode="multiple" headerStyle="width: 3rem" />
            
            <Column field="name" header="Name" style="min-width: 12rem">
                <template #body="{ data }">
                    <a 
                        @click="editDiscountCoupon(data)" 
                        class="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline"
                    >
                        {{ data.name }}
                    </a>
                </template>
            </Column>

            <Column field="code" header="Code" style="min-width: 10rem">
                <template #body="{ data }">
                    {{ data.code }}
                </template>
            </Column>

            <Column field="discount" header="Discount" style="min-width: 10rem">
                <template #body="{ data }">
                    {{ data.discount }} {{ data.type === 'P' ? '%' : '' }}
                </template>
            </Column>

            <Column field="type" header="Type" style="min-width: 10rem">
                <template #body="{ data }">
                    <span :class="[
                        'px-3 py-1 text-sm font-medium rounded-lg',
                        data.type === 'P' ? 'bg-sky-200 text-gray-900' : 'bg-amber-200 text-gray-900'
                    ]" style="display: inline-block;">
                        {{ data.type === 'P' ? 'Percentage' : 'Fixed' }}
                    </span>
                </template>
                <template #filter="{ filterModel }">
                    <Dropdown
                        v-model="filterModel.value"
                        :options="typeOptions"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Select Type"
                        class="p-2"
                    />
                </template>
            </Column>

            <Column field="free_shipping" header="Free Shipping" style="min-width: 10rem">
                <template #body="{ data }">
                    {{ data.free_shipping ? 'Yes' : 'No' }}
                </template>
            </Column>

            <Column field="status" header="Status" style="min-width: 10rem">
                <template #body="{ data }">
                    <span :class="[
                        'px-3 py-1 text-sm font-medium rounded-lg',
                        data.status === 1 ? 'bg-emerald-500 text-gray-900' : 'bg-gray-100 text-gray-900'
                    ]" style="display: inline-block;">
                        {{ data.status === 1 ? 'Enabled' : 'Disabled' }}
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
            
            <Column header="Actions" :exportable="false" style="min-width: 8rem">
                <template #body="{ data }">
                    <div class="flex gap-2">
                        <Button 
                            icon="pi pi-pencil" 
                            rounded 
                            outlined 
                            severity="success" 
                            class="mr-2"
                            @click="editDiscountCoupon(data)"
                        />
                        <Button 
                            icon="pi pi-trash" 
                            rounded 
                            outlined 
                            severity="danger"
                            @click="deleteDiscountCoupon(data)"
                        />
                    </div>
                </template>
            </Column>
        </DataTable>

    </div>
</template>

<style scoped>
.discount-coupon-index {
    padding: 2rem;
}


.p-datatable .p-datatable-tbody > tr > td {
    padding: 1rem;
}

</style>