<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useProductTagStore } from '@/stores/productTag';
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue/usetoast';
import { useMediaStore } from '@/stores/media';
// @ts-ignore
import UploadFileFeature from '@/components/upload/UploadFileFeature.vue';

const toast = useToast();
const emit = defineEmits(['update:newTag', 'saved','editTabUnmunted', 'editTabMounted']);
const productTagStore = useProductTagStore();
const { fb, newTag } = storeToRefs(productTagStore);
const mediaStore = useMediaStore();


const uploadImage = async (event: any, property: 'image') => {
    try {
        const response: any = await mediaStore.uploadFiles(event.files, property);
        if (response.files && response.files.length > 0) {
            newTag.value.image = response.files; // for preview
            newTag.value.thumbnail = response.files[0].image; // for saving
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
    }
};
// 
const onFieldChange = (event: any) => {
    newTag.value.slug = event.target.value.toLowerCase().replace(/ /g, '-');
};
onMounted(async () => {
    emit('editTabMounted');
    productTagStore.resetProductTag(); //reset form for add.
});

onUnmounted(() => {
    emit('editTabUnmunted');
});
</script>

<template>
    <Fluid class="flex flex-col md:flex-row gap-8 mb-20">
        <div class="w-3/5">
            <div class="flex flex-col gap-6">

                <div class="grid grid-cols-12 gap-2">
                    <label for="name" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Name</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText class="w-full text-lg" id="name" type="text" placeholder="Name" v-model="newTag.name" @input="onFieldChange" 
                        :class="{'p-invalid': fb.errors?.['productTag.create']?.name}"/>
                            <Message v-if="fb.errors?.['productTag.create']?.name" severity="error" size="small" variant="title">
                                <span v-for="error in fb.errors?.['productTag.create']?.name" :key="error" class="flex flex-col">
                                    {{ error }}
                                </span>
                            </Message>
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="slug" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Slug</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText class="w-full text-lg" id="slug" type="text" placeholder="Slug" v-model="newTag.slug" 
                        :class="{'p-invalid': fb.errors?.['productTag.create']?.slug}"/>
                            <Message v-if="fb.errors?.['productTag.create']?.slug" severity="error" size="small" variant="title">
                                <span v-for="error in fb.errors?.['productTag.create']?.slug" :key="error" class="flex flex-col">
                                    {{ error }}
                                </span>
                            </Message>
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="description" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Description</label>
                    <div class="col-span-12 md:col-span-10">
                        <Textarea class="w-full text-lg" id="description" placeholder="Description" :autoResize="true" rows="3" cols="30" v-model="newTag.description" />
                    </div>
                </div>

            </div>
        </div>
        <div class="w-2/5">
            <div class="flex flex-col gap-6">
                <div class="grid grid-cols-12 gap-2">
                    <!-- <label for="thumbnail" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Thumbnail</label> -->
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