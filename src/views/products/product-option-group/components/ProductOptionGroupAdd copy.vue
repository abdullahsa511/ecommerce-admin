<script setup lang="ts">
import { defineEmits, ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useProductOptionGroupStore } from '@/stores/productOptionGroup';

// Pinia Store
const productOptionGroupStore = useProductOptionGroupStore();
const { productOptionGroup, products, productVariants, fb } = storeToRefs(productOptionGroupStore);
// Props

// Emit to parent
const emit = defineEmits(['update:productOptionGroup', 'saved']);
// Update parent on field changes

// Set default values on mount
onMounted(() => {
  productOptionGroupStore.resetProductOptionGroup();
  if (productOptionGroup.value.product_option_group_id) {
  }
});
</script>

<template>
  <div class="flex flex-col gap-6 pt-6 mt-6 card">
    <div class="flex flex-col md:flex-row gap-6">
      <!-- Left column: Form -->
      <div class="sm:w-full md:w-full lg:w-3/5 space-y-4">
        <h3 class="text-lg font-medium border-b border-gray-200 pb-2">
          ProductOptionGroup Details
        </h3>

        <div class="grid grid-cols-12 gap-x-6 gap-y-4">

          <!-- product  -->
          <label for="name" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Product</label>
          <div class="col-span-12 md:col-span-10">
            <Select v-model="productOptionGroup.product_id" :options="products" optionLabel="label" optionValue="value"
              class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Select Product" filter
              :class="{ 'p-invalid': fb.errors?.['productOptionGroup.create']?.product_id }" />
            <Message v-if="fb.errors?.['productOptionGroup.create']?.product_id" severity="error" size="small"
              productOptionGroup="title">
              <span v-for="error in fb.errors?.['productOptionGroup.create']?.product_id" :key="error"
                class="flex flex-col">
                {{ error }}
              </span>
            </Message>
          </div>

          <!-- product variant  -->
          <label for="name" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Product Variant</label>
          <div class="col-span-12 md:col-span-10">
            <Select v-model="productOptionGroup.product_variant_id" :options="productVariants" optionLabel="label" optionValue="value"
              class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Select Product" filter
              :class="{ 'p-invalid': fb.errors?.['productOptionGroup.create']?.product_variant_id }" />
            <Message v-if="fb.errors?.['productOptionGroup.create']?.product_variant_id" severity="error" size="small"
              productOptionGroup="title">
              <span v-for="error in fb.errors?.['productOptionGroup.create']?.product_variant_id" :key="error"
                class="flex flex-col">
                {{ error }}
              </span>
            </Message>
          </div>


          
          <!-- name  -->
          <label class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">
            Name
          </label>
          <div class="col-span-12 md:col-span-10">
            <InputText 
              v-model="productOptionGroup.option_group_name" 
              :class="{'p-invalid': fb.errors?.['productOptionGroup.create']?.option_group_name, 'w-full': true, 'text-lg': true, 'border': true, 'border-gray-200': true, 'rounded-md': true, 'p-2': true}"
           
              placeholder="Enter option group name" 
              />
              <Message v-if="fb.errors?.['productOptionGroup.create']?.option_group_name" severity="error" size="small"
              variant="title">
              <span v-for="error in fb.errors?.['productOptionGroup.create']?.option_group_name" :key="error"
                class="flex flex-col">
                {{ error }}
              </span>
            </Message>
          </div>

          <!-- Sort Order -->
          <label class="col-span-12 md:col-span-2 flex items-center text-lg">
            Sort Order
          </label>
          <div class="col-span-12 md:col-span-10">
            <InputText v-model="productOptionGroup.sort_order" class="w-full text-lg border border-gray-200 rounded-md p-2"
              placeholder="Enter sort order" 
              :class="{ 'p-invalid': fb.errors?.['productOptionGroup.create']?.sort_order }" />
              <Message v-if="fb.errors?.['productOptionGroup.create']?.sort_order" severity="error" size="small"
              variant="title">
              <span v-for="error in fb.errors?.['productOptionGroup.create']?.sort_order" :key="error"
                class="flex flex-col">
                {{ error }}
              </span>
            </Message>
          </div>
        </div>
      </div>
      <!-- <div class="sm:w-full md:w-3/5 space-y-4" v-if="fb.errors['productOptionGroup.create']">
        <h3 class="text-lg font-medium border-b border-gray-200 pt-5 pb-2 text-red-600">
          Errors
        </h3>
        <div v-html="fb.renderErrors('productOptionGroup.create')"
          class="border border-red-300 bg-red-50 text-red-700 rounded-md p-3"></div>
      </div> -->
    </div>
  </div>
</template>

<style scoped>
/* Custom styles if needed */
</style>
