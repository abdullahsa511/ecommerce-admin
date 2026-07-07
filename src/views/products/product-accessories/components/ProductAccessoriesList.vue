<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useToast } from 'primevue/usetoast';
import AccessoriesFilter from '@/filters/AccessoriesFilter';
import { useProductAccessoriesStore } from '@/stores/productAccessories';

const router = useRouter();
const productAccessoriesStore = useProductAccessoriesStore();
const { productAccessoriess, fb } = storeToRefs(productAccessoriesStore);

const filters = ref({ ...new AccessoriesFilter() });
const toast = useToast();

const editAccessories = (data: any) => {
    router.push(`/product-accessories/edit/${data.product_accessories_id}`);
};

const deleteAccessories = async (data: any) => {
    try {
        await productAccessoriesStore.deleteProductAccessories(data.product_accessories_id);
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Product accessories deleted successfully.',
            life: 3000,
        });
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete product accessories.',
            life: 3000,
        });
    }
};

const clearFilter = () => {
    filters.value = { ...new AccessoriesFilter() };
};

const renderIcon = (icon: string, action: string, id: number) => {
    return fb.value.loading[`productAccessories.${action}.${id}`] ? 'pi pi-spinner pi-spin' : icon;
};

onMounted(async () => {
    await productAccessoriesStore.getProductAccessoriess();
});

</script>

<template>
    <div class="accessories-index">
        <DataTable 
        v-model:filters="filters" 
        :value="productAccessoriess" 
        paginator 
        :rows="100" 
        dataKey="product_accessories_id"
        filterDisplay="menu" 
        :loading="fb.loading['productAccessories.list']" 
        :globalFilterFields="['parent_product','web_product_range','item_code','price']"
        selectionMode="multiple" 
        class="th-table"
        >
            <template #header>
                <div class="flex justify-between items-center">
                    <div class="flex gap-2">
                        <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                    </div>
                    <div class="flex gap-2 items-center">
                        <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                    </div>
                </div>
            </template>
            <template #empty> No accessories found. </template>
            <!-- <template #loading> Loading accessories data. Please wait... </template> -->
            <template #loading>
                <div class="flex items-center justify-center gap-2 py-8">
                    <i class="pi pi-spinner pi-spin" style="font-size: 2rem;"></i>
                </div>
            </template>

            <Column field="parent_product_name" header="Parent Product" style="min-width: 12rem" filterField="parent_product_name" sortable>
                <template #body="{ data }">
                    <a @click="editAccessories(data)"
                        class="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline">
                        {{ data?.parent_product_name }}
                    </a>
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" placeholder="Search by parent product name" />
                </template>
            </Column>
            <Column field="product_name" header="Product Range" style="min-width: 12rem" filterField="product_name" sortable>
                <template #body="{ data }">
                    {{ data.product_name }}
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" placeholder="Search by product name" />
                </template>
            </Column>
            <Column field="item_code" header="Item Code" style="min-width: 12rem" filterField="item_code" sortable>
                <template #body="{ data }">
                    {{ data.item_code }}
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" placeholder="Search by item code" />
                </template>
            </Column>
            <Column field="price" header="Price" style="min-width: 12rem" filterField="price" sortable>
                <template #body="{ data }">
                    {{ data.price }}
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" placeholder="Search by price" />
                </template>
            </Column>
            <Column header="Actions" :exportable="false" style="min-width: 8rem">
                <template #body="{ data }">
                    <div class="flex gap-2">
                        <Button 
                            :icon="renderIcon('pi pi-pencil', 'edit', data.product_accessories_id)"
                            :accessories="data"
                            :accessoriesSuggestions="data.accessories_name"
                            :accessoriesGroup="data.accessories_group_name"
                            rounded outlined
                            severity="success" @click="editAccessories(data)"
                        />
                        <Button 
                            :icon="renderIcon('pi pi-trash', 'delete', data.product_accessories_id)"
                            rounded outlined
                            severity="danger"
                            @click="deleteAccessories(data)"
                        />
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>
