<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router';

import { storeToRefs } from 'pinia';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';
import { useProductOptionStore } from '@/stores/productOption'; // usOptionStore

const props = defineProps({ id: { type: String, required: false, default: null } })
const router = useRouter();
const ProductOptionStore = useProductOptionStore();
const { productOption, fb } = storeToRefs(ProductOptionStore);
const toast = useToast();

//Declear emits
const emit = defineEmits({})

//Define local variables here
const items = ref([
    { route: `/ecommerce/product-options/list`, label: 'Product Options', icon: 'pi pi-home' },
    { route: `/ecommerce/product-options/add`, label: 'Add', icon: 'pi pi-link' },
    { route: `/ecommerce/product-options/import`, label: 'Import', icon: 'pi pi-link' },
]);

const currentRoute = computed(() => {
    return router.currentRoute.value.path;
});

// Show Save button only on add or edit routes. Change label when editing.
const showSaveButton = computed(() => {
    const path = currentRoute.value || '';
    return path.includes('/add') || path.includes('/edit');
});
// Change Save button label based on route
const saveLabel = computed(() => {
    return currentRoute.value && currentRoute.value.includes('/edit') ? 'Save and Update' : 'Save';
})

// Fetch option if route is edit
const handleSave = async () => {
    try {
        let response: any;
        if (productOption.value.product_option_id) {
            console.log("this is option edit page before update", productOption.value);
            // Update existing option
            response = await ProductOptionStore.updateProductOption(productOption.value);
        } else {
            console.log("this is option add page before create", productOption.value);
            // Create new option
            response = await ProductOptionStore.createProductOption(productOption.value);
        }

        if (response?.product_option_id) {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Product option saved successfully',
                life: 3000
            });
            router.push('/ecommerce/product-options/edit/' + response.product_option_id);
            // Reset the form a new option
        } else {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save option: ' + (response?.message || ''), life: 5000 });
        }
    } catch (error) {
        console.error('Error saving option:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'An error occurred while saving the option.',
            life: 5000
        });
    }
};

//Define local methods her
const refreshTabs = () => {
    if (props.id) {
        const existRoute = items.value.find(item => item.route === `/ecommerce/product-options/edit/${props.id}`);
        if (!existRoute) {
            items.value.push({ route: `/ecommerce/product-options/edit/${props.id}`, label: 'Edit', icon: 'pi pi-list' });
        }
    } else {
        items.value = items.value.filter(item => !item.route.includes('/edit'));
        ProductOptionStore.resetProductOption(); //reset form for add.
    }
}
refreshTabs();

const renderIcon = (icon: string) => {
    if (props.id) {
        return fb.value.loading[`productOption.update.${productOption.value.product_option_id}`] ? 'pi pi-spinner pi-spin' : icon;
    } else {
        return fb.value.loading['productOption.create'] ? 'pi pi-spinner pi-spin' : icon;
    }
}

//Lifecycle hook started from here
onMounted(() => {
    ProductOptionStore.fetchProductOptionGroups();
    ProductOptionStore.fetchProducts();
    ProductOptionStore.fetchProductVariants();
    refreshTabs();
})
</script>

<template>
    <div class="options card relative">
        <div class="sticky top-0 z-50 bg-white p-2">
            <Button v-if="showSaveButton" 
            :label="fb.loading['productOption.update.' + productOption.product_option_id] ? 'Updating...' : (fb.loading['productOption.create'] ? 'Adding...' : saveLabel)"
            :icon="renderIcon('pi pi-save')" class="p-button-md"
                @click="handleSave" :disabled="fb.loading['productOption.update.' + productOption.product_option_id]" />
        </div>
        <Tabs :value="currentRoute" scrollable>
            <TabList>
                <template v-for="tab in items" :key="tab.label">
                    <router-link v-if="tab.route" v-slot="{ href, navigate }" :to="tab.route" custom>
                        <Tab :active="currentRoute === tab.route" :key="tab.label" :value="tab.route" @click="navigate">
                            <a v-ripple :href="href" @click="navigate" class="flex items-center gap-2 text-inherit">
                                <i :class="tab.icon" />
                                <span>{{ tab.label }}</span>
                            </a>
                        </Tab>
                    </router-link>
                </template>
            </TabList>
            <div class="py-6">
                <router-view @editTabUnmunted="refreshTabs" @saved="handleSave" @editTabMounted="refreshTabs" />
            </div>
        </Tabs>
    </div>
</template>


<style scoped></style>