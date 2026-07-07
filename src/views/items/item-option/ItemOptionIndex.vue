<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router';
// Remove curly braces for default import
import { storeToRefs } from 'pinia';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';
import { useItemOptionStore } from '@/stores/itemOption';

const props = defineProps({ id: { type: String, required: false, default: null } })
const router = useRouter();
const itemOptionStore = useItemOptionStore();
const { itemOption, fb } = storeToRefs(itemOptionStore);
const toast = useToast();

const emit = defineEmits({})

//Define local variables here
const items = ref([
  { route: `/ecommerce/items/item-options/list`, label: 'Item Options List', icon: 'pi pi-home' },
  { route: `/ecommerce/items/item-options/add`, label: 'Add', icon: 'pi pi-link' },
  { route: `/ecommerce/items/item-options/import`, label: 'Import', icon: 'pi pi-link' },
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

// Fetch optionsItem if route is edit
const handleSave = async () => {
  try {
    let response: any;
    if (itemOption.value.item_option_id) {
      // update
      response = await itemOptionStore.updateItemOption(itemOption.value);
    } else {
      // Create new itemOption
      response = await itemOptionStore.createItemOption(itemOption.value);
    }

    if (response?.item_option_id) {
      router.push('/ecommerce/items/item-options/edit/' + response.item_option_id);
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Item option saved successfully',
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
      detail: 'An error occurred while saving the item option.',
      life: 5000
    });
  }
};

const refreshTabs = () => {
  const routeId = router.currentRoute.value.params.id;
  if (routeId) {
    const editRoute = `/ecommerce/items/item-options/edit/${routeId}`;
    const existRoute = items.value.find(item => item.route === editRoute);
    if (!existRoute) {
      items.value.push({ route: editRoute, label: 'Edit', icon: 'pi pi-list' });
    }
  } else {
    items.value = items.value.filter(item => !item.route.includes('/edit'));
    itemOptionStore.resetItemOption();
  }
}
refreshTabs();

//Lifecycle hook started from here
onMounted(() => {
  refreshTabs();
  itemOptionStore.fetchTypes();
})
</script>

<template>
  <div class="optionsItem card relative">
    <Button v-if="showSaveButton"
      :label="fb.loading['itemOption.create'] ? 'Saving...' : (fb.loading['itemOption.update.' + itemOption.item_option_id] ? 'Updating...' : saveLabel)"
      :icon="(fb.loading['itemOption.create'] || fb.loading['itemOption.update.' + itemOption.item_option_id]) ? 'pi pi-spinner pi-spin' : 'pi pi-save'"
      class="p-button-md"
      :disabled="fb.loading['itemOption.create'] || fb.loading['itemOption.update.' + itemOption.item_option_id]"
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
