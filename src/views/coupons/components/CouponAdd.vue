<script setup lang="ts">
import { defineEmits, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useCouponStore } from '@/stores/coupon';


const couponStore = useCouponStore();
const { coupon, fb } = storeToRefs(couponStore);

const emit = defineEmits(['update:coupon', 'saved']);


onMounted(async () => {
    couponStore.resetCoupon(); //reset form for add.
});
</script>

<template>
    <div class="flex flex-col gap-6">
      <div class="flex flex-col md:flex-row gap-6">
        <!-- Basic Info Card -->
        <div class="flex-1 bg-white">
          <h3 class="text-lg font-medium border-b border-gray-200 pb-2 mb-4">Basic Information</h3>
          <div class="grid grid-cols-12 gap-x-6 gap-y-4">
            <label class="col-span-12 md:col-span-4 flex items-center text-base">Name</label>
            <div class="col-span-12 md:col-span-8 py-2">
              <InputText v-model="coupon.couponDetails.name" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter coupon name" :class="{'p-invalid': fb.errors?.['coupon.create']?.name}" />
              <Message v-if="fb.errors?.['coupon.create']?.name" severity="error" size="small" variant="title">
                <span v-for="error in fb.errors?.['coupon.create']?.name" :key="error" class="flex flex-col">
                  {{ error }}
                </span>
              </Message>

            </div>
  
            <label class="col-span-12 md:col-span-4 flex items-center text-base">Code</label>
            <div class="col-span-12 md:col-span-8 py-2">
              <InputText v-model="coupon.couponDetails.code" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter coupon code" :class="{'p-invalid': fb.errors?.['coupon.create']?.code}" />
              <Message v-if="fb.errors?.['coupon.create']?.code" severity="error" size="small" variant="title">
                <span v-for="error in fb.errors?.['coupon.create']?.code" :key="error" class="flex flex-col">
                  {{ error }}
                </span>
              </Message>
            </div>
  
            <label class="col-span-12 md:col-span-4 flex items-center text-base">Type</label>
            <div class="col-span-12 md:col-span-8 py-2">
              <Dropdown 
                v-model="coupon.couponDetails.type"
                :options="[
                  { label: 'Percentage', value: 'P' },
                  { label: 'Fixed', value: 'F' }
                ]"
                optionLabel="label"
                optionValue="value"
                placeholder="Select type"
                class="w-full"
                :class="{'p-invalid': fb.errors?.['coupon.create']?.type}"
              />
              <Message v-if="fb.errors?.['coupon.create']?.type" severity="error" size="small" variant="title">
                <span v-for="error in fb.errors?.['coupon.create']?.type" :key="error" class="flex flex-col">
                  {{ error }}
                </span>
              </Message>
            </div>
  
            <label class="col-span-12 md:col-span-4 flex items-center text-base">Discount</label>
            <div class="col-span-12 md:col-span-8 py-2">
              <InputNumber v-model="coupon.couponDetails.discount" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter discount value" :class="{'p-invalid': fb.errors?.['coupon.create']?.discount}" />
              <Message v-if="fb.errors?.['coupon.create']?.discount" severity="error" size="small" variant="title">
                <span v-for="error in fb.errors?.['coupon.create']?.discount" :key="error" class="flex flex-col">
                  {{ error }}
                </span>
              </Message>
            </div>
  
            <label class="col-span-12 md:col-span-4 flex items-center text-base">Free Shipping</label>
            <div class="col-span-12 md:col-span-8 py-2">
              <Dropdown 
                v-model="coupon.couponDetails.free_shipping"
                :options="[
                  { label: 'Yes', value: 1 },
                  { label: 'No', value: 0 }
                ]"
                optionLabel="label"
                optionValue="value"
                placeholder="Select option"
                class="w-full"
                :class="{'p-invalid': fb.errors?.['coupon.create']?.free_shipping}"
              />
              <Message v-if="fb.errors?.['coupon.create']?.free_shipping" severity="error" size="small" variant="title">
                <span v-for="error in fb.errors?.['coupon.create']?.free_shipping" :key="error" class="flex flex-col">
                  {{ error }}
                </span>
              </Message>
            </div>
  
            <label class="col-span-12 md:col-span-4 flex items-center text-base">Status</label>
            <div class="col-span-12 md:col-span-8 py-2">
              <Dropdown 
                v-model="coupon.couponDetails.status"
                :options="[
                  { label: 'Enabled', value: 1 },
                  { label: 'Disabled', value: 0 }
                ]"
                optionLabel="label"
                optionValue="value"
                placeholder="Select status"
                class="w-full"
              />
            </div>
          </div>
        </div>
  
        <!-- Restrictions Card -->
        <div class="flex-1 bg-white">
          <h3 class="text-lg font-medium border-b border-gray-200 pb-2 mb-4">Restrictions</h3>
          <div class="grid grid-cols-12 gap-x-6 gap-y-4">
            <label class="col-span-12 md:col-span-4 flex items-center text-base">Registered Users Only</label>
            <div class="col-span-12 md:col-span-8 py-2">
              <Dropdown 
                v-model="coupon.couponDetails.registered_user_only"
                :options="[
                  { label: 'Yes', value: 1 },
                  { label: 'No', value: 0 }
                ]"
                optionLabel="label"
                optionValue="value"
                placeholder="Select option"
                class="w-full"
              />
            </div>
  
            <label class="col-span-12 md:col-span-4 flex items-center text-base">Minimum Cart Total</label>
            <div class="col-span-12 md:col-span-8 py-2">
              <InputNumber v-model="coupon.couponDetails.cart_total_min" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter minimum cart total" />
            </div>
  
            <label class="col-span-12 md:col-span-4 flex items-center text-base">Start Date</label>
            <div class="col-span-12 md:col-span-8 py-2">
              <Calendar v-model="coupon.couponDetails.date_start" dateFormat="yy-mm-dd" placeholder="yyyy-mm-dd" class="w-full" :class="{'p-invalid': fb.errors?.['coupon.create']?.date_start}" />
              <Message v-if="fb.errors?.['coupon.create']?.date_start" severity="error" size="small" variant="title">
                <span v-for="error in fb.errors?.['coupon.create']?.date_start" :key="error" class="flex flex-col">
                  {{ error }}
                </span>
              </Message>
            </div>
  
            <label class="col-span-12 md:col-span-4 flex items-center text-base">End Date</label>
            <div class="col-span-12 md:col-span-8 py-2">
              <Calendar v-model="coupon.couponDetails.date_end" dateFormat="yy-mm-dd" placeholder="yyyy-mm-dd" class="w-full" :class="{'p-invalid': fb.errors?.['coupon.create']?.date_end}" />
              <Message v-if="fb.errors?.['coupon.create']?.date_end" severity="error" size="small" variant="title">
                <span v-for="error in fb.errors?.['coupon.create']?.date_end" :key="error" class="flex flex-col">
                  {{ error }}
                </span>
              </Message>
            </div>
          </div>
        </div>
  
        <!-- Limits Card -->
        <div class="flex-1 bg-white">
          <h3 class="text-lg font-medium border-b border-gray-200 pb-2 mb-4">Usage Limits</h3>
          <div class="grid grid-cols-12 gap-x-6 gap-y-4">
            <label class="col-span-12 md:col-span-4 flex items-center text-base">Coupon Limit</label>
            <div class="col-span-12 md:col-span-8 py-2">
              <InputNumber v-model="coupon.couponDetails.coupon_limit" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter coupon limit (0 = unlimited)" />
            </div>
  
            <label class="col-span-12 md:col-span-4 flex items-center text-base">User Limit</label>
            <div class="col-span-12 md:col-span-8 py-2">
              <InputNumber v-model="coupon.couponDetails.user_limit" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter user limit (0 = unlimited)" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>

<style scoped>
.th-site-logo-title {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-width: 180px;
}
.th-site-logo {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 160px;
    border-radius: 5px;
    padding: 10px;
    flex:1;
}
</style> 
