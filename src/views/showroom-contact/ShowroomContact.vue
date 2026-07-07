<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';
import { useShowroomContactStore } from '@/stores/showroomContact';

const props = defineProps({ id: { type: String, required: false, default: null } })
const router = useRouter();
const showroomContactStore = useShowroomContactStore();
const { showroomContact,fb } = storeToRefs(showroomContactStore);
const toast = useToast();

const emit = defineEmits({})

//Define local variables here
const items = ref([
  { route: `/showroom-contact/list`, label: 'Showroom Contact List', icon: 'pi pi-home' },
  { route: `/showroom-contact/add`, label: 'Add', icon: 'pi pi-link' },
  { route: `/showroom-contact/import`, label: 'Import', icon: 'pi pi-link' },
  // { route: `/showroom-contact/export`, label: 'Download CSV', icon: 'pi pi-file-excel' },
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

// Fetch showroom contact if route is edit
const handleSave = async () => {
  try {
    // console.log('showroomContact: ', showroomContact.value);
    let response: any;
    if (showroomContact.value.showroom_contact_id) {
      // update showroom contact
      response = await showroomContactStore.updateShowroomContact(showroomContact.value);
    } else {
      // Create new showroom contact
      response = await showroomContactStore.createShowroomContact(showroomContact.value);
    }

    if (response?.showroom_contact_id) {
      router.push('/showroom-contact/edit/'+ response.showroom_contact_id);
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Showroom contact saved successfully',
        life: 3000
      });
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save showroom contact: ' + (response?.message || ''), life: 5000 });
    }
  } catch (error) {
    console.error('Error saving showroom contact:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'An error occurred while saving the showroom contact.',
      life: 5000
    });
  }
};

const refreshTabs = () => {
  const routeId = router.currentRoute.value.params.id;
  if (routeId) {
    const editRoute = `/showroom-contact/edit/${routeId}`;
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
    :label="fb.loading['showroomContact.update.' + showroomContact.showroom_contact_id] ? 'Updating...' : saveLabel" 
    :icon="(fb.loading['showroomContact.update.' + showroomContact.showroom_contact_id]) ? 'pi pi-spinner pi-spin' : 'pi pi-save'"
    class="p-button-md" 
    @click="handleSave" 
    :loading="fb.loading['showroomContact.update.' + showroomContact.showroom_contact_id]"
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