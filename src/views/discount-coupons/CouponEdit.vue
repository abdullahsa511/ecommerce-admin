<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useCouponStore } from '@/stores/coupon';
import { useCouponProductStore } from '@/stores/couponProduct';
import { storeToRefs } from 'pinia';
import { Coupon } from '@/models/Coupon.ts';

const router = useRouter();
const couponStore = useCouponStore();
const couponProductStore = useCouponProductStore();
const {fb} = storeToRefs(couponStore);
const toast = useToast();

const props = defineProps({
    id: {
        type: String,
        required: true
    }
});
const items = ref([
    { route: `/coupons/${props.id}/overview`, label: 'Coupon', icon: 'pi pi-ticket' },
    { route: `/coupons/${props.id}/products`, label: 'Product Association', icon: 'pi pi-shopping-bag' }
]);

const currentRoute = computed(() => {
    return router.currentRoute.value.path;
});

const coupon = ref<Coupon>(); //Good Job

const isSaving = ref(false);
const removedItems = ref<any[]>([]);

const onCouponProductSaved = async () => {
    try {
        if (coupon.value?.coupon_id) {
            if(coupon.value.items.length > 0) {
                // Separate new items (without coupon_product_id) from existing items
                const newItems = coupon.value.items.filter(item => !item.coupon_product_id);
                const existingItems = coupon.value.items.filter(item => item.coupon_product_id);
                
                // Create new coupon products if any
                if (newItems.length > 0) {
                    await couponProductStore.createCouponProduct(newItems);
                }
                
                // Update existing coupon products if any
                for (const item of existingItems) {
                    await couponProductStore.updateCouponProduct(item);
                }
                
                // Delete removed items if any
                for (const item of removedItems.value) {
                    if (item.coupon_product_id) {
                        await couponProductStore.deleteCouponProduct(item.coupon_product_id);
                    }
                }
                
                toast.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Coupon Product(s) saved successfully',
                    life: 3000
                });
            }
            else {
                // Delete all existing items if no items remain
                if (removedItems.value.length > 0) {
                    await couponProductStore.deleteCouponProductsByCouponId(coupon.value.coupon_id);
                }
                
                await couponStore.updateCoupon(coupon.value);
                toast.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Coupon updated successfully',
                    life: 3000
                });
            }
        }
    } catch (error: any) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message || 'Failed to save Coupon',
            life: 3000
        });
    } finally {
        isSaving.value = false;
        removedItems.value = []; // Clear removed items after saving
    }
}

const onRemovedItems = (items: any[]) => {
    removedItems.value = items;
}

onMounted(async () => {
    coupon.value = await couponStore.fetchCouponById(props.id);
})
</script>

<template>
    <div class="card relative">
        <Button 
            :icon="fb.loading['coupon.update'] ? 'pi pi-spin pi-spinner' : 'pi pi-save'"
            label="Save"
            severity="primary"
            :loading="fb.loading['coupon.update']"
            :disabled="fb.loading['coupon.update']"
            @click="onCouponProductSaved"
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
                <router-view :coupon="coupon"  v-model.coupon="coupon"  @saved="onCouponProductSaved" @removedItems="onRemovedItems"/>
            </div>
        </Tabs>
    </div>
</template>

<style scoped>
label {
    font-size: 1.2rem;
}
:deep(input::placeholder),
:deep(textarea::placeholder) {
    color: #767779 !important;
    opacity: 1;
    font-size: 1.2rem;
}
</style> 