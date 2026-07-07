<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router';
// Remove curly braces for default import
import { storeToRefs } from 'pinia';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';
import { useItemStore } from '@/stores/item';

const props = defineProps({ id: { type: String, required: false, default: null } })
const router = useRouter();
const itemStore = useItemStore();
const { item, fb } = storeToRefs(itemStore);
const toast = useToast();

const emit = defineEmits({})

//Define local variables here
const items = ref([
  { route: `/ecommerce/items/list`, label: 'Items List', icon: 'pi pi-home' },
  { route: `/ecommerce/items/add`, label: 'Add', icon: 'pi pi-link' },
  { route: `/ecommerce/items/import`, label: 'Import', icon: 'pi pi-link' },
]);
const currentRoute = computed(() => {
  return router.currentRoute.value.path;
});

const showSaveButton = computed(() => {
  const path = currentRoute.value || '';
  return path.includes('/add');
});
// Change Save button label based on route
const saveLabel = computed(() => {
  return currentRoute.value && currentRoute.value.includes('/edit') ? 'Save and Update' : 'Save';
})

// Fetch optionsItem if route is edit
const handleSave = async () => {
  try {
    let response: any;
    // if (item.value.item_id) {
    //   // update
    //   response = await itemStore.updateItem(item.value);
    // } else {
      // Create new item
      response = await itemStore.createItem(item.value);
    // }
    
    if (response?.item_id) {
      router.push('/ecommerce/items/edit/'+ response.item_id);
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Options item saved successfully',
        life: 3000
      });
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save options item: ' + (response?.message || ''), life: 5000 });
    }
  } catch (error) {
    console.error('Error saving optionsItem:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'An error occurred while saving the optionsItem.',
      life: 5000
    });
  }
};

const refreshTabs = () => {
  const routeId = router.currentRoute.value.params.id;
  if (routeId) {
    const editRoute = `/ecommerce/items/edit/${routeId}`;
    const existRoute = items.value.find(item => item.route === editRoute);
    if (!existRoute) {
      items.value.push({ route: editRoute, label: 'Edit', icon: 'pi pi-list' });
    }
  } else {
    items.value = items.value.filter(item => !item.route.includes('/edit'));
    itemStore.resetItem();
  }
}
refreshTabs();

//Lifecycle hook started from here
onMounted(() => {
  refreshTabs();
})
</script>

<template>
  <div class="item card relative">
    <Button v-if="showSaveButton" :label="fb.loading['item.create'] ? 'Saving...' : (fb.loading['item.update.'+item.item_id] ? 'Updating...' : saveLabel)"
     :icon="(fb.loading['item.create'] || fb.loading['item.update.'+item.item_id]) ? 'pi pi-spinner pi-spin' : 'pi pi-save'"
     class="p-button-md"
     :disabled="fb.loading['item.create'] || fb.loading['item.update.'+item.item_id]"
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
/* .p-button-md {
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
} */
</style>