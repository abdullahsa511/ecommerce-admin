<script setup lang="ts">
import { onMounted, ref } from 'vue';
import ItemSidebar from './ItemSidebar.vue';
import Item from '@/models/Item';
import { useItemStore } from '@/stores/item';
import { storeToRefs } from 'pinia';
import { Select } from 'primevue';
import { useProductStore } from '@/stores/product';
import { debounce } from 'lodash';
import { useRoute } from 'vue-router';



const emit = defineEmits(['update:item', 'saved']);

// const props = defineProps({
//   item: {
//     type: Item,
//     required: true,
//     default: () => new Item({})
//   }
// });

const route = useRoute();
const productStore = useProductStore();
const itemStore = useItemStore();
const { item, fb } = storeToRefs(itemStore);

const productSuggestions = ref<any[]>([]);
const productVariantSuggestions = ref<any[]>([]);


const updateItem = (data: any) => {
    emit('update:item', data);
}

const searchProducts = async (event: any) => {
    const query = event.query?.toLowerCase();
    // console.log("query", query);
    if (query?.length > 0) {
        productStore.searchProducts(query).then(results => {
            // console.log("results", results);
            productSuggestions.value = results;
        });
    } else {
        productSuggestions.value = [];
    }
}

const searchVariants = async (event: any) => {
    console.log('event data:', event);
    let query = event.query?.toLowerCase();
    if (query?.length > 0 && item.value.product_id && item.value.product_id > 0) {
        productVariantSuggestions.value = await productStore.listProductVariants(query, item.value.product_id);
    } else {
        productVariantSuggestions.value = [];
    }
}

function addProduct(event: { value: any }) {
    if (item.value) {
        item.value.product_id = event.value.product_id as number;
        item.value.product_code = event.value.product_code as string;
    }
    console.log('product Id.value', item.value.product_id);
}

function addProductVariant(event: { value: any }) {
    if (item.value) {
        item.value.product_variant_id = event.value.product_variant_id as number;
        item.value.product_variant = event.value.variant_name as string;
    }
    console.log('product variant Id.value', item.value.product_variant_id);
}
// CATEGORY OPTIONS
const itemCategoryOptions = [
    { label: 'Furniture', value: '1' },
    { label: 'Lighting', value: '2' },
    { label: 'Accessories', value: '3' },
    { label: 'Home Decor', value: '4' },
    { label: 'Home Improvement', value: '5' },
];
// ITEM TYPE OPTIONS
const itemTypeOptions = [
    { label: 'Physical', value: '1' },
    { label: 'Digital', value: '2' },
    { label: 'Service', value: '3' },
]

const onProductInput = debounce(searchProducts, 300)
const onProductVariantInput = debounce(searchVariants, 300)


onMounted(() => {
    console.log('feching data for item edit page:', item.value);
    
});


</script>

<template>
    <!-- General Tab -->
    <div class="flex flex-col gap-6">
        <div class="loading-overlay border-2" v-if="fb.loading['item.edit.'+route.params.id]">
            <div class="flex justify-center items-center h-full spinner">
                <i class="pi pi-spin pi-spinner" style="font-size: 2rem;"></i>
                <p class="mt-2">Loading item data. Please wait.</p>
            </div>
        </div>

        <div class="loading-overlay" v-if="fb.loading['product.show']">
            <div class="flex justify-center items-center h-full spinner">
                <i class="pi pi-spin pi-spinner" style="font-size: 2rem;"></i>
                <p class="mt-2">Loading product variants data. Please wait.</p>
            </div>
        </div>

        <div class="flex flex-col xl:flex-row  gap-6">
            <!-- Left column -->
            <div class="sm:w-full md:w-full lg:w-full xl:w-3/5 space-y-4">
                <div class="bg-white rounded-2xl p-4">
                    <div class="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-4 md:gap-6 items-center border-b pb-3 mb-6">
                        <!-- Product Information - Full row on mobile, left on desktop -->
                        <div class="col-span-1 md:col-start-1 row-start-1">
                            <h2 class="text-xl font-semibold text-gray-700">Product Information</h2>
                        </div>
                        <!-- Sort Order - Full row on mobile (3rd row), right on desktop -->
                        <div class="col-span-1 md:col-start-3 row-start-3 md:row-start-1 flex items-center gap-2">
                            <label class="block text-sm font-medium text-gray-600 mb-1" style="min-width: 60px;">Sort Order</label>
                            <InputNumber v-model="item.sort_order" placeholder="Enter sort order" disabled
                                class="w-full" />
                        </div>
                    </div>
                    <!-- Global Unique Key Error -->
                    <Message v-if="fb.errors?.['item.create']?.unique_key" severity="error" size="small">
                        <div class="flex flex-col gap-2 w-full pb-3">
                            <span v-for="error in fb.errors?.['item.create']?.unique_key" :key="error"
                                class="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded-md shadow-sm">
                                {{ error }}
                            </span>
                        </div>
                    </Message>
                    
                    <div class="grid grid-cols-12 gap-6">
                        <div class="col-span-12 md:col-span-6 ">
                            <label class="block text-sm font-medium text-gray-600 mb-1">Item Code</label>
                            <InputText v-model="item.item_code" placeholder="Enter item code" disabled
                                class="w-full"
                                :class="{ 'p-invalid': fb.errors?.['item.create']?.item_code }" />
                        </div>
                        <div class="col-span-12 md:col-span-6">
                            <label class="block text-sm font-medium text-gray-600 mb-1">Web SKU</label>
                            <InputText v-model="item.web_sku" placeholder="Enter web SKU" disabled
                                class="w-full" />
                        </div>
                        <div class="col-span-12 ">
                            <label class="block text-sm font-medium text-gray-600 mb-1">KM Item ID</label>
                            <InputText v-model="item.km_item_id" placeholder="Enter KM item ID" disabled
                                class="w-full" :class="{ 'p-invalid': fb.errors?.['item.create']?.km_item_id }" />
                        </div>
                        <div class="col-span-12 ">
                            <label class="block text-sm font-medium text-gray-600 mb-1">Product Code</label>
                            <AutoComplete ref="productAutocomplete" :suggestions="productSuggestions"
                                    @complete="onProductInput" @item-select="addProduct" optionLabel="product_code"
                                    v-model="item.product_code" placeholder="Type for autocomplete"
                                    class="w-full related-products-autocomplete"
                                    inputClass="w-full !rounded-md !border  !shadow-none !focus:ring-0" 
                                    :class="{ 'p-invalid': fb.errors?.['item.create']?.product_id }"/>
                            <Message v-if="fb.errors?.['item.create']?.product_id" severity="error" size="small" item="title">
                                <span v-for="error in fb.errors?.['item.create']?.product_id" :key="error"
                                    class="flex flex-col">
                                    {{ error }}
                                </span>
                            </Message>
                        </div>
                        <div class="col-span-12 ">
                            <label class="block text-sm font-medium text-gray-600 mb-1">Item Category ID</label>
                            <Select v-model="item.item_category_id" :options="itemCategoryOptions" optionLabel="label" optionValue="value" placeholder="Select item category"
                                class="w-full" />
                        </div>
                        <div class="col-span-12 ">
                            <label class="block text-sm font-medium text-gray-600 mb-1">Item Type ID</label>
                            <Select v-model="item.item_type_id" :options="itemTypeOptions" optionLabel="label" optionValue="value" placeholder="Select item type"
                                    class="w-full" />
                        </div>
                    
                        <div class="col-span-12 ">
                            <label class="block text-sm font-medium text-gray-600 mb-1">Vendor ID</label>
                            <InputText v-model="item.vendor_id" placeholder="Enter vendor ID"
                                class="w-full" />
                        </div>
                        <div class="col-span-12 ">
                            <label class="block text-sm font-medium text-gray-600 mb-1">Import Vendor ID</label>
                            <InputText v-model="item.import_vendor_id" placeholder="Enter import vendor ID"
                                class="w-full" />
                        </div>
                        <div class="col-span-12 ">
                            <label class="block text-sm font-medium text-gray-600 mb-1">Factory Vendor ID</label>
                            <InputText v-model="item.factory_vendor_id" placeholder="Enter factory vendor ID"
                                class="w-full" />
                        </div>
                        <div class="col-span-12 ">
                            <label class="block text-sm font-medium text-gray-600 mb-1">Description</label>
                            <Textarea v-model="item.description" placeholder="Enter description" rows="4"
                                class="w-full" />
                        </div>
                        <div class="col-span-12 ">
                            <label class="block text-sm font-medium text-gray-600 mb-1">Specifications</label>
                            <Textarea v-model="item.specifications" placeholder="Enter specifications" rows="8"
                                class="w-full" />
                        </div>
                        <div class="col-span-12 ">
                            <label class="block text-sm font-medium text-gray-600 mb-1">User Note</label>
                            <Textarea v-model="item.user_note" placeholder="Enter notes"
                                class="w-full" />
                        </div>
                        <div class="col-span-12 ">
                            <label class="block text-sm font-medium text-gray-600 mb-1">Web Link</label>
                            <InputText v-model="item.web_link" placeholder="Enter web link"
                                class="w-full" />
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Right column -->
            <ItemSidebar :item="item" @update:item="updateItem" />
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