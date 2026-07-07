<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useItemOptionStore } from '@/stores/itemOption';
import { debounce } from 'lodash';
import UploadFileFeature from '@/components/upload/UploadFileFeature.vue';
const emit = defineEmits(['update:itemOption', 'saved', 'editTabUnmunted', 'editTabMounted']);

const route = useRoute();
const itemOptionStore = useItemOptionStore();
const { itemOption, fb, types } = storeToRefs(itemOptionStore);

const productSuggestions = ref<any[]>([]);
const itemSuggestions = ref<any[]>([]);
const productVariantSuggestions = ref<any[]>([]);
const optionGroupSuggestions = ref<any[]>([]);
const optionSuggestions = ref<any[]>([]);

const searchProducts = async (event: any) => {
    const query = event.query?.toLowerCase();
    // console.log("query", query);
    if (query?.length > 0) {
        itemOptionStore.searchProducts(query).then(results => {
            // console.log("results", results);
            productSuggestions.value = results;
        });
    } else {
        productSuggestions.value = [];
    }
    console.log('productSuggestions', productSuggestions.value);
}

function addProduct(event: { value: any }) {
    if (itemOption.value) {
        itemOption.value.product_id = event.value.product_id;
        itemOption.value.product_code = event.value.product_code;
    }
    // console.log('product Id.value', itemOption.value);
}

const searchItems = async (event: any) => {
    const query = event.query?.toLowerCase();
    // console.log("query", query);
    if (query?.length > 0) {
        itemOptionStore.searchItems(query, itemOption.value.product_id as number).then(results => {
            // console.log("results", results);
            itemSuggestions.value = results;
        });
    } else {
        itemSuggestions.value = [];
    }
    console.log('itemSuggestions', itemSuggestions.value);
}

const addItem = async (event: any) => {
    // alert('handleAddItem');
    if (itemOption.value) {
        itemOption.value.item_id = event.value.item_id;
        itemOption.value.item_code = event.value.item_code;
    }
}

const searchProductVariants = async (event: any) => {
    const query = event.query?.toLowerCase();
    if (query?.length > 0) {
        itemOptionStore.searchProductVariants(query, itemOption.value.product_id as number).then(results => {
            productVariantSuggestions.value = results;
        });
    }
}

const searchOptionGroups = async (event: any) => {
    const query = event.query?.toLowerCase();
    if (query?.length > 0) {
        itemOptionStore.searchOptionGroups(query, itemOption.value.product_id as number, itemOption.value.product_variant_id as number).then(results => {
            optionGroupSuggestions.value = results;
        });
    }
}

const searchOption = async (event: any) => {
    const query = event.query?.toLowerCase();
    if (query?.length > 0) {
        itemOptionStore.searchOption(query, itemOption.value.product_id as number, itemOption.value.product_variant_id as number, itemOption.value.product_option_group_id as number).then(results => {
            optionSuggestions.value = results;
        });
    }
}

const addProductVariant = async (event: any) => {
    if (itemOption.value) {
        itemOption.value.product_variant_id = event.value.product_variant_id;
        itemOption.value.variant_name = event.value.variant_name;
    }
}

const addOptionGroup = async (event: any) => {
    if (itemOption.value) {
        itemOption.value.product_option_group_id = event.value.product_option_group_id;
        itemOption.value.option_group_name = event.value.option_group_name;
    }
}

const addOption = async (event: any) => {
    if (itemOption.value) {
        itemOption.value.product_option_id = event.value.product_option_id;
        itemOption.value.product_option_name = event.value.product_option_name;
    }
}
const onProductInput = debounce(searchProducts, 300)
const onItemInput = debounce(searchItems, 300)
const onProductVariantInput = debounce(searchProductVariants, 300)
const onOptionGroupInput = debounce(searchOptionGroups, 300)
const onOptionInput = debounce(searchOption, 300)

onMounted(async () => {
    emit('editTabMounted');
    if (route.params.id) {
        await itemOptionStore.fetchItemOptionById(route.params.id as string);//string data type
    }
});


const uploadItemOptionImages = async (event: any) => {
    try {
        let files = event.files;
        files = files.map((file: any) => {
            let f = itemOption.value.image.find((img: any) => img.name === file.file?.name);
            if (f) file.id = f.id;
            return file;
        });
        console.log("files", files);
        await itemOptionStore.uploadItemOptionImages(files, 'image', itemOption.value.item_option_id as number);
    } catch (error) {
        console.error('Error uploading image:', error);
    }
}

const deleteItemOptionImages = async (file: any) => {
    try {
        await itemOptionStore.deleteItemOptionImages(file, itemOption.value.item_option_id as number);
        itemOption.value.image = [];
    } catch (error) {
        console.error('Error deleting image:', error);
    }
}


onUnmounted(() => {
    emit('editTabUnmunted');
});
</script>

<template>
    <div class="flex flex-col gap-6">
        <!-- Global Unique Key Error -->
        <Message v-if="fb.errors?.['itemOption.update.' + itemOption.item_option_id]?.global_message" severity="error"
            size="small">
            <div class="flex flex-col gap-2 w-full pb-3">
                <span v-for="error in fb.errors?.['itemOption.update.' + itemOption.item_option_id]?.global_message"
                    :key="error" class="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded-md shadow-sm">
                    {{ error }}
                </span>
            </div>
        </Message>

        <div class="loading-overlay border-2" v-if="fb.loading['itemOption.edit.' + route.params.id]">
            <div class="flex justify-center items-center h-full spinner">
                <i class="pi pi-spin pi-spinner" style="font-size: 2rem;"></i>
                <p class="mt-2">Loading itemOption data. Please wait.</p>
            </div>
        </div>

        <div class="flex flex-col md:flex-row gap-6">
            <!-- Left column: Option Form -->
            <div class="sm:w-full md:w-3/5 space-y-4">
                <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Edit Item Option</h3>
                <div class="grid grid-cols-12 gap-x-6 gap-y-4">
                    <!-- Option Name -->
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Item Option</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <InputText v-model="itemOption.option_name"
                            class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Enter option name"
                            :class="{ 'p-invalid': fb.errors?.['itemOption.update.' + itemOption.item_option_id]?.option_name }" />
                        <Message v-if="fb.errors?.['itemOption.update.' + itemOption.item_option_id]?.option_name"
                            severity="error" size="small" itemOption="title">
                            <span v-for="error in fb.errors?.['itemOption.update.' + itemOption.item_option_id]?.option_name"
                                :key="error" class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>
                    <!-- Item -->
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Item</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <AutoComplete ref="itemAutocomplete" :suggestions="itemSuggestions" @complete="onItemInput"
                            @item-select="addItem" optionLabel="item_code" v-model="itemOption.item_code"
                            placeholder="Type for autocomplete" class="w-full related-products-autocomplete"
                            inputClass="w-full !rounded-md !border !border-gray-200 !shadow-none !focus:ring-0" />
                        <Message v-if="fb.errors?.['itemOption.update.' + itemOption.item_option_id]?.item_id"
                            severity="error" size="small" itemOption="title">
                            <span
                                v-for="error in fb.errors?.['itemOption.update.' + itemOption.item_option_id]?.item_id"
                                :key="error" class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>
                    <!-- Product -->
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Product</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <AutoComplete ref="productAutocomplete" :suggestions="productSuggestions"
                            @complete="onProductInput" @item-select="addProduct" optionLabel="product_code"
                            v-model="itemOption.product_code" placeholder="Type for autocomplete"
                            class="w-full related-products-autocomplete"
                            inputClass="w-full !rounded-md !border !border-gray-200 !shadow-none !focus:ring-0" />
                        <Message v-if="fb.errors?.['itemOption.update.' + itemOption.item_option_id]?.product_id"
                            severity="error" size="small" itemOption="title">
                            <span
                                v-for="error in fb.errors?.['itemOption.update.' + itemOption.item_option_id]?.product_id"
                                :key="error" class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>

                    <!-- Product Variant -->
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Product
                        Variant</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <AutoComplete ref="productVariantAutocomplete" :suggestions="productVariantSuggestions"
                            @complete="onProductVariantInput" @item-select="addProductVariant"
                            optionLabel="variant_name" v-model="itemOption.variant_name"
                            placeholder="Type for autocomplete" class="w-full related-products-autocomplete"
                            inputClass="w-full !rounded-md !border !border-gray-200 !shadow-none !focus:ring-0" />
                        <Message
                            v-if="fb.errors?.['itemOption.update.' + itemOption.item_option_id]?.product_variant_id"
                            severity="error" size="small" itemOption="title">
                            <span
                                v-for="error in fb.errors?.['itemOption.update.' + itemOption.item_option_id]?.product_variant_id"
                                :key="error" class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>
                    <!-- Product Option Group -->
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Product Option
                        Group</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <AutoComplete ref="optionGroupAutocomplete" :suggestions="optionGroupSuggestions"
                            @complete="onOptionGroupInput" @item-select="addOptionGroup" optionLabel="option_group_name"
                            v-model="itemOption.option_group_name" placeholder="Type for autocomplete"
                            class="w-full related-products-autocomplete"
                            inputClass="w-full !rounded-md !border !border-gray-200 !shadow-none !focus:ring-0" />
                        <Message
                            v-if="fb.errors?.['itemOption.update.' + itemOption.item_option_id]?.product_option_group_id"
                            severity="error" size="small" itemOption="title">
                            <span
                                v-for="error in fb.errors?.['itemOption.update.' + itemOption.item_option_id]?.product_option_group_id"
                                :key="error" class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>

                    <!-- Product Option -->
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Product
                        Option</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <AutoComplete ref="optionAutocomplete" :suggestions="optionSuggestions"
                            @complete="onOptionInput" @item-select="addOption" optionLabel="product_option_name"
                            v-model="itemOption.product_option_name" placeholder="Type for autocomplete"
                            class="w-full related-products-autocomplete"
                            inputClass="w-full !rounded-md !border !border-gray-200 !shadow-none !focus:ring-0" />
                        <Message v-if="fb.errors?.['itemOption.update.' + itemOption.item_option_id]?.option_id"
                            severity="error" size="small" itemOption="title">
                            <span
                                v-for="error in fb.errors?.['itemOption.update.' + itemOption.item_option_id]?.option_id"
                                :key="error" class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>


                    <!-- type -->
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Type</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <Select v-model="itemOption.type_id" :options="types" optionLabel="name" optionValue="id"
                            class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Select type"
                            filter
                            :class="{ 'p-invalid': fb.errors?.['itemOption.update.' + itemOption.item_option_id]?.type_id }" />
                        <Message v-if="fb.errors?.['itemOption.update.' + itemOption.item_option_id]?.type_id"
                            severity="error" size="small" itemOption="title">
                            <span
                                v-for="error in fb.errors?.['itemOption.update.' + itemOption.item_option_id]?.type_id"
                                :key="error" class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>
                    <!-- value -->
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Value</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <InputText v-model="itemOption.value"
                            class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Enter value" />
                    </div>
                    <!-- required -->
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Required</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <InputText v-model="itemOption.required" type="number"
                            class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Enter required" />
                    </div>
                    <!-- hex color -->
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg"> <nobr>Hex Color : <span :style="{ color: itemOption.hex_color }">{{ itemOption.hex_color }}</span></nobr></label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <InputText v-model="itemOption.hex_color" type ="color"
                            class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Enter hex color" />
                    </div>
                    <!-- meta description -->
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Meta
                        Description</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <Textarea v-model="itemOption.meta_description"
                            class="w-full text-lg border border-gray-200 rounded-md p-2"
                            placeholder="Enter meta description" />
                    </div>
                </div>
            </div>
            <!-- right column: Option Details -->
            <div class="sm:w-full md:w-2/5 space-y-4">
                <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Option Image</h3>
                <div class="grid grid-cols-12 gap-x-6 gap-y-4">
                    <!-- Option image -->
                    <!-- <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Image</label> -->
                    <div class="col-span-12 md:col-span-9 xl:col-span-12 py-2">
                        <UploadFileFeature v-model:uploadedFilesData="itemOption.image" :fb="fb" :property="'option_image'"
                            @upload="uploadItemOptionImages($event)" @removeUploadedFile="deleteItemOptionImages($event)"
                            class="w-full text-lg border border-gray-200 rounded-md p-2"
                            placeholder="Upload option image" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>