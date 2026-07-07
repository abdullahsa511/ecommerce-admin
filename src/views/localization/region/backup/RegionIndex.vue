<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRegionStore } from '../stores/region';
import { useCountryStore } from '../stores/country';
import { storeToRefs } from 'pinia';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import MultiSelect from 'primevue/multiselect';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { formatFrontendDate } from '@/utils/DateUtil';

const toast = useToast();
const router = useRouter();
const regionStore = useRegionStore();
const countryStore = useCountryStore();
const { regions, fb } = storeToRefs(regionStore);
const { countries } = storeToRefs(countryStore);
const selectedRegions = ref([]);
const filters = ref({
    global: { value: null, matchMode: 'contains' },
    name: { value: null, matchMode: 'contains' },
    country: { value: null, matchMode: 'contains' },
    status: { value: null, matchMode: 'contains' }
});

const isLoading = computed(() => {
    return fb.value.loading?.region === true;
});

const regionNames = computed(() => {
    return regions.value.map(region => region.name);
});

const countryNames = computed(() => {
    return countries.value.map(country => country.name);
});

const getCountryName = (countryId) => {
    const country = countries.value.find(c => c.country_id === countryId);
    return country ? country.name : '';
};

const regionStatuses = computed(() => {
    return [...new Set(regions.value.map(region => region.status))];
});

onMounted( async () => {
    await Promise.all([
        regionStore.fetchRegions(),
        countryStore.fetchCountries()
    ]);
});

const clearFilter = () => {
    filters.value = {
        global: { value: null, matchMode: 'contains' },
        name: { value: null, matchMode: 'contains' },
        country: { value: null, matchMode: 'contains' },
        status: { value: null, matchMode: 'contains' }
    };
};

const onRowSelect = (event) => {
    console.log('Row selected:', event.data);
};

const onRowUnselect = (event) => {
    console.log('Row unselected:', event.data);
};

const deleteSelectedRegions = async () => {
    if (selectedRegions.value && selectedRegions.value.length > 0) {
        try {
            for (const region of selectedRegions.value) {
                await regionStore.deleteRegion(region.region_id);
            }
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Selected regions deleted successfully',
                life: 3000
            });
            regionStore.fetchRegions();
        } catch (error) {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete selected regions',
                life: 3000
            });
        }
    }
};

const editRegion = (region) => {
    router.push(`/configuration/settings/edit-regions/${region.region_id}`);
};

const deleteRegion = async (region) => {
    try {
        await regionStore.deleteRegion(region.region_id);
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Region deleted successfully',
            life: 3000
        });
        regionStore.fetchRegions();
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete region',
            life: 3000
        });
    }
};

const addRegion = () => {
    router.push('/configuration/settings/add-regions');
};
</script>

<template>
    <div class="region-index">
        <div class="flex justify-between items-center">
            <h1 class="text-2xl font-bold">Regions</h1>
            <Button
                label="Add Region"
                icon="pi pi-plus"
                @click="addRegion"
                class="p-button-md"
            />
        </div>
        <!-- Error Alert -->
        <div v-if="fb.error" class="alert alert-danger" role="alert">
            {{ fb.error }}
        </div>

        <!-- Loading Spinner -->
        <div v-if="isLoading" class="text-center">
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>

        <!-- Data Table -->
        <DataTable
            v-model:filters="filters"
            v-model:selection="selectedRegions"
            :value="regions"
            paginator
            :rows="10"
            dataKey="region_id"
            filterDisplay="menu"
            :loading="isLoading"
            :globalFilterFields="['name', 'country', 'status']"
            selectionMode="multiple"
            @rowSelect="onRowSelect"
            @rowUnselect="onRowUnselect"
            class="th-table"
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
                            v-if="selectedRegions && selectedRegions.length > 0"
                            type="button"
                            icon="pi pi-trash"
                            label="Delete Selected"
                            severity="danger"
                            @click="deleteSelectedRegions"
                        />
                    </div>
                    <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                </div>
            </template>
            <template #empty> No regions found. </template>
            <template #loading> Loading regions data. Please wait. </template>

            <Column selectionMode="multiple" headerStyle="width: 3rem" />
            
            <Column header="Name" filterField="name" :showFilterMatchModes="false" :filterMenuStyle="{ width: '14rem' }" style="min-width: 36rem">
                <template #body="{ data }">
                    <a 
                        @click="editRegion(data)" 
                        class="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline"
                    >
                        {{ data.name }}
                    </a>
                </template>
                <template #filter="{ filterModel }">
                    <MultiSelect v-model="filterModel.value" :options="regionNames" placeholder="Any">
                        <template #option="slotProps">
                            <div class="flex items-center gap-2">
                                <span>{{ slotProps.option }}</span>
                            </div>
                        </template>
                    </MultiSelect>
                </template>
            </Column>

            <Column header="Country" filterField="country" :showFilterMatchModes="false" :filterMenuStyle="{ width: '14rem' }" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ getCountryName(data.country_id) }}
                </template>
                <template #filter="{ filterModel }">
                    <MultiSelect v-model="filterModel.value" :options="countryNames" placeholder="Any">
                        <template #option="slotProps">
                            <div class="flex items-center gap-2">
                                <span>{{ slotProps.option }}</span>
                            </div>
                        </template>
                    </MultiSelect>
                </template>
            </Column>

            <Column header="Status" filterField="status" :showFilterMatchModes="false" :filterMenuStyle="{ width: '14rem' }" style="min-width: 12rem">
                <template #body="{ data }">
                    <span :class="['status-badge', data.status === 'Active' ? 'bg-green-700 text-white' : 'status-disabled']">
                        {{ data.status }}
                    </span>
                </template>
                <template #filter="{ filterModel }">
                    <MultiSelect v-model="filterModel.value" :options="regionStatuses" placeholder="Any">
                        <template #option="slotProps">
                            <div class="flex items-center gap-2">
                                <span>{{ slotProps.option }}</span>
                            </div>
                        </template>
                    </MultiSelect>
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
                            @click="editRegion(data)"
                        />
                        <Button 
                            icon="pi pi-trash" 
                            rounded 
                            outlined 
                            severity="danger"
                            @click="deleteRegion(data)"
                        />
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<style scoped>
.status-badge {
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.875rem;
    font-weight: 500;
}

.status-disabled {
    background-color: #E0E0E0;
    color: #666666;
}
</style>
