<script setup>
import { ref, onMounted } from 'vue';
import { useManufacturerStore } from '../stores/manufacturer';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

const router = useRouter();
const manufacturerStore = useManufacturerStore();
const { loading, error, filteredManufacturers } = storeToRefs(manufacturerStore);

const filters = ref({
    global: { value: null, matchMode: 'contains' },
    name: { value: null, matchMode: 'contains' }
});

const selectedManufacturers = ref([]);

const fetchData = async () => {
    loading.value = true;
    await manufacturerStore.fetchManufacturers();
    loading.value = false;
};

const editManufacturer = (data) => {
    router.push(`/ecommerce/products/edit-manufacturer/1`);
};

const deleteManufacturer = async (data) => {
    await manufacturerStore.deleteManufacturer(data.manufacturer_id);
};

const deleteSelectedManufacturers = async () => {
    if (selectedManufacturers.value.length > 0) {
        for (const manufacturer of selectedManufacturers.value) {
            await manufacturerStore.deleteManufacturer(manufacturer.manufacturer_id);
        }
        selectedManufacturers.value = [];
    }
};

onMounted(() => {
    fetchData();
});

const clearFilter = () => {
    manufacturerStore.clearFilter();
    filters.value.global.value = null;
};

const addManufacturer = () => {
    router.push('/ecommerce/products/add-manufacturer');
};
</script>

<template>
    <div class="manufacturer-index">
        <div class="mb-4 flex justify-end">
            <Button
                icon="pi pi-plus"
                label="Add Manufacturer"
                severity="primary"
                @click="addManufacturer"
            />
        </div>
        <DataTable
            v-model:filters="filters"
            v-model:selection="selectedManufacturers"
            :value="filteredManufacturers"
            paginator
            :rows="10"
            dataKey="manufacturer_id"
            filterDisplay="menu"
            :loading="loading"
            :globalFilterFields="['manufacturer_code', 'name']"
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
                            v-if="selectedManufacturers.length > 0"
                            type="button"
                            icon="pi pi-trash"
                            label="Delete Selected"
                            severity="danger"
                            @click="deleteSelectedManufacturers"
                        />
                    </div>
                    <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                </div>
            </template>
            <template #empty> No manufacturers to display! </template>
            <template #loading> Loading manufacturers data. Please wait. </template>

            <Column selectionMode="multiple" headerStyle="width: 3rem" />
            
           
            <Column field="thumbnail" header="Thumbnail" style="min-width: 8rem">
                <template #body="{ data }">
                    <a 
                        @click="editManufacturer(data)" 
                        class="cursor-pointer"
                    >
                        <img 
                            :src="data.thumbnail" 
                            :alt="data.name" 
                            class="w-16 h-16 object-cover border-2 border-gray-200 hover:border-blue-500 transition-colors"
                        />
                    </a>
                </template>
            </Column>
            <Column field="manufacturer_code" header="Code" style="min-width: 10rem" filter>
                <template #body="{ data }">
                    <a 
                        @click="editManufacturer(data)" 
                        class="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline"
                    >
                        {{ data.manufacturer_code }}
                    </a>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText
                        v-model="filterModel.value"
                        type="text"
                        @input="filterCallback()"
                        class="p-column-filter"
                        placeholder="Search by manufacturer code"
                    />
                </template>
            </Column>
            <Column field="name" header="Name" style="min-width: 32rem" filter>
                <template #body="{ data }">
                    <a 
                        @click="editManufacturer(data)" 
                        class="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline"
                    >
                        {{ data.name }}
                    </a>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText
                        v-model="filterModel.value"
                        type="text"
                        @input="filterCallback()"
                        class="p-column-filter"
                        placeholder="Search by name"
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
                            @click="editManufacturer(data)"
                        />
                        <Button 
                            icon="pi pi-trash" 
                            rounded 
                            outlined 
                            severity="danger"
                            @click="deleteManufacturer(data)"
                        />
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>


<style scoped>
.manufacturer-index {
    padding: 2rem;
}

.p-datatable .p-datatable-tbody > tr > td {
    padding: 1.5rem 1rem;
}

.p-button {
    border: none;
}

:deep(.p-datatable-tbody > tr) {
    height: 100px;
}
</style> 