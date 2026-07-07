<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';
import { useVariantStore } from '@/stores/variant';

const props = defineProps({ id: { type: String, required: false, default: null } })
const router = useRouter();
const variantStore = useVariantStore();
const { variant } = storeToRefs(variantStore);
const toast = useToast();

//Declear emits
const emit = defineEmits({})

//Define local variables here
const items = ref([
  { route: `/configuration/settings/variants/list`, label: 'Variants', icon: 'pi pi-home' },
  { route: `/configuration/settings/variants/add`, label: 'Add', icon: 'pi pi-link' },
  { route: `/configuration/settings/variants/import`, label: 'Import', icon: 'pi pi-link' },
  { route: `/configuration/settings/variants/export`, label: 'Download CSV', icon: 'pi pi-file-excel' },
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

// Fetch variant if route is edit
const handleSave = async () => {
  try {
    let response: any;
    if (variant.value.variant_id) {
      // Update existing variant
      response = await variantStore.updateVariant(variant.value);
    } else {
      // Create new variant
      response = await variantStore.createVariant(variant.value);
    }

    if (response?.variant_id) {
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Variant saved successfully',
        life: 3000
      });
      router.push('/configuration/settings/variants/edit/' + response.variant_id);
      // Reset the form a new variant
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save variant: ' + (response?.message || ''), life: 5000 });
    }
  } catch (error) {
    console.error('Error saving variant:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'An error occurred while saving the variant.',
      life: 5000
    });
  }
};

//Define local methods her
const refreshTabs = () => {
  if (props.id) {
    const existRoute = items.value.find(item => item.route === `/configuration/settings/variants/edit/${props.id}`);
    if (!existRoute) {
      items.value.push({ route: `/configuration/settings/variants/edit/${props.id}`, label: 'Edit', icon: 'pi pi-list' });
    }
  } else {
    items.value = items.value.filter(item => !item.route.includes('/edit'));
  }
}

//Lifecycle hook started from here
onMounted(() => {
  refreshTabs();
})
</script>

<template>
  <div class="attriutes card relative">
    <Button v-if="showSaveButton" :label="saveLabel" icon="pi pi-save" class="p-button-md" @click="handleSave" />
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
      <div class="">
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