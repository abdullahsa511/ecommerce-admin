<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router';
// Remove curly braces for default import
import { storeToRefs } from 'pinia';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';
import { useOrderStore } from '@/stores/order';

const props = defineProps({ id: { type: String, required: false, default: null } })
const router = useRouter();
const orderStore = useOrderStore();
const { order } = storeToRefs(orderStore);
const toast = useToast();

const emit = defineEmits({})

//Define local variables here
const items = ref([
  { route: `/ecommerce/sales/orders/list`, label: 'Order List', icon: 'pi pi-home' },
  { route: `/ecommerce/sales/orders/add`, label: 'Add', icon: 'pi pi-link' },
  { route: `/ecommerce/sales/orders/import`, label: 'Import', icon: 'pi pi-link' },
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

// Fetch order if route is edit
const handleSave = async () => {
  try {
    let response: any;
    if (order.value.order_id) {
      response = await orderStore.updateOrder(order.value);
    } else {
      // Create new order
      response = await orderStore.createOrder(order.value);
    }

    if (response?.order_id) {
      router.push('/ecommerce/sales/orders/'+ response.order_id + '/edit/overview');
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Order saved successfully',
        life: 3000
      });
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save Order: ' + (response?.message || ''), life: 5000 });
    }
  } catch (error) {
    console.error('Error saving order:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'An error occurred while saving the order.',
      life: 5000
    });
  }
};

const refreshTabs = () => {
  const routeId = router.currentRoute.value.params.id;
  if (routeId) {
    const editRoute = `/ecommerce/sales/orders/${routeId}/edit/overview`;
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
})
</script>

<template>
  <div class="card relative">
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
      <div class="py-6">
        <router-view @editTabUnmunted="refreshTabs" @saved="handleSave" @editTabMounted="refreshTabs" />
      </div>
    </Tabs>
  </div>
</template>

<style scoped>

</style>