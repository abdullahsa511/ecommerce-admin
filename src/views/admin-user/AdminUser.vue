<script setup lang="ts">

import { ref, onMounted, computed } from 'vue';
// @ts-ignore
import { useAdminStore } from '@/stores/admin';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

const adminStore = useAdminStore();
const { newAdmin, fb } = storeToRefs(adminStore);
const router = useRouter();
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';

//System variables such as props, useStore or stateToRef etc
const props = defineProps({ id: { type: String, required: false, default: null } })
const toast = useToast();

//Define local variables here
const items = ref([
  { route: `/configuration/settings/admin-users/list`, label: 'Admin Users', icon: 'pi pi-home' },
  { route: `/configuration/settings/admin-users/add`, label: 'Add', icon: 'pi pi-link' },
  { route: `/configuration/settings/admin-users/import`, label: 'Import', icon: 'pi pi-link' },
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
  console.log('handleSave', newAdmin.value);
  try {
    let response: any;
    // console.log('admin main index', newAdmin);
    if (newAdmin.value.admin_id) {
      if (Array.isArray(newAdmin.value.site_access)) {
        newAdmin.value.site_access = newAdmin.value.site_access.join(',');
      }

      response = await adminStore.updateAdmin(newAdmin.value.admin_id, newAdmin.value);
    } else {
      if (Array.isArray(newAdmin.value.site_access)) {
        newAdmin.value.site_access = newAdmin.value.site_access.join(',');
      }

      response = await adminStore.createAdmin(newAdmin.value);
    }
    console.log('response', response);

    if (response?.admin_id) {
      router.push('/configuration/settings/admin-users/edit/' + response.admin_id);
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Admin user saved successfully',
        life: 3000
      });
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save admin user: ' + (response?.message || ''), life: 5000 });
    }
  } catch (error) {
    console.error('Error saving admin user:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'An error occurred while saving the admin user.',
      life: 5000
    });
  }
};

const refreshTabs = () => {
  if (props.id) {
    const existRoute = items.value.find(item => item.route === `/configuration/settings/admin-users/edit/${props.id}`);
    if (!existRoute) {
      items.value.push({ route: `/configuration/settings/admin-users/edit/${props.id}`, label: 'Edit', icon: 'pi pi-list' });
    }
  } else {
    items.value = items.value.filter(item => !item.route.includes('/edit'));
    adminStore.resetNewAdmin();
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
    <Button 
    v-if="showSaveButton" 
    :label="fb.loading['admin.update.'+newAdmin.admin_id] ? 'Updating...' : (fb.loading['admin.create'] ? 'Saving...' : saveLabel)"
    :icon="fb.loading['admin.update.'+newAdmin.admin_id] || fb.loading['admin.create'] ? 'pi pi-spinner pi-spin' : 'pi pi-save'"
    :disabled="fb.loading['admin.update.'+newAdmin.admin_id] || fb.loading['admin.create']"
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
      <div class="p-6">
        <router-view @editTabUnmunted="refreshTabs" @saved="handleSave" @editTabMounted="refreshTabs" />
      </div>
    </Tabs>
  </div>
</template>