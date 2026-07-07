<script setup lang="ts">
import ItemSidebar from './ItemSidebar.vue';
import Item from '@/models/Item.ts';
import { useItemStore } from '@/stores/item';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';

const route = useRoute();
const itemStore = useItemStore();
const {fb} = storeToRefs(itemStore);
// Provide a `product` alias for templates copied from product components
// so existing `product.*` bindings resolve to the item object.
// const product = item;
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
                <p class="mt-2">Loading item invoice and billing data. Please wait.</p>
            </div>
        </div>
        <div class="flex gap-6" v-if="!fb.loading['item.show']">
            <!-- Left column -->
            <div class="w-3/4 space-y-6">
                <!-- Stock Section -->
                <div class="bg-white rounded-2xl p-4">
                    <h2 class="text-xl font-semibold text-gray-700 border-b pb-3 mb-6">Accounting & Discount</h2>

                    <div class="grid grid-cols-12 gap-6">
                        <div class="col-span-12 ">
                            <label class="block text-sm font-medium text-gray-600 mb-1">Krost Zoho ID</label>
                            <InputText v-model="item.krost_zoho_id" placeholder="Enter Zoho ID"
                                class="w-full" />
                        </div>
                        <div class="col-span-12 ">
                            <label class="block text-sm font-medium text-gray-600 mb-1">Krost QLD Zoho ID</label>
                            <InputText v-model="item.krost_qld_zoho_id" placeholder="Enter QLD Zoho ID"
                                class="w-full" />
                        </div>
                        <div class="col-span-12 ">
                            <label class="block text-sm font-medium text-gray-600 mb-1">Meloz Zoho ID</label>
                            <InputText v-model="item.meloz_zoho_id" placeholder="Enter Meloz Zoho ID"
                                class="w-full" />
                        </div>
                        <div class="col-span-12 ">
                            <label class="block text-sm font-medium text-gray-600 mb-1">Gregbar Zoho ID</label>
                            <InputText v-model="item.gregbar_zoho_id" placeholder="Enter Gregbar Zoho ID"
                                class="w-full" />
                        </div>
                        <div class="col-span-12 ">
                            <label class="block text-sm font-medium text-gray-600 mb-1">Klein Zoho ID</label>
                            <InputText v-model="item.klein_zoho_id" placeholder="Enter Klein Zoho ID"
                                class="w-full" />
                        </div>
                        <div class="col-span-12 ">
                            <label class="block text-sm font-medium text-gray-600 mb-1">Project Price Qty</label>
                            <InputNumber v-model="item.project_price_qty" placeholder="Enter project price qty"
                                class="w-full" />
                        </div>
                        <div class="col-span-12 ">
                            <label class="block text-sm font-medium text-gray-600 mb-1">Project Price Discount</label>
                            <InputNumber v-model="item.project_price_discount" placeholder="Enter project price discount"
                                class="w-full" />
                        </div>
                    </div>
                </div>
            </div>
            <!-- Right column -->
            <ItemSidebar :item="item" />
        </div>
    </div> 
</template>