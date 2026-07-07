<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useProductTypeStore } from '@/stores/productType';
import { storeToRefs } from 'pinia';
import ProductType from '@/models/ProductType';

const productTypeStore = useProductTypeStore();
const { newProductType, fb } = storeToRefs(productTypeStore);

const avatarFile = ref(null);
const fileInput = ref(null);

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
    <Fluid class="flex flex-col md:flex-row gap-8 mb-20">
        <div class="w-full">
            <div class="flex flex-col gap-6">
                <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Add New Product Type</h3>
                <div class="grid grid-cols-12 gap-2">
                    <label for="type" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Name</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText v-model="newProductType.name" class="text-lg" id="name" type="text" placeholder="Name" :class="{ 'p-invalid': fb.errors['productType.create']?.name }" />
                        <Message v-if="fb.errors['productType.create']?.name" severity="error" size="small" variant="title">
                            <span v-for="error in fb.errors['productType.create']?.name" :key="error" class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="type" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Type</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText v-model="newProductType.type" class="text-lg" id="type" type="text" placeholder="Name" :class="{ 'p-invalid': fb.errors['productType.create']?.type }" />
                        <Message v-if="fb.errors['productType.create']?.type" severity="error" size="small" variant="title">
                            <span v-for="error in fb.errors['productType.create']?.type" :key="error" class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="plural" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Plural</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText v-model="newProductType.plural" class="text-lg" id="plural" type="text" placeholder="Name" :class="{ 'p-invalid': fb.errors['productType.create']?.plural }" />
                        <Message v-if="fb.errors['productType.create']?.plural" severity="error" size="small" variant="title">
                            <span v-for="error in fb.errors['productType.create']?.plural" :key="error" class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="icon" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Icon</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText v-model="newProductType.icon" class="text-lg" id="icon" type="text" placeholder="icon-document-text-outline" :class="{ 'p-invalid': fb.errors['productType.create']?.icon }" />
                        <Message v-if="fb.errors['productType.create']?.icon" severity="error" size="small" variant="title">
                            <span v-for="error in fb.errors['productType.create']?.icon" :key="error" class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>
                </div>
            </div>
        </div>
    </Fluid>
</template>
