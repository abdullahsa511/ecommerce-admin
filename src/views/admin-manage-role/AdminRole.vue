<script setup lang="ts">
import { ref, defineEmits, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';
import { useRoleStore } from '@/stores/role';

//System variables such as props, useStore or stateToRef etc
const props = defineProps({ id: { type: String, required: false, default: null } })
const toast = useToast();
const roleStore = useRoleStore();
const { newRole, fb } = storeToRefs(roleStore);

const router = useRouter();
//Declear emits
const emit = defineEmits({});

//Define local variables here
const items = ref([
  { route: `/configuration/settings/manage-roles/list`, label: 'Admin Roles', icon: 'pi pi-home' },
  { route: `/configuration/settings/manage-roles/add`, label: 'Add', icon: 'pi pi-link' },
  { route: `/configuration/settings/manage-roles/import`, label: 'Import', icon: 'pi pi-link' },
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

// Fetch role if route is edit
const handleSave = async () => {
  try {
    let response: any;
    if (newRole.value.role_id) {
     response = await roleStore.updateRole(newRole.value.role_id, newRole.value);
    } else {
      console.log('admin main index create role', newRole.value);
      response = await roleStore.createRole(newRole.value);
    }
    console.log('admin main index response', response);
    console.log('admin main index response.role_id', response.role_id);
    if (response?.role_id) {
      router.push('/configuration/settings/manage-roles/edit/' + response.role_id);
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Role saved successfully',
        life: 3000
      });

    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save role: ' + (response?.message || ''), life: 5000 });
    }
  } catch (error) {
    console.error('Error saving role:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'An error occurred while saving the role.',
      life: 5000
    });
  }
};

const refreshTabs = () => {
  if (props.id) {
    const existRoute = items.value.find(item => item.route === `/configuration/settings/manage-roles/edit/${props.id}`);
    if (!existRoute) {
      items.value.push({ route: `/configuration/settings/manage-roles/edit/${props.id}`, label: 'Edit', icon: 'pi pi-list' });
    }
  } else {
    items.value = items.value.filter(item => !item.route.includes('/edit'));
    roleStore.resetNewRole();
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
           :label="fb.loading['role.update.' + newRole.role_id] || fb.loading['role.create'] ? 'Processing...' : saveLabel" 
           :icon="fb.loading['role.update.' + newRole.role_id] || fb.loading['role.create'] ? 'pi pi-spinner pi-spin' : 'pi pi-save'"
           :disabled="fb.loading['role.update.' + newRole.role_id] || fb.loading['role.create']"
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