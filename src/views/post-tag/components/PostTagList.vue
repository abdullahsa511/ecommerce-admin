<script setup lang="ts">
import { resolveMediaImage, hasMediaImage } from '@/utils/mediaUrl';
import { ref, onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useToast } from 'primevue/usetoast';
import { usePostTagStore } from '@/stores/postTag';
import PostTagFilter from '@/filters/PostTagFilter';
// import PostTag from '@/models/PostTag';

const router = useRouter();
const postTagStore = usePostTagStore();
const { postTags, fb } = storeToRefs(postTagStore);
const filters = ref(new PostTagFilter());
const toast = useToast();
// const serverUrl = import.meta.env.VITE_API_BASE_URL;
// const selectedTags = ref<PostTag[]>([]);


// const tagsWithFullThumbnail = computed(() =>
//   postTags.value.map((tag: PostTag) => ({
//     ...tag,
//     image: tag.image && !tag.image.startsWith('http')
//       ? serverUrl + tag.image
//       : tag.image
//   }))
// );

const editTag = (data: any) => {
    router.push(`/posts/tags/edit/${data.post_tag_id}`);
};

const deleteTag = async (data: any) => {
    try {
        await postTagStore.deletePostTag(data.post_tag_id);
        toast.add({ severity: 'success', summary: 'Success', detail: 'Product deleted successfully', life: 3000 });
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete product.', life: 3000 });
    }
};

// const deleteSelectedTags = async () => {
//     // if (selectedTags.value.length > 0) {
//     //     try {
//     //         for (const tag of selectedTags.value) {
//     //             await postTagStore.deletePostTag(tag.post_tag_id!);
//     //         }
//     //         selectedTags.value = [];
//     //         // Refresh the data after successful bulk deletion
//     //         // await fetchPostTags();
//     //     } catch (error) {
//     //         console.error('Error deleting selected tags:', error);
//     //     }
//     // }
// };

const clearFilter = () => {
    filters.value = new PostTagFilter();
};

watch(postTags.value, (newVal) => {
    console.log('Post Tag updated:', newVal);
}
);

onMounted(() => {
    postTagStore.fetchPostTags();
});
</script>

<template>
    <DataTable 
        v-model:filters="filters" 
        :value="postTags" 
        paginator
        :rows="10" 
        dataKey="post_tag_id"
        filterDisplay="menu" 
        :loading="fb.loading['postTag.name']" 
        :globalFilterFields="['name']"
        class="th-table table-border">

        <template #header>
            <div class="flex justify-between items-center">
                <div class="flex gap-2">
                    <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                </div>
                <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
            </div>
        </template>
        <template #empty> No post tags found. </template>
        <template #loading> Loading post tags data. Please wait. </template>
        

        <Column header="Thumbnail" style="width: 100px">
            <template #body="{ data }">
                <img 
            :src="resolveMediaImage(data.image)" 
            :alt="data.name"
            style="width: 50px; height: 50px; object-fit: cover;"
            class="shadow-2 border-round"
          />

                <!-- <Avatar
                :image="Array.isArray(data.image) && data.image.length ? data.image[0]?.url || data.image[0] : null"
                :label="(!Array.isArray(data.image) || !data.image.length) ? data.name?.charAt(0) : null"
                shape="square"
                size="large"
                /> -->
            </template>
        </Column>


        <Column header="Name" filterField="name" :showFilterMatchModes="false" :filterMenuStyle="{ width: '14rem' }"
            style="min-width: 12rem">
            <template #body="{ data }">
                <a @click="editTag(data)" class="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline">
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
                {{ new Date(data.created_at).toLocaleDateString() }}
            </template>
        </Column>

        <Column header="Actions" :exportable="false" style="min-width: 8rem">
            <template #body="{ data }">
                <div class="flex gap-2">
                    <Button icon="pi pi-pencil" rounded outlined severity="success" class="mr-2 p-button-secondary"
                        @click="editTag(data)" />
                    <Button icon="pi pi-trash" rounded outlined severity="danger" class="p-button-danger"
                        @click="deleteTag(data)" />
                </div>
            </template>
        </Column>
    </DataTable>
</template>

<style scoped>
.product-posttag-index {
    padding: 2rem;
}

.p-datatable .p-datatable-thead>tr>th {
    background-color: var(--surface-100);
}

.p-datatable .p-datatable-tbody>tr>td {
    padding: 1rem;
}
</style>
