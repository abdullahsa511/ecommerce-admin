<script setup lang="ts">
import { defineEmits, onMounted } from 'vue';
import { FileUploadEvent } from '@/models/File';
import { useMediaStore } from '@/stores/media';
import { storeToRefs } from 'pinia';
// @ts-ignore
import UploadFileGrid from '@/components/upload/UploadFileGrid.vue';
import { useToast } from 'primevue/usetoast';
import { useShowroomStore } from '@/stores/showroom';
import { IFileModel } from '@/models/Media';
const showroomStore = useShowroomStore();
const { sectionImages, section, fb } = storeToRefs(showroomStore);
const emit = defineEmits(['update:sectionImage']);
const mediaStore = useMediaStore();
const { fb: mediaFb } = storeToRefs(mediaStore);
const toast = useToast();


const uploadImages = async (event: FileUploadEvent) => {
  try {
    let files = event.files;
    files = files.map((file: any) => {
      let f = sectionImages.value.find((img: any) => img.name === file.file?.name);
      if (f) file.id = f.project_section_images_id;
      return file;
    });
    await showroomStore.uploadShowroomImage(files, 'section-gallery', section.value.project_sections_id, section.value.showroom_id);
  } catch (error) {
    console.error('Error uploading images:', error);
  }
}

// Delete image handler
const deleteImage = async (file: IFileModel) => {

  try {
    await showroomStore.deleteSectionImage(section.value.project_sections_id, file.project_section_images_id);

    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Image removed successfully',
      life: 3000
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to delete image. Please try again.',
      life: 3000
    });
  }
};

onMounted(() => {
 
  // console.log('section image ', sectionImages);
  // showroomStore.getSectionImages(section.value.project_sections_id);

});

</script>

<template>
  <div class="flex flex-col gap-8">
    <div class="loading-overlay" v-if="fb.loading?.['showroom.section.show']">
      <div class="flex justify-center items-center h-full spinner">
          <i class="pi pi-spin pi-spinner" style="font-size: 2rem;"></i>
          <p class="mt-2">Loading images...</p>
      </div>
    </div>
    <div class="flex gap-6">
      <!-- Left column -->
      <div class="w-4/4 space-y-6 w-full">
        <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Image Gallery</h3>
        <UploadFileGrid :url="'/api/upload'" :maxFileSize="1000000" :multiple="true" :accept="'image/*'" :auto="true"
          :fb="mediaFb" v-model:uploadedFilesData="sectionImages" @upload="uploadImages"
          @removeUploadedFile="deleteImage($event)" :show-edit-button="false" />
      </div>
    </div>
  </div>
</template>

<style scoped>
#image-edit{
  display: none;
}
</style>