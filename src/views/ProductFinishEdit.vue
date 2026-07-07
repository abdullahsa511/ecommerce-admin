<script setup lang="ts">
import { ref, onMounted, computed, onBeforeUnmount } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useProductFinishStore } from '@/stores/productFinish';
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue/usetoast';
import ProductFinish from '@/models/ProductFinish';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Fluid from 'primevue/fluid';
import { useMediaStore } from '@/stores/media';
import UploadFileFeature from '@/components/upload/UploadFileFeature.vue';

const toast = useToast();
const router = useRouter();
const route = useRoute();
const productFinishStore = useProductFinishStore();
const { fb } = storeToRefs(productFinishStore);
const mediaStore = useMediaStore();

const newProductFinish = ref(new ProductFinish());
const finishId = route.params.id as string;

const serverUrl = import.meta.env.VITE_API_BASE_URL; 

const isLoading = computed(() => {
    return fb?.value?.loading === true;
});

onMounted(async () => {
    try {
        const fetchedFinish = await productFinishStore.fetchProductFinishById(finishId);
        if (!fetchedFinish) {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Product finish not found',
                life: 3000
            });
            goToProductFinishList();
            return;
        }
        
        newProductFinish.value = new ProductFinish(fetchedFinish);
        
        // Set up image data from thumbnail field
        if (fetchedFinish.thumbnail) {
            try {
                // Parse the JSON string if it's a string
                let thumbnailData;
                if (typeof fetchedFinish.thumbnail === 'string') {
                    thumbnailData = JSON.parse(fetchedFinish.thumbnail);
                } else {
                    thumbnailData = fetchedFinish.thumbnail;
                }
                
                // Handle array of image objects
                if (Array.isArray(thumbnailData) && thumbnailData.length > 0) {
                    const firstImage = thumbnailData[0];
                    newProductFinish.value.image = [{
                        name: firstImage.name || firstImage.file?.name || 'image',
                        image: firstImage.image || firstImage.file?.full_path || firstImage.objectURL,
                        objectURL: firstImage.objectURL || (firstImage.image && !firstImage.image.startsWith('http') ? serverUrl + firstImage.image : firstImage.image),
                        status: firstImage.status || { name: 'Uploaded', severity: 'success' }
                    }];
                } else if (thumbnailData.image) {
                    // Handle single image object
                    newProductFinish.value.image = [{
                        name: thumbnailData.name || 'image',
                        image: thumbnailData.image,
                        objectURL: thumbnailData.objectURL || (thumbnailData.image && !thumbnailData.image.startsWith('http') ? serverUrl + thumbnailData.image : thumbnailData.image),
                        status: thumbnailData.status || { name: 'Uploaded', severity: 'success' }
                    }];
                }
            } catch (parseError) {
                console.error('Error parsing thumbnail data:', parseError);
                // Fallback: treat as simple path
                if (fetchedFinish.thumbnail && typeof fetchedFinish.thumbnail === 'string') {
                    newProductFinish.value.image = [{
                        name: fetchedFinish.thumbnail.split('/').pop() || 'image',
                        image: fetchedFinish.thumbnail,
                        objectURL: fetchedFinish.thumbnail.startsWith('http') ? fetchedFinish.thumbnail : serverUrl + fetchedFinish.thumbnail,
                        status: { name: 'Uploaded', severity: 'success' }
                    }];
                }
            }
        } else {
            newProductFinish.value.image = [];
        }
    } catch (error) {
        console.error('Error loading product finish:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load product finish details. Please try again.',
            life: 3000
        });
        goToProductFinishList();
    }
});

const goToProductFinishList = () => {
    router.push('/ecommerce/products/finishes');
};

const updateProductFinish = async () => {
    // Basic validation
    if (!newProductFinish.value.name || !newProductFinish.value.slug) {
        toast.add({
            severity: 'error',
            summary: 'Validation Error',
            detail: 'Name and slug are required fields',
            life: 3000
        });
        return;
    }

    try {
        // Send the data normally like ProductTagAdd.vue
        await productFinishStore.updateProductFinish(finishId, newProductFinish.value);
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Product finish updated successfully',
            life: 3000
        });
        // Only redirect on success
        goToProductFinishList();
    } catch (error) {
        console.error('Error updating product finish:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update product finish. Please try again.',
            life: 3000
        });
        // Stay on the same page on failure
    }
};
const uploadImage = async (event: any, property: 'image') => {
    try {
        const response: any = await mediaStore.uploadFiles(event.files, property);
        if (response.files && response.files.length > 0) {
            newProductFinish.value.image = response.files; // for preview
            // Store the full image metadata in thumbnail field like ProductTagAdd.vue
            newProductFinish.value.thumbnail = JSON.stringify(response.files);
        }
    } catch (error) {
        console.error('Error uploading image:', error);
    }
}

const deleteImage = async (file: any, property: 'image') => {
  try {
    await mediaStore.deleteImageByFilePath(file.image, property);
    newProductFinish.value.image = [];
    newProductFinish.value.thumbnail = ''; // Clear the thumbnail field
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

onBeforeUnmount(() => {
    // No longer needed as image handling is managed by UploadFileFeature
});
</script>

<template>
    <div class="product-finish-edit">
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
                @click="updateProductFinish"
                class="p-button-md"
                :loading="isLoading"
                :disabled="isLoading"
            />
        </div>
        <div v-if="isLoading" class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
            <div class="text-center">
                <i class="pi pi-spin pi-spinner" style="font-size: 2rem;"></i>
                <p class="mt-2">Loading product finish...</p>
            </div>
        </div>
        <Fluid class="flex flex-col md:flex-row gap-8 mb-20">
            <div class="w-full relative">
                
                <div class="flex flex-col gap-6">

                    <div class="grid grid-cols-12 gap-2">
                        <label for="name" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Name</label>
                        <div class="col-span-12 md:col-span-10">
                            <InputText 
                                class="w-full text-lg" 
                                id="name" 
                                type="text" 
                                placeholder="Name" 
                                v-model="newProductFinish.name" 
                            />
                        </div>
                    </div>

                    <div class="grid grid-cols-12 gap-2">
                        <label for="slug" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Slug</label>
                        <div class="col-span-12 md:col-span-10">
                            <InputText 
                                class="w-full text-lg" 
                                id="slug" 
                                type="text" 
                                placeholder="Slug" 
                                v-model="newProductFinish.slug" 
                            />
                        </div>
                    </div>

                    <div class="grid grid-cols-12 gap-2">
                        <label for="description" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Description</label>
                        <div class="col-span-12 md:col-span-10">
                            <Textarea 
                                class="w-full text-lg" 
                                id="description" 
                                placeholder="Description" 
                                :autoResize="true" 
                                rows="3" 
                                cols="30" 
                                v-model="newProductFinish.description" 
                            />
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
                                v-model:uploadedFilesData="newProductFinish.image"
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
    </div>
</template>

<style scoped>
.product-finish-edit {
    padding: 2rem;
}

label {
    font-size: 1.2rem;
}

:deep(input::placeholder),
:deep(textarea::placeholder) {
    color: #767779 !important;
    opacity: 1;
    font-size: 1.2rem;
}
</style>
