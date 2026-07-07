<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useRouter } from 'vue-router';
import { usePostStore } from '@/stores/post';
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue/usetoast';

const router = useRouter();
const postStore = usePostStore();
const {fb, post} = storeToRefs(postStore);
const toast = useToast();
const emit = defineEmits(['saved', 'editTabUnmunted', 'editTabMounted']);

const props = defineProps({
    id: {
        type: String,
        required: true
    }
});
const items = ref([
    { route: `/posts/edit/${props.id}/general`, label: 'General', icon: 'pi pi-home' },
    { route: `/posts/edit/${props.id}/seo`, label: 'SEO', icon: 'pi pi-link' },
    { route: `/posts/edit/${props.id}/images`, label: 'Image Gallery', icon: 'pi pi-images' },
]);

const currentRoute = computed(() => {
    return router.currentRoute.value.path;
});

const isSaving = ref(false);

const onPostSaved = async (images: any) => {
    try {
        if (post.value?.post_id) {
            await postStore.updatePost(post.value);
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
    await postStore.fetchPostById(props.id);
    emit('editTabMounted');
})

onUnmounted(() => {
    emit('editTabUnmunted');
})

</script>
<template>
    <div class="card mt-6">
        <Button 
                :icon="fb.loading['post.update'] ? 'pi pi-spin pi-spinner' : 'pi pi-save'"
                :label="fb.loading['post.update'] ? 'Updating...' : 'Update'"
                severity="primary"
                :loading="fb.loading['post.update']"
                :disabled="fb.loading['post.update']"
                @click="onPostSaved"
                class="p-button-md"
            />
        <Tabs :value="currentRoute" scrollable>
            <TabList >
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
                <router-view  @saved="onPostSaved"/>
            </div>
        </Tabs>
    </div>
</template>

<style scoped>
</style>


