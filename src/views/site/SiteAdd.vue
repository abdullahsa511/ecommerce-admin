<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from 'vue-router';
import Site from '@/models/Site.ts';
import { useSiteStore } from '@/stores/site';
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue/usetoast';

const router = useRouter();
const siteStore = useSiteStore();
const {fb} = storeToRefs(siteStore);
const toast = useToast();

const items = ref([
    { route: '/configuration/settings/add-site/general-settings', label: 'General', icon: 'pi pi-home' },
    { route: '/configuration/settings/add-site/local-settings', label: 'Local', icon: 'pi pi-chart-line' },
    { route: '/configuration/settings/add-site/media-settings', label: 'Media Settings', icon: 'pi pi-list' },
    { route: '/configuration/settings/add-site/comment-settings', label: 'Comment Settings', icon: 'pi pi-inbox' },
    { route: '/configuration/settings/add-site/order-settings', label: 'Order Settings', icon: 'pi pi-inbox' },
    { route: '/configuration/settings/add-site/seo-settings', label: 'SEO Settings', icon: 'pi pi-inbox' },
    { route: '/configuration/settings/add-site/other-settings', label: 'Other Settings', icon: 'pi pi-inbox' }
]);

const currentRoute = computed(() => {
    return router.currentRoute.value.path;
});

const site = ref(new Site({name: "New Site"})); //Good Job

const isSaving = ref(false);

const onSiteSaved = async () => {
    try {
        // const savedSite = await siteStore.createSite(site.value);
        // site.value = savedSite;
        // router.push(`/configuration/settings/sites/${savedSite.site_id}`);
        // toast.add({
        //     severity: 'success',
        //     summary: 'Success',
        //     detail: 'Site created successfully',
        //     life: 3000
        // });

        let response: any;
        response = await siteStore.createSite(site.value);
        if(response?.site_id) {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Site created successfully',
                life: 3000
            });
            router.push(`/configuration/settings/sites/${response.site_id}`);
        }
        else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: response?.message || 'Failed to save site',
                life: 3000
            });
        }


    } catch (error: any) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message || 'Failed to save site',
            life: 3000
        });
    } finally {
        isSaving.value = false;
    }
}

// watch(site, (newVal) => {
//     console.log(newVal);
// }, { deep: true });

</script>
<template>
    <div class="card relative">
        <Button 
           :icon="fb.loading['site.create'] ? 'pi pi-spin pi-spinner' : 'pi pi-save'"
            label="Save"
            severity="primary"
            :loading="fb.loading['site.create']"
            :disabled="fb.loading['site.create']"
            @click="onSiteSaved"
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
                <router-view :site="site" :fb="fb" v-model.site="site"  @saved="onSiteSaved"/>
            </div>
        </Tabs>
    </div>
</template>

<style scoped>
</style>


