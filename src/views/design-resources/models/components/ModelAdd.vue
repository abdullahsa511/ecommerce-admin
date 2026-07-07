<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useModelStore } from '@/stores/designResourceModel';
const modelStore = useModelStore();
const { newModel, fb } = storeToRefs(modelStore);

const emit = defineEmits(['update:model', 'saved', 'editTabUnmunted', 'editTabMounted']);

onMounted(async () => {
    emit('editTabMounted');
    modelStore.resetDesignResourceModel(); //reset form for add.
});

onUnmounted(() => {
    emit('editTabUnmunted');
});

const uploadFile = async (event: any, property: 'img' | 'img2') => {
    try {
        await modelStore.uploadFiles(event.files, property, 0);
        emit('update:model', newModel.value);
    } catch (error) {
        console.error('Error uploading model file:', error);
    }
}

const deleteFile = async (event: any, property: 'img' | 'img2') => {
    try {
        // await mediaStore.deleteFile(event.file.id);
        newModel.value[property] = [] as any;
    } catch (error) {
        console.error('Error deleting model file:', error);
    }
}
</script>

<template>
    <div class="flex flex-col gap-6">
        <div class="flex flex-col md:flex-row gap-6">
            <!-- Left column: Post Tag Form -->
            <div class="sm:w-full md:w-3/5 space-y-4">
                <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Add model</h3>

                <div class="grid grid-cols-12 gap-x-6 gap-y-4">
                    <!-- Title -->
                    <label class="col-span-12  md:col-span-3 xl:col-span-2 flex items-center text-lg">
                        Title
                    </label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <InputText v-model="newModel.title" class="w-full text-lg border border-gray-200 rounded-md p-2"
                            placeholder="Enter title" :class="{'p-invalid': fb.errors?.['model.create']?.title}" />
                            <Message v-if="fb.errors?.['model.create']?.title" severity="error" size="small" variant="title">
                                <span v-for="error in fb.errors?.['model.create']?.title" :key="error" class="flex flex-col">
                                    {{ error }}
                                </span>
                            </Message>
                    </div>
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
                            placeholder="Enter description" :class="{'p-invalid': fb.errors?.['model.create']?.description}" />
                            <Message v-if="fb.errors?.['model.create']?.description" severity="error" size="small" variant="description">
                                <span v-for="error in fb.errors?.['model.create']?.description" :key="error" class="flex flex-col">
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
                        <UploadFileFeature v-model:uploadedFilesData="newModel.img" :fb="fb" :property="'img'"
                            @upload="uploadFile($event, 'img')" @removeUploadedFile="deleteFile($event, 'img')" />
                    </div>
                    <!-- img2 -->
                    <label class="w-full px-6 py-4 text-left text-lg flex justify-between items-center text-primary border-b">Image 2</label>
                    <div class="py-2">
                        <UploadFileFeature v-model:uploadedFilesData="newModel.img2" :fb="fb" :property="'img2'"
                            @upload="uploadFile($event, 'img2')" @removeUploadedFile="deleteFile($event, 'img2')" />
                    </div>
                    <!-- model File -->
                    <!-- <label class="col-span-12 md:col-span-2 flex items-center text-lg">model File</label>
                    <div class="col-span-12 md:col-span-10 py-2">
                        <UploadFileFeature v-model:uploadedFilesData="newModel.model_file" :fb="mediaFb"
                            :property="'model_file'" @upload="uploadFile($event, 'model_file')"
                            @removeUploadedFile="deleteFile($event, 'model_file')" />
                    </div> -->
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
