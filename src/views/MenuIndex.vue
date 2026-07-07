<script setup>
import { ref, onMounted, computed } from 'vue';
import { useMenuStore } from '../stores/menu';
// import { FilterMatchMode } from 'primevue/datatable';
import { formatDate } from '../utils/date';

const menuStore = useMenuStore();
const menus = ref([]);
const menuDialog = ref(false);
const deleteMenuDialog = ref(false);
const menu = ref({});
const submitted = ref(false);
// const filters = ref({
//     global: { value: null, matchMode: FilterMatchMode.CONTAINS }
// });

const filteredMenus = computed(() => menuStore.filteredMenus);
const loading = computed(() => menuStore.loading);
const error = computed(() => menuStore.error);

const locationOptions = [
    { label: 'Header', value: 'header' },
    { label: 'Footer', value: 'footer' },
    { label: 'Sidebar', value: 'sidebar' }
];

const getLocationSeverity = (location) => {
    switch (location) {
        case 'header':
            return 'info';
        case 'footer':
            return 'warning';
        case 'sidebar':
            return 'success';
        default:
            return null;
    }
};

onMounted(() => {
    menuStore.fetchMenus();
});

// const showAddDialog = () => {
//     menu.value = {};
//     submitted.value = false;
//     menuDialog.value = true;
// };

const hideDialog = () => {
    menuDialog.value = false;
    submitted.value = false;
};

const saveMenu = async () => {
    submitted.value = true;

    if (menu.value.name && menu.value.location) {
        try {
            if (menu.value.menu_id) {
                await menuStore.updateMenu(menu.value);
            } else {
                await menuStore.addMenu(menu.value);
            }
            menuDialog.value = false;
            menu.value = {};
        } catch (error) {
            console.error('Error saving menu:', error);
        }
    }
};

const editMenu = (menuData) => {
    menu.value = { ...menuData };
    menuDialog.value = true;
};

const confirmDeleteMenu = (menuData) => {
    menu.value = menuData;
    deleteMenuDialog.value = true;
};

const deleteMenu = async () => {
    try {
        await menuStore.deleteMenu(menu.value.menu_id);
        deleteMenuDialog.value = false;
        menu.value = {};
    } catch (error) {
        console.error('Error deleting menu:', error);
    }
};
</script>

<template>
    <div class="menu-index">
        <div class="flex justify-content-between align-items-center mb-4">
            <h1>Menus</h1>
            <!-- <Button label="Add Menu" icon="pi pi-plus" @click="showAddDialog" /> -->
        </div>

        <div class="card">
            <DataTable
                :value="filteredMenus"
                :loading="loading"
                :paginator="true"
                :rows="10"
                :rowsPerPageOptions="[5, 10, 20]"
                :globalFilterFields="['name', 'location']"
                v-model:filters="filters"
                filterDisplay="row"
                dataKey="menu_id"
                responsiveLayout="scroll"
            >
                <!-- <template #header>
                    <div class="flex justify-content-between">
                        <span class="p-input-icon-left">
                            <i class="pi pi-search" />
                            <InputText v-model="filters['global'].value" placeholder="Search..." />
                        </span>
                    </div>
                </template> -->

                <Column field="name" header="Name" :sortable="true">
                    <template #body="{ data }">
                        <span class="font-medium">{{ data.name }}</span>
                    </template>
                </Column>

                <Column field="location" header="Location" :sortable="true">
                    <template #body="{ data }">
                        <Tag :value="data.location" :severity="getLocationSeverity(data.location)" />
                    </template>
                </Column>

                <Column field="items" header="Items" :sortable="true">
                    <template #body="{ data }">
                        <span>{{ data.items.length }} items</span>
                    </template>
                </Column>

                <Column field="created_at" header="Created" :sortable="true">
                    <template #body="{ data }">
                        {{ formatDate(data.created_at) }}
                    </template>
                </Column>

                <Column header="Actions" :exportable="false" style="min-width: 8rem">
                    <template #body="{ data }">
                        <Button
                            icon="pi pi-pencil"
                            class="p-button-rounded p-button-text mr-2"
                            @click="editMenu(data)"
                        />
                        <Button
                            icon="pi pi-trash"
                            class="p-button-rounded p-button-text p-button-danger"
                            @click="confirmDeleteMenu(data)"
                        />
                    </template>
                </Column>
            </DataTable>
        </div>

        <Dialog
            v-model:visible="menuDialog"
            :style="{ width: '450px' }"
            header="Menu Details"
            :modal="true"
            class="p-fluid"
        >
            <div class="field">
                <label for="name">Name</label>
                <InputText
                    id="name"
                    v-model.trim="menu.name"
                    required
                    autofocus
                    :class="{ 'p-invalid': submitted && !menu.name }"
                />
                <small class="p-error" v-if="submitted && !menu.name">Name is required.</small>
            </div>

            <div class="field">
                <label for="location">Location</label>
                <Dropdown
                    id="location"
                    v-model="menu.location"
                    :options="locationOptions"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Select a location"
                    :class="{ 'p-invalid': submitted && !menu.location }"
                />
                <small class="p-error" v-if="submitted && !menu.location">Location is required.</small>
            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveMenu" />
            </template>
        </Dialog>

        <Dialog
            v-model:visible="deleteMenuDialog"
            :style="{ width: '450px' }"
            header="Confirm"
            :modal="true"
        >
            <div class="confirmation-content">
                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                <span v-if="menu"
                    >Are you sure you want to delete <b>{{ menu.name }}</b
                    >?</span
                >
            </div>
            <template #footer>
                <Button
                    label="No"
                    icon="pi pi-times"
                    class="p-button-text"
                    @click="deleteMenuDialog = false"
                />
                <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteMenu" />
            </template>
        </Dialog>
    </div>
</template>

<style scoped>
.menu-index {
    padding: 2rem;
}

.p-datatable .p-datatable-thead > tr > th {
    background-color: var(--surface-100);
}

.p-datatable .p-datatable-tbody > tr > td {
    padding: 1rem;
}

.confirmation-content {
    display: flex;
    align-items: center;
    justify-content: center;
}
</style> 