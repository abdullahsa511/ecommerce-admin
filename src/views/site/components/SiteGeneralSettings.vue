<script setup lang="ts">
import { useToast } from 'primevue/usetoast';
import Site from '@/models/Site.ts';
import { useMediaStore } from '@/stores/media';
import { SiteLogoSettingsType, SiteBannerSettingsType } from '@/models/Site.ts';
import { computed, onMounted, PropType } from 'vue';
import { useRoute } from 'vue-router';

const toast = useToast();
const mediaStore = useMediaStore();
const mediaFb = mediaStore.fb;

const route = useRoute();

const emit = defineEmits(['update:site', 'saved']);

// Use defineProps directly
const props = defineProps({
  site: {
    type: Site,
    required: true,
    default: () => new Site()
  },
  fb: {
    type: Object as PropType<any>,
    required: true,
    default: () => ({})
  }

});


const themeOptions = [
    { label: 'Landing', value: 'landing' },
    { label: 'Blog', value: 'blog' },
    { label: 'Shop', value: 'shop' }
];

const templateOptions = [
    { label: '-- Default template --', value: 'default' }
];

const updateSite = (prop: string, value: any) => {
    emit('update:site', prop, value);
}

const uploadSiteLogo = async (event: any, siteId: any, property: SiteLogoSettingsType) => {
   try {
    const response: any = await mediaStore.uploadFiles(event.files, siteId, property);
    props.site.siteSettings.site_logo_settings[property] = response.files;
   } catch (error) {
    console.error('Error uploading site logo:', error);
   }
}


const deleteImage = async (file: any, property: SiteLogoSettingsType) => {
  try {
    await mediaStore.deleteImageByFilePath(file.image, property);
    props.site.siteSettings.site_logo_settings[property] = [];
    toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Image deleted successfully',
        life: 3000
    });
  } catch (error) {
    console.error('Error deleting site logo:', error);
  }
};

const uploadBanner = async (event: any, siteId: any, property: SiteBannerSettingsType) => {
    try {
        const response: any = await mediaStore.uploadFiles(event.files, siteId, property);
        props.site.siteSettings.site_banner_settings[property] = response.files;
    } catch (error) {
        console.error('Error uploading site logo:', error);
    }
}

const deleteBannerImage = async (file: any, property: SiteBannerSettingsType) => {
  try {
    await mediaStore.deleteImageByFilePath(file.image, property);
    props.site.siteSettings.site_banner_settings[property] = [];
    toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Image deleted successfully',
        life: 3000
    });
  } catch (error) {
    console.error('Error deleting site logo:', error);
  }
};

const siteId = computed(() => {
    const routeId = route.params.id;
    const normalizedRouteId = Array.isArray(routeId) ? routeId[0] : routeId;
    return props.site.site_id ?? normalizedRouteId ?? '';
});

onMounted(() => {
});


</script>
<template>
   
    <!-- General Tab -->
    <div class="flex flex-col gap-6">
        
        <div class="loading-overlay" v-if="siteId && props.fb?.loading?.['site.edit.' + siteId] || props.fb?.loading?.['site.create']">
            <div class="flex justify-center items-center h-full spinner">
                <i class="pi pi-spin pi-spinner" style="font-size: 2rem;"></i>
                <p class="mt-2">Loading site data. Please wait.</p>
            </div>
        </div>

        <!-- Site Name -->
        <div class="grid grid-cols-12 ">
            <label class="flex items-center col-span-12 mb-2 md:col-span-4 lg:col-span-3 md:mb-0 text-lg">Site name</label>
            <div class="col-span-12 md:col-span-8 lg:col-span-9">
                <InputText v-model="site.name" @input="console.log(site)" class="w-full text-lg" 
                :class="{'p-invalid': props.fb?.errors?.['site.update.' + siteId]?.name || props.fb?.errors?.['site.create']?.name}" />
                <Message v-if="props.fb?.errors?.['site.update.' + siteId]?.name || props.fb?.errors?.['site.create']?.name" severity="error" size="small" variant="title">
                    <span v-for="error in props.fb?.errors?.['site.update.' + siteId]?.name || props.fb?.errors?.['site.create']?.name" :key="error" class="flex flex-col">
                        {{ error }}
                    </span>
                </Message>
            </div>
        </div>

        <div class="grid grid-cols-12 ">
            <label class="flex items-center col-span-12 mb-2 md:col-span-4 lg:col-span-3 md:mb-0 text-lg">Site Key</label>
            <div class="col-span-12 md:col-span-8 lg:col-span-9">
                <InputText v-model="site.key" class="w-full text-lg" placeholder="Enter site key"
                :class="{'p-invalid': props.fb?.errors?.['site.update.' + siteId]?.key || props.fb?.errors?.['site.create']?.key}" />
                <Message v-if="props.fb?.errors?.['site.update.' + siteId]?.key || props.fb?.errors?.['site.create']?.key" severity="error" size="small" variant="title">
                    <span v-for="error in props.fb?.errors?.['site.update.' + siteId]?.key || props.fb?.errors?.['site.create']?.key" :key="error" class="flex flex-col">
                        {{ error }}
                    </span>
                </Message>
            </div>
        </div>

        <!-- Site Domain -->
        <div class="grid grid-cols-12 ">
            <label class="flex flex-col col-span-12 mb-2 md:col-span-4 lg:col-span-3 md:mb-0">
                <div class="flex items-center text-lg">
                    Site domain/subdomain
                    <i class="pi pi-info-circle ml-1 text-gray-400" title="Used to match site and generate links" />
                </div>
                <small class="text-gray-500 mt-1">Used to match site and generate links</small>
            </label>
            <div class="col-span-12 md:col-span-8 lg:col-span-9">
                <InputText v-model="site.host"  class="w-full text-lg" placeholder="Enter site domain/subdomain"
                :class="{'p-invalid': props.fb?.errors?.['site.update.' + siteId]?.host || props.fb?.errors?.['site.create']?.host}" />
                <Message v-if="props.fb?.errors?.['site.update.' + siteId]?.host || props.fb?.errors?.['site.create']?.host" severity="error" size="small" variant="title">
                    <span v-for="error in props.fb?.errors?.['site.update.' + siteId]?.host || props.fb?.errors?.['site.create']?.host" :key="error" class="flex flex-col">
                        {{ error }}
                    </span>
                </Message>
            </div>
        </div>

        <!-- Theme -->
        <div class="grid grid-cols-12 ">
            <label class="flex items-center col-span-12 mb-2 md:col-span-4 lg:col-span-3 md:mb-0 text-lg">Theme</label>
            <div class="col-span-12 md:col-span-8 lg:col-span-9">
                <Select 
                    v-model="site.theme" 
                    :options="themeOptions" 
                    optionLabel="label" 
                    optionValue="value"
                    placeholder="Select a Theme" 
                    class="w-full text-lg" 
                    :class="{'p-invalid': props.fb?.errors?.['site.update.' + siteId]?.theme || props.fb?.errors?.['site.create']?.theme}"
                />
                <Message v-if="props.fb?.errors?.['site.update.' + siteId]?.theme || props.fb?.errors?.['site.create']?.theme" severity="error" size="small" variant="title">
                    <span v-for="error in props.fb?.errors?.['site.update.' + siteId]?.theme || props.fb?.errors?.['site.create']?.theme" :key="error" class="flex flex-col">
                        {{ error }}
                    </span>
                </Message>
            </div>
        </div>

        <!-- Home Template -->
        <div class="grid grid-cols-12 ">
            <label class="flex items-center col-span-12 mb-2 md:col-span-4 lg:col-span-3 md:mb-0 text-lg">Home template</label>
            <div class="col-span-12 md:col-span-8 lg:col-span-9">
                <Select 
                    v-model="site.template" 
                    :options="templateOptions" 
                    optionLabel="label" 
                    optionValue="value"
                    placeholder="Select a Template" 
                    class="w-full text-lg" 
                    :class="{'p-invalid': props.fb?.errors?.['site.update.' + siteId]?.template || props.fb?.errors?.['site.create']?.template}"
                />
                <Message v-if="props.fb?.errors?.['site.update.' + siteId]?.template || props.fb?.errors?.['site.create']?.template" severity="error" size="small" variant="title">
                    <span v-for="error in props.fb?.errors?.['site.update.' + siteId]?.template || props.fb?.errors?.['site.create']?.template" :key="error" class="flex flex-col">
                        {{ error }}
                    </span>
                </Message>
            </div>
        </div>

         <!-- Description Tab -->
        <div class="space-y-4">
            <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Description</h3>
            <!-- Site title -->
            <div class="grid grid-cols-12 gap-2">
                <label class="flex items-center col-span-12 mb-2 md:col-span-4 lg:col-span-3 md:mb-0 text-lg">Site title</label>
                <div class="col-span-12 md:col-span-8 lg:col-span-9">
                    <InputText v-model="site.descriptionSettings.title" class="w-full text-lg" 
                    :class="{'p-invalid': props.fb?.errors?.['site.update.' + siteId]?.title || props.fb?.errors?.['site.create']?.title}" />
                    <Message v-if="props.fb?.errors?.['site.update.' + siteId]?.title || props.fb?.errors?.['site.create']?.title" severity="error" size="small" variant="title">
                        <span v-for="error in props.fb?.errors?.['site.update.' + siteId]?.title || props.fb?.errors?.['site.create']?.title" :key="error" class="flex flex-col">
                            {{ error }}
                        </span>
                    </Message>
                </div>
            </div>

            <!-- Site description -->
            <div class="grid grid-cols-12 gap-2">
                <label class="flex items-center col-span-12 mb-2 md:col-span-4 lg:col-span-3 md:mb-0 text-lg">Site description</label>
                <div class="col-span-12 md:col-span-8 lg:col-span-9">
                    <InputText v-model="site.descriptionSettings.description" class="w-full text-lg" 
                    :class="{'p-invalid': props.fb?.errors?.['site.update.' + siteId]?.description || props.fb?.errors?.['site.create']?.description}" />
                    <Message v-if="props.fb?.errors?.['site.update.' + siteId]?.description || props.fb?.errors?.['site.create']?.description" severity="error" size="small" variant="title">
                        <span v-for="error in props.fb?.errors?.['site.update.' + siteId]?.description || props.fb?.errors?.['site.create']?.description" :key="error" class="flex flex-col">
                            {{ error }}
                        </span>
                    </Message>
                </div>
            </div>

            <!-- Meta keywords -->
            <div class="grid grid-cols-12 gap-2">
                <label class="flex items-center col-span-12 mb-2 md:col-span-4 lg:col-span-3 md:mb-0 text-lg">Meta keywords</label>
                <div class="col-span-12 md:col-span-8 lg:col-span-9">
                    <InputText v-model="site.descriptionSettings.meta_keywords" class="w-full text-lg" 
                    :class="{'p-invalid': props.fb?.errors?.['site.update.' + siteId]?.meta_keywords || props.fb?.errors?.['site.create']?.meta_keywords}" />
                    <Message v-if="props.fb?.errors?.['site.update.' + siteId]?.meta_keywords || props.fb?.errors?.['site.create']?.meta_keywords" severity="error" size="small" variant="title">
                        <span v-for="error in props.fb?.errors?.['site.update.' + siteId]?.meta_keywords || props.fb?.errors?.['site.create']?.meta_keywords" :key="error" class="flex flex-col">
                            {{ error }}
                        </span>
                    </Message>
                </div>
            </div>

            <!-- Meta description -->
            <div class="grid grid-cols-12 gap-2">
                <label class="flex items-center col-span-12 mb-2 md:col-span-4 lg:col-span-3 md:mb-0 text-lg">Meta description</label>
                <div class="col-span-12 md:col-span-8 lg:col-span-9">
                    <InputText v-model="site.descriptionSettings.meta_description" class="w-full text-lg" 
                    :class="{'p-invalid': props.fb?.errors?.['site.update.' + siteId]?.meta_description || props.fb?.errors?.['site.create']?.meta_description}" />
                    <Message v-if="props.fb?.errors?.['site.update.' + siteId]?.meta_description || props.fb?.errors?.['site.create']?.meta_description" severity="error" size="small" variant="title">
                        <span v-for="error in props.fb?.errors?.['site.update.' + siteId]?.meta_description || props.fb?.errors?.['site.create']?.meta_description" :key="error" class="flex flex-col">
                            {{ error }}
                        </span>
                    </Message>
                </div>
            </div>

            <!-- Phone number -->
            <div class="grid grid-cols-12 gap-2">
                <label class="flex items-center col-span-12 mb-2 md:col-span-4 lg:col-span-3 md:mb-0 text-lg">Phone number</label>
                <div class="col-span-12 md:col-span-8 lg:col-span-9">
                    <InputText v-model="site.descriptionSettings.phone_number" class="w-full text-lg" 
                    :class="{'p-invalid': props.fb?.errors?.['site.update.' + siteId]?.phone_number || props.fb?.errors?.['site.create']?.phone_number}" />
                    <Message v-if="props.fb?.errors?.['site.update.' + siteId]?.phone_number || props.fb?.errors?.['site.create']?.phone_number" severity="error" size="small" variant="title">
                        <span v-for="error in props.fb?.errors?.['site.update.' + siteId]?.phone_number || props.fb?.errors?.['site.create']?.phone_number" :key="error" class="flex flex-col">
                            {{ error }}
                        </span>
                    </Message>
                </div>
            </div>
        </div>

        <!-- Email Section -->
        <div class="space-y-4">
            <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Email</h3>
            <div class="flex flex-col gap-6 pt-2">
                <!-- Administration Email -->
                <div class="grid grid-cols-12 ">
                    <label class="flex items-center col-span-12 mb-2 md:col-span-4 lg:col-span-3 md:mb-0 text-lg">Administration Email</label>
                    <div class="col-span-12 md:col-span-8 lg:col-span-9">
                        <InputText v-model="site.admin_email" class="w-full text-lg" 
                        :class="{'p-invalid': props.fb?.errors?.['site.update.' + siteId]?.admin_email || props.fb?.errors?.['site.create']?.admin_email}" />
                        <Message v-if="props.fb?.errors?.['site.update.' + siteId]?.admin_email || props.fb?.errors?.['site.create']?.admin_email" severity="error" size="small" variant="title">
                            <span v-for="error in props.fb?.errors?.['site.update.' + siteId]?.admin_email || props.fb?.errors?.['site.create']?.admin_email" :key="error" class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>
                </div>

                <!-- Contact Email -->
                <div class="grid grid-cols-12 ">
                    <label class="flex items-center col-span-12 mb-2 md:col-span-4 lg:col-span-3 md:mb-0 text-lg">Contact Email</label>
                    <div class="col-span-12 md:col-span-8 lg:col-span-9">
                        <InputText 
                            v-model="site.contact_email" 
                            class="w-full text-lg"
                            placeholder="Administration Email Address"
                            :class="{'p-invalid': props.fb?.errors?.['site.update.' + siteId]?.contact_email || props.fb?.errors?.['site.create']?.contact_email}"
                        />
                        <Message v-if="props.fb?.errors?.['site.update.' + siteId]?.contact_email || props.fb?.errors?.['site.create']?.contact_email" severity="error" size="small" variant="title">
                            <span v-for="error in props.fb?.errors?.['site.update.' + siteId]?.contact_email || props.fb?.errors?.['site.create']?.contact_email" :key="error" class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>
                </div>
            </div>
        </div>

        <!-- Logo Section -->
        <div class="space-y-4" v-if="siteId">
            <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Logo</h3>
            <div class="grid grid-cols-12">
                <div class="flex items-center col-span-12 mb-2 md:col-span-4 lg:col-span-2 md:mb-0 text-lg">
                    <div class="mb-2 text-lg">Site Logo</div>
                </div>
                <div class="col-span-12 md:col-span-8 lg:col-span-10 flex items-center flex-wrap gap-3">
                    <!-- Fav icon -->
                    
                    <div class="text-center th-site-logo">
                        <div class="mb-2 text-lg">Fav icon</div>
                        <UploadFileTile 
                        v-model:uploadedFilesData="site.siteSettings.site_logo_settings.site_logo_favicon"
                        :fb="mediaFb"
                        :property="'site_logo_favicon'"
                        @upload="uploadSiteLogo($event, siteId, 'site_logo_favicon')"
                        @removeUploadedFile="deleteImage($event, 'site_logo_favicon')"
                        />
                    </div>
    
                    <!-- Site logo -->
                    <div class="text-center th-site-logo">
                        <div class="mb-2 text-lg">Site logo</div>
                        <UploadFileTile 
                            v-model:uploadedFilesData="site.siteSettings.site_logo_settings.site_logo"
                            :fb="mediaFb"
                            :property="'site_logo'"
                            @upload="uploadSiteLogo($event, siteId, 'site_logo')"
                            @removeUploadedFile="deleteImage($event, 'site_logo')"
                        />
                    </div>
    
                    <!-- Logo sticky -->
                    <div class="text-center th-site-logo">
                        <div class="mb-2 text-lg">Logo sticky</div>
                        <UploadFileTile 
                            v-model:uploadedFilesData="site.siteSettings.site_logo_settings.site_logo_sticky"
                            :fb="mediaFb"
                            :property="'site_logo_sticky'"
                            @upload="uploadSiteLogo($event, siteId, 'site_logo_sticky')"
                            @removeUploadedFile="deleteImage($event, 'site_logo_sticky')"
                        />
                    </div>
    
                    <!-- Logo dark -->
                    <div class="text-center th-site-logo">
                        <div class="mb-2 text-lg">Logo dark</div>
                        <UploadFileTile 
                            v-model:uploadedFilesData="site.siteSettings.site_logo_settings.site_logo_dark"
                            :fb="mediaFb"
                            :property="'site_logo_dark'"
                            @upload="uploadSiteLogo($event, siteId, 'site_logo_dark')"
                            @removeUploadedFile="deleteImage($event, 'site_logo_dark')"
                        />
                    </div>
    
                    <!-- Logo dark sticky -->
                    <div class="text-center th-site-logo">
                        <div class="mb-2 text-lg">Logo dark sticky</div>
                        <UploadFileTile 
                            v-model:uploadedFilesData="site.siteSettings.site_logo_settings.site_logo_dark_sticky"
                            :fb="mediaFb"
                            :property="'site_logo_dark_sticky'"
                            @upload="uploadSiteLogo($event, siteId, 'site_logo_dark_sticky')"
                            @removeUploadedFile="deleteImage($event, 'site_logo_dark_sticky')"
                        />
                    </div>
                </div>
            </div>
        </div>

        <!-- Web App Banner -->
        <div class="space-y-4" v-if="siteId">
            <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Banners</h3>
            <div class="grid grid-cols-12 gap-4">
                <div class="pt-5 flex items-center col-span-12 mb-2 md:col-span-4 lg:col-span-3 md:mb-0 text-lg">
                    <div class="mb-2 text-lg">Site banner</div>
                </div>
                <!-- Fav icon -->
                <div class="col-span-12 md:col-span-8 lg:col-span-9 flex items-center flex-wrap gap-4">
                    <div class="text-center">
                        <div class="mb-2 text-lg">Web app install banner</div>
                        <UploadFileTile 
                            v-model:uploadedFilesData="site.siteSettings.site_banner_settings.site_banner_web_app_install"
                            :fb="mediaFb"
                            :property="'site_banner_web_app_install'"
                            @upload="uploadBanner($event, siteId, 'site_banner_web_app_install')"
                            @removeUploadedFile="deleteBannerImage($event, 'site_banner_web_app_install')"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.th-site-logo-title {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-width: 180px;
}
.th-site-logo {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 160px;
    border-radius: 5px;
    padding: 10px;
    flex:1;
}
</style>