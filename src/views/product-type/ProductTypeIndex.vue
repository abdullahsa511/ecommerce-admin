<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router';
// Remove curly braces for default import
import { storeToRefs } from 'pinia';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';
import { useProductTypeStore } from '@/stores/productType';

const router = useRouter();
const productTypeStore = useProductTypeStore();
const { newProductType, fb } = storeToRefs(productTypeStore);
const toast = useToast();

const emit = defineEmits({})

//Define local variables here
const items = ref([
  { route: `/configuration/settings/product-types/list`, label: 'Product Types List', icon: 'pi pi-home' },
  { route: `/configuration/settings/product-types/add`, label: 'Add', icon: 'pi pi-link' },
  { route: `/configuration/settings/product-types/import`, label: 'Import', icon: 'pi pi-link' },
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

// Fetch taxonomy if route is edit
const handleSave = async () => {
  try {
    let response: any;
    if (newProductType.value.product_type_id) {
      response = await productTypeStore.updateProductType(newProductType.value.product_type_id, newProductType.value);
    } else {
      response = await productTypeStore.createProductType(newProductType.value);
    }

    if (response?.product_type_id) {
      router.push('/configuration/settings/product-types/edit/' + response.product_type_id);
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Product Types saved successfully',
        life: 3000
      });
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save product type: ' + (response?.message || ''), life: 5000 });
    }
  } catch (error) {
    console.error('Error saving product type:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'An error occurred while saving the product type.',
      life: 5000
    });
  }
};

const refreshTabs = () => {
  const routeId = router.currentRoute.value.params.id;
  if (routeId) {
    const editRoute = `/configuration/settings/product-types/edit/${routeId}`;
    const existRoute = items.value.find(item => item.route === editRoute);
    if (!existRoute) {
      items.value.push({ route: editRoute, label: 'Edit', icon: 'pi pi-list' });
    }
  } else {
    items.value = items.value.filter(item => !item.route.includes('/edit'));
    productTypeStore.resetProductType();
  }
}
refreshTabs();

//Lifecycle hook started from here
onMounted(() => {
  refreshTabs();
})
</script>

<template>
  <div class="taxonomy card relative">
    <Button v-if="showSaveButton" 
    :label="fb.loading['productType.create'] || fb.loading['productType.update.' + newProductType.product_type_id] ? 'Saving...' : saveLabel" 
    :icon="fb.loading['productType.create'] || fb.loading['productType.update.' + newProductType.product_type_id] ? 'pi pi-spinner pi-spin' : 'pi pi-save'" 
    class="p-button-md" 
    @click="handleSave" 
    :loading="fb.loading['productType.create'] || fb.loading['productType.update.' + newProductType.product_type_id]" />
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