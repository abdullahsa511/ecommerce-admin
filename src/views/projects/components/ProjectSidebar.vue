<script setup lang="ts">
import { resolveMediaImage, hasMediaImage } from '@/utils/mediaUrl';
import { ref, onMounted, computed } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useMediaStore } from '@/stores/media';
import { FileModel } from '@/models/Media.ts';
import { useProjectStore } from '@/stores/project';
import { storeToRefs } from 'pinia';
import { useListStore } from "@/stores/list";
import WayPoint from '@/views/wayPoint/WayPoint.vue';

const toast = useToast();
const mediaStore = useMediaStore();
const mediaFb = mediaStore.fb;
const projectStore = useProjectStore();
const { projectStatuses, project, fb } = storeToRefs(projectStore);
const listStore = useListStore();
const { fb: sites } = storeToRefs(listStore);
const { isAddMode } = defineProps<{ isAddMode: boolean }>();
const bannerMediaExpanded = ref(true);
const thumbnailMediaExpanded = ref(true);
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
    const raw = project.value?.banner_way_points;
    if (!raw) return [];
    // If already an array, return as-is
    if (Array.isArray(raw)) return raw;
    // If it's an object that contains the array under `banner_way_points`, unwrap it
    if (raw && typeof raw === 'object' && Array.isArray((raw as any).banner_way_points)) {
        return (raw as any).banner_way_points;
    }
    // If it's an object with numeric keys or nested arrays, try to flatten values into an array
    if (raw && typeof raw === 'object') {
        const flattened = Object.values(raw).flat().filter((v: any) => v != null);
        if (flattened.length) return flattened;
    }
    return [];
});


const featuredToggleProject = computed({
    get: () => !!project.value?.is_featured,
    set: (value: boolean) => {
        (project.value as any).is_featured = value ? 1 : 0;
    }
});


onMounted(() => {
    if (!projectStatuses.value.length) {
        projectStore.getProjectStatuses();
    }
    if (!sites.value.length) {
        listStore.fetchSites();
    }
});

const toggleBannerdMedia = () => {
    bannerMediaExpanded.value = !bannerMediaExpanded.value;
};
const toggleThumbnailMedia = () => {
    thumbnailMediaExpanded.value = !thumbnailMediaExpanded.value;
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

const uploadSidebarMediaImage = async (event: any, property: string) => {
    try {
        const response: any = await projectStore.uploadFiles(event.files, property, project.value.project_id);
        project.value[property] = response.files.map((file: any) => new FileModel(file));
    } catch (error) {
        console.error('Error uploading site logo:', error);
    }
}

const deleteSidebarMediaImage = async (file: any, property: string) => {
    try {
        await projectStore.deleteImageByFilePath(file.image, property, project.value.project_id);
        project.value[property as any] = [];
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

    let response: any = await projectStore.updateProjectWayPoints(project.value.project_id, wayPoints);
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
    const suggestions: any = await projectStore.getWayPointSuggestions(query);
    // wayPointSuggestions.value = suggestions as unknown as any[];
    wayPointSuggestions.value = suggestions;
};

const removeWayPoint = async (pointId: any) => {

    let response: any = await projectStore.removeProjectWayPoint(project.value.project_id, pointId);
    // bannerWayPointsData.value = bannerWayPointsData.value.filter((point: any) => point.id !== pointId);
    // bannerWayPointsData.value = response as any;
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
    <div class="sm:w-full md:w-2/5 space-y-4">


        <div class="bg-white rounded-lg shadow-sm flex items-center gap-2 sm:px-6 py-4 ">
            <label class="block text-left text-lg text-primary">Featured</label>
            <ToggleSwitch v-model="featuredToggleProject" />
        </div>


        <!-- Featured Media Section -->
        <div class="bg-white rounded-lg shadow-sm">
            <button @click="toggleBannerdMedia"
                class="w-full px-6 py-4 text-left text-lg flex justify-between items-center text-primary"
                v-if="!isAddMode">
                Banner Image
                <i :class="['pi', bannerMediaExpanded ? 'pi-chevron-up' : 'pi-chevron-down']"></i>
            </button>
            <div v-if="bannerMediaExpanded" :class="!isAddMode ? '' : 'p-6 border-t'" class="banner-media-container">
                <UploadFileFeature v-if="!isAddMode" v-model:uploadedFilesData="project.image" :fb="mediaFb"
                    :property="'image'" @upload="uploadSidebarMediaImage($event, 'image')"
                    @removeUploadedFile="deleteSidebarMediaImage($event, 'image')" />

                    <div class="way-points-button">
                        <Button v-if="project.image.length > 0" label="Setup Way-Points" @click="visible = true"/>
                    </div>

                <Divider v-if="!isAddMode" />
            </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm">
            <button @click="toggleThumbnailMedia"
                class="w-full px-6 py-4 text-left text-lg flex justify-between items-center text-primary"
                v-if="!isAddMode">
                Image Thumbnail
                <i :class="['pi', thumbnailMediaExpanded ? 'pi-chevron-up' : 'pi-chevron-down']"></i>
            </button>
            <div v-if="thumbnailMediaExpanded" class="!isAddMode ? '' : 'p-6 border-t'">
                <UploadFileFeature v-if="!isAddMode" v-model:uploadedFilesData="project.image_thumb" :fb="mediaFb"
                    :property="'image_thumb'" @upload="uploadSidebarMediaImage($event, 'image_thumb')"
                    @removeUploadedFile="deleteSidebarMediaImage($event, 'image_thumb')" />

                <Divider v-if="!isAddMode" />
            </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm">
            <button @click="togglePostOptions"
                class="w-full px-6 py-4 text-left text-lg flex justify-between items-center text-primary"
                v-if="!isAddMode">
                Project options
                <i :class="['pi', postOptionsExpanded ? 'pi-chevron-up' : 'pi-chevron-down']"></i>
            </button>
            <div v-if="postOptionsExpanded" class="p-6 border-t">
                <!-- Status -->
                <div class="form-group">
                    <label class="block text-gray-700 mb-2">Status</label>
                    <Select v-model="project.status_id" :options="projectStatuses" optionLabel="name"
                        optionValue="project_status_id" placeholder="Select status" class="w-full" filter />
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

            <div v-if="sitesExpanded" class="p-6 border-t">
                <template v-for="(site, index) in sites" :key="index">
                    <RadioButton v-model="project.site_id" :value="site.site_id" class="scale-110" />
                    <label class="ml-2">{{ site.name }}</label>
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

                <WayPoint 
                    :wayPointSuggestions="wayPointSuggestions"
                    :imageSrc="resolveMediaImage(project.image)"
                    :wayPoints="bannerWayPointsData"
                    :modelId="project.project_id"
                    :fb="fb"
                    @update:wayPoints="updateWayPoints"
                    @remove:way-point="removeWayPoint"
                    @search:way-points-suggestions="searchWayPointSuggestions"                    
                />

            </div>
        </Dialog>


    </div>

    
</template>

<style scoped>

.banner-media-container {
    position: relative;
}

.way-points-button {
    position: absolute;
    bottom: 20px;
    left: 40px;
}
.way-points-button > button {
    margin-left: 30px;
    margin-bottom: 8px;
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

</style>