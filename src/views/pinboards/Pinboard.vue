<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { usePinboardStore } from '@/stores/pinboard.js';
import { storeToRefs } from 'pinia';
import { Pinboard } from "@/models/Pinboard.ts";

const router = useRouter();
const toast = useToast();
const pinboardStore = usePinboardStore();
const {fb} = storeToRefs(pinboardStore);

const items = ref([
    { route: '/pinboards/list', label: 'Pinboard List', icon: 'pi pi-file' },
    { route: '/pinboards/overview', label: 'Overview', icon: 'pi pi-file' },
    // { route: '/pinboards/edit', label: 'Pinboard Edit', icon: 'pi pi-file' },
    // { route: '/pinboards/items', label: 'Pinboard Items', icon: 'pi pi-list' },
    { route: '/pinboards/import', label: 'Import', icon: 'pi pi-upload' },
    { route: '/pinboards/temporary-pinboards', label: 'Temporary Pinboards', icon: 'pi pi-list' },
    
]);

const currentRoute = computed(() => router.currentRoute.value.path);

const pinboard = ref(new Pinboard());
// const pinboard = ref(new Pinboard({
//     pinboardDetails: {
//         referenceNumber: "PB-2024-001",
//         createdByCompany: "Krost Furniture",
//         dispatchLocation: "Sydney Warehouse",
//         jobTitle: "Office Furniture Supply",
//         pinboardDescription: "Complete office furniture package for new office space",
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
//     pinboardTotals: {
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
//         address: "456 Tech Park Road",
//         suburb: "Sydney",
//         state: "NSW",
//         postcode: "2000",
//         country: "Australia"
//     }
// }));

const onPinboardSaved = async () => {
    console.log("you hit with pinboard", pinboard.value.items);
    try {
        const response = await pinboardStore.createPinboard(pinboard.value);
        console.log("Server response:", response);
        pinboard.value = response;
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Pinboard created successfully',
            life: 3000
        });
        // Redirect to pinboard detail page using the correct ID from response
        console.log("Pinboard ID:", response.pinboard_id);
        if (response && response.pinboard_id) {
            router.push(`/pinboards/${response.pinboard_id}/overview`);
        } else {
            console.error("No pinboard ID in response:", response);
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to get pinboard ID from response',
                life: 3000
            });
        }
    } catch (error: any) {
        console.error("Error saving pinboard:", error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message || 'Failed to save pinboard',
            life: 3000
        });
    }
};


const refreshTabs = () => {
  const routeId = router.currentRoute.value.params.id;

  if (routeId) {
    const editRoute = `/pinboards/${routeId}/overview`;
    if (!items.value.some(item => item.route === editRoute)) {
      items.value.push({ route: editRoute, label: 'Edit', icon: 'pi pi-list' });
    }
    const itemRoute = `/pinboards/item/${routeId}`;
    if (!items.value.some(item => item.route === itemRoute)) {
      items.value.push({ route: itemRoute, label: 'Item', icon: 'pi pi-list' });
    }
  } else {
    items.value = items.value.filter(
      item => 
        !item.route.includes('/overview') && 
        !item.route.includes('/item')
    );
  }
};

refreshTabs();

</script>
<template>
    <div class="card relative">
        <Button 
                icon="pi pi-save"
                label="Save"
                severity="primary"
                :loading="false"
                @click="onPinboardSaved"
                class="p-button-md"
            />
        <Button 
                icon="pi pi-plus"
                label="Create Lead"
                severity="primary"
                :loading="false"
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
                <router-view  @editTabUnmunted="refreshTabs" :pinboard="pinboard" v-model.pinboard="pinboard" @saved="onPinboardSaved"/>
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