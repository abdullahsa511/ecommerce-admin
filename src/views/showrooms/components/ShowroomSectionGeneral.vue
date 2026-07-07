<script setup lang="ts">
import { defineEmits, onMounted } from 'vue';
import ShowroomSectionSidebar from './ShowroomSectionSidebar.vue';
import { useShowroomStore } from '@/stores/showroom';
import { storeToRefs } from 'pinia';



// Emit to parent
const emit = defineEmits(['update:showroom', 'saved']);

// Pinia Store
const showroomStore = useShowroomStore();
const { section, fb } = storeToRefs(showroomStore);


// Load showroom data on mounted
onMounted(async () => {
  
});

const onTitleInput = (e: any) => {
    section.value.slug = slugify(e.target.value);
    emit('update:showroom', section.value);
};
const onSectionCodeInput = (e: any) => {
    section.value.section_code = slugify(e.target.value);
    emit('update:showroom', section.value);
};

// const onFieldChange = () => {
//   section.value.slug = slugify(section.value.title);
//   section.value.section_code = slugify(section.value.title);
//   emit('update:showroom', section.value);
// };

const slugify = (value: string) => {
  return value
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')        // replace spaces with -
        .replace(/[^a-z0-9-]/g, '')  // remove all special chars except -
        .replace(/-+/g, '-');        // remove duplicate -
}

</script>

<template>
  <div class="flex flex-col gap-6">
     <!-- Loading state -->
     <div v-if="fb.loading?.['showroom.section.show']" class="text-center py-10 text-gray-500">
      <ProgressSpinner style="width: 30px; height: 30px" />
    </div>

    <div v-else class="flex flex-col md:flex-row gap-6">
      <!-- Left column -->
      <div class="sm:w-full md:w-3/5 space-y-4">
        <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Details</h3>

        <div class="grid grid-cols-12 gap-x-6 gap-y-4">
          <!-- Section Code -->
          <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Section Code</label>
          <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
            <InputText 
              v-model="section.section_code" 
              class="w-full text-lg border border-gray-200 rounded-md p-2" 
              placeholder="Enter title"
              @input="onSectionCodeInput"
              :disabled="true"
            />
          </div>
          <!-- Title -->
          <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Title</label>
          <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
            <InputText 
              v-model="section.title" 
              class="w-full text-lg border border-gray-200 rounded-md p-2" 
              placeholder="Enter title"
              @input="onTitleInput"
            />
          </div>

          <!-- Slug -->
          <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Slug</label>
          <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
            <InputText 
              v-model="section.slug" 
              class="w-full text-lg border border-gray-200 rounded-md p-2" 
              placeholder="Enter slug"
              @input="onTitleInput"
            />
          </div>
        </div>

        <!-- Description -->
        <div class="form-group mt-0">
          <label class="block text-gray-700 text-lg mb-2">Description</label>
          <Editor 
            v-model="section.description" 
            editorStyle="height: 200px" 
          />
        </div>
      </div>

      <!-- Right column -->
      <ShowroomSectionSidebar :section="section" />
    </div>
  </div>
</template>

<style scoped>
.th-site-logo-title {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-width: 180px;
}
.th-site-logo {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 160px;
    border-radius: 5px;
    padding: 10px;
    flex:1;
}
</style>
