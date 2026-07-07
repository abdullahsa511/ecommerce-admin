<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { usePaymentStatusStore } from '@/stores/paymentStatus';
import { storeToRefs } from 'pinia';
import PaymentStatus from '@/models/PaymentStatus';
import { useToast } from 'primevue/usetoast';

const emit = defineEmits(['update:paymentStatus', 'saved', 'editTabUnmunted', 'editTabMounted']);

const toast = useToast();
const route = useRoute();
const router = useRouter();
const paymentStatusStore = usePaymentStatusStore();
const { fb, paymentStatus: status} = storeToRefs(paymentStatusStore);

const props = defineProps(['id']);


const isLoading = computed(() => {
    return fb.value.loading === true;
});

onMounted(async () => {
    try {
        await paymentStatusStore.findPaymentStatusById(props.id);
        emit('editTabMounted');
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load payment status details. Please try again.',
            life: 3000
        });
        goToPaymentStatusList();
    }
});

onUnmounted(() => {
    emit('editTabUnmunted');
});
</script>

<template>

    <div class="loading-overlay" v-if="fb.loading['paymentStatus.edit.' + (props.id ?? (route.params.id))]">
        <div class="flex justify-center items-center h-full spinner">
            <i class="pi pi-spin pi-spinner" style="font-size: 2rem;"></i>
            <p class="mt-2">Loading payment status details. Please wait.</p>
        </div>
    </div>


    <Fluid class="flex flex-col md:flex-row gap-8 mb-20">
        <div class="w-3/5 mt-3">
            <div class="flex flex-col gap-6">
                <h3 class="text-lg font-medium border-b border-gray-200 pb-2">
                    Payment Status Details
                </h3>
                <div class="grid grid-cols-12 gap-2">
                    <label for="name" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Name</label>
                    <div class="col-span-12 md:col-span-10">
                        <IconField>
                            <InputText 
                            v-model="status.name" 
                            variant="filled"  
                            class="text-lg" 
                            placeholder="Name"
                            id="name" :class="{'p-invalid': fb.errors['paymentStatus.update.' + (props.id ?? (route.params.id))]?.name}" />
                            <Message v-if="fb.errors['paymentStatus.update.' + (props.id ?? (route.params.id))]?.name" severity="error" size="small" variant="title">
                                <span v-for="error in fb.errors['paymentStatus.update.' + (props.id ?? (route.params.id))]?.name" :key="error" class="flex flex-col">
                                    {{ error }}
                                </span>
                            </Message>
                            <InputIcon v-if="fb.loading['paymentStatus.update']" class="pi pi-spin pi-spinner" />
                        </IconField>
                    </div>
                </div>

            </div>
        </div>
           <!-- Right column: Preview Sidebar -->
        <div class="w-2/5" v-if="status?.payment_status_id ">
            <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Preview Payment Status</h3>
            <div class="border border-gray-200 rounded-md p-4">
                <p><strong>Name:</strong> {{ status?.name }}</p>
            </div>
            <div v-if="fb.errors['paymentStatus.update']" class="mt-4">
                <h3 class="text-lg font-medium border-b border-gray-200 pb-2">
                    Errors
                </h3>
                <div v-html="fb.renderErrors('paymentStatus.update')" class="border border-red-300 bg-red-50 text-red-700 rounded-md p-3"></div>
            </div>
        </div>
    </Fluid>
</template>

<style scoped>
</style>
