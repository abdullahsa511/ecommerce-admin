<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import ProjectSidebar from './ProjectSidebar.vue';
import { FileUploadEvent } from '@/models/File';
import { useProjectStore } from '@/stores/project';
import { useMediaStore } from '@/stores/media';
import { storeToRefs } from 'pinia';
// @ts-ignore
import UploadFileGrid from '@/components/upload/UploadFileGrid.vue';
import { useToast } from 'primevue/usetoast';
import { IFileModel } from '@/models/File';

const projectStore = useProjectStore();
const mediaStore = useMediaStore();
const {fb: mediaFb} = storeToRefs(mediaStore);
const {fb: projectFb, project} = storeToRefs(projectStore);
const toast = useToast();

const emit = defineEmits(['update:project', 'add:images', 'delete-files']);

interface GalleryImage {
  url: string;
}

const fileSelected = (files: any) => {
    if (project.value) {
        project.value.images = Array.isArray(files) ? [...files] : [];
    }
}

const uploadImages = async (event: FileUploadEvent) => {
    try {
        let files = event.files;
        files = files.map((file: any) => {
            let f = project.value.images.find((img: any) => img.name === file.file?.name);
            if(f) file.id = f.id;            
            return file;
        });
       const respone =  await projectStore.uploadFiles(files, 'project_images', project.value.project_id);
       
       // if(respone?.files) {
       //  emit('add:images', respone.files);
       // }
       
       if(respone?.files) {
        const previousImages = [...project.value.images];
        const uploadedNames = files.map((f: any) => f.file?.name);
        const filteredPreviousImages = previousImages.filter(
          (img: any) => !uploadedNames.includes(img.name)
        );
        project.value.images = [
          ...filteredPreviousImages,
          ...respone?.files,
        ] as IFileModel[];
       }

  
    } catch (error) {
        console.error('Error uploading images:', error);
    }
}

// Delete image handler
const deleteImage = async (file: any, property: 'images' | 'image') => {
  try {
    await projectStore.deleteProjectImage(file.project_image_id);
    project.value.images = project.value.images.filter((img: any) => img.project_image_id !== file.project_image_id);
    emit('update:project', project.value);
  
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

const deleteFiles = async (files: any) => {
  // console.log('deleteFiles edit model', files);
  try {
    const response = await projectStore.deleteMultipleImagesById(files, 'images');
    console.log('deleteFiles edit model response', response);
    if(response.success) {
      project.value.images = project.value.images.filter((project: any) => !files.some((file: any) => file.project_image_id === project.project_image_id));
    }
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Files deleted successfully',
      life: 3000
    });
  } catch (error) {
    console.error('Error deleting files:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to delete files. Please try again.',
      life: 3000
    });
  }
}

watch(() => project.value?.images, (newVal: any) => {
  console.log('Images changed:', newVal);
}, { deep: true });


const reorderImages = async (reordered: any) => {
  try {
    const response: any = await projectStore.reorderProjectImages(reordered, project.value.project_id);
    if(response) {
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Images reordered successfully',
        life: 3000
      });
      return response;
    }
  } catch (error) {
    console.error('Error reordering images:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to reorder images. Please try again.',
      life: 3000
    });
  }
}


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
                  :fb="projectFb"
                  v-model:uploadedFilesData="project.images"
                  @upload="uploadImages"
                  @update:uploadedFilesData="fileSelected"
                  @removeUploadedFile="deleteImage($event, 'images')"
                  @reorder:uploadedFiles="reorderImages"
                  @delete-files="deleteFiles($event)"
                />
        </div> 
        <!-- Right column -->
        <ProjectSidebar :isAddMode="false" />
    </div> 
  </div>
</template>