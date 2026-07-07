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

interface OptionItem {
  label: string;
  value: string;
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

const themePresetOptions: OptionItem[] = [
  { label: 'System (auto)', value: 'system' },
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
  { label: 'High Contrast', value: 'contrast' }
];

const layoutStyleOptions: OptionItem[] = [
  { label: 'Full Width', value: 'full-width' },
  { label: 'Boxed', value: 'boxed' },
  { label: 'Framed', value: 'framed' }
];

const fontFamilyOptions: OptionItem[] = [
  { label: 'Inter', value: 'inter' },
  { label: 'Roboto', value: 'roboto' },
  { label: 'Poppins', value: 'poppins' },
  { label: 'Open Sans', value: 'open-sans' },
  { label: 'Lato', value: 'lato' }
];

const fontScaleOptions: OptionItem[] = [
  { label: 'Compact', value: 'compact' },
  { label: 'Normal', value: 'medium' },
  { label: 'Spacious', value: 'large' }
];

const defaultThemeSettings: Record<string, any> = {
  theme_variant: 'system',
  layout_style: 'full-width',
  primary_color: '#2563eb',
  secondary_color: '#9333ea',
  accent_color: '#f97316',
  font_family: 'inter',
  font_size_scale: 'medium',
  use_rounded_components: true,
  enable_micro_interactions: true,
  enable_card_shadows: true,
  show_back_to_top: true
};

const defaultIntegrationSettings: Record<string, any> = {
  enable_social_login: false,
  enable_social_sharing: true,
  auto_sync_social_data: false,
  social_callback_urls: ''
};

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

  let themeSettings = site.siteSettings?.settings as Record<string, any> | undefined;
  if (!themeSettings || typeof themeSettings !== 'object' || Array.isArray(themeSettings)) {
    themeSettings = {};
    if (site.siteSettings) {
      site.siteSettings.settings = themeSettings;
    }
  }
  if (!themeSettings) {
    return;
  }

  Object.entries(defaultIntegrationSettings).forEach(([key, value]) => {
    if (typeof themeSettings[key] === 'undefined' || themeSettings[key] === null) {
      themeSettings[key] = value;
    }
  });

  Object.entries(defaultThemeSettings).forEach(([key, value]) => {
    if (typeof themeSettings[key] === 'undefined' || themeSettings[key] === null) {
      themeSettings[key] = value;
    }
  });
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
                <p class="mt-2 text-sm text-gray-500">
                    Configure the credentials used for social integrations. Keys are stored securely and encrypted at rest.
                </p>
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

        <Divider />

        <section class="space-y-6">
            <div>
                <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Integration Preferences</h3>
                <p class="mt-2 text-sm text-gray-500">
                    Control how social integrations behave across the site. These settings apply globally.
                </p>
            </div>

            <div class="space-y-4">
                <div class="grid grid-cols-12 gap-2">
                    <label class="flex flex-col col-span-12 mb-2 md:col-span-4 lg:col-span-3 md:mb-0 text-lg">
                        Enable social login
                        <small class="mt-1 text-sm text-gray-500">
                            Allow visitors to authenticate with Facebook, X (Twitter), Google and more.
                        </small>
                    </label>
                    <div class="col-span-12 md:col-span-8 lg:col-span-9">
                        <div class="flex items-center gap-3">
                            <ToggleSwitch v-model="site.siteSettings.settings.enable_social_login" />
                            <span class="text-lg">Offer single sign-on during checkout and account creation.</span>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label class="flex flex-col col-span-12 mb-2 md:col-span-4 lg:col-span-3 md:mb-0 text-lg">
                        Enable social sharing widgets
                        <small class="mt-1 text-sm text-gray-500">
                            Show share buttons on posts, products and landing pages.
                        </small>
                    </label>
                    <div class="col-span-12 md:col-span-8 lg:col-span-9">
                        <div class="flex items-center gap-3">
                            <ToggleSwitch v-model="site.siteSettings.settings.enable_social_sharing" />
                            <span class="text-lg">Display floating share controls on all published content.</span>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label class="flex flex-col col-span-12 mb-2 md:col-span-4 lg:col-span-3 md:mb-0 text-lg">
                        Auto sync social metrics
                        <small class="mt-1 text-sm text-gray-500">
                            Pull share counts, reactions and comments every night.
                        </small>
                    </label>
                    <div class="col-span-12 md:col-span-8 lg:col-span-9">
                        <div class="flex items-center gap-3">
                            <ToggleSwitch v-model="site.siteSettings.settings.auto_sync_social_data" />
                            <span class="text-lg">Refresh analytics in the background at 02:00 AM.</span>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label class="flex flex-col col-span-12 mb-2 md:col-span-4 lg:col-span-3 md:mb-0 text-lg">
                        Allowed callback URLs
                        <small class="mt-1 text-sm text-gray-500">
                            Comma-separated list of redirect URIs registered with each provider.
                        </small>
                    </label>
                    <div class="col-span-12 md:col-span-8 lg:col-span-9 space-y-2">
                        <Textarea
                            v-model="site.siteSettings.settings.social_callback_urls"
                            rows="3"
                            class="w-full text-lg"
                            :autoResize="true"
                            placeholder="https://app.example.com/auth/callback/facebook, https://app.example.com/auth/callback/twitter"
                            :class="{'p-invalid': hasErrors('siteSettings.settings.social_callback_urls')}"
                        />
                        <Message
                            v-if="hasErrors('siteSettings.settings.social_callback_urls')"
                            severity="error"
                            size="small"
                            variant="title"
                        >
                            <span
                                v-for="(error, index) in getFieldErrors('siteSettings.settings.social_callback_urls')"
                                :key="'callback-' + index"
                                class="flex flex-col"
                            >
                                {{ error }}
                            </span>
                        </Message>
                    </div>
                </div>
            </div>
        </section>

        <Divider />

        <section class="space-y-6">
            <div>
                <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Theme Settings</h3>
                <p class="mt-2 text-sm text-gray-500">
                    Tune how the storefront looks and feels. These options supplement the base theme configured in the General tab.
                </p>
            </div>

            <div class="space-y-4">
                <div class="grid grid-cols-12 gap-2">
                    <label class="flex items-center col-span-12 mb-2 md:col-span-4 lg:col-span-3 md:mb-0 text-lg">
                        Theme preset
                    </label>
                    <div class="col-span-12 md:col-span-8 lg:col-span-9">
                        <Select
                            v-model="site.siteSettings.settings.theme_variant"
                            :options="themePresetOptions"
                            optionLabel="label"
                            optionValue="value"
                            placeholder="Select a preset"
                            class="w-full text-lg"
                        />
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label class="flex items-center col-span-12 mb-2 md:col-span-4 lg:col-span-3 md:mb-0 text-lg">
                        Layout style
                    </label>
                    <div class="col-span-12 md:col-span-8 lg:col-span-9">
                        <Select
                            v-model="site.siteSettings.settings.layout_style"
                            :options="layoutStyleOptions"
                            optionLabel="label"
                            optionValue="value"
                            placeholder="Select a layout"
                            class="w-full text-lg"
                        />
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label class="flex flex-col col-span-12 mb-2 md:col-span-4 lg:col-span-3 md:mb-0 text-lg">
                        Primary brand color
                        <small class="mt-1 text-sm text-gray-500">
                            Used for buttons, highlights and interactive elements.
                        </small>
                    </label>
                    <div class="col-span-12 md:col-span-8 lg:col-span-9">
                        <InputText
                            v-model="site.siteSettings.settings.primary_color"
                            class="w-full text-lg"
                            placeholder="#2563EB"
                        />
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label class="flex flex-col col-span-12 mb-2 md:col-span-4 lg:col-span-3 md:mb-0 text-lg">
                        Secondary color
                        <small class="mt-1 text-sm text-gray-500">
                            Applied to backgrounds, badges and subtle accents.
                        </small>
                    </label>
                    <div class="col-span-12 md:col-span-8 lg:col-span-9">
                        <InputText
                            v-model="site.siteSettings.settings.secondary_color"
                            class="w-full text-lg"
                            placeholder="#9333EA"
                        />
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label class="flex flex-col col-span-12 mb-2 md:col-span-4 lg:col-span-3 md:mb-0 text-lg">
                        Accent color
                        <small class="mt-1 text-sm text-gray-500">
                            Use for callouts and promotional sections.
                        </small>
                    </label>
                    <div class="col-span-12 md:col-span-8 lg:col-span-9">
                        <InputText
                            v-model="site.siteSettings.settings.accent_color"
                            class="w-full text-lg"
                            placeholder="#F97316"
                        />
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label class="flex items-center col-span-12 mb-2 md:col-span-4 lg:col-span-3 md:mb-0 text-lg">
                        Font family
                    </label>
                    <div class="col-span-12 md:col-span-8 lg:col-span-9">
                        <Select
                            v-model="site.siteSettings.settings.font_family"
                            :options="fontFamilyOptions"
                            optionLabel="label"
                            optionValue="value"
                            placeholder="Select a font"
                            class="w-full text-lg"
                        />
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label class="flex items-center col-span-12 mb-2 md:col-span-4 lg:col-span-3 md:mb-0 text-lg">
                        Font scale
                    </label>
                    <div class="col-span-12 md:col-span-8 lg:col-span-9">
                        <Select
                            v-model="site.siteSettings.settings.font_size_scale"
                            :options="fontScaleOptions"
                            optionLabel="label"
                            optionValue="value"
                            placeholder="Select spacing"
                            class="w-full text-lg"
                        />
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label class="flex items-center col-span-12 mb-2 md:col-span-4 lg:col-span-3 md:mb-0 text-lg">
                        Rounded components
                    </label>
                    <div class="col-span-12 md:col-span-8 lg:col-span-9">
                        <div class="flex items-center gap-3">
                            <ToggleSwitch v-model="site.siteSettings.settings.use_rounded_components" />
                            <span class="text-lg">Apply medium rounding to cards, modals and inputs.</span>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label class="flex items-center col-span-12 mb-2 md:col-span-4 lg:col-span-3 md:mb-0 text-lg">
                        Micro interactions
                    </label>
                    <div class="col-span-12 md:col-span-8 lg:col-span-9">
                        <div class="flex items-center gap-3">
                            <ToggleSwitch v-model="site.siteSettings.settings.enable_micro_interactions" />
                            <span class="text-lg">Enable subtle transitions on hover and focus.</span>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label class="flex items-center col-span-12 mb-2 md:col-span-4 lg:col-span-3 md:mb-0 text-lg">
                        Card shadows
                    </label>
                    <div class="col-span-12 md:col-span-8 lg:col-span-9">
                        <div class="flex items-center gap-3">
                            <ToggleSwitch v-model="site.siteSettings.settings.enable_card_shadows" />
                            <span class="text-lg">Adds layered depth to dashboard tiles and cards.</span>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label class="flex items-center col-span-12 mb-2 md:col-span-4 lg:col-span-3 md:mb-0 text-lg">
                        Back to top button
                    </label>
                    <div class="col-span-12 md:col-span-8 lg:col-span-9">
                        <div class="flex items-center gap-3">
                            <ToggleSwitch v-model="site.siteSettings.settings.show_back_to_top" />
                            <span class="text-lg">Display a floating button on long pages.</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>