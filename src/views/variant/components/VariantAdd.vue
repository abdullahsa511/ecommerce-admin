<script setup lang="ts">
import { defineEmits, ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useVariantStore } from '@/stores/variant';

// Pinia Store
const variantStore = useVariantStore();
const { variant, fb } = storeToRefs(variantStore);
// Props

// Emit to parent
const emit = defineEmits(['update:variant', 'saved']);
// Update parent on field changes

// Set default values on mount
onMounted(() => {
  if (variant.value.variant_id) {
  }
});
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex gap-6">
      <!-- Left column: Attribute Form -->
      <div class="w-3/5 space-y-4">
        <h3 class="text-lg font-medium border-b border-gray-200 pb-2">
          Variant Details
        </h3>

        <div class="grid grid-cols-12 gap-x-6 gap-y-4">
          <!-- Attribute Name -->
          <label class="col-span-12 md:col-span-2 flex items-center text-lg">
            Name
          </label>
          <div class="col-span-12 md:col-span-10 py-2">
            <InputText v-model="variant.content.name" class="w-full text-lg border border-gray-200 rounded-md p-2"
              placeholder="Enter variant name" />
          </div>
          <!-- Sort Order -->
          <label class="col-span-12 md:col-span-2 flex items-center text-lg">
            Sort Order
          </label>
          <div class="col-span-12 md:col-span-10 py-2">
            <InputText v-model="variant.sort_order" class="w-full text-lg border border-gray-200 rounded-md p-2"
              placeholder="Enter variant name" />
          </div>
        </div>
      </div>
      <div class="w-2/5 space-y-4" v-if="fb.errors['variant.create']">
        <h3 class="text-lg font-medium border-b border-gray-200 pt-5 pb-2 text-red-600">
          Errors
        </h3>
        <div v-html="fb.renderErrors('variant.create')"
          class="border border-red-300 bg-red-50 text-red-700 rounded-md p-3"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom styles if needed */
</style>
