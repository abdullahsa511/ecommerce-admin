<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useOptionStore } from '@/stores/option';
import Select from 'primevue/select';
import InputText from 'primevue/inputtext';
import { storeToRefs } from 'pinia';

const emit = defineEmits(['update:option', 'saved', 'editTabUnmunted', 'editTabMounted']);

const route = useRoute();
const OptionStore = useOptionStore();
const { option, types, fb } = storeToRefs(OptionStore);

const selectedType = ref<number | null>(null);

// 🔹 When Select changes
const onFieldChange = () => {
  const selected = types.value.find(t => t.id === selectedType.value);
  if (selected) {
    option.value.type_id = selected.id;
    option.value.type = selected.name;
    emit('update:option', option.value);
  }
};


// 🔹 When component mounts
onMounted(async () => {
  emit('editTabMounted');

  // Load data for edit
  if (route.params.id) {
    await OptionStore.getOptionById(route.params.id as string);
  }
});

// 🔹 Watch both option + types to resync after async loading
watch(
  [types, () => option.value.type_id],
  ([newTypes, typeId]) => {
    if (newTypes.length && typeId != null) {
      console.log('Syncing selectedType with option.type_id:', typeId);
      selectedType.value = option.value.type_id;
    }
  },
  { immediate: true }
);

onUnmounted(() => {
  emit('editTabUnmunted');
});
</script>

<template>
  <div class="flex flex-col gap-6">

    <div class="w-full space-y-4" v-if="fb.errors['option.update']">
      <h3 class="text-lg font-medium border-b border-gray-200 pt-5 pb-2 text-red-600">
        Errors
      </h3>
      <div v-html="fb.renderErrors('option.update')"
        class="border border-red-300 bg-red-50 text-red-700 rounded-md p-3"></div>
    </div>


    <div class="flex flex-col md:flex-row gap-6">
      <!-- Left column: Option Form -->
      <div class="sm:w-full md:w-3/5 space-y-4">
        <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Edit Option</h3>

        <div class="grid grid-cols-12 gap-x-6 gap-y-4">
          <!-- Option Name -->
          <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Name</label>
          <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
            <InputText v-model="option.content.name" class="w-full text-lg border border-gray-200 rounded-md p-2"
              placeholder="Enter option name" />
          </div>

          <!-- Option Type -->
          <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Type</label>
          <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
            <Select v-model="selectedType" :options="types" optionLabel="name" optionValue="id"
              class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Select a type" filter
              filterPlaceholder="Search type..." @update:modelValue="onFieldChange" />
          </div>

          <!-- Sort Order -->
          <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Sort Order</label>
          <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
            <InputText v-model="option.sort_order" class="w-full text-lg border border-gray-200 rounded-md p-2"
              placeholder="Enter sort order" />
          </div>
        </div>
      </div>

      <!-- Right column: Preview Sidebar -->
      <div class="sm:w-full md:w-3/5 space-y-4" v-if="option.option_id">
        <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Option Preview</h3>
        <div class="border border-gray-200 rounded-md p-4">
          <p><strong>Name:</strong> {{ option.content.name }}</p>
          <p v-if="selectedType">
            <strong>Type:</strong>
            {{types.find((t: any) => t.id === selectedType)?.name ?? 'No type selected'}}
          </p>
          <p><strong>Sort Order:</strong> {{ option.sort_order }}</p>
        </div>
        <div v-if="fb.errors['option.update']" class="space-y-4">
          <h3 class="text-lg font-medium border-b border-gray-200 pt-5 pb-2 text-red-600">
            Errors
          </h3>
          <div v-html="fb.renderErrors('option.update')"
            class="border border-red-300 bg-red-50 text-red-700 rounded-md p-3"></div>
        </div>
      </div>


    </div>


    <div class="loading-overlay" v-if="fb.loading['option.show.'+route.params.id]">
            <div class="flex justify-center items-center h-full spinner">
                <i class="pi pi-spin pi-spinner" style="font-size: 2rem;"></i>
                <p class="mt-2">Loading option...</p>
            </div>
        </div>

  </div>
</template>
