<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useToast } from 'primevue/usetoast';
import { useItemOptionStore } from '@/stores/itemOption';
import ItemOptionFilter from '@/filters/ItemOptionFilter';
import { resolveMediaImage, hasMediaImage } from '@/utils/mediaUrl';
import Avatar from 'primevue/avatar';

const router = useRouter();
const itemOptionStore = useItemOptionStore();
const { itemOptions, fb } = storeToRefs(itemOptionStore);
const filters = ref({...new ItemOptionFilter()});
const toast = useToast();

const editOptionsItem = (data: any) => {
    router.push(`/ecommerce/items/item-options/edit/${data.item_option_id}`);
};

const deleteOptionsItem = async (data: any) => {
    try {
        await itemOptionStore.deleteItemOption(data.item_option_id);
        toast.add({ severity: 'success', summary: 'Success', detail: 'Item option deleted successfully', life: 3000 });
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete item option.', life: 3000 });
    }
};

const clearFilter = () => {
    filters.value = {...new ItemOptionFilter()};
};

watch(itemOptions.value, () => {

});

onMounted(() => {
    itemOptionStore.fetchItemOptions();
});

const getItemOptionImageLink = (data: any) => resolveMediaImage(data.image);
</script>

<template>
    <div class="">
        <DataTable v-model:filters="filters" :value="itemOptions" paginator :rows="10" dataKey="item_option_id"
            filterDisplay="menu" :loading="fb.loading['itemOption.list']"
            :globalFilterFields="['name', 'item_code', 'product_code', 'variant_name', 'option_group_name', 'option_name', 'value']" selectionMode="multiple"
            class="th-table table-border">
            <template #header>
                <div class="flex justify-between items-center">
                    <div class="flex gap-2">
                        <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                    </div>
                    <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                </div>
            </template>
            <template #empty> No Option item to display! </template>
            <template #loading> Loading option item data. Please wait. </template>

            <Column selectionMode="multiple" headerStyle="width: 3rem" />
            <Column field="image" header="Image" style="min-width: 10rem">
                <template #body="{ data }">
                    <img
                        v-if="hasMediaImage(data.image)"
                        :src="getItemOptionImageLink(data)"
                        :alt="data.option_name || 'Item option'"
                        class="w-10 h-10 rounded-md object-cover"
                    />
                    <Avatar
                        v-else
                        :label="(data.option_name || '?').charAt(0)"
                        shape="square"
                        size="large"
                    />
                </template>
            </Column>

            <Column field="option_name" header="option name" style="min-width: 10rem">
                <template #body="{ data }">
                    <a @click="editOptionsItem(data)"
                        class="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline">
                        {{ data.option_name }}
                    </a>
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" placeholder="Search by item option name" />
                </template>
            </Column>
            <Column field="item_code" header="Item code" style="min-width: 10rem">
                <template #body="{ data }">
                    {{ data.item_code }}
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" placeholder="Search by item code" />
                </template>
            </Column>
            <Column field="product_code" header="Product code" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.product_code }}
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" placeholder="Search by product code" />
                </template>
            </Column>
            <Column field="variant_name" header="Variant name" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.variant_name }}
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" placeholder="Search by variant name" />
                </template>
            </Column>
            <Column field="option_group_name" header="Option group" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.option_group_name }}
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" placeholder="Search by option group name" />
                </template>

            </Column>
            <Column field="value" header="Value" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.value }}
                </template>
            </Column>
            <Column header="Actions" :exportable="false" style="min-width: 8rem">
                <template #body="{ data }">
                    <div class="flex gap-2">
                        <Button
                            :icon="fb.loading['itemOption.edit.' + data.item_option_id] ? 'pi pi-spinner pi-spin' : 'pi pi-pencil'"
                            rounded outlined severity="success" class="mr-2"
                            :disabled="fb.loading['itemOption.edit.' + data.item_option_id]"
                            @click="editOptionsItem(data)"
                        />
                        <Button
                            :icon="fb.loading['itemOption.delete.' + data.item_option_id] ? 'pi pi-spinner pi-spin' : 'pi pi-trash'"
                            :disabled="fb.loading['itemOption.delete.' + data.item_option_id]"
                            rounded outlined 
                            severity="danger"
                            @click="deleteOptionsItem(data)"
                        />
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>


<style scoped>
/* .optionsItem-index {
    padding: 2rem;
}

.optionsItem-area {
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
