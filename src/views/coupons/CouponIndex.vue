<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router';
// Remove curly braces for default import
import { storeToRefs } from 'pinia';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';
import { useCouponStore } from '@/stores/coupon';

const props = defineProps({ id: { type: String, required: false, default: null } })
const router = useRouter();
const couponStore = useCouponStore();
const { coupon, fb } = storeToRefs(couponStore);
const toast = useToast();

const emit = defineEmits({})

//Define local variables here
const items = ref([
  { route: `/coupons/list`, label: 'Coupon List', icon: 'pi pi-home' },
  { route: `/coupons/add`, label: 'Add', icon: 'pi pi-link' },
  { route: `/coupons/import`, label: 'Import', icon: 'pi pi-link' },
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

// Fetch coupon if route is edit
const handleSave = async () => {
  try {
    let response: any;
    if (coupon.value.coupon_id) {
      // Update existing coupon
      response = await couponStore.updateCoupon(coupon.value);
    } else {
      // Create new coupon
      response = await couponStore.createCoupon(coupon.value);
    }

    if (response?.coupon_id) {
      router.push('/coupons/edit/'+ response.coupon_id);
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Coupon type saved successfully',
        life: 3000
      });
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save length type: ' + (response?.message || ''), life: 5000 });
    }
  } catch (error) {
    console.error('Error saving coupon:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'An error occurred while saving the coupon.',
      life: 5000
    });
  }
};

const refreshTabs = () => {
  const routeId = router.currentRoute.value.params.id;
  if (routeId) {
    const editRoute = `/coupons/edit/${routeId}/overview`;
    const existRoute = items.value.find(item => item.route === editRoute);
    if (!existRoute) {
      items.value.push({ route: editRoute, label: 'Edit', icon: 'pi pi-list' });
    }
  } else {
    items.value = items.value.filter(item => !item.route.includes('/edit'));
  }
  couponStore.resetCoupon();
}
// refreshTabs();

//Lifecycle hook started from here
onMounted(() => {
  refreshTabs();
})
</script>

<template>
 <div class="document card relative p-0">
    <!-- <Button v-if="showSaveButton"
     :label="saveLabel" 
     icon="pi pi-save" 
     class="p-button-md"
     @click="handleSave" /> -->
     <Button
        :label="fb.loading['coupon.create'] ? 'Saving...' : (fb.loading['coupon.update.' + coupon.coupon_id] ? 'Updating...' : saveLabel)"
        :icon="(fb.loading['coupon.create'] || fb.loading['coupon.update.' + coupon.coupon_id]) ? 'pi pi-spinner pi-spin' : 'pi pi-save'"
        :disabled="fb.loading['coupon.create'] || fb.loading['coupon.update.' + coupon.coupon_id]"
        class="p-button-md"
        @click="handleSave"
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