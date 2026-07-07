<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router';
// Remove curly braces for default import
import { storeToRefs } from 'pinia';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';
import { useProductTagStore } from '@/stores/productTag';

const props = defineProps({ id: { type: String, required: false, default: null } })
const router = useRouter();
const productTagStore = useProductTagStore();
const { newTag,fb } = storeToRefs(productTagStore);
const toast = useToast();

const emit = defineEmits({})

//Define local variables here
const items = ref([
  { route: `/ecommerce/products-tags/list`, label: 'Product Tags List', icon: 'pi pi-home' },
  { route: `/ecommerce/products-tags/add`, label: 'Add', icon: 'pi pi-link' },
  { route: `/ecommerce/products-tags/import`, label: 'Import', icon: 'pi pi-link' },
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

// Fetch vendor if route is edit
const handleSave = async () => {
  try {
    let response: any;
    if (newTag.value.tag_id) {
      // update vendor
      response = await productTagStore.updateProductTag(newTag.value.tag_id, newTag.value);
    } else {
      // Create new product tag
      response = await productTagStore.createProductTag(newTag.value);
    }
console.log('response handleSave product tag', response);
    if (response?.tag_id) {
      router.push('/ecommerce/products-tags/edit/'+ response.tag_id);
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Product tag saved successfully',
        life: 3000
      });
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save product tag: ' + (response?.message || ''), life: 5000 });
    }
  } catch (error) {
    console.error('Error saving product tag:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'An error occurred while saving the product tag.',
      life: 5000
    });
  }
};

const refreshTabs = () => {
  const routeId = router.currentRoute.value.params.id;
  if (routeId) {
    const editRoute = `/ecommerce/products-tags/edit/${routeId}`;
    const existRoute = items.value.find(item => item.route === editRoute);
    if (!existRoute) {
      items.value.push({ route: editRoute, label: 'Edit', icon: 'pi pi-list' });
    }
  } else {
    items.value = items.value.filter(item => !item.route.includes('/edit'));
    productTagStore.resetProductTag();
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
    :label="(fb.loading['productTag.update.' + id] || fb.loading['productTag.create']) ? 'Processing...' : saveLabel" 
    :icon="(fb.loading['productTag.update.' + id] || fb.loading['productTag.create']) ? 'pi pi-spinner pi-spin' : 'pi pi-save'"
    class="p-button-md" 
    @click="handleSave" 
    :loading="fb.loading['productTag.update.' + id] || fb.loading['productTag.create']"
    :disabled="fb.loading['productTag.update.' + id] || fb.loading['productTag.create']"
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