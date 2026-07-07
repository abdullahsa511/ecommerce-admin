<script setup lang="ts">
import ProductSidebar from './ProductSidebar.vue';
import { FileUploadEvent } from '@/models/File';
import { useProductStore } from '@/stores/product';
import { storeToRefs } from 'pinia';
// @ts-ignore
import UploadFileGrid from '@/components/upload/UploadFileGrid.vue';
import { useToast } from 'primevue/usetoast';
import { IFileModel } from '@/models/File';

const productStore = useProductStore();
const {fb: productFb, product, fb} = storeToRefs(productStore);
const toast = useToast();


const emit = defineEmits(['update:product', 'update:images', 'add:images', 'delete:image']);

const fileSelected = (files: any) => {
    if (product.value) {
       emit('update:images', files);
    }
}
const uploadImages = async (event: FileUploadEvent) => {
  try {
    let files = event.files;
    files = files.map((file: any) => {
      let f = product.value.images.find((img: any) => img.name === file.file?.name);
      if (f) file.id = f.id;
      return file;
    });
    if (product.value.product_id) {
      const certificateFiles = await productStore.uploadProductImages(files, 'certificates', product.value.product_id);
      // product.value.images = certificateFiles;
      const previousImages = [...product.value.certificates];
      const uploadedNames = files.map((f: any) => f.file?.name);

      const filteredPreviousImages = previousImages.filter(
        (img: any) => !uploadedNames.includes(img.name)
      );
      product.value.certificates = [
        ...filteredPreviousImages,
        ...certificateFiles,
      ] as IFileModel[];
    }

    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Files Updated successfully',
      life: 3000
    });
  } catch (error) {
    console.error('Error uploading images:', error);
  }
}

const deleteFile = async (file: any) => {
  deleteFiles([file]);
}

const deleteFiles = async (files: any[]) => {
  try {
    const filesWithId = files.filter(
      (file: any) => file.product_certificate_id
    );

    // API call only for existing images
    const response = await productStore.deleteCertificates(
        files,
        'certificates',
        product.value.product_id

      );
    // if (filesWithId.length > 0) {
 

    //   if (!response?.success) {
    //     throw new Error('Failed to delete images');
    //   }
    // }

    // Remove all selected files from local store
    product.value.certificates = product.value.certificates.filter(
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
const deleteImage = async (file: any, property: 'images' | 'image' | 'certificates') => {
  console.log('Deleting image:', file);
  try {
    await productStore.deleteProductImage(file.product_image_id);
    emit('delete:image', file);
  
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

</script>

<template>
  <div class="flex flex-col gap-8">
    <div class="loading-overlay" v-if="fb.loading['product.show']">
      <div class="flex justify-center items-center h-full spinner">
        <i class="pi pi-spin pi-spinner" style="font-size: 2rem;"></i>
        <p class="mt-2">Loading product Certificate data. Please wait.</p>
      </div>
    </div>
    <div class="flex gap-6" v-if="!fb.loading['product.show']">
        <!-- Left column -->
        <div class="w-3/4 space-y-6">
            <h2 class="text-2xl font-bold mb-4">Certificate</h2>
            <UploadFileGrid
                  :url="'/api/upload'"
                  :maxFileSize="1000000"
                  :multiple="true"
                  :accept="'image/*,.pdf,application/pdf'"
                  :auto="true"
                  :fb="productFb"
                  v-model:uploadedFilesData="product.certificates"
                  @upload="uploadImages"
                  @update:uploadedFilesData="fileSelected"
                  @removeUploadedFile="deleteFile($event)"
                  @delete-files="deleteFiles($event)"
                />

        </div> 
        <!-- Right column -->
        <ProductSidebar :product="product" />
    </div> 
  </div>
</template>

<style scoped>
.way-points-button> button {
  margin-left: 80px !important;
}

</style>