<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router';
// Remove curly braces for default import
import { useCategoryStore } from '@/stores/category';
import { storeToRefs } from 'pinia';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';

//System variables such as props, useStore or stateToRef etc
const props = defineProps({ id: { type: String, required: false, default: null } })
const router = useRouter();
const CategoryStore = useCategoryStore();
const { category, fb } = storeToRefs(CategoryStore);
const toast = useToast();

//Declear emits
const emit = defineEmits({})

//Define local variables here
const items = ref([
  { route: `/ecommerce/categories/list`, label: 'Categories', icon: 'pi pi-home' },
  { route: `/ecommerce/categories/import`, label: 'Import', icon: 'pi pi-link' },
]);
const currentRoute = computed(() => {
  return router.currentRoute.value.path;
});

const showSaveButton = computed(() => {
    const path = currentRoute.value || '';
    return path.includes('/add') || path.includes('/edit');
});

const saveLabel = computed(() => {
    return currentRoute.value && currentRoute.value.includes('/edit') ? 'Save and Update' : 'Save';
})

// Fetch category if route is edit
const handleSave = async () => {
  try {
    let response: any;

    if (category.value.category_id) {
      // Update existing category
      response = await CategoryStore.updateCategory(category.value);
    } else {
      // Create new category
      response = await CategoryStore.createCategory(category.value);
    }

    if (response?.category_id) {
      router.push('/ecommerce/categories/edit/' + response.category_id);
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Category saved successfully',
        life: 3000
      });

      // Reset the form a new category
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save category: ' + (response?.message || ''), life: 5000 });
    }
  } catch (error) {
    console.error('Error saving category:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'An error occurred while saving the category.',
      life: 5000
    });
  }
};

const renderIcon = (icon: string) => {
  if(props.id){
    return fb.value.loading[`category.update.${category.value.category_id}`] ? 'pi pi-spinner pi-spin' : icon;
  }else{
    return fb.value.loading['category.create'] ? 'pi pi-spinner pi-spin' : icon;
  }
}

//Lifecycle hook started from here
onMounted(() => {

})
</script>

<template>
  <div class="categories card relative">
    <Button v-if="showSaveButton" :label="saveLabel" :icon="renderIcon('pi pi-save')"  class="p-button-md" @click="handleSave" 
    :disabled="fb.loading['category.update.'+category.category_id]" />
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
        <router-view  @saved="handleSave"  />
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