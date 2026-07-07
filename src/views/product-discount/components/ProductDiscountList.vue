<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useToast } from 'primevue/usetoast';
import { useProductDiscountStore } from '@/stores/productDiscount';
import ProductDiscountFilter from '@/filters/ProductDiscountFilter';

const router = useRouter();
const productDiscountStore = useProductDiscountStore();
const { productDiscounts, fb } = storeToRefs(productDiscountStore);
const filters = ref({ ...new ProductDiscountFilter() });
const toast = useToast();

const editProductDiscount = (data: any) => {
    router.push(`/product-discounts/edit/${data.product_discount_id}`);
};

const deleteProductDiscount = async (data: any) => {
    try {
        await productDiscountStore.deleteProductDiscount(data.product_discount_id);
        toast.add({ severity: 'success', summary: 'Success', detail: 'Product discount deleted successfully', life: 3000 });
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete product discount.', life: 3000 });
    }
};

const clearFilter = () => {
    filters.value = { ...new ProductDiscountFilter() };
};


watch(productDiscounts.value, () => {

});

onMounted(() => {
    productDiscountStore.fetchProductDiscounts();
});
</script>

<template>
    <div class="product-discount-list">
        <DataTable v-model:filters="filters" :value="productDiscounts" paginator :rows="10"
            dataKey="product_discount_id" filterDisplay="menu" :loading="fb.loading['productDiscount.list']"
            :globalFilterFields="['product_name', 'quantity', 'price']" selectionMode="multiple" class="th-table">
            <template #header>
                <div class="flex justify-between items-center">
                    <div class="flex gap-2">
                        <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                    </div>
                    <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                </div>
            </template>
            <template #empty> No product discounts to display! </template>
            <template #loading>
                <div class="flex items-center justify-center gap-2 py-8">
                    <i class="pi pi-spinner pi-spin" style="font-size: 2rem"></i>
                </div>
            </template>
            <Column field="user_group_name" header="User Group Name" style="min-width: 5rem" sortable>
                <template #body="{ data }">
                    <a @click="editProductDiscount(data)"
                        class="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline">
                        {{ data.user_group_name }}
                    </a>
                </template>
            </Column>

            <Column field="product_code" header="Product Code" style="min-width: 12rem" sortable>
                <template #body="{ data }">
                    {{ data.product_code }}
                </template>
            </Column>

            <Column field="quantity" header="Queantity" style="min-width: 12rem" sortable>
                <template #body="{ data }">
                    {{ data.quantity }}
                </template>
            </Column>
            <Column field="priority" header="Priority" style="min-width: 12rem" sortable>
                <template #body="{ data }">
                    {{ data.priority }}
                </template>
            </Column>
            <Column field="price" header="Price" style="min-width: 12rem" sortable>
                <template #body="{ data }">
                    {{ data.price }}
                </template>
            </Column>

            <Column field="from_date" header="From Date" style="min-width: 12rem" sortable>
                <template #body="{ data }">
                    {{ data.from_date }}
                </template>
            </Column>
            <Column field="to_date" header="To Date" style="min-width: 12rem" sortable>
                <template #body="{ data }">
                    {{ data.to_date }}
                </template>
            </Column>

            <Column header="Actions" :exportable="false" style="min-width: 8rem">
                <template #body="{ data }">
                    <div class="flex gap-2">
                        <Button
                            :icon="fb.loading['productDiscount.update.' + data.product_discount_id] ? 'pi pi-spinner pi-spin' : 'pi pi-pencil'"
                            :disabled="fb.loading['productDiscount.update.' + data.product_discount_id]" rounded
                            outlined severity="success" class="mr-2" @click="editProductDiscount(data)" />
                        <Button 
                        :icon="fb.loading['productDiscount.delete.' + data.product_discount_id] ? 'pi pi-spinner pi-spin' : 'pi pi-trash'"
                        :disabled="fb.loading['productDiscount.delete.' + data.product_discount_id]" rounded outlined severity="danger"
                            @click="deleteProductDiscount(data)" />
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>