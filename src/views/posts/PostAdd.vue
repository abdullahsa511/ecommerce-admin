<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from 'vue-router';
import { Post } from '@/models/Post.ts';
import { useToast } from 'primevue/usetoast';
import { usePostStore } from '@/stores/post';
import { storeToRefs } from 'pinia';

const router = useRouter();
const toast = useToast();
const postStore = usePostStore();
const {fb, post} = storeToRefs(postStore);

const emit = defineEmits(['saved', 'editTabUnmunted', 'editTabMounted']);

const items = ref([
    { route: '/posts/add/general', label: 'General', icon: 'pi pi-home' },
    { route: '/posts/add/seo', label: 'SEO', icon: 'pi pi-link' },
]);

const currentRoute = computed(() => router.currentRoute.value.path);

// const post = ref(new Post({
//     "post_id": 0,
//     "site_id": 6,
//     "description": "",
//     "status": 1,
//     "image": [
//         {
//             "image": "/media/uploads2025/06/492903574_1129600339207123_718056120408465445_n.jpg",
//             "name": "492903574_1129600339207123_718056120408465445_n.jpg",
//             "size": 378525,
//             "type": "image/jpeg",
//             "objectURL": "http://localhost:8089/media/uploads2025/06/492903574_1129600339207123_718056120408465445_n.jpg",
//             "status": {
//                 "name": "Uploaded",
//                 "severity": "success"
//             }
//         }
//     ],
//     "created_at": "",
//     "updated_at": "",
//     "content": {
//         "post_id": 0,
//         "language_id": 1,
//         "name": "Alex Chair",
//         "slug": "alex-chair",
//         "meta_title": null,
//         "excerpt": null,
//         "meta_description": null,
//         "meta_keywords": null
//     },
//     "metadata": {
//         "openGraph": {
//             "openGraphTitle": "Open Graph title",
//             "openGraphDescription": "Open Graph description"
//         },
//         "twitter": {
//             "twitterTitle": "Twitter title",
//             "twitterDescription": "Twitter description",
//             "twitterLabel1": "Twitter label 1",
//             "twitterLabel2": "Twitter label 2",
//             "twitterData1": "Twitter data 1",
//             "twitterData2": "Twitter data 2"
//         }
//     }
// }));

const onPostSaved = async () => {
    console.log("you hit with post", post.value);
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
        router.push(`/posts/edit/${savedPost.post_id}/general`);
    } catch (error: any) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message || 'Failed to save post',
            life: 3000
        });
    }
};

const renderIcon = (icon: string, action: string) => {
    return fb.value.loading[`post.${action}`] ? 'pi pi-spinner pi-spin' : icon;
};

onMounted(() => {
    postStore.resetPostType()
    emit('editTabMounted');
});

onUnmounted(() => {
    emit('editTabUnmunted');
});
</script>
<template>
    <div class="">
        <Button 
                :icon="renderIcon('pi pi-save', 'create')"
                :label="fb.loading['post.create'] ? 'Saving...' : 'Save'"
                severity="primary"
                :loading="fb.loading['post.create']"
                :disabled="fb.loading['post.create']"
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
                <router-view :post="post" v-model.post="post" @saved="onPostSaved"/>
            </div>
        </Tabs>
    </div>
</template>

<style scoped>
</style>