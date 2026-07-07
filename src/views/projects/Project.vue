<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router';
// Remove curly braces for default import
import { useProjectStore } from '@/stores/project';
import { storeToRefs } from 'pinia';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';
import Project from '@/models/Project';

//System variables such as props, useStore or stateToRef etc
const props = defineProps({ id: { type: String, required: false, default: null } })
const router = useRouter();
const ProjectStore = useProjectStore();
const { project, fb } = storeToRefs(ProjectStore);
const toast = useToast();

//Declear emits
const emit = defineEmits({})

//Define local variables here
const items = ref([
  { route: `/ecommerce/projects/list`, label: 'Projects', icon: 'pi pi-home' },
  { route: `/ecommerce/projects/add/general`, label: 'Add', icon: 'pi pi-link' },
  { route: `/ecommerce/projects/import`, label: 'Import', icon: 'pi pi-link' },
]);
const currentRoute = computed(() => {
  return router.currentRoute.value.path;
});

const showSaveButton = computed(() => {
    const path = currentRoute.value || '';
    return path.includes('/add') || path.includes('/edit');
});

const saveLabel = computed(() => {
    return currentRoute.value && currentRoute.value.includes('/edit') ? 'Save and Update' : 'Save';
})

// Fetch project if route is edit
const handleSave = async () => {
  try {
    let response: any;

    if (project.value.project_id) {
      // Update existing project
      response = await ProjectStore.updateProject(project.value);
    } else {
      // Create new project
      response = await ProjectStore.createProject(project.value);
    }

    if (response?.project_id) {
      router.push('/ecommerce/projects/edit/' + response.project_id);
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Project saved successfully',
        life: 3000
      });

      // Reset the form a new project
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save project: ' + (response?.message || ''), life: 5000 });
    }
  } catch (error) {
    console.error('Error saving project:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'An error occurred while saving the project.',
      life: 5000
    });
  }
};

const refreshTabs = () => {
  if (props.id) {
    const existRoute = items.value.find(item => item.route === `/ecommerce/projects/edit/${props.id}/general`);
    if (!existRoute) {
      items.value.push({ route: `/ecommerce/projects/edit/${props.id}/general`, label: 'Edit', icon: 'pi pi-list' });
    }
  } else {
    items.value = items.value.filter(item => !item.route.includes('/edit'));
  }
  project.value = new Project();
}
const renderIcon = (icon: string) => {
  if(props.id){
    return fb.value.loading[`project.update.${project.value.project_id}`] ? 'pi pi-spinner pi-spin' : icon;
  }else{
    return fb.value.loading['project.create'] ? 'pi pi-spinner pi-spin' : icon;
  }
}

//Lifecycle hook started from here
onMounted(() => {
  refreshTabs();
})
</script>

<template>
  <div class="projects card relative">
    <Button v-if="showSaveButton" :label="saveLabel" :icon="renderIcon('pi pi-save')"  class="p-button-md" @click="handleSave" 
    :disabled="fb.loading['project.update.'+project.project_id]" />
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
      <div class="py-6">
        <router-view @editTabUnmunted="refreshTabs" @saved="handleSave" @editTabMounted="refreshTabs" />
      </div>
    </Tabs>
  </div>
</template>

<style scoped>

</style>