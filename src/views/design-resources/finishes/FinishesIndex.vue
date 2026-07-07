<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';
import { useFinishStore } from '@/stores/designResourceFinish';

const props = defineProps({ id: { type: String, required: false, default: null } })
const router = useRouter();
const finishStore = useFinishStore();
const { finish, fb } = storeToRefs(finishStore);
const toast = useToast();

const emit = defineEmits({})

const items = ref([
  { route: `/design-resource-finishes/list`, label: 'Finish List', icon: 'pi pi-home' },
  { route: `/design-resource-finishes/add`, label: 'Add', icon: 'pi pi-link' },
  { route: `/design-resource-finishes/import`, label: 'Import', icon: 'pi pi-link' },
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

const handleSave = async () => {
  try {
    let response: any;
    if (finish.value.design_resource_id) {
      response = await finishStore.updateFinish(finish.value);
    } else {
      response = await finishStore.createFinish(finish.value);
    }

    if (response?.design_resource_id) {
      router.push('/design-resource-finishes/edit/'+ response.design_resource_id);
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Finish saved successfully',
        life: 3000
      });
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save finish: ' + (response?.message || ''), life: 5000 });
    }
  } catch (error) {
    console.error('Error saving finish:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'An error occurred while saving the finish.',
      life: 5000
    });
  }
};

const refreshTabs = () => {
  const routeId = router.currentRoute.value.params.id;
  if (routeId) {
    const editRoute = `/design-resource-finishes/edit/${routeId}`;
    const existRoute = items.value.find(item => item.route === editRoute);
    if (!existRoute) {
      items.value.push({ route: editRoute, label: 'Edit', icon: 'pi pi-list' });
    }
  } else {
    items.value = items.value.filter(item => !item.route.includes('/edit'));
  }
}
refreshTabs();

onMounted(() => {
  refreshTabs();
})
</script>

<template>
  <div class="card relative">
    <Button
      v-if="showSaveButton"
      :label="(fb.loading['finish.update.' + finish.design_resource_id] || fb.loading['finish.create']) ? 'Saving...' : saveLabel"
      :icon="(fb.loading['finish.update.' + finish.design_resource_id] || fb.loading['finish.create']) ? 'pi pi-spinner pi-spin' : 'pi pi-save'"
      class="p-button-md"
      @click="handleSave"
      :loading="fb.loading['finish.update.' + finish.design_resource_id] || fb.loading['finish.create']"
      :disabled="fb.loading['finish.update.' + finish.design_resource_id] || fb.loading['finish.create']"
    />
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
