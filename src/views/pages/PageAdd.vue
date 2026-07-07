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
const { fb } = storeToRefs(pageStore);

const items = ref([
    { route: '/pages/add/general', label: 'General', icon: 'pi pi-plus' },
    // { route: '/pages/add/seo', label: 'SEO', icon: 'pi pi-link' },
]);

const currentRoute = computed(() => router.currentRoute.value.path);

const page = ref(new Page({}));

const onPageSaved = async () => {
    console.log("you hit with page", page.value);
    // return false;
    // product.value.sku = "New Product_" + new Date().getTime();
    pageStore.createPage(page.value).then((savedPage: Page) => {
        page.value = savedPage;
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Post created successfully',
            life: 3000
        });
        // Optionally, redirect to product detail page
        // router.push('/pages/' + page.value.post_id);
        const editRoute = `/pages/edit/${page.value.post_id}/general`;
        router.push(editRoute);
        // console.log("savedPage", page.value);

    }).catch((error: any) => {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message || 'Failed to save page',
            life: 3000
        });
    }).finally(() => {
        console.log("finally");
    });
};

const renderIcon = (icon: string, action: string) => {
    return fb.value.loading[`page.${action}`] ? 'pi pi-spinner pi-spin' : icon;
};
</script>
<template>
    <div class="">
        <Button 
            :icon="renderIcon('pi pi-save', 'create')" 
            :label="fb.loading['page.create'] ? 'Saving...' : 'Save'"
            severity="primary"
            :loading="fb.loading['page.create']" 
            :disabled="fb.loading['page.create']"
            @click="onPageSaved"
            class="p-button-md" />
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
            <div class="p-6">
                <router-view :page="page" v-model.page="page" @saved="onPageSaved" />
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