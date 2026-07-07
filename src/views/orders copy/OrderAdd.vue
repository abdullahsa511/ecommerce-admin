<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useOrderStore } from '@/stores/order';
import { storeToRefs } from 'pinia';
import { Order } from "@/models/Order.ts";

const router = useRouter();
const toast = useToast();
const orderStore = useOrderStore();
const {fb} = storeToRefs(orderStore);

const items = ref([
    { route: '/orders/add/overview', label: 'Overview', icon: 'pi pi-file' },
    { route: '/orders/add/items', label: 'Items', icon: 'pi pi-list' },
]);

const currentRoute = computed(() => router.currentRoute.value.path);

const order = ref(new Order({
    orderDetails: {
        invoice_no: "INV-2024-001",
        customer_order_id: "CUST-ORD-2024-001",
        invoice_prefix: "INV",
        site_id: "1",
        site_name: "Main Store",
        total: "1500.00",
        order_status_id: "1",
        language_id: "1",
        currency_id: "1",
        currency: "AUD",
        currency_value: "1.00",
        notes: "Initial order for office furniture",
        remote_ip: "192.168.1.1",
        forwarded_for_ip: "192.168.1.1",
        user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    },
    customerDetails: {
        user_id: "1",
        user_group_id: "2",
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@example.com",
        phone_number: "+61 400 123 456",
        total_orders: "5"
    },
    billingDetails: {
        billing_first_name: "John",
        billing_last_name: "Doe",
        billing_company: "Tech Solutions Pty Ltd",
        billing_address_1: "123 Business Street",
        billing_address_2: "Level 5",
        billing_city: "Sydney",
        billing_post_code: "2000",
        billing_country_id: "13",
        billing_region: "New South Wales",
        billing_region_id: "1",
        payment_method: "Credit Card",
        payment_data: "Visa ending in 1234",
        payment_status_id: "1"
    },
    shippingDetails: {
        shipping_first_name: "John",
        shipping_last_name: "Doe",
        shipping_company: "Tech Solutions Pty Ltd",
        shipping_address_1: "123 Business Street",
        shipping_address_2: "Level 5",
        shipping_city: "Sydney",
        shipping_post_code: "2000",
        shipping_country: "Australia",
        shipping_country_id: "13",
        shipping_region: "New South Wales",
        shipping_region_id: "1",
        shipping_method: "Standard Delivery",
        shipping_data: "Tracking: STD-2024-001",
        shipping_status_id: "1"
    }
}));

const onOrderSaved = async () => {
    console.log("you hit with order", order.value);
    try {
        const savedOrder = await orderStore.createOrder(order.value);
        console.log("Server response:", savedOrder);
        order.value = savedOrder;
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Order created successfully',
            life: 3000
        });
        // Redirect to order detail page using the correct ID from response
        console.log("Order ID:", savedOrder.order_id);
        if (savedOrder && savedOrder.order_id) {
            router.push(`/orders/${savedOrder.order_id}/overview`);
        } else {
            console.error("No order ID in response:", savedOrder);
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to get order ID from response',
                life: 3000
            });
        }
    } catch (error: any) {
        console.error("Error saving order:", error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message || 'Failed to save order',
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
                @click="onOrderSaved"
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
                <router-view :order="order" v-model.order="order" @saved="onOrderSaved"/>
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