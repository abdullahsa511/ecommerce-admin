<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useFinishStore } from '@/stores/designResourceFinish';

const emit = defineEmits(['update:finish', 'saved', 'editTabUnmunted', 'editTabMounted']);

const route = useRoute();
const finishStore = useFinishStore();
const { finish, fb } = storeToRefs(finishStore);
// drop down data
const types = ref<any[] | null>(null);
const selectedType = ref<any | null>(null);

onMounted(async () => {
    emit('editTabMounted');
    if (route.params.id) {
        await finishStore.fetchFinishById(route.params.id as string);//string data type
    }
    const data = await finishStore.getTypes();
    types.value = data as unknown as any[];
    if (finish.value.type) {
        selectedType.value = types.value.find(t => t.name === finish.value.type)?.id;
    } else {
        selectedType.value = types.value[0]?.id;
    }
});

watch(selectedType, (newVal) => {
    if (newVal && types.value) {
        console.log('selectedType', newVal);
        console.log('types', types.value);
        finish.value.type = types.value && types.value.find((t: any) => t.id === newVal)?.name;
    }
}, { immediate: true });

onUnmounted(() => {
    emit('editTabUnmunted');
});

const uploadDocumentFile = async (event: any, property: 'img' | 'img2' | 'image_thumb_url') => {
    try {
        await finishStore.uploadFiles(event.files, property, route.params.id as string);
        emit('update:finish', finish.value);
    } catch (error) {
        console.error('Error uploading finish file:', error);
    }
}

const deleteDocumentFile = async (event: any, property: 'img' | 'img2' | 'image_thumb_url') => {
    try {
        // await finishStore.uploadFiles(event.files, property, route.params.id as string);
        finish.value[property] = [] as any;
    } catch (error) {
        console.error('Error deleting finish file:', error);
    }
}
</script>

<template>
    <div class="flex flex-col gap-6">
        
        <div class="flex flex-col md:flex-row gap-6">
            <!-- Left column: Post Tag Form -->
            <div class="sm:w-full md:w-3/5 space-y-4">
                <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Edit Finish</h3>

                <div class="grid grid-cols-12 gap-x-6 gap-y-4">
                    <!-- Title -->
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">
                        Title
                    </label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <InputText v-model="finish.title" class="w-full text-lg border border-gray-200 rounded-md p-2"
                            placeholder="Enter title" :class="{'p-invalid': fb.errors?.['finish.update.'+route.params.id]?.title}" />
                        <Message v-if="fb.errors?.['finish.update.'+route.params.id]?.title" severity="error" size="small" variant="title">
                            <span v-for="error in fb.errors?.['finish.update.'+route.params.id]?.title" :key="error" class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>
                    <!-- type -->
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Type</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <Select v-model="selectedType" :options="types as any[]" optionLabel="name" optionValue="id"
                            class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Select a type" filter
                            filterPlaceholder="Search type..." @update:modelValue="finish.type = types.find((t: any) => t.id === selectedType)?.name" />
                    </div>
                    <!-- grade -->
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Grade</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <InputText v-model="finish.grade" class="w-full text-lg border border-gray-200 rounded-md p-2"
                            placeholder="Enter grade" />
                    </div>
                    <!-- link text -->
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Link Text</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <InputText v-model="finish.link_text"
                            class="w-full text-lg border border-gray-200 rounded-md p-2"
                            placeholder="Enter link text" />
                    </div>
                    <!-- brand -->
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Brand</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <InputText v-model="finish.brand" class="w-full text-lg border border-gray-200 rounded-md p-2"
                            placeholder="Enter brand" />
                    </div>
                    <!-- hex value -->
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Hex Value</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <InputText v-model="finish.hex_value"
                            class="w-full text-lg border border-gray-200 rounded-md p-2"
                            placeholder="Enter hex value" />
                    </div>
                    <!-- Description -->
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Description</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <Textarea v-model="finish.description"
                            class="w-full text-lg border border-gray-200 rounded-md p-2"
                            placeholder="Enter description" :class="{'p-invalid': fb.errors?.['finish.update.'+route.params.id]?.description}" />
                            <Message v-if="fb.errors?.['finish.update.'+route.params.id]?.description" severity="error" size="small"
                            variant="description">
                            <span v-for="error in fb.errors?.['finish.update.'+route.params.id]?.description" :key="error"
                                class="flex flex-col">
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
                    <!-- image thumbnail -->
                    <!-- <label class="w-full px-6 py-4 text-left text-lg flex justify-between items-center text-primary border-b">Image Thumbnail</label>
                    <div class="py-2">
                        <UploadFileFeature v-model:uploadedFilesData="finish.image_thumb_url" :fb="fb" :property="'image_thumb_url'"
                            @upload="uploadDocumentFile($event, 'image_thumb_url')"
                            @removeUploadedFile="deleteDocumentFile($event, 'image_thumb_url')" />
                    </div> -->
                    <!-- img -->
                    <label class="w-full px-6 py-4 text-left text-lg flex justify-between items-center text-primary border-b">Image</label>
                    <div class="py-2">
                        <UploadFileFeature v-model:uploadedFilesData="finish.img" :fb="fb" :property="'img'"
                            @upload="uploadDocumentFile($event, 'img')"
                            @removeUploadedFile="deleteDocumentFile($event, 'img')" />
                    </div>
                    <!-- img2 -->
                    <label class="w-full px-6 py-4 text-left text-lg flex justify-between items-center text-primary border-b">Image 2</label>
                    <div class="py-2">
                        <UploadFileFeature v-model:uploadedFilesData="finish.img2" :fb="fb" :property="'img2'"
                            @upload="uploadDocumentFile($event, 'img2')"
                            @removeUploadedFile="deleteDocumentFile($event, 'img2')" />
                    </div>
                </div>
            </div>
        </div>
        <div class="loading-overlay" v-if="fb.loading['finish.edit.'+ route.params.id]">
            <div class="flex justify-center items-center h-full spinner">
                <i class="pi pi-spin pi-spinner" style="font-size: 2rem;"></i>
                <p class="mt-2">Loading finish...</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Optional custom styles */
</style>
