<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useToast } from 'primevue/usetoast';
import { useCouponStore } from '@/stores/coupon';
import CouponFilter from '@/filters/CouponFilter';

const router = useRouter();
const couponStore = useCouponStore();
const { coupons, fb } = storeToRefs(couponStore);
const filters = ref({ ...new CouponFilter() });
const toast = useToast();

const selectedDiscountCoupons = ref<any[]>([]);


const editCoupon = (data: any) => {
    router.push(`/coupons/edit/${data.coupon_id}`);
};

const deleteCoupon = async (data: any) => {
    try {
        await couponStore.deleteCoupon(data.coupon_id);
        toast.add({ severity: 'success', summary: 'Success', detail: 'Coupon deleted successfully', life: 3000 });
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete coupon.', life: 3000 });
    }
};

const clearFilter = () => {
    filters.value = { ...new CouponFilter() };
};

const typeOptions = [
    { label: 'Percentage', value: 'Percentage' },
    { label: 'Fixed', value: 'Fixed' }
];
const statusOptions = [
    { label: 'Enabled', value: 'Enabled' },
    { label: 'Disabled', value: 'Disabled' }
];

const editDiscountCoupon = (data: any) => {
    router.push(`/coupons/edit/${data.coupon_id}/overview`);
};


watch(coupons.value, () => {

});

const deleteSelectedDiscountCoupons = async () => {
    if (selectedDiscountCoupons.value.length > 0) {
        for (const coupons of selectedDiscountCoupons.value) {
            await couponStore.deleteCoupon(coupons.coupon_id);
        }
        selectedDiscountCoupons.value = [];
    }
};

onMounted(() => {
    couponStore.fetchCoupons();
    console.log("this is list page", coupons);

});
</script>

<template>
    <div class="coupon-index">
        <DataTable v-model:filters="filters" v-model:selection="selectedDiscountCoupons" :value="coupons" paginator
            :rows="10" dataKey="coupon_id" filterDisplay="menu" :loading="fb.loading['coupon.list']"
            :globalFilterFields="['name', 'code', 'discount', 'type', 'free_shipping', 'status']"
            selectionMode="multiple" class="th-table">
            <template #header>
                <div class="flex justify-between items-center">
                    <div class="flex gap-2">
                        <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                        <Button v-if="selectedDiscountCoupons.length > 0" type="button" icon="pi pi-trash"
                            label="Delete Selected" severity="danger" @click="deleteSelectedDiscountCoupons" />
                    </div>
                    <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                </div>
            </template>

            <template #empty> No coupons to display! </template>
            <template #loading> Loading coupon data. Please wait. </template>

            <Column selectionMode="multiple" headerStyle="width: 3rem" />

            <Column field="name" header="Name" style="min-width: 12rem">
                <template #body="{ data }">
                    <a @click="editDiscountCoupon(data)"
                        class="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline">
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
                    <Dropdown v-model="filterModel.value" :options="typeOptions" optionLabel="label" optionValue="value"
                        placeholder="Select Type" class="p-2" />
                </template>
            </Column>
            <Column field="free_shipping" header="Free Shipping" style="min-width: 12rem">
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
                    <Dropdown v-model="filterModel.value" :options="statusOptions" optionLabel="label"
                        optionValue="value" placeholder="Select Status" class="p-2" />
                </template>
            </Column>

            <Column header="Actions" :exportable="false" style="min-width: 8rem">
                <template #body="{ data }">
                    <div class="flex gap-2">
                        <Button
                            :icon="fb.loading['coupon.edit.' + data.coupon_id] ? 'pi pi-spinner pi-spin' : 'pi pi-pencil'"
                            rounded outlined severity="success" 
                            class="mr-2" 
                            :disabled="fb.loading['coupon.edit.' + data.coupon_id]"
                            @click="editCoupon(data)" />
                        <Button
                            :icon="fb.loading['coupon.delete.' + data.coupon_id] ? 'pi pi-spinner pi-spin' : 'pi pi-trash'"
                            rounded outlined severity="danger" 
                            :disabled="fb.loading['coupon.delete.' + data.coupon_id]"
                            @click="deleteCoupon(data)" />
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


.p-datatable .p-datatable-tbody>tr>td {
    padding: 1rem;
}
</style>