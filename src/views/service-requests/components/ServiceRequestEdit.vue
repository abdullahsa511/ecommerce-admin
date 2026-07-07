<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import { storeToRefs } from 'pinia';
import { useServiceRequestStore } from '@/stores/serviceRequest';

const emit = defineEmits(['saved', 'editTabUnmunted', 'editTabMounted']);
const route = useRoute();
const serviceRequestStore = useServiceRequestStore();
const { serviceRequest, fb } = storeToRefs(serviceRequestStore);

const formTypeOptions = [
    { label: 'Contact Sales', value: 'contact-sales' },
    { label: 'Catalogue', value: 'catalogue' }
];

const resolveId = () => serviceRequest.value.service_request_id;

onMounted(async () => {
    emit('editTabMounted');
    if (route.params.id) {
        await serviceRequestStore.getServiceRequestById(route.params.id as string);
    }
});

onUnmounted(() => {
    emit('editTabUnmunted');
});
</script>

<template>
    <div class="flex flex-col gap-6">
        <div class="sm:w-full md:w-3/5 space-y-4">
            <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Edit Service Request</h3>

            <div class="grid grid-cols-12 gap-x-6 gap-y-4">
                <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Customer</label>
                <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                    <InputText :model-value="serviceRequest.customer_name" class="w-full text-lg" readonly />
                </div>

                <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Email</label>
                <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                    <InputText v-model="serviceRequest.email" class="w-full text-lg" />
                </div>

                <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Phone</label>
                <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                    <InputText v-model="serviceRequest.phone_number" class="w-full text-lg" />
                </div>

                <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Company</label>
                <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                    <InputText v-model="serviceRequest.company" class="w-full text-lg" />
                </div>

                <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Form Type</label>
                <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                    <Select
                        v-model="serviceRequest.form_type"
                        class="w-full text-lg"
                        :options="formTypeOptions"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Select form type"
                    />
                </div>

                <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Message</label>
                <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                    <Textarea v-model="serviceRequest.content" rows="5" class="w-full text-lg" autoResize />
                </div>

                <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Source Of Enquiry</label>
                <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                    <InputText v-model="serviceRequest.source_of_enquiry" class="w-full text-lg" />
                </div>
            </div>
        </div>

        <div class="loading-overlay" v-if="fb.loading['serviceRequest.update.' + resolveId()]">
            <div class="flex justify-center items-center h-full spinner">
                <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
                <p class="mt-2">Loading service request details. Please wait.</p>
            </div>
        </div>
    </div>
</template>
