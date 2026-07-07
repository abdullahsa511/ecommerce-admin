<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useProductTagStore } from '@/stores/productTag';
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue/usetoast';
import ProductTag from '@/models/ProductTag';
import { useMediaStore } from '@/stores/media';
import UploadFileFeature from '@/components/upload/UploadFileFeature.vue';

const toast = useToast();
const newTag = ref<ProductTag>(new ProductTag({
    tag_id: null,
    thumbnail: '',
    name: '',
    slug: '',
    description: '',
    date_added: new Date().toISOString(),
    date_updated: new Date().toISOString()
}));

const router = useRouter();
const productTagStore = useProductTagStore();
const { fb } = storeToRefs(productTagStore);
const mediaStore = useMediaStore();

onMounted(async () => {
    // Initialize any required data
});

const goToProductTagList = () => {
    router.push('/ecommerce/products-tags');
};

const saveTag = async () => {
    try {
        await productTagStore.createProductTag(newTag.value);
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Product tag created successfully',
            life: 3000
        });
        goToProductTagList();
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create product tag. Please try again.',
            life: 3000
        });
    }
};

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
</script>

<template>
    <div class="flex justify-end gap-2 mb-6">
        <Button 
            icon="pi pi-arrow-left"
            label="Product Tag List"
            severity="secondary"
            @click="goToProductTagList"
            class="p-button-md"
        />
        <Button 
            icon="pi pi-save"
            label="Save"
            severity="primary"
            @click="saveTag"
            class="p-button-md"
        />
    </div>
    <Fluid class="flex flex-col md:flex-row gap-8 mb-20">
        <div class="md:w-1/2">
            <div class="flex flex-col gap-6">

                <div class="grid grid-cols-12 gap-2">
                    <label for="name" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Name</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText class="w-full text-lg" id="name" type="text" placeholder="Name" v-model="newTag.name" />
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="slug" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Slug</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText class="w-full text-lg" id="slug" type="text" placeholder="Slug" v-model="newTag.slug" />
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
        <div class="md:w-1/2">

            <div class="card flex flex-col gap-6">

                <div class="grid grid-cols-12 gap-2">
                    <label for="thumbnail" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Thumbnail</label>
                    <div class="col-span-12 md:col-span-10 flex flex-col items-start">
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
