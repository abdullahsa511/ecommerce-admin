<script setup lang="ts">
import { defineEmits, onMounted } from 'vue';
// import { useRouter } from 'vue-router';
import { useMediaStore } from '@/stores/media';
import { storeToRefs } from 'pinia';
// @ts-ignore
import UploadFileGrid from '@/components/upload/UploadFileGrid.vue';
import { useToast } from 'primevue/usetoast';
import { useShowroomStore } from '@/stores/showroom';
const showroomStore = useShowroomStore();
const { fb, sectionImages, section } = storeToRefs(showroomStore);
import { SectionImage } from '@/models/Showroom';
const emit = defineEmits(['update:post']);
// const router = useRouter();
const mediaStore = useMediaStore();
const { fb: mediaFb } = storeToRefs(mediaStore);
const toast = useToast();

const uploadSidebarMediaImage = async (event: any, property: string) => {
  // console.log(sectionImages);
  try {
    await showroomStore.uploadShowroomImage(event.files, property, section.value.project_sections_id);
  } catch (error) {
    console.error('Error uploading site logo:', error);
  }
};

// Delete image handler
const deleteSectionImage = async (data: SectionImage) => {
  try {
    await showroomStore.deleteSectionImage(data.section_id, data.project_section_images_id);
    // remove file from card

    toast.add({ severity: 'success', summary: 'Success', detail: 'Product deleted successfully', life: 3000 });
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete product.', life: 3000 });
  }
};


onMounted(() => {
  setTimeout(() => {
    // console.log('section id ', section.value.project_sections_id);
    showroomStore.getSectionImages(section.value.project_sections_id);
  }, 1000); // 1 second delay
});
</script>

<template>
  <div class="flex flex-col gap-8">
    <div class="flex gap-6">
      <div>
        <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Image Gallery</h3>
        <!-- @removeUploadedFile="deleteImage($event, 'image')" -->
        <UploadFileGrid :url="'/api/upload'" :maxFileSize="1000000" :multiple="true" :accept="'image/*'" :auto="true"
          :fb="mediaFb" v-model:uploadedFilesData="sectionImages.image"
          @upload="uploadSidebarMediaImage($event, 'section-gallery')"
           />
      </div>

    </div>
    <div>
      <h2 class="text-xl font-semibold mb-4">Section Images</h2>

      <!-- Loading state -->
      <div v-if="fb.loading.showroom" class="text-center py-10 text-gray-500">
        Loading images...
      </div>

      <!-- Empty state -->
      <div v-else-if="!sectionImages.length" class="text-center py-10 text-gray-500">
        No images found.
      </div>

      <!-- Card grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div v-for="item in sectionImages" :key="item.project_section_images_id"
          class="relative bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition">

          <!-- Edit/Delete buttons -->
          <div class="absolute top-2 right-2 flex gap-1 z-10 bg-white">
            <Button icon="pi pi-trash" severity="danger" size="small" class="bg-white text-white hover:bg-red-600"
              @click="deleteSectionImage(item)" />
            <!-- <Button icon="pi pi-trash" rounded outlined severity="danger" size="small"
            @click="deleteSectionImage(item)" /> -->
          </div>

          <!-- Image preview -->
          <div class="p-2 flex justify-center">
            <img v-if="item.image && item.image.length" :src="item.image[0].objectURL" alt="Section Image"
              class="w-full h-40 object-cover rounded" />
            <span v-else class="text-gray-400">No Image</span>
          </div>

          <!-- Info -->
          <div class="p-4 space-y-2">
            <div class="flex justify-between items-center">
              <span class="font-semibold text-gray-700">Sort Order:</span>
              <span>{{ item.sort_order ?? '—' }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="font-semibold text-gray-700">Created:</span>
              <span>{{ item.created_at ? new Date(item.created_at).toLocaleDateString() : '—' }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="font-semibold text-gray-700">Status:</span>
              <Tag :value="item.status?.active ? 'Active' : 'Inactive'"
                :severity="item.status?.active ? 'success' : 'danger'" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>