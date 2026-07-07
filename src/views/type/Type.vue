<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';
import { useTypeStore } from '@/stores/type';

const props = defineProps({ id: { type: String, required: false, default: null } })
const router = useRouter();
const typeStore = useTypeStore()
const { type, fb } = storeToRefs(typeStore);
const toast = useToast();
const types = ref();

//Declear emits
const emit = defineEmits({})

//Define local variables here
const items = ref([
  { route: `/configuration/settings/types/list`, label: 'Types', icon: 'pi pi-home' },
  { route: `/configuration/settings/types/add`, label: 'Add', icon: 'pi pi-link' },
  { route: `/configuration/settings/types/import`, label: 'Import', icon: 'pi pi-link' },
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

// group content retrive api call
const fetchTypeTypes = async () => {
  try {
    const data = await typeStore.getTypes();
    types.value = data;
  } catch (error) {
    // console.error('Error fetching types:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'An error occurred while fetching the types.',
      life: 5000
    });
  }
};


// Fetch types if route is edit
const handleSave = async () => {
  try {
    console.log('store value', type.value);
    let response: any;
    if (type.value.type_id) {
      // Update existing types
      response = await typeStore.updateType(type.value);
    } else {
      // Create new types
      response = await typeStore.createType(type.value);
    }

    if (response?.type_id) {
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Type saved successfully',
        life: 3000
      });
      router.push('/configuration/settings/types/edit/' + response.type_id);
      // Reset the form a new types
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save types: ' + (response?.message || ''), life: 5000 });
    }
  } catch (error) {
    console.error('Error saving types:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'An error occurred while saving the types.',
      life: 5000
    });
  }
};

//Define local methods her
const refreshTabs = () => {
  if (props.id) {
    const existRoute = items.value.find(item => item.route === `/configuration/settings/types/edit/${props.id}`);
    if (!existRoute) {
      items.value.push({ route: `/configuration/settings/types/edit/${props.id}`, label: 'Edit', icon: 'pi pi-list' });
    }
  } else {
    items.value = items.value.filter(item => !item.route.includes('/edit'));
    typeStore.resetTypeAddForm();
  }
}

const renderIcon = (icon: string) => {  
    if (props.id) {
    return fb.value.loading[`type.update.${type.value.type_id}`] ? 'pi pi-spinner pi-spin' : icon;
    }else{
        return fb.value.loading['type.create'] ? 'pi pi-spinner pi-spin' : icon;
    }
}

//Lifecycle hook started from here
onMounted(() => {
  refreshTabs();
})
</script>

<template>
  <div class="type card relative">
    <Button v-if="showSaveButton" :label="saveLabel" :icon="renderIcon('pi pi-save')" class="p-button-md" @click="handleSave" 
    :disabled="fb.loading['type.update.'+type.type_id]"/>
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
