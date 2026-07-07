<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter} from 'vue-router';
// Remove curly braces for default import
import { storeToRefs } from 'pinia';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';
import { useTaxRateStore } from '@/stores/taxRate';
//System variables such as props, useStore or stateToRef etc
const props = defineProps({ id: { type: String, required: false, default: null } })
const router = useRouter();
const toast = useToast();

// tax type variables
const taxRateStore = useTaxRateStore();
const { newTaxRate, fb } = storeToRefs(taxRateStore);

//Declear emits
const emit = defineEmits({})

//Define local variables here
const items = ref([
  { route: `/configuration/settings/tax-rates/list`, label: 'Tax Rates', icon: 'pi pi-home' },
  { route: `/configuration/settings/tax-rates/add`, label: 'Add', icon: 'pi pi-link' },
  { route: `/configuration/settings/tax-rates/import`, label: 'Import', icon: 'pi pi-link' },
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
  console.log('newTaxRate', newTaxRate.value);
  try {
    let response: any;
    if (newTaxRate.value.tax_rate_id > 1) {
      response = await taxRateStore.updateTaxRate(newTaxRate.value.tax_rate_id, newTaxRate.value);
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Tax rate updated successfully',
        life: 3000
      });
    } else {
      response = await taxRateStore.createTaxRate(newTaxRate.value);
      router.push('/configuration/settings/tax-rates/edit/' + response.tax_rate_id);
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Tax rate created successfully',
        life: 3000
      });
    }
  } catch (error) {
    console.error('Error saving tax rate:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'An error occurred while saving the tax rate.',
      life: 5000
    });
  }
};

const refreshTabs = () => {
  if (props.id) {
    const existRoute = items.value.find(item => item.route === `/configuration/settings/tax-rates/edit/${props.id}`);
    if (!existRoute) {
      items.value.push({ route: `/configuration/settings/tax-rates/edit/${props.id}`, label: 'Edit', icon: 'pi pi-list' });
    }
  } else {
    items.value = items.value.filter(item => !item.route.includes('/edit'));
    taxRateStore.resetTaxRate();
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
    :label="(fb.loading['taxRate.create'] || fb.loading['taxRate.update.' + newTaxRate.tax_rate_id]) ? 'Processing...' : saveLabel" 
    :icon="(fb.loading['taxRate.create'] || fb.loading['taxRate.update.' + newTaxRate.tax_rate_id]) ? 'pi pi-spinner pi-spin' : 'pi pi-save'"
    class="p-button-md" 
    @click="handleSave" 
    :disabled="fb.loading['taxRate.create'] || fb.loading['taxRate.update.' + newTaxRate.tax_rate_id]"
    :loading="fb.loading['taxRate.create'] || fb.loading['taxRate.update.' + newTaxRate.tax_rate_id]"
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
