<script setup lang="ts">
import {onMounted } from 'vue';
import Button from 'primevue/button';

const props = defineProps({});

const emit = defineEmits(['editTabUnmunted']);        
onMounted(() => {
  // Any initialization logic here (if needed)
});

const handleDownload = async () => {
  try {
    alert('Downloading variants CSV data');
    // const response = await variantStore.exportVariants();
  } catch (error) {
    console.error('Error downloading variants CSV data:', error);
  }
};
</script>

<template>
  <div class="pt-6">
    <!-- Variants Export Section -->
    <div class="bg-white rounded-lg p-6 shadow-md">
      <h2 class="text-xl font-semibold mb-2">Download Variants CSV data</h2>
      <div class="flex flex-col gap-4 justify-end" style="margin-top: 2rem; width: 20%;">
        <Button icon="pi pi-download" label="Download CSV" severity="primary" @click="handleDownload" class="p-button-md" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.variant-export {
  padding: 2rem;
}
</style>
