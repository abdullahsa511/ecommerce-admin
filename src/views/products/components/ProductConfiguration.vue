<script setup lang="ts">
import { onMounted } from 'vue';
import Dropdown from 'primevue/dropdown';
import Product from '@/models/Product.ts';
import Select from 'primevue/select';

const emit = defineEmits(['update:product', 'saved']);

const props = defineProps({
  product: {
    type: Product,
    required: true,
    default: () => new Product({})
  }
});

// Available attributes options
const attributeOptions = [
  { label: 'Alex_Base.gltf', value: 'Alex_Base.gltf' },
  { label: 'Alex_Arms.gltf', value: 'Alex_Arms.gltf' },
  { label: 'Alex_Shell.gltf', value: 'Alex_Shell.gltf' }
];

onMounted(() => {
  console.log(props.product);
}); 
</script>

<template>
  <div class="flex flex-col md:flex-row gap-2 ">
    <!-- Left Column -->
    <div class="md:w-2/3 w-full bg-white rounded-xl shadow p-6 flex flex-col gap-4 border border-gray-200">
      <div class="flex items-center gap-4 mb-2">
        <div class="flex-1">
          <label class="block font-semibold text-gray-700 mb-1">Name</label>
          <input v-model="product.configuration.name" class="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-300 outline-none" />
        </div>
        <div>
          <label class="block font-semibold text-gray-700 mb-1">Color</label>
          <input type="color" v-model="product.configuration.color" class="w-16 h-10 border rounded" />
        </div>
      </div>
      <div class="flex gap-4">
        <div class="flex-1">
          <label class="block font-semibold text-gray-700 mb-1">Attributes</label>
          <Select
            v-model="product.configuration.attributes"
            :options="attributeOptions"
            optionLabel="label"
            placeholder="Select an attribute"
            class="w-full"
          />
        </div>
        <div class="flex-1">
          <label class="block font-semibold text-gray-700 mb-1">Tags</label>
          <input v-model="product.configuration.tags" class="w-full border border-gray-300 rounded-md p-2" />
        </div>
      </div>
      <div class="flex gap-4">
        <div class="flex-1">
          <label class="block font-semibold text-gray-700 mb-1">Description</label>
          <textarea v-model="product.configuration.description" class="w-full border border-gray-300 rounded-md p-2 min-h-[60px]" />
        </div>
        <div class="flex-1 flex flex-col gap-2">
          <label class="block font-semibold text-gray-700 mb-1">Keywords</label>
          <input v-model="product.configuration.keywords" class="w-full border border-gray-300 rounded-md p-2" />
          <label class="block font-semibold text-gray-700 mb-1">Metadata</label>
          <input v-model="product.configuration.metadata" class="w-full border border-gray-300 rounded-md p-2" />
        </div>
      </div>
      <div>
        <label class="block font-semibold text-gray-700 mb-1">Rules</label>
        <textarea v-model="product.configuration.rules" class="w-full border border-gray-300 rounded-md p-2 min-h-[40px]" />
      </div>
    </div>

    <!-- Right Column -->
    <div class="md:w-1/3 w-full bg-white rounded-xl shadow p-6 border border-gray-200 flex flex-col gap-4">
      <h3 class="font-bold text-xl text-gray-800 mb-2">Default Options</h3>
      <div class="flex items-center mb-2">
        <span class="w-20 font-medium text-gray-700">Fabric</span>
        <input class="border border-gray-300 p-1 w-40 mr-2 rounded bg-gray-50" v-model="product.configuration.defaultOptions[0].fabric" />
        <img :src="product.configuration.defaultOptions[0].fabricPreview" alt="fabric" class="w-8 h-8 border rounded shadow-sm" />
      </div>
      <div class="flex items-center mb-2">
        <span class="w-20 font-medium text-gray-700">HEX</span>
        <input class="border border-gray-300 p-1 w-32 mr-2 rounded bg-gray-50" v-model="product.configuration.defaultOptions[0].hex" />
        <div class="w-8 h-8 border rounded" :style="{ backgroundColor: product.configuration.defaultOptions[0].hexColor }"></div>
      </div>

      <h3 class="font-bold text-lg text-gray-800 mt-4 mb-2">Option List</h3>
      <div v-for="(opt, idx) in product.configuration.optionList" :key="idx" class="flex items-center mb-2">
        <span class="w-20 font-medium text-gray-700">{{ opt.type }}</span>
        <input
          class="border border-gray-300 p-1 w-40 mr-2 rounded bg-gray-50"
          v-model="opt.value"
        />
        <template v-if="opt.type === 'Fabric'">
          <img :src="opt.preview" alt="fabric" class="w-8 h-8 border rounded shadow-sm" />
        </template>
        <template v-else>
          <input type="color" v-model="opt.preview" class="w-8 h-8 border rounded" />
        </template>
      </div>

      <h3 class="font-bold text-lg text-gray-800 mt-4 mb-2">Variances</h3>
      <div class="flex items-start mb-2">
        <span class="w-20 font-medium text-gray-700 pt-1">Arms</span>
        <textarea class="border border-gray-300 p-2 w-64 rounded bg-gray-50" rows="2" v-model="product.configuration.variances[0].arms"></textarea>
      </div>
      <!-- Add more variances as needed -->
    </div>
  </div>
</template>