<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router';
// Remove curly braces for default import
import { storeToRefs } from 'pinia';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';
import { useTaxTypeStore } from '@/stores/taxType';
//System variables such as props, useStore or stateToRef etc
const props = defineProps({ id: { type: String, required: false, default: null } })
const router = useRouter();
const toast = useToast();

// tax type variables
const taxTypeStore = useTaxTypeStore();
const { newTaxType, fb } = storeToRefs(taxTypeStore);

//Declear emits
const emit = defineEmits({})

//Define local variables here
const items = ref([
  { route: `/configuration/settings/tax-types/list`, label: 'Tax Types', icon: 'pi pi-home' },
  { route: `/configuration/settings/tax-types/add`, label: 'Add', icon: 'pi pi-link' },
  { route: `/configuration/settings/tax-types/import`, label: 'Import', icon: 'pi pi-link' },
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

// Fetch attribute if route is edit
const handleSave = async () => {
  console.log('newTaxType', newTaxType.value);
  try {
    let response: any;
    if (newTaxType.value.tax_type_id > 1) {
      response = await taxTypeStore.updateTaxType(newTaxType.value.tax_type_id, newTaxType.value);
    } else {
      response = await taxTypeStore.createTaxType(newTaxType.value);
      router.push('/configuration/settings/tax-types/edit/' + response.tax_type_id);
    }
    if (response?.tax_type_id) {
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Tax type saved successfully',
        life: 3000
      });
    }
  } catch (error) {
    console.error('Error saving tax type:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'An error occurred while saving the tax type.',
      life: 5000
    });
  }
};

const refreshTabs = () => {
  if (props.id) {
    const existRoute = items.value.find(item => item.route === `/configuration/settings/tax-types/edit/${props.id}`);
    if (!existRoute) {
      items.value.push({ route: `/configuration/settings/tax-types/edit/${props.id}`, label: 'Edit', icon: 'pi pi-list' });
    }
  } else {
    items.value = items.value.filter(item => !item.route.includes('/edit'));
    taxTypeStore.resetTaxTypeAddForm();
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
    <Button v-if="showSaveButton"
      :label="(fb.loading['taxType.create'] || fb.loading['taxType.update.' + newTaxType.tax_type_id]) ? 'Processing...' : saveLabel"
      class="p-button-md" @click="handleSave"
      :disabled="fb.loading['taxType.create'] || fb.loading['taxType.update.' + newTaxType.tax_type_id]"
      :loading="fb.loading['taxType.create'] || fb.loading['taxType.update.' + newTaxType.tax_type_id]"
      :icon="fb.loading['taxType.create'] || fb.loading['taxType.update.' + newTaxType.tax_type_id] ? 'pi pi-spinner pi-spin' : 'pi pi-save'" />
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