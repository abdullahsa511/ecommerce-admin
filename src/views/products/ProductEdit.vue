<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from 'vue-router';
import Product from '@/models/Product.ts';
import { useProductStore } from '@/stores/product';
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue/usetoast';
import { FileModel } from "@/models/Media";

const router = useRouter();
const productStore = useProductStore();
const {fb, product} = storeToRefs(productStore);
const toast = useToast();

const props = defineProps({
    id: {
        type: String,
        required: true
    }
});
const items = ref([
    { route: `/ecommerce/products/${props.id}/general`, label: 'General', icon: 'pi pi-home' },
    { route: `/ecommerce/products/${props.id}/relations`, label: 'Relations', icon: 'pi pi-link' },
    { route: `/ecommerce/products/${props.id}/varients-options`, label: 'Variants Options', icon: 'pi pi-check-square' },
    { route: `/ecommerce/products/${props.id}/image-gallery`, label: 'Image Gallery', icon: 'pi pi-images' },
    { route: `/ecommerce/products/${props.id}/download`, label: 'Download', icon: 'pi pi-images' },
    { route: `/ecommerce/products/${props.id}/certificate`, label: 'Certificate', icon: 'pi pi-images' },
    { route: `/ecommerce/products/${props.id}/inventory`, label: 'Inventory', icon: 'pi pi-box' },
    { route: `/ecommerce/products/${props.id}/shipping`, label: 'Shipping', icon: 'pi pi-truck' },
    { route: `/ecommerce/products/${props.id}/promotion`, label: 'Promotion', icon: 'pi pi-tag' },
    { route: `/ecommerce/products/${props.id}/seo`, label: 'Seo', icon: 'pi pi-globe' },
    { route: `/ecommerce/products/${props.id}/attribute`, label: 'Attributes', icon: 'pi pi-list' },
    { route: `/ecommerce/products/${props.id}/instagram`, label: 'Instagram', icon: 'pi pi-instagram' },
]);

const currentRoute = computed(() => {
    return router.currentRoute.value.path;
});

const isSaving = ref(false);

const onProductSaved = async () => {
    try {
        if (product.value?.product_id) {
            console.log('product.value', product.value);
            await productStore.updateProduct(product.value);
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Product updated successfully',
                life: 3000
            });
        }
    } catch (error: any) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message || 'Failed to save Product',
            life: 3000
        });
    } finally {
        isSaving.value = false;
    }
}

const updateProduct = (data: any) => {
    // product.value = Object.assign(new Product(product.value), data);
    if (!product.value) return;

    product.value = {
        ...product.value,
        ...data
    };
}

const updateImages = (data: any) => {
    // product.value.images = data;
    if (!product.value) return;
    product.value.images = data ?? [];
}

const addImages = (files: any) => {
    // product.value.images = product.value.images.map((file: any) => {
    //     let f = files.find((img: any) => img.file?.name === file.name);
    //     if(f) return new FileModel(f);
    //     return file;
    // });
    if (!product.value || !product.value.images) return;

    product.value.images = product.value.images.map((file: any) => {
        const f = files.find((img: any) => img.file?.name === file.name);
        return f ? new FileModel(f) : file;
    });
}
onMounted(async () => {
    // product.value = await productStore.fetchProductById(props.id);
    // console.log('ProductEdit component mounted', product.value);

    try {
        product.value = await productStore.fetchProductById(props.id);
    } catch (e) {
        console.error(e);
    }
})

</script>
<template>
    <div class="card relative">
        <Button 
                :icon="fb.loading['product.update'] ? 'pi pi-spin pi-spinner' : 'pi pi-save'"
                label="Save"
                severity="primary"
                :loading="fb.loading['product.update']"
                :disabled="fb.loading['product.update']"
                @click="onProductSaved"
                class="p-button-md"
            />
        <Tabs :value="currentRoute" scrollable>
            <TabList >
                <template v-for="tab in items" :key="tab.label">
                    <router-link v-if="tab.route" v-slot="{ href, navigate }" :to="tab.route" custom>
                        <Tab :active="currentRoute === tab.route" :key="tab.label" :value="tab.route" @click="navigate">
                            <a v-ripple :href="href" @click.prevent class="flex items-center gap-2 text-inherit">
                                <i :class="tab.icon" @click="navigate"/>
                                <span @click="navigate">{{ tab.label }}</span>
                            </a>
                        </Tab>
                    </router-link>
                </template>
            </TabList>
            <div class="py-6">
                <router-view 
                @saved="onProductSaved" 
                @update:product="updateProduct" 
                @update:images="updateImages" 
                @add:images="addImages"
                :product="product"
                />
            </div>
        </Tabs>
    </div>
</template>

<style scoped>
/* .p-button-md {
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 1000;
}
.p-button-md-bottom {
    position: absolute;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
} */
</style>


