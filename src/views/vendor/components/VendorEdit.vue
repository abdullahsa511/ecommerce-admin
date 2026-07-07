<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useVendorStore } from '@/stores/vendor';

const emit = defineEmits(['update:vendor', 'saved', 'editTabUnmunted', 'editTabMounted']);

const route = useRoute();
const vendorStore = useVendorStore();
const { vendor, fb } = storeToRefs(vendorStore);

const imageMediaExpanded = ref(true);

const uploadVendorImages = async (event: any) => {
    try {
        let files = event.files;
        files = files.map((file: any) => {
            let f = vendor.value.image.find((img: any) => img.name === file.file?.name);
            if(f) file.id = f.id;            
            return file;
        });
        console.log( "files", files);
      await vendorStore.uploadVendorImages(files, 'image', vendor.value.vendor_id);
    } catch (error) {
        console.error('Error uploading image:', error);
    }
}

const deleteVendorImages = async (file: any) => {
    try {
        await vendorStore.deleteVendorImages(file, vendor.value.vendor_id);
        vendor.value.image = [];
    } catch (error) {
        console.error('Error deleting image:', error);
    }
}

onMounted(async () => {
    emit('editTabMounted');
    if (route.params.id) {
        await vendorStore.getVendorById(route.params.id as string);
    }

});

onUnmounted(() => {
    emit('editTabUnmunted');
});
</script>

<template>
    <div class="flex flex-col gap-6">
        <div class="loading-overlay border-2" v-if="fb.loading['vendor.show.' + route.params.id]">
            <div class="flex justify-center items-center h-full spinner">
                <i class="pi pi-spin pi-spinner" style="font-size: 2rem;"></i>
                <p class="mt-2">Loading vendor details. Please wait.</p>
            </div>
        </div>
        <div class="flex flex-col md:flex-row gap-6">
            <!-- Left column: Vendor Form -->
            <div class="sm:w-full md:w-3/5 space-y-4">
                <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Edit Vendor</h3>

                <div class="grid grid-cols-12 gap-x-6 gap-y-4">
                    <!-- Vendor Code -->
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">
                        Code
                    </label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <InputText v-model="vendor.vendor_code" class="w-full text-lg border border-gray-200 rounded-md p-2"
                            placeholder="Enter vendor code" :class="{'p-invalid': fb.errors?.['vendor.update.' + vendor.vendor_id]?.vendor_code}"/>
                            <Message v-if="fb.errors?.['vendor.update.' + vendor.vendor_id]?.vendor_code" severity="error" size="small" variant="title">
                                <span v-for="error in fb.errors?.['vendor.update.' + vendor.vendor_id]?.vendor_code" :key="error" class="flex flex-col">
                                    {{ error }}
                                </span>
                            </Message>
                    </div>
                  
                    <!-- Name -->
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Name</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <InputText v-model="vendor.name" class="w-full text-lg border border-gray-200 rounded-md p-2"
                            placeholder="Enter vendor name" :class="{'p-invalid': fb.errors?.['vendor.update.' + vendor.vendor_id]?.name}"/>
                            <Message v-if="fb.errors?.['vendor.update.' + vendor.vendor_id]?.name" severity="error" size="small" variant="title">
                                <span v-for="error in fb.errors?.['vendor.update.' + vendor.vendor_id]?.name" :key="error" class="flex flex-col">
                                    {{ error }}
                                </span>
                            </Message>
                    </div>
                    <!-- Sort Order -->
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Sort Order</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <InputNumber v-model="vendor.sort_order" class="w-full text-lg border border-gray-200 rounded-md p-2"
                            placeholder="Enter vendor sort order"/>
                    </div>
                </div>
            </div>

            <!-- Right column: Vendor Sidebar -->
            <div class="sm:w-full md:w-2/5 space-y-4">
                <div class="bg-white rounded-lg shadow-sm mt-4">
                    <button @click="imageMediaExpanded = !imageMediaExpanded"
                        class="w-full sm:px-6 py-4 text-left text-lg flex justify-between items-center text-primary">
                        Vendor Thumbnail Image
                        <i :class="['pi', imageMediaExpanded ? 'pi-chevron-up' : 'pi-chevron-down']"></i>
                    </button>

                    <div v-if="imageMediaExpanded" class="sm:p-6 border-t">
                        <UploadFileFeature v-model:uploadedFilesData="vendor.image" :fb="fb"
                            :property="'image'" @upload="uploadVendorImages($event)"
                            @removeUploadedFile="deleteVendorImages($event)" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Optional custom styles */
</style>
