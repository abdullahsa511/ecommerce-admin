<script setup lang="ts">
import { computed } from 'vue';
import { Pinboard } from '@/models/Pinboard.ts';

const emit = defineEmits(['update:temporaryPinboard', 'saved']);

const props = defineProps({
  pinboard: {
    type: Pinboard,
    required: true,
    default: () => new Pinboard({})
  }
});

const statusLabel = computed(() =>
  props.pinboard?.pinboard_status?.name ||
  props.pinboard?.pinboardDetails?.pinboard_status_name ||
  'Draft'
);

const statusClass = computed(() => {
  const id =
    props.pinboard?.pinboard_status?.order_status_id ??
    props.pinboard?.pinboardDetails?.pinboard_status_id;
  if (id === 8) return 'bg-red-700 text-white';
  if (id === 0) return 'bg-green-700 text-white';
  return 'bg-gray-500 text-white';
});

</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col md:flex-row gap-6">
      <!-- Pinboard Details Card -->
      <div class="flex-1 bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-medium border-b border-gray-200 pb-2 mb-4">Pinboard Details</h3>
        <div class="grid grid-cols-12 gap-x-6 gap-y-4">
          <label class="col-span-12 md:col-span-4 flex items-center text-base">Status</label>
          <div class="col-span-12 md:col-span-8 py-2">
            <span
              :class="['px-3 py-1 text-sm font-medium rounded-lg inline-block', statusClass]"
            >
              {{ statusLabel }}
            </span>
          </div>

          <label class="col-span-12 md:col-span-4 flex items-center text-base">Reference Number</label>
          <div class="col-span-12 md:col-span-8 py-2">
            <InputText v-model="pinboard.pinboardDetails.referenceNumber" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter reference number" />
          </div>

          <label class="col-span-12 md:col-span-4 flex items-center text-base">Created By Company</label>
          <div class="col-span-12 md:col-span-8 py-2">
            <InputText v-model="pinboard.pinboardDetails.createdByCompany" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter company" />
          </div>

          <label class="col-span-12 md:col-span-4 flex items-center text-base">Dispatch Location</label>
          <div class="col-span-12 md:col-span-8 py-2">
            <InputText v-model="pinboard.pinboardDetails.dispatchLocation" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter location" />
          </div>

          <label class="col-span-12 md:col-span-4 flex items-center text-base">Job Title</label>
          <div class="col-span-12 md:col-span-8 py-2">
            <InputText v-model="pinboard.pinboardDetails.jobTitle" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter job title" />
          </div>

          <label class="col-span-12 md:col-span-4 flex items-center text-base">Pinboard Description</label>
          <div class="col-span-12 md:col-span-8 py-2">
            <InputText v-model="pinboard.pinboardDetails.pinboardDescription" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter description" />
          </div>

          <label class="col-span-12 md:col-span-4 flex items-center text-base">Account Manager</label>
          <div class="col-span-12 md:col-span-8 py-2">
            <InputText v-model="pinboard.pinboardDetails.accountManager" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter account manager" />
          </div>

          <label class="col-span-12 md:col-span-4 flex items-center text-base">Project Manager</label>
          <div class="col-span-12 md:col-span-8 py-2">
            <InputText v-model="pinboard.pinboardDetails.projectManager" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter project manager" />
          </div>

          <label class="col-span-12 md:col-span-4 flex items-center text-base">Created By</label>
          <div class="col-span-12 md:col-span-8 py-2">
            <InputText v-model="pinboard.pinboardDetails.createdBy" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter creator" />
          </div>

          <label class="col-span-12 md:col-span-4 flex items-center text-base">Customer PO</label>
          <div class="col-span-12 md:col-span-8 py-2">
            <InputText v-model="pinboard.pinboardDetails.customerPO" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter customer PO" />
          </div>

          <label class="col-span-12 md:col-span-4 flex items-center text-base">Expiry Date</label>
          <div class="col-span-12 md:col-span-8 py-2">
              <DatePicker 
                  v-model="pinboard.pinboardDetails.expiryDate as unknown as Date" 
                  class="w-full text-lg"
                  dateFormat="yy-mm-dd"
                  placeholder="yyyy-mm-dd"
              />
            <!-- <InputText v-model="pinboard.pinboardDetails.expiryDate" type="date" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter expiry date" /> -->
          </div>
        </div>
      </div>

      <!-- Customer Details Card -->
      <div class="flex-1 bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-medium border-b border-gray-200 pb-2 mb-4">Customer Details</h3>
        <div class="grid grid-cols-12 gap-x-6 gap-y-4">
          <label class="col-span-12 md:col-span-4 flex items-center text-base">Customer Name</label>
          <div class="col-span-12 md:col-span-8 py-2">
            <InputText v-model="pinboard.customerDetails.customer_name" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter code" />
          </div>

          <label class="col-span-12 md:col-span-4 flex items-center text-base">Customer Email</label>
          <div class="col-span-12 md:col-span-8 py-2">
            <InputText v-model="pinboard.customerDetails.customer_email" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter name" />
          </div>

          <label class="col-span-12 md:col-span-4 flex items-center text-base">Customer Phone</label>
          <div class="col-span-12 md:col-span-8 py-2">
            <InputText v-model="pinboard.customerDetails.customer_phone" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter phone number" />
          </div>

          <label class="col-span-12 md:col-span-4 flex items-center text-base">Term</label>
          <div class="col-span-12 md:col-span-8 py-2">
            <InputText v-model="pinboard.customerDetails.terms" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter terms" />
          </div>

          <label class="col-span-12 md:col-span-4 flex items-center text-base">Bill To</label>
          <div class="col-span-12 md:col-span-8 py-2">
            <InputText v-model="pinboard.customerDetails.billTo" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter bill to" />
          </div>

          <label class="col-span-12 md:col-span-4 flex items-center text-base">Ship To</label>
          <div class="col-span-12 md:col-span-8 py-2">
            <InputText v-model="pinboard.customerDetails.shipTo" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter ship to" />
          </div>
        </div>
      </div>

      <!-- Billing and Shipping Address Card -->
      <div class="flex-1 bg-white rounded-lg shadow p-6">
        <div class="grid grid-cols-12 gap-x-6 gap-y-4">
           <!-- Billing Address Card -->

          <div class="flex items-center justify-between mb-4 col-span-12">
            <h3 class="text-lg font-medium">Billing Address</h3>
            <i class="pi pi-pencil text-gray-400"></i>
          </div>
            <div class="col-span-12 mb-2">
              <InputText v-model="pinboard.billingAddress.instructions" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter instructions" />
            </div>
            <div class="col-span-12 mb-2">
              <InputText v-model="pinboard.billingAddress.address" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter address" />
            </div>
            <div class="col-span-12 md:col-span-6 mb-2">
              <InputText v-model="pinboard.billingAddress.suburb" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter suburb" />
            </div>
            <div class="col-span-12 md:col-span-6 mb-2">
              <InputText v-model="pinboard.billingAddress.state" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter state" />
            </div>
            <div class="col-span-12 md:col-span-6 mb-2">
              <InputText v-model="pinboard.billingAddress.postcode" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter postcode" />
            </div>
            <div class="col-span-12 md:col-span-6 mb-2">
              <InputText v-model="pinboard.billingAddress.country" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter country" />
            </div>
        </div>
        <div class="grid grid-cols-12 gap-x-6 gap-y-4">
          <!-- Shipping Address Card -->

          <div class="flex items-center justify-between mb-4 col-span-12 mt-5">
            <h3 class="text-lg font-medium">Shipping Address</h3>
            <i class="pi pi-pencil text-gray-400"></i>
          </div>
            <div class="col-span-12 mb-2">
              <InputText v-model="pinboard.shippingAddress.instructions" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter instructions" />
            </div>
            <div class="col-span-12 mb-2">
              <InputText v-model="pinboard.shippingAddress.address" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter address" />
            </div>
            <div class="col-span-12 md:col-span-6 mb-2">
              <InputText v-model="pinboard.shippingAddress.suburb" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter suburb" />
            </div>
            <div class="col-span-12 md:col-span-6 mb-2">
              <InputText v-model="pinboard.shippingAddress.state" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter state" />
            </div>
            <div class="col-span-12 md:col-span-6 mb-2">
              <InputText v-model="pinboard.shippingAddress.postcode" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter postcode" />
            </div>
            <div class="col-span-12 md:col-span-6 mb-2">
              <InputText v-model="pinboard.shippingAddress.country" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter country" />
            </div>
        </div>
      </div>
    </div>
    <div class="mt-8">
      <div class="flex flex-col md:flex-row gap-6">
       
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