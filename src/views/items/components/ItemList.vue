<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter, useRoute } from 'vue-router';
import { debounce } from 'lodash';
import ItemFilter from '@/filters/ItemFilter';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import Avatar from 'primevue/avatar';
import { useItemStore } from '@/stores/item';
import Request from '@/models/Request';
import Item from '@/models/Item';
import { resolveMediaImage, hasMediaImage } from '@/utils/mediaUrl';

const router = useRouter();
const route = useRoute();
const itemStore = useItemStore();
const { fb, items, pagination, filters } = storeToRefs(itemStore);

const selectedItems = ref<Item[]>([]);

// Computed property to get the current page's items slice
const currentPageItems = computed(() => { // old change by abdullah
    const start = pagination.value.first || 0;
    const end = start + (pagination.value.rows || 100);
    return items.value.slice(start, end);
});

// const currentPageItems = computed(() => {
//     let filtered = items.value;

//     const search = filters.value.global?.value?.toLowerCase()?.trim();

//     if (search) {
//         filtered = items.value.filter(item =>
//             item.product_code?.toLowerCase().includes(search) ||
//             item.product_variant?.toLowerCase().includes(search) ||
//             item.item_code?.toLowerCase().includes(search) ||
//             String(item.km_item_id || '').includes(search)
//         );
//     }

//     const start = pagination.value.first || 0;
//     const end = start + (pagination.value.rows || 100);

//     return filtered.slice(start, end);
// });

const fetchData = async (query: string, resetItems: boolean = false) => {
    await itemStore.fetchItems(query, resetItems);
};

const editItem = (data: any) => {
    router.push(`/ecommerce/items/edit/${data.item_id}`);
};

const deleteProduct = async (data: any) => {
    await itemStore.deleteItem(data.item_id);
};

const deleteSelectedItems = async () => {
    if (selectedItems.value.length > 0) {
        for (const item of selectedItems.value) {
            if (item.item_id !== null) {
                await itemStore.deleteItem(item.item_id);
            }
        }
        selectedItems.value = [];
    }
};

const getItemImageLink = (data: any): string => resolveMediaImage(data.quote_image);

const hasItemImage = (data: any): boolean => hasMediaImage(data.quote_image);

const clearFilter = async () => {
    // Reset local filters; item store does not expose a clearFilter method
    filters.value = { ...new ItemFilter() };
    selectedItems.value = [];
    // Reset items and fetch with cleared filters
    await onFilterChange();
};

const onFilterChange = async () => {
    // Reset pagination to first page when filters change
    pagination.value.first = 0;
    pagination.value.page = 1;
    
    // Create request with current filters and reset pagination
    const request = new Request({
        page: 1,
        first: 0,
        rows: pagination.value.rows || 100,
        filters: filters.value
    });
    
    const queryString = request.toQueryString();

    // Fetch data with resetItems flag to clear existing items
    await fetchData(queryString, true);
    router.replace(route.path + '?' + queryString);
};

const onGlobalFilterChange =  debounce(async () => {
    await onFilterChange();
}, 300);

const onPageChange = (event: any) => {
    // Calculate the end index of the requested page (0-based index)
    const requestedEndIndex = event.first + event.rows;
    const currentLoadedCount = items.value.length;
    
    let request: Request;
    
    // Check if the requested page data is already loaded
    // The requestedEndIndex should be <= currentLoadedCount for data to be available
    if (requestedEndIndex <= currentLoadedCount) {
        fb.value.loading['item.list'] = true;
        // Data is already loaded, just update pagination in frontend
        pagination.value.first = event.first;
        pagination.value.page = event.page + 1; // Convert 0-based to 1-based
        pagination.value.rows = event.rows;
        
        // Create request for URL update
        request = new Request({
            page: event.page + 1, // Convert 0-based to 1-based
            first: event.first,
            rows: event.rows,
            filters: filters.value
        });
        setTimeout(() => {
            fb.value.loading['item.list'] = false;
        }, 100);
    } else {
        // Data is not loaded yet, need to fetch from backend
        // Send current loaded count as 'first' parameter to backend
        // Backend will return items starting from that index
        request = new Request({
            page: event.page + 1, // Convert 0-based to 1-based
            first: currentLoadedCount, // Current number of items loaded
            rows: event.rows,
            filters: filters.value
        });
        
        fetchData(request.toQueryString());
    }
    
    // Update browser URL with query string
    const queryString = request.toQueryString();
    router.replace(route.path + '?' + queryString);
};

onMounted(() => {
    const query = window.location.search.split('?')[1] || '';
    fetchData(query.toString(), true);
});

</script>

<template>
    <div class="">
        <DataTable v-model:filters="filters" 
            v-model:selection="selectedItems" 
            :value="currentPageItems" 
            dataKey="item_id" 
            filterDisplay="menu" 
            :loading="fb.loading['item.list']"
            :globalFilterFields="['product_code', 'product_variant', 'item_code', 'km_item_id']"
            selectionMode="multiple" 
            class="th-table mb-4 table-border"
            :lazy="true"
            :paginator="true"
            :first="pagination.first"
            :rows="pagination.rows"
            :totalRecords="pagination.totalRecords"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            @page="onPageChange"
            @filter="onFilterChange"
        >
            <template #header>
                <div class="flex justify-between">
                    <Button type="button" icon="pi pi-filter-slash" label="" outlined @click="clearFilter()" />
                    <Button v-if="selectedItems.length > 0" type="button" icon="pi pi-trash" label=""
                        severity="danger" @click="deleteSelectedItems" />
                    <div class="flex items-center gap-2">
                        <i class="pi pi-search" />
                        <InputText v-model="filters['global'].value" placeholder="Type to search..." @input="onGlobalFilterChange" /> 
                        <!---<InputText v-model="filters['global'].value" placeholder="Type to search..." /> -->
                    </div>
                </div>
            </template>
            <template #empty> No items to display! </template>
            <template #loading> Loading items data. Please wait. </template>

            <Column selectionMode="multiple" headerStyle="width: 3rem" />

            <Column field="thumbnail" header="Thumbnail" style="min-width: 8rem">
                <template #body="{ data }">
                    <a @click="editItem(data)" class="cursor-pointer">
                        <img
                            v-if="hasItemImage(data)"
                            :src="getItemImageLink(data)"
                            :alt="data.item_code || data.product_code || 'Item'"
                            class="w-16 h-16 object-cover border-2 border-gray-200 hover:border-blue-500 transition-colors"
                        />
                        <Avatar
                            v-else
                            :label="(data.item_code || data.product_code || '?').charAt(0)"
                            shape="square"
                            size="large"
                            class="w-16 h-16"
                        />
                    </a>
                </template>
            </Column>

            <Column field="item_code" header="Item Code" style="min-width: 12rem">
                <template #body="{ data }">
                    <a @click="editItem(data)" class="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline">
                        {{ data.item_code }}
                    </a>
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" placeholder="Search by item code" />
                </template>
            </Column>

            <Column field="is_default" header="Default Item" style="min-width: 10rem">
                <template #body="{ data }">
                    <Badge 
                        :value="data.is_default ? 'Default' : 'Not Default'" 
                        :severity="data.is_default ? 'success' : 'danger'" 
                    />
                </template>
            </Column>

            <Column field="product_code" header="Product Code" style="min-width: 12rem">
                <template #body="{ data }">
                    <a @click="editItem(data)" class="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline">
                        {{ data.product_code }}
                    </a>
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" placeholder="Search by item code" />
                </template>
            </Column>
            <Column field="product_variant" header="Variant" style="min-width: 12rem">
                <template #body="{ data }">
                    <a @click="editItem(data)" class="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline">
                        {{ data.product_variant }}
                    </a>
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" placeholder="Search by variant" />
                </template>
            </Column>
            <Column field="description" header="Description" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.description }}
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" placeholder="Search by description" />
                </template>
            </Column>

            <Column field="km_item_id" header="KM ID" style="min-width: 10rem">
                <template #body="{ data }">
                    {{ data.km_item_id }}
                </template>
                <template #filter="{ filterModel }">
                    <!-- Use InputNumber so the filter value is numeric and matches FilterMatchMode.EQUALS -->
                    <InputNumber v-model="filterModel.value" mode="decimal" :useGrouping="false"
                        placeholder="Filter by KM ID" />
                </template>
            </Column>

            <Column field="track_stock" header="Track Stock" style="min-width: 8rem">
                <template #body="{ data }">
                    <span>
                        {{ data.track_stock }}
                    </span>
                </template>
                <template #filter="{ filterModel }">
                    <InputNumber v-model="filterModel.value" mode="decimal" :useGrouping="false"
                        placeholder="Filter by track stock" />
                </template>
            </Column>

            <Column header="Actions" :exportable="false" style="min-width: 8rem">
                <template #body="{ data }">
                    <div class="flex gap-2">
                        <Button
                            :icon="fb.loading['item.edit.' + data.item_id] ? 'pi pi-spinner pi-spin' : 'pi pi-pencil'"
                            :disabled="!!fb.loading['item.edit.' + data.item_id]" rounded outlined severity="success"
                            class="mr-2" @click="editItem(data)" />
                        <Button
                            :icon="fb.loading['item.delete.' + data.item_id] ? 'pi pi-spinner pi-spin' : 'pi pi-trash'"
                            :disabled="!!fb.loading['item.delete.' + data.item_id]" rounded outlined severity="danger"
                            @click="deleteProduct(data)" />
                    </div>
                </template>
            </Column>
            
        </DataTable>
    </div>
</template>

<style scoped>
:deep(.p-datatable-tbody > tr) {
    height: 100px;
}
</style>