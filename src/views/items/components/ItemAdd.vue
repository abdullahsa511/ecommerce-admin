<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useItemStore } from '@/stores/item';
import { Select } from 'primevue';
import InputNumber from 'primevue/inputnumber';
import DatePicker from 'primevue/datepicker';
import { useProductStore } from '@/stores/product';
import { debounce } from 'lodash';

const productStore = useProductStore();
const itemStore = useItemStore();
const { item, fb } = storeToRefs(itemStore);

const productSuggestions = ref<any[]>([]);
const productVariantSuggestions = ref<any[]>([]);
const emit = defineEmits(['update:item', 'saved']);

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

const onProductInput = debounce(searchProducts, 300)
const onProductVariantInput = debounce(searchVariants, 300)

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
    { label: 'Item', value: '1' },
    { label: 'Kit Item', value: '2' },
    { label: 'Component', value: '3' },
]
const warrantyPeriodOptions = [
    { label: '1 Year', value: '1' },
    { label: '2 Years', value: '2' },
    { label: '3 Years', value: '3' },
    { label: '4 Years', value: '4' },
    { label: '5 Years', value: '5' },
    { label: '6 Years', value: '6' },
    { label: '7 Years', value: '7' },
    { label: '8 Years', value: '8' },
    { label: '9 Years', value: '9' },
    { label: '10 Years', value: '10' },
]


</script>

<template>
    <div class="flex flex-col gap-8">
        <!-- CARD 1: PRODUCT INFORMATION -->
        <div class="bg-white rounded-2xl p-4">
            <div class="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-4 md:gap-6 items-center border-b pb-3 mb-6">
                <!-- Product Information - Full row on mobile, left on desktop -->
                <div class="col-span-1 md:col-start-1 row-start-1">
                    <h2 class="text-xl font-semibold text-gray-700">Product Information</h2>
                </div>
                
                <!-- Active and Archive - Full row on mobile (2nd row), middle on desktop -->
                <div class="col-span-1 md:col-start-2 row-start-2 md:row-start-1 flex items-center gap-4 md:gap-6">
                    <div class="flex items-center gap-2">
                        <label class="block text-sm font-medium text-gray-600 mb-1">Active</label>
                        <ToggleSwitch v-model="item.active" type="boolean" />
                    </div>
                    <div class="flex items-center gap-2">
                        <label class="block text-sm font-medium text-gray-600 mb-1">Archive</label>
                        <ToggleSwitch v-model="item.archive" />
                    </div>
                    <div class="flex items-center gap-2">
                        <label class="block text-sm font-medium text-gray-600">Track Stock</label>
                        <ToggleSwitch v-model="item.track_stock" />
                    </div>
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
                <div class="col-span-12 md:col-span-4">
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
                 <div class="col-span-12 md:col-span-4">
                     <label class="block text-sm font-medium text-gray-600 mb-1">Product Variant</label>
                     <AutoComplete ref="productVariantAutocomplete"
                             inputClass="w-full !rounded-md !border !border-gray-200 !shadow-none !focus:ring-0"
                             placeholder="Type for autocomplete" class="w-full related-products-autocomplete"
                             optionLabel="variant_name" v-model="item.product_variant"
                             :suggestions="productVariantSuggestions" @complete="onProductVariantInput"
                             @item-select="addProductVariant" :class="{ 'p-invalid': fb.errors?.['item.create']?.product_variant_id }" />
                     <Message v-if="fb.errors?.['item.create']?.product_variant_id" severity="error" size="small"
                         item="title">
                         <span v-for="error in fb.errors?.['item.create']?.product_variant_id" :key="error"
                             class="flex flex-col">
                             {{ error }}
                         </span>
                     </Message>
                 </div>
                 <div class="col-span-12 md:col-span-4">
                     <label class="block text-sm font-medium text-gray-600 mb-1">Item Category ID</label>
                     <Select v-model="item.item_category_id" :options="itemCategoryOptions" optionLabel="label" optionValue="value" placeholder="Select item category"
                         class="w-full" />
                 </div>

                <div class="col-span-12 md:col-span-4">
                    <label class="block text-sm font-medium text-gray-600 mb-1">Item Category ID</label>
                    <Select v-model="item.item_category_id" :options="itemCategoryOptions" optionLabel="label" optionValue="value" placeholder="Select item category"
                        class="w-full" />
                </div>
                <div class="col-span-12 md:col-span-4">
                    <label class="block text-sm font-medium text-gray-600 mb-1">Item Type ID</label>
                    <Select v-model="item.item_type_id" :options="itemTypeOptions" optionLabel="label" optionValue="value" placeholder="Select item type"
                            class="w-full" />
                </div>
                <div class="col-span-12 md:col-span-4">
                    <label class="block text-sm font-medium text-gray-600 mb-1">KM Item ID</label>
                    <InputText v-model="item.km_item_id" placeholder="Enter KM item ID" disabled
                        class="w-full" :class="{ 'p-invalid': fb.errors?.['item.create']?.km_item_id }" />
                    <Message v-if="fb.errors?.['item.create']?.km_item_id" severity="error" size="small" item="title">
                        <span v-for="error in fb.errors?.['item.create']?.km_item_id" :key="error" class="flex flex-col">
                            {{ error }}
                        </span>
                    </Message>
                </div>
                <div class="col-span-12 md:col-span-4">
                    <label class="block text-sm font-medium text-gray-600 mb-1">Item Code</label>
                    <InputText v-model="item.item_code" placeholder="Enter item code"
                        class="w-full"
                        :class="{ 'p-invalid': fb.errors?.['item.create']?.item_code }" />
                    <Message v-if="fb.errors?.['item.create']?.item_code" severity="error" size="small" item="title">
                        <span v-for="error in fb.errors?.['item.create']?.item_code" :key="error" class="flex flex-col">
                            {{ error }}
                        </span>
                    </Message>
                </div>
                <div class="col-span-12 md:col-span-4">
                    <label class="block text-sm font-medium text-gray-600 mb-1">Web SKU</label>
                    <InputText v-model="item.web_sku" placeholder="Enter web SKU"
                        class="w-full" />
                </div>
                <div class="col-span-12 md:col-span-4">
                    <label class="block text-sm font-medium text-gray-600 mb-1">Web Link</label>
                    <InputText v-model="item.web_link" placeholder="Enter web link"
                        class="w-full" />
                </div>
              
                <div class="col-span-12 md:col-span-4">
                    <label class="block text-sm font-medium text-gray-600 mb-1">Vendor ID</label>
                    <InputText v-model="item.vendor_id" placeholder="Enter vendor ID"
                        class="w-full" />
                </div>
                <div class="col-span-12 md:col-span-4">
                    <label class="block text-sm font-medium text-gray-600 mb-1">Import Vendor ID</label>
                    <InputText v-model="item.import_vendor_id" placeholder="Enter import vendor ID"
                        class="w-full" />
                </div>
                <div class="col-span-12 md:col-span-4">
                    <label class="block text-sm font-medium text-gray-600 mb-1">Factory Vendor ID</label>
                    <InputText v-model="item.factory_vendor_id" placeholder="Enter factory vendor ID"
                        class="w-full" />
                </div>
                <div class="col-span-12 md:col-span-4">
                    <label class="block text-sm font-medium text-gray-600 mb-1">Description</label>
                    <Textarea v-model="item.description" placeholder="Enter description"
                        class="w-full" />
                </div>
                <div class="col-span-12 md:col-span-4">
                    <label class="block text-sm font-medium text-gray-600 mb-1">Specifications</label>
                    <Textarea v-model="item.specifications" placeholder="Enter specifications"
                        class="w-full" />
                </div>
                <div class="col-span-12 md:col-span-4">
                    <label class="block text-sm font-medium text-gray-600 mb-1">User Note</label>
                    <Textarea v-model="item.user_note" placeholder="Enter notes"
                        class="w-full" />
                </div>
               
            </div>
        </div>

        <!-- CARD 2: INVENTORY & STOCK SETTINGS -->
        <div class="bg-white rounded-2xl p-4">
            <div class="flex items-end gap-6 border-b pb-3 mb-6">
                <h2 class="text-xl font-semibold text-gray-700 ">Inventory & Stock Settings</h2>
            </div>

            <div class="grid grid-cols-12 gap-6">
                <div class="col-span-12 md:col-span-4">
                    <label class="block text-sm font-medium text-gray-600 mb-1">Warranty Period</label>
                    <Select v-model="item.warranty_period" :options="warrantyPeriodOptions" optionLabel="label" optionValue="value" 
                            placeholder="Select warranty period"
                            class="w-full" />
                </div>
                <div class="col-span-12 md:col-span-4">
                    <label class="block text-sm font-medium text-gray-600 mb-1">Safety Stock</label>
                    <InputNumber v-model="item.safety_stock" placeholder="Enter safety stock"
                        class="w-full" />
                </div>
                <div class="col-span-12 md:col-span-4">
                    <label class="block text-sm font-medium text-gray-600 mb-1">Lead Days</label>
                    <InputNumber v-model="item.lead_days" placeholder="Enter lead days"
                        class="w-full" />
                </div>
                <div class="col-span-12 md:col-span-4">
                    <label class="block text-sm font-medium text-gray-600 mb-1">Melbourne Lead Days</label>
                    <InputNumber v-model="item.melbourne_lead_days" placeholder="Enter Melbourne lead days"
                        class="w-full" />
                </div>
                <div class="col-span-12 md:col-span-4">
                    <label class="block text-sm font-medium text-gray-600 mb-1">Brisbane Lead Days</label>
                    <InputNumber v-model="item.brisbane_lead_days" placeholder="Enter Brisbane lead days"
                        class="w-full" />
                </div>
                <div class="col-span-12 md:col-span-4">
                    <label class="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
                    <InputText v-model="item.phone_number" placeholder="Enter phone number"
                        class="w-full" />
                </div>
            </div>
        </div>

        <!-- CARD 3: Shipping & Dimensions-->
        <div class="bg-white rounded-2xl p-4">
            <h2 class="text-xl font-semibold text-gray-700 border-b pb-3 mb-6">Shipping & Dimensions</h2>

            <div class="grid grid-cols-12 gap-6">
                <div class="col-span-12 md:col-span-4">
                    <label class="block text-sm font-medium text-gray-600 mb-1">Width</label>
                    <InputNumber v-model="item.width" placeholder="Enter width"
                        class="w-full" />
                </div>
                <div class="col-span-12 md:col-span-4">
                    <label class="block text-sm font-medium text-gray-600 mb-1">Height</label>
                    <InputNumber v-model="item.height" placeholder="Enter product height"
                        class="w-full" />
                </div>
                <div class="col-span-12 md:col-span-4">
                    <label class="block text-sm font-medium text-gray-600 mb-1">Depth</label>
                    <InputNumber v-model="item.depth" placeholder="Enter depth"
                        class="w-full" />
                </div>
                <div class="col-span-12 md:col-span-4">
                    <label class="block text-sm font-medium text-gray-600 mb-1">Carton Width</label>
                    <InputNumber v-model="item.carton_width" placeholder="Enter carton width"
                        class="w-full" />
                </div>
                <div class="col-span-12 md:col-span-4">
                    <label class="block text-sm font-medium text-gray-600 mb-1">Carton Height</label>
                    <InputNumber v-model="item.carton_height" placeholder="Enter carton height"
                        class="w-full" />
                </div>
                <div class="col-span-12 md:col-span-4">
                    <label class="block text-sm font-medium text-gray-600 mb-1">Carton Depth</label>
                    <InputNumber v-model="item.carton_depth" placeholder="Enter carton depth"
                        class="w-full" />
                </div>
                <div class="col-span-12 md:col-span-4">
                    <label class="block text-sm font-medium text-gray-600 mb-1">Carton QM</label>
                    <InputNumber v-model="item.carton_qm" placeholder="Enter carton QM"
                        class="w-full" />
                </div>
                <div class="col-span-12 md:col-span-4">
                    <label class="block text-sm font-medium text-gray-600 mb-1">Gross Weight</label>
                    <InputNumber v-model="item.gross_weight" placeholder="Enter gross weight"
                        class="w-full" />
                </div>
                <div class="col-span-12 md:col-span-4">
                    <label class="block text-sm font-medium text-gray-600 mb-1">Products Per Carton</label>
                    <InputNumber v-model="item.products_per_cartoon" placeholder="Enter products per carton"
                        class="w-full" />
                </div>
                <div class="col-span-12 md:col-span-4">
                    <label class="block text-sm font-medium text-gray-600 mb-1">Delay Until</label>
                    <DatePicker v-model="item.delay_until" placeholder="Enter delay date"
                        class="w-full" />
                </div>
                <div class="col-span-12 md:col-span-4">
                    <label class="block text-sm font-medium text-gray-600 mb-1">Delay Until Reason</label>
                    <InputText v-model="item.delay_until_reason" placeholder="Enter reason"
                        class="w-full" />
                </div>
            </div>
        </div>

        <!-- CARD 4: Accounting & Discount -->
        <div class="bg-white rounded-2xl p-4">
            <h2 class="text-xl font-semibold text-gray-700 border-b pb-3 mb-6">Accounting & Discount</h2>

            <div class="grid grid-cols-12 gap-6">
                <div class="col-span-12 md:col-span-4">
                    <label class="block text-sm font-medium text-gray-600 mb-1">Krost Zoho ID</label>
                    <InputText v-model="item.krost_zoho_id" placeholder="Enter Zoho ID"
                        class="w-full" />
                </div>
                <div class="col-span-12 md:col-span-4">
                    <label class="block text-sm font-medium text-gray-600 mb-1">Krost QLD Zoho ID</label>
                    <InputText v-model="item.krost_qld_zoho_id" placeholder="Enter QLD Zoho ID"
                        class="w-full" />
                </div>
                <div class="col-span-12 md:col-span-4">
                    <label class="block text-sm font-medium text-gray-600 mb-1">Meloz Zoho ID</label>
                    <InputText v-model="item.meloz_zoho_id" placeholder="Enter Meloz Zoho ID"
                        class="w-full" />
                </div>
                <div class="col-span-12 md:col-span-4">
                    <label class="block text-sm font-medium text-gray-600 mb-1">Gregbar Zoho ID</label>
                    <InputText v-model="item.gregbar_zoho_id" placeholder="Enter Gregbar Zoho ID"
                        class="w-full" />
                </div>
                <div class="col-span-12 md:col-span-4">
                    <label class="block text-sm font-medium text-gray-600 mb-1">Klein Zoho ID</label>
                    <InputText v-model="item.klein_zoho_id" placeholder="Enter Klein Zoho ID"
                        class="w-full" />
                </div>
                <div class="col-span-12 md:col-span-4">
                    <label class="block text-sm font-medium text-gray-600 mb-1">Project Price Qty</label>
                    <InputNumber v-model="item.project_price_qty" placeholder="Enter project price qty"
                        class="w-full" />
                </div>
                <div class="col-span-12 md:col-span-4">
                    <label class="block text-sm font-medium text-gray-600 mb-1">Project Price Discount</label>
                    <InputNumber v-model="item.project_price_discount" placeholder="Enter project price discount"
                        class="w-full" />
                </div>
            </div>
        </div>
    </div>
</template>
