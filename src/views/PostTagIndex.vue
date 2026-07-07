<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { usePostTagStore } from '@/stores/postTag';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
// @ts-ignore
import PostTagFilter from '@/filters/__PostTagFilter_Backup';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Avatar from 'primevue/avatar';
import PostTag from '@/models/PostTag';

const router = useRouter();
const postTagStore = usePostTagStore();

const filters = ref(new PostTagFilter());

const selectedTags = ref<PostTag[]>([]);

const { postTags, fb } = storeToRefs(postTagStore);

const serverUrl = import.meta.env.VITE_API_BASE_URL; 
const tagsWithFullThumbnail = computed(() =>
  postTags.value.map((tag: PostTag) => ({
    ...tag,
    image: tag.image && !tag.image.startsWith('http')
      ? serverUrl + tag.image
      : tag.image
  }))
);

const isLoading = computed(() => {
    return fb?.value?.loading === true;
});

const fetchPostTags = async () => {
    await postTagStore.fetchPostTags();
};

const addTag = () => {
    router.push('/posts/add-tag');
};

const editTag = (data: PostTag) => {
    router.push(`/posts/edit-tag/${data.post_tag_id}`);
};

const deleteTag = async (data: PostTag) => {
    try {
        await postTagStore.deletePostTag(data.post_tag_id!);
        // Refresh the data after successful deletion
        await fetchPostTags();
    } catch (error) {
        console.error('Error deleting tag:', error);
    }
};

const deleteSelectedTags = async () => {
    if (selectedTags.value.length > 0) {
        try {
            for (const tag of selectedTags.value) {
                await postTagStore.deletePostTag(tag.post_tag_id!);
            }
            selectedTags.value = [];
            // Refresh the data after successful bulk deletion
            await fetchPostTags();
        } catch (error) {
            console.error('Error deleting selected tags:', error);
        }
    }
};

onMounted(() => {
    fetchPostTags();
});

const clearFilter = () => {
    initFilters()
}

const initFilters = () => {
    filters.value = new PostTagFilter();
}
</script>

<template>
    <div class="post-tag-index">
        <div class="mb-4 flex justify-end">
            <Button 
                icon="pi pi-plus" 
                label="Add Tag" 
                severity="primary" 
                @click="addTag"
            />
        </div>

        <DataTable
            v-model:filters="filters"
            v-model:selection="selectedTags"
            :value="tagsWithFullThumbnail"
            paginator
            :rows="10"
            dataKey="post_tag_id"
            filterDisplay="menu"
            :loading="isLoading"
            :globalFilterFields="['name', 'slug', 'description']"
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
                            v-if="selectedTags.length > 0"
                            type="button"
                            icon="pi pi-trash"
                            label="Delete Selected"
                            severity="danger"
                            @click="deleteSelectedTags"
                        />
                    </div>
                    <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                </div>
            </template>
            <template #empty> No post tags found. </template>
            <template #loading> Loading post tags data. Please wait. </template>

            <Column selectionMode="multiple" headerStyle="width: 3rem" />

            <Column header="Thumbnail" style="width: 100px">
                <template #body="{ data }">
                    <Avatar 
                        :image="data.image" 
                        :label="!data.image ? data.name?.charAt(0) : null"
                        shape="square" 
                        size="large" 
                    />
                </template>
            </Column>
            
            <Column header="Name" filterField="name" :showFilterMatchModes="false" :filterMenuStyle="{ width: '14rem' }" style="min-width: 12rem">
                <template #body="{ data }">
                    <a 
                        @click="editTag(data)" 
                        class="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline"
                    >
                        {{ data.name }}
                    </a>
                </template>
            </Column>

            <Column field="slug" header="Slug" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.slug }}
                </template>
            </Column>

            <Column field="description" header="Description" style="min-width: 22rem">
                <template #body="{ data }">
                    {{ data.description }}
                </template>
            </Column>

            <Column field="date_added" header="Date Added" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ new Date(data.date_added).toLocaleDateString() }}
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
                            class="mr-2 p-button-secondary"
                            @click="editTag(data)"
                        />
                        <Button 
                            icon="pi pi-trash" 
                            rounded 
                            outlined 
                            severity="danger"
                            class="p-button-danger"
                            @click="deleteTag(data)"
                        />
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<style scoped>
.post-tag-index {
    padding: 2rem;
}

.p-datatable .p-datatable-thead > tr > th {
    background-color: var(--surface-100);
}

.p-datatable .p-datatable-tbody > tr > td {
    padding: 1rem;
}
</style> 