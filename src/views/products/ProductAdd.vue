<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRouter } from 'vue-router';
import Product from '@/models/Product.ts';
import { useToast } from 'primevue/usetoast';
import { useProductStore } from '@/stores/product';
import { storeToRefs } from 'pinia';

const router = useRouter();
const toast = useToast();
const productStore = useProductStore();
const {fb} = storeToRefs(productStore);

const items = ref([
    { route: '/ecommerce/products/add/general', label: 'General', icon: 'pi pi-home' },
    // { route: '/ecommerce/products/add/relations', label: 'Relations', icon: 'pi pi-link' },
    // { route: '/ecommerce/products/add/attribute', label: 'Attribute', icon: 'pi pi-list' },
    // { route: '/ecommerce/products/add/option', label: 'Option', icon: 'pi pi-check-square' },
    // { route: '/ecommerce/products/add/variant', label: 'Variant', icon: 'pi pi-box' },
    // { route: '/ecommerce/products/add/inventory', label: 'Inventory', icon: 'pi pi-box' },
    // { route: '/ecommerce/products/add/shipping', label: 'Shipping', icon: 'pi pi-truck' },
    // { route: '/ecommerce/products/add/image-gallery', label: 'Image Gallery', icon: 'pi pi-images' },
    // { route: '/ecommerce/products/add/promotion', label: 'Promotion', icon: 'pi pi-tag' },
    // { route: '/ecommerce/products/add/seo', label: 'Seo', icon: 'pi pi-globe' }
]);

const currentRoute = computed(() => router.currentRoute.value.path);

const product = ref(new Product({sku: "New Product_" + new Date().getTime()}));

const onProductSaved = async () => {
    // console.log(product.value);
    try {
        // product.value.sku = "New Product_" + new Date().getTime();
        console.log("you hit with product", product.value);
        // TODO: Save product to backend (implement your save logic here)
        const savedProduct = await productStore.createProduct(product.value);
        product.value = savedProduct;
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Product created successfully',
            life: 3000
        });
        // Optionally, redirect to product detail page
        router.push(`/ecommerce/products/${savedProduct.product_id}`);
    } catch (error: any) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message || 'Failed to save product',
            life: 3000
        });
    }
};
watch(product.value.images, (newVal) => {
    console.log('product.value.images', newVal);
}, {deep: true});

</script>
<template>
    <div class="card relative">
        <Button 
                icon="pi pi-save"
                label="Save"
                severity="primary"
                :loading="fb.loading['product.create']"
                @click="onProductSaved"
                class="p-button-md"
            />
        <Tabs :value="currentRoute" scrollable>
            <TabList >
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
                <router-view :product="product" v-model.product="product" @saved="onProductSaved"/>
            </div>
        </Tabs>
    </div>
</template>

<style scoped>

</style>


