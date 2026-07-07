<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useAttributeGroupStore } from '@/stores/attributeGroup';

// Props
const attributeGroupStore = useAttributeGroupStore();
const { attributeGroup, fb } = storeToRefs(attributeGroupStore);
// Emit to parent
const emit = defineEmits(['update:attributeGroup', 'saved']);
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col md:flex-row gap-6">
      <!-- Left column: Attribute Form -->
      <div class="sm:w-full md:w-3/5 space-y-4">
        <h3 class="text-lg font-medium border-b border-gray-200 pb-2">
          Attribute Group Details
        </h3>

        <div class="gfrid grid-cols-12 gap-x-6 gap-y-4">
          <!-- Attribute Name -->
          <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">
            Name
          </label>
          <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
            <InputText v-model="attributeGroup.content.name"
              class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Enter attribute name"
              :class="{ 'p-invalid': fb.errors['attributeGroup.create']?.name }" />
            <Message v-if="fb.errors['attributeGroup.create']?.name" severity="error" size="small" variant="title">
              <span v-for="error in fb.errors['attributeGroup.create']?.name" :key="error" class="flex flex-col">
                {{ error }}
              </span>
            </Message>
          </div>
          
          <!-- Sort Order -->
          <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">
            Sort Order
          </label>
          <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
            <InputText v-model="attributeGroup.sort_order" 
              class="w-full text-lg border border-gray-200 rounded-md p-2"
              placeholder="Enter sort order"
              :class="{ 'p-invalid': fb.errors['attributeGroup.create']?.sort_order }" />
            <Message v-if="fb.errors['attributeGroup.create']?.sort_order" severity="error" size="small" variant="title">
              <span v-for="error in fb.errors['attributeGroup.create']?.sort_order" :key="error" class="flex flex-col">
                {{ error }}
              </span>
            </Message>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
