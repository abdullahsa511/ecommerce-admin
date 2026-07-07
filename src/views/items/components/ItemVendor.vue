<script setup lang="ts">
import { ref } from 'vue';
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
                <p class="mt-2">Loading item vendor data. Please wait.</p>
            </div>
        </div>
        <div class="flex gap-6" v-if="!fb.loading['item.show']">
            <!-- Left column -->
            <div class="w-3/4 space-y-6">
                <!-- Stock Section -->
                <div>
                    <h2 class="font-bold text-base mb-2">Vendor</h2>
                    <hr class="mb-4" />
                    <div class="space-y-4">
                        <div class="grid grid-cols-12 gap-x-6 gap-y-4">
                            <label class="col-span-12 md:col-span-2 flex items-center text-lg">Vendor ID</label>
                            <div class="col-span-12 md:col-span-4">
                                <input v-model="item.vendor_id" class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Vendor ID" />
                            </div>
                            <label class="col-span-12 md:col-span-2 flex items-center text-lg">Import Vendor ID</label>
                            <div class="col-span-12 md:col-span-4">
                                <input v-model="item.import_vendor_id" class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Import Vendor ID" />
                            </div>
                            <label class="col-span-12 md:col-span-2 flex items-center text-lg">Factory Vendor ID</label>
                            <div class="col-span-12 md:col-span-4">
                                <input v-model="item.factory_vendor_id" class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Factory Vendor ID" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Right column -->
            <ItemSidebar :item="item" />
        </div>
    </div> 
</template>