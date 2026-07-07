<script setup lang="ts">
import { defineEmits, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useSubscriptionStore } from '@/stores/subscription';


const subscriptionStore = useSubscriptionStore();
const { subscription, fb } = storeToRefs(subscriptionStore);

const emit = defineEmits(['create:subscriptions', 'saved']);

const statusOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Processing', value: 'processing' },
    { label: 'Pending', value: 'pending' },
    { label: 'Cancelled', value: 'cancelled' }
];
const periodOptions = [
    { label: 'One', value: '1' },
    { label: 'Two', value: '2' },
    { label: 'Three', value: '3' },
    { label: 'Four', value: '4' }
];

onMounted(async () => {

});
</script>

<template>
    <div class="flex flex-col gap-6">
        <div class="flex flex-col md:flex-row gap-6">
            <!-- Left column: Post Tag Form -->
            <div class="sm:w-full md:w-3/5 space-y-4">
                <div class="grid grid-cols-12 gap-2 mb-4">
                    <label for="user_id" class="flex items-center col-span-12 md:col-span-2 text-lg">User ID</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputNumber v-model="subscription.user_id" id="user_id" class="w-full text-lg"
                            placeholder="User ID" />
                    </div>
                </div>

                <!-- Order ID -->
                <div class="grid grid-cols-12 gap-2 mb-4">
                    <label for="order_id" class="flex items-center col-span-12 md:col-span-2 text-lg">Order ID</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputNumber v-model="subscription.order_id" id="order_id" class="w-full text-lg"
                            placeholder="Order ID" />
                    </div>
                </div>

                <!-- Order Product ID -->
                <div class="grid grid-cols-12 gap-2 mb-4">
                    <label for="order_product_id" class="flex items-center col-span-12 md:col-span-2 text-lg">Order
                        Product ID</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputNumber v-model="subscription.order_product_id" id="order_product_id"
                            class="w-full text-lg" placeholder="Order Product ID" />
                    </div>
                </div>

                <!-- Site ID -->
                <div class="grid grid-cols-12 gap-2 mb-4">
                    <label for="site_id" class="flex items-center col-span-12 md:col-span-2 text-lg">Site ID</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputNumber v-model="subscription.site_id" id="site_id" class="w-full text-lg"
                            placeholder="Site ID" />
                    </div>
                </div>

                <!-- Payment Method -->
                <div class="grid grid-cols-12 gap-2 mb-4">
                    <label for="payment_method" class="flex items-center col-span-12 md:col-span-2 text-lg">Payment
                        Method</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText v-model="subscription.payment_method" id="payment_method" class="w-full text-lg"
                            placeholder="Payment Method" />
                    </div>
                </div>

                <!-- Shipping Method -->
                <div class="grid grid-cols-12 gap-2 mb-4">
                    <label for="shipping_method" class="flex items-center col-span-12 md:col-span-2 text-lg">Shipping
                        Method</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText v-model="subscription.shipping_method" id="shipping_method" class="w-full text-lg"
                            placeholder="Shipping Method" />
                    </div>
                </div>

                <!-- Product ID -->
                <div class="grid grid-cols-12 gap-2 mb-4">
                    <label for="product_id" class="flex items-center col-span-12 md:col-span-2 text-lg">Product
                        ID</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputNumber v-model="subscription.product_id" id="product_id" class="w-full text-lg"
                            placeholder="Product ID" />
                    </div>
                </div>

                <!-- Quantity -->
                <div class="grid grid-cols-12 gap-2 mb-4">
                    <label for="quantity" class="flex items-center col-span-12 md:col-span-2 text-lg">Quantity</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputNumber v-model="subscription.quantity" id="quantity" class="w-full text-lg"
                            placeholder="Quantity" />
                    </div>
                </div>

                <!-- Price -->
                <div class="grid grid-cols-12 gap-2 mb-4">
                    <label for="price" class="flex items-center col-span-12 md:col-span-2 text-lg">Price</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputNumber v-model="subscription.price" id="price" class="w-full text-lg" mode="decimal"
                            placeholder="Price" />
                    </div>
                </div>

                <!-- Period -->
                <div class="grid grid-cols-12 gap-2 mb-4">
                    <label for="period" class="flex items-center col-span-12 md:col-span-2 text-lg">Period</label>
                    <div class="col-span-12 md:col-span-10">
                        <Dropdown v-model="subscription.period" :options="periodOptions" placeholder="Select Period"
                            class="w-full text-lg" />
                    </div>
                </div>

                <!-- Cycle -->
                <div class="grid grid-cols-12 gap-2 mb-4">
                    <label for="cycle" class="flex items-center col-span-12 md:col-span-2 text-lg">Cycle</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputNumber v-model="subscription.cycle" id="cycle" class="w-full text-lg"
                            placeholder="Cycle" />
                    </div>
                </div>

                <!-- Length -->
                <div class="grid grid-cols-12 gap-2 mb-4">
                    <label for="length" class="flex items-center col-span-12 md:col-span-2 text-lg">Length</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputNumber v-model="subscription.length" id="length" class="w-full text-lg"
                            placeholder="Length" />
                    </div>
                </div>

                <!-- Left -->
                <div class="grid grid-cols-12 gap-2 mb-4">
                    <label for="left" class="flex items-center col-span-12 md:col-span-2 text-lg">Left</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputNumber v-model="subscription.left" id="left" class="w-full text-lg" placeholder="Left" />
                    </div>
                </div>

                <!-- Trial Price -->
                <div class="grid grid-cols-12 gap-2 mb-4">
                    <label for="trial_price" class="flex items-center col-span-12 md:col-span-2 text-lg">Trial
                        Price</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputNumber v-model="subscription.trial_price" id="trial_price" class="w-full text-lg"
                            mode="decimal" placeholder="Trial Price" />
                    </div>
                </div>

                <!-- Trial Period -->
                <div class="grid grid-cols-12 gap-2 mb-4">
                    <label for="trial_period" class="flex items-center col-span-12 md:col-span-2 text-lg">Trial
                        Period</label>
                    <div class="col-span-12 md:col-span-10">
                        <Dropdown v-model="subscription.trial_period" :options="periodOptions"
                            placeholder="Select Trial Period" class="w-full text-lg" />
                    </div>
                </div>

                <!-- Trial Cycle -->
                <div class="grid grid-cols-12 gap-2 mb-4">
                    <label for="trial_cycle" class="flex items-center col-span-12 md:col-span-2 text-lg">Trial
                        Cycle</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputNumber v-model="subscription.trial_cycle" id="trial_cycle" class="w-full text-lg"
                            placeholder="Trial Cycle" />
                    </div>
                </div>

                <!-- Trial Length -->
                <div class="grid grid-cols-12 gap-2 mb-4">
                    <label for="trial_length" class="flex items-center col-span-12 md:col-span-2 text-lg">Trial
                        Length</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputNumber v-model="subscription.trial_length" id="trial_length" class="w-full text-lg"
                            placeholder="Trial Length" />
                    </div>
                </div>

                <!-- Trial Left -->
                <div class="grid grid-cols-12 gap-2 mb-4">
                    <label for="trial_left" class="flex items-center col-span-12 md:col-span-2 text-lg">Trial
                        Left</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputNumber v-model="subscription.trial_left" id="trial_left" class="w-full text-lg"
                            placeholder="Trial Left" />
                    </div>
                </div>

                <!-- Trial Status -->
                <div class="grid grid-cols-12 gap-2 mb-4">
                    <label for="trial_status" class="flex items-center col-span-12 md:col-span-2 text-lg">Trial
                        Status</label>
                    <div class="col-span-12 md:col-span-10">
                        <Dropdown v-model="subscription.trial_status" :options="statusOptions"
                            placeholder="Select Trial Status" class="w-full text-lg" />
                    </div>
                </div>

                <!-- Date Next -->
                <div class="grid grid-cols-12 gap-2 mb-4">
                    <label for="date_next" class="flex items-center col-span-12 md:col-span-2 text-lg">Next Date</label>
                    <div class="col-span-12 md:col-span-10">
                        <DatePicker v-model="subscription.date_next" class="w-full text-lg p-2" />
                    </div>
                </div>

                <!-- Subscription Status ID -->
                <div class="grid grid-cols-12 gap-2 mb-4">
                    <label for="subscription_status_id"
                        class="flex items-center col-span-12 md:col-span-2 text-lg">Subscription Status</label>
                    <div class="col-span-12 md:col-span-10">
                        <Dropdown v-model="subscription.subscription_status_id" :options="statusOptions"
                            placeholder="Select Status" class="w-full text-lg" />
                    </div>
                </div>

                <!-- Notes -->
                <div class="grid grid-cols-12 gap-2 mb-4">
                    <label for="notes" class="flex items-center col-span-12 md:col-span-2 text-lg">Notes</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputTextarea v-model="subscription.notes" id="notes" class="w-full text-lg" rows="3"
                            placeholder="Notes" />
                    </div>
                </div>

            </div>

            <!-- <div class="w-3/5 space-y-4">
                <div class="grid grid-cols-12 gap-2">
                    <label for="user"
                        class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">User Name</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText class="text-lg w-full" id="user" type="text" v-model="subscription.user"
                            placeholder="Name" />
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="reason"
                        class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Reason</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText class="text-lg w-full" id="reason" type="text" v-model="subscription.reason"
                            placeholder="Reason" />
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="status" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Status</label>
                    <div class="col-span-12 md:col-span-10">
                        <Dropdown 
                            v-model="subscription.status" 
                            :options="statusOptions" 
                            optionLabel="label" 
                            optionValue="code"
                            placeholder="Select Status"
                            class="w-full text-lg"
                        />
                    </div>
                </div>
            </div> -->

            <div class="sm:w-full md:w-3/5 space-y-4" v-if="fb.errors['subscription.create']">
                <h3 class="text-lg font-medium border-b border-gray-200 pt-5 pb-2 text-red-600">
                    Errors
                </h3>
                <div v-html="fb.renderErrors('subscription.create')"
                    class="border border-red-300 bg-red-50 text-red-700 rounded-md p-3"></div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
