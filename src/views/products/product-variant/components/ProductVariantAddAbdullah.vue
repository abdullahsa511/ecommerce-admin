<script setup lang="ts">
import { defineEmits, ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useVariantStore } from '@/stores/variant';

// Pinia Store
const variantStore = useVariantStore();
const { variant, products, fb } = storeToRefs(variantStore);
// Props

// Emit to parent
const emit = defineEmits(['update:variant', 'saved']);
// Update parent on field changes

// Set default values on mount
onMounted(() => {
  variantStore.resetVariants();
  if (variant.value.variant_id) {
  }
});
</script>

<template>
  <div class="flex flex-col gap-6 pt-6 mt-6 card">
    <div class="flex flex-col md:flex-row gap-6">
      <!-- Left column: Attribute Form -->
      <div class="sm:w-full md:w-full lg:w-3/5 space-y-4">
        <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Variant Details</h3>

        <div class="grid grid-cols-12 gap-x-6 gap-y-4">
          <label for="name" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg"
            >Product</label
          >
          <div class="col-span-12 md:col-span-10">
            <Select
              v-model="variant.product_id"
              :options="products"
              optionLabel="label"
              optionValue="value"
              class="w-full text-lg border border-gray-200 rounded-md p-2"
              placeholder="Select Product"
              filter
              :class="{ 'p-invalid': fb.errors?.['variant.create']?.product_id }"
            />
            <Message
              v-if="fb.errors?.['variant.create']?.product_id"
              severity="error"
              size="small"
              variant="title"
            >
              <span
                v-for="error in fb.errors?.['variant.create']?.product_id"
                :key="error"
                class="flex flex-col"
              >
                {{ error }}
              </span>
            </Message>
          </div>

          <!--  Name -->
          <label class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">
            Name
          </label>
          <div class="col-span-12 md:col-span-10">
            <InputText
              v-model="variant.variant_name"
              :class="{
                'p-invalid': fb.errors?.['variant.create']?.variant_name,
                'w-full': true,
                'text-lg': true,
                border: true,
                'border-gray-200': true,
                'rounded-md': true,
                'p-2': true
              }"
              placeholder="Enter variant name"
            />
            <Message
              v-if="fb.errors?.['variant.create']?.variant_name"
              severity="error"
              size="small"
              variant="title"
            >
              <span
                v-for="error in fb.errors?.['variant.create']?.variant_name"
                :key="error"
                class="flex flex-col"
              >
                {{ error }}
              </span>
            </Message>
          </div>
          <!-- Sort Order -->
          <label class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">
            Sort Order
          </label>
          <div class="col-span-12 md:col-span-10">
            <InputText
              v-model="variant.sort_order"
              class="w-full text-lg border border-gray-200 rounded-md p-2"
              placeholder="Enter sort order"
              :class="{ 'p-invalid': fb.errors?.['variant.create']?.sort_order }"
            />
            <Message
              v-if="fb.errors?.['variant.create']?.sort_order"
              severity="error"
              size="small"
              variant="title"
            >
              <span
                v-for="error in fb.errors?.['variant.create']?.sort_order"
                :key="error"
                class="flex flex-col"
              >
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
/* Custom styles if needed */
</style>
