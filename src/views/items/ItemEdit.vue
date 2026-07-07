<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue/usetoast';
import { FileModel } from "@/models/Media";
import { useItemStore } from "@/stores/item";
import Item from "@/models/Item";

const router = useRouter();
const itemStore = useItemStore();
const {fb, item} = storeToRefs(itemStore);
const toast = useToast();

const props = defineProps({
    id: {
        type: String,
        required: true
    }
});
const items = ref([
    { route: `/ecommerce/items/${props.id}/general`, label: 'General', icon: 'pi pi-home' },
]);

const currentRoute = computed(() => {
    return router.currentRoute.value.path;
});

const isSaving = ref(false);

const onItemSaved = async () => {
    try {
        if (item.value?.item_id) {
            await itemStore.updateItem(item.value);
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Item updated successfully',
                life: 3000
            });
        }
    } catch (error: any) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message || 'Failed to save Item',
            life: 3000
        });
    } finally {
        isSaving.value = false;
    }
}

const updateItem = (data: any) => {
    console.log(data);
    item.value = Object.assign(new Item(item.value), data);
}

const updateImages = (data: any) => {
    item.value.images = data;
}

const addImages = (files: any) => {
    item.value.images = item.value.images.map((file: any) => {
        let f = files.find((img: any) => img.file?.name === file.name);
        if(f) return new FileModel(f);
        return file;
    });
}
onMounted(async () => {
    // alert("onMounted edit");
})

</script>
<template>
    <div class="card relative">
        <Button 
                :icon="fb.loading['item.update'] ? 'pi pi-spin pi-spinner' : 'pi pi-save'"
                label="Save"
                severity="primary"
                :loading="fb.loading['item.update']"
                :disabled="fb.loading['item.update']"
                @click="onItemSaved"
                class="p-button-md"
            />
        <Tabs :value="currentRoute" scrollable>
            <TabList >
                <template v-for="tab in items" :key="tab.label">
                    <router-link v-if="tab.route" v-slot="{ href, navigate }" :to="tab.route" custom>
                        <Tab :active="currentRoute === tab.route" :key="tab.label" :value="tab.route" @click="navigate">
                            <a v-ripple :href="href" @click.prevent class="flex items-center gap-2 text-inherit" >
                                <i :class="tab.icon" />
                                <span>{{ tab.label }}</span>
                            </a>
                        </Tab>
                    </router-link>
                </template>
            </TabList>
            <div class="p-6">
                <router-view 
                @saved="onItemSaved" 
                @update:item="updateItem" 
                @update:images="updateImages" 
                @add:images="addImages"
                :item="item"
                />
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


