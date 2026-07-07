<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router';
// Remove curly braces for default import
import { useCustomerStore } from '@/stores/customer';
import { storeToRefs } from 'pinia';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';

//System variables such as props, useStore or stateToRef etc
const props = defineProps({ id: { type: String, required: false, default: null } })
const router = useRouter();
const CustomerStore = useCustomerStore();
const { customer, fb } = storeToRefs(CustomerStore);
const toast = useToast();

//Declear emits
const emit = defineEmits({})

//Define local variables here
const items = ref([
  { route: `/configuration/settings/customers/list`, label: 'Customers', icon: 'pi pi-home' },
  { route: `/configuration/settings/customers/add`, label: 'Add', icon: 'pi pi-link' },
  { route: `/configuration/settings/customers/import`, label: 'Import', icon: 'pi pi-link' },
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


// Fetch customer if route is edit
const handleSave = async () => {
  try {
    let response: any;

    if (customer.value.customer_id) {
      // Update existing customer
      response = await CustomerStore.updateCustomer(customer.value);
    } else {
      // Create new customer
      response = await CustomerStore.createCustomer(customer.value);
    }

    if (response?.customer_id) {
      router.push('/configuration/settings/customers/edit/' + response.customer_id);
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Customer saved successfully',
        life: 3000
      });

      // Reset the form a new customer
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save customer: ' + (response?.message || ''), life: 5000 });
    }
  } catch (error) {
    console.error('Error saving customer:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'An error occurred while saving the customer.',
      life: 5000
    });
  }
};

const refreshTabs = () => {
  if (props.id) {
    const existRoute = items.value.find(item => item.route === `/configuration/settings/customers/edit/${props.id}`);
    if (!existRoute) {
      items.value.push({ route: `/configuration/settings/customers/edit/${props.id}`, label: 'Edit', icon: 'pi pi-list' });
    }
  } else {
    items.value = items.value.filter(item => !item.route.includes('/edit'));
  }
  CustomerStore.resetCustomer();
}
const renderIcon = (icon: string) => {
  if(props.id){
    return fb.value.loading[`customer.update.${customer.value.customer_id}`] ? 'pi pi-spinner pi-spin' : icon;
  }else{
    return fb.value.loading['customer.create'] ? 'pi pi-spinner pi-spin' : icon;
  }
}

//Lifecycle hook started from here
onMounted(() => {
  refreshTabs();
})
</script>

<template>
  <div class="customers card relative">
    <Button v-if="showSaveButton" :label="saveLabel" :icon="renderIcon('pi pi-save')"  class="p-button-md" @click="handleSave" 
    :disabled="fb.loading['customer.update.'+customer.customer_id]" />
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

</style>

