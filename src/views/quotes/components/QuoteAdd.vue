<script setup lang="ts">

import { storeToRefs } from 'pinia';
import { useQuoteStore } from "@/stores/quote";
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { AutoComplete } from 'primevue';
import { debounce } from 'lodash';
// import { Customer } from '@/models/Customer';

const quoteStore = useQuoteStore();
const { quote, customers, fb } = storeToRefs(quoteStore);
// const emit = defineEmits(['update:quote', 'saved', 'editTabMounted', 'editTabUnmounted']);
const emit = defineEmits(['update:quote', 'saved']);
const customerSuggestions = ref<any[]>([]);

// search customers from store customers list // later i will dynamically fetch customers from api
// const searchCustomers = (e: any) => {
//     const query = e.data?.toLowerCase();
//     if (query?.length > 0) {
//         customerSuggestions.value = customers.value.filter((customer: any) => customer.name.toLowerCase().includes(query));
//     } else {
//         customerSuggestions.value = [];
//     }
// }

const searchCustomers = async (e: any) => {
    const query = e.data?.toLowerCase();
    if (query?.length > 0) {
        // customerSuggestions.value = customers.value.filter((customer: any) => customer.name.toLowerCase().includes(query));
        customerSuggestions.value = await quoteStore.getCustomers(query);
        console.log('customerSuggestions searchCustomers', customerSuggestions.value);
    } else {
        customerSuggestions.value = [];
    }
}

function addCustomer(event: { value: any }) {
    // console.log('event addCustomer', event.value.customerDetails);
    quote.value.customerDetails = event.value.customerDetails;
    quote.value.billingAddress = event.value.billingDetails;
    quote.value.shippingAddress = event.value.shippingDetails;

    // console.log('quote.value', quote.value);
    // emit('update:quote', quote.value);
}


// function addCustomer(event: { value: any }) {
//     // console.log('event addCustomer', event.value);
//     quote.value.customerDetails = event.value;
//     console.log('quote.value', quote.value);
//     emit('update:quote', quote.value);
// }

onMounted(async () => {
    // emit('editTabMounted');
    quoteStore.resetQuote(); //reset form for add.
    await quoteStore.getCustomers();
    console.log('customers', customers);
});

onUnmounted(() => {
    // emit('editTabUnmounted');
});

const onCustomerInput = debounce(searchCustomers, 300);
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
                        <InputText v-model="quote.quoteDetails.referenceNumber"
                            class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter reference number"
                            :class="{ 'p-invalid': fb.errors?.['quote.create']?.referenceNumber }" />
                        <Message v-if="fb.errors?.['quote.create']?.referenceNumber" severity="error" size="small"
                            variant="referenceNumber">
                            <span v-for="error in fb.errors?.['quote.create']?.referenceNumber" :key="error"
                                class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>

                    <label class="col-span-12 md:col-span-4 flex items-center text-base">Created By Company</label>
                    <div class="col-span-12 md:col-span-8 py-2">
                        <InputText v-model="quote.quoteDetails.createdByCompany"
                            class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter company" />
                    </div>

                    <label class="col-span-12 md:col-span-4 flex items-center text-base">Dispatch Location</label>
                    <div class="col-span-12 md:col-span-8 py-2">
                        <InputText v-model="quote.quoteDetails.dispatchLocation"
                            class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter location" />
                    </div>

                    <label class="col-span-12 md:col-span-4 flex items-center text-base">Job Title</label>
                    <div class="col-span-12 md:col-span-8 py-2">
                        <InputText v-model="quote.quoteDetails.jobTitle"
                            class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter job title" />
                    </div>

                    <label class="col-span-12 md:col-span-4 flex items-center text-base">Quote Description</label>
                    <div class="col-span-12 md:col-span-8 py-2">
                        <InputText v-model="quote.quoteDetails.quoteDescription"
                            class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter description" />
                    </div>

                    <label class="col-span-12 md:col-span-4 flex items-center text-base">Account Manager</label>
                    <div class="col-span-12 md:col-span-8 py-2">
                        <InputText v-model="quote.quoteDetails.accountManager"
                            class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter account manager" />
                    </div>

                    <label class="col-span-12 md:col-span-4 flex items-center text-base">Project Manager</label>
                    <div class="col-span-12 md:col-span-8 py-2">
                        <InputText v-model="quote.quoteDetails.projectManager"
                            class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter project manager" />
                    </div>

                    <label class="col-span-12 md:col-span-4 flex items-center text-base">Created By</label>
                    <div class="col-span-12 md:col-span-8 py-2">
                        <InputText v-model="quote.quoteDetails.createdBy"
                            class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter creator" />
                    </div>

                    <label class="col-span-12 md:col-span-4 flex items-center text-base">Customer PO</label>
                    <div class="col-span-12 md:col-span-8 py-2">
                        <InputText v-model="quote.quoteDetails.customerPO"
                            class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter customer PO" />
                    </div>

                    <label class="col-span-12 md:col-span-4 flex items-center text-base">Expiry Date</label>
                    <div class="col-span-12 md:col-span-8 py-2">
                        <InputText v-model="quote.quoteDetails.expiryDate"
                            class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter expiry date" />
                    </div>
                </div>
            </div>

            <!-- Customer Details Card -->
            <div class="flex-1 bg-white rounded-lg shadow p-6">
                <h3 class="text-lg font-medium border-b border-gray-200 pb-2 mb-4">Customer Details</h3>
                <div class="grid grid-cols-12 gap-x-6 gap-y-4">
                    <label class="col-span-12 md:col-span-4 flex items-center text-base">Customer</label>
                    <div class="col-span-12 md:col-span-8 py-2">
                        <AutoComplete ref="customerAutocomplete" :suggestions="customerSuggestions"
                            @input="onCustomerInput" @item-select="addCustomer" optionLabel="name"
                            placeholder="Type for autocomplete" class="w-full related-products-autocomplete"
                            inputClass="w-full !rounded-md !border !border-gray-200 !shadow-none !focus:ring-0" />
                    </div>
                    
                    <label class="col-span-12 md:col-span-4 flex items-center text-base">Organisation Code</label>
                    <div class="col-span-12 md:col-span-8 py-2">
                        <InputText v-model="quote.customerDetails.organisationCode"
                            class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter code" :disabled="Boolean(quote.customerDetails?.organisationCode)" />
                    </div>

                    <label class="col-span-12 md:col-span-4 flex items-center text-base">Organisation Name</label>
                    <div class="col-span-12 md:col-span-8 py-2">
                        <InputText v-model="quote.customerDetails.organisationName"
                            class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter name" :disabled="Boolean(quote.customerDetails?.organisationName)" />
                    </div>

                    <label class="col-span-12 md:col-span-4 flex items-center text-base">ZOHO ID</label>
                    <div class="col-span-12 md:col-span-8 py-2">
                        <InputText v-model="quote.customerDetails.zohoId"
                            class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter Zoho ID" :disabled="Boolean(quote.customerDetails?.zohoId)" />
                    </div>

                    <label class="col-span-12 md:col-span-4 flex items-center text-base">Terms</label>
                    <div class="col-span-12 md:col-span-8 py-2">
                        <InputText v-model="quote.customerDetails.terms"
                            class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter terms" :disabled="Boolean(quote.customerDetails?.terms)" />
                    </div>

                    <label class="col-span-12 md:col-span-4 flex items-center text-base">Deposit %</label>
                    <div class="col-span-12 md:col-span-8 py-2">
                        <InputText v-model="quote.customerDetails.deposit"
                            class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter deposit %" :disabled="Boolean(quote.customerDetails?.deposit)" />
                    </div>

                    <label class="col-span-12 md:col-span-4 flex items-center text-base">GST %</label>
                    <div class="col-span-12 md:col-span-8 py-2">
                        <InputText v-model="quote.customerDetails.gst"
                            class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter GST %" :disabled="Boolean(quote.customerDetails?.gst)" />
                    </div>

                    <label class="col-span-12 md:col-span-4 flex items-center text-base">Bill To</label>
                    <div class="col-span-12 md:col-span-8 py-2">
                        <InputText v-model="quote.customerDetails.billTo"
                            class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter bill to" :disabled="Boolean(quote.customerDetails?.billTo)" />
                    </div>

                    <label class="col-span-12 md:col-span-4 flex items-center text-base">Ship To</label>
                    <div class="col-span-12 md:col-span-8 py-2">
                        <InputText v-model="quote.customerDetails.shipTo"
                            class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter ship to" :disabled="Boolean(quote.customerDetails?.shipTo)" />
                    </div>

                    <label class="col-span-12 md:col-span-4 flex items-center text-base">Site Contacts</label>
                    <div class="col-span-12 md:col-span-8 py-2">
                        <InputText v-model="quote.customerDetails.siteContacts"
                            class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter site contacts" :disabled="Boolean(quote.customerDetails?.siteContacts)" />
                    </div>

                    <label class="col-span-12 md:col-span-4 flex items-center text-base">Customer Balance</label>
                    <div class="col-span-12 md:col-span-8 py-2">
                        <InputText v-model="quote.customerDetails.customerBalance"
                            class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter balance" :disabled="Boolean(quote.customerDetails?.customerBalance)" />
                    </div>
                </div>
            </div>

            <!-- Quote Totals Card -->
            <div class="flex-1 bg-white rounded-lg shadow p-6">
                <h3 class="text-lg font-medium border-b border-gray-200 pb-2 mb-4">Quote Totals</h3>
                <div class="grid grid-cols-12 gap-x-6 gap-y-4">
                    <label class="col-span-12 md:col-span-6 flex items-center text-base">Sales Price List</label>
                    <div class="col-span-12 md:col-span-6 py-2">
                        <InputText v-model="quote.quoteTotals.salesPriceList"
                            class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter price list" />
                    </div>

                    <label class="col-span-12 md:col-span-6 flex items-center text-base">Total BP (Ex. GST)</label>
                    <div class="col-span-12 md:col-span-6 py-2">
                        <InputText v-model="quote.quoteTotals.totalBpExGst"
                            class="w-full border border-gray-200 rounded-md p-2"
                            placeholder="Enter total BP (ex. GST)" />
                    </div>

                    <label class="col-span-12 md:col-span-6 flex items-center text-base">Total BP (Inc. GST)</label>
                    <div class="col-span-12 md:col-span-6 py-2">
                        <InputText v-model="quote.quoteTotals.totalBpIncGst"
                            class="w-full border border-gray-200 rounded-md p-2"
                            placeholder="Enter total BP (inc. GST)" />
                    </div>

                    <label class="col-span-12 md:col-span-6 flex items-center text-base">Total SP (Ex. GST)</label>
                    <div class="col-span-12 md:col-span-6 py-2">
                        <InputText v-model="quote.quoteTotals.totalSpExGst"
                            class="w-full border border-gray-200 rounded-md p-2"
                            placeholder="Enter total SP (ex. GST)" />
                    </div>

                    <label class="col-span-12 md:col-span-6 flex items-center text-base">Total SP (Inc. GST)</label>
                    <div class="col-span-12 md:col-span-6 py-2">
                        <InputText v-model="quote.quoteTotals.totalSpIncGst"
                            class="w-full border border-gray-200 rounded-md p-2"
                            placeholder="Enter total SP (inc. GST)" />
                    </div>

                    <label class="col-span-12 md:col-span-6 flex items-center text-base">Order Discount %</label>
                    <div class="col-span-12 md:col-span-6 py-2">
                        <InputText v-model="quote.quoteTotals.orderDiscount"
                            class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter discount %" />
                    </div>

                    <label class="col-span-12 md:col-span-6 flex items-center text-base">Discount Amount</label>
                    <div class="col-span-12 md:col-span-6 py-2">
                        <InputText v-model="quote.quoteTotals.discountAmount"
                            class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter discount amount" />
                    </div>

                    <label class="col-span-12 md:col-span-6 flex items-center text-base">Grand Total SP (Ex.
                        GST)</label>
                    <div class="col-span-12 md:col-span-6 py-2">
                        <InputText v-model="quote.quoteTotals.grandTotalSpExGst"
                            class="w-full border border-gray-200 rounded-md p-2"
                            placeholder="Enter grand total (ex. GST)" />
                    </div>

                    <label class="col-span-12 md:col-span-6 flex items-center text-base">Grand Total SP (Inc.
                        GST)</label>
                    <div class="col-span-12 md:col-span-6 py-2">
                        <InputText v-model="quote.quoteTotals.grandTotalSpIncGst"
                            class="w-full border border-gray-200 rounded-md p-2"
                            placeholder="Enter grand total (inc. GST)" />
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
                        <!-- <i class="pi pi-pencil text-gray-400"></i> -->
                    </div>
                    <div class="grid grid-cols-12 gap-x-6 gap-y-4">
                        <label class="col-span-12 text-base">Instructions</label>
                        <div class="col-span-12 mb-2">
                            <InputText v-model="quote.billingAddress.instructions"
                                class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter instructions" />
                        </div>
                        <label class="col-span-12 text-base">Address</label>
                        <div class="col-span-12 mb-2">
                            <InputText v-model="quote.billingAddress.address"
                                class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter address" />
                        </div>
                        <label class="col-span-12 md:col-span-3 text-base">Suburb</label>
                        <div class="col-span-12 md:col-span-3 mb-2">
                            <InputText v-model="quote.billingAddress.suburb"
                                class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter suburb" />
                        </div>
                        <label class="col-span-12 md:col-span-3 text-base">State</label>
                        <div class="col-span-12 md:col-span-3 mb-2">
                            <InputText v-model="quote.billingAddress.state"
                                class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter state" />
                        </div>
                        <label class="col-span-12 md:col-span-3 text-base">Postcode</label>
                        <div class="col-span-12 md:col-span-3 mb-2">
                            <InputText v-model="quote.billingAddress.postcode"
                                class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter postcode" />
                        </div>
                        <label class="col-span-12 md:col-span-3 text-base">Country</label>
                        <div class="col-span-12 md:col-span-3 mb-2">
                            <InputText v-model="quote.billingAddress.country"
                                class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter country" />
                        </div>
                    </div>
                </div>
                <!-- Shipping Address Card -->
                <div class="flex-1 bg-white rounded-lg shadow p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-medium">Shipping Address</h3>
                        <!-- <i class="pi pi-pencil text-gray-400"></i> -->
                    </div>
                    <div class="grid grid-cols-12 gap-x-6 gap-y-4">
                        <label class="col-span-12 text-base">Building Name</label>
                        <div class="col-span-12 mb-2">
                            <InputText v-model="quote.shippingAddress.buildingName"
                                class="w-full border border-gray-200 rounded-md p-2"
                                placeholder="Enter building name" />
                        </div>
                        <label class="col-span-12 text-base">Instructions</label>
                        <div class="col-span-12 mb-2">
                            <InputText v-model="quote.shippingAddress.instructions"
                                class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter instructions" />
                        </div>
                        <label class="col-span-12 text-base">Address</label>
                        <div class="col-span-12 mb-2">
                            <InputText v-model="quote.shippingAddress.address"
                                class="w-full border border-gray-200 rounded-md p-2" placeholder="Enter address" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Custom styles if needed */
</style>