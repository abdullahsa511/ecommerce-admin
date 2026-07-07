<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';
import { useProductOptionGroupStore } from '@/stores/productOptionGroup';

const props = defineProps({ id: { type: String, required: false, default: null } })
const router = useRouter();
const productOptionGroupStore = useProductOptionGroupStore();
const { productOptionGroup, fb, optionGroup } = storeToRefs(productOptionGroupStore);
const toast = useToast();

//Declear emits
const emit = defineEmits({})

//Define local variables here
const items = ref([
  { route: `/ecommerce/products-option-groups/list`, label: 'Option Groups', icon: 'pi pi-home' },
  { route: `/ecommerce/products-option-groups/add`, label: 'Add', icon: 'pi pi-link' },
  { route: `/ecommerce/products-option-groups/import`, label: 'Import', icon: 'pi pi-link' },
  { route: `/ecommerce/products-option-groups/export`, label: 'Download CSV', icon: 'pi pi-file-excel' },
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

// Fetch productOptionGroup if route is edit
const handleSave = async () => {
  try {
    let response: any;
    if (productOptionGroup.value.product_option_group_id) {
      // Update existing productOptionGroup
      response = await productOptionGroupStore.updateProductOptionGroup(productOptionGroup.value);
    } else {

      console.log('this is create new productOptionGroup', productOptionGroup.value);
      
      // Create new productOptionGroup
      response = await productOptionGroupStore.createProductOptionGroup(productOptionGroup.value);
    }

    if (response?.product_option_group_id) {
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'ProductOptionGroup saved successfully',
        life: 3000
      });
      router.push('/ecommerce/products-option-groups/edit/' + response.product_option_group_id);
      // Reset the form a new productOptionGroup
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save option group: ' + (response?.message || ''), life: 5000 });
    }
  } catch (error) {
    console.error('Error saving option group:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'An error occurred while saving the option group.',
      life: 5000
    });
  }
};

//Define local methods her
const refreshTabs = () => {
  if (props.id) {
    const existRoute = items.value.find(item => item.route === `/ecommerce/products-option-groups/edit/${props.id}`);
    if (!existRoute) {
      items.value.push({ route: `/ecommerce/products-option-groups/edit/${props.id}`, label: 'Edit', icon: 'pi pi-list' });
    }
  } else {
    items.value = items.value.filter(item => !item.route.includes('/edit'));
  }
}

//Lifecycle hook started from here
onMounted(() => {
  refreshTabs();
  productOptionGroupStore.fetchProducts();
  productOptionGroupStore.fetchProductVariants();
})
</script>

<template>
  <div class="card relative">
    <Button v-if="showSaveButton"
      :label="fb.loading['productOptionGroup.create'] ? 'Saving...' : (fb.loading['productOptionGroup.update.' + productOptionGroup.product_option_group_id] ? 'Updating...' : saveLabel)"
      :icon="(fb.loading['productOptionGroup.create'] || fb.loading['productOptionGroup.update.' + productOptionGroup.product_option_group_id]) ? 'pi pi-spinner pi-spin' : 'pi pi-save'"
      :disabled="fb.loading['productOptionGroup.create'] || fb.loading['productOptionGroup.update.' + productOptionGroup.product_option_group_id]"
      class="p-button-md" @click="handleSave" />
    <!-- <Button v-if="showSaveButton" :label="saveLabel" icon="pi pi-save" class="p-button-md" @click="handleSave" /> -->
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