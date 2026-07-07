<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Select from 'primevue/select'; // Import Select
import { useProductAttributeStore } from '@/stores/productAttribute';
import { storeToRefs } from 'pinia';

// Props
const ProductAttributeStore = useProductAttributeStore();
const { attribute, groups, fb } = storeToRefs(ProductAttributeStore);
// Emit to parent
const emit = defineEmits(['update:attribute', 'saved']);

// Local state for group selection and attribute code
const selectedGroup = ref<number | null>(null);

// Update parent on field changes
const onFieldChange = () => {
  emit('update:attribute', attribute.value);
};

// Set default values on mount
onMounted(() => {
  if (attribute.value.attribute_group_id) {
    selectedGroup.value = attribute.value.attribute_group_id;
  }
});
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col md:flex-row gap-6">
      <!-- Left column: Attribute Form -->
      <div class="sm:w-full md:w-3/5 space-y-4">
        <h3 class="text-lg font-medium border-b border-gray-200 pb-2">
          Attribute Details
        </h3>

        <div class="grid grid-cols-12 gap-x-6 gap-y-4">
          <!-- Attribute Name -->
          <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">
            Name
          </label>
          <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
            <InputText v-model="attribute.content.name"
              class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Enter attribute name"
              :class="{ 'p-invalid': fb.errors['attribute.create']?.name }" />
            <Message v-if="fb.errors['attribute.create']?.name" severity="error" size="small" variant="title">
              <span v-for="error in fb.errors['attribute.create']?.name" :key="error" class="flex flex-col">
                {{ error }}
              </span>
            </Message>
          </div>
          <!-- Attribute Group -->
          <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">
            Group
          </label>
          <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
            <Select v-model="selectedGroup" :options="groups" optionLabel="name" optionValue="id"
              class="w-full text-lg border border-gray-200" placeholder="Select a group" @change="
                attribute.attribute_group_id = selectedGroup;
              attribute.group_content.attribute_group_id = selectedGroup;
              onFieldChange();
              " :class="{ 'p-invalid': fb.errors['attribute.create']?.attribute_group_id }" />
            <Message v-if="fb.errors['attribute.create']?.attribute_group_id" severity="error" size="small" variant="title">
              <span v-for="error in fb.errors['attribute.create']?.attribute_group_id" :key="error" class="flex flex-col">
                {{ error }}
              </span>
            </Message>
          </div>

          <!-- Sort Order -->
          <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">
            Sort Order
          </label>
          <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
            <InputText v-model="attribute.sort_order" class="w-full text-lg border border-gray-200 rounded-md p-2"
              placeholder="Enter attribute name" @input="onFieldChange" />
          </div>
        </div>

       
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom styles if needed */
</style>
