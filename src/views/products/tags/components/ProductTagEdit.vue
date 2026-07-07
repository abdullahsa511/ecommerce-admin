<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useProductTagStore } from '@/stores/productTag';
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue/usetoast';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Fluid from 'primevue/fluid';
import { useMediaStore } from '@/stores/media';
// @ts-ignore
import UploadFileFeature from '@/components/upload/UploadFileFeature.vue';

const props = defineProps<{ id?: string }>();
const emit = defineEmits(['update:newTag', 'saved','editTabUnmunted', 'editTabMounted']);
const toast = useToast();
const route = useRoute();
const productTagStore = useProductTagStore();
const { fb, newTag } = storeToRefs(productTagStore);
const mediaStore = useMediaStore();

const uploadImage = async (event: any, property: 'image') => {
    try {
        const response: any = await mediaStore.uploadFiles(event.files, property);
        if (response.files && response.files.length > 0) {
            newTag.value.image = response.files; // for preview
            newTag.value.thumbnail = JSON.stringify(response.files);
        }
    } catch (error) {
        console.error('Error uploading image:', error);
    }
}

const deleteImage = async (file: any, property: 'image') => {
  try {
    await mediaStore.deleteImageByFilePath(file.image, property);
    newTag.value.image = [];
    
    toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Image deleted successfully',
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

const onFieldChange = (event: any) => {
    newTag.value.name = event.target.value;
    newTag.value.slug = event.target.value.toLowerCase().replace(/ /g, '-');
}
onMounted(async () => {
    emit('editTabMounted');
    await productTagStore.fetchProductTagById(route.params.id as string); // fetch the tag data
});

onUnmounted(() => {
    emit('editTabUnmunted');
});
</script>

<template>
    <div v-if="fb.loading['productTag.edit.' + newTag.tag_id]" class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
        <div class="text-center">
            <i class="pi pi-spin pi-spinner" style="font-size: 2rem;"></i>
            <p class="mt-2">Loading product tag...</p>
        </div>
    </div>
    <Fluid class="flex flex-col md:flex-row gap-8 mb-20">
        <div class="w-full relative">
            <div class="flex flex-col gap-6">
                <div class="grid grid-cols-12 gap-2">
                    <label for="name" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Name</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText v-model="newTag.name" class="text-lg" id="name" type="text" placeholder="Name" @input="onFieldChange"
                         :class="{ 'p-invalid': fb.errors['productTag.update.' + newTag.tag_id]?.name }" />
                        <Message v-if="fb.errors['productTag.update.' + newTag.tag_id]?.name" severity="error" size="small" variant="title">
                            <span v-for="error in fb.errors['productTag.update.' + newTag.tag_id].name" :key="error" class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="slug" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Slug</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText v-model="newTag.slug" class="text-lg" id="slug" type="text" placeholder="Slug"
                         :class="{ 'p-invalid': fb.errors['productTag.update.' + newTag.tag_id]?.slug }" />
                        <Message v-if="fb.errors['productTag.update.' + newTag.tag_id]?.slug" severity="error" size="small" variant="title">
                            <span v-for="error in fb.errors['productTag.update.' + newTag.tag_id].slug" :key="error" class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>
                </div>
                <div class="grid grid-cols-12 gap-2">
                    <label for="description" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Description</label>
                    <div class="col-span-12 md:col-span-10">
                        <Textarea v-model="newTag.description" class="text-lg" id="description" type="text" placeholder="Description" />
                    </div>
                </div>
            </div>
        </div>
        <div class="md:w-1/2">
            <div class="flex flex-col gap-6">
                <div class="grid grid-cols-12 gap-2">
                    <div class="w-full col-span-12 flex flex-col items-start">
                        <UploadFileFeature 
                            v-model:uploadedFilesData="newTag.image"
                            :fb="fb"
                            :property="'image'"
                            @upload="uploadImage($event, 'image')"
                            @removeUploadedFile="deleteImage($event, 'image')"
                        />
                    </div>
                </div>
            </div>
        </div>
    </Fluid>
</template>
