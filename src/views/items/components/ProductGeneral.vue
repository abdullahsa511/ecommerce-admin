<script setup lang="ts">
import { defineProps, defineEmits, onMounted } from 'vue';
import ProductSidebar from './ProductSidebar.vue';
import Product from '@/models/Product.ts';
import { useProductStore } from '@/stores/product';
import { useToast } from 'primevue/usetoast';
import { useMediaStore } from '@/stores/media';
import { SidebarMedia } from '@/models/Product.ts';
// import Quill from 'quill';
// import 'quill/dist/quill.snow.css';

const emit = defineEmits(['update:product', 'saved']);
const productStore = useProductStore();
const mediaStore = useMediaStore();
const mediaFb = mediaStore.fb;
const toast = useToast();
// const editorRef = ref(null);
// let quill: any = null;

const props = defineProps({
    product: {
        type: Product,
        required: true,
        default: () => new Product({})
    }
});

const attributeOptions = [
    { label: 'Alex_Base.gltf', value: 'Alex_Base.gltf' },
    { label: 'Alex_Arms.gltf', value: 'Alex_Arms.gltf' },
    { label: 'Alex_Shell.gltf', value: 'Alex_Shell.gltf' }
];

const openInPageEditor = () => {
    // Implement page editor logic
};

onMounted(() => {
    console.log(props.product);

    //     quill = new Quill(editorRef.value, {
    //     theme: "snow",
    //     modules: {
    //       toolbar: "#main-image-one-toolbar",
    //     },
    //   });

    // Initialize Quill editor
    // if (editorRef.value) {
    //     quill = new Quill(editorRef.value, {
    //         theme: 'snow',
    //         modules: {
    //             toolbar: [
    //                 ['bold', 'italic', 'underline', 'strike'],
    //                 ['blockquote', 'code-block'],
    //                 [{ 'header': 1 }, { 'header': 2 }],
    //                 [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    //                 [{ 'script': 'sub'}, { 'script': 'super' }],
    //                 [{ 'indent': '-1'}, { 'indent': '+1' }],
    //                 [{ 'direction': 'rtl' }],
    //                 [{ 'size': ['small', false, 'large', 'huge'] }],
    //                 [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    //                 [{ 'color': [] }, { 'background': [] }],
    //                 [{ 'font': [] }],
    //                 [{ 'align': [] }],
    //                 ['clean']
    //             ]
    //         }
    //     });

    //     // Set initial content
    //     if (props.product.content.meta_description) {
    //         quill.root.innerHTML = props.product.content.meta_description;
    //     }

    //     // Handle content changes
    //     quill.on('text-change', () => {
    //         props.product.content.meta_description = quill.root.innerHTML;
    //     });
    // }
});

const updateProduct = (data: any) => {
    emit('update:product', { ...props.product, ...data });
}

const uploadMainImage = async (event: any, property: SidebarMedia) => {
    // alert('uploadMainImage');
    console.log('Deleting file:', props.product);
    try {
        // const response: any = await mediaStore.uploadFiles(event.files, property);
        let productId = props.product.product_id ? props.product.product_id : 0; // 0 is for new products
        const response: any = await productStore.uploadProductImages(event.files, property, productId);
        props.product[property] = response.files;
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
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Name</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <InputText v-model="product.content.name"
                            class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Enter name" />
                    </div>
                    <!-- Slug -->
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Slug</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <InputText v-model="product.content.slug"
                            class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Enter slug" />
                    </div>
                    <!-- Item Code -->
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Item Code</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <InputText v-model="product.product_code"
                            class="w-full text-lg border border-gray-200 rounded-md p-2"
                            placeholder="Enter item code" />
                    </div>
                    <!-- Factory Code -->
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Factory
                        Code</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <InputText v-model="product.factory_code"
                            class="w-full text-lg border border-gray-200 rounded-md p-2"
                            placeholder="Enter factory code" />
                    </div>
                    <!-- Rules -->
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Rules</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <Textarea v-model="product.configuration.rules"
                            class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Enter rules" />
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
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Specifications</label>
                    <Editor v-model="product.specifications" editorStyle="height: 200px" />
                 </div>

                <div class="form-group" style="margin-top: 0px;">
                    <label class="block text-gray-700 text-lg mb-2">Description</label>
                    <!-- <div ref="editorRef" class="h-[320px]"></div> -->
                    <Editor v-model="product.content.content" editorStyle="height: 200px" />
                </div>

                <div class="space-y-4">
                    <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Images</h3>

                    <div class="flex flex-col gap-4 mt-10 mb-10">

                        <div class="flex flex-col gap-2">
                            <label class="col-span-12 md:col-span-6 xl:col-span-6 flex items-center text-lg">Main Image
                                One</label>
                            <div class="flex gap-2 flex-col sm:flex-row">
                                <div class="">
                                    <UploadFileFeature v-model:uploadedFilesData="product.main_image_one" :fb="mediaFb"
                                        :property="'main_image_one'" @upload="uploadMainImage($event, 'main_image_one')"
                                        @removeUploadedFile="deleteMainImage($event, 'main_image_one')"
                                        :customStyle="{ maxHeight: '155px' }" />
                                </div>
                                <!-- <Editor v-model="product.main_image_one_description" editorStyle="height: 100px; flex: 3;" /> -->
                                <div class="w-full flex-1 sm:d-block">
                                    <Editor v-model="product.main_image_one_description" class="w-full"
                                        editorStyle="height: 110px; width: 100%;">
                                        <template v-slot:toolbar>
                                            <span class="ql-formats">
                                                <!-- Heading dropdown -->
                                                <select class="ql-header" v-tooltip.bottom="'Heading'">
                                                    <option selected></option>
                                                    <option value="1">Heading 1</option>
                                                    <option value="2">Heading 2</option>
                                                    <option value="3">Heading 3</option>
                                                </select>
                                                <!-- Font Family dropdown -->
                                                <select class="ql-font" v-tooltip.bottom="'Font Family (Sans Serif)'">
                                                    <option selected value="sans-serif">Sans Serif</option>
                                                    <option value="serif">Serif</option>
                                                    <option value="monospace">Monospace</option>
                                                </select>
                                                <!-- Bold, Italic, Underline -->
                                                <button class="ql-bold" v-tooltip.bottom="'Bold'"></button>
                                                <button class="ql-italic" v-tooltip.bottom="'Italic'"></button>
                                                <button class="ql-underline" v-tooltip.bottom="'Underline'"></button>
                                                <!-- Lists -->
                                                <button class="ql-list" value="ordered"
                                                    v-tooltip.bottom="'Numbered List'"></button>
                                                <button class="ql-list" value="bullet"
                                                    v-tooltip.bottom="'Bulleted List'"></button>
                                                <!-- Link -->
                                                <button class="ql-link" v-tooltip.bottom="'Insert Link'"></button>
                                            </span>
                                        </template>
                                    </Editor>
                                </div>
                            </div>
                        </div>



                        <div class="flex flex-col gap-2">
                            <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Main Image
                                Two</label>
                            <!-- {size: {width: 670, height: 686}} -->
                            <div class="flex gap-2 flex-col sm:flex-row">
                                <div>
                                    <UploadFileFeature v-model:uploadedFilesData="product.main_image_two" :fb="mediaFb"
                                        :property="'main_image_two'" @upload="uploadMainImage($event, 'main_image_two')"
                                        @removeUploadedFile="deleteMainImage($event, 'main_image_two')"
                                        :customStyle="{ maxHeight: '155px' }" />
                                </div>

                                <div class="w-full flex-1 sm:d-block">
                                    <Editor v-model="product.main_image_two_description" class="w-full"
                                        editorStyle="height: 110px; width: 100%;">
                                        <template v-slot:toolbar>
                                            <span class="ql-formats">
                                                <!-- Heading dropdown -->
                                                <select class="ql-header" v-tooltip.bottom="'Heading'">
                                                    <option selected></option>
                                                    <option value="1">Heading 1</option>
                                                    <option value="2">Heading 2</option>
                                                    <option value="3">Heading 3</option>
                                                </select>
                                                <!-- Font Family dropdown -->
                                                <select class="ql-font" v-tooltip.bottom="'Font Family (Sans Serif)'">
                                                    <option selected value="sans-serif">Sans Serif</option>
                                                    <option value="serif">Serif</option>
                                                    <option value="monospace">Monospace</option>
                                                </select>
                                                <!-- Bold, Italic, Underline -->
                                                <button class="ql-bold" v-tooltip.bottom="'Bold'"></button>
                                                <button class="ql-italic" v-tooltip.bottom="'Italic'"></button>
                                                <button class="ql-underline" v-tooltip.bottom="'Underline'"></button>
                                                <!-- Lists -->
                                                <button class="ql-list" value="ordered"
                                                    v-tooltip.bottom="'Numbered List'"></button>
                                                <button class="ql-list" value="bullet"
                                                    v-tooltip.bottom="'Bulleted List'"></button>
                                                <!-- Link -->
                                                <button class="ql-link" v-tooltip.bottom="'Insert Link'"></button>
                                            </span>
                                        </template>
                                    </Editor>
                                </div>
                            </div>
                        </div>

                        <div class="flex flex-col gap-2">
                            <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Featured
                                Image One</label>
                            <!-- {size: {width: 670, height: 686}} -->
                            <div class="flex gap-2 flex-col sm:flex-row">
                                <div>
                                    <UploadFileFeature v-model:uploadedFilesData="product.feature_image_one"
                                        :fb="mediaFb" :property="'main_image_two'"
                                        @upload="uploadMainImage($event, 'feature_image_one')"
                                        @removeUploadedFile="deleteMainImage($event, 'feature_image_one')"
                                        :customStyle="{ maxHeight: '155px' }" />
                                </div>
                                <div class="w-full flex-1 sm:d-block">
                                    <Editor v-model="product.feature_image_one_description" class="w-full"
                                        editorStyle="height: 110px; width: 100%;">
                                        <template v-slot:toolbar>
                                            <span class="ql-formats">
                                                <!-- Heading dropdown -->
                                                <select class="ql-header" v-tooltip.bottom="'Heading'">
                                                    <option selected></option>
                                                    <option value="1">Heading 1</option>
                                                    <option value="2">Heading 2</option>
                                                    <option value="3">Heading 3</option>
                                                </select>
                                                <!-- Font Family dropdown -->
                                                <select class="ql-font" v-tooltip.bottom="'Font Family (Sans Serif)'">
                                                    <option selected value="sans-serif">Sans Serif</option>
                                                    <option value="serif">Serif</option>
                                                    <option value="monospace">Monospace</option>
                                                </select>
                                                <!-- Bold, Italic, Underline -->
                                                <button class="ql-bold" v-tooltip.bottom="'Bold'"></button>
                                                <button class="ql-italic" v-tooltip.bottom="'Italic'"></button>
                                                <button class="ql-underline" v-tooltip.bottom="'Underline'"></button>
                                                <!-- Lists -->
                                                <button class="ql-list" value="ordered"
                                                    v-tooltip.bottom="'Numbered List'"></button>
                                                <button class="ql-list" value="bullet"
                                                    v-tooltip.bottom="'Bulleted List'"></button>
                                                <!-- Link -->
                                                <button class="ql-link" v-tooltip.bottom="'Insert Link'"></button>
                                            </span>
                                        </template>
                                    </Editor>
                                </div>
                            </div>

                        </div>

                        <div class="flex flex-col gap-2">
                            <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Featured Image Two</label>
                            <div class="flex gap-2 flex-col sm:flex-row">
                                <div>
                                    <UploadFileFeature v-model:uploadedFilesData="product.feature_image_two"
                                        :fb="mediaFb" :property="'main_image_two'"
                                        @upload="uploadMainImage($event, 'feature_image_two')"
                                        @removeUploadedFile="deleteMainImage($event, 'feature_image_two')"
                                        :customStyle="{ maxHeight: '155px' }" />
                                </div>
                                <div class="w-full flex-1 sm:d-block">
                                    <Editor v-model="product.feature_image_two_description" class="w-full"
                                        editorStyle="height: 110px; width: 100%;">
                                        <template v-slot:toolbar>
                                            <span class="ql-formats">
                                                <!-- Heading dropdown -->
                                                <select class="ql-header" v-tooltip.bottom="'Heading'">
                                                    <option selected></option>
                                                    <option value="1">Heading 1</option>
                                                    <option value="2">Heading 2</option>
                                                    <option value="3">Heading 3</option>
                                                </select>
                                                <!-- Font Family dropdown -->
                                                <select class="ql-font" v-tooltip.bottom="'Font Family (Sans Serif)'">
                                                    <option selected value="sans-serif">Sans Serif</option>
                                                    <option value="serif">Serif</option>
                                                    <option value="monospace">Monospace</option>
                                                </select>
                                                <!-- Bold, Italic, Underline -->
                                                <button class="ql-bold" v-tooltip.bottom="'Bold'"></button>
                                                <button class="ql-italic" v-tooltip.bottom="'Italic'"></button>
                                                <button class="ql-underline" v-tooltip.bottom="'Underline'"></button>
                                                <!-- Lists -->
                                                <button class="ql-list" value="ordered"
                                                    v-tooltip.bottom="'Numbered List'"></button>
                                                <button class="ql-list" value="bullet"
                                                    v-tooltip.bottom="'Bulleted List'"></button>
                                                <!-- Link -->
                                                <button class="ql-link" v-tooltip.bottom="'Insert Link'"></button>
                                            </span>
                                        </template>
                                    </Editor>
                                </div>
                            </div>
                        </div>

                        
                        <div class="flex flex-col gap-2">
                            <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Featured Image Three</label>
                            <!-- {size: {width: 1346, height: 608}} -->
                            <div class="flex gap-2 flex-col sm:flex-row">
                                <div>
                                    <UploadFileFeature v-model:uploadedFilesData="product.feature_image_three"
                                        :fb="mediaFb" :property="'main_image_one'"
                                        @upload="uploadMainImage($event, 'feature_image_three')"
                                        @removeUploadedFile="deleteMainImage($event, 'feature_image_three')"
                                        :customStyle="{ maxHeight: '155px' }" />
                                </div>
                                <div class="w-full flex-1 sm:d-block">
                                    <Editor v-model="product.feature_image_three_description" class="w-full"
                                        editorStyle="height: 110px; width: 100%;">
                                        <template v-slot:toolbar>
                                            <span class="ql-formats">
                                                <!-- Heading dropdown -->
                                                <select class="ql-header" v-tooltip.bottom="'Heading'">
                                                    <option selected></option>
                                                    <option value="1">Heading 1</option>
                                                    <option value="2">Heading 2</option>
                                                    <option value="3">Heading 3</option>
                                                </select>
                                                <!-- Font Family dropdown -->
                                                <select class="ql-font"
                                                    v-tooltip.bottom="'Font Family (Sans Serif)'">
                                                    <option selected value="sans-serif">Sans Serif</option>
                                                    <option value="serif">Serif</option>
                                                    <option value="monospace">Monospace</option>
                                                </select>
                                                <!-- Bold, Italic, Underline -->
                                                <button class="ql-bold" v-tooltip.bottom="'Bold'"></button>
                                                <button class="ql-italic" v-tooltip.bottom="'Italic'"></button>
                                                <button class="ql-underline"
                                                    v-tooltip.bottom="'Underline'"></button>
                                                <!-- Lists -->
                                                <button class="ql-list" value="ordered"
                                                    v-tooltip.bottom="'Numbered List'"></button>
                                                <button class="ql-list" value="bullet"
                                                    v-tooltip.bottom="'Bulleted List'"></button>
                                                <!-- Link -->
                                                <button class="ql-link" v-tooltip.bottom="'Insert Link'"></button>
                                            </span>
                                        </template>
                                    </Editor>
                                </div>
                            </div>
                        </div>
                      
                    </div>
                </div>
                <!-- Dimensions Section -->
                <div class="space-y-4">
                    <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Dimensions</h3>

                    <div class="grid grid-cols-12 gap-x-6 gap-y-4">
                        <!-- Weight -->
                        <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Weight</label>
                        <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                            <InputText v-model="product.weight" class="w-full text-lg" />
                        </div>
                        <!-- Length -->
                        <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Length</label>
                        <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                            <InputText v-model="product.length" class="w-full text-lg" />
                        </div>
                        <!-- Width -->
                        <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Width</label>
                        <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                            <InputText v-model="product.width" class="w-full text-lg" />
                        </div>
                        <!-- Height -->
                        <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Height</label>
                        <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                            <InputText v-model="product.height" class="w-full text-lg" />
                        </div>
                        <!-- Depth -->
                        <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Depth</label>
                        <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                            <InputText v-model="product.depth" class="w-full text-lg" />
                        </div>
                        <!-- Size -->
                        <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Size</label>
                        <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                            <InputNumber v-model="product.size" class="w-full text-lg" />
                        </div>
                    </div>
                </div>
                <!-- Carton Details Section -->
                <div class="space-y-4">
                    <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Carton Details</h3>
                    <div class="grid grid-cols-12 gap-x-6 gap-y-4">
                        <!-- Carton QM -->
                        <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Carton
                            QM</label>
                        <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                            <InputNumber v-model="product.carton_qm" class="w-full text-lg" />
                        </div>
                        <!-- Carton Width -->
                        <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Carton
                            Width</label>
                        <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                            <InputNumber v-model="product.carton_width" class="w-full text-lg" />
                        </div>
                        <!-- Carton Depth -->
                        <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Carton
                            Depth</label>
                        <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                            <InputNumber v-model="product.carton_depth" class="w-full text-lg" />
                        </div>
                        <!-- Carton Height -->
                        <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Carton
                            Height</label>
                        <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                            <InputNumber v-model="product.carton_height" class="w-full text-lg " />
                        </div>
                        <!-- Gross Weight -->
                        <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Gross
                            Weight</label>
                        <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                            <InputNumber v-model="product.gross_weight" class="w-full text-lg " />
                        </div>
                        <!--Date Available-->
                        <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Date
                            Available</label>
                        <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                            <DatePicker v-model="product.date_available" class="w-full text-lg" />
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