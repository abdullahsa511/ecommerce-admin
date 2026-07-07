<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRegionGroupStore } from '../stores/regionGroup';
import { storeToRefs } from 'pinia';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import MultiSelect from 'primevue/multiselect';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const router = useRouter();

const regionGroupStore = useRegionGroupStore();
const { regionGroups, fb } = storeToRefs(regionGroupStore);
const selectedRegionGroups = ref([]);

const filters = ref({
    global: { value: null, matchMode: 'contains' },
    name: { value: null, matchMode: 'contains' }
});

const isLoading = computed(() => {
    return fb.value.loading?.regionGroup === true;
});

//Returns an array containing ALL names, including duplicates if they exist
// const regionGroupNames = computed(() => {
//     return regionGroups.value.map(group => group.name);
// });

//Returns an array containing Only UNIQUE names
const regionGroupNames = computed(() => {
    return [...new Set(regionGroups.value.map(group => group.name))];
});

// const filteredRegionGroups = computed(() => {
//     return regionGroups.value.filter(group => filter.value.matches(group));
// });

onMounted(() => {
    regionGroupStore.fetchRegionGroups();
});

const clearFilter = () => {
    filters.value = {
        global: { value: null, matchMode: 'contains' },
        name: { value: null, matchMode: 'contains' }
    };
};

const onRowSelect = (event) => {
    console.log('Row selected:', event.data);
};

const onRowUnselect = (event) => {
    console.log('Row unselected:', event.data);
};

const deleteSelectedRegionGroups = () => {
    if (selectedRegionGroups.value && selectedRegionGroups.value.length > 0) {
        console.log('Delete selected region groups:', selectedRegionGroups.value);
    }
};

const editRegionGroup = (regionGroup) => {
    router.push(`/configuration/settings/edit-region-groups/${regionGroup.region_group_id}`);
};

const deleteRegionGroup = async (regionGroup) => {
    try {
        await regionGroupStore.deleteRegionGroup(regionGroup.region_group_id);
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Region group deleted successfully',
            life: 3000
        });
        regionGroupStore.fetchRegionGroups();
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete region group',
            life: 3000
        });
    }
};

const addRegionGroup = () => {
    router.push('/configuration/settings/add-region-groups');
};
</script>

<template>
    <div>
        <div class="flex justify-end gap-2 mb-6">
            <Button
                icon="pi pi-plus"
                label="Add Region Group"
                severity="primary"
                @click="addRegionGroup"
                class="p-button-md"
            />
        </div>
        <DataTable
            v-model:filters="filters"
            v-model:selection="selectedRegionGroups"
            :value="regionGroups"
            paginator
            :rows="10"
            dataKey="region_group_id"
            filterDisplay="menu"
            :loading="isLoading"
            :globalFilterFields="['name']"
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
                            v-if="selectedRegionGroups && selectedRegionGroups.length > 0"
                            type="button"
                            icon="pi pi-trash"
                            label="Delete Selected"
                            severity="danger"
                            @click="deleteSelectedRegionGroups"
                        />
                    </div>
                    <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                </div>
            </template>
            <template #empty> No region groups found. </template>
            <template #loading> Loading region groups data. Please wait. </template>

            <Column selectionMode="multiple" headerStyle="width: 3rem" />
            
            <Column header="Name" filterField="name" :showFilterMatchModes="false" :filterMenuStyle="{ width: '14rem' }" style="min-width: 36rem">
                <template #body="{ data }">
                    <a 
                        @click="editRegionGroup(data)" 
                        class="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline"
                    >
                        {{ data.name }}
                    </a>
                </template>
                <template #filter="{ filterModel }">
                    <MultiSelect v-model="filterModel.value" :options="regionGroupNames" placeholder="Any">
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
                            @click="editRegionGroup(data)"
                        />
                        <Button 
                            icon="pi pi-trash" 
                            rounded 
                            outlined 
                            severity="danger"
                            @click="deleteRegionGroup(data)"
                        />
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>