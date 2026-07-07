<script setup lang="ts">
import { ref, onMounted, computed, onBeforeUnmount } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useProductTagStore } from '@/stores/productTag';
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue/usetoast';
import ProductTag from '@/models/ProductTag';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Fluid from 'primevue/fluid';
import { useMediaStore } from '@/stores/media';
import UploadFileFeature from '@/components/upload/UploadFileFeature.vue';

const toast = useToast();
const route = useRoute();
const newProductTag = ref(new ProductTag());
const router = useRouter();
const productTagStore = useProductTagStore();
const { fb } = storeToRefs(productTagStore);
const mediaStore = useMediaStore();
const tagId = route.params.id as string;

const serverUrl = import.meta.env.VITE_API_BASE_URL; 

const isLoading = computed(() => {
    return fb?.value?.loading === true;
});

onMounted(async () => {
    try {
        const fetchedTag = await productTagStore.fetchProductTagById(tagId);
        if (!fetchedTag) {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Product tag not found',
                life: 3000
            });
            goToProductTagList();
            return;
        }
        
        newProductTag.value = new ProductTag(fetchedTag);
        
        // Initialize image property as an array
        newProductTag.value.image = [];
        
        // Set up image data from thumbnail field
        if (fetchedTag.thumbnail) {
            try {
                // Parse the JSON string if it's a string
                let thumbnailData;
                if (typeof fetchedTag.thumbnail === 'string') {
                    thumbnailData = JSON.parse(fetchedTag.thumbnail);
                } else {
                    thumbnailData = fetchedTag.thumbnail;
                }
                
                // Handle array of image objects
                if (Array.isArray(thumbnailData) && thumbnailData.length > 0) {
                    const firstImage = thumbnailData[0];
                    newProductTag.value.image = [{
                        name: firstImage.name || firstImage.file?.name || 'image',
                        image: firstImage.image || firstImage.file?.full_path || firstImage.objectURL,
                        objectURL: firstImage.objectURL || (firstImage.image && !firstImage.image.startsWith('http') ? serverUrl + firstImage.image : firstImage.image),
                        status: firstImage.status || { name: 'Uploaded', severity: 'success' }
                    }];
                } else if (thumbnailData.image) {
                    // Handle single image object
                    newProductTag.value.image = [{
                        name: thumbnailData.name || 'image',
                        image: thumbnailData.image,
                        objectURL: thumbnailData.objectURL || (thumbnailData.image && !thumbnailData.image.startsWith('http') ? serverUrl + thumbnailData.image : thumbnailData.image),
                        status: thumbnailData.status || { name: 'Uploaded', severity: 'success' }
                    }];
                }
            } catch (parseError) {
                console.error('Error parsing thumbnail data:', parseError);
                // Fallback: treat as simple path
                if (fetchedTag.thumbnail && typeof fetchedTag.thumbnail === 'string') {
                    newProductTag.value.image = [{
                        name: fetchedTag.thumbnail.split('/').pop() || 'image',
                        image: fetchedTag.thumbnail,
                        objectURL: fetchedTag.thumbnail.startsWith('http') ? fetchedTag.thumbnail : serverUrl + fetchedTag.thumbnail,
                        status: { name: 'Uploaded', severity: 'success' }
                    }];
                }
            }
        }
    } catch (error) {
        console.error('Error loading product tag:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load product tag details. Please try again.',
            life: 3000
        });
        goToProductTagList();
    }
});

const goToProductTagList = () => {
    router.push('/ecommerce/products-tags');
};

const updateProductTag = async () => {
    // Basic validation
    if (!newProductTag.value.name || !newProductTag.value.name.trim()) {
        toast.add({
            severity: 'error',
            summary: 'Validation Error',
            detail: 'Name is required',
            life: 3000
        });
        return;
    }
    
    if (!newProductTag.value.slug || !newProductTag.value.slug.trim()) {
        toast.add({
            severity: 'error',
            summary: 'Validation Error',
            detail: 'Slug is required',
            life: 3000
        });
        return;
    }
    
    try {
        // Send the data normally like ProductFinishEdit.vue
        await productTagStore.updateProductTag(tagId, newProductTag.value);
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Product tag updated successfully',
            life: 3000
        });
        // Only redirect on success
        goToProductTagList();
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update product tag. Please try again.',
            life: 3000
        });
        // Stay on the same page on failure
    }
};

const uploadImage = async (event: any, property: 'image') => {
    try {
        const response: any = await mediaStore.uploadFiles(event.files, property);
        if (response.files && response.files.length > 0) {
            newProductTag.value.image = response.files; // for preview
            // Store the full image metadata in thumbnail field like ProductFinishEdit.vue
            newProductTag.value.thumbnail = JSON.stringify(response.files);
        }
    } catch (error) {
        console.error('Error uploading image:', error);
    }
}

const deleteImage = async (file: any, property: 'image') => {
  try {
    console.log('deleteImage called with:', { file, property });
    console.log('Current image array:', newProductTag.value.image);
    
    await mediaStore.deleteImageByFilePath(file.image, property);
    
    // Clear both image and thumbnail
    newProductTag.value.image = [];
    newProductTag.value.thumbnail = '';
    
    console.log('After deletion - image:', newProductTag.value.image, 'thumbnail:', newProductTag.value.thumbnail);
    
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

onBeforeUnmount(() => {
    // No longer needed as image handling is managed by UploadFileFeature
});
</script>

<template>
    <div class="flex justify-end gap-2 mb-6">
        <Button 
            icon="pi pi-arrow-left"
            label="Product Tag List"
            severity="secondary"
            @click="goToProductTagList"
            class="p-button-md"
            :disabled="isLoading"
        />
        <Button 
            icon="pi pi-save"
            label="Save"
            severity="primary"
            @click="updateProductTag"
            class="p-button-md"
            :loading="isLoading"
            :disabled="isLoading"
        />
    </div>
    <div v-if="isLoading" class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
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
                        <InputText v-model="newProductTag.name" class="text-lg" id="name" type="text" placeholder="Name" :disabled="isLoading" />
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="slug" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Slug</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText v-model="newProductTag.slug" class="text-lg" id="slug" type="text" placeholder="Slug" :disabled="isLoading" />
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="description" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Description</label>
                    <div class="col-span-12 md:col-span-10">
                        <Textarea v-model="newProductTag.description" class="text-lg" id="description" type="text" placeholder="Description" :disabled="isLoading" />
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
                            v-model:uploadedFilesData="newProductTag.image"
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
    font-weight: 500;
    color: #374151;
}

:deep(input::placeholder),
:deep(textarea::placeholder) {
    color: #767779 !important; /* gray-600 equivalent */
    opacity: 1;
    font-size: 1.2rem;
}

:deep(.p-inputtext),
:deep(.p-textarea) {
    border-radius: 0.5rem;
    border: 1px solid #d1d5db;
    transition: border-color 0.2s ease;
}

:deep(.p-inputtext:focus),
:deep(.p-textarea:focus) {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

:deep(.p-button) {
    border-radius: 0.5rem;
}

.warning-banner {
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    border: 1px solid #f59e0b;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
</style>
