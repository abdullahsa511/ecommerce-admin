<script setup lang="ts">
import { onMounted } from 'vue';
import ProductSidebar from './ProductSidebar.vue';
import Product from '@/models/Product.ts';
import { useProductStore } from '@/stores/product';
import { useToast } from 'primevue/usetoast';
import { useMediaStore } from '@/stores/media';
import { SidebarMedia, ProductImage } from '@/models/Product.ts';

const emit = defineEmits(['update:product', 'saved']);
const productStore = useProductStore();
const mediaStore = useMediaStore();
const mediaFb = mediaStore.fb;
const toast = useToast();


const props = defineProps({
    product: {
        type: Product,
        required: true,
        default: () => new Product({})
    }
});

const openInPageEditor = () => {
    // Implement page editor logic
};

onMounted(() => {

});

const updateProduct = (data: any) => {
    emit('update:product', { ...props.product, ...data });
    // emit('update:product', data);
}

const uploadMainImage = async (event: any, property: SidebarMedia) => {
    try {
        // const response: any = await mediaStore.uploadFiles(event.files, property);
        let productId = props.product.product_id ? props.product.product_id : 0; // 0 is for new products
        const files: ProductImage[] = await productStore.uploadProductImages(event.files, property, productId);
        // const response: any = await productStore.uploadProductImages(event.files, property, productId);
        // console.log('response of uploadMainImage', files);
        props.product[property] = files;
    } catch (error) {
        console.error('Error uploading site logo:', error);
    }
}

const deleteMainImage = async (file: any, property: SidebarMedia) => {
    try {
        await mediaStore.deleteImageByFilePath(file.objectURL, property);
        props.product[property] = [];
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Image deleted successfully',
            life: 3000
        });
    } catch (error) {
        console.error('Error deleting site logo:', error);
    }
}

const onNameInput = (e: any) => {
    const slug = e.target.value
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')        // replace spaces with -
        .replace(/[^a-z0-9-]/g, '')  // remove all special chars except -
        .replace(/-+/g, '-');        // remove duplicate -

    props.product.content.slug = slug;
    props.product.product_code = slug;
}
</script>

<template>
    <!-- General Tab -->
    <div class="flex flex-col gap-6">
        <div class="flex flex-col xl:flex-row  gap-6">
            <!-- Left column -->
            <div class="sm:w-full md:w-full lg:w-full xl:w-3/5 space-y-4">
                <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Details</h3>
                <div class="grid grid-cols-12 gap-x-6 gap-y-4">
                    <!-- Name -->
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Title</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <InputText v-model="product.content.title"
                            class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Enter Title"/>
                    </div>
                    <!-- Name -->
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Name</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <InputText v-model="product.content.name"
                            class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Enter name" @input="onNameInput" />
                    </div>
                    <!-- Slug -->
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Slug</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <InputText v-model="product.content.slug" @input="onNameInput"
                            class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Enter slug" />
                    </div>
                    <!-- Item Code -->
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Product Code</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <InputText v-model="product.product_code"
                            class="w-full text-lg border border-gray-200 rounded-md p-2"
                            placeholder="Enter Product code" />
                    </div>
                    <!-- Factory Code -->
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Factory
                        Code</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <InputText v-model="product.factory_code"
                            class="w-full text-lg border border-gray-200 rounded-md p-2"
                            placeholder="Enter factory code" />
                    </div>
                    
                    <!-- Tag Line -->
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Tag Line</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <Textarea v-model="product.content.tag_line"
                            class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Enter tag line" />
                    </div>
                    <!-- Rules -->
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Rules</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <Textarea v-model="product.content.rules"
                            class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Enter rules" />
                    </div>
                    <!-- Store Link -->
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Store Link</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <InputText v-model="product.store_link"
                            class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Enter Store" />
                    </div>
                    <!-- catalogue Link -->
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Catalogue Link</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <InputText v-model="product.catalogue_link"
                            class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Enter Catalogue" />
                    </div>
                    <!-- Sort Link -->
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Sort Order</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <InputNumber v-model="product.sort_order" class="w-full text-lg" />
                    </div>
                </div>
                <!-- Content -->
                <div class="grid grid-cols-12 gap-x-6 gap-y-4">
                    <label class="col-span-12 md:col-span-2 flex text-lg">Content</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">

                        <Button label="Open in Page Editor" icon="pi pi-external-link" @click="openInPageEditor"
                            class="mb-4" severity="secondary" />
                    </div>

                </div>
                <!-- Specifications -->
                <div class="form-group" style="margin-top: 0px;">
                    <RichTextEditor 
                    v-model="product.specifications" 
                    :label="'Specifications'" 
                    />
                </div>
                <div class="form-group" style="margin-top: 0px;">
                    <!-- <label class="block text-gray-700 text-lg mb-2">Description</label> -->
                    <!-- <Editor v-model="product.content.content" editorStyle="height: 200px" /> -->
                    <RichTextEditor 
                    v-model="product.content.content" 
                    :label="'Description'" 
                    />
                </div>
                <div class="form-group" style="margin-top: 0px;">
                    <!-- <label class="block text-gray-700 text-lg mb-2">Feature Description</label> -->
                    <!-- <Editor v-model="product.feature_description" editorStyle="height: 200px" /> -->
                    <RichTextEditor 
                    v-model="product.feature_description" 
                    :label="'Feature Description'" 
                    />
                </div>

                <div class="space-y-4">
                    <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Images</h3>

                    <div class="flex flex-col gap-4 mt-10 mb-10">

                        
                        <div class="flex flex-col gap-2">
                            <div>
                                <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Main Image One Title</label>
                                <div class="col-span-12 md:col-span-9 xl:col-span-10">
                                    <InputText v-model="product.main_image_one_title" class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Enter main image one title" />
                                </div>
                            </div>
                            <label class="col-span-12 md:col-span-6 xl:col-span-6 flex items-center text-lg">Main Image One</label>
                            <div class="flex gap-2 flex-col sm:flex-row">
                                <div class="">
                                    <UploadFileFeature v-model:uploadedFilesData="product.main_image_one" :fb="mediaFb"
                                        :property="'main_image_one'" @upload="uploadMainImage($event, 'main_image_one')"
                                        @removeUploadedFile="deleteMainImage($event, 'main_image_one')"
                                        :customStyle="{ maxHeight: '155px' }" />
                                </div>
                                <div class="w-full flex-1 block !-mt-8 sm:mt-0" >
                                    <RichTextEditor 
                                    v-model="product.main_image_one_description"  
                                    />
                                </div>
                            </div>
                        </div>



                        <div class="flex flex-col gap-2">
                            <div>
                                <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Main Image Two Title</label>
                                <div class="col-span-12 md:col-span-9 xl:col-span-10">
                                    <InputText v-model="product.main_image_two_title" class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Enter main image two title" />
                                </div>
                            </div>
                            <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Main Image Two</label>
                            <div class="flex gap-2 flex-col sm:flex-row">
                                <div>
                                    <UploadFileFeature v-model:uploadedFilesData="product.main_image_two" :fb="mediaFb"
                                        :property="'main_image_two'" @upload="uploadMainImage($event, 'main_image_two')"
                                        @removeUploadedFile="deleteMainImage($event, 'main_image_two')"
                                        :customStyle="{ maxHeight: '155px' }" />
                                </div>

                                <div class="w-full flex-1 block !-mt-8 sm:mt-0" >
                                    <RichTextEditor v-model="product.main_image_two_description"/>
                                </div>
                            </div>
                        </div>

                        <div class="flex flex-col gap-2">
                            <div>
                                <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Feature Image One Title</label>
                                <div class="col-span-12 md:col-span-9 xl:col-span-10">
                                    <InputText v-model="product.feature_image_one_title" class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Enter feature image one title" />
                                </div>
                            </div>
                            <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Featured Image One</label>
                            <div class="flex gap-2 flex-col sm:flex-row">
                                <div>
                                    <UploadFileFeature v-model:uploadedFilesData="product.feature_image_one"
                                        :fb="mediaFb" :property="'main_image_two'"
                                        @upload="uploadMainImage($event, 'feature_image_one')"
                                        @removeUploadedFile="deleteMainImage($event, 'feature_image_one')"
                                        :customStyle="{ maxHeight: '155px' }" />
                                </div>
                                <div class="w-full flex-1 block !-mt-8 sm:mt-0" >
                                    <RichTextEditor 
                                        v-model="product.feature_image_one_description"  
                                    />
                                </div>
                            </div>

                        </div>

                        <div class="flex flex-col gap-2">
                            <div>
                                <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Feature Image Two Title</label>
                                <div class="col-span-12 md:col-span-9 xl:col-span-10">
                                    <InputText v-model="product.feature_image_two_title" class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Enter feature image two title" />
                                </div>
                            </div>
                            <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Featured Image Two</label>
                            <div class="flex gap-2 flex-col sm:flex-row">
                                <div>
                                    <UploadFileFeature v-model:uploadedFilesData="product.feature_image_two"
                                        :fb="mediaFb" :property="'main_image_two'"
                                        @upload="uploadMainImage($event, 'feature_image_two')"
                                        @removeUploadedFile="deleteMainImage($event, 'feature_image_two')"
                                        :customStyle="{ maxHeight: '155px' }" />
                                </div>
                                <div class="w-full flex-1 block !-mt-8 sm:mt-0" >
                                    
                                    <RichTextEditor 
                                        v-model="product.feature_image_two_description"  
                                    />
                                </div>
                            </div>
                        </div>


                        <div class="flex flex-col gap-2">
                            <div>
                                <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Feature Image Three Title</label>
                                <div class="col-span-12 md:col-span-9 xl:col-span-10">
                                    <InputText v-model="product.feature_image_three_title" class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Enter feature image three title" />
                                </div>
                            </div>
                            <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Featured Image Three</label>
                            <div class="flex gap-2 flex-col sm:flex-row">
                                <div>
                                    <UploadFileFeature v-model:uploadedFilesData="product.feature_image_three"
                                        :fb="mediaFb" :property="'main_image_one'"
                                        @upload="uploadMainImage($event, 'feature_image_three')"
                                        @removeUploadedFile="deleteMainImage($event, 'feature_image_three')"
                                        :customStyle="{ maxHeight: '155px' }" />
                                </div>
                                <div class="w-full flex-1 block !-mt-8 sm:mt-0">
                                    <RichTextEditor 
                                        v-model="product.feature_image_three_description"  
                                    />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <div class="space-y-4">
                    <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Specification Image</h3>

                    <div class="flex flex-col gap-2 mb-4 mt-4 pr-2">
                        <UploadFileFeature v-model:uploadedFilesData="product.specifications_image" :fb="mediaFb"
                            :property="'specifications_image'" @upload="uploadMainImage($event, 'specifications_image')"
                            @removeUploadedFile="deleteMainImage($event, 'specifications_image')"
                            :customStyle="{ maxHeight: '155px' }" />
                    </div>
                </div>
                <!-- Dimensions Section -->
                <div class="space-y-4">
                    <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Dimensions</h3>

                    <div class="flex flex-col gap-2 mb-4 mt-4 pr-2">
                        <UploadFileFeature v-model:uploadedFilesData="product.dimension_image" :fb="mediaFb"
                            :property="'dimension_image'" @upload="uploadMainImage($event, 'dimension_image')"
                            @removeUploadedFile="deleteMainImage($event, 'dimension_image')"
                            :customStyle="{ maxHeight: '155px' }" />
                    </div>
                    <div class="grid grid-cols-12 gap-x-6 gap-y-4">
                        
                        <!-- Width -->
                        <label class="col-span-12 md:col-span-3 xl:col-span-3 flex items-center text-lg">Width</label>
                        <div class="col-span-12 md:col-span-9 xl:col-span-9 py-2">
                            <InputText v-model="product.width" class="w-full text-lg" />
                        </div>
                        <!-- Height -->
                        <label class="col-span-12 md:col-span-3 xl:col-span-3 flex items-center text-lg">Height</label>
                        <div class="col-span-12 md:col-span-9 xl:col-span-9 py-2">
                            <InputText v-model="product.height" class="w-full text-lg" />
                        </div>
                        <!-- Depth -->
                        <label class="col-span-12 md:col-span-3 xl:col-span-3 flex items-center text-lg">Depth</label>
                        <div class="col-span-12 md:col-span-9 xl:col-span-9 py-2">
                            <InputText v-model="product.depth" class="w-full text-lg" />
                        </div>
                        <!-- Weight -->
                        <label class="col-span-12 md:col-span-3 xl:col-span-3 flex items-center text-lg">Weight</label>
                        <div class="col-span-12 md:col-span-9 xl:col-span-9 py-2">
                            <InputText v-model="product.weight" class="w-full text-lg" />
                        </div>
                        <!-- Length -->
                        <label class="col-span-12 md:col-span-3 xl:col-span-3 flex items-center text-lg">Length</label>
                        <div class="col-span-12 md:col-span-9 xl:col-span-9 py-2">
                            <InputText v-model="product.length" class="w-full text-lg" />
                        </div>
                        <!-- Size -->
                        <label class="col-span-12 md:col-span-3 xl:col-span-3 flex items-center text-lg">Size</label>
                        <div class="col-span-12 md:col-span-9 xl:col-span-9 py-2">
                            <InputNumber v-model="product.size" class="w-full text-lg" />
                        </div>
                    </div>
                </div>

                <!-- Carton Details Section -->
                <div class="space-y-4">
                    <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Carton Details</h3>
                    <div class="grid grid-cols-12 gap-x-6 gap-y-4">
                        <!-- Carton QM -->
                        <label class="col-span-12 md:col-span-3 xl:col-span-3 flex items-center text-lg">Carton
                            QM</label>
                        <div class="col-span-12 md:col-span-9 xl:col-span-9 py-2">
                            <InputNumber v-model="product.carton_qm" class="w-full text-lg" />
                        </div>
                        <!-- Carton Width -->
                        <label class="col-span-12 md:col-span-3 xl:col-span-3 flex items-center text-lg">Carton
                            Width</label>
                        <div class="col-span-12 md:col-span-9 xl:col-span-9 py-2">
                            <InputNumber v-model="product.carton_width" class="w-full text-lg" />
                        </div>
                        <!-- Carton Depth -->
                        <label class="col-span-12 md:col-span-3 xl:col-span-3 flex items-center text-lg">Carton
                            Depth</label>
                        <div class="col-span-12 md:col-span-9 xl:col-span-9 py-2">
                            <InputNumber v-model="product.carton_depth" class="w-full text-lg" />
                        </div>
                        <!-- Carton Height -->
                        <label class="col-span-12 md:col-span-3 xl:col-span-3 flex items-center text-lg">Carton
                            Height</label>
                        <div class="col-span-12 md:col-span-9 xl:col-span-9 py-2">
                            <InputNumber v-model="product.carton_height" class="w-full text-lg " />
                        </div>
                        <!-- Gross Weight -->
                        <label class="col-span-12 md:col-span-3 xl:col-span-3 flex items-center text-lg">Gross
                            Weight</label>
                        <div class="col-span-12 md:col-span-9 xl:col-span-9 py-2">
                            <InputNumber v-model="product.gross_weight" class="w-full text-lg " />
                        </div>
                        <!--Date Available-->
                        <label class="col-span-12 md:col-span-3 xl:col-span-3 flex items-center text-lg">Date
                            Available</label>
                        <div class="col-span-12 md:col-span-9 xl:col-span-9 py-2">
                            <DatePicker v-model="product.date_available as Date | null" class="w-full text-lg" />
                        </div>
                    </div>
                </div>

            </div>

            <!-- Right column -->
            <ProductSidebar :product="product" @update:product="updateProduct" />
        </div>
    </div>
</template>

<style scoped>
.th-site-logo-title {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-width: 180px;
}

.th-site-logo {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 160px;
    border-radius: 5px;
    padding: 10px;
    flex: 1;
}

:deep(.empty-section > div) {
    min-height: 150px;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
}

:deep(.element.style) {
    max-height: 84px !important;
}
</style>