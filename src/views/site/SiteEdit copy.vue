<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from 'vue-router';
import Site from '@/models/Site.ts';
import { useSiteStore } from '@/stores/site';
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue/usetoast';

const router = useRouter();
const siteStore = useSiteStore();
const {fb} = storeToRefs(siteStore);
const toast = useToast();

const props = defineProps({
    id: {
        type: String,
        required: true
    }
});

const items = ref([
    { route: `/configuration/settings/sites/${props.id}/general-settings`, label: 'General', icon: 'pi pi-home' },
    { route: `/configuration/settings/sites/${props.id}/local-settings`, label: 'Local', icon: 'pi pi-chart-line' },
    { route: `/configuration/settings/sites/${props.id}/media-settings`, label: 'Media Settings', icon: 'pi pi-list' },
    { route: `/configuration/settings/sites/${props.id}/comment-settings`, label: 'Comment Settings', icon: 'pi pi-inbox' },
    { route: `/configuration/settings/sites/${props.id}/order-settings`, label: 'Order Settings', icon: 'pi pi-inbox' },
    { route: `/configuration/settings/sites/${props.id}/seo-settings`, label: 'SEO Settings', icon: 'pi pi-inbox' },
    { route: `/configuration/settings/sites/${props.id}/other-settings`, label: 'Other Settings', icon: 'pi pi-inbox' }
]);

const currentRoute = computed(() => {
    return router.currentRoute.value.path;
});

const site = ref(new Site({name: "New Site"})); //Good Job

const isSaving = ref(false);

const onSiteSaved = async () => {
    try {
        let response: any;
        if (site.value.site_id) {
           response = await siteStore.updateSite(site.value);
           if(response?.site_id) {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Site updated successfully',
                life: 3000
            });
           }
           else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: response?.message || 'Failed to save site',
                life: 3000
            });
           }
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

onMounted(async () => {
    const fetchedSite = await siteStore.fetchSiteById(props.id);
    if (fetchedSite) {
        site.value = fetchedSite;
    }
});

</script>
<template>
    <div class="card relative">
        <Button 
                :icon="fb.loading['site.update.' + site.site_id] ? 'pi pi-spin pi-spinner' : 'pi pi-save'"
                label="Update"
                severity="primary"
                :loading="fb.loading['site.update.' + site.site_id]"
                :disabled="fb.loading['site.update.' + site.site_id]"
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


