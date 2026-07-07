<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useModelStore } from '@/stores/designResourceModel';
import ModelAttach from './ModelAttach.vue';
import { DesignResourceDocument } from '@/models/DesignResource';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const emit = defineEmits(['update:model', 'saved', 'editTabUnmunted', 'editTabMounted']);

const route = useRoute();
const modelStore = useModelStore();
const { newModel, fb } = storeToRefs(modelStore);

const deletingFileId = ref<number | null>(null);

onMounted(async () => {
    emit('editTabMounted');
    if (route.params.id) {
        await modelStore.fetchModelById(route.params.id as string);//string data type
    }
});

onUnmounted(() => {
    emit('editTabUnmunted');
});

const setDesignResourceDocuments = (documents: DesignResourceDocument[]) => {
    newModel.value.design_resource_documents = documents.map((document: DesignResourceDocument) => {
        document.resource_type = 'models';
        if(!document.format) {
            document.format = 'ZIP';
        }
        return new DesignResourceDocument(document);
    });
}

const uploadDocumentFile = async (event: any, property: 'img' | 'img2') => {
    try {
        await modelStore.uploadFiles(event.files, property, route.params.id as string);
        emit('update:model', newModel.value);
    } catch (error) {
        console.error('Error uploading model file:', error);
    }
}

const deleteDocumentFile = async (event: any, property: 'img' | 'img2') => {
    try {
        newModel.value[property] = [] as any;
    } catch (error) {
        console.error('Error deleting model file:', error);
    }
}
const deleteDesignResourceDocRecord = async (file: any) => {
    try {
        console.log('deleteDesignResourceDocRecord file', file);
        
        deletingFileId.value = file.design_resource_document_id as number;
        await modelStore.deleteDesignResourceDocRecord(file.design_resource_document_id);

    } catch (error) {
        console.error('Error deleting design resource document record:', error);
    }
}
const onFormatChange = async (file: any) => {
  newModel.value.design_resource_documents = newModel.value.design_resource_documents.map((document: any) => {
    if (document.design_resource_document_id === file.design_resource_document_id) {
     return new DesignResourceDocument(document);
    }
    return document;
  });
  await modelStore.updateDocumentFormat(file);
}
const deleteFiles = async (files: any) => {
  console.log('deleteFiles edit model', files);
  try {
    const response = await modelStore.deleteModelDocuments(files, 'models');
    console.log('deleteFiles edit model response', response);
    if(response.success) {
      newModel.value.design_resource_documents = newModel.value.design_resource_documents.filter((document: DesignResourceDocument) => !files.some((file: any) => file.design_resource_document_id === document.design_resource_document_id));
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
                <div class="sm:w-full md:w-3/5 space-y-4">
                    <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Edit Model</h3>

                    <div class="grid grid-cols-12 gap-x-6 gap-y-4">
                        <!-- Title -->
                        <label class="col-span-12  md:col-span-3 xl:col-span-2 flex items-center text-lg">
                            Title
                        </label>
                        <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                            <InputText v-model="newModel.title" class="w-full text-lg border border-gray-200 rounded-md p-2"
                                placeholder="Enter title" :class="{'p-invalid': fb.errors?.['model.update.'+route.params.id]?.title}" />
                            <Message v-if="fb.errors?.['model.update.'+route.params.id]?.title" severity="error" size="small" variant="title">
                                <span v-for="error in fb.errors?.['model.update.'+route.params.id]?.title" :key="error" class="flex flex-col">
                                    {{ error }}
                                </span>
                            </Message>
                        </div>
                        <!-- type -->
                        <!-- <label class="col-span-12 md:col-span-2 flex items-center text-lg">Type</label>
                        <div class="col-span-12 md:col-span-10 py-2">
                            <InputText v-model="newModel.type" class="w-full text-lg border border-gray-200 rounded-md p-2"
                                placeholder="Enter type" />
                        </div> -->
                        <!-- grade -->
                        <label class="col-span-12  md:col-span-3 xl:col-span-2 flex items-center text-lg">Grade</label>
                        <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                            <InputText v-model="newModel.grade" class="w-full text-lg border border-gray-200 rounded-md p-2"
                                placeholder="Enter grade" />
                        </div>
                        <!-- Description -->
                        <label class="col-span-12  md:col-span-3 xl:col-span-2 flex items-center text-lg">Description</label>
                        <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                            <Textarea v-model="newModel.description"
                                class="w-full text-lg border border-gray-200 rounded-md p-2"
                                placeholder="Enter description" :class="{'p-invalid': fb.errors?.['model.update.'+route.params.id]?.description}" />
                            <Message v-if="fb.errors?.['model.update.'+route.params.id]?.description" severity="error" size="small" variant="description">
                                <span v-for="error in fb.errors?.['model.update.'+route.params.id]?.description" :key="error" class="flex flex-col">
                                    {{ error }}
                                </span>
                            </Message>
                        </div>
                    </div>
                    
                    <div class="flex flex-col gap-6 w-full">
                        <ModelAttach 
                            :id="newModel.design_resource_id"
                            :design_resource_documents="newModel.design_resource_documents"
                            :imageStyle="'w-3/6'"
                            :loading="{field: 'design_resource_id', id: newModel.design_resource_id}" 
                            @onFormatChange="onFormatChange($event)"
                            @update:design_resource_documents="setDesignResourceDocuments($event)"
                            @add:design_resource_documents="newModel.design_resource_documents = $event" 
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
                            <UploadFileFeature v-model:uploadedFilesData="newModel.img" :fb="fb" :property="'img'"
                                @upload="uploadDocumentFile($event, 'img')"
                                @removeUploadedFile="deleteDocumentFile($event, 'img')" />
                        </div>
                        <!-- img2 -->
                        <label class="w-full px-6 py-4 text-left text-lg flex justify-between items-center text-primary border-b">Image 2</label>
                        <div class="py-2">
                            <UploadFileFeature v-model:uploadedFilesData="newModel.img2" :fb="fb" :property="'img2'"
                                @upload="uploadDocumentFile($event, 'img2')"
                                @removeUploadedFile="deleteDocumentFile($event, 'img2')" />
                        </div>
                        <!-- Document File -->
                        <!-- <label class="col-span-12 md:col-span-2 flex items-center text-lg">Document File</label>
                        <div class="col-span-12 md:col-span-10 py-2">
                            <UploadFileFeature v-model:uploadedFilesData="document.document_file" :fb="mediaFb"
                                :property="'document_file'" @upload="uploadDocumentFile($event, 'document_file')"
                                @removeUploadedFile="deleteDocumentFile($event, 'document_file')" />
                        </div> -->
                    </div>
                </div>
            </div>
        </div>
        <div class="loading-overlay" v-if="fb.loading['model.show.'+route.params.id]">
            <div class="flex justify-center items-center h-full spinner">
                <i class="pi pi-spin pi-spinner" style="font-size: 2rem;"></i>
                <p class="mt-2">Loading models...</p>
            </div>
        </div>        
    </div>
</template>

<style scoped>
/* Optional custom styles */
</style>
