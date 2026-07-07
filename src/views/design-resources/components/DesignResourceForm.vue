<script setup>
import { ref, onMounted } from 'vue'

//System variables such as props, useStore or stateToRef etc
const props = defineProps({  })

//Declear emits
const emit = defineEmits({  })

//Define local variables here
const x = ref()

const y = () => {  }

//Define local methods here
const localMethod = () => {  }

//Lifecycle hook started from here
onMounted(() => {  })
</script>

<template>
  <div class="flex gap-6">
        <!-- Left column: Post Tag Form -->
        <div class="w-3/5 space-y-4">
            <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Add Document</h3>

            <div class="grid grid-cols-12 gap-x-6 gap-y-4">
                <!-- Title -->
                <label class="col-span-12 md:col-span-2 flex items-center text-lg">
                    Title
                </label>
                <div class="col-span-12 md:col-span-10 py-2">
                    <InputText v-model="document.title" class="w-full text-lg border border-gray-200 rounded-md p-2"
                        placeholder="Enter title" />
                </div>

                <!-- type -->
                <label class="col-span-12 md:col-span-2 flex items-center text-lg">Type</label>
                <div class="col-span-12 md:col-span-10 py-2">
                    <InputText v-model="document.type" class="w-full text-lg border border-gray-200 rounded-md p-2"
                        placeholder="Enter type" />
                </div>
                <!-- grade -->
                <label class="col-span-12 md:col-span-2 flex items-center text-lg">Grade</label>
                <div class="col-span-12 md:col-span-10 py-2">
                    <InputText v-model="document.grade" class="w-full text-lg border border-gray-200 rounded-md p-2"
                        placeholder="Enter grade" />
                </div>
                <!-- link text -->
                <label class="col-span-12 md:col-span-2 flex items-center text-lg">Link Text</label>
                <div class="col-span-12 md:col-span-10 py-2">
                    <InputText v-model="document.link_text"
                        class="w-full text-lg border border-gray-200 rounded-md p-2"
                        placeholder="Enter link text" />
                </div>
                <!-- brand -->
                <label class="col-span-12 md:col-span-2 flex items-center text-lg">Brand</label>
                <div class="col-span-12 md:col-span-10 py-2">
                    <InputText v-model="document.brand" class="w-full text-lg border border-gray-200 rounded-md p-2"
                        placeholder="Enter brand" />
                </div>
                <!-- hex value -->
                <label class="col-span-12 md:col-span-2 flex items-center text-lg">Hex Value</label>
                <div class="col-span-12 md:col-span-10 py-2">
                    <InputText v-model="document.hex_value"
                        class="w-full text-lg border border-gray-200 rounded-md p-2"
                        placeholder="Enter hex value" />
                </div>
                <!-- Description -->
                <label class="col-span-12 md:col-span-2 flex items-center text-lg">Description</label>
                <div class="col-span-12 md:col-span-10 py-2">
                    <Textarea v-model="document.description"
                        class="w-full text-lg border border-gray-200 rounded-md p-2"
                        placeholder="Enter description" />
                </div>

            </div>
        </div>
        <!-- right column -->
        <div class="w-2/5 space-y-4">
            <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Media</h3>
            <div class="grid grid-cols-12 gap-x-6 gap-y-4">
                <!-- img -->
                <label class="col-span-12 md:col-span-2 flex items-center text-lg">Image</label>
                <div class="col-span-12 md:col-span-10 py-2">
                    <UploadFileFeature v-model:uploadedFilesData="document.img" :fb="mediaFb" :property="'img'"
                        @upload="uploadDocumentFile($event, 'img')"
                        @removeUploadedFile="deleteDocumentFile($event, 'img')" />
                </div>
                <!-- img2 -->
                <label class="col-span-12 md:col-span-2 flex items-center text-lg">Image 2</label>
                <div class="col-span-12 md:col-span-10 py-2">
                    <UploadFileFeature v-model:uploadedFilesData="document.img2" :fb="mediaFb" :property="'img2'"
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
</template>