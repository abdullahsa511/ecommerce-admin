<script setup lang="ts">
import { PropType, computed, watchEffect } from 'vue';
import Site from '@/models/Site';
import { useRoute } from 'vue-router';

const route = useRoute();
const props = defineProps({
  site: {
    type: Site,
    required: true,
    default: () => new Site()
  },
  fb: {
    type: Object as PropType<any>,
    required: false,
    default: () => ({})
  }
});

interface SocialApiField {
  field: string;
  label: string;
  placeholder: string;
  helper?: string;
  isSecret?: boolean;
}

const socialApiFields: SocialApiField[] = [
  { field: 'facebook_api', label: 'Facebook API Key', placeholder: 'Paste the Facebook Graph API key', helper: 'Used to fetch analytics, manage campaigns and enable login.' },
  { field: 'facebook_app_secret', label: 'Facebook App Secret', placeholder: 'Paste the Facebook App secret', helper: 'Keep this value private.', isSecret: true },
  { field: 'instagram_api', label: 'Instagram Access Token', placeholder: 'Paste the Instagram Basic Display access token' },
  { field: 'twitter_api', label: 'X (Twitter) API Key', placeholder: 'Paste the X Developer API key' },
  { field: 'twitter_api_secret', label: 'X (Twitter) API Secret', placeholder: 'Paste the X Developer API secret', isSecret: true },
  { field: 'linkedin_api', label: 'LinkedIn Client ID', placeholder: 'Paste the LinkedIn Marketing API client ID' },
  { field: 'linkedin_api_secret', label: 'LinkedIn Client Secret', placeholder: 'Paste the LinkedIn Marketing API client secret', isSecret: true },
  { field: 'youtube_api', label: 'YouTube API Key', placeholder: 'Paste the YouTube Data API key' }
];


const siteId = computed(() => {
  const routeId = route.params.id;
  const normalizedRouteId = Array.isArray(routeId) ? routeId[0] : routeId;
  return props.site.site_id ?? normalizedRouteId ?? '';
});

watchEffect(() => {
  const site = props.site;
  if (!site) {
    return;
  }

  const socialSettings = site.socialSettings as Record<string, any>;
  if (socialSettings) {
    socialApiFields.forEach(({ field }) => {
      if (typeof socialSettings[field] === 'undefined' || socialSettings[field] === null) {
        socialSettings[field] = '';
      }
    });
  }
  
});

const getFieldErrors = (fieldPath: string): string[] => {
  const createErrors = props.fb?.errors?.['site.create'];
  const updateKey = siteId.value ? `site.update.${siteId.value}` : '';
  const updateErrors = updateKey ? props.fb?.errors?.[updateKey] : null;
  const raw = updateErrors?.[fieldPath] ?? createErrors?.[fieldPath];

  if (!raw) {
    return [];
  }

  return Array.isArray(raw) ? raw : [raw];
};

const hasErrors = (fieldPath: string): boolean => getFieldErrors(fieldPath).length > 0;
</script>
<template>
    <div class="flex flex-col gap-10">
        <div class="loading-overlay" v-if="(siteId && props.fb?.loading?.['site.edit.' + siteId]) || props.fb?.loading?.['site.create']">
            <div class="flex justify-center items-center h-full spinner">
                <i class="pi pi-spin pi-spinner" style="font-size: 2rem;"></i>
                <p class="mt-2">Loading site data. Please wait.</p>
            </div>
        </div>

        <section class="space-y-6">
            <div>
                <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Social Media API</h3>
                
            </div>

            <div class="space-y-4">
                <div
                    v-for="field in socialApiFields"
                    :key="field.field"
                    class="grid grid-cols-12 gap-2"
                >
                    <label class="flex flex-col col-span-12 mb-2 md:col-span-4 lg:col-span-3 md:mb-0 text-lg">
                        <span>{{ field.label }}</span>
                        <small v-if="field.helper" class="mt-1 text-sm text-gray-500">
                            {{ field.helper }}
                        </small>
                    </label>
                    <div class="col-span-12 md:col-span-8 lg:col-span-9 space-y-2">
                        <InputText
                            v-model="site.socialSettings[field.field]"
                            class="w-full text-lg"
                            :type="field.isSecret ? 'password' : 'text'"
                            :placeholder="field.placeholder"
                            autocomplete="off"
                            :class="{'p-invalid': hasErrors('socialSettings.' + field.field)}"
                        />
                        <Message
                            v-if="hasErrors('socialSettings.' + field.field)"
                            severity="error"
                            size="small"
                            variant="title"
                        >
                            <span
                                v-for="(error, index) in getFieldErrors('socialSettings.' + field.field)"
                                :key="field.field + '-' + index"
                                class="flex flex-col"
                            >
                                {{ error }}
                            </span>
                        </Message>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>