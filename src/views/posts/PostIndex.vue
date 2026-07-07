<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from 'vue-router';
import { usePostStore } from '@/stores/post';
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue/usetoast';

const router = useRouter();
const postStore = usePostStore();
const { fb, post } = storeToRefs(postStore);
const toast = useToast();
const items = ref([
    { route: '/posts/list', label: 'Posts List', icon: 'pi pi-home' },
    { route: '/posts/add/general', label: 'Add', icon: 'pi pi-plus' },
    { route: '/posts/import', label: 'Import', icon: 'pi pi-upload' },
]);

const currentRoute = computed(() => router.currentRoute.value.path);

const refreshTabs = () => {
    const routeId = router.currentRoute.value.params.id;
    if (routeId) {
        const editRoute = `/posts/edit/${routeId}/general` || `/posts/edit/${routeId}/seo` || `/posts/edit/${routeId}/images`;
        const existRoute = items.value.find(item => item.route === editRoute);
        if (!existRoute) {
            items.value.push({ route: editRoute, label: 'Edit', icon: 'pi pi-pencil' });
        }
    } else {
        items.value = items.value.filter(item => !item.route.includes('/edit'));
    }
}

const renderIcon = (icon: string, action: string) => {
    return fb.value.loading[`post.${action}`] ? 'pi pi-spinner pi-spin' : icon;
};

const onPostSaved = async () => {
    try {
        // product.value.sku = "New Product_" + new Date().getTime();
        const savedPost = await postStore.createPost(post.value);
        post.value = savedPost;
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Post created successfully',
            life: 3000
        });
        // Optionally, redirect to product detail page
        router.push(`/posts/${savedPost.post_id}`);
    } catch (error: any) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message || 'Failed to save post',
            life: 3000
        });
    }
}
refreshTabs();

onMounted(() => {
    refreshTabs();
});
</script>
<template>
    <div class="card relative">
        <Button 
            v-if="currentRoute === '/posts/general' || currentRoute === '/posts/seo'"
                :icon="renderIcon('pi pi-save', 'create')"
                :label="fb.loading['post.create'] ? 'Saving...' : 'Save'"
                severity="primary"
                :loading="fb.loading['post.create']"
                :disabled="fb.loading['post.create']"
                @click="onPostSaved"
                class="p-button-md"
            />
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
            <div class="">
                <router-view  @editTabUnmunted="refreshTabs" @editTabMounted="refreshTabs"/>
            </div>
        </Tabs>
    </div>
</template>

<style scoped>
</style>