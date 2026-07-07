<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import ShowroomSidebar from './ShowroomSidebar.vue';
import { FileUploadEvent } from '@/models/File';
import { useShowroomStore } from '@/stores/showroom';
import { useMediaStore } from '@/stores/media';
import { storeToRefs } from 'pinia';
// @ts-ignore
import UploadFileGrid from '@/components/upload/UploadFileGrid.vue';
import { useToast } from 'primevue/usetoast';

const showroomStore = useShowroomStore();
const mediaStore = useMediaStore();
const {fb: mediaFb} = storeToRefs(mediaStore);
const {fb: showroomFb, showroom} = storeToRefs(showroomStore);
const toast = useToast();

const emit = defineEmits(['update:showroom', 'add:images']);

interface GalleryImage {
  url: string;
}

const images = ref<GalleryImage[]>([
  { url: 'https://images.pexels.com/photos/532220/pexels-photo-532220.jpeg' },
  { url: 'https://images.pexels.com/photos/532221/pexels-photo-532221.jpeg' },
  { url: 'https://images.pexels.com/photos/532222/pexels-photo-532222.jpeg' }
]);

function editImage(idx: number) {
  // Implement edit logic
}


function addImage() {
  // Implement add logic (e.g., open file dialog)
}

const fileSelected = (files: any) => {
    if (showroom.value) {
        showroom.value.images = Array.isArray(files) ? [...files] : [];
    }
}

const uploadImages = async (event: FileUploadEvent) => {
    try {
        let files = event.files;
        files = files.map((file: any) => {
            let f = showroom.value.images.find((img: any) => img.name === file.file?.name);
            if(f) file.id = f.id;            
            return file;
        });
       const respone =  await showroomStore.uploadFiles(files, 'showroom_images', showroom.value.showroom_id);
       if(respone.files) {
        emit('add:images', respone.files);
       }
    } catch (error) {
        console.error('Error uploading images:', error);
    }
}

// Delete image handler
const deleteImage = async (file: any, property: 'images' | 'image') => {
  try {
    await showroomStore.deleteShowroomImage(file.showroom_image_id);
    showroom.value.images = showroom.value.images.filter((img: any) => img.showroom_image_id !== file.showroom_image_id);
    emit('update:showroom', showroom.value);
  
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

watch(() => showroom.value?.images, (newVal: any) => {
  console.log('Images changed:', newVal);
}, { deep: true });


</script>

<template>
  <div class="flex flex-col gap-8">
    <div class="flex gap-6">
        <!-- Left column -->
        <div class="w-3/4 space-y-6">
            <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Image Gallery</h3>
            <UploadFileGrid
                  :url="'/api/upload'"
                  :maxFileSize="1000000"
                  :multiple="true"
                  :accept="'image/*'"
                  :auto="true"
                  :fb="showroomFb"
                  v-model:uploadedFilesData="showroom.images"
                  @upload="uploadImages"
                  @update:uploadedFilesData="fileSelected"
                  @removeUploadedFile="deleteImage($event, 'images')"
                />
        </div> 
        <!-- Right column -->
        <ShowroomSidebar />
    </div> 
  </div>
</template>