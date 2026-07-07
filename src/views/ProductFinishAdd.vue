<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useProductFinishStore } from '@/stores/productFinish';
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue/usetoast';
import ProductFinish from '@/models/ProductFinish';
import { useMediaStore } from '@/stores/media';
import UploadFileFeature from '@/components/upload/UploadFileFeature.vue';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Fluid from 'primevue/fluid';

const toast = useToast();
const newFinish = ref<ProductFinish>(new ProductFinish({
    finish_id: null,
    thumbnail: '',
    name: '',
    slug: '',
    description: '',
    date_added: new Date().toISOString(),
    date_updated: new Date().toISOString()
}));

const router = useRouter();
const productFinishStore = useProductFinishStore();
const { fb } = storeToRefs(productFinishStore);
const mediaStore = useMediaStore();

onMounted(async () => {
    // Initialize any required data
});

const goToProductFinishList = () => {
    router.push('/ecommerce/products/finishes');
};

const saveFinish = async () => {
    try {
        await productFinishStore.createProductFinish(newFinish.value);
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Product finish created successfully',
            life: 3000
        });
        goToProductFinishList();
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create product finish. Please try again.',
            life: 3000
        });
    }
};

const uploadImage = async (event: any, property: 'image') => {
    try {
        const response: any = await mediaStore.uploadFiles(event.files, property);
        if (response.files && response.files.length > 0) {
            newFinish.value.image = response.files; // for preview
            // Store the full image metadata in thumbnail field like ProductTagAdd.vue
            newFinish.value.thumbnail = JSON.stringify(response.files);
        }
    } catch (error) {
        console.error('Error uploading image:', error);
    }
}

const deleteImage = async (file: any, property: 'image') => {
    try {
        await mediaStore.deleteImageByFilePath(file.image, property);
        newFinish.value.image = [];
        newFinish.value.thumbnail = ''; // Clear the thumbnail field
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
</script>

<template>
    <div class="flex justify-end gap-2 mb-6">
        <Button 
            icon="pi pi-arrow-left"
            label="Product Finish List"
            severity="secondary"
            @click="goToProductFinishList"
            class="p-button-md"
        />
        <Button 
            icon="pi pi-save"
            label="Save"
            severity="primary"
            @click="saveFinish"
            class="p-button-md"
        />
    </div>
    <Fluid class="flex flex-col md:flex-row gap-8 mb-20">
        <div class="md:w-1/2">
            <div class="flex flex-col gap-6">

                <div class="grid grid-cols-12 gap-2">
                    <label for="name" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Name</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText class="w-full text-lg" id="name" type="text" placeholder="Name" v-model="newFinish.name" />
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="slug" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Slug</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText class="w-full text-lg" id="slug" type="text" placeholder="Slug" v-model="newFinish.slug" />
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="description" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Description</label>
                    <div class="col-span-12 md:col-span-10">
                        <Textarea class="w-full text-lg" id="description" placeholder="Description" :autoResize="true" rows="3" cols="30" v-model="newFinish.description" />
                    </div>
                </div>

            </div>
        </div>
        <div class="md:w-1/2">

            <div class="card flex flex-col gap-6">

                <div class="grid grid-cols-12 gap-2">
                    <label for="thumbnail" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Thumbnail</label>
                    <div class="col-span-12 md:col-span-10 flex flex-col items-start">
                        <UploadFileFeature 
                            v-model:uploadedFilesData="newFinish.image"
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

<style scoped>
label {
    font-size: 1.2rem;
}
:deep(input::placeholder),
:deep(textarea::placeholder) {
    color: #767779 !important; /* gray-600 equivalent */
    opacity: 1;
    font-size: 1.2rem;
}
</style>
