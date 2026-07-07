<script setup lang="ts">
import { ref } from 'vue';
import OptionFilter from '@/filters/OptionFilter';
import { useToast } from 'primevue/usetoast';
import { ProductOption } from '@/models/Product.ts';
import OptionForm from '@/views/products/components/variant-option/OptionForm.vue';

const toast = useToast();
const filters = ref({ ...new OptionFilter() });

//Local variables
const optionList = ref([
    new ProductOption({
        name: 'Option 1',
        type: 'Texture',
        price: 100,
        imagePreview: 'https://primefaces.org/cdn/primevue/images/product/product-placeholder.svg',
        sort_order: 1,
    }),
    new ProductOption({
        name: 'Option 2',
        type: 'Texture',
        price: 100,
        imagePreview: 'https://primefaces.org/cdn/primevue/images/product/product-placeholder.svg',
        sort_order: 1,
    })
]);
const expandedRows = ref<Record<string, boolean>>({});

const editOption = (data: any, rowTogglerCallback: any) => {
    console.log(expandedRows);
    rowTogglerCallback(data);
    if (expandedRows.value && Object.keys(expandedRows.value).length > 0) {
        expandedRows.value = { [data.name] : true };
    }
};

const deleteOption = async (data: any) => {
    console.log(data);
    try {
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Option deleted successfully.',
            life: 3000,
        });
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete option.',
            life: 3000,
        });
    }
};
const onRowExpand = (event) => {
    toast.add({ severity: 'info', summary: 'Product Expanded', detail: event.data.name, life: 3000 });
};

const clearFilter = () => {
    filters.value = { ...new OptionFilter() };
};

const renderIcon = (icon: string, action: string, id: number) => {
    return icon;
};

</script>

<template>
    <div class="option-index">
        <!-- <DataTable 
        v-model:filters="filters" 
        :value="optionList" 
        paginator 
        :rows="100" 
        dataKey="name"
        filterDisplay="menu" 
        :loading="false" 
        :globalFilterFields="['name','type','sort_order']"
        selectionMode="multiple" 
        class="th-table"
        v-model:expandedRows="expandedRows" 
        @rowExpand="onRowExpand" 
        >
            <template #header>
                <div class="flex justify-between items-center">
                    <div class="flex gap-2">
                        <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                    </div>
                    <div class="flex gap-2  items-center">
                        <InputText v-model="filters['global'].value" placeholder="Keyword Search" class="w-full" />
                    </div>
                </div>
            </template>
            <template #empty> No options found. </template>
            <template #loading>
                <div class="flex items-center justify-center gap-2 py-8">
                    <i class="pi pi-spinner pi-spin" style="font-size: 2rem;"></i>
                </div>
            </template>
            <Column header="Image" style="min-width:5rem" >
                <template #body="{ data }">
                    <img v-if="data.imagePreview" :src="data.imagePreview" :alt="data.name" class="w-24 rounded" />
                    <div v-else class="w-24 rounded bg-gray-200 flex items-center justify-center" style="min-height: 60px;">
                        <i class="pi pi-image text-2xl text-gray-400" style="font-size: 2rem;"></i>
                    </div>
                </template>
            </Column>

            <Column field="name" header="Option" style="min-width: 5rem" filterField="name" sortable>
                <template #body="{ data }">
                    <a @click="editOption(data)"
                        class="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline">
                        {{ data?.name }}
                    </a>
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" placeholder="Search by name" />
                </template>
            </Column>
            <Column header="Price" style="min-width: 5rem" >
                <template #body="{ data }">
                    {{ data.price }}
                </template>
            </Column>
            <Column field="sort_order" header="Sort" style="min-width: 6rem" sortable />
            <Column expander header="Actions" :exportable="false" style="min-width: 5rem">
                <template #body="{ data, rowTogglerCallback }">
                    <div class="flex gap-2">
                        <Button 
                            :icon="renderIcon('pi pi-pencil', 'edit', data.option_id)"
                            rounded outlined
                            severity="success" @click="editOption(data, rowTogglerCallback)"
                        />
                        <Button 
                            :icon="renderIcon('pi pi-trash', 'delete', data.option_id)"
                            rounded outlined
                            severity="danger"
                            @click="deleteOption(data)"
                        />
                    </div>
                </template>
            </Column>
            <template #expansion="{data}">
                <OptionForm />
            </template>
        </DataTable> -->
        <div class="grid-table">
            <!-- Create Grid Table Header here whic will be hiddne in mobile view -->

            <!-- This is grid Row 1-->
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                <div class="bg-white rounded-lg shadow p-4 w-full">
                    Card Content 1
                </div>
                <div class="bg-white rounded-lg shadow p-4 w-full">
                Card Content 2
                </div>
                <div class="bg-white rounded-lg shadow p-4 w-full">
                Card Content 3
                </div>
                <div class="bg-white rounded-lg shadow p-4 w-full">
                Card Content 4
                </div>
            </div>
             <!-- This is grid Row 2-->
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                <div class="bg-white rounded-lg shadow p-4 w-full">
                    Card Content 1
                </div>
                <div class="bg-white rounded-lg shadow p-4 w-full">
                Card Content 2
                </div>
                <div class="bg-white rounded-lg shadow p-4 w-full">
                Card Content 3
                </div>
                <div class="bg-white rounded-lg shadow p-4 w-full">
                Card Content 4
                </div>
            </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">
            <div class="bg-white rounded-lg shadow p-4 w-full">
                Card Content 1
            </div>
            <div class="bg-white rounded-lg shadow p-4 w-full">
             Card Content 2
            </div>
            <div class="bg-white rounded-lg shadow p-4 w-full">
             Card Content 3
            </div>
            <div class="bg-white rounded-lg shadow p-4 w-full">
             Card Content 4
            </div>
        </div>
    </div>
</template>

<style scoped>
.p-datatable-popover-filter {
    margin: 0px !important;
}
</style>
