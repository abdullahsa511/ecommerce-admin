<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useTypeStore } from '@/stores/type';
import { useRoute } from 'vue-router';

// Pinia Store
const route = useRoute();
const typeStore = useTypeStore();
const { type, fb } = storeToRefs(typeStore);

// Emit to parent
const emit = defineEmits(['create:type', 'saved']);
// Update parent on field changes

// Fetch post tag if editing
watch(() => route.params.id, async (id) => {
  if (id) {
    const typeId = Array.isArray(id) ? id[0] : id;
    await typeStore.getTypeById(typeId);
  } else {
    typeStore.resetTypeAddForm();
  }
}, { immediate: true });


// Set default values on mount
onMounted(async () => {
  const id = route.params.id;
  if (id) {
    const typeId = Array.isArray(id) ? id[0] : id;
    await typeStore.getTypeById(typeId);
  } else {
    typeStore.resetTypeAddForm();
  }
});
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col md:flex-row gap-6">
      <!-- Left column: Attribute Form -->
      <div class="sm:w-full md:w-3/5 space-y-4">
        <h3 class="text-lg font-medium border-b border-gray-200 pb-2">
          Type Details
        </h3>

        <div class="grid grid-cols-12 gap-x-6 gap-y-4">
          <!-- Attribute Name -->
          <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">
            Name
          </label>
          <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
            <InputText v-model="type.type" class="w-full text-lg border border-gray-200 rounded-md p-2"
              placeholder="Enter type name" :class="{ 'p-invalid': fb.errors['type.create']?.type }" />
            <Message v-if="fb.errors['type.create']?.type" severity="error" size="small" variant="title">
              <span v-for="error in fb.errors['type.create']?.type" :key="error" class="flex flex-col">
                {{ error }}
              </span>
            </Message>
          </div>
          <!-- Sort Order -->
          <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">
            Sort Order
          </label>
          <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
            <InputText v-model="type.sort_order" class="w-full text-lg border border-gray-200 rounded-md p-2"
              placeholder="Enter type name" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>