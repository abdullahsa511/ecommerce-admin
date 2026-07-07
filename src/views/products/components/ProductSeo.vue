<script setup lang="ts">
import { onMounted } from 'vue';
import Product from '@/models/Product.ts';
import ProductSidebar from './ProductSidebar.vue';
import { useProductStore } from '@/stores/product';
import { storeToRefs } from 'pinia';

const productStore = useProductStore();
const {fb} = storeToRefs(productStore);

const props = defineProps({
  product: {
    type: Product,
    required: true,
    default: () => new Product()
  }
});

onMounted(() => {
  console.log(props.product);
});
</script>
<template>
  <!-- Seo Tab -->
  <div class="flex flex-col gap-8">
    <div class="loading-overlay" v-if="fb.loading['product.show']">
        <div class="flex justify-center items-center h-full spinner">
        <i class="pi pi-spin pi-spinner" style="font-size: 2rem;"></i>
        <p class="mt-2">Loading product seo data. Please wait.</p>
      </div>
    </div>
    <div class="flex gap-6" v-if="!fb.loading['product.show']">
        <!-- Left column -->
        <div class="w-3/4 space-y-6">
            <!-- English SEO Section -->
            <div class="space-y-6">
                <h3 class="text-lg font-medium border-b border-gray-200 pb-2">SEO</h3>

                <div class="grid grid-cols-12 gap-2">
                    <label class="flex items-center col-span-12 mb-2 md:col-span-3 md:mb-0 text-lg">Meta Keywords</label>
                    <div class="col-span-12 md:col-span-9">
                        <Textarea v-model="product.metadata.enSeo.meta_keywords" rows="3" class="w-full" />
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label class="flex items-center col-span-12 mb-2 md:col-span-3 md:mb-0 text-lg">Meta Description</label>
                    <div class="col-span-12 md:col-span-9">
                        <Textarea v-model="product.metadata.enSeo.meta_description" rows="3" class="w-full" />
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label class="flex items-center col-span-12 mb-2 md:col-span-3 md:mb-0 text-lg">Meta Content</label>
                    <div class="col-span-12 md:col-span-9">
                        <Textarea v-model="product.metadata.enSeo.meta_content" rows="5" class="w-full" />
                    </div>
                </div>
            </div>

            <!-- Open Graph Section -->
            <div class="space-y-6">
                <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Open Graph</h3>
                
                <!-- Open Graph Title -->
                <div class="grid grid-cols-12 gap-2">
                    <label class="flex items-center col-span-12 mb-2 md:col-span-3 md:mb-0 text-lg">Open Graph Title</label>
                    <div class="col-span-12 md:col-span-9">
                        <InputText v-model="product.metadata.openGraph.openGraphTitle" class="w-full" />
                    </div>
                </div>

                <!-- Open Graph Description -->
                <div class="grid grid-cols-12 gap-2">
                    <label class="flex items-center col-span-12 mb-2 md:col-span-3 md:mb-0 text-lg">Open Graph Description</label>
                    <div class="col-span-12 md:col-span-9">
                        <Textarea v-model="product.metadata.openGraph.openGraphDescription" rows="3" class="w-full" />
                    </div>
                </div>
            </div>

            <!-- Twitter Section -->
            <div class="space-y-6">
                <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Twitter</h3>
                
                <!-- Twitter Title -->
                <div class="grid grid-cols-12 gap-2">
                    <label class="flex items-center col-span-12 mb-2 md:col-span-3 md:mb-0 text-lg">Twitter Title</label>
                    <div class="col-span-12 md:col-span-9">
                        <InputText v-model="product.metadata.twitter.twitterTitle" class="w-full" />
                    </div>
                </div>

                <!-- Twitter Description -->
                <div class="grid grid-cols-12 gap-2">
                    <label class="flex items-center col-span-12 mb-2 md:col-span-3 md:mb-0 text-lg">Twitter Description</label>
                    <div class="col-span-12 md:col-span-9">
                        <Textarea v-model="product.metadata.twitter.twitterDescription" rows="3" class="w-full" />
                    </div>
                </div>

                <!-- Twitter Label 1 -->
                <div class="grid grid-cols-12 gap-2">
                    <label class="flex items-center col-span-12 mb-2 md:col-span-3 md:mb-0 text-lg">Twitter label 1</label>
                    <div class="col-span-12 md:col-span-9">
                        <InputText v-model="product.metadata.twitter.twitterLabel1" class="w-full" />
                    </div>
                </div>

                <!-- Twitter Data 1 -->
                <div class="grid grid-cols-12 gap-2">
                    <label class="flex items-center col-span-12 mb-2 md:col-span-3 md:mb-0 text-lg">Twitter data 1</label>
                    <div class="col-span-12 md:col-span-9">
                        <InputText v-model="product.metadata.twitter.twitterData1" class="w-full" />
                    </div>
                </div>

                <!-- Twitter Label 2 -->
                <div class="grid grid-cols-12 gap-2">
                    <label class="flex items-center col-span-12 mb-2 md:col-span-3 md:mb-0 text-lg">Twitter label 2</label>
                    <div class="col-span-12 md:col-span-9">
                        <InputText v-model="product.metadata.twitter.twitterLabel2" class="w-full" />
                    </div>
                </div>

                <!-- Twitter Data 2 -->
                <div class="grid grid-cols-12 gap-2">
                    <label class="flex items-center col-span-12 mb-2 md:col-span-3 md:mb-0 text-lg">Twitter data 21</label>
                    <div class="col-span-12 md:col-span-9">
                        <InputText v-model="product.metadata.twitter.twitterData2" class="w-full" />
                    </div>
                </div>
            </div>
        </div>
        <!-- Right column -->
        <ProductSidebar :product="product" />
    </div> 
  </div>
</template>