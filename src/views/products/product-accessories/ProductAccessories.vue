<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router';

import { storeToRefs } from 'pinia';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';
import { useProductAccessoriesStore } from '@/stores/productAccessories';

const props = defineProps({ id: { type: String, required: false, default: null } })
const router = useRouter();
const ProductAccessoriesStore = useProductAccessoriesStore();
const { productAccessories, fb } = storeToRefs(ProductAccessoriesStore);
const toast = useToast();

//Declear emits
const emit = defineEmits({})

//Define local variables here
const items = ref([
    { route: `/product-accessories/list`, label: 'Product Accessories', icon: 'pi pi-home' },
    { route: `/product-accessories/add`, label: 'Add', icon: 'pi pi-link' },
    { route: `/product-accessories/import`, label: 'Import', icon: 'pi pi-link' },
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
        if (productAccessories.value.product_accessories_id) {
            console.log("this is option edit page before update", productAccessories.value);
            // Update existing option
            response = await ProductAccessoriesStore.updateProductAccessories(productAccessories.value);
        } else {
            console.log("this is option add page before create", productAccessories.value);
            // Create new option
            response = await ProductAccessoriesStore.createProductAccessories(productAccessories.value);
        }

        if (response?.product_accessories_id) {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Product option saved successfully',
                life: 3000
            });
            router.push('/ecommerce/product-accessories/edit/' + response.product_accessories_id);
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
        const existRoute = items.value.find(item => item.route === `/ecommerce/product-accessories/edit/${props.id}`);
        if (!existRoute) {
            items.value.push({ route: `/ecommerce/product-accessories/edit/${props.id}`, label: 'Edit', icon: 'pi pi-list' });
        }
    } else {
        items.value = items.value.filter(item => !item.route.includes('/edit'));
        ProductAccessoriesStore.resetProductAccessories(); //reset form for add.
    }
}
refreshTabs();

const renderIcon = (icon: string) => {
    if (props.id) {
        return fb.value.loading[`productAccessories.update.${productAccessories.value.product_accessories_id}`] ? 'pi pi-spinner pi-spin' : icon;
    } else {
        return fb.value.loading['productAccessories.create'] ? 'pi pi-spinner pi-spin' : icon;
    }
}

//Lifecycle hook started from here
onMounted(() => {
    ProductAccessoriesStore.fetchProducts();
    ProductAccessoriesStore.fetchProductVariants();
    refreshTabs();
})
</script>

<template>
    <div class="accessories card relative">
        <div class="sticky top-0 z-50 bg-white p-2">
            <Button v-if="showSaveButton" 
            :label="fb.loading['productAccessories.update.' + productAccessories.product_accessories_id] ? 'Updating...' : (fb.loading['productAccessories.create'] ? 'Adding...' : saveLabel)"
            :icon="renderIcon('pi pi-save')" class="p-button-md"
                @click="handleSave" :disabled="fb.loading['productAccessories.update.' + productAccessories.product_accessories_id]" />
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