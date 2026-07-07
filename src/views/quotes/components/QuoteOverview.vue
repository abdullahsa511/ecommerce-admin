<script setup lang="ts">
import { defineProps, defineEmits, onMounted, watch, reactive } from 'vue';
import { Quote } from '@/models/Quote.ts';

const emit = defineEmits(['update:quote', 'saved']);

const props = defineProps({
  quote: {
    type: Quote,
    required: true,
    default: () => new Quote({})
  }
});

onMounted(() => {
    console.log(props.quote);
    
});


</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col md:flex-row gap-6">
      <!-- Quote Details Card -->
      <div class="flex-1 bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-medium border-b border-gray-200 pb-2 mb-4">Quote Details</h3>
        <div class="grid grid-cols-12 gap-x-6 gap-y-4">
          <label class="col-span-12 md:col-span-4 flex items-center text-base">Reference Number</label>
          <div class="col-span-12 md:col-span-8 py-2">
            <InputText v-model="quote.quoteDetails.referenceNumber" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter reference number" />
          </div>

          <label class="col-span-12 md:col-span-4 flex items-center text-base">Created By Company</label>
          <div class="col-span-12 md:col-span-8 py-2">
            <InputText v-model="quote.quoteDetails.createdByCompany" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter company" />
          </div>

          <label class="col-span-12 md:col-span-4 flex items-center text-base">Dispatch Location</label>
          <div class="col-span-12 md:col-span-8 py-2">
            <InputText v-model="quote.quoteDetails.dispatchLocation" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter location" />
          </div>

          <label class="col-span-12 md:col-span-4 flex items-center text-base">Job Title</label>
          <div class="col-span-12 md:col-span-8 py-2">
            <InputText v-model="quote.quoteDetails.jobTitle" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter job title" />
          </div>

          <label class="col-span-12 md:col-span-4 flex items-center text-base">Quote Description</label>
          <div class="col-span-12 md:col-span-8 py-2">
            <InputText v-model="quote.quoteDetails.quoteDescription" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter description" />
          </div>

          <label class="col-span-12 md:col-span-4 flex items-center text-base">Account Manager</label>
          <div class="col-span-12 md:col-span-8 py-2">
            <InputText v-model="quote.quoteDetails.accountManager" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter account manager" />
          </div>

          <label class="col-span-12 md:col-span-4 flex items-center text-base">Project Manager</label>
          <div class="col-span-12 md:col-span-8 py-2">
            <InputText v-model="quote.quoteDetails.projectManager" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter project manager" />
          </div>

          <label class="col-span-12 md:col-span-4 flex items-center text-base">Created By</label>
          <div class="col-span-12 md:col-span-8 py-2">
            <InputText v-model="quote.quoteDetails.createdBy" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter creator" />
          </div>

          <label class="col-span-12 md:col-span-4 flex items-center text-base">Customer PO</label>
          <div class="col-span-12 md:col-span-8 py-2">
            <InputText v-model="quote.quoteDetails.customerPO" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter customer PO" />
          </div>

          <label class="col-span-12 md:col-span-4 flex items-center text-base">Expiry Date</label>
          <div class="col-span-12 md:col-span-8 py-2">
            <InputText v-model="quote.quoteDetails.expiryDate" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter expiry date" />
          </div>
        </div>
      </div>

      <!-- Customer Details Card -->
      <div class="flex-1 bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-medium border-b border-gray-200 pb-2 mb-4">Customer Details</h3>
        <div class="grid grid-cols-12 gap-x-6 gap-y-4">
          <label class="col-span-12 md:col-span-4 flex items-center text-base">Organisation Code</label>
          <div class="col-span-12 md:col-span-8 py-2">
            <InputText v-model="quote.customerDetails.organisationCode" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter code" />
          </div>

          <label class="col-span-12 md:col-span-4 flex items-center text-base">Organisation Name</label>
          <div class="col-span-12 md:col-span-8 py-2">
            <InputText v-model="quote.customerDetails.organisationName" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter name" />
          </div>

          <label class="col-span-12 md:col-span-4 flex items-center text-base">ZOHO ID</label>
          <div class="col-span-12 md:col-span-8 py-2">
            <InputText v-model="quote.customerDetails.zohoId" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter Zoho ID" />
          </div>

          <label class="col-span-12 md:col-span-4 flex items-center text-base">Terms</label>
          <div class="col-span-12 md:col-span-8 py-2">
            <InputText v-model="quote.customerDetails.terms" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter terms" />
          </div>

          <label class="col-span-12 md:col-span-4 flex items-center text-base">Deposit %</label>
          <div class="col-span-12 md:col-span-8 py-2">
            <InputText v-model="quote.customerDetails.deposit" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter deposit %" />
          </div>

          <label class="col-span-12 md:col-span-4 flex items-center text-base">GST %</label>
          <div class="col-span-12 md:col-span-8 py-2">
            <InputText v-model="quote.customerDetails.gst" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter GST %" />
          </div>

          <label class="col-span-12 md:col-span-4 flex items-center text-base">Bill To</label>
          <div class="col-span-12 md:col-span-8 py-2">
            <InputText v-model="quote.customerDetails.billTo" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter bill to" />
          </div>

          <label class="col-span-12 md:col-span-4 flex items-center text-base">Ship To</label>
          <div class="col-span-12 md:col-span-8 py-2">
            <InputText v-model="quote.customerDetails.shipTo" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter ship to" />
          </div>

          <label class="col-span-12 md:col-span-4 flex items-center text-base">Site Contacts</label>
          <div class="col-span-12 md:col-span-8 py-2">
            <InputText v-model="quote.customerDetails.siteContacts" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter site contacts" />
          </div>

          <label class="col-span-12 md:col-span-4 flex items-center text-base">Customer Balance</label>
          <div class="col-span-12 md:col-span-8 py-2">
            <InputText v-model="quote.customerDetails.customerBalance" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter balance" />
          </div>
        </div>
      </div>

      <!-- Quote Totals Card -->
      <div class="flex-1 bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-medium border-b border-gray-200 pb-2 mb-4">Quote Totals</h3>
        <div class="grid grid-cols-12 gap-x-6 gap-y-4">
          <label class="col-span-12 md:col-span-6 flex items-center text-base">Sales Price List</label>
          <div class="col-span-12 md:col-span-6 py-2">
            <InputText v-model="quote.quoteTotals.salesPriceList" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter price list" />
          </div>

          <label class="col-span-12 md:col-span-6 flex items-center text-base">Total BP (Ex. GST)</label>
          <div class="col-span-12 md:col-span-6 py-2">
            <InputText v-model="quote.quoteTotals.totalBpExGst" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter total BP (ex. GST)" />
          </div>

          <label class="col-span-12 md:col-span-6 flex items-center text-base">Total BP (Inc. GST)</label>
          <div class="col-span-12 md:col-span-6 py-2">
            <InputText v-model="quote.quoteTotals.totalBpIncGst" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter total BP (inc. GST)" />
          </div>

          <label class="col-span-12 md:col-span-6 flex items-center text-base">Total SP (Ex. GST)</label>
          <div class="col-span-12 md:col-span-6 py-2">
            <InputText v-model="quote.quoteTotals.totalSpExGst" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter total SP (ex. GST)" />
          </div>

          <label class="col-span-12 md:col-span-6 flex items-center text-base">Total SP (Inc. GST)</label>
          <div class="col-span-12 md:col-span-6 py-2">
            <InputText v-model="quote.quoteTotals.totalSpIncGst" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter total SP (inc. GST)" />
          </div>

          <label class="col-span-12 md:col-span-6 flex items-center text-base">Order Discount %</label>
          <div class="col-span-12 md:col-span-6 py-2">
            <InputText v-model="quote.quoteTotals.orderDiscount" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter discount %" />
          </div>

          <label class="col-span-12 md:col-span-6 flex items-center text-base">Discount Amount</label>
          <div class="col-span-12 md:col-span-6 py-2">
            <InputText v-model="quote.quoteTotals.discountAmount" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter discount amount" />
          </div>

          <label class="col-span-12 md:col-span-6 flex items-center text-base">Grand Total SP (Ex. GST)</label>
          <div class="col-span-12 md:col-span-6 py-2">
            <InputText v-model="quote.quoteTotals.grandTotalSpExGst" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter grand total (ex. GST)" />
          </div>

          <label class="col-span-12 md:col-span-6 flex items-center text-base">Grand Total SP (Inc. GST)</label>
          <div class="col-span-12 md:col-span-6 py-2">
            <InputText v-model="quote.quoteTotals.grandTotalSpIncGst" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter grand total (inc. GST)" />
          </div>
        </div>
      </div>
    </div>
    <div class="mt-8">
      <div class="flex flex-col md:flex-row gap-6">
        <!-- Billing Address Card -->
        <div class="flex-1 bg-white rounded-lg shadow p-6 mb-8 md:mb-0">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium">Billing Address</h3>
            <i class="pi pi-pencil text-gray-400"></i>
          </div>
          <div class="grid grid-cols-12 gap-x-6 gap-y-4">
            <label class="col-span-12 text-base">Instructions</label>
            <div class="col-span-12 mb-2">
              <InputText v-model="quote.billingAddress.instructions" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter instructions" />
            </div>
            <label class="col-span-12 text-base">Address</label>
            <div class="col-span-12 mb-2">
              <InputText v-model="quote.billingAddress.address" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter address" />
            </div>
            <label class="col-span-12 md:col-span-3 text-base">Suburb</label>
            <div class="col-span-12 md:col-span-3 mb-2">
              <InputText v-model="quote.billingAddress.suburb" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter suburb" />
            </div>
            <label class="col-span-12 md:col-span-3 text-base">State</label>
            <div class="col-span-12 md:col-span-3 mb-2">
              <InputText v-model="quote.billingAddress.state" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter state" />
            </div>
            <label class="col-span-12 md:col-span-3 text-base">Postcode</label>
            <div class="col-span-12 md:col-span-3 mb-2">
              <InputText v-model="quote.billingAddress.postcode" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter postcode" />
            </div>
            <label class="col-span-12 md:col-span-3 text-base">Country</label>
            <div class="col-span-12 md:col-span-3 mb-2">
              <InputText v-model="quote.billingAddress.country" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter country" />
            </div>
          </div>
        </div>
        <!-- Shipping Address Card -->
        <div class="flex-1 bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium">Shipping Address</h3>
            <i class="pi pi-pencil text-gray-400"></i>
          </div>
          <div class="grid grid-cols-12 gap-x-6 gap-y-4">
            <label class="col-span-12 text-base">Building Name</label>
            <div class="col-span-12 mb-2">
              <InputText v-model="quote.shippingAddress.buildingName" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter building name" />
            </div>
            <label class="col-span-12 text-base">Instructions</label>
            <div class="col-span-12 mb-2">
              <InputText v-model="quote.shippingAddress.instructions" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter instructions" />
            </div>
            <label class="col-span-12 text-base">Address</label>
            <div class="col-span-12 mb-2">
              <InputText v-model="quote.shippingAddress.address" class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter address" />
            </div>
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