<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from 'vue-router';
import { Order } from '@/models/Order.ts';
import { useOrderStore } from '@/stores/order';
import { useOrderItemStore } from '@/stores/orderItem.js';
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue/usetoast';

const router = useRouter();
const orderStore = useOrderStore();
const orderItemStore = useOrderItemStore();
const {fb} = storeToRefs(orderStore);
const toast = useToast();

const props = defineProps({
    id: {
        type: String,
        required: true
    }
});

const items = ref([
    { route: `/orders/${props.id}/overview`, label: 'Overview', icon: 'pi pi-home' },
    { route: `/orders/${props.id}/items`, label: 'Items', icon: 'pi pi-link' }
]);

const currentRoute = computed(() => {
    return router.currentRoute.value.path;
});

const order = ref<Order>();

const isSaving = ref(false);

const onOrderItemSaved = async () => {
    try {
        if (order.value?.order_id) {
            // await orderStore.updateOrder(order.value);
            if(order.value.items.length > 0) {
                const response = await orderItemStore.createOrderItem(order.value.items);
                console.log("Server response:", response);
                // Don't overwrite order with OrderItem - keep it as Order
                // order.value = response; // This was causing the type error
                toast.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Order Item created successfully',
                    life: 3000
                });
            }
            else {
                await orderStore.updateOrder(order.value);
                toast.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Order updated successfully',
                    life: 3000
                });

            }
        }
    } catch (error: any) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message || 'Failed to save Order',
            life: 3000
        });
    } finally {
        isSaving.value = false;
    }
}

onMounted(async () => {
    order.value = await orderStore.fetchOrderById(props.id);
})
</script>

<template>
    <div class="card relative">
        <Button 
            :icon="fb.loading['order.update'] ? 'pi pi-spin pi-spinner' : 'pi pi-save'"
            label="Save"
            severity="primary"
            :loading="fb.loading['order.update']"
            :disabled="fb.loading['order.update']"
            @click="onOrderItemSaved"
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
                <router-view :order="order" v-model.order="order" @saved="onOrderItemSaved"/>
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