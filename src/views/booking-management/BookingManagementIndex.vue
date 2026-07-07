<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useBookingManagementStore } from '@/stores/bookingManagement';

const props = defineProps({ id: { type: String, required: false, default: null } })
const router = useRouter();
const bookingManagementStore = useBookingManagementStore();
const { bookingManagement } = storeToRefs(bookingManagementStore);

const emit = defineEmits({})

//Define local variables here
const items = ref([
  { route: `/booking-management/list`, label: 'Booking Requests List', icon: 'pi pi-home' },
]);
const currentRoute = computed(() => {
  return router.currentRoute.value.path;
});




// Fetch subscription if route is edit
const handleSave = async () => {
  // try {
  //   let response: any;
  //   if (subscription.value.subscription_id) {
  //     response = await subscriptionStore.updateSubscription(subscription.value.subscription_id, subscription.value);
  //   } else {
  //     subscription.value.subscription_id = 1; // optional
  //     response = await subscriptionStore.createSubscription(subscription.value);
  //   }

  //   if (response?.subscription_id) {
  //     router.push('/ecommerce/sales/subscriptions/edit/'+ response.subscription_id);
  //     toast.add({
  //       severity: 'success',
  //       summary: 'Success',
  //       detail: 'Post tag saved successfully',
  //       life: 3000
  //     });
  //   } else {
  //     toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save subscription: ' + (response?.message || ''), life: 5000 });
  //   }
  // } catch (error) {
  //   console.error('Error saving subscription:', error);
  //   toast.add({
  //     severity: 'error',
  //     summary: 'Error',
  //     detail: 'An error occurred while saving the subscription.',
  //     life: 5000
  //   });
  // }
};

const refreshTabs = () => {
  const routeId = router.currentRoute.value.params.id;
  if (routeId) {
    const editRoute = `/booking-management/edit/${routeId}`;
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
  <div class="booking-management card relative">
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