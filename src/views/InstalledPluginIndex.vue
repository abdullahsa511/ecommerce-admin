<script setup>
import { ref, onMounted } from 'vue';
import { useInstalledPluginStore } from '../stores/installedPlugin';
import { storeToRefs } from 'pinia';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import SplitButton from 'primevue/splitbutton';
import { FilterMatchMode } from "@primevue/core/api";

const pluginStore = useInstalledPluginStore();
const { loading, error, filteredPlugins } = storeToRefs(pluginStore);
const selectedPlugins = ref([]);
const filters = ref({
    global: { value: null, matchMode: 'contains' },
    extension: { value: null, matchMode: 'contains' },
    status: { value: null, matchMode: FilterMatchMode.EQUALS }
});

const statusOptions = ['All', 'Active', 'Inactive'];
const selectedCategory = ref('All');

// Predefined categories in the order shown in the image
const categoryList = [
    { value: 'All', label: 'All' },
    { value: 'payment', label: 'payment' },
    { value: 'spam', label: 'spam' },
    { value: 'tools', label: 'tools' },
    { value: 'performance', label: 'performance' },
    { value: 'email', label: 'email' },
    { value: 'content', label: 'content' },
    { value: 'development', label: 'development' },
    { value: 'comments', label: 'comments' },
    { value: 'shipping', label: 'shipping' },
    { value: 'market', label: 'market' }
];

const items = ref([
    {
        label: 'Settings',
        icon: 'pi pi-cog',
    },
    {
        label: 'Global',
        class: 'p-error',
        command: (event) => {
            console.log('Global settings');
        }
    },
    {
        label: 'Activate on all sites',
        icon: 'pi pi-check',
        command: (event) => {
            console.log('Activate on all sites');
        }
    },
    {
        label: 'Deactivate on all sites',
        icon: 'pi pi-power-off',
        command: (event) => {
            console.log('Deactivate on all sites');
        }
    },
    {
        separator: true
    },
    {
        label: 'Delete',
        icon: 'pi pi-trash',
        class: 'p-error',
        command: (event) => {
            console.log('Delete plugin');
        }
    }
]);

onMounted(() => {
    pluginStore.fetchPlugins();
});

const clearFilter = () => {
    filters.value = {
        global: { value: null, matchMode: 'contains' },
        extension: { value: null, matchMode: 'contains' },
        status: { value: null, matchMode: 'equals' }
    };
    statusFilter.value = null;
    statusFilterLabel.value = 'All';
};

const deleteSelectedPlugins = () => {
    // TODO: Implement delete functionality
    console.log('Deleting selected plugins:', selectedPlugins.value);
};

const onCategoryChange = (category) => {
    selectedCategory.value = category;
    pluginStore.setCategory(category);
};

const toggleStatus = async (plugin) => {
    await pluginStore.togglePluginStatus(plugin.plugin_id);
};

const visitHomepage = (plugin) => {
    window.open(plugin.homepage, '_blank');
};

const getPluginIcon = (category) => {
    switch (category) {
        case 'payment':
            return 'pi pi-credit-card';
        case 'spam':
            return 'pi pi-shield';
        case 'tools':
            return 'pi pi-cog';
        case 'performance':
            return 'pi pi-bolt';
        case 'email':
            return 'pi pi-envelope';
        case 'content':
            return 'pi pi-file-edit';
        case 'development':
            return 'pi pi-code';
        case 'comments':
            return 'pi pi-comments';
        case 'shipping':
            return 'pi pi-truck';
        case 'market':
            return 'pi pi-shopping-cart';
        default:
            return 'pi pi-box';
    }
};
const statusFilter = ref(['All']);
const statusFilterLabel = ref('All');
const onChangeStatusFilter = (value) => {
    console.log(value);
   if (value === null) {
    filters.value['status'].value = null;
    statusFilter.value = ['All'];
    statusFilterLabel.value = 'All';
   } else if (value === true) {
    statusFilter.value =   statusFilter.value.push('Active');
    filters.value['status'].value = 'Active';
    statusFilterLabel.value = 'Active';
   } 
   else {
    // Check if statusFilter.value is an array before using push
    if (!Array.isArray(statusFilter.value)) {
      statusFilter.value = ['Inactive'];
    } else {
      statusFilter.value.push('Inactive'); // Reset to only contain 'Inactive'
    }
    filters.value['status'].value = 'Inactive';
    statusFilterLabel.value = 'Inactive';
   }
   console.log(filters.value);
}
</script>

<template>
    <div class="installed-plugin-index">

        <!-- Filter Container -->
        <div class="filter-container">
            <div class="category-menu">
                <a 
                    v-for="category in categoryList" 
                    :key="category.value"
                    href="#"
                    @click.prevent="onCategoryChange(category.value)"
                    :class="['category-link', selectedCategory === category.value ? 'active' : '']"
                >
                    {{ category.label }}
                </a>
            </div>

            <div class="status-menu">
                <a 
                    v-for="status in statusOptions" 
                    :key="status"
                    href="#"
                    @click.prevent="filters['status'].value = status"
                    :class="['status-link', filters['status'].value === status ? 'active' : '']"
                >
                    {{ status }}
                </a>
            </div>
        </div>

        <!-- Error Alert -->
        <div v-if="error" class="alert alert-danger" role="alert">
            {{ error }}
        </div>

        <!-- Loading Spinner -->
        <div v-if="loading" class="text-center">
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>

        <!-- Data Table -->
        <DataTable
            v-model:filters="filters"
            v-model:selection="selectedPlugins"
            :value="filteredPlugins"
            paginator
            :rows="10"
            dataKey="plugin_id"
            filterDisplay="menu"
            :loading="loading"
            :globalFilterFields="['extension', 'description']"
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
                            v-if="selectedPlugins && selectedPlugins.length > 0"
                            type="button"
                            icon="pi pi-trash"
                            label="Delete Selected"
                            severity="danger"
                            @click="deleteSelectedPlugins"
                        />
                    </div>
                    <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                </div>
            </template>
            <template #empty> No plugins found. </template>
            <template #loading> Loading plugins data. Please wait. </template>

            <!-- Selection Column -->
            <Column selectionMode="multiple" headerStyle="width: 3rem" />

            <!-- Thumb Column -->
            <Column header="Thumb" style="width: 100px">
                <template #body="{ data }">
                    <i :class="[getPluginIcon(data.category), 'thumb-icon']"></i>
                </template>
            </Column>

            <!-- Extension Column -->
            <Column header="Extension" field="extension" :showFilterMatchModes="false" style="min-width: 250px">
                <template #body="{ data }">
                    <div class="flex flex-col">
                        <span class="">{{ data.extension }}</span>
                    </div>
                </template>
            </Column>

            <!-- Status Column -->
            <Column header="Status" field="status" :showFilterMatchModes="false" style="width: 150px">
                <template #body="{ data }">
                    <span :class="['status-badge', data.status === 'Active' ? 'bg-green-700 text-white' : 'status-disabled']">
                        {{ data.status }}
                    </span>
                </template>
                <template #filter="{filterModel}">
                    <div class="p-field-checkbox p-m-0 flex align-items-center gap-2">
                        <Checkbox v-model="filterModel.value"
                        :indeterminate="filterModel.value === 'All' || filterModel.value === null" binary @change="onChangeStatusFilter(filterModel.value)" />
                        <label>{{
                            statusFilterLabel
                        }}</label>
                    </div>
                </template>
            </Column>

            <!-- Description Column -->
            <Column header="Description" field="description" style="min-width: 300px">
                <template #body="{ data }">
                    <div class="flex flex-col">
                        <span>{{ data.description }}</span>
                        <a href="#" class="text-blue-600 hover:text-blue-800  mt-1" @click.prevent="visitHomepage(data)">
                            Plugin homepage
                            <span class=" text-gray-500">/ Version {{ data.version }} / By {{ data.author }}</span>
                        </a>
                        
                    </div>
                </template>
            </Column>

            <!-- Actions Column -->
            <Column field="status" header="Actions" :exportable="false" style="width: 150px">
                <template #body="{ data }">
                    <div class="flex flex-wrap gap-2">
                        <SplitButton 
                            :label="data.status === 'Active' ? 'Deactivate' : 'Activate'" 
                            :icon="data.status === 'Active' ? 'pi pi-power-off' : 'pi pi-check'"
                            :model="items" 
                            :severity="data.status === 'Active' ? 'danger' : 'success'"
                            class="p-button-outlined"
                        />
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<style scoped>

:deep(.p-datatable .p-datatable-tbody > tr > td) {
    padding: 2rem 1rem;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
    padding: 1rem;
}

:deep(.p-splitbutton) {
    .p-button {
        padding: 0.5rem 0.8rem;
        font-size: 1rem;
        background-color: #fcfcfc;
        border: 1px solid #e0dbdb;
        color: #666;
        &:hover {
            background-color: #F3F3F3;
            border-color: #e0dbdb;
            color: #666;
        }
    }
}

:deep(.p-menu) {
    .p-menuitem.p-error {
        .p-menuitem-link {
            color: #dc3545;
            .p-menuitem-icon {
                color: #dc3545;
            }
            &:hover {
                background-color: #fff5f5;
            }
        }
    }
}

</style> 