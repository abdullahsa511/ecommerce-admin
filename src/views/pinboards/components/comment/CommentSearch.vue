<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
  loading?: boolean;
}>();

const emit = defineEmits<{
  search: [query: string];
}>();

const searchQuery = ref('');

function submitSearch() {
  emit('search', searchQuery.value.trim());
}
</script>

<template>
  <div class="my-5">
  <div class="max-w-3xl mx-auto">
    <form @submit.prevent="submitSearch" class="flex items-center gap-4">
      
      <div class="relative flex-1">
        <span class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <i class="pi pi-search text-gray-600 text-base" />
        </span>
        <input
          id="search"
          v-model.trim="searchQuery"
          name="search"
          type="text"
          autocomplete="off"
          placeholder="Search comments"
          class="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-gray-400 text-base"
        />
      </div>

      <button 
        type="submit" 
        :disabled="loading"
        class="px-10 py-3 bg-[#e9ebeb] text-gray-900 text-base font-normal hover:bg-gray-300 transition-colors flex items-center justify-center min-w-[120px] disabled:opacity-60"
      >
        <i v-if="loading" class="pi pi-circle-notch pi-spin mr-2" />
        <span v-else>Search</span>
      </button>

    </form>
  </div>
</div>
</template>
