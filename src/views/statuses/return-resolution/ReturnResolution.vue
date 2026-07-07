<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter} from 'vue-router';
// Remove curly braces for default import
import { storeToRefs } from 'pinia';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';
import { useReturnResolutionStore } from '@/stores/returnResolution';
//System variables such as props, useStore or stateToRef etc
const props = defineProps({ id: { type: String, required: false, default: null } })
const router = useRouter();
const toast = useToast();

// return resolution variables
const returnResolutionStore = useReturnResolutionStore();
const { returnResolution, fb} = storeToRefs(returnResolutionStore);

//Declear emits
const emit = defineEmits({})

//Define local variables here
const items = ref([
  { route: `/configuration/settings/return-resolutions/list`, label: 'Return Resolutions', icon: 'pi pi-home' },
  { route: `/configuration/settings/return-resolutions/add`, label: 'Add', icon: 'pi pi-link' },
  { route: `/configuration/settings/return-resolutions/import`, label: 'Import', icon: 'pi pi-link' },
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

// Fetch attribute if route is edit
const handleSave = async () => {
  console.log('returnResolution', returnResolution.value);
  try {
    let response: any;
    if (returnResolution.value.return_resolution_id) {
      response = await returnResolutionStore.updateReturnResolution(returnResolution.value.return_resolution_id, returnResolution.value);
    } else {
      response = await returnResolutionStore.createReturnResolution(returnResolution.value);
    }
    if (response?.return_resolution_id) {
      toast.add({ severity: 'success', summary: 'Success', detail: 'Return resolution saved successfully', life: 3000 }); 
      router.push('/configuration/settings/return-resolutions/edit/' + response.return_resolution_id);
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save return resolution', life: 5000 });
    }
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save return resolution', life: 5000 });
  }
};

const refreshTabs = () => {
  if (props.id) {
    const existRoute = items.value.find(item => item.route === `/configuration/settings/return-resolutions/edit/${props.id}`);
    if (!existRoute) {
      items.value.push({ route: `/configuration/settings/return-resolutions/edit/${props.id}`, label: 'Edit', icon: 'pi pi-list' });
    }
  } else {
    items.value = items.value.filter(item => !item.route.includes('/edit'));
    returnResolutionStore.resetReturnResolution();
  }
}
refreshTabs();

//Lifecycle hook started from here
onMounted(() => {
  refreshTabs();
})
</script>

<template>
  <div class="attriutes card relative">
    <Button v-if="showSaveButton" 
    :label="(fb.loading['returnResolution.create'] || fb.loading['returnResolution.update.'+returnResolution.return_resolution_id]) ? 'Processing...' : saveLabel" 
    :icon="fb.loading['returnResolution.create'] || fb.loading['returnResolution.update.'+returnResolution.return_resolution_id] ? 'pi pi-spinner pi-spin' : 'pi pi-save'"
    :loading="fb.loading['returnResolution.create'] || fb.loading['returnResolution.update.'+returnResolution.return_resolution_id]"
    :disabled="fb.loading['returnResolution.create'] || fb.loading['returnResolution.update.'+returnResolution.return_resolution_id]"
    class="p-button-md" @click="handleSave" />
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
      <div class="p-6">
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