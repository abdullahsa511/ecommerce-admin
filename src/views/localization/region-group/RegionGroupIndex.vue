<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router';
// Remove curly braces for default import
import { storeToRefs } from 'pinia';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';
import { useRegionGroupStore } from '@/stores/regionGroup';

const router = useRouter();
const regionGroupStore = useRegionGroupStore();
const { newRegionGroup, fb } = storeToRefs(regionGroupStore);
const toast = useToast();

//Define local variables here
const items = ref([
  { route: `/configuration/settings/region-groups/list`, label: 'Region Groups List', icon: 'pi pi-home' },
  { route: `/configuration/settings/region-groups/add`, label: 'Add', icon: 'pi pi-link' },
  // { route: `/configuration/settings/region-groups/import`, label: 'Import', icon: 'pi pi-link' },
]);
const currentRoute = computed(() => {
  return router.currentRoute.value.path;
});

const showSaveButton = computed(() => {
  const path = currentRoute.value || '';
  return path.includes('/add') || path.includes('/edit');
});
// Change Save button label based on route
const saveLabel = computed(() => {
  return currentRoute.value && currentRoute.value.includes('/edit') ? 'Save and Update' : 'Save';
})

// Fetch taxonomy if route is edit
const handleSave = async () => {
  try {
    let response: any;
    if (newRegionGroup.value.region_group_id) {
      response = await regionGroupStore.updateRegionGroup(newRegionGroup.value.region_group_id, newRegionGroup.value);
    } else {
      response = await regionGroupStore.createRegionGroup(newRegionGroup.value);
    }

    if (response?.region_group_id) {
      router.push('/configuration/settings/region-groups/edit/' + response.region_group_id);
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Region group saved successfully',
        life: 3000
      });
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save region group: ' + (response?.message || ''), life: 5000 });
    }
  } catch (error) {
    console.error('Error saving region group:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'An error occurred while saving the region.',
      life: 5000
    });
  }
};

const refreshTabs = () => {
  const routeId = router.currentRoute.value.params.id;
  if (routeId) {
    const editRoute = `/configuration/settings/region-groups/edit/${routeId}`;
    const existRoute = items.value.find(item => item.route === editRoute);
    if (!existRoute) {
      items.value.push({ route: editRoute, label: 'Edit', icon: 'pi pi-list' });
    }
  } else {
    items.value = items.value.filter(item => !item.route.includes('/edit'));
    regionGroupStore.resetRegionGroup();
  }
}
refreshTabs();

//Lifecycle hook started from here
onMounted(() => {
  refreshTabs();
})
</script>

<template>
  <div class="region-group card relative">
    <Button v-if="showSaveButton" 
    :label="fb.loading['regionGroup.create'] || fb.loading['regionGroup.update.' + newRegionGroup.region_group_id] ? 'Saving...' : saveLabel" 
    :icon="fb.loading['regionGroup.create'] || fb.loading['regionGroup.update.' + newRegionGroup.region_group_id] ? 'pi pi-spinner pi-spin' : 'pi pi-save'" 
    class="p-button-md" 
    @click="handleSave" 
    :loading="fb.loading['regionGroup.create'] || fb.loading['regionGroup.update.' + newRegionGroup.region_group_id]" />
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