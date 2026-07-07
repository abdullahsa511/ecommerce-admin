<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { usePostStore } from '@/stores/post';
import PostFilter from '@/filters/PostFilter';
import InputText from 'primevue/inputtext';
import { useToast } from 'primevue/usetoast';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

const router = useRouter();
const toast = useToast();
const postStore = usePostStore();
const {fb, posts} = storeToRefs(postStore);
const filters = ref({...new PostFilter()});
const loading = ref(true);
const authors = computed(() => postStore.authors);

// Watch for changes in posts
watch(posts, (newPosts) => {
    console.log('Posts data updated:', newPosts);
}, { deep: true });

const fetchPosts = async () => {
  try {
    loading.value = true;
    await postStore.fetchPosts();
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load posts. Please try again later.',
      life: 3000
    });
  } finally {
    loading.value = false;
  }
};

const editPost = async (data) => {
  try {
    router.push(`/posts/${data.post_id}`);
  } catch (error) {
    console.error('Error fetching post details:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load post details. Please try again later.',
      life: 3000
    });
  }
};

const deletePost = async (data) => {
  try {
    await postStore.deletePost(data.post_id);
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Post deleted successfully',
      life: 3000
    });
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to delete post. Please try again later.',
      life: 3000
    });
  }
};

const clearFilter = () => {
  console.log('Clearing filters');
  filters.value = {...new PostFilter()};
};

const renderIcon = (icon, action, id) => {
  return fb.value.loading[`post.${action}.${id}`] ? 'pi pi-spinner pi-spin' : icon;
};

onMounted(() => {
  console.log('Component mounted, initializing...');
  fetchPosts();
  setTimeout(() => {
    console.log(posts.value);
  }, 2000)
});

</script>

<template>
  <div>
    <DataTable
      v-model:filters="filters"
      :value="posts"
      paginator
      showGridlines
      :rows="10"
      dataKey="post_id"
      filterDisplay="menu"
      :loading="loading"
      :globalFilterFields="['postContent.name', 'author.first_name', 'created_at']"
    >
      <template #header>
        <div class="flex justify-between">
          <Button
            type="button"
            icon="pi pi-filter-slash"
            label="Clear"
            outlined
            @click="clearFilter()"
          />
          <IconField>
            <InputIcon>
              <i class="pi pi-search" />
            </InputIcon>
            <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
          </IconField>
        </div>
      </template>
      <template #empty> No customers found. </template>
      <template #loading> Loading customers data. Please wait. </template>
      <Column field="featured_image_thumb" header="Thumbnail" style="min-width: 8rem">
        <template #body="{ data }">
          <img 
            :src="data.feature_image_thumb?.[0]?.objectURL" 
            :alt="data.postContent.name"
            style="width: 50px; height: 50px; object-fit: cover;"
            class="shadow-2 border-round"
          />
        </template>
      </Column>
      <Column field="postContentName" header="Name" style="min-width: 12rem">
        <template #body="{ data }">
          {{ data.postContent.name }}
        </template>
        <template #filter="{ filterModel }">
          <InputText 
            v-model="filterModel.value" 
            type="text" 
            placeholder="Search by name" 
            class="p-2"
          />
        </template>
      </Column>
      <Column header="Author" filterField="authorName" :showFilterMatchModes="false" :filterMenuStyle="{ width: '14rem' }" style="min-width: 14rem">
        <template #body="{ data }">
          {{ data.author?.first_name }} {{ data.author?.last_name }}
        </template>
        <template #filter="{ filterModel }">
            <MultiSelect v-model="filterModel.value" :options="authors"  placeholder="Any">
                <template #option="slotProps">
                    <div class="flex items-center gap-2">
                        <span>{{ slotProps.option }}</span>
                    </div>
                </template>
            </MultiSelect>
        </template>
      </Column>
      <Column field="comment_count" header="Comments" style="min-width: 8rem">
        <template #body="{ data }">
          <span class="pi pi-comments mr-2"></span>
          {{ data.comment_count }}
        </template>
        <template #filter="{ filterModel }">
          <InputNumber 
            v-model="filterModel.value" 
            placeholder="Search by count"
            :showButtons="false"
          />
        </template>
      </Column>
      <Column field="created_at" header="Date" dataType="date" style="min-width: 10rem">
        <template #body="{ data }">
          {{ data.getFormattedDate(data.created_at) }}
        </template>
        <template #filter="{ filterModel }">
          <Calendar 
            v-model="filterModel.value" 
            dateFormat="mm/dd/yy" 
            placeholder="mm/dd/yyyy"
            :showButtonBar="true"
          />
        </template>
      </Column>
      <Column field="sort_order" header="Sort Order" style="min-width: 8rem" sortable>
        <template #body="{ data }">
          {{ data.sort_order }}
        </template>
      </Column>
      <Column header="Actions" :exportable="false" style="min-width: 8rem">
        <template #body="{ data }">
          <div class="flex gap-2">
            <Button 
              :icon="renderIcon('pi pi-pencil', 'edit', data.post_id)"
              rounded 
              outlined 
              severity="success" 
              class="mr-2"
              @click="editPost(data)"
            />
            <Button 
              :icon="renderIcon('pi pi-trash', 'delete', data.post_id)"
              rounded 
              outlined 
              severity="danger"
              @click="deletePost(data)"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>
