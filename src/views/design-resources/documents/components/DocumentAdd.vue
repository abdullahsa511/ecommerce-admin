<script setup lang="ts">
import { ref, defineEmits, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useDocumentStore } from '@/stores/designResourceDocument';

const documentStore = useDocumentStore();
const { document, fb } = storeToRefs(documentStore);
const emit = defineEmits(['update:document', 'saved']);

const uploadDocumentFile = async (event: any, property: 'img' | 'img2') => {
    try {
        await documentStore.uploadFiles(event.files, property, 0);
        emit('update:document', document.value);
    } catch (error) {
        console.error('Error uploading document file:', error);
    }
}

const deleteDocumentFile = async (event: any, property: 'img' | 'img2') => {
    try {
        // await mediaStore.deleteFile(event.file.id);
        document.value[property] = [] as any;
    } catch (error) {
        console.error('Error deleting document file:', error);
    }
}

onMounted(async () => {
    documentStore.resetDocument(); //reset form for add.
});
</script>

<template>
    <div class="flex flex-col gap-6">
        <div class="flex flex-col md:flex-row gap-6">
            <!-- Left column: Post Tag Form -->
            <div class="sm:w-full md:w-3/5 space-y-4">
                <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Add Document</h3>

                <div class="grid grid-cols-12 gap-x-6 gap-y-4">
                    <!-- Title -->
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">
                        Title
                    </label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <InputText v-model="document.title" class="w-full text-lg border border-gray-200 rounded-md p-2"
                            placeholder="Enter title" :class="{'p-invalid': fb.errors?.['document.create']?.title}" />
                            <Message v-if="fb.errors?.['document.create']?.title" severity="error" size="small" variant="title">
                                <span v-for="error in fb.errors?.['document.create']?.title" :key="error" class="flex flex-col">
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
                            placeholder="Enter description" :class="{'p-invalid': fb.errors?.['document.create']?.description}" />
                            <Message v-if="fb.errors?.['document.create']?.description" severity="error" size="small" variant="description">
                                <span v-for="error in fb.errors?.['document.create']?.description" :key="error" class="flex flex-col">
                                    {{ error }}
                                </span>
                            </Message>
                    </div>
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
</template>

<style scoped></style>
