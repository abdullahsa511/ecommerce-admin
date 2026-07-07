<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter} from 'vue-router';
// Remove curly braces for default import
import { storeToRefs } from 'pinia';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';
import { useReturnStatusStore } from '@/stores/returnStatus';


//System variables such as props, useStore or stateToRef etc
const props = defineProps({ id: { type: String, required: false, default: null } })
const router = useRouter();
const toast = useToast();

// return status variables
const returnStatusStore = useReturnStatusStore();
const { returnStatus, fb} = storeToRefs(returnStatusStore);

//Declear emits
const emit = defineEmits({})

//Define local variables here
const items = ref([
  { route: `/configuration/settings/return-statuses/list`, label: 'Return Statuses', icon: 'pi pi-home' },
  { route: `/configuration/settings/return-statuses/add`, label: 'Add', icon: 'pi pi-link' },
  { route: `/configuration/settings/return-statuses/edit`, label: 'Edit', icon: 'pi pi-link' },
  { route: `/configuration/settings/return-statuses/import`, label: 'Import', icon: 'pi pi-link' },
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

// Fetch retrun if route is edit
const handleSave = async () => {
  // console.log('returnStatus', returnStatus.value);
  try {
    let response: any;
    if (returnStatus.value.return_status_id) {
      response = await returnStatusStore.updateReturnStatus(returnStatus.value);
    } else {
      response = await returnStatusStore.createReturnStatus(returnStatus.value);
    }
    if (response?.return_status_id) {
      router.push('/configuration/settings/return-statuses/edit/' + response.return_status_id);
      toast.add({ severity: 'success', summary: 'Success', detail: 'Return status saved successfully', life: 3000 }); 
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save return status: ' + (response?.message || ''), life: 5000 });
    }
  } catch (error: any) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save return status: ' + (error?.message || ''), life: 5000 });
  }
};

const refreshTabs = () => {
  if (props.id) {
    const existRoute = items.value.find(item => item.route === `/configuration/settings/return-statuses/edit/${props.id}`);
    if (!existRoute) {
      items.value.push({ route: `/configuration/settings/return-statuses/edit/${props.id}`, label: 'Edit', icon: 'pi pi-list' });
    }
  } else {
    items.value = items.value.filter(item => !item.route.includes('/edit'));
    returnStatusStore.resetReturnStatus();
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
    <Button v-if="showSaveButton" :label="saveLabel" 
    :icon="fb.loading['returnStatus.create'] || fb.loading['returnStatus.update.' + props.id] ? 'pi pi-spinner pi-spin' : 'pi pi-save'" 
    :disabled="fb.loading['returnStatus.create'] || fb.loading['returnStatus.update.' + props.id]" 
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
      <div class="py-6">
        <router-view @editTabUnmunted="refreshTabs" @saved="handleSave" @editTabMounted="refreshTabs" />
      </div>
    </Tabs>
  </div>
</template>

<style scoped>
</style>