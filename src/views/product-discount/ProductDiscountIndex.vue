<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router';
// Remove curly braces for default import
import { storeToRefs } from 'pinia';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';
import { useProductDiscountStore } from '@/stores/productDiscount';

const props = defineProps({ id: { type: String, required: false, default: null } })
const router = useRouter();
const productDiscountStore = useProductDiscountStore();
const { productDiscount, fb, userGroups, products} = storeToRefs(productDiscountStore);
const toast = useToast();

const emit = defineEmits({})

//Define local variables here
const items = ref([
  { route: `/product-discounts/list`, label: 'Product Discount List', icon: 'pi pi-home' },
  { route: `/product-discounts/add`, label: 'Add', icon: 'pi pi-link' },
  { route: `/product-discounts/import`, label: 'Import', icon: 'pi pi-link' },
  // { route: `/product-discount/export`, label: 'Download CSV', icon: 'pi pi-file-excel' },
]);
const currentRoute = computed(() => {
  return router.currentRoute.value.path;
});

// Change Save button label based on route
const saveLabel = computed(() => {
  return currentRoute.value && currentRoute.value.includes('/edit') ? 'Save and Update' : 'Save';
})

// Fetch productDiscount if route is edit
const handleSave = async () => {
  try {
    let response: any;
    if (productDiscount.value.product_discount_id) {
      response = await productDiscountStore.updateProductDiscount(productDiscount.value);
    } else {
      // Create new productDiscount
      response = await productDiscountStore.createProductDiscount(productDiscount.value);
    }

    if (response?.product_discount_id) {
      router.push('/product-discounts/edit/' + response.product_discount_id);
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Prosuct discount saved successfully',
        life: 3000
      });
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save product discount: ' + (response?.message || ''), life: 5000 });
    }
  } catch (error) {
    console.error('Error saving productDiscount:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'An error occurred while saving the productDiscount.',
      life: 5000
    });
  }
};

const refreshTabs = () => {
  const routeId = router.currentRoute.value.params.id;
  if (routeId) {
    const editRoute = `/product-discounts/edit/${routeId}`;
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
  productDiscountStore.fetchUserGroups();
  productDiscountStore.fetchProducts();
  console.log('userGroups', userGroups.value);
  console.log('products', products.value);
})
</script>

<template>
  <div class="card relative">
    <Button
      :label="fb.loading['productDiscount.create'] ? 'Saving...' : (fb.loading['productDiscount.update.' + productDiscount.product_discount_id] ? 'Updating...' : saveLabel)"
      :icon="(fb.loading['productDiscount.create'] || fb.loading['productDiscount.update.' + productDiscount.product_discount_id]) ? 'pi pi-spinner pi-spin' : 'pi pi-save'"
      :disabled="fb.loading['productDiscount.create'] || fb.loading['productDiscount.update.' + productDiscount.product_discount_id]"
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