<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import InputText from 'primevue/inputtext';
import { storeToRefs } from 'pinia';
import { useProductOptionStore } from '@/stores/productOption';

const emit = defineEmits(['update:productOption', 'saved', 'editTabUnmunted', 'editTabMounted']);

const route = useRoute();
const ProductOptionStore = useProductOptionStore();
const { productOption, fb, products, productVariants, productOptionGroups } = storeToRefs(ProductOptionStore);

onMounted(async () => {
  emit('editTabMounted');

  if (route.params.id) {
    await ProductOptionStore.getProductOptionById(route.params.id as string);
  }
});

onUnmounted(() => {
  emit('editTabUnmunted');
});
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- Global Unique Key Error -->
    <Message v-if="fb.errors?.['productOption.update.' + productOption.product_option_id]?.global_message" severity="error" size="small">
      <div class="flex flex-col gap-2 w-full pb-3">
        <span v-for="error in fb.errors?.['productOption.update.' + productOption.product_option_id]?.global_message" :key="error"
          class="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded-md shadow-sm">
          {{ error }}
        </span>
      </div>
    </Message>

    <div class="flex flex-col md:flex-row gap-6">
      <!-- Left column: Option Form -->
      <div class="sm:w-full md:w-3/5 space-y-4">
        <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Edit Option</h3>

        <div class="grid grid-cols-12 gap-x-6 gap-y-4">
          <!-- Option Name -->
          <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Name</label>
          <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
            <InputText v-model="productOption.option_name" class="w-full text-lg border border-gray-200 rounded-md p-2"
              placeholder="Enter option name"
              :class="{ 'p-invalid': fb.errors?.['productOption.update.' + productOption.product_option_id]?.option_name }" />
            <Message v-if="fb.errors?.['productOption.update.' + productOption.product_option_id]?.option_name"
              severity="error" size="small" productOption="title">
              <span v-for="error in fb.errors?.['productOption.update.' + productOption.product_option_id]?.option_name"
                :key="error" class="flex flex-col">
                {{ error }}
              </span>
            </Message>
          </div>
          <!-- Product -->
          <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Product</label>
          <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
            <Select v-model="productOption.product_id" :options="products" optionLabel="name" optionValue="id"
              class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Select product" filter
              :class="{ 'p-invalid': fb.errors?.['productOption.update.' + productOption.product_option_id]?.product_id }" />
            <Message v-if="fb.errors?.['productOption.update.' + productOption.product_option_id]?.product_id"
              severity="error" size="small" productOption="title">
              <span v-for="error in fb.errors?.['productOption.update.' + productOption.product_option_id]?.product_id"
                :key="error" class="flex flex-col">
                {{ error }}
              </span>
            </Message>
          </div>
          <!-- Product Variant -->
          <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Product Variant</label>
          <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
            <Select v-model="productOption.product_variant_id" :options="productVariants" optionLabel="name"
              optionValue="id" class="w-full text-lg border border-gray-200 rounded-md p-2"
              placeholder="Select product variant" filter
              :class="{ 'p-invalid': fb.errors?.['productOption.update.' + productOption.product_option_id]?.product_variant_id }" />
            <Message v-if="fb.errors?.['productOption.update.' + productOption.product_option_id]?.product_variant_id"
              severity="error" size="small" productOption="title">
              <span
                v-for="error in fb.errors?.['productOption.update.' + productOption.product_option_id]?.product_variant_id"
                :key="error" class="flex flex-col">
                {{ error }}
              </span>
            </Message>
          </div>
          <!-- Product Option Group -->
          <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Product Option Group</label>
          <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
            <Select v-model="productOption.product_option_group_id" :options="productOptionGroups" optionLabel="name"
              optionValue="id" class="w-full text-lg border border-gray-200 rounded-md p-2"
              placeholder="Select product option group" filter />
            <Message
              v-if="fb.errors?.['productOption.update.' + productOption.product_option_id]?.product_option_group_id"
              severity="error" size="small" productOption="title">
              <span
                v-for="error in fb.errors?.['productOption.update.' + productOption.product_option_id]?.product_option_group_id"
                :key="error" class="flex flex-col">
                {{ error }}
              </span>
            </Message>
          </div>
          <!-- Sort Order -->
          <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Sort Order</label>
          <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
            <InputText v-model="productOption.sort_order" class="w-full text-lg border border-gray-200 rounded-md p-2"
              placeholder="Enter sort order"
              :class="{ 'p-invalid': fb.errors?.['productOption.update.' + productOption.product_option_id]?.sort_order }" />
            <Message v-if="fb.errors?.['productOption.update.' + productOption.product_option_id]?.sort_order"
              severity="error" size="small" productOption="title">
              <span v-for="error in fb.errors?.['productOption.update.' + productOption.product_option_id]?.sort_order"
                :key="error" class="flex flex-col">
                {{ error }}
              </span>
            </Message>
          </div>
        </div>
      </div>

    </div>


    <div class="loading-overlay" v-if="fb.loading['productOption.show.' + route.params.id]">
      <div class="flex justify-center items-center h-full spinner">
        <i class="pi pi-spin pi-spinner" style="font-size: 2rem;"></i>
        <p class="mt-2">Loading product option...</p>
      </div>
    </div>

  </div>
</template>
