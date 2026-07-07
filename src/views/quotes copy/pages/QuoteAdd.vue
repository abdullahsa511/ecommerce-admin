<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { storeToRefs } from 'pinia';
import { useQuoteStore } from "@/stores/quote";

const router = useRouter();
const toast = useToast();
const quoteStore = useQuoteStore();
const {quote,fb} = storeToRefs(quoteStore);

const items = ref([
    { route: '/quotes/add/overview', label: 'Overview', icon: 'pi pi-file' },
    { route: '/quotes/add/items', label: 'Items', icon: 'pi pi-list' },
]);

const currentRoute = computed(() => router.currentRoute.value.path);

// const quote = ref(new Quote({
//     quoteDetails: {
//         referenceNumber: "QT-2024-001",
//         createdByCompany: "Krost Furniture",
//         dispatchLocation: "Sydney Warehouse",
//         jobTitle: "Office Furniture Supply",
//         quoteDescription: "Complete office furniture package for new office space",
//         accountManager: "John Smith",
//         projectManager: "Sarah Johnson",
//         createdBy: "Admin User",
//         customerPO: "PO-2024-123",
//         expiryDate: "2024-12-31"
//     },
//     customerDetails: {
//         organisationCode: "CUST-001",
//         organisationName: "Tech Solutions Pty Ltd",
//         zohoId: "ZOHO-12345",
//         terms: "Net 30",
//         deposit: "30",
//         gst: "10",
//         billTo: "Head Office",
//         shipTo: "New Office Location",
//         siteContacts: "Michael Brown (0400 123 456)",
//         customerBalance: "0.00"
//     },
//     quoteTotals: {
//         salesPriceList: "Standard 2024",
//         totalBpExGst: "15000.00",
//         totalBpIncGst: "16500.00",
//         totalSpExGst: "20000.00",
//         totalSpIncGst: "22000.00",
//         orderDiscount: "10",
//         discountAmount: "2000.00",
//         grandTotalSpExGst: "18000.00",
//         grandTotalSpIncGst: "19800.00"
//     },
//     billingAddress: {
//         instructions: "Please include PO number on invoice",
//         address: "123 Business Street",
//         suburb: "Sydney CBD",
//         state: "NSW",
//         postcode: "2000",
//         country: "Australia"
//     },
//     shippingAddress: {
//         buildingName: "Tech Solutions Tower",
//         instructions: "Deliver to loading dock",
//         address: "456 Tech Park Road, Sydney NSW 2000"
//     }
// }));

const onQuoteSaved = async () => {
    console.log("you hit with quote", quote.value.items);
    try {
        const response = await quoteStore.createQuote(quote.value);
        console.log("Server response:", response);
        quote.value = response;
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Quote created successfully',
            life: 3000
        });
        // Redirect to quote detail page using the correct ID from response
        console.log("Quote ID:", response.quote_id);
        if (response && response.quote_id) {
            router.push(`/quotes/${response.quote_id}/overview`);
        } else {
            console.error("No quote ID in response:", response);
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to get quote ID from response',
                life: 3000
            });
        }
    } catch (error: any) {
        console.error("Error saving quote:", error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message || 'Failed to save quote',
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
                @click="onQuoteSaved"
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
                <router-view :quote="quote" v-model.quote="quote" @saved="onQuoteSaved"/>
            </div>
        </Tabs>
    </div>
</template>

<style scoped>
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