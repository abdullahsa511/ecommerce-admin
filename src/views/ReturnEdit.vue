<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();

const goToReturnList = () => {
    router.push('/ecommerce/sales/returns');
};

const saveReturn = async () => {
    console.log("Saving Data...");
};

const returnReasonOptions = ref([
    { name: 'Ordered wrong product or size', value: 'wrong_product_size' },
    { name: 'Defective item', value: 'defective' },
    { name: 'Not as described', value: 'not_as_described' },
    { name: 'Changed mind', value: 'changed_mind' }
]);

const returnStatusOptions = ref([
    { name: 'Pending', value: 'pending' },
    { name: 'Processing', value: 'processing' },
    { name: 'Completed', value: 'completed' },
    { name: 'Cancelled', value: 'cancelled' }
]);

const returnResolutionOptions = ref([
    { name: 'Pending', value: 'pending' },
    { name: 'Refund', value: 'refund' },
    { name: 'Exchange', value: 'exchange' },
    { name: 'Rejected', value: 'rejected' }
]);

// Default selected values
const selectedReason = ref(returnReasonOptions.value[0].value);
const selectedStatus = ref(returnStatusOptions.value[0].value);
const selectedResolution = ref(returnResolutionOptions.value[0].value);
</script>

<template>
    <div class="flex justify-end gap-2 mb-6">
        <Button 
            icon="pi pi-arrow-left"
            label="Return to List"
            severity="secondary"
            @click="goToReturnList"
            class="p-button-md"
        />
        <Button 
            icon="pi pi-save"
            label="Save"
            severity="primary"
            @click="saveReturn"
            class="p-button-md"
        />
    </div>
    <Fluid class="flex flex-col md:flex-row gap-8 mb-20">
        <div class="w-full">
            <div class="flex flex-col gap-6">
                <!-- Order Information -->
                <div class="flex flex-col gap-6">
                    <div class="grid grid-cols-12 gap-2">
                        <label class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Customer order id</label>
                        <div class="col-span-12 md:col-span-10">
                            <InputText class="text-lg w-full" placeholder="Customer order id" />
                        </div>
                    </div>

                    <div class="grid grid-cols-12 gap-2">
                        <label class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Order id</label>
                        <div class="col-span-12 md:col-span-10">
                            <InputText class="text-lg w-full" placeholder="Order id" />
                        </div>
                    </div>

                    <!-- Customer Information -->
                    <div class="grid grid-cols-12 gap-2">
                        <label class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">First name</label>
                        <div class="col-span-12 md:col-span-10">
                            <InputText class="text-lg w-full" placeholder="First name" />
                        </div>
                    </div>

                    <div class="grid grid-cols-12 gap-2">
                        <label class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Last name</label>
                        <div class="col-span-12 md:col-span-10">
                            <InputText class="text-lg w-full" placeholder="Last name" />
                        </div>
                    </div>

                    <div class="grid grid-cols-12 gap-2">
                        <label class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Email</label>
                        <div class="col-span-12 md:col-span-10">
                            <InputText class="text-lg w-full" placeholder="Email" type="email" />
                        </div>
                    </div>

                    <div class="grid grid-cols-12 gap-2">
                        <label class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Phone number</label>
                        <div class="col-span-12 md:col-span-10">
                            <InputText class="text-lg w-full" placeholder="Phone number" />
                        </div>
                    </div>

                    <!-- Product Information -->
                    <div class="grid grid-cols-12 gap-2">
                        <label class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Product</label>
                        <div class="col-span-12 md:col-span-10">
                            <InputText class="text-lg w-full" placeholder="Product code" />
                        </div>
                    </div>

                    <div class="grid grid-cols-12 gap-2">
                        <label class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Model</label>
                        <div class="col-span-12 md:col-span-10">
                            <InputText class="text-lg w-full" placeholder="Model code" />
                        </div>
                    </div>

                    <div class="grid grid-cols-12 gap-2">
                        <label class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Quantity</label>
                        <div class="col-span-12 md:col-span-10">
                            <InputNumber class="text-lg w-full" placeholder="Quantity" />
                        </div>
                    </div>

                    <div class="grid grid-cols-12 gap-2">
                        <label class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Opened</label>
                        <div class="col-span-12 md:col-span-10">
                            <Checkbox :binary="true" />
                        </div>
                    </div>

                    <!-- Return Information -->
                    <div class="grid grid-cols-12 gap-2">
                        <label class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Return reason</label>
                        <div class="col-span-12 md:col-span-10">
                            <Dropdown 
                                v-model="selectedReason"
                                class="text-lg w-full" 
                                :options="returnReasonOptions" 
                                optionLabel="name" 
                                optionValue="value" 
                                placeholder="Select return reason"
                            />
                        </div>
                    </div>

                    <div class="grid grid-cols-12 gap-2">
                        <label class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Return resolution</label>
                        <div class="col-span-12 md:col-span-10">
                            <Dropdown 
                                v-model="selectedResolution"
                                class="text-lg w-full" 
                                :options="returnResolutionOptions" 
                                optionLabel="name" 
                                optionValue="value" 
                                placeholder="Select return resolution"
                            />
                        </div>
                    </div>

                    <div class="grid grid-cols-12 gap-2">
                        <label class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Return status</label>
                        <div class="col-span-12 md:col-span-10">
                            <Dropdown 
                                v-model="selectedStatus"
                                class="text-lg w-full" 
                                :options="returnStatusOptions" 
                                optionLabel="name" 
                                optionValue="value" 
                                placeholder="Select return status"
                            />
                        </div>
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