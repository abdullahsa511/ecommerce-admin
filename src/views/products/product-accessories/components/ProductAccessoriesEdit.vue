<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useProductAccessoriesStore } from '@/stores/productAccessories';

const emit = defineEmits(['update:productAccessories', 'saved', 'editTabUnmunted', 'editTabMounted']);

const route = useRoute();
const productAccessoriesStore = useProductAccessoriesStore();
const { productAccessories, fb } = storeToRefs(productAccessoriesStore);


onMounted(async () => {
    emit('editTabMounted');
    if (route.params.id) {
        await productAccessoriesStore.getProductAccessoriesById(route.params.id as string);
    }
    console.log('productAccessories', productAccessories.value);

});

onUnmounted(() => {
    emit('editTabUnmunted');
});

</script>

<template>
    <div class="flex flex-col gap-6">
        <div class="loading-overlay border-2" v-if="fb.loading['productAccessories.show.' + route.params.id]">
            <div class="flex justify-center items-center h-full spinner">
                <i class="pi pi-spin pi-spinner" style="font-size: 2rem;"></i>
                <p class="mt-2">Loading productAccessories details. Please wait.</p>
            </div>
        </div>
        <div class="flex flex-col md:flex-row gap-6">
            <!-- Left column: ProductAccessories Form -->
            <div class="sm:w-full md:w-3/5 space-y-4">
                <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Edit ProductAccessories</h3>

                <div class="grid grid-cols-12 gap-x-6 gap-y-4">
                    <!-- ProductAccessories Code -->
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">
                        Parent Product 
                    </label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <InputText v-model="productAccessories.parent_product_name" class="w-full text-lg border border-gray-200 rounded-md p-2"
                            placeholder="Enter productAccessories parent product name" :class="{'p-invalid': fb.errors?.['productAccessories.update.' + productAccessories.product_accessories_id]?.parent_product_name}"/>
                            <Message v-if="fb.errors?.['productAccessories.update.' + productAccessories.product_accessories_id]?.parent_product_name" severity="error" size="small" variant="title">
                                <span v-for="error in fb.errors?.['productAccessories.update.' + productAccessories.product_accessories_id]?.parent_product_name" :key="error" class="flex flex-col">
                                    {{ error }}
                                </span>
                            </Message>
                    </div>
                  
                    <!-- Name -->
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Web Product Range</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <InputText v-model="productAccessories.product_name" class="w-full text-lg border border-gray-200 rounded-md p-2"
                            placeholder="Enter productAccessories product name" :class="{'p-invalid': fb.errors?.['productAccessories.update.' + productAccessories.product_accessories_id]?.product_name}"/>
                            <Message v-if="fb.errors?.['productAccessories.update.' + productAccessories.product_accessories_id]?.product_name" severity="error" size="small" variant="title">
                                <span v-for="error in fb.errors?.['productAccessories.update.' + productAccessories.product_accessories_id]?.product_name" :key="error" class="flex flex-col">
                                    {{ error }}
                                </span>
                            </Message>
                    </div>
                    <!-- Sort Order -->
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Item Code</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <InputText v-model="productAccessories.item_code" class="w-full text-lg border border-gray-200 rounded-md p-2"
                            placeholder="Enter productAccessories item code"/>
                            <Message v-if="fb.errors?.['productAccessories.update.' + productAccessories.product_accessories_id]?.item_code" severity="error" size="small" variant="title">
                                <span v-for="error in fb.errors?.['productAccessories.update.' + productAccessories.product_accessories_id]?.item_code" :key="error" class="flex flex-col">
                                    {{ error }}
                                </span>
                            </Message>
                    </div>
                    <!-- Price -->
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Price</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <InputNumber v-model="productAccessories.price" class="w-full text-lg border border-gray-200 rounded-md p-2"
                            placeholder="Enter productAccessories price"/>
                            <Message v-if="fb.errors?.['productAccessories.update.' + productAccessories.product_accessories_id]?.price" severity="error" size="small" variant="title">
                                <span v-for="error in fb.errors?.['productAccessories.update.' + productAccessories.product_accessories_id]?.price" :key="error" class="flex flex-col">
                                    {{ error }}
                                </span>
                            </Message>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<style scoped>
/* Optional custom styles */
</style>
