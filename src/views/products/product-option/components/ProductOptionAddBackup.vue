<script setup lang="ts">
import { defineEmits, ref, onMounted } from 'vue';
import Select from 'primevue/select'; // Import Select
import { useProductOptionStore } from '@/stores/productOption';
import { storeToRefs } from 'pinia';

// Pinia Store
const ProductOptionStore = useProductOptionStore();
const { productOption, fb, products, productVariants, productOptionGroups } = storeToRefs(ProductOptionStore);

// onMounted(() => {
//   ProductOptionStore.resetProductOption(); //reset form for add.
// });

</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- Global Unique Key Error -->
    <Message v-if="fb.errors?.['productOption.create']?.global_message"
      severity="error" size="small">
      <div class="flex flex-col w-full">
        <span v-for="error in fb.errors?.['productOption.create']?.global_message"
          :key="error" class="bg-red-50 border-l-4 border-red-700 text-red-700 p-2 rounded-md shadow-sm">
          {{ error }}
        </span>
      </div>
    </Message>

    <div class="flex flex-col md:flex-row gap-6">
      <!-- Left column: Option Form -->
      <div class="sm:w-full md:w-3/5 space-y-4">
        <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Add Option</h3>

        <div class="grid grid-cols-12 gap-x-6 gap-y-4">
          <!-- Option Name -->
          <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Name</label>
          <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
            <InputText v-model="productOption.option_name" class="w-full text-lg border border-gray-200 rounded-md p-2"
              placeholder="Enter option name"
              :class="{ 'p-invalid': fb.errors?.['productOption.create']?.option_name }" />
            <Message v-if="fb.errors?.['productOption.create']?.option_name"
              severity="error" size="small" productOption="title">
              <span v-for="error in fb.errors?.['productOption.create']?.option_name"
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
              :class="{ 'p-invalid': fb.errors?.['productOption.create']?.product_id }" />
              <Message v-if="fb.errors?.['productOption.create']?.product_id"
              severity="error" size="small" productOption="title">
              <span v-for="error in fb.errors?.['productOption.create']?.product_id"
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
              :class="{ 'p-invalid': fb.errors?.['productOption.create']?.product_variant_id }" />
            <Message v-if="fb.errors?.['productOption.create']?.product_variant_id"
              severity="error" size="small" productOption="title">
              <span
                v-for="error in fb.errors?.['productOption.create']?.product_variant_id"
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
              v-if="fb.errors?.['productOption.create']?.product_option_group_id"
              severity="error" size="small" productOption="title">
              <span
                v-for="error in fb.errors?.['productOption.create']?.product_option_group_id"
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
              :class="{ 'p-invalid': fb.errors?.['productOption.create']?.sort_order }" />
            <Message v-if="fb.errors?.['productOption.create']?.sort_order"
              severity="error" size="small" productOption="title">
              <span v-for="error in fb.errors?.['productOption.create']?.sort_order"
                :key="error" class="flex flex-col">
                {{ error }}
              </span>
            </Message>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>