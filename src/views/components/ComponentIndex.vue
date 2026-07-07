<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from 'vue-router';
import Component from '@/models/Component';
import { useComponentStore } from '@/stores/component';
import { storeToRefs } from 'pinia';
import ComponentFilter from '@/filters/ComponentFilters';

const router = useRouter();
const componentStore = useComponentStore();
const {components, fb} = storeToRefs(componentStore);

const filters = ref({...new ComponentFilter()});
const selectedComponents = ref([]);

const isLoading = computed(() => {
    return fb?.value?.loading === true;
});

const clearFilter = () => {
    filters.value = new ComponentFilter();
}

const addComponent = () => {
    router.push('/components/add');
};

const editComponent = (data) => {
    router.push(`/components/${data.component_id}`);
};

const deleteComponent = async (data) => {
    await componentStore.deleteComponent(data.component_id);
};

const deleteSelectedComponents = async () => {
    if (selectedComponents.value.length > 0) {
        for (const component of selectedComponents.value) {
            await componentStore.deleteComponent(component.component_id);
        }
        selectedComponents.value = [];
    }
};

onMounted(() => {
    componentStore.fetchComponents();
});

</script>
<template>
    <div class="component-index">
        <div class="mb-4 flex justify-end">
            <Button 
                icon="pi pi-plus" 
                label="Add Component" 
                severity="primary" 
                @click="addComponent"
            />
        </div>

        <DataTable
            v-model:filters="filters"
            v-model:selection="selectedComponents"
            :value="components"
            paginator
            :rows="10"
            dataKey="component_id"
            filterDisplay="menu"
            :loading="isLoading"
            :globalFilterFields="['name', 'section_title']"
            selectionMode="multiple"
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
                            v-if="selectedComponents.length > 0"
                            type="button"
                            icon="pi pi-trash"
                            label="Delete Selected"
                            severity="danger"
                            @click="deleteSelectedComponents"
                        />
                    </div>
                    <InputText v-model="filters['global'].value" placeholder="Keyword Search"/>
                </div>
            </template>
            <template #empty> No components found. </template>
            <template #loading> Loading components data. Please wait. </template>

            <Column selectionMode="multiple" headerStyle="width: 3rem" />

            <Column field="name" header="Name" style="min-width: 12rem">
                <template #body="{ data }">
                    <a 
                        @click="editComponent(data)" 
                        class="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline"
                    >
                        {{ data.name }}
                    </a>
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" placeholder="Search by name" />
                </template>
            </Column>
            <Column field="section_title" header="Title" filterField="section_title" style="min-width: 12rem">
                <template #body="{ data }">
                    <div class="flex items-center gap-2">
                        <span>{{ data.section_title }}</span>
                    </div>
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" placeholder="Search by title" />
                </template>
            </Column>
            <Column field="section_subtitle" header="Subtitle" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.section_subtitle }}
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" placeholder="Search by subtitle" />
                </template>
            </Column>
            <Column field="description" header="Description" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.description }}
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" placeholder="Search by description" />
                </template>
            </Column>
            <Column field="template" header="Template" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.template }}
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" placeholder="Search by template" />
                </template>
            </Column>
            <Column field="active" header="Active" dataType="boolean" bodyClass="text-center" style="min-width: 8rem">
                <template #body="{ data }">
                    <span :class="[
                        'px-3 py-1 text-sm font-medium rounded-lg',
                        Boolean(data.active) ? 'bg-green-700 text-white' : 'bg-red-700 text-white'
                    ]" style="display: inline-block;">
                        {{ Boolean(data.active) ? 'Active' : 'Inactive' }}
                    </span>
                </template>
                <template #filter="{ filterModel }">
                    <label for="active-filter" class="font-bold"> Active </label>
                    <Checkbox v-model="filterModel.value" :indeterminate="filterModel.value === null" binary inputId="active-filter" />
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
                            @click="editComponent(data)"
                        />
                        <Button 
                            icon="pi pi-trash" 
                            rounded 
                            outlined 
                            severity="danger"
                            @click="deleteComponent(data)"
                        />
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<style scoped>
.component-index {
    padding: 2rem;
}

.p-datatable .p-datatable-thead > tr > th {
    background-color: var(--surface-100);
}

.p-datatable .p-datatable-tbody > tr > td {
    padding: 1rem;
}
</style>
