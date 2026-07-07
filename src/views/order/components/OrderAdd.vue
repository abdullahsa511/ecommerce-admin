
<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useOrderStore } from '@/stores/order';
import { storeToRefs } from 'pinia';

const router = useRouter();
const toast = useToast();
const orderStore = useOrderStore();
const {fb, order} = storeToRefs(orderStore);

const items = ref([
    { route: '/ecommerce/sales/orders/add/overview', label: 'Overview', icon: 'pi pi-file' },
    { route: '/ecommerce/sales/orders/add/items', label: 'Items', icon: 'pi pi-list' },
]);

const currentRoute = computed(() => router.currentRoute.value.path);


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

onMounted(() => {
    orderStore.resetOrder();
});
</script>

<template>
    <div class=" relative">
        <!-- <Button 
                icon="pi pi-save"
                label="Save"
                severity="primary"
                :loading="false"
                @click="onOrderSaved"
                class="p-button-md"
            /> -->
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
            <div class="py-6">
                <router-view :order="order" v-model.order="order" @saved="onOrderSaved"/>
            </div>
        </Tabs>
    </div>
</template>

<style scoped>

</style> 