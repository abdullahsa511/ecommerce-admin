<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const avatarFile = ref(null);
const fileInput = ref(null);


const goToManufacturerList = () => {
    router.push('/ecommerce/products/manufacturers');
};

const saveManufacturer = async () => {
    console.log('saveManufacturer');
};

const selectImage = () => {
    fileInput.value.click();
};

const removeImage = () => {
    avatarFile.value = null;
    if (fileInput.value) {
        fileInput.value.value = '';
    }
};

const onFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        avatarFile.value = file;
    }
};

</script>

<template>
    <div class="flex justify-end gap-2 mb-6">
        <Button 
            icon="pi pi-arrow-left"
            label="Manufacturer List"
            severity="secondary"
            @click="goToManufacturerList"
            class="p-button-md"
        />
        <Button 
            icon="pi pi-save"
            label="Save"
            severity="primary"
            @click="saveManufacturer"
            class="p-button-md"
        />
    </div>
    <Fluid class="flex flex-col md:flex-row gap-8 mb-20">
        <div class="w-full">
            
            <div class="flex flex-col gap-6">

                <div class="grid grid-cols-12 gap-2">
                    <label for="name" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Code</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText class="text-lg" id="manufacturer_code" type="text" placeholder="Manufacturer Code" />
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="name" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Name</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText class="text-lg" id="name" type="text" placeholder="Name" />
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="slug" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Slug</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText class="text-lg" id="slug" type="text" placeholder="Slug" />
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
