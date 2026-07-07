<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useCouponStore } from '@/stores/coupon';
import { storeToRefs } from 'pinia';
import { Coupon } from "@/models/Coupon.ts";

const router = useRouter();
const toast = useToast();
const couponStore = useCouponStore();
const {fb} = storeToRefs(couponStore);

const items = ref([
    { route: '/coupons/add/overview', label: 'Coupon', icon: 'pi pi-ticket' },
    { route: '/coupons/add/products', label: 'Product Association', icon: 'pi pi-shopping-bag' },
]);

const currentRoute = computed(() => router.currentRoute.value.path);

const coupon = ref(new Coupon({
    couponDetails: {
        name: "Summer Sale 2024",
        code: "SUMMER20",
        discount: 20,
        type: "P",
        free_shipping: 1,
        status: 1,
        registered_user_only: 1,
        cart_total_min: 100,
        date_start: "2024-06-01",
        date_end: "2024-08-31",
        coupon_limit: 1000,
        user_limit: 1
    }
}));

const onCouponSaved = async () => {
    try {
        const response = await couponStore.createCoupon(coupon.value);
        coupon.value = response;
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Coupon created successfully',
            life: 3000
        });
        // Redirect to coupon detail page using the correct ID from response
        if (response && response.coupon_id) {
            router.push(`/coupons/${response.coupon_id}/overview`);
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to get coupon ID from response',
                life: 3000
            });
        }
    } catch (error: any) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message || 'Failed to save coupon',
            life: 3000
        });
    }
};

</script>
<template>
    <div class="card relative">
        <Button 
                icon="pi pi-save"
                label="Save"
                severity="primary"
                :loading="false"
                @click="onCouponSaved"
                class="p-button-md"
            />
        <Tabs :value="currentRoute" scrollable>
            <TabList >
                <template v-for="tab in items" :key="tab.label">
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
            <div class="p-6">
                <router-view :coupon="coupon" v-model.coupon="coupon" @saved="onCouponSaved"/>
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