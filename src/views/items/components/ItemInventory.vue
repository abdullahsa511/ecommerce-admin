<script setup lang="ts">
import { useItemStore } from '@/stores/item';
import { storeToRefs } from 'pinia';
import Item from '@/models/Item';
import { useRoute } from 'vue-router';
import ItemSidebar from './ItemSidebar.vue';

const route = useRoute();
const itemStore = useItemStore();
const {item, fb} = storeToRefs(itemStore);
const emit = defineEmits(['update:item', 'saved']);

const props = defineProps({
  item: {
    type: Item,
    required: true,
    default: () => new Item({})
  }
});

const warrantyPeriodOptions = [
    { label: '1 Year', value: '1' },
    { label: '2 Years', value: '2' },
    { label: '3 Years', value: '3' },
    { label: '4 Years', value: '4' },
    { label: '5 Years', value: '5' },
    { label: '6 Years', value: '6' },
    { label: '7 Years', value: '7' },
    { label: '8 Years', value: '8' },
    { label: '9 Years', value: '9' },
    { label: '10 Years', value: '10' },
]

</script>
<template>
    <div class="flex flex-col xl:flex-row  gap-6">
        <div class="loading-overlay" v-if="fb.loading['item.edit.'+route.params.id]">
            <div class="flex justify-center items-center h-full spinner">
                <i class="pi pi-spin pi-spinner" style="font-size: 2rem;"></i>
                <p class="mt-2">Loading item weight and dimension data. Please wait.</p>
            </div>
        </div>
        <div class="sm:w-full md:w-full lg:w-full xl:w-3/5 space-y-4">
            <div class="flex items-end gap-6 border-b pb-3 mb-6">
                <h2 class="text-xl font-semibold text-gray-700 ">Inventory & Stock Settings</h2>
            </div>

            <div class="grid grid-cols-12 gap-6">
                <div class="col-span-12 ">
                    <label class="block text-sm font-medium text-gray-600 mb-1">Warranty Period</label>
                    <Select v-model="item.warranty_period" :options="warrantyPeriodOptions" optionLabel="label" optionValue="value" 
                            placeholder="Select warranty period"
                            class="w-full" />
                </div>
                <div class="col-span-12 ">
                    <label class="block text-sm font-medium text-gray-600 mb-1">Safety Stock</label>
                    <InputNumber v-model="item.safety_stock" placeholder="Enter safety stock"
                        class="w-full" />
                </div>
                <div class="col-span-12 ">
                    <label class="block text-sm font-medium text-gray-600 mb-1">Lead Days</label>
                    <InputNumber v-model="item.lead_days" placeholder="Enter lead days"
                        class="w-full" />
                </div>
                <div class="col-span-12 ">
                    <label class="block text-sm font-medium text-gray-600 mb-1">Melbourne Lead Days</label>
                    <InputNumber v-model="item.melbourne_lead_days" placeholder="Enter Melbourne lead days"
                        class="w-full" />
                </div>
                <div class="col-span-12 ">
                    <label class="block text-sm font-medium text-gray-600 mb-1">Brisbane Lead Days</label>
                    <InputNumber v-model="item.brisbane_lead_days" placeholder="Enter Brisbane lead days"
                        class="w-full" />
                </div>
                <div class="col-span-12 ">
                    <label class="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
                    <InputText v-model="item.phone_number" placeholder="Enter phone number"
                        class="w-full" />
                </div>
            </div>
        </div>
         <!-- Right column -->
         <ItemSidebar :item="item" />
    </div>
</template>