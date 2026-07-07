<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { PropType } from 'vue';
import { FileUploadEvent } from '@/models/File';
import { useProductStore } from '@/stores/product';
import { storeToRefs } from 'pinia';
// @ts-ignore
import UploadFileGrid from '@/components/upload/UploadFileGrid.vue';
import { useToast } from 'primevue/usetoast';
import { useModelStore } from '@/stores/designResourceModel';
import { DesignResourceDocument } from '@/models/DesignResource';

const productStore = useProductStore();
const modelStore = useModelStore();
const { fb: productFb, product } = storeToRefs(productStore);
const toast = useToast();

const acceptFileFormates = ref(`
image/*,
video/mp4,
.mp4,
.pdf,
.dwg,
.skp,
.rfa,
.max,
.zip,
.doc,
.docx,
.xls,
.xlsx,
.ppt,
.pptx,
.lcf
`);

const emit = defineEmits([
  'update:design_resource_documents', 
  'onFormatChange', 
  'update:images', 
  'add:images', 
  'delete:design_resource_documents',
  'delete-files'
]);


const props = defineProps({
  id: {
    type: Number
  },
  design_resource_documents: {
    type: Array as PropType<DesignResourceDocument[]>,
    required: true
  },
  imageStyle: { type: String, default: '' }
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
  emit('update:design_resource_documents', files);
}
const uploadImages = async (event: FileUploadEvent) => {
  // alert('test');
  console.log('uploadImages props', props.id);
  try {
    let files = event.files;
    files = files.map((file: any) => {
      let f = props.design_resource_documents.find((img: any) => img.name === file.file?.name);
      if (f) {
        file.file.format = f.format;
      }
      return file;
    });
    if (props.id) {
      const response = await modelStore.uploadFiles(files, 'models', props.id); 
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
  console.log('deleteFiles attach model', files);
  emit('delete-files', files);
}

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
  console.log('design_resource_documents ', props.design_resource_documents);
});

</script>

<template>
  <div class="flex flex-col gap-8">
    <div class="flex gap-6">
      <div class="w-full space-y-6">
        <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Model Attachments</h3>
        <UploadFileGrid 
          :url="'/api/upload'" 
          :maxFileSize="10000000" 
          :multiple="true" 
          :imageStyle="imageStyle"
          :accept="acceptFileFormates" 
          :auto="true" 
          :fb="productFb"
          :uploadedFilesData="design_resource_documents" 
          @upload="uploadImages" 
          @update:uploadedFilesData="fileSelected"
          @onFormatChange="onFormatChange($event)"
          @removeUploadedFile="deleteFile($event)"
          @delete-files="deleteFiles($event)"
          :permissions="{
                delete: true,
                copyLink: false,
                show: false,
                size: false
            }"
           />
      </div>

    </div>
  </div>
</template>