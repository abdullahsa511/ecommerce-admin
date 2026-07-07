<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useDocumentStore } from '@/stores/designResourceDocument';
import DocumentAttach from './DocumentAttach.vue';
import { DesignResourceDocument } from '@/models/DesignResource';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const emit = defineEmits(['update:document', 'saved', 'editTabUnmunted', 'editTabMounted']);

const route = useRoute();
const documentStore = useDocumentStore();
const { document, fb } = storeToRefs(documentStore);
const deletingFileId = ref<number | null>(null);

const uploadDocumentFile = async (event: any, property: string) => {
    try {
        await documentStore.uploadFiles(event.files, property, route.params.id as string);
        emit('update:document', document.value);
    } catch (error) {
        console.error('Error uploading document file:', error);
    }
}

const deleteDocumentFile = async (event: any, property: 'img' | 'img2') => {
    try {
        document.value[property] = [] as any;
    } catch (error) {
        console.error('Error deleting document file:', error);
    }
}
const deleteDesignResourceDocRecord = async (file: any) => {
    try {
        console.log('deleteDesignResourceDocRecord file', file);
        deletingFileId.value = file.design_resource_document_id as number;
        await documentStore.deleteDesignResourceDocRecord(file.design_resource_document_id);
    } catch (error) {
        console.error('Error deleting design resource document record:', error);
    }
}

const onFormatChange = (file: any) => {
  document.value.design_resource_documents = document.value.design_resource_documents.map((document: any) => {
    if (document.design_resource_document_id === file.design_resource_document_id) {
     return new DesignResourceDocument(document);
    }
    return document;
  });
}

onMounted(async () => {
    emit('editTabMounted');
    if (route.params.id) {
        await documentStore.fetchDocumentById(route.params.id as string);//string data type
    }
});

onUnmounted(() => {
    emit('editTabUnmunted');
});

const deleteFiles = async (files: any) => {
  console.log('deleteFiles edit model', files);
  try {
    const response = await documentStore.deleteDocuments(files, 'documents');
    console.log('deleteFiles edit model response', response);
    if(response.success) {
      document.value.design_resource_documents = document.value.design_resource_documents.filter((document: DesignResourceDocument) => !files.some((file: any) => file.design_resource_document_id === document.design_resource_document_id));
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
</script>

<template>
    <div>
        <div class="flex flex-col gap-6">
            <div class="flex flex-col md:flex-row gap-6">
                <!-- Left column: Post Tag Form -->
                <div class="sm:w-full md:w-3/5 space-y-4 ">
                    <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Edit Document</h3>
                    <div class="grid grid-cols-12 gap-x-6 gap-y-4">
                        <!-- Title -->
                        <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">
                            Title
                        </label>
                        <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                            <InputText v-model="document.title" class="w-full text-lg border border-gray-200 rounded-md p-2"
                                placeholder="Enter title" :class="{'p-invalid': fb.errors?.['document.update.'+route.params.id]?.title}" />
                            <Message v-if="fb.errors?.['document.update.'+route.params.id]?.title" severity="error" size="small" variant="title">
                                <span v-for="error in fb.errors?.['document.update.'+route.params.id]?.title" :key="error" class="flex flex-col">
                                    {{ error }}
                                </span>
                            </Message>
                        </div>
                        <!-- grade -->
                        <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Grade</label>
                        <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                            <InputText v-model="document.grade" class="w-full text-lg border border-gray-200 rounded-md p-2"
                                placeholder="Enter grade" />
                        </div>
                        <!-- Description -->
                        <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Description</label>
                        <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                            <Textarea v-model="document.description"
                                class="w-full text-lg border border-gray-200 rounded-md p-2"
                                placeholder="Enter description" :class="{'p-invalid': fb.errors?.['document.update.'+route.params.id]?.description}" />
                                <Message v-if="fb.errors?.['document.update.'+route.params.id]?.description" severity="error" size="small" variant="description">
                                    <span v-for="error in fb.errors?.['document.update.'+route.params.id]?.description" :key="error" class="flex flex-col">
                                        {{ error }}
                                    </span>
                                </Message>
                        </div>
                    </div>
                    <div class="flex flex-col gap-6 w-full">
                        <DocumentAttach :id="document.design_resource_id as number" 
                        :design_resource_documents="document.design_resource_documents"
                        @onFormatChange="onFormatChange($event)"
                        @update:design_resource_documents="document.design_resource_documents = $event"
                        @add:design_resource_documents="document.design_resource_documents = $event" 
                        @delete:design_resource_documents="deleteDesignResourceDocRecord($event)" 
                        @delete-files="deleteFiles($event)"
                        />
                    </div>
                </div>
                <!-- right column -->
                <div class="sm:w-full md:w-3/5 space-y-4">
                    <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Media</h3>
                    <div class="flex flex-col gap-x-6 gap-y-4">
                        <!-- img -->
                        <label class="w-full px-6 py-4 text-left text-lg flex justify-between items-center text-primary border-b">Image</label>
                        <div class="py-2">
                            <UploadFileFeature v-model:uploadedFilesData="document.img" :fb="fb" :property="'img'"
                                @upload="uploadDocumentFile($event, 'img')"
                                @removeUploadedFile="deleteDocumentFile($event, 'img')" />
                        </div>
                        <!-- img2 -->
                        <label class="w-full px-6 py-4 text-left text-lg flex justify-between items-center text-primary border-b">Image 2</label>
                        <div class="py-2">
                            <UploadFileFeature v-model:uploadedFilesData="document.img2" :fb="fb" :property="'img2'"
                                @upload="uploadDocumentFile($event, 'img2')"
                                @removeUploadedFile="deleteDocumentFile($event, 'img2')" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="loading-overlay" v-if="fb.loading['document.show.'+route.params.id]">
            <div class="flex justify-center items-center h-full spinner">
                <i class="pi pi-spin pi-spinner" style="font-size: 2rem;"></i>
                <p class="mt-2">Loading document...</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Optional custom styles */
</style>
