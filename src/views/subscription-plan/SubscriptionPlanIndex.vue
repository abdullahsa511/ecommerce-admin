<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router';
// Remove curly braces for default import
import { storeToRefs } from 'pinia';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';
import { useSubscriptionPlanStore } from '@/stores/subscriptionPlan';

const router = useRouter();
const subscriptionPlanStore = useSubscriptionPlanStore();
const { newSubscriptionPlan, fb } = storeToRefs(subscriptionPlanStore);
const toast = useToast();

const emit = defineEmits({})

//Define local variables here
const items = ref([
  { route: `/configuration/settings/subscriptions-plans/list`, label: 'Subscriptions Plans List', icon: 'pi pi-home' },
  { route: `/configuration/settings/subscriptions-plans/add`, label: 'Add', icon: 'pi pi-link' },
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

// Fetch taxonomy if route is edit
const handleSave = async () => {
  try {
    let response: any;
    if (newSubscriptionPlan.value.subscription_plan_id) {
      response = await subscriptionPlanStore.updateSubscriptionPlan(newSubscriptionPlan.value.subscription_plan_id, newSubscriptionPlan.value);
    } else {
      response = await subscriptionPlanStore.createSubscriptionPlan(newSubscriptionPlan.value);
    }

    if (response?.subscription_plan_id) {
      router.push('/configuration/settings/subscriptions-plans/edit/' + response.subscription_plan_id);
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Subscriptions Plans saved successfully',
        life: 3000
      });
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save subscriptions plan: ' + (response?.message || ''), life: 5000 });
    }
  } catch (error) {
    console.error('Error saving subscriptions plan:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'An error occurred while saving the subscriptions plan.',
      life: 5000
    });
  }
};

const refreshTabs = () => {
  const routeId = router.currentRoute.value.params.id;
  if (routeId) {
    const editRoute = `/configuration/settings/subscriptions-plans/edit/${routeId}`;
    const existRoute = items.value.find(item => item.route === editRoute);
    if (!existRoute) {
      items.value.push({ route: editRoute, label: 'Edit', icon: 'pi pi-list' });
    }
  } else {
    items.value = items.value.filter(item => !item.route.includes('/edit'));
    subscriptionPlanStore.resetSubscriptionPlan();
  }
}
refreshTabs();

//Lifecycle hook started from here
onMounted(() => {
  refreshTabs();
})
</script>

<template>
  <div class="taxonomy card relative">
    <Button v-if="showSaveButton" 
    :label="fb.loading['subscriptionPlan.create'] || fb.loading['subscriptionPlan.update.' + newSubscriptionPlan.subscription_plan_id] ? 'Saving...' : saveLabel" 
    :icon="fb.loading['subscriptionPlan.create'] || fb.loading['subscriptionPlan.update.' + newSubscriptionPlan.subscription_plan_id] ? 'pi pi-spinner pi-spin' : 'pi pi-save'" 
    class="p-button-md" 
    @click="handleSave" 
    :loading="fb.loading['subscriptionPlan.create'] || fb.loading['subscriptionPlan.update.' + newSubscriptionPlan.subscription_plan_id]" />
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