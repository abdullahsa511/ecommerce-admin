<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';
import { useWeightTypeStore } from '@/stores/weightType';

const props = defineProps({ id: { type: String, required: false, default: null } })
const router = useRouter();
const weightTypeStore = useWeightTypeStore();
const { weightType, fb } = storeToRefs(weightTypeStore);
const toast = useToast();

const emit = defineEmits({})

//Define local variables here
const items = ref([
  { route: `/configuration/settings/weight/list`, label: 'Weight Type List', icon: 'pi pi-home' },
  { route: `/configuration/settings/weight/add`, label: 'Add', icon: 'pi pi-link' },
  { route: `/configuration/settings/weight/import`, label: 'Import', icon: 'pi pi-link' },
  // { route: `/configuration/settings/weight/export`, label: 'Download CSV', icon: 'pi pi-file-excel' },
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

// Fetch weightType if route is edit
const handleSave = async () => {
  try {
    let response: any;
    if (weightType.value.weight_type_id) {
      response = await weightTypeStore.updateWeightType(weightType.value);
    } else {
      // Create new weightType
      response = await weightTypeStore.createWeightType(weightType.value);
    }

    if (response?.weight_type_id) {
      router.push('/configuration/settings/weight/edit/'+ response.weight_type_id);
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Weight type saved successfully',
        life: 3000
      });
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save weight type: ' + (response?.message || ''), life: 5000 });
    }
  } catch (error) {
    console.error('Error saving weightType:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'An error occurred while saving the weightType.',
      life: 5000
    });
  }
};

const refreshTabs = () => {
  const routeId = router.currentRoute.value.params.id;
  if (routeId) {
    const editRoute = `/configuration/settings/weight/edit/${routeId}`;
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
  <div class="weightType card relative">
    <Button 
    v-if="showSaveButton" 
    :label="saveLabel" 
    :icon="fb.loading['weightType.create'] || fb.loading['weightType.update.' + props.id] ? 'pi pi-spinner pi-spin' : 'pi pi-save'"
    :disabled="fb.loading['weightType.create'] || fb.loading['weightType.update.' + props.id]"
    class="p-button-md" 
    @click="handleSave" />
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