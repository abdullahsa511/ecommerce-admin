<script setup lang="ts">
import { defineProps, defineEmits, onMounted } from 'vue';
import { Order } from '@/models/Order.ts';

const emit = defineEmits(['update:order', 'saved']);

const props = defineProps({
  order: {
    type: Object as () => Order,
    required: true,
    default: () => new Order({})
  }
});

onMounted(() => {
    console.log(props.order);
});
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- First Row: Order Details and Customer Details -->
    <div class="flex flex-col md:flex-row gap-6">
      <!-- Order Details Card -->
      <div class="flex-1 bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-medium border-b border-gray-200 pb-2 mb-4">Order Details</h3>
        <div class="grid grid-cols-12 gap-x-6 gap-y-4">
          <div class="col-span-12 md:col-span-6">
            <label class="block text-base mb-2">Invoice No</label>
            <InputText v-model="order.orderDetails.invoice_no" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter invoice number" />
          </div>

          <div class="col-span-12 md:col-span-6">
            <label class="block text-base mb-2">Customer Order ID</label>
            <InputText v-model="order.orderDetails.customer_order_id" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter customer order ID" />
          </div>

          <div class="col-span-12 md:col-span-6">
            <label class="block text-base mb-2">Invoice Prefix</label>
            <InputText v-model="order.orderDetails.invoice_prefix" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter invoice prefix" />
          </div>

          <div class="col-span-12 md:col-span-6">
            <label class="block text-base mb-2">Site ID</label>
            <InputText v-model="order.orderDetails.site_id" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter site ID" />
          </div>

          <div class="col-span-12 md:col-span-6">
            <label class="block text-base mb-2">Site Name</label>
            <InputText v-model="order.orderDetails.site_name" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter site name" />
          </div>

          <div class="col-span-12 md:col-span-6">
            <label class="block text-base mb-2">Total</label>
            <InputText v-model="order.orderDetails.total" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter total" />
          </div>

          <div class="col-span-12 md:col-span-6">
            <label class="block text-base mb-2">Order Status</label>
            <InputText v-model="order.orderDetails.order_status_id" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter order status" />
          </div>

          <div class="col-span-12 md:col-span-6">
            <label class="block text-base mb-2">Language</label>
            <InputText v-model="order.orderDetails.language_id" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter language" />
          </div>

          <div class="col-span-12 md:col-span-6">
            <label class="block text-base mb-2">Currency</label>
            <InputText v-model="order.orderDetails.currency" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter currency" />
          </div>

          <div class="col-span-12 md:col-span-6">
            <label class="block text-base mb-2">Currency Value</label>
            <InputText v-model="order.orderDetails.currency_value" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter currency value" />
          </div>

          <div class="col-span-12">
            <label class="block text-base mb-2">Notes</label>
            <InputText v-model="order.orderDetails.notes" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter notes" />
          </div>
        </div>
      </div>

      <!-- Customer Details Card -->
      <div class="flex-1 bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-medium border-b border-gray-200 pb-2 mb-4">Customer Details</h3>
        <div class="grid grid-cols-12 gap-x-6 gap-y-4">
          <label class="col-span-12 md:col-span-4 flex items-center text-base">User ID</label>
          <div class="col-span-12 md:col-span-8 py-2">
            <InputText v-model="order.customerDetails.user_id" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter user ID" />
          </div>

          <label class="col-span-12 md:col-span-4 flex items-center text-base">User Group ID</label>
          <div class="col-span-12 md:col-span-8 py-2">
            <InputText v-model="order.customerDetails.user_group_id" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter user group ID" />
          </div>

          <label class="col-span-12 md:col-span-4 flex items-center text-base">First Name</label>
          <div class="col-span-12 md:col-span-8 py-2">
            <InputText v-model="order.customerDetails.first_name" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter first name" />
          </div>

          <label class="col-span-12 md:col-span-4 flex items-center text-base">Last Name</label>
          <div class="col-span-12 md:col-span-8 py-2">
            <InputText v-model="order.customerDetails.last_name" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter last name" />
          </div>

          <label class="col-span-12 md:col-span-4 flex items-center text-base">Email</label>
          <div class="col-span-12 md:col-span-8 py-2">
            <InputText v-model="order.customerDetails.email" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter email" />
          </div>

          <label class="col-span-12 md:col-span-4 flex items-center text-base">Phone Number</label>
          <div class="col-span-12 md:col-span-8 py-2">
            <InputText v-model="order.customerDetails.phone_number" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter phone number" />
          </div>

          <label class="col-span-12 md:col-span-4 flex items-center text-base">Total Orders</label>
          <div class="col-span-12 md:col-span-8 py-2">
            <InputText v-model="order.customerDetails.total_orders" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter total orders" />
          </div>
        </div>
      </div>
    </div>

    <!-- Second Row: Billing Details and Shipping Details -->
    <div class="flex flex-col md:flex-row gap-6">
      <!-- Billing Details Card -->
      <div class="flex-1 bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-medium border-b border-gray-200 pb-2 mb-4">Billing Details</h3>
        <div class="grid grid-cols-12 gap-x-6 gap-y-4">
          <div class="col-span-12 md:col-span-6">
            <label class="block text-base mb-2">First Name</label>
            <InputText v-model="order.billingDetails.billing_first_name" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter first name" />
          </div>

          <div class="col-span-12 md:col-span-6">
            <label class="block text-base mb-2">Last Name</label>
            <InputText v-model="order.billingDetails.billing_last_name" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter last name" />
          </div>

          <div class="col-span-12 md:col-span-6">
            <label class="block text-base mb-2">Company</label>
            <InputText v-model="order.billingDetails.billing_company" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter company" />
          </div>

          <div class="col-span-12 md:col-span-6">
            <label class="block text-base mb-2">Address 1</label>
            <InputText v-model="order.billingDetails.billing_address_1" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter address 1" />
          </div>

          <div class="col-span-12 md:col-span-6">
            <label class="block text-base mb-2">Address 2</label>
            <InputText v-model="order.billingDetails.billing_address_2" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter address 2" />
          </div>

          <div class="col-span-12 md:col-span-6">
            <label class="block text-base mb-2">City</label>
            <InputText v-model="order.billingDetails.billing_city" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter city" />
          </div>

          <div class="col-span-12 md:col-span-6">
            <label class="block text-base mb-2">Post Code</label>
            <InputText v-model="order.billingDetails.billing_post_code" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter post code" />
          </div>

          <div class="col-span-12 md:col-span-6">
            <label class="block text-base mb-2">Country ID</label>
            <InputText v-model="order.billingDetails.billing_country_id" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter country ID" />
          </div>

          <div class="col-span-12 md:col-span-6">
            <label class="block text-base mb-2">Region</label>
            <InputText v-model="order.billingDetails.billing_region" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter region" />
          </div>

          <div class="col-span-12 md:col-span-6">
            <label class="block text-base mb-2">Region ID</label>
            <InputText v-model="order.billingDetails.billing_region_id" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter region ID" />
          </div>

          <div class="col-span-12 md:col-span-6">
            <label class="block text-base mb-2">Payment Method</label>
            <InputText v-model="order.billingDetails.payment_method" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter payment method" />
          </div>

          <div class="col-span-12 md:col-span-6">
            <label class="block text-base mb-2">Payment Data</label>
            <InputText v-model="order.billingDetails.payment_data" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter payment data" />
          </div>

          <div class="col-span-12 md:col-span-6">
            <label class="block text-base mb-2">Payment Status ID</label>
            <InputText v-model="order.billingDetails.payment_status_id" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter payment status ID" />
          </div>
        </div>
      </div>

      <!-- Shipping Details Card -->
      <div class="flex-1 bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-medium border-b border-gray-200 pb-2 mb-4">Shipping Details</h3>
        <div class="grid grid-cols-12 gap-x-6 gap-y-4">
          <div class="col-span-12 md:col-span-6">
            <label class="block text-base mb-2">First Name</label>
            <InputText v-model="order.shippingDetails.shipping_first_name" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter first name" />
          </div>

          <div class="col-span-12 md:col-span-6">
            <label class="block text-base mb-2">Last Name</label>
            <InputText v-model="order.shippingDetails.shipping_last_name" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter last name" />
          </div>

          <div class="col-span-12 md:col-span-6">
            <label class="block text-base mb-2">Company</label>
            <InputText v-model="order.shippingDetails.shipping_company" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter company" />
          </div>

          <div class="col-span-12 md:col-span-6">
            <label class="block text-base mb-2">Address 1</label>
            <InputText v-model="order.shippingDetails.shipping_address_1" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter address 1" />
          </div>

          <div class="col-span-12 md:col-span-6">
            <label class="block text-base mb-2">Address 2</label>
            <InputText v-model="order.shippingDetails.shipping_address_2" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter address 2" />
          </div>

          <div class="col-span-12 md:col-span-6">
            <label class="block text-base mb-2">City</label>
            <InputText v-model="order.shippingDetails.shipping_city" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter city" />
          </div>

          <div class="col-span-12 md:col-span-6">
            <label class="block text-base mb-2">Post Code</label>
            <InputText v-model="order.shippingDetails.shipping_post_code" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter post code" />
          </div>

          <div class="col-span-12 md:col-span-6">
            <label class="block text-base mb-2">Country</label>
            <InputText v-model="order.shippingDetails.shipping_country" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter country" />
          </div>

          <div class="col-span-12 md:col-span-6">
            <label class="block text-base mb-2">Country ID</label>
            <InputText v-model="order.shippingDetails.shipping_country_id" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter country ID" />
          </div>

          <div class="col-span-12 md:col-span-6">
            <label class="block text-base mb-2">Region</label>
            <InputText v-model="order.shippingDetails.shipping_region" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter region" />
          </div>

          <div class="col-span-12 md:col-span-6">
            <label class="block text-base mb-2">Region ID</label>
            <InputText v-model="order.shippingDetails.shipping_region_id" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter region ID" />
          </div>

          <div class="col-span-12 md:col-span-6">
            <label class="block text-base mb-2">Shipping Method</label>
            <InputText v-model="order.shippingDetails.shipping_method" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter shipping method" />
          </div>

          <div class="col-span-12 md:col-span-6">
            <label class="block text-base mb-2">Shipping Data</label>
            <InputText v-model="order.shippingDetails.shipping_data" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter shipping data" />
          </div>

          <div class="col-span-12 md:col-span-6">
            <label class="block text-base mb-2">Shipping Status ID</label>
            <InputText v-model="order.shippingDetails.shipping_status_id" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter shipping status ID" />
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