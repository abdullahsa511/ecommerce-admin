<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue/usetoast';
import { usePaymentStatusStore } from '@/stores/paymentStatus';

//System variables such as props, useStore or stateToRef etc
const props = defineProps({ id: { type: String, required: false, default: null } })
const router = useRouter();
const paymentStatusStore = usePaymentStatusStore();
const {paymentStatus, fb} = storeToRefs(paymentStatusStore);
const toast = useToast();

//Declear emits
const emit = defineEmits({})

//Define local variables here
const items = ref([
  { route: `/configuration/settings/payment-statuses/list`, label: 'Payment Statuses', icon: 'pi pi-home' },
  { route: `/configuration/settings/payment-statuses/add`, label: 'Add', icon: 'pi pi-link' },
  { route: `/configuration/settings/payment-statuses/import`, label: 'Import', icon: 'pi pi-link' },
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

// Fetch stock status if route is edit
const handleSave = async () => {
  try {
    let response: any;

    if (paymentStatus.value.payment_status_id) {
      // Update existing stock status
      response = await paymentStatusStore.updatePaymentStatus(paymentStatus.value);
    } else {
      // Create new stock status
      response = await paymentStatusStore.createPaymentStatus();
    }

    if (response?.payment_status_id) {
      router.push('/configuration/settings/payment-statuses/edit/' + response?.payment_status_id);
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Payment Status saved successfully',
        life: 3000
      });
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save payment status: ' + (response?.message || ''), life: 5000 });
    }
  } catch (error) {
    console.error('Error saving payment status:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'An error occurred while saving the payment status.',
      life: 5000
    });
  }
};

const refreshTabs = () => {
  if (props.id) {
    const existRoute = items.value.find(item => item.route === `/configuration/settings/payment-statuses/edit/${props.id}`);
    if (!existRoute) {
      items.value.push({ route: `/configuration/settings/payment-statuses/edit/${props.id}`, label: 'Edit', icon: 'pi pi-list' });
    }
  } else {
    items.value = items.value.filter(item => !item.route.includes('/edit'));
    paymentStatusStore.resetPaymentStatus();
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
    <Button v-if="showSaveButton" :label="saveLabel" 
    :icon="fb.loading['paymentStatus.create'] || fb.loading['paymentStatus.update.' + paymentStatus.payment_status_id] ? 'pi pi-spinner pi-spin' : 'pi pi-save'"
    :disabled="fb.loading['paymentStatus.create'] || fb.loading['paymentStatus.update.' + paymentStatus.payment_status_id]"
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

<style scoped>
</style>