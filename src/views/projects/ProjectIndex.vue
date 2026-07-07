<script setup lang="ts">
import { resolveMediaImage, hasMediaImage } from '@/utils/mediaUrl';
import { ref, onMounted, watch } from 'vue';
import { useProjectStore } from '@/stores/project';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
// 
import ProjectFilter from '@/filters/ProjectFilter';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';

const props = defineProps({ id: { type: String, required: false, default: null } })
const router = useRouter();
const projectStore = useProjectStore();
const { fb, projects } = storeToRefs(projectStore);

// const filters = ref({
//     global: { value: null, matchMode: 'contains' },
//     name: { value: null, matchMode: 'contains' },
//     price: { value: null, matchMode: 'equals' },
//     stock: { value: null, matchMode: 'equals' }
// });

const filters = ref(new ProjectFilter());
const selectedProjects = ref([]);

const fetchData = async () => {
    await projectStore.fetchProjects();
};

const addProject = () => router.push('/ecommerce/projects/add');
const editProject = (data: any) => router.push(`/ecommerce/projects/edit/${data.project_id}`);
const deleteProject = async (data: any) => {
    await projectStore.deleteProject(data.project_id);
    
};

// const addProject = () => {
//     router.push('/projects/new');
// };

// const editProject = (data: any) => {
//     router.push(`/ecommerce/projects/${data.project_id}`);
// };

// const deleteProject = async (data: any) => {
//     await projectStore.deleteProject(data.project_id);
// };

const deleteSelectedProjects = async () => {
    if (selectedProjects.value.length > 0) {
        for (const project of selectedProjects.value) {
            await projectStore.deleteProject(project.project_id);
        }
        selectedProjects.value = [];
    }
};

const clearFilter = () => {
    filters.value = {...new ProjectFilter()};
};

const renderIcon = (icon: string, action: string, id: number) => {
    return fb.value.loading[`project.${action}.${id}`] ? 'pi pi-spinner pi-spin' : icon;
};

watch(projects, (newVal) => {
}, { deep: true });

onMounted(() => {
    fetchData();
});

</script>

<template>
    <div class="product-index">
        <DataTable
            v-model:filters="filters"
            v-model:selection="selectedProjects"
            :value="projects"
            paginator
            :rows="10"
            dataKey="project_id"
            filterDisplay="menu"
            :loading="fb.loading.project"
            :globalFilterFields="['name', 'customer', 'location']"
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
                            @click="clearFilter"
                        />
                        <Button
                            v-if="selectedProjects.length > 0"
                            type="button"
                            icon="pi pi-trash"
                            label="Delete Selected"
                            severity="danger"
                            @click="deleteSelectedProjects"
                        />
                    </div>
                    <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                </div>
            </template>

            <Column selectionMode="multiple" headerStyle="width: 3rem" />
           <Column field="image_thumb" header="Thumbnail" style="min-width: 8rem">
                <template #body="{ data }">
                    <div v-if="data.image_thumb && data.image_thumb.length > 0">
                        <img 
                            :src="resolveMediaImage(data.image_thumb)" 
                            :alt="data.name"
                            style="width: 50px; height: 50px; object-fit: cover;"
                            class="shadow-2 border-round"
                        />
                    </div>
                    <div 
                        v-else 
                        class="flex items-center justify-center text-gray-400 text-xs border-1 surface-border border-round shadow-2"
                        style="width: 50px; height: 50px; background-color: #f9f9f9;"
                    >
                        No Image
                    </div>
                </template>
            </Column>
            <Column field="name" header="Project Name" style="min-width: 12rem">
                <template #body="{ data }">
                    <a @click="editProject(data)" class="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline">
                        {{ data.name }}
                    </a>
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" placeholder="Search by name" />
                </template>
            </Column>

            <Column field="customer" header="Customer" style="min-width: 10rem">
                <template #body="{ data }">
                    {{ data.customer?.name }}
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" placeholder="Search by customer" />
                </template>
            </Column>

            <Column field="location" header="Location" style="min-width: 8rem">
                <template #body="{ data }">
                    {{ data.location?.description }}
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" placeholder="Search by location" />
                </template>
            </Column>
            <Column field="sort_order" header="Sort Order" style="max-width:12rem">
                <template #body="{ data }">
                    {{ data.sort_order }}
                </template>
            </Column>

            <Column header="Actions" :exportable="false" style="min-width: 8rem">
                <template #body="{ data }">
                    <div class="flex gap-2">
                        <Button :icon="renderIcon('pi pi-pencil', 'edit', data.project_id)" rounded outlined severity="success" class="mr-2" @click="editProject(data)" />
                        

                        <Button 
                            :icon="fb.loading['project.delete.'+data.project_id] ? 'pi pi-spinner pi-spin' : 'pi pi-trash'"
                            :loading="fb.loading['project.delete.'+data.project_id]"
                            rounded outlined 
                            severity="danger" 
                            @click="deleteProject(data)"     
                        />


                        <!-- <Button 
                        :icon="renderIcon('pi pi-trash', 'delete', data.project_id)" 
                        rounded outlined 
                        severity="danger" 
                        @click="deleteProject(data)" 
                        /> -->
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<style scoped>

</style>