<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useVendorStore } from '@/stores/vendor';

const vendorStore = useVendorStore();
const { vendor, fb } = storeToRefs(vendorStore);

const emit = defineEmits(['update:vendor', 'saved']);
onMounted(async () => {
    vendorStore.resetVendor(); //reset form for add.
});
</script>

<template>
    <div class="flex flex-col gap-6">
        <div class="loading-overlay border-2" v-if="fb.loading['vendor.create']">
            <div class="flex justify-center items-center h-full spinner">
                <i class="pi pi-spin pi-spinner" style="font-size: 2rem;"></i>
                <p class="mt-2">Loading vendor add details. Please wait.</p>
            </div>
        </div>
        <div class="flex flex-col md:flex-row gap-6">
            <!-- Left column: Vendor Form -->
            <div class="sm:w-full md:w-3/5 space-y-4">
                <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Add Vendor</h3>

                <div class="grid grid-cols-12 gap-x-6 gap-y-4">
                    <!-- Vendor Code -->
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">
                        Code
                    </label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <InputText v-model="vendor.vendor_code" class="w-full text-lg border border-gray-200 rounded-md p-2"
                            placeholder="Enter vendor code" :class="{'p-invalid': fb.errors?.['vendor.create']?.vendor_code}"/>
                            <Message v-if="fb.errors?.['vendor.create']?.vendor_code" severity="error" size="small" variant="title">
                                <span v-for="error in fb.errors?.['vendor.create']?.vendor_code" :key="error" class="flex flex-col">
                                    {{ error }}
                                </span>
                            </Message>
                    </div>
                  
                    <!-- Name -->
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Name</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <InputText v-model="vendor.name" class="w-full text-lg border border-gray-200 rounded-md p-2"
                            placeholder="Enter vendor name" :class="{'p-invalid': fb.errors?.['vendor.create']?.name}"/>
                            <Message v-if="fb.errors?.['vendor.create']?.name" severity="error" size="small" variant="title">
                                <span v-for="error in fb.errors?.['vendor.create']?.name" :key="error" class="flex flex-col">
                                    {{ error }}
                                </span>
                            </Message>
                    </div>
                    <!-- Sort Order -->
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Sort Order</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <InputNumber v-model="vendor.sort_order" class="w-full text-lg border border-gray-200 rounded-md p-2"
                            placeholder="Enter vendor sort order"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
