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
  <div class="mt-20 mb-20">
    <div class="th-comment-search-box">
      <form class="th-form th-custom-quote-form" @submit.prevent="submitSearch">
        <div class="form-group th-input-icon mb-0">
          <i class="fa-solid fa-search" />
          <input
            id="search"
            v-model.trim="searchQuery"
            name="search"
            class="form-control"
            autocomplete="off"
            placeholder="Search comments"
          />
        </div>
        <button type="submit" class="th-btn text-capitalize bg-gray text-black" :disabled="loading">
          <i v-if="loading" class="fa-solid fa-circle-notch fa-spin" />
          <span v-else>Search</span>
        </button>
      </form>
    </div>
  </div>
</template>
