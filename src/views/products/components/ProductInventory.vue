<script setup lang="ts">
import ProductSidebar from './ProductSidebar.vue';
import Product from '@/models/Product.ts';
import { useProductStore } from '@/stores/product';
import { storeToRefs } from 'pinia';

const productStore = useProductStore();
const {product, fb} = storeToRefs(productStore);
const emit = defineEmits(['update:product', 'saved']);

const props = defineProps({
  product: {
    type: Product,
    required: true,
    default: () => new Product({})
  }
});

</script>
<template>
    <!-- Local Tab -->
    <div class="flex flex-col gap-6">
        <div class="loading-overlay" v-if="fb.loading['product.show']">
            <div class="flex justify-center items-center h-full spinner">
                <i class="pi pi-spin pi-spinner" style="font-size: 2rem;"></i>
                <p class="mt-2">Loading product inventory data. Please wait.</p>
            </div>
        </div>
        <div class="flex gap-6" v-if="!fb.loading['product.show']">
            <!-- Left column -->
            <div class="w-3/4 space-y-6">
                <div>
                    <h2 class="font-bold text-base mb-2">Stock</h2>
                    <hr class="mb-4" />
                    <DataTable :value="product.items" :loading="fb.loading['product.show']">
                        <Column field="item_code" header="Item Code" style="width: 100px;"></Column>
                        <Column field="description" header="Description" style="width: 200px;"></Column>
                        <Column field="quantity" header="Quantity" style="width: 100px;"></Column>
                    </DataTable>
                </div>
            </div>
            <!-- Right column -->
            <ProductSidebar :product="product" />
        </div>
    </div> 
</template>