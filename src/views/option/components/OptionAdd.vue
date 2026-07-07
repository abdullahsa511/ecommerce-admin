<script setup lang="ts">
import { defineEmits, ref, onMounted } from 'vue';
import Select from 'primevue/select'; // Import Select
import { useOptionStore } from '@/stores/option';
import { storeToRefs } from 'pinia';

// Pinia Store
const OptionStore = useOptionStore();
const { option, types, fb } = storeToRefs(OptionStore);
// Props
const selectedType = ref<number | null>(null);

// Emit to parent
const emit = defineEmits(['update:option', 'saved']);
// Update parent on field changes

// Update parent on field changes
const onFieldChange = () => {
  // Find the selected type object from types array
  const selectedOption = types.value.find(type => type.id === selectedType.value);

  if (selectedOption) {
    // Update option.value with type_id and type (name)
    option.value.type = selectedOption.name;
    // Emit the updated option to parent
    emit('update:option', option.value);
  }
  console.log('Option field changed:', option.value);
};


// Set default values on mount
onMounted(() => {
  if (option.value.type_id) {
    selectedType.value = option.value.type_id;
  }
});
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col md:flex-row gap-6">
      <!-- Left column: Attribute Form -->
      <div class="sm:w-full md:w-3/5 space-y-4">
        <h3 class="text-lg font-medium border-b border-gray-200 pb-2">
          Option Details
        </h3>

        <div class="grid grid-cols-12 gap-x-6 gap-y-4">
          <!-- Attribute Name -->
          <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">
            Name
          </label>
          <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
            <InputText v-model="option.content.name" class="w-full text-lg border border-gray-200 rounded-md p-2"
              placeholder="Enter option name" />
          </div>
          <!-- option Group -->
          <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">
            Type
          </label>
          <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
             <Select
              v-model="selectedType"
              :options="types"
              optionLabel="name"
              optionValue="id"
              filter
              filterPlaceholder="Search type..."
              class="w-full text-lg border border-gray-200 rounded-md p-2"
              placeholder="Select a type"
              @change="
                option.type_id = selectedType;
                onFieldChange();
              "
            />
            <!-- <Select v-model="selectedType" :options="types" optionLabel="name" optionValue="id"
              class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Select a group" @change="
                option.type_id = selectedType;
              onFieldChange();
              " /> -->
          </div>

          <!-- Sort Order -->
          <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">
            Sort Order
          </label>
          <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
            <InputText v-model="option.sort_order" class="w-full text-lg border border-gray-200 rounded-md p-2"
              placeholder="Enter option name" />
          </div>
        </div>
      </div>
      <div class="sm:w-full md:w-3/5 space-y-4" v-if="fb.errors['option.create']">
        <h3 class="text-lg font-medium border-b border-gray-200 pt-5 pb-2 text-red-600">
          Errors
        </h3>
        <div v-html="fb.renderErrors('option.create')" class="border border-red-300 bg-red-50 text-red-700 rounded-md p-3"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom styles if needed */
</style>
