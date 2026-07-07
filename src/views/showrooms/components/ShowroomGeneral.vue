<script setup lang="ts">
import { onMounted } from 'vue';
import ShowroomSidebar from './ShowroomSidebar.vue';
import { useShowroomStore } from '@/stores/showroom';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import RichTextEditor from '@/components/form/RichTextEditor.vue';


// Emit to parent
const emit = defineEmits(['update:showroom', 'saved']);

// Props
const ShowroomStore = useShowroomStore();
const { fb, showroom } = storeToRefs(ShowroomStore);
const route = useRoute();

// Load showroom data on mounted
onMounted(async () => {
  // console.log('asadsadsf', route.params.id);
  
});

const onFieldChange = () => {
 showroom.value.slug = showroom.value.title.toLowerCase().replace(/ /g, '-');
  emit('update:showroom', showroom.value);
};


</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col md:flex-row gap-6">
      <!-- Left column -->
      <div class="sm:w-full md:w-3/5 space-y-4">
        
        <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Details</h3>

        <div class="grid grid-cols-12 gap-x-6 gap-y-4">
          <!-- Title -->
          <label class="col-span-12 md:col-span-2 flex items-center text-lg">Title</label>
          <div class="col-span-12 md:col-span-10 py-2">
            <InputText 
              v-model="showroom.title" 
              class="w-full text-lg border border-gray-200 rounded-md p-2" 
              placeholder="Enter title"
              @input="onFieldChange"
            />
          </div>

          <!-- Slug -->
          <label class="col-span-12 md:col-span-2 flex items-center text-lg">Slug</label>
          <div class="col-span-12 md:col-span-10 py-2">
            <InputText 
              v-model="showroom.slug" 
              class="w-full text-lg border border-gray-200 rounded-md p-2" 
              placeholder="Enter slug"
            />
          </div>
          <!-- Address -->
          <label class="col-span-12 md:col-span-2 flex items-center text-lg">Address</label>
          <div class="col-span-12 md:col-span-10 py-2">
            <InputText 
              v-model="showroom.address" 
              class="w-full text-lg border border-gray-200 rounded-md p-2" 
              placeholder="Enter address"
            />
          </div>
          <!-- Phone -->
          <label class="col-span-12 md:col-span-2 flex items-center text-lg">Phone</label>
          <div class="col-span-12 md:col-span-10 py-2">
            <InputText 
              v-model="showroom.phone" 
              class="w-full text-lg border border-gray-200 rounded-md p-2" 
              placeholder="Enter phone"
            />
          </div>
          <!-- Email -->
          <label class="col-span-12 md:col-span-2 flex items-center text-lg">Email</label>
          <div class="col-span-12 md:col-span-10 py-2">
            <InputText 
              v-model="showroom.email" 
              class="w-full text-lg border border-gray-200 rounded-md p-2" 
              placeholder="Enter email"
            />
          </div>
          <!-- Opening Hours -->
          <label class="col-span-12 md:col-span-2 flex items-center text-lg">Opening Hours</label>
          <div class="col-span-12 md:col-span-10 py-2">
            <InputText 
              v-model="showroom.opening_hours" 
              class="w-full text-lg border border-gray-200 rounded-md p-2" 
              placeholder="Enter opening hours"
            />
          </div>
          <label class="col-span-12 md:col-span-2 flex items-center text-lg">Map Link</label>
          <div class="col-span-12 md:col-span-10 py-2">
            <InputText 
              v-model="showroom.google_map_link" 
              class="w-full text-lg border border-gray-200 rounded-md p-2" 
              placeholder="Enter map link"
            />
          </div>
        </div>

        <!-- Description -->
        <div class="form-group mt-0">
          <!-- <label class="block text-gray-700 text-lg mb-2">Description</label>
          <Editor 
            v-model="showroom.description" 
            editorStyle="height: 200px" 
            @text-change="onFieldChange"
          /> -->
          <RichTextEditor v-model="showroom.description" :label="'Description'" :editorStyle="'height: 200px'" @text-change="onFieldChange"/>
        </div>
      </div>

      <!-- Right column -->
      <ShowroomSidebar v-if="showroom.showrooms_id" v-bind.showroom="showroom" />
    </div>

    <div class="loading-overlay" v-if="fb.loading['showroom.show.' + route.params.id]">
      <div class="flex justify-center items-center h-full spinner">
        <i class="pi pi-spin pi-spinner" style="font-size: 2rem;"></i>
        <p class="mt-2">Loading...</p>
      </div>
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