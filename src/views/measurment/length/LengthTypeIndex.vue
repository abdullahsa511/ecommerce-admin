<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router';
// Remove curly braces for default import
import { storeToRefs } from 'pinia';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';
import { useLengthTypeStore } from '@/stores/lengthType';

const props = defineProps({ id: { type: String, required: false, default: null } })
const router = useRouter();
const lengthTypeStore = useLengthTypeStore();
const { lengthType, fb } = storeToRefs(lengthTypeStore);
const toast = useToast();

const emit = defineEmits({})

//Define local variables here
const items = ref([
  { route: `/configuration/settings/length/list`, label: 'Length Type List', icon: 'pi pi-home' },
  { route: `/configuration/settings/length/add`, label: 'Add', icon: 'pi pi-link' },
  { route: `/configuration/settings/length/import`, label: 'Import', icon: 'pi pi-link' },
  // { route: `/configuration/settings/length/export`, label: 'Download CSV', icon: 'pi pi-file-excel' },
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

// Fetch lengthType if route is edit
const handleSave = async () => {
  try {
    let response: any;
    if (lengthType.value.length_type_id) {
      response = await lengthTypeStore.updateLengthType(lengthType.value);
    } else {
      response = await lengthTypeStore.createLengthType(lengthType.value);
    }

    if (response?.length_type_id) {
      router.push('/configuration/settings/length/edit/'+ response.length_type_id);
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Length type saved successfully',
        life: 3000
      });
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save length type: ' + (response?.message || ''), life: 5000 });
    }
  } catch (error) {
    console.error('Error saving lengthType:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'An error occurred while saving the lengthType.',
      life: 5000
    });
  }
};

const refreshTabs = () => {
  const routeId = router.currentRoute.value.params.id;
  if (routeId) {
    const editRoute = `/configuration/settings/length/edit/${routeId}`;
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
  <div class="card relative">
    <Button 
      v-if="showSaveButton" 
      :label="saveLabel" 
      :icon="(fb.loading['lengthType.create'] || fb.loading['lengthType.update.' + props.id]) ? 'pi pi-spinner pi-spin' : 'pi pi-save'"
      :disabled="fb.loading['lengthType.create'] || fb.loading['lengthType.update.' + props.id]"
      class="p-button-md" 
      @click="handleSave" 
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