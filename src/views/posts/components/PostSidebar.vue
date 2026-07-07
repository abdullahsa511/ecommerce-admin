<script setup lang="ts">
import { resolveMediaImage, hasMediaImage } from '@/utils/mediaUrl';
import { ref, onMounted, computed } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useMediaStore } from '@/stores/media';
import { SidebarMedia } from '@/models/Product.ts';
import { usePostStore } from '@/stores/post';
import { useListStore } from '@/stores/list';
import { storeToRefs } from 'pinia';
import WayPoint from '@/views/wayPoint/WayPoint.vue';

const toast = useToast();
const mediaStore = useMediaStore();
const mediaFb = mediaStore.fb;
const postStore = usePostStore();
const { fb, postStatuses, post } = storeToRefs(postStore);
const listStore = useListStore();
const { fb: sites } = storeToRefs(listStore);

const featuredMediaExpanded = ref(true);
const bannerMediaExpanded = ref(true);
const featuredThumbnailExpanded = ref(true);

const postOptionsExpanded = ref(true);
const sitesExpanded = ref(true);
const templateExpanded = ref(true);

const wayPointSuggestions = ref<any[]>([]);

const formData = ref({
    status: 'enabled',
    site: 'default',
    template: '-- Default template --',
    is_featured: false
});


const visible = ref(false);

const bannerWayPointsData = computed(() => {
    return post.value?.banner_way_points ? post.value?.banner_way_points : [];
});

const featuredToggle = computed({
    get: () => post.value?.is_featured,
    set: (value: boolean) => {
        (post.value as any).is_featured = value ? 1 : 0;
    }
});

onMounted(() => {
    setTimeout(() => {
        // console.log(post.value);
    }, 1000);
    if (!post.value.status_id) {
        post.value.status_id = 1;
    }

    if (!postStatuses.value.length) {
        postStore.getPostStatuses();
    }
    if (!sites.value.length) {
        listStore.fetchSites();
    }
});

const toggleFeaturedMedia = () => {
    featuredMediaExpanded.value = !featuredMediaExpanded.value;
};

const toggleFeaturedThumbnail = () => {
    featuredThumbnailExpanded.value = !featuredThumbnailExpanded.value;
};

const toggleBannerMedia = () => {
    bannerMediaExpanded.value = !bannerMediaExpanded.value;
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
        const response: any = await postStore.uploadFiles(event.files, property, post.value.post_id);
        console.log(response);
    } catch (error) {
        console.error('Error uploading site logo:', error);
    }
}

const deleteSidebarMediaImage = async (file: any, property: SidebarMedia) => {
    try {
        await postStore.deletePostImageByProperty(post.value.post_id, property);
        // post.value.image = new FileModel({});
        (post.value as any)[property] = [];
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

const updateWayPoints = async (wayPoints: any) => {
    // console.log('updateWayPoints sidebar', wayPoints);

    let response: any = await postStore.updatePostWayPoints(post.value.post_id, wayPoints);
    if (response) {
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Way Points saved successfully',
            life: 3000
        });
    } else {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save way points: ' + (response?.message || ''), life: 5000 });
    }
};


// WAY POINT SUGGESTIONS
const searchWayPointSuggestions = async (query: any) => {
    // dummy data for suggestions
    // const suggestions = dummyData.value.filter(item => item.label.toLowerCase().includes(query));
    const suggestions: any = await postStore.getWayPointSuggestions(query);
    wayPointSuggestions.value = suggestions;
};


const removeWayPoint = async (pointId: any) => {
    let response: any = await postStore.removePostWayPoint(post.value.post_id, pointId);

    if (response) {
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Way Point removed successfully',
            life: 3000
        });
    } else {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to remove way point: ' + (response?.message || ''), life: 5000 });
    }
    console.log('response', response);
};

</script>

<template>
    <div class="sm:w-full md:w-3/5 space-y-4">

        <div class="bg-white rounded-lg shadow-sm flex items-center gap-2 sm:px-6 py-4 ">
            <label class="block text-left text-lg text-primary">Featured</label>
            <ToggleSwitch v-model="featuredToggle" />
        </div>



        <!-- banner Media Section -->
        <div class="bg-white rounded-lg shadow-sm">
            <button @click="toggleBannerMedia"
                class="w-full px-6 py-4 text-left text-lg flex justify-between items-center text-primary">
                Banner Media
                <i :class="['pi', bannerMediaExpanded ? 'pi-chevron-up' : 'pi-chevron-down']"></i>
            </button>

            <div v-if="bannerMediaExpanded" class="p-6 border-t banner-media-container">
                <!-- Image Preview -->
                <UploadFileFeature v-model:uploadedFilesData="post.image_banner" :fb="mediaFb"
                    :property="'image_banner'" @upload="uploadSidebarMediaImage($event, 'image_banner')"
                    @removeUploadedFile="deleteSidebarMediaImage($event, 'image_banner')" />
                <div class="way-points-button">
                    <Button v-if="post.image_banner.length > 0" label="Setup Way-Points" @click="visible = true" />
                </div>
                <Divider />
            </div>
        </div>
        <!-- Featured Media Section -->
        <div class="bg-white rounded-lg shadow-sm">
            <button @click="toggleFeaturedMedia"
                class="w-full px-6 py-4 text-left text-lg flex justify-between items-center text-primary">
                Featured Media
                <i :class="['pi', featuredMediaExpanded ? 'pi-chevron-up' : 'pi-chevron-down']"></i>
            </button>

            <div v-if="featuredMediaExpanded" class="p-6 border-t">
                <!-- Image Preview -->
                <UploadFileFeature v-model:uploadedFilesData="post.feature_image" :fb="mediaFb"
                    :property="'feature_image'" @upload="uploadSidebarMediaImage($event, 'feature_image')"
                    @removeUploadedFile="deleteSidebarMediaImage($event, 'feature_image')" />

                <Divider />
            </div>
        </div>
        <!-- Featured Thumbnail Section -->
        <div class="bg-white rounded-lg shadow-sm">
            <button @click="toggleFeaturedThumbnail"
                class="w-full px-6 py-4 text-left text-lg flex justify-between items-center text-primary">
                Featured Thumbnail
                <i :class="['pi', featuredThumbnailExpanded ? 'pi-chevron-up' : 'pi-chevron-down']"></i>
            </button>

            <div v-if="featuredThumbnailExpanded" class="p-6 border-t">
                <!-- Image Preview -->
                <UploadFileFeature v-model:uploadedFilesData="post.feature_image_thumb" :fb="mediaFb"
                    :property="'feature_image_thumb'" @upload="uploadSidebarMediaImage($event, 'feature_image_thumb')"
                    @removeUploadedFile="deleteSidebarMediaImage($event, 'feature_image_thumb')" />
                <Divider />
            </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm">
            <div class="p-6 border-t flex">
                <!-- Post Options Section -->
                <div class="space-y-6 w-full">
                    <button @click="togglePostOptions"
                        class="w-full text-left text-primary text-lg flex justify-between items-center">
                        Post options
                        <i :class="['pi', postOptionsExpanded ? 'pi-chevron-up' : 'pi-chevron-down']"></i>
                    </button>
                    <div v-if="postOptionsExpanded" class="space-y-6">
                        <!-- Status -->
                        <div class="form-group flex items-center gap-5">
                            <label class="block text-gray-700 mb-2">Status</label>
                            <Select v-model="post.status_id" :options="postStatuses" optionLabel="name"
                                optionValue="post_status_id" placeholder="Select status" class="w-full" filter />
                        </div>
                    </div>
                </div>
            </div>

        </div>

        <!-- Sites Section -->
        <div class="bg-white rounded-lg shadow-sm" hidden>
            <button @click="toggleSites"
                class="w-full px-6 py-4 text-left text-primary text-lg flex justify-between items-center">
                Sites
                <i :class="['pi', sitesExpanded ? 'pi-chevron-up' : 'pi-chevron-down']"></i>
            </button>

            <div v-if="sitesExpanded" class="p-6 border-t flex flex-wrap">
                <template v-for="(site, index) in sites" :key="index">
                    <div style="width: 50%;" class="py-3">
                        <RadioButton v-model="post.site_id" :value="site.site_id" class="scale-110" />
                        <label class="ml-2">{{ site.name }}</label>
                    </div>
                </template>
            </div>
        </div>

        <!-- Template Section -->
        <div class="bg-white rounded-lg shadow-sm" hidden>
            <button @click="toggleTemplate"
                class="w-full px-6 py-4 text-left text-primary text-lg flex justify-between items-center">
                Template
                <i :class="['pi', templateExpanded ? 'pi-chevron-up' : 'pi-chevron-down']"></i>
            </button>

            <div v-if="templateExpanded" class="p-6 border-t">
                <Select v-model="formData.template" :options="['-- Default template --']" class="w-full" />
            </div>
        </div>

        <Dialog v-model:visible="visible" modal header="Setup Way-Points" maximizable :maximized="true"
            :style="{ width: '100vw', maxHeight: '100%', height: '100%' }">
            <div class="body-container">
                <WayPoint :wayPointSuggestions="wayPointSuggestions" :imageSrc="resolveMediaImage(post.image_banner)"
                    :wayPoints="bannerWayPointsData" :modelId="post.post_id" :fb="fb"
                    @update:wayPoints="updateWayPoints" @search:way-points-suggestions="searchWayPointSuggestions" />
            </div>
        </Dialog>
    </div>

</template>
<style scoped>
/* ======= way points button css =======  */
.banner-media-container {
    position: relative;
}

.way-points-button {
    position: absolute;
    bottom: 55px;
    left: 20px;
}

.way-points-button>button {
    margin-left: 0px;
    margin-bottom: 10px;
    font-size: 0.85rem;
    padding: 2px 9px;
    border-radius: 8px;
    font-weight: 500;
}

@media screen and (max-width: 768px) {
    .way-points-button {
        display: none;
        bottom: 10px;
        left: 20px;
    }

    .banner-media-container {
        padding: 10px;
    }
}

@media screen and (max-width: 1200px) {
    .way-points-button {
        position: absolute;
        bottom: 55px;
        left: 20px;
    }
}
</style>