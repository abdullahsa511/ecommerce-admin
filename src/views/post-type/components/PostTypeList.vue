<script setup>
import { ref, onMounted, computed } from 'vue';
import { usePostTypeStore } from '@/stores/postType';
// import PostTypeFilter from '@/filters/PostTypeFilter';
import InputText from 'primevue/inputtext';
import { useSiteStore } from '@/stores/site';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { storeToRefs } from 'pinia';
import PostTypeFilter from '@/filters/PostTypeFilter';



const toast = useToast();
const router = useRouter();
const postTypeStore = usePostTypeStore();
const { postTypes, fb } = storeToRefs(postTypeStore);
const siteStore = useSiteStore();
const filters = ref({...new PostTypeFilter()});
const selectedPostTypes = ref([]);
const postTypeNames = computed(() => postTypeStore.postTypeNames);
const postTypeTypes = computed(() => Object.keys(postTypeStore.postTypesByType));

const isLoading = computed(() => {
  return fb.value.loading?.postType === true;
});

const fetchData = async () => {
  await Promise.all([
    postTypeStore.fetchPostTypes(),
    siteStore.fetchSites()
  ]);
};

const editPostType = (data) => {
  router.push(`/configuration/settings/post-types/edit/${data.post_type_id}`);
};

const deletePostType = async (postType) => {
  try {
      await postTypeStore.deletePostType(postType.post_type_id);
      toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Post type deleted successfully',
          life: 3000
      });
      await postTypeStore.fetchPostTypes();
  } catch (error) {
      toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete post type',
          life: 3000
      });
  }
};

const deleteSelectedPostTypes = async () => {
  if (selectedPostTypes.value.length > 0) {
    for (const postType of selectedPostTypes.value) {
      await postTypeStore.deletePostType(postType.post_type_id);
    }
    selectedPostTypes.value = [];
  }
};

onMounted(() => {
  fetchData();
});

const initFilters = () => {
  filters.value = {...new PostTypeFilter()};
};

const clearFilter = () => {
  initFilters();
};

const getSiteName = (siteId) => {
  const site = siteStore.sites.find(s => s.site_id === siteId);
  return site ? site.name : 'Unknown Site';
};

const onRowSelect = (event) => {
  console.log('Row selected:', event.data);
};

const onRowUnselect = (event) => {
 
};
</script>

<template>
  <div>
    <DataTable
      v-model:filters="filters"
      v-model:selection="selectedPostTypes"
      :value="postTypes"
      paginator
      :rows="10"
      dataKey="post_type_id"
      filterDisplay="menu"
     :loading="fb.loading['postType.list']"
      :globalFilterFields="['name', 'type', 'source']"
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
              v-if="selectedPostTypes.length > 0"
              type="button"
              icon="pi pi-trash"
              label="Delete Selected"
              severity="danger"
              @click="deleteSelectedPostTypes"
            />
          </div>
          <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
        </div>
      </template>
      <template #empty> No post types found. </template>
      <template #loading> Loading post types data. Please wait. </template>

      <Column selectionMode="multiple" headerStyle="width: 3rem" />
      
      <Column header="Name" filterField="postTypeNames" :showFilterMatchModes="false" :filterMenuStyle="{ width: '14rem' }" style="min-width: 14rem">
        <template #body="{ data }">
          <a 
            @click="editPostType(data)" 
            class="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline"
          >
            {{ data.name }}
          </a>
        </template>
        <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" class="p-column-filter"
                        placeholder="Search by name" />
                </template>
      </Column>
      
      <Column field="type" header="Type" style="min-width: 12rem">
        <template #body="{ data }">
          {{ data.type }}
        </template>
        
      </Column>

      <Column field="source" header="Source" style="min-width: 36rem">
        <template #body="{ data }">
          <span class="px-3 py-1 text-sm font-medium rounded-full bg-gray-200 text-black-800" style="display: inline-block;">
            {{ data.source }}
          </span>
        </template>
        
      </Column>
      
      <Column field="site_id" header="Site Name By Id" style="min-width: 12rem">
        <template #body="{ data }">
          <span class="px-3 py-1 text-sm font-medium rounded-full bg-green-700 text-white" style="display: inline-block;">
            {{ getSiteName(data.site_id) }}
          </span>
        </template>
        
      </Column>
      
      <Column header="Actions" :exportable="false" style="min-width: 8rem">
        <template #body="{ data }">
          <div class="flex gap-2">
            <Button 
              :icon="fb.loading['postType.edit.' + data.post_type_id] ? 'pi pi-spinner pi-spin' : 'pi pi-pencil'"
              :disabled="fb.loading['postType.edit.' + data.post_type_id]"
              rounded 
              outlined 
              severity="success" 
              class="mr-2"
              @click="editPostType(data)"
            />
            <Button 
              :icon="fb.loading['postType.delete.' + data.post_type_id] ? 'pi pi-spinner pi-spin' : 'pi pi-trash'"
              :disabled="fb.loading['postType.delete.' + data.post_type_id]"
              rounded 
              outlined 
              severity="danger"
              @click="deletePostType(data)"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template> 