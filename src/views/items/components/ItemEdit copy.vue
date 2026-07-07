<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useItemStore } from '@/stores/item';

const emit = defineEmits(['update:item', 'saved', 'editTabUnmunted', 'editTabMounted']);

const route = useRoute();
const itemStore = useItemStore();
const { item, fb, products, productVariants } = storeToRefs(itemStore);

const stockFields = [
    { label: 'Warranty Period', model: 'warranty_period', placeholder: 'Enter warranty period' },
    { label: 'Track Stock', model: 'track_stock', placeholder: 'Enter track stock' },
    { label: 'Safety Stock', model: 'safety_stock', placeholder: 'Enter safety stock' },
    { label: 'Lead Days', model: 'lead_days', placeholder: 'Enter lead days' },
    { label: 'Melbourne Lead Days', model: 'melbourne_lead_days', placeholder: 'Enter Melbourne lead days' },
    { label: 'Brisbane Lead Days', model: 'brisbane_lead_days', placeholder: 'Enter Brisbane lead days' },
    { label: 'Phone Number', model: 'phone_number', placeholder: 'Enter phone number' },
    { label: 'Width', model: 'width', placeholder: 'Enter width' }
];

const dimensionFields = [
    { label: 'Width', model: 'width', placeholder: 'Enter width' },
    { label: 'Height', model: 'height', placeholder: 'Enter product height' },
    { label: 'Depth', model: 'depth', placeholder: 'Enter depth' },
    { label: 'Carton Width', model: 'carton_width', placeholder: 'Enter carton width' },
    { label: 'Carton Height', model: 'carton_height', placeholder: 'Enter carton height' },
    { label: 'Carton Depth', model: 'carton_depth', placeholder: 'Enter carton depth' },
    { label: 'Carton QM', model: 'carton_qm', placeholder: 'Enter carton QM' },
    { label: 'Gross Weight', model: 'gross_weight', placeholder: 'Enter gross weight' },
    { label: 'Products Per Carton', model: 'products_per_cartoon', placeholder: 'Enter products per carton' },
    { label: 'Project Price Qty', model: 'project_price_qty', placeholder: 'Enter project price qty' },
    { label: 'Project Price Discount', model: 'project_price_discount', placeholder: 'Enter project price discount' },
    { label: 'Sort Order', model: 'sort_order', placeholder: 'Enter sort order' },
    { label: 'Active', model: 'active', placeholder: 'Enter active status' },
];

const shippingFields = [
    { label: 'Delay Until', model: 'delay_until', placeholder: 'Enter delay date' },
    { label: 'Delay Until Reason', model: 'delay_until_reason', placeholder: 'Enter reason' },
    { label: 'Web Link', model: 'web_link', placeholder: 'Enter web link' },
    { label: 'Web SKU', model: 'web_sku', placeholder: 'Enter web SKU' },
    { label: 'Quote Image', model: 'quote_image', placeholder: 'Enter quote image URL' },
    { label: 'Class', model: 'class', placeholder: 'Enter class' },
    { label: 'User Note', model: 'user_note', placeholder: 'Enter notes' },
    { label: 'Board Usages 18mm', model: 'boardusages_eighteen', placeholder: 'Enter 18mm usage' },
    { label: 'Board Usages 25mm', model: 'boardusages_twentyfive', placeholder: 'Enter 25mm usage' },
    { label: 'Board Usages 33mm', model: 'boardusages_thirtythree', placeholder: 'Enter 33mm usage' },
    { label: 'Board Usages 16mm', model: 'boradusages_sixteen', placeholder: 'Enter 16mm usage' },
    { label: 'Krost Zoho ID', model: 'krost_zoho_id', placeholder: 'Enter Zoho ID' },
    { label: 'Krost QLD Zoho ID', model: 'krost_qld_zoho_id', placeholder: 'Enter QLD Zoho ID' },
    { label: 'Meloz Zoho ID', model: 'meloz_zoho_id', placeholder: 'Enter Meloz Zoho ID' },
    { label: 'Gregbar Zoho ID', model: 'gregbar_zoho_id', placeholder: 'Enter Gregbar Zoho ID' },
    { label: 'Klein Zoho ID', model: 'klein_zoho_id', placeholder: 'Enter Klein Zoho ID' }
   
    // { label: 'Sort Order', model: 'sort_order', placeholder: 'Enter sort order' },
    // { label: 'Active', model: 'active', placeholder: 'Enter active status' },
];

onMounted(async () => {
    console.log('item edit mounted', item.value);
    emit('editTabMounted');
    if (route.params.id) {
        await itemStore.fetchItemById(route.params.id as string);
    }
});

onUnmounted(() => {
    emit('editTabUnmunted');
});
</script>

<template>
    <div class="flex flex-col gap-8">
        <!-- CARD 1: PRODUCT INFORMATION -->
        <div class="bg-white rounded-2xl p-4">
            <h2 class="text-xl font-semibold text-gray-700 border-b pb-3 mb-6">Product Information</h2>
            <!-- Global Unique Key Error -->
            <Message v-if="fb.errors?.['item.update.' + item.item_id]?.item_id" severity="error" size="small">
                <div class="flex flex-col gap-2 w-full pb-3">
                    <span v-for="error in fb.errors?.['item.update.' + item.item_id]?.item_id" :key="error"
                        class="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded-md shadow-sm">
                        {{ error }}
                    </span>
                </div>
            </Message>

            <div class="grid grid-cols-12 gap-6">
                <div class="col-span-12 md:col-span-6">
                    <label class="block text-sm font-medium text-gray-600 mb-1">Product Code</label>
                    <Select v-model="item.product_id" :options="products" optionLabel="name" optionValue="id"
                        placeholder="Select product code" class="w-full border border-gray-200 rounded-md p-2"
                        :class="{ 'p-invalid': fb.errors?.['item.update.' + item.item_id]?.product_id }" />
                    <Message v-if="fb.errors?.['item.update.' + item.item_id]?.product_id" severity="error" size="small"
                        item="title">
                        <span v-for="error in fb.errors?.['item.update.' + item.item_id]?.product_id" :key="error"
                            class="flex flex-col">
                            {{ error }}
                        </span>
                    </Message>
                </div>
                <div class="col-span-12 md:col-span-6">
                    <label class="block text-sm font-medium text-gray-600 mb-1">Product Variant</label>
                    <Select v-model="item.product_variant_id" :options="productVariants" optionLabel="name"
                        optionValue="id" placeholder="Select product variant"
                        class="w-full border border-gray-200 rounded-md p-2"
                        :class="{ 'p-invalid': fb.errors?.['item.update.' + item.item_id]?.product_variant_id }" />
                    <Message v-if="fb.errors?.['item.update.' + item.item_id]?.product_variant_id" severity="error"
                        size="small" item="title">
                        <span v-for="error in fb.errors?.['item.update.' + item.item_id]?.product_variant_id"
                            :key="error" class="flex flex-col">
                            {{ error }}
                        </span>
                    </Message>
                </div>
                <div class="col-span-12 md:col-span-6">
                    <label class="block text-sm font-medium text-gray-600 mb-1">Item Code</label>
                    <InputText v-model="item.item_code" placeholder="Enter item code"
                        class="w-full border border-gray-200 rounded-md p-2"
                        :class="{ 'p-invalid': fb.errors?.['item.update.' + item.item_id]?.item_code }" />
                    <Message v-if="fb.errors?.['item.update.' + item.item_id]?.item_code" severity="error" size="small"
                        item="title">
                        <span v-for="error in fb.errors?.['item.update.' + item.item_id]?.item_code" :key="error"
                            class="flex flex-col">
                            {{ error }}
                        </span>
                    </Message>
                </div>
                <div class="col-span-12 md:col-span-6">
                    <label class="block text-sm font-medium text-gray-600 mb-1">KM Item ID</label>
                    <InputText v-model="item.km_item_id" placeholder="Enter KM item ID"
                        class="w-full border border-gray-200 rounded-md p-2"
                        :class="{ 'p-invalid': fb.errors?.['item.update.' + item.item_id]?.km_item_id }" />
                    <Message v-if="fb.errors?.['item.update.' + item.item_id]?.km_item_id" severity="error" size="small"
                        item="title">
                        <span v-for="error in fb.errors?.['item.update.' + item.item_id]?.km_item_id" :key="error"
                            class="flex flex-col">
                            {{ error }}
                        </span>
                    </Message>
                </div>
                <div class="col-span-12 md:col-span-6">
                    <label class="block text-sm font-medium text-gray-600 mb-1">Item Type ID</label>
                    <InputText v-model="item.item_type_id" placeholder="Enter item type ID"
                        class="w-full border border-gray-200 rounded-md p-2" />
                </div>
                <div class="col-span-12 md:col-span-6">
                    <label class="block text-sm font-medium text-gray-600 mb-1">Item Category ID</label>
                    <InputText v-model="item.item_category_id" placeholder="Enter item category ID"
                        class="w-full border border-gray-200 rounded-md p-2" />
                </div>
                <div class="col-span-12 md:col-span-6">
                    <label class="block text-sm font-medium text-gray-600 mb-1">Vendor ID</label>
                    <InputText v-model="item.vendor_id" placeholder="Enter vendor ID"
                        class="w-full border border-gray-200 rounded-md p-2" />
                </div>
                <div class="col-span-12 md:col-span-6">
                    <label class="block text-sm font-medium text-gray-600 mb-1">Import Vendor ID</label>
                    <InputText v-model="item.import_vendor_id" placeholder="Enter import vendor ID"
                        class="w-full border border-gray-200 rounded-md p-2" />
                </div>
                <div class="col-span-12 md:col-span-6">
                    <label class="block text-sm font-medium text-gray-600 mb-1">Factory Vendor ID</label>
                    <InputText v-model="item.factory_vendor_id" placeholder="Enter factory vendor ID"
                        class="w-full border border-gray-200 rounded-md p-2" />
                </div>
                <div class="col-span-12 md:col-span-6">
                    <label class="block text-sm font-medium text-gray-600 mb-1">Description</label>
                    <InputText v-model="item.description" placeholder="Enter description"
                        class="w-full border border-gray-200 rounded-md p-2" />
                </div>
                <div class="col-span-12 md:col-span-6">
                    <label class="block text-sm font-medium text-gray-600 mb-1">Specifications</label>
                    <InputText v-model="item.specifications" placeholder="Enter specifications"
                        class="w-full border border-gray-200 rounded-md p-2" />
                </div>
            </div>
        </div>
        <!-- CARD 2: INVENTORY & STOCK SETTINGS -->
        <div class="bg-white rounded-2xl p-4">
            <h2 class="text-xl font-semibold text-gray-700 border-b pb-3 mb-6">Inventory & Stock Settings</h2>

            <div class="grid grid-cols-12 gap-6">
                <div class="col-span-12 md:col-span-6" v-for="field in stockFields" :key="field.model">
                    <label class="block text-sm font-medium text-gray-600 mb-1">{{ field.label }}</label>
                    <InputText v-model="item[field.model]" :placeholder="field.placeholder"
                        class="w-full border border-gray-300 rounded-lg p-2" />
                </div>
            </div>
        </div>

        <!-- CARD 3: PRODUCT DIMENSIONS & PACKAGING -->
        <div class="bg-white rounded-2xl p-4">
            <h2 class="text-xl font-semibold text-gray-700 border-b pb-3 mb-6">Product Dimensions & Packaging</h2>

            <div class="grid grid-cols-12 gap-6">
                <div class="col-span-12 md:col-span-6" v-for="field in dimensionFields" :key="field.model">
                    <label class="block text-sm font-medium text-gray-600 mb-1">{{ field.label }}</label>
                    <InputText v-model="item[field.model]" :placeholder="field.placeholder"
                        class="w-full border border-gray-300 rounded-lg p-2" />
                </div>
            </div>
        </div>

        <!-- CARD 4: SHIPPING & ZOHO MAPPING -->
        <div class="bg-white rounded-2xl p-4">
            <h2 class="text-xl font-semibold text-gray-700 border-b pb-3 mb-6">Shipping & Zoho Mapping</h2>

            <div class="grid grid-cols-12 gap-6">
                <div class="col-span-12 md:col-span-6" v-for="field in shippingFields" :key="field.model">
                    <label class="block text-sm font-medium text-gray-600 mb-1">{{ field.label }}</label>
                    <InputText v-model="item[field.model]" :placeholder="field.placeholder"
                        class="w-full border border-gray-300 rounded-lg p-2" />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Optional custom styles */
</style>
