<script setup lang="ts">
import ItemSidebar from './ItemSidebar.vue';
import Item from '@/models/Item.ts';
import { useItemStore } from '@/stores/item';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';

const route = useRoute();
const itemStore = useItemStore();
const {fb} = storeToRefs(itemStore);
const emit = defineEmits(['update:item', 'saved']);

const props = defineProps({
  item: {
    type: Item,
    required: true,
    default: () => new Item({})
  }
});

</script>
<template>
    <!-- Local Tab -->
    <div class="flex flex-col gap-6">
        <div class="loading-overlay" v-if="fb.loading['item.edit.'+route.params.id]">
            <div class="flex justify-center items-center h-full spinner">
                <i class="pi pi-spin pi-spinner" style="font-size: 2rem;"></i>
                <p class="mt-2">Loading item weight and dimension data. Please wait.</p>
            </div>
        </div>
        <div class="flex flex-col xl:flex-row  gap-6" v-if="!fb.loading['item.show']">
            <!-- Left column -->
            <div class="sm:w-full md:w-full lg:w-full xl:w-3/5 space-y-4">
                <h2 class="text-xl font-semibold text-gray-700 border-b pb-3 mb-6">Shipping & Dimensions</h2>

                <div class="grid grid-cols-12 gap-6">
                    <div class="col-span-12 ">
                        <label class="block text-sm font-medium text-gray-600 mb-1">Width</label>
                        <InputNumber v-model="item.width" placeholder="Enter width"
                            class="w-full" />
                    </div>
                    <div class="col-span-12 ">
                        <label class="block text-sm font-medium text-gray-600 mb-1">Height</label>
                        <InputNumber v-model="item.height" placeholder="Enter product height"
                            class="w-full" />
                    </div>
                    <div class="col-span-12 ">
                        <label class="block text-sm font-medium text-gray-600 mb-1">Depth</label>
                        <InputNumber v-model="item.depth" placeholder="Enter depth"
                            class="w-full" />
                    </div>
                    <!-- display dimensions -->

                    <div class="col-span-12 ">
                        <label class="block text-sm font-medium text-gray-600 mb-1">Display Width</label>
                        <InputText v-model="item.display_width" placeholder="Enter display width"
                            class="w-full" />
                    </div>
                    <div class="col-span-12 ">
                        <label class="block text-sm font-medium text-gray-600 mb-1">Display Height</label>
                        <InputText v-model="item.display_height" placeholder="Enter display height"
                            class="w-full" />
                    </div>
                    <div class="col-span-12 ">
                        <label class="block text-sm font-medium text-gray-600 mb-1">Display Depth</label>
                        <InputText v-model="item.display_depth" placeholder="Enter display depth"
                            class="w-full" />
                    </div>

                    <!-- edit display dimensions -->
                    <div class="col-span-12 ">
                        <label class="block text-sm font-medium text-gray-600 mb-1">Carton Width</label>
                        <InputNumber v-model="item.carton_width" placeholder="Enter carton width"
                            class="w-full" />
                    </div>
                    <div class="col-span-12 ">
                        <label class="block text-sm font-medium text-gray-600 mb-1">Carton Height</label>
                        <InputNumber v-model="item.carton_height" placeholder="Enter carton height"
                            class="w-full" />
                    </div>
                    <div class="col-span-12 ">
                        <label class="block text-sm font-medium text-gray-600 mb-1">Carton Depth</label>
                        <InputNumber v-model="item.carton_depth" placeholder="Enter carton depth"
                            class="w-full" />
                    </div>
                    <div class="col-span-12 ">
                        <label class="block text-sm font-medium text-gray-600 mb-1">Carton QM</label>
                        <InputNumber v-model="item.carton_qm" placeholder="Enter carton QM"
                            class="w-full" />
                    </div>
                    <div class="col-span-12 ">
                        <label class="block text-sm font-medium text-gray-600 mb-1">Gross Weight</label>
                        <InputNumber v-model="item.gross_weight" placeholder="Enter gross weight"
                            class="w-full" />
                    </div>
                    <div class="col-span-12 ">
                        <label class="block text-sm font-medium text-gray-600 mb-1">Products Per Carton</label>
                        <InputNumber v-model="item.products_per_cartoon" placeholder="Enter products per carton"
                            class="w-full" />
                    </div>
                    <div class="col-span-12 ">
                        <label class="block text-sm font-medium text-gray-600 mb-1">Delay Until</label>
                        <DatePicker v-model="item.delay_until" placeholder="Enter delay date"
                            class="w-full" />
                    </div>
                    <div class="col-span-12 ">
                        <label class="block text-sm font-medium text-gray-600 mb-1">Delay Until Reason</label>
                        <InputText v-model="item.delay_until_reason" placeholder="Enter reason"
                            class="w-full" />
                    </div>
                </div>
            </div>
            <!-- Right column -->
            <ItemSidebar :item="item" />
        </div>
    </div> 
</template>