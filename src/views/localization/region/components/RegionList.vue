<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRegionStore } from '@/stores/region';
import { useCountryStore } from '@/stores/country';
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

const editRegion = (region) => {
    router.push(`/configuration/settings/regions/edit/${region.region_id}`);
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
</script>

<template>
    <div class="region-index">
        <DataTable
            v-model:filters="filters"
            :value="regions"
            paginator
            :rows="10"
            dataKey="region_id"
            filterDisplay="menu"
            :loading="fb.loading['region.list']"
            :globalFilterFields="['name', 'code', 'country', 'status']"
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
                    </div>
                    <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                </div>
            </template>
            <template #empty> No regions found. </template>
            <template #loading> Loading regions data. Please wait. </template>
            
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
            <Column header="Code" filterField="code" :showFilterMatchModes="false" :filterMenuStyle="{ width: '14rem' }" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.code }}
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