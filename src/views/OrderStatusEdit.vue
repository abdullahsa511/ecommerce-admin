<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useOrderStatusStore } from '../stores/orderStatus';
import { storeToRefs } from 'pinia';
import OrderStatus from '../models/OrderStatus';
import { useLanguageStore } from '../stores/language';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const router = useRouter();
const route = useRoute();
const orderStatusStore = useOrderStatusStore();
const languageStore = useLanguageStore();
const orderStatus = ref(new OrderStatus());
const {languages} = storeToRefs(languageStore);
const {fb} = storeToRefs(orderStatusStore);

const orderStatusId = route.params.id;

const isLoading = computed(() => {
    return fb.value.loading === true;
});

const goToOrderStatusList = () => {
    router.push('/configuration/settings/order-statuses');
};

onMounted(async () => {
    try {
        languageStore.fetchLanguages();
        const fetchedOrderStatus = await orderStatusStore.findOrderStatusById(orderStatusId);
        orderStatus.value = new OrderStatus(fetchedOrderStatus);
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load order status details. Please try again.',
            life: 3000
        });
        goToOrderStatusList();
    }
});

const updateOrderStatus = async () => {
    try {
        await orderStatusStore.updateOrderStatus(orderStatusId, orderStatus.value);
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Order status updated successfully',
            life: 3000
        });
        goToOrderStatusList();
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update order status. Please try again.',
            life: 3000
        });
    }
};


</script>

<template>
    <div class="flex justify-end gap-2 mb-6">
        <Button 
            icon="pi pi-arrow-left"
            label="Order Status List"
            severity="secondary"
            @click="goToOrderStatusList"
            class="p-button-md"
        />
        <Button 
            icon="pi pi-save"
            label="Save"
            severity="primary"
            @click="updateOrderStatus"
            class="p-button-md"
        />
    </div>
    <Fluid class="flex flex-col md:flex-row gap-8 mb-20 border-t pt-6">
        <div class="w-full mt-3">
            <div class="flex flex-col gap-6">
                <div class="grid grid-cols-12 gap-2">
                    <label for="name" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Name</label>
                    <div class="col-span-12 md:col-span-10">
                        <IconField>
                            <InputText 
                            v-model="orderStatus.name" 
                            variant="filled"  
                            class="text-lg" 
                            placeholder="loading..."
                            id="name" />
                            <InputIcon v-if="fb.loading.orderStatus" class="pi pi-spin pi-spinner" />
                        </IconField>
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="name" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Name</label>
                    <div class="col-span-12 md:col-span-10">
                        <Select v-model="orderStatus.language_id" :options="languages" optionLabel="name" optionValue="language_id" placeholder="Select a Language" class="w-full md:w-56 text-lg" />
                    </div>
                </div>
            </div>
        </div>
    </Fluid>
</template>

<style scoped>
label {
    font-size: 1.2rem;
}
:deep(input::placeholder),
:deep(textarea::placeholder) {
    color: #767779 !important;
    opacity: 1;
    font-size: 1.2rem;
}
</style> 