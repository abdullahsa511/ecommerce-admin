<script setup lang="ts">
import { ref, PropType, computed } from 'vue';
import Site from '@/models/Site';
import { useRoute } from 'vue-router';

const route = useRoute();
const props = defineProps({
  site: {
    type: Site,
    required: true,
    default: () => new Site()
  },
  fb: {
    type: Object as PropType<any>,
    required: false,
    default: () => ({})
  }
});

const siteId = computed(() => {
    const routeId = route.params.id;
    const normalizedRouteId = Array.isArray(routeId) ? routeId[0] : routeId;
    return props.site.site_id ?? normalizedRouteId ?? '';
});

const isSaving = ref(false);

const saveSite = () => {
    console.log('saveSite', props.site);
}
</script>

<template>
<!-- Orders Tab -->
<div  class="flex flex-col gap-6">
    <div class="loading-overlay" v-if="siteId && props.fb?.loading?.['site.edit.' + siteId] || props.fb?.loading?.['site.create']">
        <div class="flex justify-center items-center h-full spinner">
            <i class="pi pi-spin pi-spinner" style="font-size: 2rem;"></i>
            <p class="mt-2">Loading site data. Please wait.</p>
        </div>
    </div>
    <div class="space-y-6">
        <!-- Invoice Format -->
        <div class="grid grid-cols-12 gap-2">
            <div class="col-span-12 md:col-span-3">
                <label class="text-lg">Invoice Format</label>
            </div>
            <div class="col-span-12 md:col-span-9">
                <div class="flex flex-col gap-2">
                    <div class="flex items-center">
                        <InputText v-model="site.orderSettings.invoice_format" class="flex-1" />
                        <Button icon="pi pi-plus" class="p-button-text text-gray-600" />
                    </div>
                    <div class="text-gray-600">
                        Preview: I-25-04-777-1000-01888
                    </div>
                </div>
            </div>
        </div>

        <!-- Customer Order Id -->
        <div class="grid grid-cols-12 gap-2">
            <div class="col-span-12 md:col-span-3">
                <label class="text-lg">Customer Order Id</label>
                <div class="text-gray-500 text-sm">Generate unique random order id for customers.</div>
            </div>
            <div class="col-span-12 md:col-span-9">
                <div class="flex flex-col gap-2">
                    <div class="flex items-center">
                        <InputText v-model="site.orderSettings.customer_order_format" class="flex-1" />
                        <Button icon="pi pi-plus" class="p-button-text text-gray-600" />
                    </div>
                    <div class="text-gray-600">
                        Preview: BWAM2JQMSA2B-25
                    </div>
                </div>
            </div>
        </div>

        <!-- Display Weight on Cart Page -->
        <div class="grid grid-cols-12 gap-2">
            <div class="col-span-12 md:col-span-3">
                <label class="text-lg">Display Weight on Cart Page</label>
            </div>
            <div class="col-span-12 md:col-span-9">
                <ToggleSwitch v-model="site.orderSettings.display_weight" />
            </div>
        </div>

        <!-- Allow guest checkout -->
        <div class="grid grid-cols-12 gap-2">
            <div class="col-span-12 md:col-span-3">
                <label class="text-lg">Allow guest checkout</label>
            </div>
            <div class="col-span-12 md:col-span-9">
                <ToggleSwitch v-model="site.orderSettings.allow_guest_checkout" />
            </div>
        </div>

        <!-- New Order Status -->
        <div class="grid grid-cols-12 gap-2">
            <div class="col-span-12 md:col-span-3">
                <label class="text-lg">New Order Status</label>
                <div class="text-gray-500 text-sm">Order status when order is placed.</div>
            </div>
            <div class="col-span-12 md:col-span-9">
                <Select v-model="site.orderSettings.new_order_status" 
                    :options="['Pending', 'Processing', 'Complete', 'Cancelled']"
                    class="w-full" />
            </div>
        </div>

        <!-- Subtract stock on order status -->
        <div class="grid grid-cols-12 gap-2">
            <div class="col-span-12 md:col-span-3">
                <label class="text-lg">Subtract stock on order status</label>
                <div class="text-gray-500 text-sm">Order status for stock subtraction and coupon, voucher and rewards redemption.</div>
            </div>
            <div class="col-span-12 md:col-span-9">
                <Select v-model="site.orderSettings.subtract_stock_status" 
                    :options="['Pending', 'Processing', 'Complete', 'Cancelled']"
                    class="w-full" />
            </div>
        </div>

        <!-- Enable user downloads on order status -->
        <div class="grid grid-cols-12 gap-2">
            <div class="col-span-12 md:col-span-3">
                <label class="text-lg">Enable user downloads on order status</label>
                <div class="text-gray-500 text-sm">Order status for user to access their downloadable products and gift vouchers.</div>
            </div>
            <div class="col-span-12 md:col-span-9">
                <Select v-model="site.orderSettings.enable_downloads_status" 
                    :options="['Pending', 'Processing', 'Complete', 'Cancelled']"
                    class="w-full" />
            </div>
        </div>
    </div>
</div>
 
</template>