<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useToast } from 'primevue/usetoast';
import { useVariantsItemStore } from '@/stores/variantsItem';
import VariantsItemFilter from '@/filters/VariantsItemFilter';

const router = useRouter();
const variantItemStore = useVariantsItemStore();
const { variantItems, fb } = storeToRefs(variantItemStore);
const filters = ref({...new VariantsItemFilter()});
const toast = useToast();

const selectedVariantItems = ref([]);

const editVariantItem = (data: any) => {
    router.push(`/ecommerce/products/variants-item/edit/${data.variant_item_id}`);
};

const deleteVariantItem = async (data: any) => {
    try {
        await variantItemStore.deleteVariantItem(data.variant_item_id);
        toast.add({ 
            severity: 'success', 
            summary: 'Success', 
            detail: 'Variant item deleted successfully', 
            life: 3000,
        });
    } catch (error) {
        toast.add({ 
            severity: 'error', 
            summary: 'Error', 
            detail: 'Failed to delete variantsItem.', 
            life: 3000 
        });
    }
};

const clearFilter = () => {
    filters.value = {...new VariantsItemFilter()};
};

const deleteSelectedVariants = async () => {
    if (selectedVariantItems.value.length > 0) {
        for (const vi of selectedVariantItems.value) {
            await variantItemStore.deleteVariantItem((vi as any).variant_item_id);
        }
        selectedVariantItems.value = [];
    }
};

onMounted(() => {
    variantItemStore.fetchVariantsItems();
});
</script>

<template>
    <div class="">
        <DataTable 
            :value="variantItems" 
            :rows="100" 
            :loading="fb.loading['variantItem.list']"
            :globalFilterFields="['variant_name', 'item_code', 'variant_item_id']" 
            v-model:filters="filters" 
            paginator 
            dataKey="variants_item_id"
            filterDisplay="menu" 
            selectionMode="multiple" 
            class="th-table table-border"
        >
            <template #header>
                <div class="flex justify-between items-center">
                    <div class="flex gap-2">
                        <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                        <Button v-if="selectedVariantItems.length > 0" type="button" icon="pi pi-trash"
                            label="Delete Selected" severity="danger" @click="deleteSelectedVariants" />
                    </div>
                    <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                </div>
            </template>
            <template #empty> No Variant item to display! </template>
            <template #loading> Loading variant item data. Please wait. </template>

            <Column selectionMode="multiple" headerStyle="width: 3rem" />

            <Column field="variant_name" header="Variant item ID" style="min-width: 10rem" sortable>
                <template #body="{ data }">
                    <a @click="editVariantItem(data)"
                        class="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline">
                        {{ data.variant_name }}
                    </a>
                </template>
            </Column>
            <Column field="item_code" header="Item Code" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.item_code }}
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" placeholder="Search by item code" />
                </template>
            </Column>
            <Column field="sort_order" header="Sort Order" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.sort_order }}
                </template>
            </Column>



            <Column header="Actions" :exportable="false" style="min-width: 8rem">
                <template #body="{ data }">
                    <div class="flex gap-2">
                        <Button 
                            :icon="fb.loading['variantItem.edit.' + data.variant_item_id] ? 'pi pi-spinner pi-spin' : 'pi pi-pencil'"
                            rounded outlined 
                            severity="success" 
                            class="mr-2"
                            @click="editVariantItem(data)" 
                        />
                        <Button 
                            :icon="fb.loading['variantItem.delete.' + data.variant_item_id] ? 'pi pi-spinner pi-spin' : 'pi pi-trash'"
                            rounded outlined 
                            severity="danger" 
                            @click="deleteVariantItem(data)" 
                        />
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>


<style scoped>
/* .variantsItem-index {
    padding: 2rem;
}

.variantsItem-area {
    padding: 2rem;
    min-height: 200px;
    background-color: #f8f9fa;
}

.p-datatable .p-datatable-tbody>tr>td {
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
} */
</style>
