<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import InputText from 'primevue/inputtext';
import { storeToRefs } from 'pinia';
import { useAttributeGroupStore } from '@/stores/attributeGroup';

const emit = defineEmits(['update:attributeGroup', 'saved', 'editTabUnmunted', 'editTabMounted']);
const route = useRoute();
const AttributeGroupStore = useAttributeGroupStore();

const { attributeGroup, fb } = storeToRefs(AttributeGroupStore);

onMounted(async () => {
  emit('editTabMounted');
  if (route.params.id) {
    await AttributeGroupStore.getAttributeGroupById(route.params.id as string);
  }
});

onUnmounted(() => {
  emit('editTabUnmunted');
});
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col md:flex-row gap-6">
      <div class="loading-overlay" v-if="fb.loading['attributeGroup.edit.' + route.params.id]">
        <div class="flex justify-center items-center h-full spinner">
          <i class="pi pi-spin pi-spinner" style="font-size: 2rem;"></i>
          <p class="mt-2">Loading...</p>
        </div>
      </div>
      <!-- Left column: Attribute Form -->
      <div class="sm:w-full md:w-3/5 space-y-4">
        <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Edit Attribute Group</h3>

        <div class="grid grid-cols-12 gap-x-6 gap-y-4">
          <!-- Attribute Name -->
          <label class="col-span-12 md:col-span-2 flex items-center text-lg">Name</label>
          <div class="col-span-12 md:col-span-10 py-2">
            <InputText v-model="attributeGroup.content.name"
              class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Enter attribute group name"
              :class="{ 'p-invalid': fb.errors['attributeGroup.update.' + route.params.id]?.name }" />
            <Message v-if="fb.errors['attributeGroup.update.' + route.params.id]?.name" severity="error"
              size="small" variant="title">
              <span v-for="error in fb.errors['attributeGroup.update.' + route.params.id]?.name" :key="error"
                class="flex flex-col">
                {{ error }}
              </span>
            </Message>
          </div>

          <!-- Sort Order -->
          <label class="col-span-12 md:col-span-2 flex items-center text-lg">Sort Order</label>
          <div class="col-span-12 md:col-span-10 py-2">
            <InputText v-model="attributeGroup.sort_order" class="w-full text-lg border border-gray-200 rounded-md p-2"
              placeholder="Enter sort order"
              :class="{ 'p-invalid': fb.errors['attributeGroup.update.' + route.params.id]?.sort_order }" />
            <Message v-if="fb.errors['attributeGroup.update.' + route.params.id]?.sort_order" severity="error"
              size="small" variant="title">
              <span v-for="error in fb.errors['attributeGroup.update.' + route.params.id]?.sort_order" :key="error"
                class="flex flex-col">
                {{ error }}
              </span>
            </Message>
          </div>
        </div>
      </div>

      <!-- Right column: Preview Sidebar -->
      <div class="sm:w-full md:w-3/5 space-y-4" v-if="attributeGroup.attribute_group_id">
        <div class="border border-gray-200 rounded-md p-4">
          <h4 class="text-lg font-medium mb-2">Attribute Preview</h4>
          <p><strong>Name:</strong> {{ attributeGroup.content.name }}</p>
          <p><strong>Sort Order:</strong> {{ attributeGroup.sort_order }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Optional custom styles */
</style>
