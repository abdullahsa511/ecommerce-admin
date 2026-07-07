<script setup lang="ts">
import ProductSidebar from './ProductSidebar.vue';
import { FileUploadEvent } from '@/models/File';
import { useProductStore } from '@/stores/product';
import { storeToRefs } from 'pinia';
// @ts-ignore
import UploadFileGrid from '@/components/upload/UploadFileGrid.vue';
import { useToast } from 'primevue/usetoast';
import { FileModel, IFileModel } from '@/models/Media';

const productStore = useProductStore();
const {fb: productFb, product, fb} = storeToRefs(productStore);
const toast = useToast();


const emit = defineEmits(['update:product', 'update:images', 'add:images', 'delete:image']);

const fileSelected = (files: any) => {
    if (product.value) {
       emit('update:images', files);
    }
}

const onFormatChange = async (file: any) => {
  if (!product.value) {
    return;
  }

  product.value.resources = product.value.resources.map((document: any) => {
    if (document.design_resource_document_id === file.design_resource_document_id) {
      return new FileModel(document);
    }
    return document;
  });

  await productStore.updateDocumentFormat(file);
};

const uploadImages = async (event: FileUploadEvent) => {
  try {
    let files = event.files;
    files = files.map((file: any) => {
      let f = product.value.resources.find((img: any) => img.name === file.file?.name);
      if (f) file.id = f.id;
      return file;
    });
    if (product.value.product_id) {
      const resourceFiles = await productStore.uploadProductImages(files, 'downloads', product.value.product_id);
      // product.value.resources = resourceFiles;
      const previousResources = [...product.value.resources];
      const uploadedNames = files.map((f: any) => f.file?.name);

      const filteredPreviousResources = previousResources.filter(
        (img: any) => !uploadedNames.includes(img.name)
      );
      product.value.resources = [
        ...filteredPreviousResources,
        ...resourceFiles,
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

const deleteFiles = async (files: any[]) => {
  try {
    const filesWithId = files.filter(
      (file: any) => file.design_resource_document_id
    );

    // API call only for existing images
    if (filesWithId.length > 0) {
      const response = await productStore.deleteResources(
        filesWithId,
        'downloads'
      );

      if (!response?.success) {
        throw new Error('Failed to delete images');
      }
    }

    // Remove all selected files from local store
    product.value.resources = product.value.resources.filter(
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
const deleteImage = async (
  file: any,
  property: 'images' | 'image' | 'downloads'
) => {
  try {
    if (file.design_resource_document_id) {
      const response = await productStore.deleteResources([file], property);

      if (!response?.success) {
        throw new Error('Failed to delete download');
      }
    }

    // Remove from local state
    product.value.resources = product.value.resources.filter(
      (item: any) => item !== file
    );

    emit('delete:image', file);

    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Download removed successfully',
      life: 3000,
    });
  } catch (error) {
    console.error('Error deleting download:', error);

    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to delete download. Please try again.',
      life: 3000,
    });
  }
};
</script>

<template>
  <div class="flex flex-col gap-8">
    <div class="loading-overlay" v-if="fb.loading['product.show']">
      <div class="flex justify-center items-center h-full spinner">
        <i class="pi pi-spin pi-spinner" style="font-size: 2rem;"></i>
        <p class="mt-2">Loading product Download data. Please wait.</p>
      </div>
    </div>
    <div class="flex gap-6" v-if="!fb.loading['product.show']">
        <!-- Left column -->
        <div class="w-3/4 space-y-6">
            <h2 class="text-2xl font-bold mb-4">Download</h2>
            <!-- <UploadFileGrid
                  :url="'/api/upload'"
                  :maxFileSize="1000000"
                  :multiple="true"
                  :accept="'image/*,application/pdf,.zip'" 
                  :auto="true"
                  :fb="productFb"
                  v-model:uploadedFilesData="product.resources"
                  @upload="uploadImages"
                  @update:uploadedFilesData="fileSelected"
                  @removeUploadedFile="deleteImage($event, 'downloads')"
                  @delete-files="deleteFiles($event)"
                /> -->

            <UploadFileGrid 
              :url="'/api/upload'" 
              :maxFileSize="65000000" 
              :multiple="true" 
              :accept="'image/*,application/pdf,.zip,.lcf,.rfa,.dwg,.max,.skp,.stp,.stl'" 
              :auto="true" 
              :fb="productFb"
              v-model:uploadedFilesData="product.resources" 
              @upload="uploadImages" 
              @update:uploadedFilesData="fileSelected"
              @onFormatChange="onFormatChange($event)"
              @removeUploadedFile="deleteImage($event, 'downloads')"
              @delete-files="deleteFiles($event)"
              :permissions="{
                    delete: true,
                    copyLink: false,
                    show: false,
                    size: false
                }"
              />

              <!-- <UploadFileGrid 
                  :showImageModalButton="true"
                  :fileLimit="50"
                  :showPencilButton="showPencilButton" 
                  :include-toast-host="false"
                  v-model:uploadedFilesData="folderFiles"
                  @onFormatChange="onFormatChange($event)"
                  @showImageModal="showImageModal($event)"
              /> -->

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