<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from 'vue-router';
import { Page } from '@/models/Page.ts';
import { useToast } from 'primevue/usetoast';
import { usePageStore } from '@/stores/page';
import { storeToRefs } from 'pinia';

const router = useRouter();
const toast = useToast();
const pageStore = usePageStore();
const {fb} = storeToRefs(pageStore);

const items = ref([
    { route: '/pages/add/general', label: 'General', icon: 'pi pi-home' },
    { route: '/pages/add/seo', label: 'SEO', icon: 'pi pi-link' },
]);

const currentRoute = computed(() => router.currentRoute.value.path);

const page = ref(new Page({
    "post_id": 0,
    "site_id": 6,
    "description": "",
    "status": '',
    "password": "",
    "type": "page",
    "image": [
        {
            "image": "/media/uploads2025/06/492903574_1129600339207123_718056120408465445_n.jpg",
            "name": "492903574_1129600339207123_718056120408465445_n.jpg",
            "size": 378525,
            "type": "image/jpeg",
            "objectURL": "http://localhost:8089/media/uploads2025/06/492903574_1129600339207123_718056120408465445_n.jpg",
            "status": {
                "name": "Uploaded",
                "severity": "success"
            }
        }
    ],
    "created_at": "",
    "updated_at": "",
    "content": {
        "post_id": 0,
        "language_id": 1,
        "name": "",
        "slug": "",
        "meta_title": null,
        "excerpt": null,
        "meta_description": null,
        "meta_keywords": null
    },
    "metadata": {
        "openGraph": {
            "openGraphTitle": "",
            "openGraphDescription": ""
        },
        "twitter": {
            "twitterTitle": "Twitter title",
            "twitterDescription": "Twitter description",
            "twitterLabel1": "Twitter label 1",
            "twitterLabel2": "Twitter label 2",
            "twitterData1": "Twitter data 1",
            "twitterData2": "Twitter data 2"
        }
    }
}));

const onPageSaved = async () => {
    console.log("you hit with page", page.value);
    // return false;
    try {
        // product.value.sku = "New Product_" + new Date().getTime();
        const savedPage = await pageStore.createPage(page.value);
        page.value = savedPage;
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Post created successfully',
            life: 3000
        });
        // Optionally, redirect to product detail page
        router.push(`/pages/${savedPage.post_id}`);
    } catch (error: any) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message || 'Failed to save post',
            life: 3000
        });
    }
};

</script>
<template>
    <div class="card relative">
        <Button 
                icon="pi pi-save"
                label="Save"
                severity="primary"
                :loading="false"
                @click="onPageSaved"
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
            <div class="p-6">
                <router-view :page="page" v-model.page="page" @saved="onPageSaved"/>
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