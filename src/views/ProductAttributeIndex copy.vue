<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useProductAttributeStore } from '@/stores/productAttribute.d-abdullah';
// import ProductAttribute from '@/models/ProductAttribute';

const store = useProductAttributeStore();
// const newAttribute = ref<ProductAttribute>(new ProductAttribute());

onMounted(async () => {
  await store.fetchProductAttributes();
});
</script>

<template>
  <div class="p-6 bg-white rounded shadow">
    <h2 class="text-xl font-bold mb-4">Product Attributes</h2>

    <div v-if="store.loading">Loading attributes...</div>
    <div v-else-if="store.error" class="text-red-500">{{ store.error }}</div>
    <div v-else>
      <table class="w-full table-auto border border-gray-200">
        <thead>
          <tr class="bg-gray-100">
            <th class="border px-4 py-2">ID</th>
            <th class="border px-4 py-2">Code</th>
            <th class="border px-4 py-2">Group</th>
            <th class="border px-4 py-2">Name</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="attr in store.productAttributes" :key="attr.attribute_id">
            <td class="border px-4 py-2">{{ attr.attribute_id }}</td>
            <td class="border px-4 py-2">{{ attr.attribute_code }}</td>
            <td class="border px-4 py-2">{{ attr.attribute_group_name }}</td>
            <td class="border px-4 py-2">{{ attr.name }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
