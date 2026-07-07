<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router';
// Remove curly braces for default import
import { storeToRefs } from 'pinia';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';
import { usePostTagStore } from '@/stores/postTag';

//System variables such as props, useStore or stateToRef etc
const props = defineProps({ id: { type: String, required: false, default: null } })
const router = useRouter();
const postTagStore = usePostTagStore();
const { postTag } = storeToRefs(postTagStore);
const toast = useToast();

//Declear emits
const emit = defineEmits({})

//Define local variables here
const items = ref([
  { route: `/posts/categories/list`, label: 'Post Categories', icon: 'pi pi-home' },
  { route: `/posts/categories/add`, label: 'Add', icon: 'pi pi-link' },
  { route: `/posts/categories/import`, label: 'Import', icon: 'pi pi-link' },
]);
const currentRoute = computed(() => {
  return router.currentRoute.value.path;
});

// Show Save button only on add or edit routes. Change label when editing.
const showSaveButton = computed(() => {
  const path = currentRoute.value || '';
  return path.includes('/add') || path.includes('/edit');
});
// Change Save button label based on route
const saveLabel = computed(() => {
  return currentRoute.value && currentRoute.value.includes('/edit') ? 'Save and Update' : 'Save';
})

// Fetch post tag if route is edit
const handleSave = async () => {
  try {
    let response: any;
    if (postTag.value.post_tag_id) {
      response = await postTagStore.updatePostTag(postTag.value.post_tag_id, postTag.value);
    } else {
      postTag.value.post_id = 1;
      // Create new post tag
      response = await postTagStore.createPostTag(postTag.value);
    }

    if (response?.post_tag_id) {
      router.push('/posts/tags/edit/'+ response.post_tag_id);
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Post tag saved successfully',
        life: 3000
      });
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save post tag: ' + (response?.message || ''), life: 5000 });
    }
  } catch (error) {
    console.error('Error saving post tag:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'An error occurred while saving the post tag.',
      life: 5000
    });
  }
};

const refreshTabs = () => {
  const routeId = router.currentRoute.value.params.id;
  if (routeId) {
    const editRoute = `/posts/tags/edit/${routeId}`;
    const existRoute = items.value.find(item => item.route === editRoute);
    if (!existRoute) {
      items.value.push({ route: editRoute, label: 'Edit', icon: 'pi pi-list' });
    }
  } else {
    items.value = items.value.filter(item => !item.route.includes('/edit'));
  }
}
refreshTabs();

//Lifecycle hook started from here
onMounted(() => {
  refreshTabs();
})
</script>

<template>
  <div class="post-tag card relative">
    <Button v-if="showSaveButton" :label="saveLabel" icon="pi pi-save" class="p-button-md" @click="handleSave" />
    <Tabs :value="currentRoute" scrollable>
      <TabList>
        <template v-for="tab in items" :key="tab.label">
          <router-link v-if="tab.route" v-slot="{ href, navigate }" :to="tab.route" custom>
            <Tab :active="currentRoute === tab.route" :key="tab.label" :value="tab.route" @click="navigate">
              <a v-ripple :href="href" @click="navigate" class="flex items-center gap-2 text-inherit">
                <i :class="tab.icon" />
                <span>{{ tab.label }}</span>
              </a>
            </Tab>
          </router-link>
        </template>
      </TabList>
      <div class="">
        <router-view @editTabUnmunted="refreshTabs" @saved="handleSave" @editTabMounted="refreshTabs" />
      </div>
    </Tabs>
  </div>
</template>

<style scoped>
.p-button-md {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 1000;
}

.p-button-md-bottom {
  position: absolute;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}
</style>