<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import InputText from 'primevue/inputtext';
import { storeToRefs } from 'pinia';
import { useTypeStore } from '@/stores/type';

const emit = defineEmits(['update:type', 'saved', 'editTabUnmunted', 'editTabMounted']);

const route = useRoute();
const typeStore = useTypeStore();
const { type, fb } = storeToRefs(typeStore);

// When component mounts
onMounted(async () => {
  emit('editTabMounted');
  // Load data for edit
  if (route.params.id) {
    await typeStore.getTypeById(route.params.id as string);
  }
});

onUnmounted(() => {
  emit('editTabUnmunted');
});
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col md:flex-row gap-6">
      <!-- Left column: type Form -->
      <div class="sm:w-full md:w-3/5 space-y-4">
        <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Edit type</h3>

        <div class="grid grid-cols-12 gap-x-6 gap-y-4">
          <!-- type Name -->
          <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Name</label>
          <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
            <InputText v-model="type.type" class="w-full text-lg border border-gray-200 rounded-md p-2"
              placeholder="Enter type name" :class="{ 'p-invalid': fb.errors['type.update.' + route.params.id]?.type }" />
            <Message v-if="fb.errors['type.update.' + route.params.id]?.type" severity="error" size="small" variant="title">
              <span v-for="error in fb.errors['type.update.' + route.params.id]?.type" :key="error" class="flex flex-col">
                {{ error }}
              </span>
            </Message>
          </div>
          <!-- Sort Order -->
          <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Sort Order</label>
          <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
            <InputText v-model="type.sort_order" class="w-full text-lg border border-gray-200 rounded-md p-2"
              placeholder="Enter sort order" />
          </div>
        </div>
      </div>

      <!-- Right column: Preview Sidebar -->
      <div class="sm:w-full md:w-3/5 space-y-4" v-if="type.type_id">
        <div class="border border-gray-200 rounded-md p-4">
          <h4 class="text-lg font-medium mb-2">Type Preview</h4>
          <p><strong>Name:</strong> {{ type.type }}</p>
          <p><strong>Sort Order:</strong> {{ type.sort_order }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
