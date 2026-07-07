<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useProductTypeStore } from '@/stores/productType';
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue/usetoast';
const emit = defineEmits(['update:productType', 'saved', 'editTabUnmunted', 'editTabMounted']);
const toast = useToast();
const route = useRoute();
const productTypeStore = useProductTypeStore();
const { newProductType, fb } = storeToRefs(productTypeStore);
const productTypeId = route.params.id;

const imageMediaExpanded = ref(true);

const uploadImage = async (event, property) => {
    try {
        await productTypeStore.uploadProductTypeImages(event.files, property, productTypeId);
    } catch (error) {
        console.error('Error uploading image:', error);
    }
};

const deleteImage = async (file) => {
    try {
        await productTypeStore?.deleteProductTypeImages(file.image, productTypeId);
        newProductType.value.image = [];
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

onMounted(async () => {
    emit('editTabMounted');
    await productTypeStore.fetchProductTypeById(productTypeId);
});

onUnmounted(() => {
    emit('editTabUnmunted');
});
</script>

<template>

    <div class="loading-overlay border-2" v-if="fb.loading['productType.edit.' + productTypeId]">
        <div class="flex justify-center items-center h-full spinner">
            <i class="pi pi-spin pi-spinner" style="font-size: 2rem;"></i>
            <p class="mt-2">Loading product type details. Please wait.</p>
        </div>
    </div>

    <Fluid class="flex flex-col md:flex-row gap-8 mb-20">
        <div class="w-full">

            <div class="loading-overlay border-2" v-if="fb.loading['productType.show.' + productTypeId]">
                <div class="flex justify-center items-center h-full spinner">
                    <i class="pi pi-spin pi-spinner" style="font-size: 2rem;"></i>
                    <p class="mt-2">Loading product type details. Please wait.</p>
                </div>
            </div>

            <div class="flex flex-col md:flex-row gap-6">
                <!-- Left column: Form -->
                <div class="sm:w-full md:w-3/5 space-y-4">
                    <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Edit Product Type</h3>

                    <div class="grid grid-cols-12 gap-2">
                        <label for="type" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Name</label>
                        <div class="col-span-12 md:col-span-10">
                            <InputText v-model="newProductType.name" class="text-lg" id="name" type="text"
                                placeholder="Name" :class="{ 'p-invalid': fb.errors['productType.update.' + productTypeId]?.name }" />
                            <Message v-if="fb.errors['productType.update.' + productTypeId]?.name" severity="error" size="small" variant="title">
                                <span v-for="error in fb.errors['productType.update.' + productTypeId]?.name" :key="error" class="flex flex-col">
                                    {{ error }}
                                </span>
                            </Message>
                        </div>
                    </div>

                    <div class="grid grid-cols-12 gap-2">
                        <label for="type" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Type</label>
                        <div class="col-span-12 md:col-span-10">
                            <InputText v-model="newProductType.type" class="text-lg" id="type" type="text"
                                placeholder="Type" :class="{ 'p-invalid': fb.errors['productType.update.' + productTypeId]?.type }" />
                            <Message v-if="fb.errors['productType.update.' + productTypeId]?.type" severity="error" size="small" variant="title">
                                <span v-for="error in fb.errors['productType.update.' + productTypeId]?.type" :key="error" class="flex flex-col">
                                    {{ error }}
                                </span>
                            </Message>
                        </div>
                    </div>

                    <div class="grid grid-cols-12 gap-2">
                        <label for="plural" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Plural</label>
                        <div class="col-span-12 md:col-span-10">
                            <InputText v-model="newProductType.plural" class="text-lg" id="plural" type="text"
                                placeholder="Name" :class="{ 'p-invalid': fb.errors['productType.update.' + productTypeId]?.plural }" />
                            <Message v-if="fb.errors['productType.update.' + productTypeId]?.plural" severity="error" size="small" variant="title">
                                <span v-for="error in fb.errors['productType.update.' + productTypeId]?.plural" :key="error" class="flex flex-col">
                                    {{ error }}
                                </span>
                            </Message>
                        </div>
                    </div>

                    <div class="grid grid-cols-12 gap-2">
                        <label for="icon" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Icon</label>
                        <div class="col-span-12 md:col-span-10">
                            <InputText v-model="newProductType.icon" class="text-lg" id="icon" type="text"
                                placeholder="icon-document-text-outline" :class="{ 'p-invalid': fb.errors['productType.update.' + productTypeId]?.icon }" />
                        </div>
                    </div>

                </div>

                <!-- Right column: Image / Media -->
                <div class="sm:w-full md:w-2/5 space-y-4">
                    <div class="bg-white rounded-lg shadow-sm mt-4">
                        <button @click="imageMediaExpanded = !imageMediaExpanded"
                            class="w-full sm:px-6 py-4 text-left text-lg flex justify-between items-center text-primary">
                            Product Type Images
                            <i :class="['pi', imageMediaExpanded ? 'pi-chevron-up' : 'pi-chevron-down']"></i>
                        </button>

                        <div v-if="imageMediaExpanded" class="sm:p-6 border-t">
                            <UploadFileFeature v-model:uploadedFilesData="newProductType.image" :fb="fb"
                                :property="'image'" 
                                @upload="uploadImage($event, 'image')"
                                @removeUploadedFile="deleteImage($event)" />
                        </div>
                    </div>
                </div>

            </div>
        </div>

    </Fluid>
</template>
