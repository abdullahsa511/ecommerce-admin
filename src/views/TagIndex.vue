<script setup>
import { ref, onMounted } from 'vue';
import { useTagStore } from '../stores/tag';
import { storeToRefs } from 'pinia';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import { useRouter } from 'vue-router';

const router = useRouter();

const tagStore = useTagStore();
const { filteredTags, fb } = storeToRefs(tagStore);
const selectedTags = ref([]);
const filters = ref({
    global: { value: null, matchMode: 'contains' },
    name: { value: null, matchMode: 'contains' },
    slug: { value: null, matchMode: 'contains' },
    description: { value: null, matchMode: 'contains' }
});

onMounted(() => {
    tagStore.fetchTags();
});

const clearFilter = () => {
    filters.value = {
        global: { value: null, matchMode: 'contains' },
        name: { value: null, matchMode: 'contains' },
        slug: { value: null, matchMode: 'contains' },
        description: { value: null, matchMode: 'contains' }
    };
};

const deleteSelectedTags = () => {
    // TODO: Implement delete functionality
    console.log('Deleting selected tags:', selectedTags.value);
};

const addTag = () => {
    router.push('/posts/add-tag');
};

const editTag = (tag) => {
    // TODO: Implement edit functionality
    console.log('Editing tag:', tag);
};

const deleteTag = (tag) => {
    // TODO: Implement delete functionality
    console.log('Deleting tag:', tag);
};

const getTagIcon = (name) => {
    switch (name.toLowerCase()) {
        case 'electronics':
            return 'pi pi-desktop';
        case 'fashion':
            return 'pi pi-shopping-bag';
        case 'books':
            return 'pi pi-book';
        case 'sports':
            return 'pi pi-heart';
        case 'home':
            return 'pi pi-home';
        default:
            return 'pi pi-tag';
    }
};
</script>

<template>
    <div class="tag-index">
        <div class="mb-4 flex justify-end">
            <Button 
                icon="pi pi-plus" 
                label="Add Tag" 
                severity="primary" 
                @click="addTag"
            />
        </div>
        <!-- Error Alert -->
        <div v-if="fb.errors.tag" class="alert alert-danger" role="alert">
            {{ fb.errors.tag }}
        </div>

        <!-- Loading Spinner -->
        <div v-if="fb.loading.tag" class="text-center">
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>

        <!-- Data Table -->
        <DataTable
            v-model:filters="filters"
            v-model:selection="selectedTags"
            :value="filteredTags"
            paginator
            :rows="10"
            dataKey="tag_id"
            filterDisplay="menu"
            :loading="fb.loading.tag"
            :globalFilterFields="['name', 'slug', 'description']"
            class="p-datatable-lg"
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
                            v-if="selectedTags && selectedTags.length > 0"
                            type="button"
                            icon="pi pi-trash"
                            label="Delete Selected"
                            severity="danger"
                            @click="deleteSelectedTags"
                        />
                    </div>
                    <span class="p-input-icon-left">
                        <i class="pi pi-search" />
                        <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                    </span>
                </div>
            </template>

            <!-- Selection Column -->
            <Column selectionMode="multiple" headerStyle="width: 3rem" />

            <!-- Thumbnail Column -->
            <Column header="Thumb" style="width: 150px">
                <template #body="{ data }">
                    <i :class="[getTagIcon(data.name), 'thumb-icon']"></i>
                </template>
            </Column>

            <!-- Name Column -->
            <Column field="name" header="Name" :sortable="true" style="min-width: 150px">
                <template #filter="{ filterModel }">
                    <InputText
                        v-model="filterModel.value"
                        type="text"
                        class="p-column-filter"
                        placeholder="Search by name"
                    />
                </template>
            </Column>

            <!-- Slug Column -->
            <Column field="slug" header="Slug" :sortable="true" style="min-width: 300px">
                <template #filter="{ filterModel }">
                    <InputText
                        v-model="filterModel.value"
                        type="text"
                        class="p-column-filter"
                        placeholder="Search by slug"
                    />
                </template>
            </Column>

            <!-- Description Column -->
            <Column field="description" header="Description" style="min-width: 300px">
                <template #filter="{ filterModel }">
                    <InputText
                        v-model="filterModel.value"
                        type="text"
                        class="p-column-filter"
                        placeholder="Search by description"
                    />
                </template>
            </Column>

            <!-- Actions Column -->
            <Column header="Actions" :exportable="false" style="min-width: 8rem">
                <template #body="{ data }">
                    <div class="flex gap-2">
                        <Button
                            icon="pi pi-pencil"
                            rounded
                            outlined
                            class="mr-2"
                            @click="editTag(data)"
                        />
                        <Button
                            icon="pi pi-trash"
                            rounded
                            outlined
                            severity="danger"
                            @click="deleteTag(data)"
                        />
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<style scoped>
.tag-index {
    padding: 20px;
}

:deep(.p-datatable .p-datatable-tbody > tr > td) {
    padding: 1rem;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
    padding: 1rem;
}

.thumb-icon {
    font-size: 1.5rem;
    color: #6c757d;
}

.status-badge {
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.875rem;
}

.status-disabled {
    background-color: #e9ecef;
    color: #6c757d;
}
</style> 