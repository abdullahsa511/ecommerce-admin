<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { PropType } from 'vue';
import { FileUploadEvent } from '@/models/File';
import { useProductStore } from '@/stores/product';
import { useMediaStore } from '@/stores/media';
import { storeToRefs } from 'pinia';
// @ts-ignore
import UploadFileGrid from '@/components/upload/UploadFileGrid.vue';
import { useToast } from 'primevue/usetoast';
import DesignResource, { DesignResourceDocument } from '@/models/DesignResource';
import { useDocumentStore } from '@/stores/designResourceDocument';

const productStore = useProductStore();
const documentStore = useDocumentStore();
const mediaStore = useMediaStore();
const { fb: mediaFb } = storeToRefs(mediaStore);
const { fb: productFb, product } = storeToRefs(productStore);
const toast = useToast();


const emit = defineEmits(['update:product', 'onFormatChange', 'update:images', 'add:images', 'delete:design_resource_documents', 'delete-files']);


const props = defineProps({
  id: {
    type: Number
  },
  design_resource_documents: {
    type: Array as PropType<DesignResourceDocument[]>,
    required: true
  }
});


interface GalleryImage {
  url: string;
}

const images = ref<GalleryImage[]>([
  { url: 'https://images.pexels.com/photos/532220/pexels-photo-532220.jpeg' },
  { url: 'https://images.pexels.com/photos/532221/pexels-photo-532221.jpeg' },
  { url: 'https://images.pexels.com/photos/532222/pexels-photo-532222.jpeg' }
]);

const fileSelected = (files: any) => {
  if (product.value) {
    emit('update:images', files);
  }
}
const uploadImages = async (event: FileUploadEvent) => {
  // alert('test');
  console.log('uploadImages props', props.id);
  try {
    let files = event.files;
    files = files.map((file: any) => {
      let f = props.design_resource_documents.find((img: any) => img.name === file.file?.name);
      if (f) file.design_resource_document_id = f.design_resource_document_id;
      return file;
    });
    if (props.id) {
      const response = await documentStore.uploadFiles(event.files, 'documents', props.id); 
      console.log('uploadImages response', response);
      //  await productStore.uploadProductImages(files, 'product_images', product.value.product_id);
      // if (response.files) {
      //   emit('add:images', response.files);
      // }
    }
  } catch (error) {
    console.error('Error uploading images:', error);
  }
}

const deleteFiles = (files: any) => {
  emit('delete-files', files);
}

// Delete image handler
const deleteFile = async (file: any) => {
  console.log('Deleting image:', file);
  try {
    emit('delete:design_resource_documents', file);
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

const onFormatChange = (file: any) => {
  emit('onFormatChange', file);
}

onMounted(() => {
  console.log('design_resource_documents ss', props.design_resource_documents);
});
</script>

<template>
  <div class="flex flex-col gap-8">
    <div class="flex gap-6">
      <div class="w-full space-y-6">
        <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Document Attachments</h3>
        <UploadFileGrid :url="'/api/upload'" :maxFileSize="10000000" :multiple="true"
          :accept="'image/*,application/pdf'" :auto="true" :fb="productFb"
          :uploadedFilesData="design_resource_documents" 
          @upload="uploadImages" 
          @update:uploadedFilesData="fileSelected"
          @onFormatChange="onFormatChange($event)"
          @removeUploadedFile="deleteFile($event)"
          @delete-files="deleteFiles($event)"
          :permissions="{
                delete: true,
                copyLink: true,
                show: false,
                size: false,
            }"
          />
      </div>

    </div>
  </div>
</template>