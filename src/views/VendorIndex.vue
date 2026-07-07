<script setup>
import { ref, onMounted } from 'vue';
import { useVendorStore } from '../stores/vendor';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

const router = useRouter();
const vendorStore = useVendorStore();
const { loading, error, filteredVendors } = storeToRefs(vendorStore);

const filters = ref({
    global: { value: null, matchMode: 'contains' },
    name: { value: null, matchMode: 'contains' }
});

const selectedVendors = ref([]);

const fetchData = async () => {
    loading.value = true;
    await vendorStore.fetchVendors();
    loading.value = false;
};

const editVendor = (data) => {
    router.push(`/ecommerce/products/edit-vendor/1`);
};

const deleteVendor = async (data) => {
    await vendorStore.deleteVendor(data.vendor_id);
};

const deleteSelectedVendors = async () => {
    if (selectedVendors.value.length > 0) {
        for (const vendor of selectedVendors.value) {
            await vendorStore.deleteVendor(vendor.vendor_id);
        }
        selectedVendors.value = [];
    }
};

onMounted(() => {
    fetchData();
});

const clearFilter = () => {
    vendorStore.clearFilter();
    filters.value.global.value = null;
    filters.value.name.value = null;
};

const addVendor = () => {
    router.push('/ecommerce/products/add-vendor');
};
</script>

<template>
    <div class="vendor-index">
        <div class="mb-4 flex justify-end">
            <Button icon="pi pi-plus" label="Add Vendor" severity="primary" @click="addVendor" />
        </div>
        <DataTable v-model:filters="filters" v-model:selection="selectedVendors" :value="filteredVendors" paginator
            :rows="10" dataKey="vendor_id" filterDisplay="menu" :loading="loading" :globalFilterFields="['vendor_code','name']"
            selectionMode="multiple" class="th-table mb-4">
            <template #header>
                <div class="flex justify-between items-center">
                    <div class="flex gap-2">
                        <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                        <Button v-if="selectedVendors.length > 0" type="button" icon="pi pi-trash"
                            label="Delete Selected" severity="danger" @click="deleteSelectedVendors" />
                    </div>
                    <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                </div>
            </template>
            <template #empty> No vendors to display! </template>
            <template #loading> Loading vendors data. Please wait. </template>

            <Column selectionMode="multiple" headerStyle="width: 3rem" />

            <Column field="thumbnail" header="Thumbnail" style="min-width: 8rem">
                <template #body="{ data }">
                    <a @click="editVendor(data)" class="cursor-pointer">
                        <img :src="data.thumbnail" :alt="data.name"
                            class="w-16 h-16 object-cover border-2 border-gray-200 hover:border-blue-500 transition-colors" />
                    </a>
                </template>
            </Column>

            <Column field="vendor_code" header="Vendor Code" style="min-width: 10rem" filter>
                <template #body="{ data }">
                    <a @click="editVendor(data)"
                        class="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline">
                        {{ data.vendor_code }}
                    </a>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter"
                        placeholder="Search by vendor code" />
                </template>
            </Column>

            <Column field="name" header="Name" style="min-width: 32rem" filter>
                <template #body="{ data }">
                    <a @click="editVendor(data)"
                        class="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline">
                        {{ data.name }}
                    </a>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter"
                        placeholder="Search by name" />
                </template>
            </Column>

            <Column header="Actions" :exportable="false" style="min-width: 8rem">
                <template #body="{ data }">
                    <div class="flex gap-2">
                        <Button icon="pi pi-pencil" rounded outlined severity="success" class="mr-2"
                            @click="editVendor(data)" />
                        <Button icon="pi pi-trash" rounded outlined severity="danger" @click="deleteVendor(data)" />
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>


<style scoped>
/* .vendor-index {
    padding: 2rem;
} */

/* .p-datatable .p-datatable-tbody>tr>td {
    padding: 1.5rem 1rem;
} */

.p-button {
    border: none;
}

:deep(.p-datatable-tbody > tr) {
    height: 100px;
}
</style>