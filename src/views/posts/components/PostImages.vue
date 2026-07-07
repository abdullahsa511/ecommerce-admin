<script setup lang="ts">
import PostSidebar from './PostSidebar.vue';
import { FileUploadEvent } from '@/models/File';
import { usePostStore } from '@/stores/post';
import { useMediaStore } from '@/stores/media';
import { storeToRefs } from 'pinia';
// @ts-ignore
import UploadFileGrid from '@/components/upload/UploadFileGrid.vue';
import { useToast } from 'primevue/usetoast';
import { IFileModel } from '@/models/File';

const emit = defineEmits(['update:post']);


const postStore = usePostStore();
const mediaStore = useMediaStore();
const {fb: mediaFb} = storeToRefs(mediaStore);
const {fb: postFb, post} = storeToRefs(postStore);
const toast = useToast();


const uploadImages = async (event: FileUploadEvent) => {
  try {
      let files = event.files;
      files = files.map((file: any) => {
          let f = post.value.images.find((img: any) => img.name === file.file?.name);
          if(f) file.id = f.id;            
          return file;
      });
      // await postStore.uploadFiles(files, 'images', post.value.post_id);
      // new logic to handle the images
      const response = await postStore.uploadFiles(files, 'images', post.value.post_id);
      // post.value.images = response;
      const previousImages = [...post.value.images];
      const uploadedNames = files.map((f: any) => f.file?.name);

      const filteredPreviousImages = previousImages.filter(
        (img: any) => !uploadedNames.includes(img.name)
      );
      post.value.images = [
        ...filteredPreviousImages,
        ...response,
      ] as IFileModel[];


      if(response){
        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Files upload successfully',
          life: 3000
        });
      }else{
        toast.add({
          severity: 'dander',
          summary: 'Danger',
          detail: 'Fail to upload',
          life: 3000
        });
      }


      // if(response?.files) {
      //   const previousImages = [...post.value.images];
      //   const uploadedNames = files.map((f: any) => f.file?.name);
      //   const filteredPreviousImages = previousImages.filter(
      //     (img: any) => !uploadedNames.includes(img.name)
      //   );
      //   post.value.images = [
      //     ...filteredPreviousImages,
      //     ...response?.files,
      //   ] as IFileModel[];
      // }
      // new logic to handle the images ends here

  } catch (error) {
      console.error('Error uploading images:', error);
  }
}

const deleteFiles = async (files: any) => {
  try {

    const filesWithId = files.filter(
      (file: any) => file.post_image_id
    );

    // API call only for existing images
    // API call only for existing images
    if (filesWithId.length > 0) {
      const response = await postStore.deleteGalleryImage(
        filesWithId,
        'images'
      );

      if (!response?.success) {
        throw new Error('Failed to delete images');
      }
    }


    //   const response = await postStore.deleteGalleryImage(files, 'images')
    // if(response.success){
    //     post.value.images = post.value.images.filter(
    //     (img: any) =>
    //       !files.some(
    //         (file: any) => file.post_image_id === img.post_image_id
    //       )
    //   );
    // }
    
    // Remove all selected files from local store
    post.value.images = post.value.images.filter(
      (img: any) =>
        !files.some((file: any) => file === img)
    );


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
};


// Delete image handler
const deleteImage = async (file: any, property: 'images' | 'image') => {
  console.log('Deleting image:', file);
  try {
    await postStore.deletePostImage(file.post_image_id);
    post.value.images = post.value.images.filter((img: any) => img.post_image_id !== file.post_image_id);
    emit('update:post', post.value);
  
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

const reorderImages = async (reordered: any) => {
  // console.log('reorderImages post images', reordered);
  try {
    const response: any = await postStore.reorderPostImages(reordered, post.value.post_id);
    if(response) {
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Images reordered successfully',
        life: 3000
      });
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
    <div class="flex flex-col md:flex-row gap-6">
        <!-- Left column -->
        <div class="sm:w-full md:w-3/5 space-y-4">
            <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Image Gallery</h3>
            <UploadFileGrid
                  :url="'/api/upload'"
                  :maxFileSize="1000000"
                  :multiple="true"
                  :accept="'image/*'"
                  :auto="true"
                  :fb="mediaFb"
                  v-model:uploadedFilesData="post.images"
                  @upload="uploadImages"
                  @removeUploadedFile="deleteImage($event, 'images')"
                  @reorder:uploadedFiles="reorderImages"
                  @delete-files="deleteFiles($event)"
                />
        </div> 
        <!-- Right column -->
        <PostSidebar  />
    </div> 
  </div>
</template>