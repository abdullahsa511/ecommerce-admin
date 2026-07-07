<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useMediaStore } from '@/stores/media';
import { SidebarMedia } from '@/models/Product.ts';
import { Page } from '@/models/Page.ts';
import { FileModel } from '@/models/Media.ts';
import { usePageStore } from '@/stores/page';
import { useListStore } from '@/stores/list';
import { storeToRefs } from 'pinia';

const toast = useToast();
const mediaStore = useMediaStore();
const mediaFb = mediaStore.fb;
const pageStore = usePageStore();
const {fb, pageStatuses} = storeToRefs(pageStore);
const listStore = useListStore();
const {fb: listFb, sites} = storeToRefs(listStore);

const featuredMediaExpanded = ref(true);
const postOptionsExpanded = ref(true);
const sitesExpanded = ref(true);
const templateExpanded = ref(true);

const props = defineProps({
    page: {
        type: Page,
        required: true,
        default: () => new Page()
    }
});

const formData = ref({
    status: 'enabled',
    site: 'default',
    template: '-- Default template --'
});

const statusOptions = [
    { label: 'Enabled', value: 'enabled' },
    { label: 'Disabled', value: 'disabled' }
];

onMounted(() => {
    if(!pageStatuses.value.length) {
        pageStore.getPageStatuses();
    }
    if(!sites.value.length) {
        listStore.fetchSites();
    }
});

const toggleFeaturedMedia = () => {
    featuredMediaExpanded.value = !featuredMediaExpanded.value;
};

const togglePostOptions = () => {
    postOptionsExpanded.value = !postOptionsExpanded.value;
};

const toggleSites = () => {
    sitesExpanded.value = !sitesExpanded.value;
};

const toggleTemplate = () => {
    templateExpanded.value = !templateExpanded.value;
};

const uploadSidebarMediaImage = async (event: any, property: SidebarMedia) => {
    try {
        const response: any = await mediaStore.uploadFiles(event.files, property);
        props.page.image = response.files;
    } catch (error) {
        console.error('Error uploading site logo:', error);
    }
}

const deleteSidebarMediaImage = async (file: any, property: SidebarMedia) => {
  try {
    await mediaStore.deleteImageByFilePath(file.image, property);
    // props.page.image = new FileModel({});
    props.page.image = [];
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
</script>

<template>
    <div class="w-2/5 space-y-4">
        <!-- Featured Media Section -->
        <div class="bg-white rounded-lg shadow-sm">
            <button 
                @click="toggleFeaturedMedia"
                class="w-full px-6 py-4 text-left text-lg flex justify-between items-center text-primary"
            >
                Featured Media
                <i :class="['pi', featuredMediaExpanded ? 'pi-chevron-up' : 'pi-chevron-down']"></i>
            </button>
            
            <div v-if="featuredMediaExpanded" class="p-6 border-t">
                <!-- Image Preview -->
                <UploadFileFeature 
                    v-model:uploadedFilesData="page.image"
                    :fb="mediaFb"
                    :property="'featured_media_image'"
                    @upload="uploadSidebarMediaImage($event, 'featured_media_image')"
                    @removeUploadedFile="deleteSidebarMediaImage($event, 'featured_media_image')"
                />

                <Divider />

                <!-- Post Options Section -->
                <div class="space-y-6">
                    <button 
                        @click="togglePostOptions"
                        class="w-full text-left text-primary text-lg flex justify-between items-center"
                    >
                        Post options
                        <i :class="['pi', postOptionsExpanded ? 'pi-chevron-up' : 'pi-chevron-down']"></i>
                    </button>
                    
                    <div v-if="postOptionsExpanded" class="space-y-6">
                        <!-- Status -->
                        <div class="form-group">
                            <label class="block text-gray-700 mb-2">Status</label>
                            <Select
                                v-model="page.status"
                                :options="pageStatuses"
                                optionLabel="name"
                                optionValue="post_status_id"
                                placeholder="Select status"
                                class="w-full"
                                filter
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Sites Section -->
        <div class="bg-white rounded-lg shadow-sm">
            <button 
                @click="toggleSites"
                class="w-full px-6 py-4 text-left text-primary text-lg flex justify-between items-center"
            >
                Sites
                <i :class="['pi', sitesExpanded ? 'pi-chevron-up' : 'pi-chevron-down']"></i>
            </button>
            
            <div v-if="sitesExpanded" class="p-6 border-t flex flex-wrap">
                <template v-for="(site, index) in sites" :key="index">
                    <div style="width: 50%;" class="py-3">
                        <RadioButton v-model="page.site_id" :value="site.site_id" class="scale-110" />
                        <label class="ml-2">{{ site.name }}</label>
                    </div>
                    
                </template>
            </div>
        </div>

        <!-- Template Section -->
        <div class="bg-white rounded-lg shadow-sm">
            <button 
                @click="toggleTemplate"
                class="w-full px-6 py-4 text-left text-primary text-lg flex justify-between items-center"
            >
                Template
                <i :class="['pi', templateExpanded ? 'pi-chevron-up' : 'pi-chevron-down']"></i>
            </button>
            
            <div v-if="templateExpanded" class="p-6 border-t">
                <Select
                    v-model="formData.template"
                    :options="['-- Default template --']"
                    class="w-full"
                />
            </div>
        </div>
    </div>
</template> 