<script setup lang="ts">
import { ref, computed, watch,onMounted } from "vue";
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { storeToRefs } from 'pinia';
import Item from '@/models/Item.ts';
import { useItemStore } from '@/stores/item';
const router = useRouter();
const toast = useToast();
const itemStore = useItemStore();
const {fb} = storeToRefs(itemStore);

const items = ref([
    { route: '/ecommerce/items/add/general', label: 'General', icon: 'pi pi-home' },
]);

const currentRoute = computed(() => router.currentRoute.value.path);

const item = ref(new Item({sku: "New Item_" + new Date().getTime()}));

const onItemSaved = async () => {
    console.log("onItemSaved add", item.value);
    try {
        // item.value.sku = "New Product_" + new Date().getTime();
        console.log("you hit with item", item.value);
        // TODO: Save item to backend (implement your save logic here)
        const savedItem = await itemStore.createItem(item.value);
        item.value = savedItem;
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Product created successfully',
            life: 3000
        });
        // Optionally, redirect to item detail page
        router.push(`/ecommerce/items/${savedItem.item_id}`);
    } catch (error: any) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message || 'Failed to save item',
            life: 3000
        });
    }
};
watch(item.value.images, (newVal) => {
    console.log('item.value.images', newVal);
}, {deep: true});

onMounted(async () => {
    console.log("onMounted");
});

</script>
<template>
    <div class="card relative">
        <Button 
                icon="pi pi-save"
                label="Save"
                severity="primary"
                :loading="fb.loading['item.create']"
                @click="onItemSaved"
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
            <div class="p-6">
                <router-view :item="item" v-model.item="item" @saved="onItemSaved"/>
            </div>
        </Tabs>
    </div>
</template>

<style scoped>
.p-button-md {
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
}
</style>


