<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { usePageStore } from '@/stores/page';
import PageFilter from '@/filters/PageFilter';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';

const pageStore = usePageStore();
const { pages, fb } = storeToRefs(pageStore);
const filters = ref({...new PageFilter()});
const selectedPages = ref([]);
const router = useRouter();
const toast = useToast();
const authors = ref([]);

const domainUrl = import.meta.env.VITE_STATIC_BASE_URL + '/page/';

onMounted(async () => {
    await pageStore.fetchPages();
    console.log('Pages loaded:', pages.value);
});

// Edit page
const editPage = (page: any) => router.push(`/pages/${page.post_id}`);

// go to website
const goToWebsite = (data: any) => {
    if (data?.postContent?.slug) {
        window.open(domainUrl + data.postContent.slug, '_blank');
    }
};

// Delete page
const deletePage = async (page: any) => {
    try {
        await pageStore.deletePage(page.post_id);
        toast.add({ severity: 'success', summary: 'Deleted', detail: 'Page deleted successfully', life: 3000 });
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete page', life: 3000 });
    }
};

// Clear filters
const clearFilter = () => filters.value = {...new PageFilter()};

const renderIcon = (icon: string, action: string, id: number) => {
  return fb.value.loading[`page.${action}.${id}`] ? 'pi pi-spinner pi-spin' : icon;
};

// onMounted(() => {
//     authors.value = pages.value.map(p => `${p.admin_first_name || ''} ${p.admin_last_name || ''}`.trim()).filter((v, i, a) => v && a.indexOf(v) === i);
// });
</script>

<template>
    <div>
        <DataTable 
            v-model:filters="filters" 
            :value="pages" 
            paginator showGridlines 
            :rows="10" d
            ataKey="post_id"
            filterDisplay="menu" 
            :globalFilterFields="['title', 'authorName']" 
            :selection="selectedPages"
            @update:selection="selectedPages = $event" 
            :loading="fb.loading.pages">
            
            <!-- Header -->
            <template #header>
                <div class="flex justify-between items-center">
                    <Button icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter" />
                    <div class="flex items-center gap-2">
                        <i class="pi pi-search" />
                        <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                    </div>
                </div>
            </template>

            <template #empty>No pages found.</template>
            <template #loading>Loading pages...</template>

            <Column header="Thumbnail" style="max-width:5rem">
                <template #body="{ data }">
                    <img v-if="data.getThumbnailUrl()" :src="data.getThumbnailUrl()" :alt="data.getTitle()"
                        style="width:50px; height:50px; object-fit:cover;" />
                    <span v-else class="text-gray-400 text-sm">No Image</span>
                </template>
            </Column>

            <Column field="title" header="Title" style="max-width:20rem; overflow: clip;">
                <template #body="{ data }">
                    <a class="link truncate" @click.stop="editPage(data)">{{ data.title }}</a>
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" placeholder="Search by title" />
                </template>
            </Column>

            <Column field="link" header="Web Page link " style="max-width:20rem;  overflow: clip;">
                <template #body="{ data }">
                    <a class="link truncate" @click.stop="goToWebsite(data)">{{ domainUrl + data.postContent.slug }}</a>
                </template>
            </Column>

            <Column field="authorName" header="Author" style="max-width:14rem">
                <template #body="{ data }">
                    {{ data.getAuthorName() }}
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" placeholder="Search by author name" />
                </template>
            </Column>
            <!-- sort order -->
            <Column field="sort_order" header="Sort Order" style="max-width:12rem">
                <template #body="{ data }">
                    {{ data.sort_order }}
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" placeholder="Search by sort order" />
                </template>
            </Column>

            <Column field="created_at" header="Date" style="max-width:12rem">
                <template #body="{ data }">{{ data.getFormattedDate(data.created_at) }}</template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" placeholder="Search by date" />
                </template>
            </Column>
            <!-- Actions Column -->
            <Column header="Actions" style="min-width: 8rem">
                <template #body="{ data }">
                    <div class="flex gap-2">
                        <Button :icon="renderIcon('pi pi-pencil', 'edit', data.post_id)" rounded outlined severity="success" @click="editPage(data)" />
                        <Button :icon="renderIcon('pi pi-trash', 'delete', data.post_id)" rounded outlined severity="danger" @click="deletePage(data)" />
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<style scoped>
.link {
    color: #2563eb;
    text-decoration: underline;
    cursor: pointer;
    font-weight: bold;
}

.link:hover {
    color: #1d4ed8;
}
</style>
