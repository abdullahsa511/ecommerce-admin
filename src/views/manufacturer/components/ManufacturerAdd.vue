<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useManufacturerStore } from '@/stores/manufacturer';       
import { useMediaStore } from '@/stores/media';


const manufacturerStore = useManufacturerStore();
const { manufacturer, fb } = storeToRefs(manufacturerStore);

const emit = defineEmits(['update:manufacturer', 'saved']);

const imageMediaExpanded = ref(true);
const mediaStore = useMediaStore ? useMediaStore() : null;
const mediaFb = mediaStore ? mediaStore.fb : null;

const uploadSidebarMediaImage = async (event: any, property: 'image') => {
    // try {
    //     const response: any = await mediaStore.uploadFiles(event.files, property);
    //     manufacturer.value.image = response.files;
    // } catch (error) {
    //     console.error('Error uploading image:', error);
    // }
}

const deleteSidebarMediaImage = async (file: any, property: 'image') => {
    // try {
    //         await manufacturerStore.deleteImageByFilePath(file.image, property);
    //         manufacturer.value.image = [];
    // } catch (error) {
    //     console.error('Error deleting image:', error);
    // }
}
onMounted(async () => {
    manufacturerStore.resetManufacturer(); //reset form for add.
});
</script>

<template>
    <div class="flex flex-col gap-6">
        <div class="loading-overlay border-2" v-if="fb.loading['manufacturer.create']">
            <div class="flex justify-center items-center h-full spinner">
                <i class="pi pi-spin pi-spinner" style="font-size: 2rem;"></i>
                <p class="mt-2">Loading manufacturer add details. Please wait.</p>
            </div>
        </div>
        <div class="flex flex-col md:flex-row gap-6">
            <!-- Left column: Manufacturer Form -->
            <div class="sm:w-full md:w-3/5 space-y-4">
                <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Edit Manufacturer</h3>

                <div class="grid grid-cols-12 gap-x-6 gap-y-4">
                    <!-- Manufacturer Code -->
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">
                        Code
                    </label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <InputText v-model="manufacturer.manufacturer_code" class="w-full text-lg border border-gray-200 rounded-md p-2"
                            placeholder="Enter manufacturer code"/>
                    </div>
                  
                    <!-- Name -->
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Name</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <InputText v-model="manufacturer.name" class="w-full text-lg border border-gray-200 rounded-md p-2"
                            placeholder="Enter manufacturer name"/>
                    </div>
                    <!-- Slug -->
                    <!-- <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Slug</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <InputText v-model="manufacturer.slug" class="w-full text-lg border border-gray-200 rounded-md p-2"
                            placeholder="Enter manufacturer slug"/>
                    </div> -->
                    <!-- Sort Order -->
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Sort Order</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <InputNumber v-model="manufacturer.sort_order" class="w-full text-lg border border-gray-200 rounded-md p-2"
                            placeholder="Enter manufacturer sort order"/>
                    </div>

                    <!-- Image -->
                    <!-- <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Image</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <InputText v-model="manufacturer.image" class="w-full text-lg border border-gray-200 rounded-md p-2"
                            placeholder="Enter manufacturer image"/>
                        <input type="file" ref="fileInput" @change="onFileChange" accept="image/*" class="hidden" />
                    </div> -->
                </div>
            </div>
            <!-- Right column: Manufacturer Sidebar -->
            <!-- <div class="sm:w-full md:w-2/5 space-y-4">
                <div class="bg-white rounded-lg shadow-sm mt-4">
                    <button @click="imageMediaExpanded = !imageMediaExpanded"
                        class="w-full sm:px-6 py-4 text-left text-lg flex justify-between items-center text-primary">
                        Manufacturer Thumbnail Image
                        <i :class="['pi', imageMediaExpanded ? 'pi-chevron-up' : 'pi-chevron-down']"></i>
                    </button>

                    <div v-if="imageMediaExpanded" class="sm:p-6 border-t">
                        <UploadFileFeature v-model:uploadedFilesData="manufacturer.image" :fb="mediaFb"
                            :property="'image'" @upload="uploadSidebarMediaImage($event, 'image')"
                            @removeUploadedFile="deleteSidebarMediaImage($event, 'image')" />
                    </div>
                </div>
            </div> -->
        </div>
    </div>
</template>

<style scoped></style>
