<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useItemStore } from '@/stores/item';
import { storeToRefs } from 'pinia';

const router = useRouter();
const toast = useToast();
const itemStore = useItemStore();
const { fb, item } = storeToRefs(itemStore);

const emit = defineEmits(['saved', 'editTabUnmunted', 'editTabMounted']);
const props = defineProps({
    id: {
        type: String,
        required: true
    }
});

const items = ref([
    { route: `/ecommerce/items/edit/${props.id}/general`, label: 'General', icon: 'pi pi-home' },
    { route: `/ecommerce/items/edit/${props.id}/variant-option`, label: 'Variant Option', icon: 'pi pi-check-square' },
    { route: `/ecommerce/items/edit/${props.id}/inventory`, label: 'Inventory', icon: 'pi pi-home' },
    { route: `/ecommerce/items/edit/${props.id}/weight-dimension`, label: 'Shipping & Dimension', icon: 'pi pi-home' },
    { route: `/ecommerce/items/edit/${props.id}/invoice-billing`, label: 'Accounting & Discount', icon: 'pi pi-home' }
]);
const currentRoute = computed(() => router.currentRoute.value.path);

const onItemSaved = async () => {
    console.log("you hit with item", item);
    try {
        // product.value.sku = "New Product_" + new Date().getTime();
        const updatedItem: any = await itemStore.updateItem(item.value);
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Item updated successfully',
            life: 3000
        });
        // Redirect to updated item page
        // router.push(`/ecommerce/items/edit/${updatedItem.item_id}`);
        router.push(currentRoute.value);
    } catch (error: any) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message || 'Failed to update item',
            life: 3000
        });
    }
};

const renderIcon = (icon: string, action: string) => {
    return fb.value.loading[`item.${action}`] ? 'pi pi-spinner pi-spin' : icon;
};

onMounted(async () => {
    await itemStore.fetchItemById(props.id);
    emit('editTabMounted');
});

onUnmounted(() => {
    emit('editTabUnmunted');
});
</script>
<template>
    <div class="">
        <Button :icon="renderIcon('pi pi-save', 'update '+item.item_id)" :label="fb.loading['item.update '+item.item_id] ? 'Updating...' : 'Update'"
            severity="primary" :loading="fb.loading['item.update '+item.item_id]" :disabled="fb.loading['item.update '+item.item_id]"
            @click="onItemSaved" class="p-button-md" />
        <div class="col-span-1 md:col-start-2 row-start-2 md:row-start-1 flex items-center gap-4 md:gap-6" 
            style="position: absolute; top: 95px; right: 35px; z-index: 10;">
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
        <Tabs :value="currentRoute" scrollable>
            <TabList>
                <template v-for="tab in items" :key="tab.label">
                    <router-link v-if="tab.route" v-slot="{ href, navigate }" :to="tab.route" custom>
                        <Tab :active="currentRoute === tab.route" :key="tab.label" :value="tab.route" @click="navigate">
                            <a v-ripple :href="href" class="flex items-center gap-2 text-inherit">
                                <i :class="tab.icon" />
                                <span>{{ tab.label }}</span>
                            </a>
                        </Tab>
                    </router-link>
                </template>
            </TabList>
            <div class="py-6">
                <router-view :item="item" @saved="onItemSaved" />
                <!-- <router-view @saved="onItemSaved" /> -->
            </div>
        </Tabs>
    </div>
</template>

<style scoped></style>