<script setup lang="ts">
import { onMounted, watch, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import InputText from 'primevue/inputtext';
import { storeToRefs } from 'pinia';
import { useVariantStore } from '@/stores/variant';

const emit = defineEmits(['update:variant', 'saved', 'editTabUnmunted', 'editTabMounted']);

const route = useRoute();
const variantStore = useVariantStore();
const { variant, fb } = storeToRefs(variantStore);

// 🔹 When component mounts
onMounted(async () => {
  emit('editTabMounted');

  // Load data for edit
  if (route.params.id) {
    await variantStore.getVariantById(route.params.id as string);
  }
  console.log('Variant loaded:', variant.value);
});

onUnmounted(() => {
  emit('editTabUnmunted');
});
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex gap-6">
      <!-- Left column: Option Form -->
      <div class="w-3/5 space-y-4">
          <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Edit Variant</h3>

        <div class="grid grid-cols-12 gap-x-6 gap-y-4">
          <!-- Variant Name -->
          <label class="col-span-12 md:col-span-2 flex items-center text-lg">Name</label>
          <div class="col-span-12 md:col-span-10 py-2">
            <InputText v-model="variant.content.name" class="w-full text-lg border border-gray-200 rounded-md p-2"
              placeholder="Enter variant name" />
          </div>
          <!-- Sort Order -->
          <label class="col-span-12 md:col-span-2 flex items-center text-lg">Sort Order</label>
          <div class="col-span-12 md:col-span-10 py-2">
            <InputText v-model="variant.sort_order" class="w-full text-lg border border-gray-200 rounded-md p-2"
              placeholder="Enter sort order" />
          </div>
        </div>
      </div>

      <!-- Right column: Preview Sidebar -->
      <div class="w-2/5" v-if="variant.variant_id">
        <div class="border border-gray-200 rounded-md p-4">
          <h4 class="text-lg font-medium mb-2">Variant Preview</h4>
          <p><strong>Name:</strong> {{ variant.content.name }}</p>
          <p><strong>Sort Order:</strong> {{ variant.sort_order }}</p>
        </div>
        <div v-if="fb.errors['variant.update']" class="space-y-4">
          <h3 class="text-lg font-medium border-b border-gray-200 pt-5 pb-2 text-red-600">
            Errors
          </h3>
          <div v-html="fb.renderErrors('variant.update')"
            class="border border-red-300 bg-red-50 text-red-700 rounded-md p-3"></div>
        </div>
      </div>


    </div>
  </div>
</template>
