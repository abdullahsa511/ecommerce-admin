<script setup lang="ts">
import { ref } from 'vue';
import InputSwitch from 'primevue/inputswitch';
import ProductSidebar from './ProductSidebar.vue';
import Product from '@/models/Product.ts';
import { useProductStore } from '@/stores/product';
import { storeToRefs } from 'pinia';

const productStore = useProductStore();
const {fb} = storeToRefs(productStore);

const emit = defineEmits(['update:product', 'saved']);

const props = defineProps({
  product: {
    type: Product,
    required: true,
    default: () => new Product({})
  }
});

const lengthClassOptions = ['Centimeter', 'Millimeter', 'Inch'];
const weightClassOptions = ['Kilogram', 'Gram', 'Pound'];
</script>

<template>
  <div class="flex flex-col gap-8">
    <div class="loading-overlay" v-if="fb.loading['product.show']">
        <div class="flex justify-center items-center h-full spinner">
        <i class="pi pi-spin pi-spinner" style="font-size: 2rem;"></i>
        <p class="mt-2">Loading product shipping data. Please wait.</p>
      </div>
    </div>
    <div class="flex gap-6" v-if="!fb.loading['product.show']">
        <!-- Left column -->
        <div class="w-3/4 space-y-6">
            <!-- Requires Shipping -->
            <!-- <div class="grid grid-cols-12 items-center mb-2">
                <label class="col-span-12 md:col-span-2 flex items-center text-lg">Requires Shipping</label>
                <div class="col-span-12 md:col-span-4">
                    <InputSwitch v-model="product.shipping.requires_shipping" />
                </div>
            </div> -->

            <!-- Dimensions Section -->
            <div>
                <h2 class="font-bold text-base mb-2">Dimensions</h2>
                <hr class="mb-4" />
                <div class="space-y-4">
                    <div class="grid grid-cols-12 gap-x-6 gap-y-4">
                        <label class="col-span-12 md:col-span-2 flex items-center text-lg">Width</label>
                        <div class="col-span-12 md:col-span-4">
                            <input v-model="product.width" class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Width" />
                        </div>
                        <label class="col-span-12 md:col-span-2 flex items-center text-lg">Height</label>
                        <div class="col-span-12 md:col-span-4">
                            <input v-model="product.height" class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Height" />
                        </div>
                    </div>
                    <div class="grid grid-cols-12 gap-x-6 gap-y-4">
                        <label class="col-span-12 md:col-span-2 flex items-center text-lg">Length</label>
                        <div class="col-span-12 md:col-span-4">
                            <input v-model="product.length" class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Length" />
                        </div>
                        <label class="col-span-12 md:col-span-2 flex items-center text-lg">Length Class</label>
                        <div class="col-span-12 md:col-span-4">
                            <select v-model="product.length_class" class="w-full text-lg border border-gray-200 rounded-md p-2 bg-white">
                            <option v-for="option in lengthClassOptions" :key="option" :value="option">{{ option }}</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Weight Section -->
            <div>
                <h2 class="font-bold text-base mb-2">Weight</h2>
                <hr class="mb-4" />
                <div class="grid grid-cols-12 gap-x-6 gap-y-4">
                    <label class="col-span-12 md:col-span-2 flex items-center text-lg">Weight</label>
                    <div class="col-span-12 md:col-span-4">
                    <input v-model="product.weight" class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Weight" />
                    </div>
                    <label class="col-span-12 md:col-span-2 flex items-center text-lg">Weight Class</label>
                    <div class="col-span-12 md:col-span-4">
                    <select v-model="product.weight_class" class="w-full text-lg border border-gray-200 rounded-md p-2 bg-white">
                        <option v-for="option in weightClassOptions" :key="option" :value="option">{{ option }}</option>
                    </select>
                    </div>
                </div>
            </div>
        </div>
        <!-- Right column -->
        <ProductSidebar :product="product" />
    </div>
  </div>
</template>