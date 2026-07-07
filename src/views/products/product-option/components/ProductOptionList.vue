<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useToast } from 'primevue/usetoast';
import OptionFilter from '@/filters/OptionFilter';
import { useProductOptionStore } from '@/stores/productOption';

const router = useRouter();
const productOptionStore = useProductOptionStore();
const { productOptions, fb } = storeToRefs(productOptionStore);

const filters = ref({ ...new OptionFilter() });
const toast = useToast();

const editOption = (data: any) => {
    router.push(`/ecommerce/product-options/edit/${data.product_option_id}`);
};

const deleteOption = async (data: any) => {
    try {
        await productOptionStore.deleteProductOption(data.product_option_id);
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Product option deleted successfully.',
            life: 3000,
        });
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete product option.',
            life: 3000,
        });
    }
};

const clearFilter = () => {
    filters.value = { ...new OptionFilter() };
};

const renderIcon = (icon: string, action: string, id: number) => {
    return fb.value.loading[`productOption.${action}.${id}`] ? 'pi pi-spinner pi-spin' : icon;
};

onMounted(async () => {
    await productOptionStore.getProductOptions();
});

</script>

<template>
    <div class="option-index">
        <DataTable 
        v-model:filters="filters" 
        :value="productOptions" 
        paginator 
        :rows="100" 
        dataKey="product_option_id"
        filterDisplay="menu" 
        :loading="fb.loading['productOption.list']" 
        :globalFilterFields="['option_name','product_code','variant_name','option_group_name']"
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
            <template #empty> No options found. </template>
            <!-- <template #loading> Loading options data. Please wait... </template> -->
            <template #loading>
                <div class="flex items-center justify-center gap-2 py-8">
                    <i class="pi pi-spinner pi-spin" style="font-size: 2rem;"></i>
                </div>
            </template>

            <Column field="option_name" header="Option Name" style="min-width: 12rem" filterField="option_name" sortable>
                <template #body="{ data }">
                    <a @click="editOption(data)"
                        class="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline">
                        {{ data?.option_name }}
                    </a>
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" placeholder="Search by name" />
                </template>
            </Column>
            <Column header="Option Group Name" style="min-width: 12rem" >
                <template #body="{ data }">
                    {{ data.option_group_name }}
                </template>
            </Column>
            <Column header="Variant Name" style="min-width: 12rem" >
                <template #body="{ data }">
                    {{ data.variant_name }}
                </template>
            </Column>
            <Column field="product_code" header="Product Code" style="min-width: 12rem" sortable />
            <Column field="sort_order" header="Sort Order" style="min-width: 12rem" sortable />
            <Column header="Actions" :exportable="false" style="min-width: 8rem">
                <template #body="{ data }">
                    <div class="flex gap-2">
                        <Button 
                            :icon="renderIcon('pi pi-pencil', 'edit', data.product_option_id)"
                            :option="data"
                            :optionSuggestions="data.option_name"
                            :optionGroup="data.option_group_name"
                            rounded outlined
                            severity="success" @click="editOption(data)"
                        />
                        <Button 
                            :icon="renderIcon('pi pi-trash', 'delete', data.product_option_id)"
                            rounded outlined
                            severity="danger"
                            @click="deleteOption(data)"
                        />
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>
