<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useProductTypeStore } from '../stores/productType';
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue/usetoast';
import ProductType from '@/models/ProductType';

const toast = useToast();
const route = useRoute();
const newProductType = ref(new ProductType());
const router = useRouter();
const productTypeStore = useProductTypeStore();
const { productTypes, fb } = storeToRefs(productTypeStore);
const productTypeId = route.params.id;

const avatarFile = ref(null);
const fileInput = ref(null);

const isLoading = computed(() => {
    return fb.value.loading === true;
});

onMounted(async () => {
    try {
        const fetchedProductType = await productTypeStore.fetchProductTypeById(productTypeId);
        console.log('Fetched ProductType:', fetchedProductType);
        newProductType.value = new ProductType(fetchedProductType);
        console.log('Assigned ProductType:', newProductType.value);
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load product type details. Please try again.',
            life: 3000
        });
        goToProductTypeList();
    }
});

const goToProductTypeList = () => {
    router.push('/configuration/settings/product-types');
};

const updateProductType = async () => {
    try {
        console.log(newProductType.value);
        await productTypeStore.updateProductType(productTypeId, newProductType.value);
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Product type updated successfully',
            life: 3000
        });
        goToProductTypeList();
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update product type. Please try again.',
            life: 3000
        });
    }
};

const selectImage = () => {
    fileInput.value.click();
};

const removeImage = () => {
    avatarFile.value = null;
    newPostType.value.image = null;
    if (fileInput.value) {
        fileInput.value.value = '';
    }
};

const onFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        avatarFile.value = file;
        newPostType.value.image = file;
    }
};

</script>

<template>
    <div class="flex justify-end gap-2 mb-6">
        <Button 
            icon="pi pi-arrow-left"
            label="Product Type List"
            severity="secondary"
            @click="goToProductTypeList"
            class="p-button-md"
        />
        <Button 
            icon="pi pi-save"
            label="Save"
            severity="primary"
            @click="updateProductType"
            class="p-button-md"
        />
    </div>
    <Fluid class="flex flex-col md:flex-row gap-8 mb-20">
        <div class="w-full">
            
            <div class="flex flex-col gap-6">

                <div class="grid grid-cols-12 gap-2">
                    <label for="type" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Name</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText v-model="newProductType.name" class="text-lg" id="name" type="text" placeholder="Name" />
                    </div>
                </div>
                <div class="grid grid-cols-12 gap-2">
                    <label for="type" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Type</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText v-model="newProductType.type" class="text-lg" id="type" type="text" placeholder="Type" />
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="plural" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Plural</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText v-model="newProductType.plural" class="text-lg" id="plural" type="text" placeholder="Name" />
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="icon" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Icon</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText v-model="newProductType.icon" class="text-lg" id="icon" type="text" placeholder="icon-document-text-outline" />
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="image" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Image</label>
                    <div class="col-span-12 md:col-span-10 flex flex-col items-start">
                        <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center">
                            <img v-if="avatarFile" :src="URL.createObjectURL(avatarFile)" alt="Avatar" class="w-24 h-24 object-cover mb-2" />
                            <div v-else class="text-gray-400">
                                <i class="pi pi-camera" style="font-size: 2rem;"></i>
                            </div>
                            <Button label="Set Image" @click="selectImage" />
                            <Button v-if="avatarFile" label="Remove" class="mt-2" @click="removeImage" />
                        </div>
                        <input type="file" ref="fileInput" @change="onFileChange" accept="image/*" class="hidden" />
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
