<script setup lang="ts">
import { ref, reactive } from 'vue';

const uploaded = ref(false);
const fileName = ref('');
const fabricPreview = ref('https://dummyimage.com/40x40/444/fff&text=F');

const form = reactive({
  name: '',
  description: '',
  metadata: '',
  tags: '',
  fabric: 'Charcoal_Cashmere.jpg',
  height: '150mm',
  colour: 'N/A',
  armsVariance: 'If arm_option = With Arms, then arm_color = base_color'
});

function handleUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    uploaded.value = true;
    fileName.value = file.name;
    form.name = file.name.replace(/\.[^/.]+$/, ''); // Remove extension for name
  }
}
</script>
<template>
  <div class="flex flex-col md:flex-row gap-2">
    <!-- Left Column -->
    <div class="md:w-2/3 w-full bg-white rounded-xl shadow p-6 flex flex-col gap-6 border border-gray-200">
      <!-- Upload -->
      <div>
        <label class="block font-semibold text-gray-700 mb-2 text-lg">Upload Component</label>
        <label
          class="flex flex-col items-center justify-center border-2 border-dashed border-blue-400 rounded-lg p-6 cursor-pointer hover:bg-blue-50 transition">
          <span class="text-blue-600 font-medium mb-2">Click or Drag & Drop</span>
          <input type="file" @change="handleUpload" class="hidden" />
        </label>
      </div>
      <!-- Name -->
      <div>
        <label class="block font-semibold text-gray-700 mb-1">Name</label>
        <input v-model="form.name"
          class="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-300 outline-none" />
      </div>
      <!-- Description -->
      <div>
        <label class="block font-semibold text-gray-700 mb-1">Description</label>
        <textarea v-model="form.description"
          class="w-full border border-gray-300 rounded-md p-2 min-h-[80px] focus:ring-2 focus:ring-blue-300 outline-none" />
      </div>
      <!-- Metadata -->
      <div>
        <label class="block font-semibold text-gray-700 mb-1">Metadata</label>
        <input v-model="form.metadata"
          class="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-300 outline-none" />
      </div>
      <!-- Tags -->
      <div>
        <label class="block font-semibold text-gray-700 mb-1">Tags</label>
        <input v-model="form.tags"
          class="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-300 outline-none" />
      </div>
    </div>

    <!-- Right Column -->
    <div class="md:w-1/3 w-full bg-white rounded-xl shadow p-6 border border-gray-200 flex flex-col gap-6">
      <div v-if="uploaded">
        <div class="flex justify-between items-center mb-4">
          <a href="#" class="text-blue-600 underline font-medium hover:text-blue-800 transition">Dynamic List</a>
        </div>
        <div>
          <h3 class="font-bold text-xl text-gray-800 mb-4 border-b pb-2">Default Options</h3>
          <div class="flex items-center mb-4">
            <span class="w-24 font-medium text-gray-700">Fabric</span>
            <input class="border border-gray-300 p-1 w-40 mr-2 rounded bg-gray-50" v-model="form.fabric" readonly />
            <img :src="fabricPreview" alt="fabric" class="w-8 h-8 border rounded shadow-sm" />
          </div>
          <div class="flex items-center mb-4">
            <span class="w-24 font-medium text-gray-700">Height</span>
            <input class="border border-gray-300 p-1 w-24 rounded bg-gray-50" v-model="form.height" readonly />
          </div>
          <div class="flex items-center mb-4">
            <span class="w-24 font-medium text-gray-700">Colour</span>
            <input class="border border-gray-300 p-1 w-24 rounded bg-gray-50" v-model="form.colour" readonly />
          </div>
        </div>
        <div>
          <h3 class="font-bold text-xl text-gray-800 mb-4 border-b pb-2">Variances</h3>
          <div class="flex items-start mb-4">
            <span class="w-24 font-medium text-gray-700 pt-1">Arms</span>
            <textarea class="border border-gray-300 p-2 w-64 rounded bg-gray-50" rows="2"
              readonly>{{ form.armsVariance }}</textarea>
          </div>
          <!-- Add more variances as needed -->
        </div>
      </div>
      <div v-else class="flex flex-col items-center justify-center h-full text-gray-400">
        <svg class="w-16 h-16 mb-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M12 16v-8m0 0l-3 3m3-3l3 3m-9 4a9 9 0 1118 0 9 9 0 01-18 0z" />
        </svg>
        <span class="text-lg">Upload a component to see default options and variances.</span>
      </div>
    </div>
  </div>
</template>