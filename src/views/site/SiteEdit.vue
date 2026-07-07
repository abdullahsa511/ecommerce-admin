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
    
    const allowedDateFormats = [
        'YYYY/MM/DD',
        'MM/YYYY/DD',
        'DD MM',
        'YYYY',
        'YYYY-MM-DD',
        'HH:mm:ss',
        'YYYY-MM-DD HH:mm:ss'
       
    ];
    
    const allowedTimeFormats = [
        'HH:mm',
        'HH:mm:ss',
        'H:mm',
        'H:mm:ss',
        'hh:mm A',
        'hh:mm:ss A',
        'h:mm A',
        'h:mm:ss A',
        'H:i:s A',
        'h:i:s A',
        'H:i a',
        'h:i A',
        'H:i',
        'h:i',
        'H:i:s',
        'h:i:s',
        'G:i:s',
        'g:i:s',
        'G:i',
        'g:i',
        'G:i:s A',
        'g:i:s A',
        'G:i A',
        'g:i A'
    ];

    const focusLocalSettingsField = (field: 'custom_date_format' | 'custom_time_format') => {
        const targetPath = `/configuration/settings/sites/${props.id}/local-settings`;
        const currentRouteState = router.currentRoute.value;
        const currentQuery = currentRouteState.query as Record<string, any>;
        const { focusField: _focusField, focusStamp: _focusStamp, ...restQuery } = currentQuery;
        const newQuery = {
            ...restQuery,
            focusField: field,
            focusStamp: `${Date.now()}`
        };

        if (currentRouteState.path === targetPath) {
            router.replace({ path: targetPath, query: newQuery }).catch(() => {});
        } else {
            router.push({ path: targetPath, query: newQuery }).catch(() => {});
        }
    };

    const getFeedbackScope = () => {
        return site.value.site_id ? `site.update.${site.value.site_id}` : 'site.create';
    };
    
    const updateCustomDateFormatError = (message?: string) => {
        if (!fb.value) {
            return;
        }
    
        const scope = getFeedbackScope();
        const existingErrors = { ...(fb.value.errors?.[scope] ?? {}) };
    
        if (!message) {
            if ('custom_date_format' in existingErrors) {
                delete existingErrors.custom_date_format;
                if (Object.keys(existingErrors).length) {
                    fb.value.setError(existingErrors, scope);
                } else {
                    fb.value.clearError(scope);
                }
            }
            return;
        }
    
        existingErrors.custom_date_format = [message];
        fb.value.setError(existingErrors, scope);
    };
    
    const validateCustomDateFormat = (onInvalid?: () => void) => {
        const settings = site.value.localSettings;

        if (!settings || settings.date_format !== 'custom') {
            updateCustomDateFormatError();
            return true;
        }

        const customFormat = settings.custom_date_format?.trim();

        if (!customFormat) {
            updateCustomDateFormatError('Custom date format is required.');
            onInvalid?.();
            return false;
        }

        if (!allowedDateFormats.includes(customFormat)) {
            updateCustomDateFormatError(
                `Invalid date format. Allowed formats: ${allowedDateFormats.join(', ')}`
            );
            onInvalid?.();
            return false;
        }

        updateCustomDateFormatError();
        return true;
    };

    const updateCustomTimeFormatError = (message?: string) => {
        if (!fb.value) {
            return;
        }

        const scope = getFeedbackScope();
        const existingErrors = { ...(fb.value.errors?.[scope] ?? {}) };

        if (!message) {
            if ('custom_time_format' in existingErrors) {
                delete existingErrors.custom_time_format;
                if (Object.keys(existingErrors).length) {
                    fb.value.setError(existingErrors, scope);
                } else {
                    fb.value.clearError(scope);
                }
            }
            return;
        }

        existingErrors.custom_time_format = [message];
        fb.value.setError(existingErrors, scope);
    };

    const validateCustomTimeFormat = (onInvalid?: () => void) => {
        const settings = site.value.localSettings;

        if (!settings || settings.time_format !== 'custom') {
            updateCustomTimeFormatError();
            return true;
        }

        const customFormat = settings.custom_time_format?.trim();

        if (!customFormat) {
            updateCustomTimeFormatError('Custom time format is required.');
            onInvalid?.();
            return false;
        }

        if (!allowedTimeFormats.includes(customFormat)) {
            updateCustomTimeFormatError(
                `Invalid time format. Allowed formats: ${allowedTimeFormats.join(', ')}`
            );
            onInvalid?.();
            return false;
        }

        updateCustomTimeFormatError();
        return true;
    };

    const onSiteSaved = async () => {
        let focusHandled = false;
        const ensureFocus = (field: 'custom_date_format' | 'custom_time_format') => {
            if (!focusHandled) {
                focusLocalSettingsField(field);
                focusHandled = true;
            }
        };

        const dateValid = validateCustomDateFormat(() => ensureFocus('custom_date_format'));
        const timeValid = validateCustomTimeFormat(() => ensureFocus('custom_time_format'));

        if (!dateValid || !timeValid) {
            return;
        }

        isSaving.value = true;
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
    
    
    