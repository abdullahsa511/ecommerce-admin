<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from 'vue-router';
import { Page } from '@/models/Page.ts';
import { usePageStore } from '@/stores/page';
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue/usetoast';

const router = useRouter();
const pageStore = usePageStore();
const { fb } = storeToRefs(pageStore);
const toast = useToast();
const emit = defineEmits(['saved', 'editTabUnmunted', 'editTabMounted']);
const props = defineProps({
    id: {
        type: String,
        required: true
    },
    page: {
        type: Page,
        required: false,
        default: () => new Page({})
    }
});

const items = ref([
    { route: `/pages/edit/${props.id}/general`, label: 'General', icon: 'pi pi-home' },
    { route: `/pages/edit/${props.id}/seo`, label: 'SEO', icon: 'pi pi-link' },
]);

const currentRoute = computed(() => router.currentRoute.value.path);

const page = ref<Page | null>(null); // store page data

const isSaving = ref(false);

const onPageSaved = async () => {
    if (!page.value) return;

    isSaving.value = true;
    try {
        if (page.value.post_id) {
            await pageStore.updatePage(page.value);
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

onMounted(async () => {
    page.value = await pageStore.fetchPageById(props.id);
    console.log('page data: ', page.value);
    emit('editTabMounted');
});

onUnmounted(() => {
    emit('editTabUnmunted');
});
</script>

<template>
    <div class="card relative">
        <!-- Save Button -->
        <Button 
            :icon="fb.loading['page.update'] ? 'pi pi-spin pi-spinner' : 'pi pi-save'" 
            :label="fb.loading['page.update'] ? 'Updating...' : 'Update'"
            severity="primary" 
            :loading="fb.loading['page.update']"
            :disabled="fb.loading['page.update']"
            @click="onPageSaved" class="p-button-md" />

        <!-- Tabs -->
        <Tabs :value="currentRoute" scrollable>
            <TabList>
                <template v-for="tab in items" :key="tab.label">
                    <router-link v-if="tab.route" v-slot="{ href, navigate }" :to="tab.route" custom>
                        <Tab :active="currentRoute === tab.route" :value="tab.route" @click="navigate">
                            <a v-ripple :href="href" class="flex items-center gap-2 text-inherit">
                                <i :class="tab.icon" />
                                <span>{{ tab.label }}</span>
                            </a>
                        </Tab>
                    </router-link>
                </template>
            </TabList>

            <!-- Router View (only render when page is loaded) -->
            <div class="p-6" v-if="page">
                <router-view :page="page" :id="page.post_id" @saved="onPageSaved" />
            </div>
            <div v-else class="p-6 text-gray-500">Loading page data...</div>
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
