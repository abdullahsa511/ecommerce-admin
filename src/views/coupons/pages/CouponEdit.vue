<script setup lang="ts">
import { ref, computed, onMounted, defineEmits, onUnmounted } from "vue";
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useCouponStore } from "@/stores/coupon";
import { Coupon } from "@/models/Coupon";

const emit = defineEmits(['update:coupon', 'saved', 'editTabUnmunted', 'editTabMounted']);
const router = useRouter();
const couponStore = useCouponStore();
const { coupon } = storeToRefs(couponStore);



const currentRoute = computed(() => {
    return router.currentRoute.value.path;
});
const routeId = router.currentRoute.value.params.id;
const childItems = ref([
    { route: `/coupons/edit/${routeId}/overview`, label: 'Coupon', icon: 'pi pi-ticket' },
    { route: `/coupons/edit/${routeId}/products`, label: 'Product Association', icon: 'pi pi-shopping-bag' }
]);



onMounted(async () => {
    emit('editTabMounted');
    try {
       
       await couponStore.fetchCouponById(routeId as string);//string data type
        
    } catch (error) {
        console.error('Error in onMounted:', error);
    }
})

onUnmounted(() => {
    emit('editTabUnmunted');
})

const onCounponUpdated = (data: Coupon) => {
    // Instead of reassigning the entire showroom, update its properties
    if (coupon.value && data) {
        Object.assign(coupon.value, data);
    }
}

</script>
<template>
    <div class=" relative">
        <div class="card-header">
            <h1>{{ coupon.name }}</h1>
        </div>
        <!-- <Button :icon="fb.loading['coupon.update'] ? 'pi pi-spin pi-spinner' : 'pi pi-save'"
            :label="currentRoute.includes('/coupons/') && currentRoute.includes('/overview') ? 'Update' : 'Save'"
            severity="primary" :loading="fb.loading['coupon.update']" :disabled="fb.loading['coupon.update']"
            @click="onCouponSaved" class="p-button-md" /> -->
        <Tabs :value="currentRoute" scrollable>
            <TabList>
                <template v-for="tab in childItems" :key="tab.label" :id="routeId">
                    <router-link v-if="tab.route" v-slot="{ href, navigate }" :to="tab.route" custom>
                        <Tab :active="currentRoute === tab.route" :key="tab.label" :value="tab.route" @click="navigate">
                            <a v-ripple :href="href" class="flex items-center gap-2 text-inherit">
                                <i :class="tab.icon" />
                                <span>{{ tab.label }}</span>
                            </a>
                        </Tab>
                    </router-link>
                </template>
            </TabList>
            <div class="py-6">
                <router-view :id="routeId" @update:coupon="onCounponUpdated"/>
            </div>
        </Tabs>
    </div>
</template>

<style scoped>
/* .card-header {
    font-size: 18px;
    font-weight: 500;
    padding-bottom: 20px;
} */

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
